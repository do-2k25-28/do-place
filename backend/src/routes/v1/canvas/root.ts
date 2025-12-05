import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';

import { getCanvas } from '../../../db/canvas.ts';

async function root(ctx: Context) {
  const canvas = await getCanvas();

  ctx.response.status = Status.OK;
  ctx.response.body = canvas;
  ctx.response.headers.set('Content-Type', 'application/octet-stream');
}

export default function (router: Router) {
  router.get('/', root);
}
