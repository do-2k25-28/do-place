import { Buffer } from 'node:buffer';
import { createClient, RESP_TYPES } from 'redis';
import { fromEnv } from '../utils/fromEnv.ts';

const host = fromEnv('REDIS_HOST');

const port = fromEnv('REDIS_PORT', {
  defaultValue: 6379,
  allowDefaultValueInProd: true,
  type: Number,
});

const username = fromEnv('REDIS_USER', {
  defaultValue: '',
  warningMessage:
    'Using default redis user. Consider changing that in production.',
});

const password = fromEnv('REDIS_PASSWORD', {
  defaultValue: '',
  fileExtension: true,
  warningMessage:
    'Redis authentication not enabled, consider using a password in production.',
});

const database = fromEnv('REDIS_DB', {
  defaultValue: 0,
  type: Number,
  allowDefaultValueInProd: true,
});

const client = createClient({
  url: `redis://${host}:${port}`,
  username,
  password,
  database,
});

let connected = false;

export async function getClient() {
  if (!connected) {
    await client.connect();
    connected = true;
  }

  return client;
}

export async function getProxyClient() {
  const client = await getClient();
  return client.withCommandOptions({
    typeMapping: {
      [RESP_TYPES.BLOB_STRING]: Buffer,
    },
  });
}
