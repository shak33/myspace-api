import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { createSecretToken } from '@/controllers/auth/utils/createSecretToken.util';
import { sendMail } from '@/utils/sendMail.util';
import { prisma } from '@/db';
import { RegistrationBody } from '@/models/auth/RegistrationBody.type';

export const userRegistrationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName } =
      req.body as RegistrationBody;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    try {
      const sendRegistrationMail = await sendMail({
        email,
        subject: 'Welcome to MySpace!',
        template: '/auth/registration-notification.ejs',
        data: {
          user: {
            firstName,
            lastName,
          },
          loginUrl: `${process.env.CLIENT_URL}/auth/login`,
        },
      });
    } catch (error) {
      // @ts-ignore
      if (error.responseCode === 554) {
        return res.status(400).json({
          success: false,
          message: `Given domain doesn't exist`,
          errors: {
            fields: { email: 'Given domain doesnt exist' },
          },
        });
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
    });

    const token = createSecretToken(newUser.id);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
