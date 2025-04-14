import * as Schemas from '../schemas';
import * as ctrl from './controller';
import { StatusCodes } from 'http-status-codes';
import { RouteOptions } from '../http/router';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth';

export default [
    {
        summary: 'Get magic link token for login',
        method: 'POST' as const,
        path: '/user/magic-link',
        tags: ['user'],
        responses: {
            [StatusCodes.OK]: Schemas.HttpSuccessResponse,
            [StatusCodes.INTERNAL_SERVER_ERROR]: Schemas.HttpErrorResponse,
        },
        request: {
            body: z.object({
                email: z.string().email(),
            }),
        },
        middlewares: [],
        handler: ctrl.getMagicToken,
    } as RouteOptions,
    {
        summary: 'Get authentication token',
        method: 'GET' as const,
        path: '/user/login/:token',
        tags: ['user'],
        responses: {
            [StatusCodes.OK]: Schemas.LoginResponse,
            [StatusCodes.INTERNAL_SERVER_ERROR]: Schemas.HttpErrorResponse,
        },
        request: {
            params: {
                token: z.string(),
            },
        },
        middlewares: [],
        handler: ctrl.login,
    } as RouteOptions,
    {
        summary: 'Get user details',
        method: 'GET' as const,
        path: '/user/me',
        tags: ['user'],
        request: {
            headers: {
                ['x-auth']: z.string(),
            },
        },
        responses: {
            [StatusCodes.OK]: Schemas.UserPublic,
            [StatusCodes.INTERNAL_SERVER_ERROR]: Schemas.HttpErrorResponse,
        },
        middlewares: [authMiddleware],
        handler: ctrl.getUser,
    } as RouteOptions,
];
