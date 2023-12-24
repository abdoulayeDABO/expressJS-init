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

const response = {
  data: null,
  status: '',
  message: '',
};

const transporter = require('../config/nodemailerConfig');

/* GET all users. */
router.get('/all', async (req, res) => {
  try {
    const users = await User.findAll();
    response.data = users;
    response.status = 'success';
    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    response.status = 'error';
    response.data = null; 
    res.status(500).json(response);
  }
});

/* Create user */
router.post('/register', async (req, res, next) => {
  try {
    if(!(validator.isEmail(req.body.email))){
      response.status = 'error';
      response.data = null; 
      response.message = 'email invalid';
      res.json(response);
      return
    };
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    response.status = 'success';
    response.data = user;
    res.status(201).json(response);
  } catch (error) {
      response.status = 'error';
      response.data = null;
      response.message = 'Erreur!'; 
      res.status(500).json(response);
      console.log(error);
  }
});


/* Authenticate user */
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email', 'password']
    });

    if (user == null) {
      res.status(401).send('Utilisateur non trouvé');
      return; 
    }

    const userPassword = req.body.password;
    const hashedPassword = user.password;
    const match = await bcrypt.compare(userPassword, hashedPassword);
    if (match) {
      res.status(200).json(user.email);
    } else {
      res.status(401).send('Authentification échouée');
    }
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

    if (user == null) {
      response.status = 'error';
      response.data = null;
      response.message = 'Utilisateur non trouvé'
      res.json(response);
    }else{

      const userPassword1 = req.body.password1;
      const userPassword2 = req.body.password2;
      const oldPassword = user.password;
      const match = await bcrypt.compare(userPassword1, oldPassword);

      if (userPassword1 == userPassword2 && !match){
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(userPassword1, salt);
        await User.update({ password: hashedPassword }, {
          where: {
            email: req.body.email
          }
        });
        response.status = 'success';
        response.data = null;
        response.message = 'Le changement de votre mot de passe a été effectuée avec succès'
        res.json(response);
      } else {
        response.status = 'error';
        response.data = null;
        response.message = 'Les mots de passe ne correspondent pas et/ou votre ancienne mot de passe est identique à la nouvelle'
        res.json(response);
      }
    }
  } catch (error) {
      response.status = 'error';
      response.data = null;
      response.message = 'Erreur!';
      res.json(response);
  }

});

/* send reset password email*/
router.post('/forgot-password', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
  
    if (user == null) {
      response.status = 'error';
      response.data = null;
      res.json(response);
    } else {
        const reset_password_token =  tokenGenerator.passwordResetToken()
        await User.update({ reset_password_token: reset_password_token, reset_password_expires: new Date(Date.now() + 3600000) }, {
          where: {
            id: user.getDataValue('id'),
          }
        });
      
        const payload = {
          user_email: user.email,     
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
      response.status = 'success';
      response.message = 'Nous vous avons envoyer un email de réeinitilisation de mot de passe'
      res.json(response);
    }
  } catch (error) {
      response.status = 'error';
      res.status(500).json(response);
      console.log(error);
  }
});


/* GET reset-password-page */
router.get('/reset-password/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.PRIVATE_KEY);
    response.status = 'success';
    response.message = 'Veuillez saisir un nouveau mot de passe.';
    response.data = decoded;
    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error);
    response.status = 'error';
    response.data = null; 
    response.message = 'Le lien de réinitialisation de mot de passe a expiré. Veuillez en demander un nouveau.'
    res.status(500).json(response);
  }
});


/* Reset password */
router.post('/reset-password-done', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ['email', 'password']
    });

    if (user == null) {
      res.status(401).send('Utilisateur non trouvé');
      return; 
    }
  
    const userPassword1 = req.body.password1;
    const userPassword2 = req.body.password2;

    if (userPassword1 == userPassword2) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(userPassword1, salt);
      await User.update({ password: hashedPassword }, {
        where: {
          email: req.body.email
        }
      });
      response.status = 'success';
      response.data = null;
      response.message = 'La réinitialisation de votre mot de passe a été effectuée avec succès'
      res.json(response);
    } else {
      response.status = 'error';
      response.data = null;
      response.message = 'Les mots de passe ne correspondent pas'
      res.json(response);
    }
  } catch (error) {
      response.status = 'error';
      response.data = null;
      response.message = 'Erreur!'
      res.json(response);
  }
});

module.exports = router;





