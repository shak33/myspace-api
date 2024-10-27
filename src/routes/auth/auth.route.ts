import express from 'express';

import { authRoutes } from '@/routes/routes';

import { requestValidation } from '@/middlewares/requestValidation.middleware';

import { userRegistrationController } from '@/controllers/auth/userRegistration.controller';

import { userRegistrationValidation } from '@/controllers/auth/models/userRegistration.validation';

const router = express.Router();

router.post(
  authRoutes.register,
  requestValidation(userRegistrationValidation),
  userRegistrationController
);

export default router;
