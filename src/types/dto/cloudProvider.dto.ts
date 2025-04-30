import { z } from 'zod';
// types/common.ts
export const ProviderEnum = ['aws', 'azure', 'gcp'] as const;
export type ProviderType = typeof ProviderEnum[number];

export const AwsSchema = z.object({
    provider: z.literal('aws'),
    region: z.string(),
    bucketName: z.string(),
    credentials: z.object({
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
    }),
});

export const AzureSchema = z.object({
    provider: z.literal('azure'),
    accountName: z.string(),
    accountKey: z.string(),
    containerName: z.string(),
});

export const GcpSchema = z.object({
    provider: z.literal('gcp'),
    projectId: z.string(),
    bucketName: z.string(),
    keyFilename: z.string(), // this could be a path or full content
});

export const ConnectProviderSchema = z.discriminatedUnion('provider', [
    AwsSchema,
    AzureSchema,
    GcpSchema,
]);
export const UpdateProviderSchema = z.object({
    bucketName: z.string().optional(),
    region: z.string().optional(),
    accessKey: z.string().optional(),
    secretKey: z.string().optional(),

    accountName: z.string().optional(),
    accountKey: z.string().optional(),
    containerName: z.string().optional(),

    projectId: z.string().optional(),
    keyFilename: z.string().optional(),
});

export type UpdateProviderDto = z.infer<typeof UpdateProviderSchema>;
export type ConnectProviderDto = z.infer<typeof ConnectProviderSchema>;
