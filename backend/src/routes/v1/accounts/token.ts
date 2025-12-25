import { Context, Router, Status } from '@oak/oak';

import { hashRefreshToken } from '../../../utils/auth.ts';
import { httpError } from '../../../utils/httpError.ts';
import { getUserIdByRefreshTokenHash } from '../../../db/accounts.ts';
import { createJWT } from '../../../utils/jwt.ts';
import { setAccessTokenCookie } from '../../../utils/cookies.ts';

async function token(ctx: Context) {
  const reject = (message?: string) => {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = httpError(message ?? 'unauthorized');
  };

  const refreshToken = await ctx.cookies.get('refreshToken');
  if (!refreshToken) return reject('no_refresh_token');

  const hash = hashRefreshToken(refreshToken);
  const userId = await getUserIdByRefreshTokenHash(hash);
  if (!userId) return reject('no_user_refresh_token');

  const token = await createJWT(userId);
  setAccessTokenCookie(ctx, token);

  ctx.response.status = Status.OK;
  ctx.response.body = { success: true };
}

export default function (router: Router) {
  router.post('/token', token);
}
