import request from 'supertest';
import { expect } from 'chai';
import { server } from 'globalSetup.mocha';

import { API_ROUTE_AUTH, authRoutes } from '@/routes/routes';
import { createUserFactory } from '@/tests/factories/user/createUser.factory';

import registerUserData from '@/tests/fixtures/user/registerUser.json';
import loginUserData from '@/tests/fixtures/user/loginUser.json';
import { clearDatabaseUtil } from '@/tests/utils/clearDatabase.util';

describe('ROUTE /api/v1/auth', () => {
  describe(authRoutes.register, () => {
    before(async () => {
      await clearDatabaseUtil();
    });

    it(`should return 400 with errored field email - email validation error`, async () => {
      const res = await request(server)
        .post(`${API_ROUTE_AUTH}${authRoutes.register}`)
        .send({
          ...registerUserData,
          email: 'email',
        });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields[0]).to.have.property('email');
    });

    it(`should return 400 with errored field email - domain doesn't exist`, async () => {
      const res = await request(server)
        .post(`${API_ROUTE_AUTH}${authRoutes.register}`)
        .send({
          ...registerUserData,
          email: 'john123@doejohndoejohn.com',
        });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields[0]).to.have.property('email');
    });

    it('should return 201 with token', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_AUTH}${authRoutes.register}`)
        .send(registerUserData);

      expect(res.status).to.equal(201);
      expect(res.body.data).to.have.property('token');
    });

    it('should return 409 with success set to false', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_AUTH}${authRoutes.register}`)
        .send(registerUserData);

      expect(res.status).to.equal(409);
      expect(res.body).to.have.property('success').equal(false);
    });
  });

  describe(authRoutes.login, () => {
    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
    });

    it('should return 200 with token', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_AUTH}${authRoutes.login}`)
        .send(loginUserData);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token');
    });

    it('should return 401 with success set to false', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_AUTH}${authRoutes.login}`)
        .send({
          ...loginUserData,
          password: 'passsword',
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success').equal(false);
    });
  });
});
