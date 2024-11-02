import request from 'supertest';
import { expect } from 'chai';
import { server } from 'globalSetup.mocha';
import { prisma } from '@/db';
import { User } from '@prisma/client';

import { API_ROUTE_USER, authRoutes, userRoutes } from '@/routes/routes';
import { clearDatabaseUtil } from '@/tests/utils/clearDatabase.util';
import { createUserFactory } from '@/tests/factories/user/createUser.factory';
import { loginAndGetTokenUtil } from '@/tests/utils/loginAndGetToken.util';
import loginUserData from '@/tests/fixtures/user/loginUser.json';

const USER_EMAIL = 'exampleofexample1234@gmail.com';

describe('ROUTE /api/v1/user', () => {
  describe(`${userRoutes.blockUser} (POST)`, async () => {
    let token: string;
    let loggedInUser: User | null;
    let userToInteractWith: User | null;
    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
      await createUserFactory({
        email: USER_EMAIL,
      });

      token = await loginAndGetTokenUtil(server);
      loggedInUser = await prisma.user.findUnique({
        where: {
          email: loginUserData.email,
        },
      });
      userToInteractWith = await prisma.user.findUnique({
        where: {
          email: USER_EMAIL,
        },
      });
    });

    it('should return 400 if user tries to block himself', async () => {
      if (!loggedInUser) {
        return;
      }

      const res = await request(server)
        .post(`${API_ROUTE_USER}/block/${loggedInUser.userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.be.equal(`You can't block yourself`);
    });

    it('should return 404 if user not found', async () => {
      const res = await request(server)
        .post(`${API_ROUTE_USER}/block/non-existing-userId`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.data.userDoesntExist).to.be.equal(true);
    });

    it('should return 200 on user block', async () => {
      if (!userToInteractWith) {
        return;
      }

      const res = await request(server)
        .post(`${API_ROUTE_USER}/block/${userToInteractWith.userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
    });

    it('should return 400 if user is already blocked', async () => {
      if (!loggedInUser || !userToInteractWith) {
        return;
      }

      const res = await request(server)
        .post(`${API_ROUTE_USER}/block/${userToInteractWith.userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.body.data.alreadyBlockedThisUser).to.be.equal(true);
    });
  });
});
