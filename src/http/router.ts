import { ZodSchema } from 'zod';
import { NextFunction, Request, Response, Router as ExpressRouter } from 'express';
import { validationMiddleware as validation } from '../middlewares/validation';

type Handler = (req: Request, res: Response, next: NextFunction) => void;

export type ParentRouteOptions = {
    prefix: string;
    security?: string[];
    component?: Record<string, unknown>;
};

export type RouteOptions = {
    method: 'GET' | 'POST' | 'PUT';
    path: string;
    summary?: string;
    description?: string;
    tags?: string[];
    security?: string[];
    request?: {
        params?: Record<string, ZodSchema>;
        body?: ZodSchema;
        query?: Record<string, ZodSchema>;
    };
    responses: Record<number, ZodSchema>;
    middlewares: Handler[];
    handler: Handler;
};

export const mapRoute = (router: ExpressRouter, routeOptions: RouteOptions): void => {
    const { method, path, middlewares, handler, request } = routeOptions;

    switch (method) {
        case 'GET':
            router.get(path, ...middlewares, validation(request), handler);
            break;
        case 'POST':
            router.post(path, ...middlewares, validation(request), handler);
            break;
        case 'PUT':
            router.put(path, ...middlewares, validation(request), handler);
            break;
        default:
            throw new Error(`Unsupported HTTP method: ${method as string}`);
    }
};

const inherit = (parent: ParentRouteOptions, route: RouteOptions) => {
    const path = parent.prefix ? `${parent.prefix}${route.path}` : route.path;
    return { ...route, path, security: (parent.security ?? []).concat(route.security ?? []) };
};

export const Router = (
    parentOptions: ParentRouteOptions,
): { setup: (routes: RouteOptions[]) => { router: ExpressRouter; routes: RouteOptions[] } } => {
    const router = ExpressRouter();

    return {
        setup: (routes: RouteOptions[]): { router: ExpressRouter; routes: RouteOptions[] } => {
            const updateRoutes = routes.map((route) => {
                const inheritedRoute = inherit(parentOptions, route);
                mapRoute(router, inheritedRoute);
                return inheritedRoute;
            });
            return { router, routes: updateRoutes };
        },
    };
};
