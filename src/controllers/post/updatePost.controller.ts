import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const updatePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    const { content, visible } = req.body;
    const { postId } = req.params;

    const postToUpdate = await prisma.post.findUnique({
      where: {
        postId,
      },
    });

    if (!postToUpdate) {
      return res.status(404).json({
        success: false,
        message: `There's no post with such ID`,
      });
    }

    if (postToUpdate.authorId !== loggedInUser.id) {
      return res.status(400).json({
        success: false,
        message: 'You are not an author of the post you are trying to edit',
      });
    }

    const updatePost = await prisma.post.update({
      where: {
        id: postToUpdate.id,
      },
      data: {
        content,
        visible,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Post has been updated',
      data: {
        post: {
          id: postId,
          content,
          visible,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
