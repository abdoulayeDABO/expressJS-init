const tokenGenerator = require('../utils/token');
require('dotenv').config();
const privateKey =  process.env.PRIVATE_KEY;
var jwt = require('jsonwebtoken');
const validator = require('validator');
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const transporter = require('../config/nodemailerConfig');

async function register(req, res, next) {
  try {

    // validate email 
    if(!(validator.isEmail(req.body.email))){
      res.status(400).json({ erreur: 'Adresse e-mail invalide' });
      return;
    };

    // check if given email exist in database
    var user = await User.findOne({
      where: {
        email: req.body.email,
      }
    }); 
    if (user) {
      res.status(400).json({status: "error", message: "Adresse e-mail déjà associée à un compte." });
      return;
    }

    // check passwords matching
    if(!(req.body.password1 == req.body.password2)){
      res.status(400).json({ status: "error", message: "les mots de passe ne correspondent pas." });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password1, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // send the account activation email
    const validate_account_token = tokenGenerator.passwordResetToken()
    await User.update({ validate_account_token: validate_account_token, validate_account_expires: new Date(Date.now() + 3600000) }, {
      where: {
        id: user.id,
      }
    });
  
    const payload = {
      user_id: user.id,
      user_email: user.email,  
      validate_account_token: validate_account_token,   
    };

    const token = jwt.sign(
      payload, 
      privateKey,  
      { expiresIn: '1h'}
    );


    await transporter.sendMail({
      from: 'no-replay@gmail.com', 
      to: req.body.email, 
      subject: "Activation du compte",
      html:
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap" rel="stylesheet">
          <title>Email</title>
      </head>
      <body style="font-family: 'Roboto', sans-serif; background: #fff; padding: 20px; line-height: 24px; font-size: 16px; color: #2d3748; font-weight: normal; margin: 0; box-sizing: border-box;">
      
          <div style="max-width: 500px; margin: auto;">
              <header style="background: #EEF0E5; padding: 20px; text-align: center;">
                  <h1 style="font-size: 22px; margin-bottom: 15px; font-weight: 700;">LOGO</h1>
              </header>
      
              <main style="padding: 25px;">
                  <h1 style="font-size: 22px; margin-bottom: 15px; font-weight: 700;">Bonjour!</h1>
                  <p style="margin-bottom: 15px;">Veuillez apuyer le bouton ci-dessus pour activer votre compte.</p>
                  <a href="http://localhost:3000/users/activate-account/${token}" style="padding: 4px 10px; border-radius: 4px; background-color: #2d3748; text-decoration: none; color: #fff; margin-bottom: 15px; display: inline-block; font-size: 14px; font-weight: normal;">Activer mon compte</a>
                  <p style="margin-bottom: 15px;">Ce lien d'activation de mot de passe expirera dans 60 minutes. </p>
              </main>
      
              <footer style="background: #EEF0E5; padding: 20px; font-size: 18px; font-weight: 500; text-align: center;">&copy; 2023 - Tout droit réservés </footer>
          </div>
      </body>
      </html>
      
      `
    });

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ status: "error", message: 'Erreur interne du serveur' });
    console.log(error);
  }
} 

async function activateAccount(req, res, next) {
  try {
    const decoded = jwt.verify(req.params.token, process.env.PRIVATE_KEY);
    await User.update({ validated: true }, {
      where: {
        id: decoded.user_id,
      }
    });
    res.status(200).json({ status: "success", message:"Compte active." });

  } catch (error) {
    res.status(500).send({status: "error", message: error.message});
    console.log(error);
  }
}

async function login (req, res, next){

  //validate email
  if(!(validator.isEmail(req.body.email))){
    res.status(400).json({ status: "error", message: 'Adresse e-mail invalide' });
    return;
  };

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['id', 'email','name', 'password', 'validate']
    });

    if (!user || !user.validate) {
      res.status(401).json({ status: "error", messaeg: "Utilisateur non trouvé ou compte desactive" });
      return; 
    }

    const userPassword = req.body.password;
    const hashedPassword = user.password;
    const match = await bcrypt.compare(userPassword, hashedPassword);
    if (!match){
      res.status(400).json({ status: "error", messaeg: "Authentification échouée" });
      return;
    } 

    var hour = 3600000;
    req.session.cookie.expires = new Date(Date.now() + hour);

    res.status(200).json(
      {
        username:user.name,
        email:user.email,
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", messaeg: "Erreur Interne du Serveur" });
  }
}

async function changepassword (req, res, next){
  try {

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email', 'name', 'password']
    });

    if (!user) {
      res.status(401).json({ status: "error", messaeg: "Utilisateur non trouvé" });
      return;
    }

    const match = await bcrypt.compare(req.body.password1, user.password);
    if (!(req.body.password1 == req.body.password2 && !match)) {
      res.status(400).json({ status: "error", messaeg: "Les mots de passe ne correspondent pas et/ou votre ancienne mot de passe est identique à la nouvelle" });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password1, salt);
    await User.update({ password: hashedPassword }, {
      where: {
        email: req.body.email
      }
    });
    res.status(200).json({ status: "succes", message: "Le changement de votre mot de passe a été effectuée avec succès" });

  } catch (error) {
    res.status(500).json({status:"error", message: "Erreur Interne du Serveur"});
  }

}

async function getPasswordResetEmail (req, res, next){
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
  
    if (!user) {
      res.status(401).json({ status: "error", message: "Utilisateur non trouvé" });
      return;
    } 

    const reset_password_token = tokenGenerator.passwordResetToken()
    await User.update({ reset_password_token: reset_password_token, reset_password_expires: new Date(Date.now() + 3600000) }, {
      where: {
        id: user.getDataValue('id'),
      }
    });
  
    const payload = {
      user_id: user.id,
      user_email: user.email,  
      reset_password_token: reset_password_token,   
    };

    const token = jwt.sign(
      payload, 
      privateKey,  
      { expiresIn: '1h'}
    );

    // send emil
    await transporter.sendMail({
      from: 'no-replay@gmail.com', 
      to: req.body.email, 
      subject: "Réinitialisation de mot de passe",
      // html: {path:'./public/email.html'}, 
      html:
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap" rel="stylesheet">
          <title>Email</title>
      </head>
      <body style="font-family: 'Roboto', sans-serif; background: #fff; padding: 20px; line-height: 24px; font-size: 16px; color: #2d3748; font-weight: normal; margin: 0; box-sizing: border-box;">
      
          <div style="max-width: 500px; margin: auto;">
              <header style="background: #EEF0E5; padding: 20px; text-align: center;">
                  <h1 style="font-size: 22px; margin-bottom: 15px; font-weight: 700;">LOGO</h1>
              </header>
      
              <main style="padding: 25px;">
                  <h1 style="font-size: 22px; margin-bottom: 15px; font-weight: 700;">Bonjour!</h1>
                  <p style="margin-bottom: 15px;">Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
                  <a href="http://localhost:3000/users/reset-password/${token}" style="padding: 4px 10px; border-radius: 4px; background-color: #2d3748; text-decoration: none; color: #fff; margin-bottom: 15px; display: inline-block; font-size: 14px; font-weight: normal;">Réinitialiser le mot de passe</a>
                  <p style="margin-bottom: 15px;">Ce lien de réinitialisation de mot de passe expirera dans 60 minutes. </p>
                  <p style="margin-bottom: 15px;">Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune autre action n'est nécessaire.</p>
              </main>
      
              <footer style="background: #EEF0E5; padding: 20px; font-size: 18px; font-weight: 500; text-align: center;">&copy; 2023 - Tout droit réservés </footer>
          </div>
      </body>
      </html>
      
      `
    });
    res.status(200).json({status:"success", message:"Nous vous avons envoyer un email de réeinitilisation de mot de passe." });

  } catch (error) {
    res.status(500).json({ status:"error", message:"Erreur interne du serveur." });
      console.log(error);
  }
}

async function verifyPasswordResetToken(req, res, next){
  try {
    const decoded = jwt.verify(req.params.token, process.env.PRIVATE_KEY);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(500).json({status:"error", message:"Le lien de réinitialisation de mot de passe a expiré. Veuillez en demander un nouveau."});
  }
}

async function resetPassword (req, res, next){
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email', 'password', 'reset_password_token', 'reset_password_expires']
    });

    if (!user) {
       res.status(401).json({ status: "error", message: "Utilisateur non trouvé" });
      return; 
    }
    if(!(user.reset_password_token == req.body.reset_password_token && new Date() > new Date(user.reset_password_expires))) {
      res.status(400).json({ status: "error", message: "Le lien de réinitialisation de mot de passe a expiré. Veuillez en demander un nouveau." });
      return; 
    }

    const userPassword1 = req.body.password1;
    const userPassword2 = req.body.password2;
    if (!(userPassword1 == userPassword2)) {
      res.status(400).json({ status: "error", message:"Les mots de passe ne correspondent pas" });
      return; 
    } 

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userPassword1, salt);
    await User.update({ password: hashedPassword }, {
      where: {
        email: req.body.email
      }
    });
    res.status(200).json({ status: "success", message: "La réinitialisation de votre mot de passe a été effectuée avec succès" });

  } catch (error) {
    res.status(500).json({ status: "error", message:"Erreur interne de serveur."});
    console.log(error);
  }
}

async function logout (req, res, next){
  try {
    req.session.destroy(function (err) {
      if (err) next(err)
    })
    res.status(200).json({ status: "success", message: "You have successfully logged out." });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}



module.exports = {
    register,
    login,
    changepassword,
    getPasswordResetEmail,
    verifyPasswordResetToken,
    resetPassword,
    logout,
    activateAccount,
  }
