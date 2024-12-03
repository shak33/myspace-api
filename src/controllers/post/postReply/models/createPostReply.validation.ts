import { z } from 'zod';

export const createPostReplyValidation = z.object({
  content: z.string().min(3).max(800),
});
