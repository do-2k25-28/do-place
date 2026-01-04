import { Middleware } from '@oak/oak';

export default function (): Middleware {
  return async (ctx, next) => {
    const { method, url } = ctx.request;
    console.log(`${method} ${new URL(url).pathname}`);

    await next();
  };
}
