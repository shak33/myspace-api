import express from 'express';

import { friendRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { sendFriendRequestController } from '@/controllers/friend/sendFriendRequest.controller';
import { removeFriendController } from '@/controllers/friend/removeFriend.controller';

const router = express.Router();

router.post(
  friendRoutes.sendFriendRequest,
  isAuthenticatedMiddleware,
  sendFriendRequestController
);

router.delete(
  friendRoutes.removeFriend,
  isAuthenticatedMiddleware,
  removeFriendController
);

export default router;
