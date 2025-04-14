import { StatusCodes } from 'http-status-codes';
import * as userService from '../user/service';
import subscriptions from './subscriptionPlan.json';
import { HttpError } from '../http/httpErrors';
import * as paymentAPi from '../utils/payment';
import { logger } from '../logger';
import { Subscription } from '../schemas';

export const createSubscription = async (userId: string, planId: string) => {
    const user = await userService.getUserById(userId);

    if (!user) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const plan = subscriptions.find((plan) => plan.planId === planId) as Subscription;

    if (!plan) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Plan not found');
    }

    const customer = await paymentAPi.createCustomer(user.email);

    logger.info(customer, 'customer has been created');

    await userService.updateUser(userId, { ...customer, planId, plan });

    return await paymentAPi.createSubscription(customer.customerId, plan.planId);
};
