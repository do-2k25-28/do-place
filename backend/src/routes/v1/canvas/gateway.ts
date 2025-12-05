import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';

import { canvasEmitter, setPixel } from '../../../db/canvas.ts';
import auth from '../../../middleware/auth.ts';
import { httpError } from '../../../utils/httpError.ts';

const connections = new Set<WebSocket>();

canvasEmitter.addListener('place', (ev) => {
  connections.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: 'place',
        x: ev.x,
        y: ev.y,
        color: ev.color,
      })
    );
  });
});

function gateway(ctx: Context) {
  if (!ctx.isUpgradable) {
    ctx.response.status = Status.NotImplemented;
    ctx.response.body = httpError('must_upgrade_to_ws');
    return;
  }

  const ws = ctx.upgrade();

  ws.onopen = () => {
    connections.add(ws);
  };

  ws.onmessage = async (event) => {
    try {
      if (typeof event.data !== 'string') return;
      const data = JSON.parse(event.data);

      if (data.type === 'place') {
        await setPixel(data.x, data.y, data.color);
      }
    } catch (_) {
      ws.close(1007);
    }
  };

  ws.onerror = (err) => {
    console.error('err', err);
  };

  ws.onclose = () => {
    connections.delete(ws);
  };
}

export default function (router: Router) {
  router.get('/gateway', auth(), gateway);
}
