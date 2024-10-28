require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { API_ROUTE_AUTH, API_ROUTE_PROFILE } from '@/routes/routes';
import authRoutes from '@/routes/auth/auth.route';
import profileRoutes from '@/routes/profile/profile.route';

export const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

app.options('*', cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Future place of something cool!' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(API_ROUTE_AUTH, authRoutes);
app.use(API_ROUTE_PROFILE, profileRoutes);

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint does not exist',
  });
});
