import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const rejectFriendRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const loggedInUser = req.user;
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        sentFriendRequests: {
          where: { userId2: loggedInUser.id },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.sentFriendRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: `You don't have pending friend request from this user`,
      });
    }

    const friendshipRequestToReject = await prisma.friendRequest.findFirst({
      where: {
        userId1: user.id,
      },
    });

    if (!friendshipRequestToReject) {
      return res.status(404).json({
        success: false,
        message: 'Friendship request not found',
      });
    }

    const rejectFriendshipRequest = await prisma.friendRequest.delete({
      where: {
        id: friendshipRequestToReject.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully rejected friend invitation',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
