import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';
import { sendMail } from '@/utils/sendMail.util';

export const sendFriendRequestController = async (
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
        profile: true,
        sentFriendRequests: {
          where: { userId2: loggedInUser.id },
        },
        receivedFriendRequests: {
          where: { userId1: loggedInUser.id },
        },
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

    if (user.friendsAsUser1.length > 0 || user.friendsAsUser2.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already friends with this user',
      });
    }

    if (user.receivedFriendRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending friend request from this user',
      });
    }

    if (user.sentFriendRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a friend request to this user',
      });
    }

    const sendFriendRequest = await prisma.friendRequest.create({
      data: {
        userId1: loggedInUser.id,
        userId2: user.id,
      },
    });

    const sendFriendRequestMail = await sendMail({
      email: user.email,
      subject: `MySpace.com - New friend request from ${loggedInUser.firstName} ${loggedInUser.lastName}`,
      template: '/friend/friend-request.ejs',
      data: {
        requestingUser: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
        receivingUser: `${user.profile?.firstName} ${user.profile?.lastName}`,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Friend request has been sent',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
