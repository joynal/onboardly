import * as Schemas from '../schemas';
import * as ctrl from './controller';
import { StatusCodes } from 'http-status-codes';
import { RouteOptions } from '../http/router';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth';

export default [
    {
        summary: 'Create user subscription',
        method: 'POST' as const,
        path: '/subscription/create',
        tags: ['subscription'],
        responses: {
            [StatusCodes.OK]: Schemas.HttpSuccessResponse,
            [StatusCodes.INTERNAL_SERVER_ERROR]: Schemas.HttpErrorResponse,
        },
        request: {
            body: Schemas.SubscriptionRequest,
        },
        middlewares: [authMiddleware],
        handler: ctrl.createSubscription,
    } as RouteOptions,
    {
        summary: 'Get subscription plans',
        method: 'GET' as const,
        path: '/subscription/list',
        tags: ['subscription'],
        request: {
            headers: {
                ['x-auth']: z.string(),
            },
        },
        responses: {
            [StatusCodes.OK]: Schemas.Subscription,
            [StatusCodes.INTERNAL_SERVER_ERROR]: Schemas.HttpErrorResponse,
        },
        middlewares: [],
        handler: ctrl.getSubscriptions,
    } as RouteOptions,
];
