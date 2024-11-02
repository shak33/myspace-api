import bcrypt from 'bcrypt';
import { prisma } from '@/db';
import registerUserData from '@/tests/fixtures/user/registerUser.json';

type UserType = {
  email?: string;
};

export const createUserFactory = async (user: UserType = {}) => {
  const hashedPassword = bcrypt.hashSync(registerUserData.password, 10);

  return prisma.user.create({
    data: {
      email: user.email ?? registerUserData.email,
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
