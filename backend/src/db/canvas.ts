import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';

import { getClient, getProxyClient } from './client.ts';

/**
 * This script exists so we can
 * create a string with an abitrary
 * size on the database without
 * sending the entire string over
 * the network
 *
 * ngl this was made using AI,
 * cba to do lua
 */
const createNullBytesScript = `
  local key = KEYS[1]
  local size = tonumber(ARGV[1])
  local nullByte = string.char(0)
  local result = string.rep(nullByte, size)
  redis.call('SET', key, result)
  return size
`;

async function initCanvas(width: number, height: number) {
  if (width % 2 !== 0)
    throw new Error('canvas width must be a multiple of two');

  const client = await getClient();

  const bufferSize = (width / 2) * height;
  client.eval(createNullBytesScript, {
    keys: ['canvas:main'],
    arguments: [bufferSize.toString()],
  });

  return Buffer.alloc(bufferSize);
}

let canvasCache: Buffer;

export async function getCanvas(): Promise<Buffer> {
  if (canvasCache) return canvasCache;

  const client = await getProxyClient();

  canvasCache =
    ((await client.get('canvas:main')) as Buffer | null) ??
    (await initCanvas(1000, 1000));

  return canvasCache;
}

export async function setPixel(x: number, y: number, color: number) {
  if (
    !(x >= 0 && x <= 1000 && y >= 0 && y <= 1000 && color >= 0 && color <= 15)
  )
    throw new Error('out of bounds');

  const client = await getClient();

  const offset = x * 4 + y * 1000 * 4;

  await client.bitField('canvas:main', [
    { operation: 'SET', encoding: 'u4', offset, value: color },
  ]);
  await client.publish('canvas:place', JSON.stringify({ x, y, color }));
}

export async function canPlace(userId: string): Promise<boolean> {
  const client = await getClient();
  const val = await client.get(`timeout:${userId}`);
  return val === null;
}

/**
 * Sets a timeout for the given user
 * @param userId Identifier of the user to set the timeout for
 * @param timeout Timeout in seconds (not a timestamp) (e.g. `5` for five seconds from now)
 */
export async function setTimeout(
  userId: string,
  timeout: number
): Promise<void> {
  const client = await getClient();

  client.set(`timeout:${userId}`, 1, {
    expiration: { type: 'EX', value: timeout },
  });
}

export const canvasEmitter: EventEmitter = new EventEmitter();

export async function initCanvasEmitter() {
  const client = await getClient();

  const subscriber = client.duplicate({
    socket: {
      keepAlive: true,
      keepAliveInitialDelay: 10,
    },
  });

  subscriber.on('error', (err: Error) => {
    console.error('Redis subscriber error:', err);
  });

  subscriber.on('reconnecting', () => {
    console.log('Redis subscriber reconnecting...');
  });

  subscriber.on('end', () => {
    console.log('Redis subscriber connection ended');
  });

  await subscriber.connect();

  subscriber.subscribe('canvas:place', async (msg) => {
    if (!canvasCache) await getCanvas();

    const payload = JSON.parse(msg);
    canvasEmitter.emit('place', payload);

    const offset = Math.trunc(payload.x / 2) + payload.y * (1000 / 2);

    canvasCache[offset] =
      payload.x % 2 === 0
        ? (canvasCache[offset] =
            (canvasCache[offset] & 0x0f) + (payload.color << 4))
        : (canvasCache[offset] & 0xf0) + payload.color;
  });
}
