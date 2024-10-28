import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';

export const createPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { content, visible } = req.body;

    const createPost = await prisma.post.create({
      data: {
        userId,
        content,
        visible,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Post has been added',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
