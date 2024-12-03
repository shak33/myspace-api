import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const createPostReplyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await prisma.post.findUnique({
      where: {
        postId,
      },
    });

    if (!post || !post.visible) {
      return res.status(400).json({
        success: false,
        message: 'Post not found',
      });
    }

    const newPostReply = await prisma.postReply.create({
      data: {
        postId: post.id,
        content,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Post reply has been added',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
