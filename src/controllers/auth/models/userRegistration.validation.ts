import { z } from 'zod';

export const userRegistrationValidation = z.object({
  email: z.string().min(2).max(100).email(),
  password: z.string().min(6),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});
