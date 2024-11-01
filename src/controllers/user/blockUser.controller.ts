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
        data: {
          userDoesntExist: true,
        },
      });
    }

    if (user.blockedByUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already blocked this user',
        data: {
          alreadyBlockedThisUser: true,
        },
      });
    }

    const blockUser = await prisma.blockedUser.create({
      data: {
        blockingUserId: loggedInUser.id,
        blockedByUserId: user.id,
      },
    });

    const friendshipToRemove = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            userId1: loggedInUser.id,
            userId2: user.id,
          },
          {
            userId1: user.id,
            userId2: loggedInUser.id,
          },
        ],
      },
    });

    if (friendshipToRemove) {
      const deleteFriendship = await prisma.friend.delete({
        where: {
          id: friendshipToRemove.id,
        },
      });
    }

    const friendRequestToRemove = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            userId1: loggedInUser.id,
            userId2: user.id,
          },
          {
            userId1: user.id,
            userId2: loggedInUser.id,
          },
        ],
      },
    });

    if (friendRequestToRemove) {
      const deleteFriendship = await prisma.friendRequest.delete({
        where: {
          id: friendRequestToRemove.id,
        },
      });
    }

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
