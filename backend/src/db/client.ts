import { Buffer } from 'node:buffer';
import { createClient, RESP_TYPES } from 'redis';
import { fromEnv } from '../utils/fromEnv.ts';

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
  defaultValue: undefined,
  type: Number,
  allowDefaultValueInProd: true,
});

const client = createClient({
  url: 'redis://127.0.0.1:6379',
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
