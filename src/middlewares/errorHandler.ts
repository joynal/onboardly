import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { logger } from '../logger';
import { HttpError } from '../http/httpErrors';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const errorReportId = uuid();

    if (error instanceof HttpError) {
        logger.info({ err: error, errorReportId }, 'HttpError was caught by Error handler middleware');

        return res.status(error.statusCode).json({
            message: error.message,
            errorReportId,
        });
    }

    logger.fatal(
        { err: error, errorReportId },
        `Unknown Error was caught by Error handler middleware: ${error.message}`,
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Internal server error',
        errorReportId,
    });
};
