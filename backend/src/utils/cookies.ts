import { SecureCookieMapSetDeleteOptions } from '@oak/commons/cookie_map';

import { Context } from '@oak/oak';

import { refreshTokenTTL } from './auth.ts';
import { expiresIn } from './jwt.ts';

// Only use secure cookies in production
const secure = Deno.env.get('NODE_ENV') === 'PRODUCTION';

const accessTokenCookieOptions: SecureCookieMapSetDeleteOptions = {
  httpOnly: true,
  maxAge: expiresIn,
  secure,
  path: '/api/v1',
  sameSite: 'strict',
};

const refreshTokenCookieOptions: SecureCookieMapSetDeleteOptions = {
  ...accessTokenCookieOptions,
  path: '/api/v1/accounts/token',
  maxAge: refreshTokenTTL,
};

export function setAccessTokenCookie(ctx: Context, accessToken: string): void {
  ctx.cookies.set('token', accessToken, accessTokenCookieOptions);
}

export function resetAccessTokenCookie(ctx: Context): void {
  ctx.cookies.delete('token', {
    ...accessTokenCookieOptions,
    expires: new Date(0),
  });
}

export function setRefreshTokenCookie(
  ctx: Context,
  refreshToken: string
): void {
  ctx.cookies.set('refreshToken', refreshToken, refreshTokenCookieOptions);
}

export function resetRefreshTokenCookie(ctx: Context): void {
  ctx.cookies.delete('refreshToken', {
    ...refreshTokenCookieOptions,
    expires: new Date(0),
  });
}

export function resetAuthCookies(ctx: Context): void {
  resetAccessTokenCookie(ctx);
  resetRefreshTokenCookie(ctx);
}
