import { Buffer } from 'node:buffer';
import { createHash, randomBytes } from 'node:crypto';

import { hash, verify } from '@felix/argon2';

import { fromEnv } from './fromEnv.ts';

const defaultSecret = '6D7953757065725365637265744B6579';

const secret = Buffer.from(
  fromEnv('HASH_SECRET', {
    defaultValue: defaultSecret,
    warningMessage:
      'Hash secret not provided. Using default value. Please populate the HASH_SECRET environment variable for production deployments.',
    fileExtension: true,
  })
);

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, { secret });
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password, secret);
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest().toString('hex');
}

/**
 * Generates a random 522 bit string
 * @returns The refresh token and its sha256
 */
export function createRefreshToken(): { token: string; hash: string } {
  const token = randomBytes(64).toString('hex');

  return {
    token,
    hash: hashRefreshToken(token),
  };
}

// 30 days
export const refreshTokenTTL = 60 * 60 * 24 * 30;
