import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const isAuthenticatedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    let verify: JwtPayload | string;
    try {
      verify = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        });
      } else if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    if (typeof verify !== 'object' || !('id' in verify)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: verify.id,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    req.user = {
      email: user.email,
      id: user.id,
      userId: user.userId,
      profile: {
        id: user.profile!.id,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
      },
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
