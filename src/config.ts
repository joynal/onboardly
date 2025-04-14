import processEnv from './env';

export const logLevel = processEnv.LOG_LEVEL;
export const env = processEnv.NODE_ENV;
export const port = processEnv.PORT;
export const allowOrigins = processEnv.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
export const showApiDocs = processEnv.SHOW_API_DOCS;
export const dbConnectionString = processEnv.DB_CONNECTION_STRING;
export const onboardlySignKey = processEnv.ONBOARDLY_SIGN_KEY;
export const paymentApi = processEnv.PAYMENT_API;
