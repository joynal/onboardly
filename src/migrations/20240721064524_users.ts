import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<Knex.SchemaBuilder> => {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email').notNullable().unique();
        table.string('name', 30);
        table.string('plan_id', 15).defaultTo(null);
        table.string('customer_id', 30).defaultTo(null);
        table.jsonb('plan_snapshot').defaultTo(null);
        table.timestamps(true, true);
    });
};

export const down = async (knex: Knex): Promise<Knex.SchemaBuilder> => {
    return knex.schema.dropTableIfExists('users');
};
