import { z } from 'zod';

export const CreateFilesSchema = z.object({
  name: z.string(),
  isActive: z.boolean().optional(),
});

export const UploadFileSchema = z.object({
  destination: z.string().min(1),
  usePresignedUrl: z.boolean().default(false),
  expiration: z.number().optional(),
  resumable: z.boolean().optional(),
  chunkSize: z.number().optional(),
  tempResumableConfigPath: z.string().optional(),
  uploadIntent: z.enum(['mydrive', 'archive']).default('archive'),
  tags: z.array(z.string()).optional(),
});

export type UploadFileDto = z.infer<typeof UploadFileSchema>;

export const DeleteFileSchema = z.object({
  softDelete: z.coerce.boolean().optional().default(false),
  backupPrefix: z.string().optional(),
  multiple: z.coerce.boolean().optional().default(false),
  paths: z.array(z.string()).optional(), // required if multiple
});
export const GetFileMetadataSchema = z.object({
  includeCloud: z.coerce.boolean().optional().default(true),
});

export type GetFileMetadataDto = z.infer<typeof GetFileMetadataSchema>;
export type DeleteFileDto = z.infer<typeof DeleteFileSchema>;



export type CreateFilesDto = z.infer<typeof CreateFilesSchema>;

