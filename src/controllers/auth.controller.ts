const authRoutes = require('express').Router();


const signin = async (req, res, next) => {
    res.send(req.params.userID);
}

const signup = async (req, res, next) => {
    res.send('Hello World!')
}

const logout = async (req, res, next) => {
    // Code for logout functionality
}

const sendPasswordResetEmail = async (req, res, next) => {
    // Code for forget password functionality
}

const sendAccountValidationEmail = async (req, res, next) => {
    
}

const resetPassword = async (req, res, next) => {
    // Code for resetting password functionality
}

const validateAccount = async (req, res, next) => {
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
