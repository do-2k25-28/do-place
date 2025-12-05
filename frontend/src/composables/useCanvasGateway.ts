import { watch } from 'vue';

import { useAccountStore, useApi, useCanvas } from '@/composables';
import { Logger } from '@/utils';

const logger = new Logger('Gateway', '#00b7ff');

function canvasGateway() {
  const { getCanvasGateway } = useApi();
  const { setPixel } = useCanvas();
  const store = useAccountStore();

  let ws: WebSocket;

  const init = () => {
    // If we were connected, we get out of the timeout loop
    if (!store.connected) return;

    ws = getCanvasGateway();

    ws.onopen = (event: Event) => {
      logger.debug('Connected to gateway');
    };

    ws.onclose = (event) => {
      if ([1000].includes(event.code)) return;

      logger.error(
        'Abnormal connection closure',
        { code: event.code, reason: event.reason },
        'retrying in a few moments...',
      );

      setTimeout(init, 1000);
    };

    ws.onerror = (event: Event) => {
      // On error, we close if not already closed and we retry
      logger.error('An error occured, closing..', event);
      if (!ws.CLOSED) ws.close(4000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as { type: 'place'; x: number; y: number; color: number };
      if (data.type !== 'place') return;

      setPixel(data.x, data.y, data.color);
    };
  };

  init();

  return () => {
    logger.debug('Disconnecting gateway');
    ws.close();
  };
}

export function useCanvasGateway() {
  const store = useAccountStore();

  let close: (() => void) | undefined;

  const connect = () => {
    // If we login and not already connected, we open the gateway
    // If we logout, we close the gateway
    if (store.connected && typeof close !== 'function') close = canvasGateway();
    else if (typeof close === 'function') close();
  };

  watch(() => store.connected, connect);

  return { connectToGateway: connect };
}
