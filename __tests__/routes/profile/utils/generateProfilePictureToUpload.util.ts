import sharp from 'sharp';

export const generateProfilePictureToUploadUtil = async () =>
  await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .jpeg({ quality: 80 })
    .toBuffer();
