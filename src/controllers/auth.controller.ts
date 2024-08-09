import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import userService from "../services/user.sevices";
import validator from 'validator';
import authService from "../services/auth.sevices";
import bcrypt from 'bcrypt';

const secretKey:any =  process.env.JWT_SECRET ;
const saltRound:any = process.env.SALT_ROUND;

const signup = async (req:Request, res:Response, next:NextFunction) => {
    res.send(req.params.userID);
}

const signin = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const data = {...req.body};
        if (!validator.isEmail(data.email)) throw new Error('Invalid email');
        const user = await authService.signin({...data});
        const token = jwt.sign(
            {
              email: user.email,  
            },
            secretKey,  
            { expiresIn: '1h'} // expires in 1h
          );
        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true }); // 1 hour
        res.status(200).json({message: 'Login successful', data: user});
        
    } catch (error:any) {
        res.status(500).json({message: error.message});
    }
}

const logout = async (req:Request, res:Response, next:NextFunction) => {
    // Code for logout functionality
}

const sendPasswordResetEmail = async (req:Request, res:Response, next:NextFunction) => {
  try{
    const data = {...req.body}
    let result:any = await userService.findUser(data.email);
    if(!result) return res.status(400).json({message: 'User not found '});
    const token = jwt.sign(
        {
          email: data.email,  
        },
        secretKey,  
        { expiresIn: 60 * 5} // expires in 5 minutes
      );

    await authService.sendPasswordResetEmail({email:data.email, token:token});
    res.status(200).json({message: 'Reset password email sent successfully'});
    
  } catch (error:any){
    res.status(500).json({message: error.message});
  }
}

const sendAccountValidationEmail = async (req:Request, res:Response, next:NextFunction) => {
    
}

const resetPassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
      const token = req.params.token;
      const data = {...req.body}
      const decoded:any = jwt.verify(token, secretKey);
      if (!decoded) throw new Error('Token is invalid');
      const user = await userService.findUser(decoded.email);
      if (!user) throw new Error('User not found');
      await userService.updateUser(decoded.email, {
          password: await bcrypt.hash(data.password, saltRound),
        });
      res.status(200).json({message: "Password updated successfully"});
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

const validateAccount = async (req:Request, res:Response, next:NextFunction) => {
  try {
      const token = req.params.token;
      const decoded:any = jwt.verify(token, secretKey);
      if (!decoded) throw new Error('Token is invalid');
  
      const user = await userService.findUser(decoded.email);
      if (!user) throw new Error('User not found');
      await userService.updateUser(decoded.email, {
          isActive: true,
        });
  
      res.status(200).json({message: "Account validated successfully"});
  } catch (error: any) {
    res.status(500).json({message: error.message});
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
