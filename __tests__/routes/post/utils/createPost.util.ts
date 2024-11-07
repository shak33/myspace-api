import request from 'supertest';
import { API_ROUTE_POST, postRoutes } from '@/routes/routes';
import { server } from 'globalSetup.mocha';

type CreatePost = {
  token: string;
  data: {
    content: string;
    visible: boolean;
  };
};

export const createPostUtil = async ({ token, data }: CreatePost) =>
  await request(server)
    .post(`${API_ROUTE_POST}${postRoutes.createPost}`)
    .set('Authorization', `Bearer ${token}`)
    .send(data);
