import { z } from 'zod';
import * as process from 'node:process';

process.loadEnvFile();

const envSchema = z.object({
    LOG_LEVEL: z.string().default('info'),
    PORT: z.coerce.number().default(3010),
    NODE_ENV: z.string().default('development'),
    ALLOWED_ORIGINS: z.string().default(''),
    SHOW_API_DOCS: z
        .string()
        .transform((val) => val === 'true')
        .default('false'),
    DB_CONNECTION_STRING: z.string(),
    ONBOARDLY_SIGN_KEY: z.string(),
    PAYMENT_API: z.string(),
});
const env = envSchema.parse(process.env);

export default env;
