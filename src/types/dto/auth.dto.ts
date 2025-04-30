import { z } from 'zod';

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const LoginSchema = SignupSchema;

export const ProfileUpdateSchema = z.object({
    name: z.string().optional(),
    defaultProvider: z.enum(['aws', 'gcp', 'azure']).optional(),
    preferences: z.object({
        theme: z.enum(['light', 'dark']).optional(),
        itemsPerPage: z.number().min(5).max(100).optional(),
        locale: z.string().optional(),
        dateFormat: z.string().optional(),
        defaultUploadFolderPath: z.string().optional(),
        notificationEmailEnabled: z.boolean().optional(),
    }).optional()
});

export type ProfileUpdateDto = z.infer<typeof ProfileUpdateSchema>;

export type SignupDto = z.infer<typeof SignupSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
