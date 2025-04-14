import { client } from '../db/client';

export const checkDatabase = async (): Promise<void> => {
    await client.query('SELECT NOW()');
};
