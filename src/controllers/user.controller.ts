import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.sevices';
import userService from '../services/user.sevices';
import { generateToken } from '../utils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey: any = process.env.JWT_SECRET;
const saltRound: any = process.env.SALT_ROUND;

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  res.send(req.params.userID);
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  // Define the logic for updating a user
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  // Define the logic for deleting a user
};

const userController = {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};

export default userController;
