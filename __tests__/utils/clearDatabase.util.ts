import { prisma } from '@/db';

export const clearDatabaseUtil = async () => {
  await prisma.blockedUser.deleteMany();
  await prisma.friend.deleteMany();
  await prisma.post.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.profilePicture.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany({});
};
