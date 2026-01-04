import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';

import {
  canPlace,
  canvasEmitter,
  setPixel,
  setTimeout,
} from '../../../db/canvas.ts';
import { auth } from '../../../middleware/index.ts';
import { httpError } from '../../../utils/httpError.ts';
import { inCluster, nodeId } from '../../../middleware/cluster.ts';

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

    if (inCluster)
      ws.send(
        JSON.stringify({
          type: 'cluster',
          servedBy: nodeId,
        })
      );
  };

  ws.onmessage = async (event) => {
    try {
      if (typeof event.data !== 'string') return;
      const data = JSON.parse(event.data);

      if (data.type === 'place') {
        const userId = ctx.state.userId as string;

        if (await canPlace(userId)) {
          await Promise.all([
            setPixel(data.x, data.y, data.color),
            setTimeout(userId, 60),
          ]);
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'timed out' }));
        }
      }
    } catch (_) {
      ws.close(1007);
    }
  };

  ws.onclose = () => {
    connections.delete(ws);
  };
}

export default function (router: Router) {
  router.get('/gateway', auth(), gateway);
}
