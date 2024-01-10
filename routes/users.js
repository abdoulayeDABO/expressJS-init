var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const authController = require("../controllers/auth.js");
const userController = require("../controllers/user.js");


/* Create user */
router.post('/register', authController.register);
/* Activate account */
router.get('/activate-account/:token', authController.activateAccount);
/* Authenticate user */
router.post('/login', authController.login);
/* Change user password*/
router.post('/changepassword', auth(), authController.changepassword);
/* send reset password email*/
router.post('/send-password-reset-email', authController.getPasswordResetEmail);
/* verify reset-password */
router.get('/reset-password/:token', authController.verifyPasswordResetToken);
/* Reset password */
router.post('/reset-password-done', authController.resetPassword);
/* logout user */
router.post('/logout', authController.logout);
/* GET all users. */
router.get('/all', auth(), userController.getAll);
/* GET user by id */
router.get('/getUser/:id', userController.getOne);


module.exports = router;



