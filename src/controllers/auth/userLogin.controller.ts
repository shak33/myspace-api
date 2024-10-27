require('dotenv').config();

import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { prisma } from '@/db';
import { createSecretToken } from '@/controllers/auth/utils/createSecretToken.util';

import { User } from '@prisma/client';

type LoginBody = Pick<User, 'email' | 'password'>;

export const userLoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = createSecretToken(user.id);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        token,
        user: {
          email: user.email,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
