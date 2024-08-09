import {Request, Response, NextFunction } from "express";
import authService from "../services/auth.sevices";
import userService from "../services/user.sevices";
import { generateToken } from "../utils";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey:any =  process.env.JWT_SECRET ;
const saltRound:any = process.env.SALT_ROUND;



const getUser = async (req:Request, res:Response, next:NextFunction) => {
    res.send(req.params.userID);
}

const getUsers = async (req:Request, res:Response, next:NextFunction) => {
    res.send('Hello World!')
}

const createUser = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const data = {...req.body}
        let result:any = await userService.findUser(data.email);
        if(result) return res.status(400).json({message: 'User already exists'});

        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;

        const token = jwt.sign(
            {
              name: data.name,
              email: data.email,  
              token: generateToken(),   
            },
            secretKey,  
            { expiresIn: 60 * 15} // expires in 15 minutes
          );
        await userService.createUser({...data});
        await authService.sendAccountValidationEmail({...data, token});
        res.status(201).json({message: 'User created successfully'});

    }catch (error:any){

        res.status(500).json({message: error.message});
    }
}

const updateUser = async (req:Request, res:Response, next:NextFunction) => {
    // Define the logic for updating a user
}

const deleteUser = async (req:Request, res:Response, next:NextFunction) => {
    // Define the logic for deleting a user
}

const userController = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser 
};

export default userController;


