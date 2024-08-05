import express, { Router } from "express";
import UserController from "../controllers/user.controller";
const userRoutes: Router = express.Router();

userRoutes.get('/', UserController.getUsers)

userRoutes.get('/:userID', UserController.getUser)

userRoutes.post('/', UserController.createUser)

userRoutes.put('/:userID', UserController.updateUser)

userRoutes.delete('/:userID', UserController.deleteUser)


export default userRoutes;



