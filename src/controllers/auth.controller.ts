import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import HttpException from "../utils/http/exceptions";
import userService from "../services/user.sevices";
const privateKey: any =  process.env.PRIVATE_KEY ;
import validator from 'validator';
import authService from "../services/auth.sevices";
import HttpResponse from "../utils/http/response";

const signup = async (req:Request, res:Response, next:NextFunction) => {
    res.send(req.params.userID);
}

const signin = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const data = {...req.body};
        if (!validator.isEmail(data.email)) throw new HttpException('Invalid email');
        const user = await authService.signin({...data});
        const token = jwt.sign(
            {
              email: user.email,  
            },
            privateKey,  
            { expiresIn: '1h'} // expires in 1h
          );
        res.header('Authorization', `Bearer ${token}`);
        res.status(200).send(new HttpResponse(true, 'Login successful', null));
    } catch (error:any) {
        res.status(500).json(new HttpResponse(false, error.message, null));
    }
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
  try {
      const token = req.params.token;
      const decoded:any = jwt.verify(token, privateKey);
      if (!decoded) throw new HttpException('Token is invalid');
  
      const user = await userService.findUser(decoded.email);
      if (!user) throw new HttpException('User not found');
      await userService.updateUser(decoded.email, {
          isActive: true,
        });
  
      res.status(200).json(res.status(500).json(new HttpResponse(true, "Account validated successfully", null)));
  } catch (error: any) {
    res.status(500).json(new HttpResponse(false, error.message, null));
  }
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
