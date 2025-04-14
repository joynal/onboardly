import type { Knex } from 'knex';

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = 'DROP FUNCTION on_update_timestamp';

export const up = (knex: Knex): void => {
    knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
};

export const down = (knex: Knex): void => {
    knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
};
