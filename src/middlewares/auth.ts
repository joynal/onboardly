import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../token/verifier';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { logger } from '../logger';
import * as config from '../config';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-auth'] as string;
    if (!token) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const verification = await verifyJwt(token, { signKey: config.onboardlySignKey });

    if (!verification.ok) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: ReasonPhrases.UNAUTHORIZED });
    }

    res.locals.userId = verification.value.userId;
    logger.info({ verification }, 'user verification passed');

    next();
};
