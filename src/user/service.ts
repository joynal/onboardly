import { sql } from '../db/sqlTag';
import { client as dbClient } from '../db/client';
import { Subscription, User, UserRow } from '../schemas';
import { logger } from '../logger';

const mapUser = (user: UserRow): User => ({
    id: user.id,
    email: user.email,
    name: user.name,
    planId: user.plan_id,
    planDetails: JSON.parse(user.plan_snapshot) as User['planDetails'],
    customerId: user.customer_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
});

export const getUserById = async (id: string) => {
    const result = await dbClient.query<UserRow>(sql`SELECT *
                                                     FROM users
                                                     WHERE id = ${id}`);
    return (result.rows[0] && mapUser(result.rows[0])) || null;
};

export const getUserByEmail = async (email: string) => {
    const result = await dbClient.query<UserRow>(sql`SELECT *
                                                     FROM users
                                                     WHERE email = ${email}`);
    return (result.rows[0] && mapUser(result.rows[0])) || null;
};

const createUser = async (email: string) => {
    const result = await dbClient.query<UserRow>(sql`INSERT INTO users (email)
                                                     VALUES (${email}) RETURNING *`);
    return mapUser(result.rows[0]);
};

export const findOrCreateUser = async (email: string): Promise<User> => {
    const userExists = await getUserByEmail(email);

    if (userExists) {
        return { ...userExists };
    }

    return createUser(email);
};

export const updateUser = async (
    userId: string,
    { customerId, planId, plan }: { customerId: string; planId: string; plan: Subscription },
) => {
    const result = await dbClient.query<UserRow>(
        sql`UPDATE users
            SET customer_id = ${customerId},
                plan_id=${planId},
                plan_snapshot = ${plan}
            WHERE id = ${userId}`,
    );
    return (result.rows[0] && mapUser(result.rows[0])) || null;
};

export const sendMagicLink = (token: string) => {
    // Abstract away the email sending logic, Ideally this can be queued and executed in the background
    logger.info({ token }, 'Here is magic token');
};
