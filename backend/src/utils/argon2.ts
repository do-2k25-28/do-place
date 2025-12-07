import { Buffer } from 'node:buffer';

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
