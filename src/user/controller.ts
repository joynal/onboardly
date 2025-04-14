import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { LoginResponse, User } from '../schemas';
import { getUserById, findOrCreateUser, sendMagicLink } from './service';
import { issueJwt } from '../token/issuer';
import { verifyJwt } from '../token/verifier';
import * as config from '../config';
import { catchAsync } from '../middlewares/catchAsync';
import { logger } from '../logger';

export const getUser = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const user = await getUserById(res.locals.userId as string);

    if (user) {
        logger.info({ user }, 'user found');
        return res.status(StatusCodes.OK).json({
            id: user.id,
            email: user.email,
            name: user.name,
            planId: user.planId,
            planDetails: user.planDetails,
            customerId: user.customerId,
        } as User);
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({ error: ReasonPhrases.UNAUTHORIZED });
});

export const login = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.params;
    const verification = await verifyJwt(token, { signKey: config.onboardlySignKey });

    if (!verification.ok) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: ReasonPhrases.UNAUTHORIZED });
    }

    const { userId } = verification.value as { userId: string };
    const user = await getUserById(userId);

    if (user) {
        const accessToken = await issueJwt(
            { userId: user.id },
            {
                expiresIn: '1d',
                signKey: config.onboardlySignKey,
            },
        );

        if (accessToken.ok) {
            return res.status(StatusCodes.OK).json({ accessToken: accessToken.value } as LoginResponse);
        }
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({ error: ReasonPhrases.UNAUTHORIZED });
});

export const getMagicToken = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body as { email: string };
    const user = await findOrCreateUser(email);

    const jwtToken = await issueJwt(
        { userId: user.id, meta: { issuer: 'onboardly' } },
        {
            expiresIn: '1h',
            signKey: config.onboardlySignKey,
        },
    );

    if (jwtToken.ok) {
        sendMagicLink(jwtToken.value);
        return res.sendStatus(StatusCodes.OK);
    }

    logger.error({ error: jwtToken.error }, 'Error issuing JWT token');

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
});
