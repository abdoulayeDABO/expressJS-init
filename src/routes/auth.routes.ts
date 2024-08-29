import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
const authRoutes: Router = express.Router();

// Route for sign in
authRoutes.post('/login', authController.signin);

// Route for sign up
authRoutes.post('/register', authController.register);

// Route for sign out
authRoutes.post('/logout', authController.logout);

// Route for sending password reset email
authRoutes.post('/forget-password', authController.sendPasswordResetEmail);

// Route for sending account validation email
authRoutes.post(
  '/send-validation-email',
  authController.sendAccountValidationEmail
);

// Route for resetting password
authRoutes.post('/reset-password/:token', authController.resetPassword);

// Route for validating account
authRoutes.get('/validate-account/:token', authController.validateAccount);

export default authRoutes;
