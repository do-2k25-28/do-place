import { Status } from '@oak/commons/status';
import { Middleware } from '@oak/oak';

import { httpError } from '../utils/httpError.ts';
import { verifyJWT } from '../utils/jwt.ts';

export default function (): Middleware {
  return async (ctx, next) => {
    const reject = (message?: string) => {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = httpError(message ?? 'unauthorized');
    };

    const jwt = await ctx.cookies.get('token');
    if (!jwt) return reject('no_cookie');

    const verif = await verifyJWT(jwt);
    if (!verif.valid)
      return reject(verif.epxired ? 'token_expired' : 'invalid_token');

    ctx.state.userId = verif.payload.id;

    await next();
  };
}
