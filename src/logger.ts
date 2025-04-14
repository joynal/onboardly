import pino from 'pino';
import pretty from 'pino-pretty';
import * as config from './config';
import pinoHttp from 'pino-http';
import { requestNamespace } from './utils/namespace';

const appName = '@onboardly/server';

const options = {
    level: config.logLevel,
    base: null,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        log: (obj: Record<string, unknown>) => {
            const requestId = requestNamespace.get('requestId') as string;
            return { ...obj, name: appName, requestId };
        },
    },
    messageKey: 'msg',
};

export let logger: pino.Logger = pino(options);

if (config.env === 'development') {
    const stream = pretty({
        colorize: true,
        colorizeObjects: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    });
    logger = pino(options, stream);
}

export const httpLogger = pinoHttp({
    logger,
    redact: {
        paths: ['req.headers["x-auth"]', 'req.headers.cookie'],
        censor: '[REDACTED]',
    },
});
