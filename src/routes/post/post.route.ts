import express from 'express';

import { postRoutes } from '@/routes/routes';

import { requestValidationMiddleware } from '@/middlewares/requestValidation.middleware';
import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { createPostController } from '@/controllers/post/createPost.controller';

import { createPostValidation } from '@/controllers/post/models/createPost.validation';

const router = express.Router();

router.post(
  postRoutes.createPost,
  isAuthenticatedMiddleware,
  requestValidationMiddleware(createPostValidation),
  createPostController
);

export default router;
