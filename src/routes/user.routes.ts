import express, { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validateData } from '../utils';
const userRoutes: Router = express.Router();
const { userValidationRules, validate } = require('../utils/validator');

// Route for getting all users
userRoutes.get('/', UserController.getUsers);

// Route for getting a single user
userRoutes.get('/:userID', UserController.getUser);

// Route for creating a new user
userRoutes.post(
  '/',
  userValidationRules(),
  validateData,
  UserController.createUser
);

// Route for updating a user
userRoutes.put('/:userID', UserController.updateUser);

// Route for deleting a user
userRoutes.delete('/:userID', UserController.deleteUser);

export default userRoutes;
