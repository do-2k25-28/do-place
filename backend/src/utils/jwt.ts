import {
  JWTExpiredError,
  JWTPayload,
  JWTValidationError,
  signJWT,
  validateJWT,
} from '@cross/jwt';

import { fromEnv } from './fromEnv.ts';

const secret = fromEnv('JWT_SECRET', {
  defaultValue: 'a-string-secret-at-least-256-bits-long',
  warningMessage:
    'JWT secret not provided. Using default value. Please populate the JWT_SECRET environment variable for production deployments.',
  fileExtension: true,
});

export const expiresInS = '1d';
export const expiresIn = 60 * 60 * 24 * 1;

export async function createJWT(id: string) {
  return await signJWT({ id }, secret, { expiresIn: expiresInS });
}

export async function verifyJWT(
  jwt: string
): Promise<
  { valid: true; payload: JWTPayload } | { valid: false; epxired: boolean }
> {
  try {
    const payload = await validateJWT(jwt, secret);
    return { valid: true, payload };
  } catch (error) {
    if (error instanceof JWTValidationError) {
      return { valid: false, epxired: error instanceof JWTExpiredError };
    }

    throw error;
  }
}
