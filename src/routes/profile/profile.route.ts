import express from 'express';
import multer from 'multer';

import { profileRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { editProfilePictureController } from '@/controllers/profile/editProfilePicture.controller';
import { removeProfilePictureController } from '@/controllers/profile/removeProfilePicture.controller';

const router = express.Router();

const upload = multer();

router.put(
  profileRoutes.uploadProfilePicture,
  isAuthenticatedMiddleware,
  upload.single('profilePicture'),
  editProfilePictureController
);

router.delete(
  profileRoutes.uploadProfilePicture,
  isAuthenticatedMiddleware,
  removeProfilePictureController
);

export default router;
