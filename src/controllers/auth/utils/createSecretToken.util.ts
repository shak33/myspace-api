import jwt from 'jsonwebtoken';

export const createSecretToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '24h',
  });
};
