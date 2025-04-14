import { http, HttpResponse } from 'msw';
import { paymentApi } from '../config';

export const handlers = [
    http.post(`${paymentApi}/customer/create`, () => {
        return HttpResponse.json({
            customerId: '3b9f4b3d3b3d',
        });
    }),
    http.post(`${paymentApi}/subscription/create`, () => {
        return HttpResponse.json({
            subscriptionId: '3b9f4b3d3b3d',
        });
    }),
];
