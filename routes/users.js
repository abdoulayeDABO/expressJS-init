var express = require('express');
var router = express.Router();
const tokenGenerator = require('../functions/token');
require('dotenv').config();
const privateKey =  process.env.PRIVATE_KEY;
var jwt = require('jsonwebtoken');
const validator = require('validator');
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const transporter = require('../config/nodemailerConfig');

/* GET all users. */
router.get('/all', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
});

/* Create user */
router.post('/register', async (req, res, next) => {
  try {
    //valider email et mot de passe
    if(!(validator.isEmail(req.body.email))){
      res.status(400).json({ erreur: 'Adresse e-mail invalide' });
      return;
    };

    //verifier si l'email existe dans la base
    var user = await User.findOne({
      where: {
        email: req.body.email,
      }
    }); 
    if (user) {
      res.status(400).json({ erreur: 'Adresse e-mail déjà associée à un compte' });
      return;
    }

    //verifier si les mots de passes correspondent
    if(!(req.body.password1 == req.body.password2)){
      res.status(400).json({ erreur: 'les mots de passe ne correspondent pas.' });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password1, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
    console.log(error);
  }
});


/* Authenticate user */
router.post('/login', async (req, res, next) => {

  //valider email et mot de passe
  if(!(validator.isEmail(req.body.email))){
    res.status(400).json({ erreur: 'Adresse e-mail invalide' });
    return;
  };

  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email','name', 'password']
    });

    if (!user) {
      res.status(401).send('Utilisateur non trouvé');
      return; 
    }

    const userPassword = req.body.password;
    const hashedPassword = user.password;
    const match = await bcrypt.compare(userPassword, hashedPassword);
    if (!match){
      res.status(400).send('Authentification échouée');
      return;
    } 

    res.status(200).json(
      {
        username:user.name,
        email:user.email,
      }
    );

  } catch (error) {
    res.status(500).send('Erreur Interne du Serveur');
  }
});


/* Change user password*/
router.post('/changepassword', async (req, res, next) => {
  try {

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email', 'name', 'password']
    });

    if (!user) {
      res.status(401).send('Utilisateur non trouvé');
      return;
    }

    const match = await bcrypt.compare(req.body.password1, user.password);
    if (!(req.body.password1 == req.body.password2 && !match)){
      res.status(400).send('Les mots de passe ne correspondent pas et/ou votre ancienne mot de passe est identique à la nouvelle');
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(req.body.password1, salt);
      await User.update({ password: hashedPassword }, {
        where: {
          email: req.body.email
        }
      });
    res.status(200).send('Le changement de votre mot de passe a été effectuée avec succès');

  } catch (error) {
    res.status(500).send('Erreur Interne du Serveur');
  }

});

/* send reset password email*/
router.post('/send-password-reset-email', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
  
    if (!user) {
      res.status(401).send('Utilisateur non trouvé');
      return;
    } 

    const reset_password_token =  tokenGenerator.passwordResetToken()
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
      html: `<!DOCTYPE html>
      <html lang="fr">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
      
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
                  margin-top: 20px;
              }
      
              .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #ddd;
              }
      
              .header h1 {
                  color: #333;
              }
      
              .body-content {
                  margin-top: 20px;
              }
      
              .body-content p {
                  color: #666;
              }
      
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  margin-top: 20px;
                  background-color: #3498db;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <div class="header">
                  <h1>Réinitialisation de mot de passe</h1>
              </div>
              <div class="body-content">
                  <p>Bonjour,</p>
                  <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                  <a class="btn" href="http://localhost:3000/users/reset-password/${token}">Réinitialiser le mot de passe</a>
                  <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail.</p>
                  <p>Merci,</p>
                  <p>Nom de votre entreprise</p>
              </div>
          </div>
      </body>
      
      </html>
      `
    });
    res.status(200).send('Nous vous avons envoyer un email de réeinitilisation de mot de passe.');

  } catch (error) {
      res.status(500).json('Erreur interne du serveur.');
  }
});


/* GET reset-password-page */
router.get('/reset-password/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.PRIVATE_KEY);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(500).send('Le lien de réinitialisation de mot de passe a expiré. Veuillez en demander un nouveau.');
  }
});


/* Reset password */
router.post('/reset-password-done', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email', 'password', 'reset_password_token', 'reset_password_expires']
    });

    if (!user) {
      res.status(401).send('Utilisateur non trouvé');
      return; 
    }
    if(!(user.reset_password_token == req.body.reset_password_token && new Date() > new Date(user.reset_password_expires))) {
      res.status(400).send('Le lien de réinitialisation de mot de passe a expiré. Veuillez en demander un nouveau.');
      return; 
    }

    const userPassword1 = req.body.password1;
    const userPassword2 = req.body.password2;
    if (!(userPassword1 == userPassword2)) {
      res.status(400).send('Les mots de passe ne correspondent pas');
      return; 
    } 

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userPassword1, salt);
    await User.update({ password: hashedPassword }, {
      where: {
        email: req.body.email
      }
    });
    res.status(200).send('La réinitialisation de votre mot de passe a été effectuée avec succès');

  } catch (error) {
    res.status(500).send('Erreur interne de serveur.');
    console.log(error);
  }
});

module.exports = router;





