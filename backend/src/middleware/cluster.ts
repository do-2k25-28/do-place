import { Middleware } from '@oak/oak';

const nodeId = crypto.randomUUID();

export default function (): Middleware {
  return async (ctx, next) => {
    ctx.response.headers.set('X-Served-By', nodeId);
    await next();
  };
}
