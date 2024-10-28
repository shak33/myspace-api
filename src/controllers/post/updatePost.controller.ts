import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const updatePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { content, visible } = req.body;
    const postId = parseInt(req.params.postId);

    const postToUpdate = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postToUpdate) {
      return res.status(410).json({
        success: false,
        message: `There's no post with such ID`,
      });
    }

    if (postToUpdate.authorId !== userId) {
      return res.status(400).json({
        success: false,
        message: 'You are not an author of the post you are trying to edit',
      });
    }

    const updatePost = await prisma.post.update({
      where: {
        id: postId,
        authorId: userId,
      },
      data: {
        content,
        visible,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Post has been updated',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
