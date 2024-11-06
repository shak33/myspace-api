import { expect } from 'chai';
import { server } from 'globalSetup.mocha';
import request from 'supertest';

import { API_ROUTE_POST, postRoutes } from '@/routes/routes';
import { clearDatabaseUtil } from '@/tests/utils/clearDatabase.util';
import { createUserFactory } from '@/tests/factories/user/createUser.factory';
import { loginAndGetTokenUtil } from '@/tests/utils/loginAndGetToken.util';

describe('ROUTE /api/v1/post', () => {
  describe(`${postRoutes.createPost} (POST)`, () => {
    let token: string;

    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
      token = await loginAndGetTokenUtil(server);
    });

    it('should return 400 with errored field content', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_POST}${postRoutes.createPost}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: '',
        });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields).to.have.property('content');
    });

    it('should return 201', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_POST}${postRoutes.createPost}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Lorem Ipsum',
          visible: true,
        });

      expect(res.status).to.equal(201);
    });
  });
});
