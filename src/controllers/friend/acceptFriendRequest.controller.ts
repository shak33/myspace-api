import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const acceptFriendRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const loggedInUser = req.user;
    const { friendId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        userId: friendId,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        userId1: user.id,
        userId2: loggedInUser.id,
      },
    });

    if (!friendRequest) {
      return res.status(404).send({
        success: false,
        message: 'Friend request not found',
      });
    }

    const removeFriendRequest = await prisma.friendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });

    const createFriendship = await prisma.friend.create({
      data: {
        userId1: user.id,
        userId2: loggedInUser.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Friend request has been accepted',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
