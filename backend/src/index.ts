import process from 'node:process';

import { Application, Router } from '@oak/oak';

import { cors, runtimeError, cluster } from './middleware/index.ts';
import v1Router from './routes/v1/index.ts';
import { fromEnv } from './utils/fromEnv.ts';

const inCluster = fromEnv('CLUSTER', {
  defaultValue: false,
  allowDefaultValueInProd: true,
  type: Boolean,
});

const app = new Application();

const router = new Router();

app.use(
  cors({
    origin: 'http://localhost:5173',
    allowCredentials: true,
    allowHeaders: ['Content-Type'],
  })
);
app.use(runtimeError);
if (inCluster) app.use(cluster());

router.use('/api/v1', v1Router.routes());
router.use('/api/v1', v1Router.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

let port = 80;

const envPort = process.env['PORT'];
if (envPort) port = Number(envPort);
else if (process.env.MODE !== 'production') port = 8000;

app.addEventListener('listen', () => {
  console.log('Server listening on port', port);
});

await app.listen({ port: port });
