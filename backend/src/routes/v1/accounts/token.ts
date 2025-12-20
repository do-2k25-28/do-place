import { Context, Router } from '@oak/oak';

async function token(ctx: Context) {
  const refreshToken = ctx.cookies.get('refreshToken');
}

export default function (router: Router) {
  router.post('/token', token);
}
