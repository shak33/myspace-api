import express from 'express';

import { friendRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { addFriendController } from '@/controllers/friend/addFriend.controller';

const router = express.Router();

router.post(
  friendRoutes.addFriend,
  isAuthenticatedMiddleware,
  addFriendController
);

export default router;
