import express, { Router } from "express";
import authController from "../controllers/auth.controller";
const authRoutes: Router = express.Router();

authRoutes.post('/login', authController.signin);
authRoutes.post('/logout', authController.logout);
authRoutes.post('/forget-password', authController.sendPasswordResetEmail);
authRoutes.post('/send-validation-email',  authController. sendAccountValidationEmail);
authRoutes.post('/reset-password', authController.resetPassword);
authRoutes.get('/validate-account/:token', authController.validateAccount);

export default authRoutes;