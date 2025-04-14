import * as z from 'zod';
import { Subscription } from './subscription';

export const UserCommon = z.object({
    id: z.string().uuid(),
    email: z.string(),
    name: z.string(),
});

export const UserPublic = UserCommon.extend({
    planId: z.string(),
    planDetails: Subscription,
    customerId: z.string(),
});

export const User = UserCommon.extend({
    planId: z.string(),
    planDetails: Subscription,
    customerId: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const UserRow = UserCommon.extend({
    plan_id: z.string(),
    plan_snapshot: z.string(),
    customer_id: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type User = z.infer<typeof User>;
export type UserPublic = z.infer<typeof UserPublic>;
export type UserRow = z.infer<typeof UserRow>;
