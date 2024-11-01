import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const blockUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    if (loggedInUser.userId === userId) {
      return res.status(400).json({
        success: false,
        message: `You can't block yourself`,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        blockingUsers: {
          where: {
            blockedByUserId: loggedInUser.id,
          },
        },
        blockedByUsers: {
          where: {
            blockingUserId: loggedInUser.id,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.blockedByUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already blocked this user',
      });
    }

    const blockUser = await prisma.blockedUser.create({
      data: {
        blockingUserId: loggedInUser.id,
        blockedByUserId: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully blocked this user',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
