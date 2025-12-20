import { Context, Router, Status } from '@oak/oak';
import { resetAuthCookies } from '../../../utils/cookies.ts';

function logout(ctx: Context) {
  resetAuthCookies(ctx);
  ctx.response.status = Status.OK;
  ctx.response.body = { success: true };
}

export default function (router: Router) {
  router.post('/logout', logout);
}
