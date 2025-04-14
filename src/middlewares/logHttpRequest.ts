import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import * as crypto from 'node:crypto';

const logHttpRequest = (req: Request, res: Response, next: NextFunction) => {
    setImmediate(next);

    const id = crypto.randomBytes(8).toString('hex');
    const label = `${req.method} ${req.originalUrl}`;

    const { method, url, originalUrl, headers, query, params } = req;
    logger.info({ id, url, originalUrl, method, query, params, headers }, label);

    res.once('finish', () => {
        logger.info(
            { id, url, originalUrl, method, status: res.status, headers: res.getHeaders() },
            `${res.statusCode} ${res.statusMessage} ${label}`,
        );
    });
};

export default logHttpRequest;
