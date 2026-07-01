import { z } from 'zod';

export const registerUserSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, 'Name is required')
            .min(2, 'Name must be at least 2 characters long')
            .max(50, 'Name cannot exceed 50 characters'),

        email: z.string()
            .min(1, 'Email is required')
            .email('Invalid email format'),

        role: z.enum(['student', 'mentor', 'admin']).optional(),
    }),
});