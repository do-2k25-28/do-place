import { Status } from '@oak/commons/status';
import { Middleware } from '@oak/oak';

import { httpError } from '../utils/httpError.ts';
import { verifyJWT } from '../utils/jwt.ts';

export default function (): Middleware {
  return async (ctx, next) => {
    const reject = () => {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = httpError('unauthorized');
    };

    const jwt = await ctx.cookies.get('jwt');
    if (!jwt) return reject();

    const verif = await verifyJWT(jwt);
    if (!verif.valid) return reject();

    ctx.state.userId = verif.payload.id;

    await next();
  };
}
