import express from 'express';
import * as swagger from 'swagger-ui-express';
import * as config from './config';
import { Router } from './http/router';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from '../package.json';
import { genDoc } from './http/genDoc';
import healthRoutes from './health/routes';
import userRoutes from './user/routes';
import subscriptionRoutes from './subscription/routes';

const appRouter = express.Router();

const parentOptions = {
    prefix: '/api',
    security: ['apiKeyAuth'],
};

const { router, routes } = Router(parentOptions).setup([...healthRoutes, ...userRoutes, ...subscriptionRoutes]);

appRouter.use(router);

if (config.showApiDocs) {
    appRouter.use(
        '/docs',
        swagger.serve,
        swagger.setup(
            genDoc(routes, {
                title: 'Onboardly APIs',
                description: 'Onboardly APIs',
                version: version,
            }),
            {
                customCss: '.swagger-ui .topbar { display: none; }',
                swaggerOptions: {
                    persistAuthorization: true,
                },
            },
        ),
    );
}

export default appRouter;
