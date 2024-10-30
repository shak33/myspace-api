import express from 'express';

import { friendRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { sendFriendRequestController } from '@/controllers/friend/sendFriendRequest.controller';
import { removeFriendController } from '@/controllers/friend/removeFriend.controller';
import { withdrawFriendRequestController } from '@/controllers/friend/withdrawFriendRequest.controller';
import { rejectFriendRequestController } from '@/controllers/friend/rejectFriendRequest.controller';

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

router.delete(
  friendRoutes.withdrawFriendRequest,
  isAuthenticatedMiddleware,
  withdrawFriendRequestController
);

router.delete(
  friendRoutes.rejectFriendRequest,
  isAuthenticatedMiddleware,
  rejectFriendRequestController
);

export default router;
