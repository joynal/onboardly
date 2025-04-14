import * as z from 'zod';

export const HealthStatus = z.object({
    isOk: z.boolean(),
    version: z.number(),
});

export type HealthStatus = z.infer<typeof HealthStatus>;
