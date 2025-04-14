import { Client } from 'pg';
import { URL } from 'url';
import { logger } from '../logger';
import { stopServices } from '../utils/terminate';

let client: Client;

export const setup = async (connectionString: string): Promise<void> => {
    client = new Client({ connectionString });
    const { hostname, port } = new URL(connectionString);

    try {
        await client.connect();
        await logger.info({ hostname, port }, 'Connected to Postgres');
    } catch (err) {
        await logger.fatal({ err }, 'Unexpected error on db client');
        await stopServices();
    }
};

export const closeConnection = async (): Promise<void> => {
    if (!client) {
        logger.info('No database connections found, nothing to close');
        return;
    }

    await client.end();
    logger.info('Database connections closed successfully');
};

export { client };
