import express from 'express';

import { postsRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { getPosts } from '@/controllers/post/getPosts.controller';

const router = express.Router();

router.post(postsRoutes.getPosts, isAuthenticatedMiddleware, getPosts);

export default router;
