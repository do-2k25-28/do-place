import { SecureCookieMapSetDeleteOptions } from '@oak/commons/cookie_map';

import { Context } from '@oak/oak';
import { expiresIn } from './jwt.ts';

// Only use secure cookies in production
const secure = Deno.env.get('NODE_ENV') === 'PRODUCTION';

const authCookieOptions: SecureCookieMapSetDeleteOptions = {
  httpOnly: true,
  maxAge: expiresIn,
  secure,
  path: '/api/v1',
  sameSite: 'strict',
};

export function setAuthCookie(ctx: Context, jwt: string) {
  ctx.cookies.set('jwt', jwt, authCookieOptions);
}

export function resetAuthCookie(ctx: Context) {
  ctx.cookies.delete('jwt', { ...authCookieOptions, expires: new Date(0) });
}
