import express, { Router } from "express";
import authController from "../controllers/auth.controller";
const authRoutes: Router = express.Router();
const { userValidationRules} = require('../utils/validator');
import { validateData } from "../utils";

// Route for sign in    
authRoutes.post('/login', userValidationRules(), validateData, authController.signin);

// Route for sign up
authRoutes.post('/signup', userValidationRules(), validateData,  authController.signup);

// Route for sign out
authRoutes.post('/logout', authController.logout);

// Route for sending password reset email
authRoutes.post('/forget-password', userValidationRules(), validateData,  authController.sendPasswordResetEmail);

// Route for sending account validation email
authRoutes.post('/send-validation-email', userValidationRules(), validateData,  authController.sendAccountValidationEmail);

// Route for resetting password
authRoutes.post('/reset-password/:token', userValidationRules(), validateData,  authController.resetPassword);

// Route for validating account
authRoutes.get('/validate-account/:token', authController.validateAccount);

export default authRoutes;