import express from 'express';

import { friendRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { sendFriendRequestController } from '@/controllers/friend/sendFriendRequest.controller';

const router = express.Router();

router.post(
  friendRoutes.sendFriendRequest,
  isAuthenticatedMiddleware,
  sendFriendRequestController
);

export default router;
