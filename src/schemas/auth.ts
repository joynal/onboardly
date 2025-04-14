import * as z from 'zod';

export const LoginResponse = z.object({
    accessToken: z.string().optional(),
});

export type LoginResponse = z.infer<typeof LoginResponse>;
