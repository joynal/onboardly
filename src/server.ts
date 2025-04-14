import http from 'http';
import { app } from './app';
import * as config from './config';
import { dbConnectionString } from './config';
import { logger } from './logger';
import * as Db from './db/client';
import { setServer, stopServices } from './utils/terminate';
import * as process from 'node:process';

export default async (): Promise<void> => {
    logger.info('Bootstrapping application');

    try {
        await Db.setup(dbConnectionString);

        if (process.env.MSW === 'true') {
            const { server } = await import('./mocks');
            server.listen();
            logger.info('MWS server is running');
        }

        const server = http.createServer(app);

        server.headersTimeout = 61000;
        server.keepAliveTimeout = 60000;

        setServer(server);

        server.on('error', async (err: Error) => {
            logger.fatal({ err }, 'Http server error occurred');
            await stopServices();
        });

        server.listen(config.port, () => {
            logger.info({ port: config.port }, `Http server started`);
        });
    } catch (err) {
        logger.fatal({ err }, 'Failed to bootstrap application');
        await stopServices();
    }
};
