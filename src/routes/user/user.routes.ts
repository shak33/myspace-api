import express from 'express';

import { userRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { blockUserController } from '@/controllers/user/blockUser.controller';

const router = express.Router();

router.post(
  userRoutes.blockUser,
  isAuthenticatedMiddleware,
  blockUserController
);

export default router;
