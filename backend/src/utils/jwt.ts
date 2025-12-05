import { JWTPayload, signJWT, validateJWT } from '@cross/jwt';

import { fromEnvWithDefault } from './fromEnvWithDefault.ts';

const secret = fromEnvWithDefault(
  'JWT_SECRET',
  'jwt',
  'JWT secret not provided. Using default value. Please populate the JWT_SECRET environment variable for production deployments.'
);

export const expiresInS = '2d';
export const expiresIn = 60 * 60 * 24 * 2;

export async function createJWT(id: string) {
  return await signJWT({ id }, secret, { expiresIn: expiresInS });
}

export async function verifyJWT(
  jwt: string
): Promise<{ valid: true; payload: JWTPayload } | { valid: false }> {
  try {
    const payload = await validateJWT(jwt, secret);
    return { valid: true, payload };
  } catch (_) {
    return { valid: false };
  }
}
