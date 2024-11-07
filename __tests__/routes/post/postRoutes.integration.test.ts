import { expect } from 'chai';
import { server } from 'globalSetup.mocha';
import request from 'supertest';

import { API_ROUTE_POST, postRoutes } from '@/routes/routes';
import { clearDatabaseUtil } from '@/tests/utils/clearDatabase.util';
import { createUserFactory } from '@/tests/factories/user/createUser.factory';
import { loginAndGetTokenUtil } from '@/tests/utils/loginAndGetToken.util';
import { createPostUtil } from '@/tests/routes/post/utils/createPost.util';

import postData from '@/tests/fixtures/post/postData.json';
import updatedPostData from '@/tests/fixtures/post/updatedPostData.json';

const USER_EMAIL = 'exampleofexample1234@gmail.com';

describe('ROUTE /api/v1/post', () => {
  describe(`${postRoutes.createPost} (POST)`, () => {
    let token: string;

    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
      token = await loginAndGetTokenUtil(server);
    });

    it('should return 400 with errored field content', async () => {
      const res = await createPostUtil({
        token,
        data: {
          content: '',
          visible: false,
        },
      });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields).to.have.property('content');
    });

    it('should return 201', async () => {
      const res = await createPostUtil({
        token,
        data: postData,
      });

      expect(res.status).to.equal(201);
      expect(res.body.data.post.content).to.equal(postData.content);
    });
  });

  describe(`${postRoutes.updatePost} (PUT)`, () => {
    let token: string;

    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
      await createUserFactory({
        email: USER_EMAIL,
      });
      token = await loginAndGetTokenUtil(server);
    });

    it('should return 400 with errored field content', async () => {
      const createPost = await createPostUtil({
        token,
        data: postData,
      });
      const { postId } = createPost.body.data.post;

      const res = await request(server)
        .put(
          `${API_ROUTE_POST}${postRoutes.updatePost.replace(':postId', postId)}`
        )
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: '',
        });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields).to.have.property('content');
    });

    it('should return 404 with not existing post', async () => {
      const res = await request(server)
        .put(
          `${API_ROUTE_POST}${postRoutes.updatePost.replace(':postId', 'uuid-1234')}`
        )
        .set('Authorization', `Bearer ${token}`)
        .send(postData);

      expect(res.status).to.equal(404);
    });

    it('should return 400 if editing user is different', async () => {
      const createPost = await createPostUtil({
        token,
        data: postData,
      });
      const { postId } = createPost.body.data.post;
      const secondUserToken = await loginAndGetTokenUtil(server, USER_EMAIL);
      const res = await request(server)
        .put(
          `${API_ROUTE_POST}${postRoutes.updatePost.replace(':postId', postId)}`
        )
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send(postData);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        'You are not an author of the post you are trying to edit'
      );
    });

    it('should return 200 on post edit', async () => {
      const createPost = await createPostUtil({
        token,
        data: postData,
      });
      const { postId } = createPost.body.data.post;
      const res = await request(server)
        .put(
          `${API_ROUTE_POST}${postRoutes.updatePost.replace(':postId', postId)}`
        )
        .set('Authorization', `Bearer ${token}`)
        .send(updatedPostData);

      expect(res.status).to.equal(200);
      expect(res.body.data.post.content).to.equal(updatedPostData.content);
    });
  });
});
