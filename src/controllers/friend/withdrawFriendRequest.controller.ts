import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const withdrawFriendRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    const { friendId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        userId: friendId,
      },
      include: {
        receivedFriendRequests: {
          where: { userId1: loggedInUser.id },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.receivedFriendRequests.length === 0) {
      return res.status(400).json({
        success: false,
        message: `This user doesn't have pending friend request from you`,
      });
    }

    const friendshipRequestToRemove = await prisma.friendRequest.findFirst({
      where: {
        userId2: user.id,
      },
    });

    if (!friendshipRequestToRemove) {
      return res.status(400).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    const removeFriendshipRequest = await prisma.friendRequest.delete({
      where: {
        id: friendshipRequestToRemove.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully canceled your friend invitation',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
