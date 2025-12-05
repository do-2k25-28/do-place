import { Router } from '@oak/oak';

import accountsRouter from './accounts/index.ts';
import canvasRouter from './canvas/index.ts';

const v1Router = new Router();

v1Router.use('/accounts', accountsRouter.routes());
v1Router.use('/accounts', accountsRouter.allowedMethods());

v1Router.use('/canvas', canvasRouter.routes());
v1Router.use('/canvas', canvasRouter.allowedMethods());

export default v1Router;
