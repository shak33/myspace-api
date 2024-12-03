import { z } from 'zod';

export const updatePostValidation = z.object({
  content: z.string().min(3).max(6400),
  visible: z.boolean(),
});
