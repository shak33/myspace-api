import express from 'express';

import { postRoutes } from '@/routes/routes';

import { requestValidationMiddleware } from '@/middlewares/requestValidation.middleware';
import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { createPostController } from '@/controllers/post/createPost.controller';

import { createPostValidation } from '@/controllers/post/models/createPost.validation';
import { updatePostValidation } from '@/controllers/post/models/updatePost.validation';
import { updatePostController } from '@/controllers/post/updatePost.controller';

const router = express.Router();

router.post(
  postRoutes.createPost,
  isAuthenticatedMiddleware,
  requestValidationMiddleware(createPostValidation),
  createPostController
);

router.patch(
  postRoutes.updatePost,
  isAuthenticatedMiddleware,
  requestValidationMiddleware(updatePostValidation),
  updatePostController
);

export default router;