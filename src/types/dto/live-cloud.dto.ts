import { z } from 'zod';


export const BrowseCloudSchema = z.object({
  prefix: z.string().optional(),
});

export const MetadataSchema = z.object({
  path: z.string().min(1, 'Path is required'),
});

export type BrowseCloudDto = z.infer<typeof BrowseCloudSchema>;
export type MetadataDto = z.infer<typeof MetadataSchema>;