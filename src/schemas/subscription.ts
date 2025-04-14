import * as z from 'zod';

const BillingCycle = z.object({
    interval: z.enum(['month', 'year']),
    duration: z.number().positive(),
});

export const Subscription = z.object({
    planId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    currency: z.string(),
    features: z.array(z.string()),
    billingCycle: BillingCycle,
});

export const SubscriptionRequest = z.object({
    planId: z.string(),
    card: z.object({
        number: z.string(),
        expMonth: z.number().min(1).max(12),
        expYear: z.number().min(new Date().getFullYear()),
        cvc: z.string().length(3),
    }),
});

export type BillingCycle = z.infer<typeof BillingCycle>;
export type Subscription = z.infer<typeof Subscription>;
export type SubscriptionRequest = z.infer<typeof SubscriptionRequest>;
