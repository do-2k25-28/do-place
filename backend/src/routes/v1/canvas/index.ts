import { Router } from '@oak/oak';
import { initCanvasEmitter } from '../../../db/canvas.ts';
import gateway from './gateway.ts';
import properties from './properties.ts';
import root from './root.ts';

const router = new Router();

await initCanvasEmitter();

properties(router);
root(router);
gateway(router);

export default router;
