import { Status } from '@oak/commons/status';
import { BodyType, Middleware } from '@oak/oak';

export default function (type: BodyType): Middleware {
  return async (ctx, next) => {
    const bodyType = ctx.request.body.type();

    if (bodyType !== type) {
      ctx.response.status = Status.UnsupportedMediaType;
      ctx.response.body = {
        success: false,
        error: 'body must be' + type,
      };
      return;
    }

    try {
      if (bodyType === 'json') {
        ctx.state.body = await ctx.request.body.json();
        ctx.state.bodyType = bodyType;
      }
    } catch (_) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        success: false,
        error: 'malformed json',
      };
      return;
    }

    await next();
  };
}
