import { logger } from './logger';
import { stopServices } from './utils/terminate';

let receivedProcessSignals = 0;

const handleProcessSignal = async (signal: string): Promise<void> => {
    receivedProcessSignals++;
    logger.warn(`Process was shutdown with signal: ${signal}. To force exit, send ${signal} again.`);

    if (receivedProcessSignals > 1) {
        logger.warn(`Forcefully exiting the process`);
        process.exit(1);
    }

    await stopServices();
};

const unexpectedErrorHandler = async (error: Error): Promise<void> => {
    logger.error(error);
    await stopServices();
};

process.on('SIGTERM', handleProcessSignal);
process.on('SIGINT', handleProcessSignal);
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
