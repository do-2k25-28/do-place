import { Buffer } from 'node:buffer';
import { createClient, RESP_TYPES } from 'redis';

const client = createClient({
  url: 'redis://127.0.0.1:6379',
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
