import {Request, Response, NextFunction } from "express";
import authService from "../services/auth.sevices";
import userService from "../services/user.sevices";
import { generateToken } from "../utils";
import jwt from 'jsonwebtoken';
const privateKey: any =  process.env.PRIVATE_KEY ;
import bcrypt from 'bcrypt';
import HttpResponse from "../utils/http/response";
const saltRounds = 10;

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

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;

        const token = jwt.sign(
            {
              name: data.name,
              email: data.email,  
              token: generateToken(),   
            },
            privateKey,  
            { expiresIn: 60 * 15} // expires in 15 minutes
          );
        await userService.createUser({...data});
        await authService.sendAccountValidationEmail({...data, token});

        res.status(201).json(new HttpResponse(true, "User created successfully", null));
    }catch (error:any){
        res.status(500).json(new HttpResponse(false, error.message, null));
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


