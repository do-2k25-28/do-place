import { Status } from '@oak/commons/status';
import { Middleware } from '@oak/oak';
import z, { ZodError } from '@zod/zod';

export default function (schema: z.ZodType): Middleware {
  return async (ctx, next) => {
    if (ctx.state.bodyType !== 'json')
      throw new Error('Cannot use zod validator on non JSON body');

    if (typeof ctx.state.body !== 'object')
      throw new Error(
        'body middleware must be used before validate middleware'
      );

    try {
      ctx.state.parsedBody = await schema.parseAsync(ctx.state.body);
    } catch (_error: unknown) {
      const error = _error as ZodError;
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        success: false,
        errors: JSON.parse(error.message),
      };
      return;
    }

    await next();
  };
}
