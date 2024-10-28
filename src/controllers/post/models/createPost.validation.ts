import { z } from 'zod';

export const createPostValidation = z.object({
  content: z.string().min(3),
  visible: z.boolean(),
});
