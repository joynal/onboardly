import * as Schemas from '../schemas';
import * as ctrl from './controller';
import { StatusCodes } from 'http-status-codes';
import { RouteOptions } from '../http/router';

export default [
    {
        summary: 'Returns platform health status',
        method: 'GET' as const,
        path: '/health',
        tags: ['health'],
        responses: {
            [StatusCodes.OK]: Schemas.HealthStatus,
            [StatusCodes.SERVICE_UNAVAILABLE]: Schemas.HttpErrorResponse,
        },
        middlewares: [],
        handler: ctrl.platformHealth,
    } as RouteOptions,
];
