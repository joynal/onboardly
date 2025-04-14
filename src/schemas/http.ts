import * as z from 'zod';

export const HttpErrorResponse = z.object({ error: z.string() });

export const HttpSuccessResponse = z.literal('OK');
