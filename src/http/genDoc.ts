/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateSchema } from '@anatine/zod-openapi';
import { ZodSchema } from 'zod';

import { RouteOptions } from './router';

export type DocsInfo = {
    version: string;
    title: string;
    description: string;
};

/**
 * Converts a Zod schema to an OpenAPI schema object
 */
const getSchema = (schema: ZodSchema): { content: { [key: string]: any } } => {
    const oapSchema = generateSchema(schema);
    const contentType = oapSchema.type === 'string' ? 'text/plain' : 'application/json';
    return {
        content: {
            [contentType]: {
                schema: oapSchema,
            },
        },
    };
};

/**
 * Converts Express-style path params (/api/:id) to OpenAPI style (/api/{id})
 */
const convertPathParams = (path: string): string => {
    return path.replace(/:(\w+)/g, '{$1}');
};

/**
 * Maps request parameters to OpenAPI parameters
 */
const mapRequestParameters = (object: Record<string, ZodSchema> = {}, parameterType: 'path' | 'query'): any[] => {
    return Object.entries(object).map(([name, schema]) => ({
        name,
        in: parameterType,
        required: !schema.isNullable() && !schema.isOptional(),
        ...generateSchema(schema),
    }));
};

/**
 * Builds the OpenAPI spec paths object from route options
 */
const buildSpec = (routes: RouteOptions[]): Record<string, any> => {
    return routes.reduce((spec: Record<string, any>, route) => {
        const openApiPath = convertPathParams(route.path);

        if (!spec[openApiPath]) {
            spec[openApiPath] = {};
        }

        const routeSpec: Record<string, unknown> = {
            summary: route.summary,
            description: route.description,
            tags: route.tags,
        };

        if (route.security?.length) {
            routeSpec.security = route.security.map((sec) => ({ [sec]: [] }));
        }

        routeSpec.responses = Object.fromEntries(
            Object.entries(route.responses).map(([status, schema]) => [status, getSchema(schema)]),
        );

        const parameters = [
            ...mapRequestParameters(route.request?.params, 'path'),
            ...mapRequestParameters(route.request?.query, 'query'),
        ];

        if (parameters.length > 0) {
            routeSpec.parameters = parameters;
        }

        if (route.request?.body) {
            routeSpec.requestBody = getSchema(route.request.body);
        }

        spec[openApiPath][route.method.toLowerCase()] = routeSpec;
        return spec;
    }, {});
};

/**
 * Generates an OpenAPI document from route definitions
 */
export const genDoc = (
    routes: RouteOptions[],
    info: DocsInfo,
): {
    openapi: string;
    paths: Record<string, any>;
    info: DocsInfo;
    consumes: string[];
    components: {
        securitySchemes: Record<string, any>;
    };
} => ({
    info,
    openapi: '3.1.0',
    consumes: ['application/json'],
    paths: buildSpec(routes),
    components: {
        securitySchemes: {
            apiKeyAuth: {
                in: 'header',
                type: 'apiKey',
                name: 'x-auth',
                description: 'API key authorization',
            },
        },
    },
});
