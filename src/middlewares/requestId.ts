import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { requestNamespace } from '../utils/namespace';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const uuid = uuidv4();
    res.set('x-request-id', uuid);
    res.locals.requestId = uuid;

    requestNamespace.run(() => {
        requestNamespace.set('requestId', uuid);
        next();
    });
};
