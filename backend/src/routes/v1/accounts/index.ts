import { Router } from '@oak/oak';

import login from './login.ts';
import logout from './logout.ts';
import register from './register.ts';
import state from './state.ts';

const router = new Router();

login(router);
logout(router);
register(router);
state(router);

export default router;
