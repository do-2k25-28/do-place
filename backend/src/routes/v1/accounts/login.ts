import { Context, Router, Status } from '@oak/oak';
import { z } from '@zod/zod';

import * as accounts from '../../../db/accounts.ts';
import { body, validate } from '../../../middleware/index.ts';
import { verifyPassword } from '../../../utils/argon2.ts';
import { resetAuthCookie, setAuthCookie } from '../../../utils/cookies.ts';
import { httpError } from '../../../utils/httpError.ts';
import { createJWT } from '../../../utils/jwt.ts';

const schema = z.object({
  email: z.email(),
  password: z.string().min(4).max(128),
});

type Body = z.infer<typeof schema>;

async function login(ctx: Context) {
  const body = ctx.state.parsedBody as Body;

  const userId = await accounts.getUserIdByEmail(body.email);
  if (userId === null) {
    resetAuthCookie(ctx);
    ctx.response.status = Status.NotFound;
    ctx.response.body = httpError('user_not_found');
    return;
  }

  const password = await accounts.getUserPassword(userId);
  if (!password) throw new Error("password field doesn't exist!?");

  const validPassword = await verifyPassword(password, body.password);

  if (!validPassword) {
    resetAuthCookie(ctx);
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = httpError('invalid_password');
    return;
  }

  const jwt = await createJWT(userId);
  setAuthCookie(ctx, jwt);

  ctx.response.status = Status.OK;
  ctx.response.body = { success: true };
}

export default function (router: Router) {
  router.post('/login', body('json'), validate(schema), login);
}
