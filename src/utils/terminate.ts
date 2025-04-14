import { Server } from 'http';
import { logger } from '../logger';

let servicesStopping = false;
let server: Server | null = null;

export const setServer = (value: Server): void => {
    server = value;
};

const closeHttpServer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (server) {
            server.close((err) => {
                if (err) {
                    logger.error(err, 'Error while closing http server:');
                    reject(err);
                } else {
                    logger.info('Http server closed successfully');
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
};

const exitApplication = async (code = 0): Promise<void> => {
    await logger.info(`Exiting application with exit code ${code}`);
    process.exit(code);
};

export const stopServices = async (exitAfterClose = true): Promise<void> => {
    if (servicesStopping) {
        return;
    }

    servicesStopping = true;
    logger.info('Stopping all services');

    try {
        const { closeConnection: closeDatabaseConnection } = await import('../db/client');

        await closeHttpServer();
        await closeDatabaseConnection();

        if (exitAfterClose) {
            await exitApplication(0);
        }
    } catch (err) {
        logger.error(err, 'Error gracefully shutting down');
        await exitApplication(1);
    }
};
