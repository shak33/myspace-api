import { z } from 'zod';

export const userLoginValidation = z.object({
  email: z.string().min(2).max(100).email(),
  password: z.string().min(6).max(100),
});
