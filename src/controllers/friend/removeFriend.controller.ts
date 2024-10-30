import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const removeFriendController = async (
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
      include: {
        friendsAsUser1: {
          where: { userId2: loggedInUser.id },
        },
        friendsAsUser2: {
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

    if (user.friendsAsUser1.length === 0 || user.friendsAsUser2.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'You are not friends with this user',
      });
    }

    const friendshipToRemove = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId1: user.id, userId2: loggedInUser.id },
          { userId1: loggedInUser.id, userId2: user.id },
        ],
      },
    });

    if (!friendshipToRemove) {
      return res.status(400).json({
        success: false,
        message: 'Friend relationship not found',
      });
    }

    const removeFriendship = await prisma.friend.delete({
      where: {
        id: friendshipToRemove.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully removed friend from your friends list',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
