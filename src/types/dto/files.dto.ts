import { z } from 'zod';

export const CreateFilesSchema = z.object({
  name: z.string(),
  isActive: z.boolean().optional(),
});

export type CreateFilesDto = z.infer<typeof CreateFilesSchema>;

