import request from 'supertest';
import { server } from 'globalSetup.mocha';
import { API_ROUTE_PROFILE, profileRoutes } from '@/routes/routes';

type UploadProfilePicture = {
  token: string;
  buffer: Buffer;
  fileName: string;
  contentType: string;
};

export const uploadProfilePictureUtil = async ({
  token,
  buffer,
  fileName,
  contentType,
}: UploadProfilePicture) =>
  await request(server)
    .put(`${API_ROUTE_PROFILE}${profileRoutes.uploadProfilePicture}`)
    .set('Authorization', `Bearer ${token}`)
    .attach('profilePicture', buffer, {
      filename: fileName,
      contentType,
    });
