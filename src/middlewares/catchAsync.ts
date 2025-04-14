import { NextFunction, Request, Response } from 'express';

type AsyncCallback = (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export const catchAsync =
    (callback: AsyncCallback) =>
    (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(callback(req, res, next)).catch(next);
    };
