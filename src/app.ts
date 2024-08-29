import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import { userRoutes, authRoutes } from './routes';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// initialize express app
const app = express();
const BASE_URL = 'api/v1/';

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// define a simple "/api/v1/" route
app.get('/api/v1/', (req, res, next) => {
  res.json('Hello, World!');
});

// other routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

// error handling
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    return res.status(err.statusCode || 500).json(err.message);
  }
  next();
});

export default app;
