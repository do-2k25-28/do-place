import { hash, verify } from '@felix/argon2';

import { Buffer } from 'node:buffer';
import { fromEnvWithDefault } from './fromEnvWithDefault.ts';

const defaultSecret = '6D7953757065725365637265744B6579';

const secret = Buffer.from(
  fromEnvWithDefault(
    'HASH_SECRET',
    defaultSecret,
    'Hash secret not provided. Using default value. Please populate the HASH_SECRET environment variable for production deployments.'
  )
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
