import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config'
import { userRoutes, authRoutes } from "./routes";

// initialize express app
const app = express()
const BASE_URL = 'api/v1/';

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// define a simple "/api/hello-world" route
app.get('/api/v1/', (req, res, next) => {
    res.json('Hello, World!')
})

// other routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);


export default app;


