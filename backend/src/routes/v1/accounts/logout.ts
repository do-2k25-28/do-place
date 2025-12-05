import { Context, Router, Status } from '@oak/oak';
import { resetAuthCookie } from '../../../utils/cookies.ts';

function logout(ctx: Context) {
  resetAuthCookie(ctx);
  ctx.response.status = Status.OK;
  ctx.response.body = { success: true };
}

export default function (router: Router) {
  router.post('/logout', logout);
}
