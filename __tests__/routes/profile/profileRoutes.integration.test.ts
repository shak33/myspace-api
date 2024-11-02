import { expect } from 'chai';
import { server } from 'globalSetup.mocha';

import { profileRoutes } from '@/routes/routes';
import { createUserFactory } from '@/tests/factories/user/createUser.factory';
import { loginAndGetTokenUtil } from '@/tests/utils/loginAndGetToken.util';
import {
  PROFILE_PICTURE_MAX_FILE_SIZE,
  PROFILE_PICTURE_VALIDATION_IMAGE_TYPE,
  PROFILE_PICTURE_VALIDATION_IMAGE_SIZE,
} from '@/configs/profilePicture.config';
import { generateProfilePictureToUploadUtil } from '@/tests/routes/profile/utils/generateProfilePictureToUpload.util';
import { uploadProfilePictureUtil } from '@/tests/routes/profile/utils/uploadProfilePicture.util';
import { removeProfilePictureUtil } from '@/tests/routes/profile/utils/removeProfilePicture.util';
import { clearDatabaseUtil } from '@/tests/utils/clearDatabase.util';

describe('ROUTE /api/v1/profile', () => {
  describe(`${profileRoutes.uploadProfilePicture} (PUT)`, () => {
    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
    });

    it('should return 400 with file size validation error', async () => {
      const token = await loginAndGetTokenUtil(server);
      const largeFileBuffer = Buffer.alloc(PROFILE_PICTURE_MAX_FILE_SIZE + 1);
      const res = await uploadProfilePictureUtil({
        token,
        buffer: largeFileBuffer,
        fileName: 'large-image.jpg',
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
      const res = await uploadProfilePictureUtil({
        token,
        buffer: invalidFileBuffer,
        fileName: 'test-file.txt',
        contentType: 'text/plain',
      });

      expect(res.status).to.equal(400);
      expect(res.body.errors.fields.profilePicture).to.include(
        PROFILE_PICTURE_VALIDATION_IMAGE_TYPE
      );
    });

    it('should return 201 with success set to true', async () => {
      const token = await loginAndGetTokenUtil(server);
      const buffer = await generateProfilePictureToUploadUtil();
      const res = await uploadProfilePictureUtil({
        token,
        buffer,
        fileName: 'valid-image.jpg',
        contentType: 'image/jpeg',
      });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
    });
  });

  describe(`${profileRoutes.uploadProfilePicture} (DELETE)`, () => {
    before(async () => {
      await clearDatabaseUtil();
      await createUserFactory();
    });

    it(`should return 410 on profile picture removal, if there's no photo`, async () => {
      const token = await loginAndGetTokenUtil(server);
      const res = await removeProfilePictureUtil(token);

      expect(res.status).to.equal(410);
      expect(res.body.message).to.include(
        `Logged in user doesn't have profile picture set`
      );
    });

    it('should return 200 on profile picture removal that exists', async () => {
      const token = await loginAndGetTokenUtil(server);
      const buffer = await generateProfilePictureToUploadUtil();
      const uploadedProfilePicture = await uploadProfilePictureUtil({
        token,
        buffer,
        fileName: 'valid-image.jpg',
        contentType: 'image/jpeg',
      });
      const removedProfilePicture = await removeProfilePictureUtil(token);

      expect(uploadedProfilePicture.status).to.equal(201);
      expect(uploadedProfilePicture.body.success).to.be.true;
      expect(removedProfilePicture.status).to.equal(200);
      expect(removedProfilePicture.body.success).to.be.true;
    });
  });
});
