import { Middleware } from '@oak/oak';

import { fromEnv } from '../utils/fromEnv.ts';

export const nodeId = crypto.randomUUID();

export const inCluster = fromEnv('CLUSTER', {
  defaultValue: false,
  allowDefaultValueInProd: true,
  type: Boolean,
});

export default function (): Middleware {
  return async (ctx, next) => {
    ctx.response.headers.set('X-Served-By', nodeId);
    await next();
  };
}
