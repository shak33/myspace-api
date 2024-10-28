import { Request, Response, NextFunction } from 'express';
import { removeFileFromS3Util } from '@/utils/removeFileFromS3.util';
import { prisma } from '@/db';

export const removeProfilePictureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const profileId = req.user.profileId;
    const profilePicture = await prisma.profilePicture.findUnique({
      where: {
        profileId,
      },
    });

    if (!profilePicture) {
      return res.status(410).json({
        success: false,
        message: `Logged in user doesn't have profile picture set`,
      });
    }

    const result = await removeFileFromS3Util(profilePicture.key);

    if (typeof result === 'string') {
      return res.status(500).json({
        success: false,
        message: result,
      });
    }

    const removeProfilePicture = await prisma.profilePicture.delete({
      where: {
        profileId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Picture has been removed',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
