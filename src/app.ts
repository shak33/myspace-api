require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import {
  API_ROUTE_AUTH,
  API_ROUTE_PROFILE,
  API_ROUTE_POST,
  API_ROUTE_POSTS,
  API_ROUTE_FRIEND,
  API_ROUTE_USER,
} from '@/routes/routes';
import authRoutes from '@/routes/auth/auth.route';
import profileRoutes from '@/routes/profile/profile.route';
import postRoutes from '@/routes/post/post.route';
import postsRoutes from '@/routes/posts/posts.route';
import friendRoutes from '@/routes/friend/friend.route';
import userRoutes from '@/routes/user/user.routes';

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
app.use(API_ROUTE_POST, postRoutes);
app.use(API_ROUTE_POSTS, postsRoutes);
app.use(API_ROUTE_FRIEND, friendRoutes);
app.use(API_ROUTE_USER, userRoutes);

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint does not exist',
  });
});
