import { Request, Response, NextFunction } from "express";

const authRoutes = require('express').Router();


const signin = async (req:Request, res:Response, next:NextFunction) => {
    res.send(req.params.userID);
}

const signup = async (req:Request, res:Response, next:NextFunction) => {
    res.send('Hello World!')
}

const logout = async (req:Request, res:Response, next:NextFunction) => {
    // Code for logout functionality
}

const sendPasswordResetEmail = async (req:Request, res:Response, next:NextFunction) => {
    // Code for forget password functionality
}

const sendAccountValidationEmail = async (req:Request, res:Response, next:NextFunction) => {
    
}

const resetPassword = async (req:Request, res:Response, next:NextFunction) => {
    // Code for resetting password functionality
}

const validateAccount = async (req:Request, res:Response, next:NextFunction) => {
    // Code for validating account functionality
}


const authController = {
    signin,
    signup,
    logout,
    resetPassword,
    sendPasswordResetEmail,
    sendAccountValidationEmail,
    validateAccount
};


export default authController;
