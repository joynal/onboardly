import * as z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { logger } from '../logger';
import { RouteOptions } from '../http/router';

export const validationMiddleware =
    (schemas?: RouteOptions['request']) =>
    (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            if (schemas?.body) {
                req.body = schemas.body.parse(req.body) as typeof schemas.body;
            }
            if (schemas?.params) {
                req.params = z.object(schemas.params).parse(req.params);
            }
            if (schemas?.query) {
                req.query = z.object(schemas.query).parse(req.query);
            }
            next();
        } catch (err) {
            const requestId = (res.locals.requestId as string) ?? 'unknown-request-id';
            logger.warn({ err, requestId }, 'Request data is not valid');

            if (err instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message: JSON.parse(err.message) as Record<string, unknown>,
                    errorCode: ReasonPhrases.BAD_REQUEST,
                    errorReportId: requestId,
                });
            }
        }
    };
