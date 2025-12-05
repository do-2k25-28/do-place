import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';
import z from '@zod/zod';

import * as accounts from '../../../db/accounts.ts';
import { body, validate } from '../../../middleware/index.ts';
import { hashPassword } from '../../../utils/argon2.ts';
import { setAuthCookie } from '../../../utils/cookies.ts';
import { httpError } from '../../../utils/httpError.ts';
import { createJWT } from '../../../utils/jwt.ts';

const schema = z.object({
  email: z.email(),
  username: z.string().regex(/^[A-Za-z0-9]{3,16}$/g),
  password: z.string().min(4).max(128),
});

type Body = z.infer<typeof schema>;

async function register(ctx: Context) {
  const body = ctx.state.parsedBody as Body;

  const existingUser = await accounts.getUserIdByEmail(body.username);

  if (existingUser !== null) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = httpError('user_already_exists');
    return;
  }

  const hash = await hashPassword(body.password);
  const id = await accounts.createBasicUser(body.email, body.username, hash);
  const jwt = await createJWT(id);

  setAuthCookie(ctx, jwt);
  ctx.response.body = { success: true };
}

export default function (router: Router) {
  router.post('/register', body('json'), validate(schema), register);
}
