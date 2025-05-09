import { z } from 'zod';


// export const AdvancedSearchSchema = z.object({
//   fileName: z.string().optional(),
//   mimeType: z.string().optional(),
//   tag: z.string().optional(),
//   createdAt: z.string().optional(),
//   modifiedAt: z.string().optional(),
//   isFavorite: z.boolean().optional(),
//   sizeMin: z.number().optional(),
//   sizeMax: z.number().optional(),
//   sharedOnly: z.boolean().optional(),
// });
export const AdvancedSearchSchema = z.object({
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  tag: z.string().optional(),
  isFavorite: z.boolean().optional(),
  sizeMin: z.number().optional(),
  sizeMax: z.number().optional(),
  sharedOnly: z.boolean().optional(),
  createdBefore: z.string().datetime().optional(),
  createdAfter: z.string().datetime().optional(),
});

export type AdvancedSearchInput = z.infer<typeof AdvancedSearchSchema>;

export const RawSearchSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  directory: z.string().optional(),
  extension: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});
export type RawSearchInput = z.infer<typeof RawSearchSchema>;


export const SmartSearchSchema = z.object({
  query: z.string().min(2),
});






export type SmartSearchInput = z.infer<typeof SmartSearchSchema>;
