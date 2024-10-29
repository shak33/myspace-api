import { Request, Response } from 'express';
import { prisma } from '@/db';
import { SortDirection } from '@/models/SortDirection.enum';
import { FilterParams } from '@/models/FilterParams.model';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      pageSize = '10',
      sortOrder = SortDirection.Desc,
    } = req.query as unknown as FilterParams<{}, {}>;
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const { profileId } = req.params;
    // @ts-ignore
    const { userId, id } = req.user;
    const authorId =
      profileId === userId
        ? id
        : (
            await prisma.user.findUnique({
              where: { userId: profileId },
            })
          )?.id;
    const isTheSameUser = () => {
      if (profileId === userId) {
        return undefined;
      }

      return true;
    };

    const posts = await prisma.post.findMany({
      take: parsedPageSize,
      skip: parsedPage === 1 ? 0 : parsedPage * parsedPageSize,
      where: {
        authorId,
        visible: isTheSameUser(),
      },
      orderBy: [
        {
          createdAt: sortOrder,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        posts: posts.map((post) => ({
          postId: post.postId,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
