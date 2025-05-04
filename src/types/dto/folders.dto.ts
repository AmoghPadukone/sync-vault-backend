import { z } from 'zod';

export const CreateFolderSchema = z.object({
  path: z.string().min(1, 'Path is required').refine(p => p.endsWith('/'), 'Path must end with `/`'),
  name: z.string().min(1),
  tags: z.array(z.string()).optional(),
  intent: z.enum(['mydrive', 'archive']).default('archive'),
});

export type CreateFolderDto = z.infer<typeof CreateFolderSchema>;