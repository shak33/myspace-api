import bcrypt from 'bcrypt';
import { prisma } from '@/db';
import registerUserData from '@/tests/fixtures/user/registerUser.json';

export const createUserFactory = async () => {
  const hashedPassword = bcrypt.hashSync(registerUserData.password, 10);

  return await prisma.user.create({
    data: {
      email: registerUserData.email,
      password: hashedPassword,
      profile: {
        create: {
          firstName: registerUserData.firstName,
          lastName: registerUserData.lastName,
        },
      },
    },
  });
};
