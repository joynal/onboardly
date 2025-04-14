import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../middlewares/catchAsync';
import subscriptions from './subscriptionPlan.json';
import * as subscriptionService from './service';

export const createSubscription = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const subscriptionData = await subscriptionService.createSubscription(
        res.locals.userId as string,
        req.body.planId as string,
    );
    return res.status(StatusCodes.CREATED).json(subscriptionData);
});

export const getSubscriptions = (_: Request, res: Response) => {
    return res.status(StatusCodes.OK).json(subscriptions);
};
