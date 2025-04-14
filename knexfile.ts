import { Knex } from 'knex';
import { dbConnectionString } from './src/config';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: dbConnectionString,
        migrations: {
            directory: './src/migrations',
            extension: 'ts',
        },
        seeds: {
            directory: './src/seeds',
        },
    },
};

export default config;
