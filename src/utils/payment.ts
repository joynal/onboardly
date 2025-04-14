import { paymentApi } from '../config';

export const createCustomer = async (email: string) => {
    const response = await fetch(`${paymentApi}/customer/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    return (await response.json()) as Promise<{ customerId: string }>;
};

export const createSubscription = async (customerId: string, planId: string) => {
    const response = await fetch(`${paymentApi}/subscription/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, planId }),
    });

    return (await response.json()) as Promise<null>;
};
