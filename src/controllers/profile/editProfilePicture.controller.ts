import { uploadFileToS3Util } from '@/utils/uploadFileToS3.util';
import { removeFileFromS3Util } from '@/utils/removeFileFromS3.util';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/db';
import sharp from 'sharp';

export const editProfilePictureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const MAX_MB_FILE_SIZE = 10;
  const MAX_FILE_SIZE = 1024 * 1024 * MAX_MB_FILE_SIZE;
  const MAX_IMAGE_WIDTH = 1024;
  const MAX_IMAGE_HEIGHT = 1024;
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  try {
    const profilePicture = req.file;

    if (!profilePicture) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(profilePicture.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: {
          fields: {
            profilePicture: `Only .jpg, .jpeg, .webp, and .png formats are supported`,
          },
        },
      });
    }

    if (profilePicture.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: {
          fields: {
            profilePicture: `Max image size is ${MAX_MB_FILE_SIZE}MB`,
          },
        },
      });
    }

    const findPreviousProfilePicture = await prisma.profilePicture.findUnique({
      where: {
        // @ts-ignore
        profileId: req.user.profileId,
      },
    });

    if (findPreviousProfilePicture) {
      const result = await removeFileFromS3Util(findPreviousProfilePicture.key);

      if (typeof result === 'string') {
        return res.status(500).json({
          success: false,
          message: result,
        });
      }

      const deletePreviousProfilePicture = await prisma.profilePicture.delete({
        where: {
          // @ts-ignore
          profileId: req.user.profileId,
        },
      });
    }

    const compressedFileToUpload = await sharp(profilePicture.buffer)
      .resize({
        width: MAX_IMAGE_WIDTH,
        height: MAX_IMAGE_HEIGHT,
        fit: 'inside',
      })
      .jpeg({ quality: 80 })
      .toBuffer();
    const compressedFileToUploadSize = compressedFileToUpload.length;
    const finalFileToUpload = {
      ...profilePicture,
      data: compressedFileToUpload,
      mimetype: 'image/jpeg',
      size: compressedFileToUploadSize,
    };

    const result = await uploadFileToS3Util(finalFileToUpload);

    if (typeof result === 'string') {
      return res.status(500).json({
        success: false,
        message: result,
      });
    }

    const updateProfilePicture = await prisma.profilePicture.create({
      data: {
        url: result.Location,
        fileType: finalFileToUpload.mimetype.split('/')[1],
        size: finalFileToUpload.size,
        key: result.Key,
        // @ts-ignore
        profileId: req.user.profileId,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Picture has been updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
