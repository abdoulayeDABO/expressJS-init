import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import HttpException from "../utils/http/exceptions";
import userService from "../services/user.sevices";
const privateKey: any =  process.env.PRIVATE_KEY ;


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
  try {
      const token = req.params.token;
      const decoded:any = jwt.verify(token, privateKey);
      if (!decoded) throw new HttpException('Token is invalid');
    //   console.log(decoded);
  
      const user = await userService.findUser(decoded.email);
      if (!user) throw new HttpException('User not found');
      await userService.updateUser(decoded.email, {
          isActive: true,
        });
  
      res.status(200).json({message: 'Account validated successfully'});
  } catch (error: any) {
     res.status(500).json(error.message);
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
