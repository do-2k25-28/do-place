import { Status } from '@oak/commons/status';
import { Context, Middleware, Router } from '@oak/oak';

import { getCanvas } from '../../../db/canvas.ts';
import { compress } from '../../../middleware/index.ts';
import { Boolean, fromEnv } from '../../../utils/fromEnv.ts';

async function root(ctx: Context) {
  const canvas = await getCanvas();

  ctx.response.status = Status.OK;
  ctx.response.body = canvas;
  ctx.response.headers.set('Content-Type', 'application/octet-stream');
}

const compressionEnabled = fromEnv('ENABLE_HTTP_COMPRESSION', {
  type: Boolean,
  allowDefaultValueInProd: true,
  defaultValue: true,
});

export default function (router: Router) {
  const middlewares: Middleware[] = [];

  if (compressionEnabled) middlewares.push(compress());

  // @ts-ignore Typescript validation broken
  router.get('/', ...middlewares, root);
}
