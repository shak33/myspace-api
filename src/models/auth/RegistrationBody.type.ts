import { User, Profile } from '@prisma/client';

export type RegistrationBody = Pick<User, 'email' | 'password'> &
  Pick<Profile, 'firstName' | 'lastName'>;
