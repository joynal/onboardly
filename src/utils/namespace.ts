import { createNamespace, getNamespace } from 'cls-hooked';

const NAMESPACE_NAME = 'request';

export const requestNamespace = getNamespace(NAMESPACE_NAME) || createNamespace(NAMESPACE_NAME);
