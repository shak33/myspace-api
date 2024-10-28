import express from 'express';
import multer from 'multer';

import { profileRoutes } from '@/routes/routes';

import { isAuthenticatedMiddleware } from '@/middlewares/isAuthenticated.middleware';

import { editProfilePictureController } from '@/controllers/profile/editProfilePicture.controller';

const router = express.Router();

const upload = multer();

router.post(
  profileRoutes.uploadProfilePicture,
  isAuthenticatedMiddleware,
  upload.single('profilePicture'),
  editProfilePictureController
);

export default router;
