import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';
import z from '@zod/zod';

import * as accounts from '../../../db/accounts.ts';
import { body, validate } from '../../../middleware/index.ts';
import { createRefreshToken, hashPassword } from '../../../utils/auth.ts';
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '../../../utils/cookies.ts';
import { httpError } from '../../../utils/httpError.ts';
import { createJWT } from '../../../utils/jwt.ts';

const schema = z.object({
  email: z.email(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(16, 'Username must be at most 16 characters')
    .regex(
      /^[A-Za-z0-9]{3,16}$/g,
      'Username may only contain letters and numbers'
    ),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(256, 'Password must be at most 256 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>\\\/]/,
      'Password must contain at least one special character'
    ),
});

type Body = z.infer<typeof schema>;

async function register(ctx: Context) {
  const body = ctx.state.parsedBody as Body;

  const existingUser = await accounts.getUserIdByEmail(body.email);

  if (existingUser !== null) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = httpError('user_already_exists');
    return;
  }

  const passwordHash = await hashPassword(body.password);
  const id = await accounts.createBasicUser(
    body.email,
    body.username,
    passwordHash
  );

  const jwt = await createJWT(id);
  setAccessTokenCookie(ctx, jwt);

  const { token, hash } = createRefreshToken();
  setRefreshTokenCookie(ctx, token);
  await accounts.addRefreshTokenHash(hash, id);

  ctx.response.body = { success: true, userId: id };
}

export default function (router: Router) {
  router.post('/register', body('json'), validate(schema), register);
}
