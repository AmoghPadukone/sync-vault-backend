import { z } from 'zod';
export const ShareFileSchema = z.object({
  path: z.string().min(1, 'File path is required'),
  expiresIn: z.number().optional().default(60), // in minutes
});

export type ShareFileDto = z.infer<typeof ShareFileSchema>;

