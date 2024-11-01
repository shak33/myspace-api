import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';
import { SortDirection } from '@/models/SortDirection.enum';

// TODO: There's a problem with accessing types based on conditional statement in 'include' in Prisma
// TODO: https://github.com/prisma/prisma/issues/20871

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    const { profileId } = req.params;
    const sameUser = loggedInUser.userId === profileId;

    if (sameUser) {
      const profileData = await prisma.user.findUnique({
        where: {
          id: loggedInUser.id,
        },
        include: {
          profile: true,
          posts: {
            take: 10,
            skip: 0,
            orderBy: [
              {
                createdAt: SortDirection.Desc,
              },
            ],
          },
        },
      });

      if (!profileData) {
        return res.status(404).json({
          success: false,
          message: `User doesn't exist`,
          data: {
            userDoesntExist: true,
          },
        });
      }

      const friendsAsUser1 = await prisma.friend.findMany({
        where: { userId1: loggedInUser.id },
        select: {
          user2: {
            select: {
              userId: true,
            },
          },
        },
      });

      const friendsAsUser2 = await prisma.friend.findMany({
        where: { userId2: loggedInUser.id },
        select: {
          user1: {
            select: {
              userId: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          profile: {
            firstName: profileData.profile?.firstName,
            lastName: profileData.profile?.lastName,
            email: profileData.email,
          },
          posts: profileData.posts.map((post) => ({
            postId: post.postId,
            content: post.content,
            visible: post.visible,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          })),
          friends: [
            ...friendsAsUser1.map((friend) => friend.user2?.userId),
            ...friendsAsUser2.map((friend) => friend.user1?.userId),
          ],
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: profileId,
      },
      select: {
        profile: {
          select: {
            publicAccess: true,
          },
        },
        blockingUsers: {
          where: {
            blockingUserId: loggedInUser.id,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User doesn't exist`,
        data: {
          userDoesntExist: true,
        },
      });
    }

    if (user.blockingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are blocked by this user',
        data: {
          blockedByUser: true,
        },
      });
    }

    const profileData = await prisma.user.findUnique({
      where: {
        userId: profileId,
      },
      include: user.profile?.publicAccess
        ? {
            profile: true,
            posts: {
              take: 10,
              skip: 0,
              where: {
                visible: true,
              },
              orderBy: [
                {
                  createdAt: SortDirection.Desc,
                },
              ],
            },
          }
        : {
            profile: true,
          },
    });

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: `User doesn't exist`,
        data: {
          userDoesntExist: true,
        },
      });
    }

    const friendsAsUser1 = user.profile?.publicAccess
      ? await prisma.friend.findMany({
          where: { userId1: profileData.id },
          select: {
            user2: {
              select: {
                userId: true,
              },
            },
          },
        })
      : [];

    const friendsAsUser2 = user.profile?.publicAccess
      ? await prisma.friend.findMany({
          where: { userId2: profileData.id },
          select: {
            user1: {
              select: {
                userId: true,
              },
            },
          },
        })
      : [];

    if (profileData.profile?.publicAccess) {
      return res.status(200).json({
        success: true,
        data: {
          profile: {
            firstName: profileData.profile?.firstName,
            lastName: profileData.profile?.lastName,
          },
          // @ts-ignore
          posts: profileData.posts.map((post) => ({
            postId: post.postId,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          })),
          friends: [
            ...friendsAsUser1.map((friend) => friend.user2?.userId),
            ...friendsAsUser2.map((friend) => friend.user1?.userId),
          ],
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        profile: {
          firstName: profileData.profile?.firstName,
          lastName: profileData.profile?.lastName,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
