export const PROFILE_PICTURE_MAX_MB_FILE_SIZE = 10;
export const PROFILE_PICTURE_MAX_FILE_SIZE =
  1024 * 1024 * PROFILE_PICTURE_MAX_MB_FILE_SIZE;
export const PROFILE_PICTURE_MAX_IMAGE_WIDTH = 1024;
export const PROFILE_PICTURE_MAX_IMAGE_HEIGHT = 1024;
export const PROFILE_PICTURE_ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
export const PROFILE_PICTURE_VALIDATION_IMAGE_TYPE =
  'Only .jpg, .jpeg, .webp, and .png formats are supported';
export const PROFILE_PICTURE_VALIDATION_IMAGE_SIZE = `Max image size is ${PROFILE_PICTURE_MAX_MB_FILE_SIZE}MB`;
