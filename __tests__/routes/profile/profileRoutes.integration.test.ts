import request from 'supertest';
import { expect } from 'chai';
import { server } from 'globalSetup.mocha';

import { prisma } from '@/db';
import { API_ROUTE_PROFILE, profileRoutes } from '@/routes/routes';
import { createUserFactory } from '@/tests/factories/user/createUser.factory';
import { loginAndGetTokenUtil } from '@/tests/utils/loginAndGetToken.util';
import {
  PROFILE_PICTURE_MAX_FILE_SIZE,
  PROFILE_PICTURE_VALIDATION_IMAGE_TYPE,
  PROFILE_PICTURE_VALIDATION_IMAGE_SIZE,
} from '@/configs/profilePicture.config';
import sharp from 'sharp';

describe('ROUTE /api/v1/profile', () => {
  describe(profileRoutes.uploadProfilePicture, () => {
    before(async () => {
      await prisma.profilePicture.deleteMany();
      await prisma.profile.deleteMany();
      await prisma.user.deleteMany({});
      await createUserFactory();
    });

    it('should return 400 with file size validation error', async () => {
      const token = await loginAndGetTokenUtil(server);

      const largeFileBuffer = Buffer.alloc(PROFILE_PICTURE_MAX_FILE_SIZE + 1);

      const res = await request(server)
        .post(`${API_ROUTE_PROFILE}${profileRoutes.uploadProfilePicture}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('profilePicture', largeFileBuffer, {
          filename: 'large-image.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields.profilePicture).to.include(
        PROFILE_PICTURE_VALIDATION_IMAGE_SIZE
      );
    });

    it('should return 400 with file type validation error', async () => {
      const token = await loginAndGetTokenUtil(server);

      const invalidFileBuffer = Buffer.from(
        'This is a test file content',
        'utf-8'
      );

      const res = await request(server)
        .post(`${API_ROUTE_PROFILE}${profileRoutes.uploadProfilePicture}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('profilePicture', invalidFileBuffer, {
          filename: 'test-file.txt',
          contentType: 'text/plain',
        });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields.profilePicture).to.include(
        PROFILE_PICTURE_VALIDATION_IMAGE_TYPE
      );
    });

    it('should return 201 with success set to true', async () => {
      const token = await loginAndGetTokenUtil(server);

      const validFileBuffer = await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .jpeg({ quality: 80 })
        .toBuffer();

      const res = await request(server)
        .post(`${API_ROUTE_PROFILE}${profileRoutes.uploadProfilePicture}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('profilePicture', validFileBuffer, {
          filename: 'valid-image.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
    });
  });
});
