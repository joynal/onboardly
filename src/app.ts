import express, { Response } from 'express';
import cors from 'cors';
import appRouter from './router';
import * as config from './config';
import helmet from 'helmet';
import { requestIdMiddleware } from './middlewares/requestId';
import { errorHandler } from './middlewares/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { httpLogger } from './logger';

const app = express();
app.set('trust proxy', true);

app.use(httpLogger);

app.use(helmet());

app.use(
    cors({
        origin: config.allowOrigins,
        credentials: true,
    }),
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(requestIdMiddleware);

app.use(appRouter);

// NotFound handler
app.use((_, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).send({ message: 'Not Found' });
});

app.use(errorHandler);

export { app };
