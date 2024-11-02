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

    const existingBlock = await prisma.blockedUser.findFirst({
      where: {
        blockingUserId: user.id,
        blockedByUserId: loggedInUser.id,
      },
    });

    if (existingBlock) {
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
        blockedByUserId: loggedInUser.id,
        blockingUserId: user.id,
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
