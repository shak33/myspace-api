import express from 'express';

import { authRoutes } from '@/routes/routes';

import { requestValidation } from '@/middlewares/requestValidation.middleware';

import { userRegistrationController } from '@/controllers/auth/userRegistration.controller';
import { userLoginController } from '@/controllers/auth/userLogin.controller';

import { userRegistrationValidation } from '@/controllers/auth/models/userRegistration.validation';
import { userLoginValidation } from '@/controllers/auth/models/userLogin.validation';

const router = express.Router();

router.post(
  authRoutes.register,
  requestValidation(userRegistrationValidation),
  userRegistrationController
);
router.post(
  authRoutes.login,
  requestValidation(userLoginValidation),
  userLoginController
);

export default router;
