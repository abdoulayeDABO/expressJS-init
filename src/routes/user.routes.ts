import express, { Router } from 'express';
import UserController from '../controllers/user.controller';
const userRoutes: Router = express.Router();

// Route for getting all users
userRoutes.get('/', UserController.getUsers);

// Route for getting a single user
userRoutes.get('/:userID', UserController.getUser);

// Route for creating a new user
userRoutes.post('/', UserController.createUser);

// Route for updating a user
userRoutes.put('/:userID', UserController.updateUser);

// Route for deleting a user
userRoutes.delete('/:userID', UserController.deleteUser);

// Route for updating a user
userRoutes.patch('/:userID', UserController.updateUser);

export default userRoutes;
