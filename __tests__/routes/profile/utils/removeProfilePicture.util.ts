import request from 'supertest';
import { server } from 'globalSetup.mocha';
import { API_ROUTE_PROFILE, profileRoutes } from '@/routes/routes';

export const removeProfilePictureUtil = async (token: string) =>
  await request(server)
    .delete(`${API_ROUTE_PROFILE}${profileRoutes.uploadProfilePicture}`)
    .set('Authorization', `Bearer ${token}`);
