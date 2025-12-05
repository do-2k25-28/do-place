import { EventEmitter } from 'node:events';

import { Buffer } from 'node:buffer';
import { getClient, getProxyClient } from './client.ts';

/**
 * This script exists so we can
 * create a string with an abitrary
 * size on the database without
 * sending the entire string over
 * the network
 *
 * ngl this was written using AI,
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

export async function getCanvas(): Promise<Buffer> {
  const client = await getProxyClient();

  return (
    ((await client.get('canvas:main')) as Buffer | null) ??
    (await initCanvas(1000, 1000))
  );
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

export const canvasEmitter: EventEmitter = new EventEmitter();

export async function initCanvasEmitter() {
  const client = await getClient();

  const subscriber = client.duplicate();
  await subscriber.connect();

  subscriber.subscribe('canvas:place', (msg) => {
    canvasEmitter.emit('place', JSON.parse(msg));
  });
}
