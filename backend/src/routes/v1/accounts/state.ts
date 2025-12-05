import { JWTPayload } from '@cross/jwt';
import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';

import { resetAuthCookie } from '../../../utils/cookies.ts';
import { verifyJWT } from '../../../utils/jwt.ts';

async function state(ctx: Context) {
  function response(connected: false): void;
  function response(connected: true, payload: JWTPayload): void;
  function response(connected: boolean, payload?: JWTPayload): void {
    if (!connected) resetAuthCookie(ctx);

    ctx.response.status = Status.OK;
    // If payload is undefined, values will be too and
    // oak will remove the fields in the final object
    ctx.response.body = { success: true, connected, userId: payload?.id };
  }
  const jwt = await ctx.cookies.get('jwt');
  if (!jwt) return response(false);

  const result = await verifyJWT(jwt);

  // This could be simplified into one line but then TypeScript complains
  if (result.valid) return response(true, result.payload);
  else return response(false);
}

export default function (router: Router) {
  router.get('/state', state);
}
