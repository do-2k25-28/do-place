import process from 'node:process';

import { Application, Router } from '@oak/oak';

import { cors, runtimeError } from './middleware/index.ts';
import v1Router from './routes/v1/index.ts';

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

router.use('/api/v1', v1Router.routes());
router.use('/api/v1', v1Router.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.MODE === 'production' ? 80 : 8000;

app.addEventListener('listen', () => {
  console.log('Server listening on port', port);
});

await app.listen({ port: port });
