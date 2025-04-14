import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { version } from '../../package.json';
import { HealthStatus } from '../schemas';
import { checkDatabase } from './service';
import { logger } from '../logger';

export const platformHealth = async (req: Request, res: Response): Promise<void> => {
    try {
        await checkDatabase();
        res.status(StatusCodes.OK).json({ isOk: true, version } as unknown as HealthStatus);
    } catch (error) {
        logger.error(error);
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: 'service unavailable' });
    }
};
