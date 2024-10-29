import { z } from 'zod';

export const updatePostValidation = z.object({
  content: z.string().min(3),
  visible: z.boolean(),
});
