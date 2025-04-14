import { http } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

export const mockHttpCall = (method: 'get' | 'post', path: string, callback: Parameters<(typeof http)['get']>[1]) => {
    server.use(http[`${method}`](path, callback));
};
