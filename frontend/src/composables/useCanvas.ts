import { watch, type Ref } from 'vue';

import { useApi, useCanvasStore } from '@/composables';
import { Color, Logger } from '@/utils';

const logger = new Logger('Canvas', '#ea00ff');

// This "global initialization" is not friendly with the hot reload feature of Vite
// You might need to refresh the page entirely
let initialized = false;
const backCanvas = document.createElement('canvas');
const updateQueue: { x: number; y: number; color: number }[] = [];
let canvas: HTMLCanvasElement;

export function useCanvas() {
  const store = useCanvasStore();
  const api = useApi();

  let colorCache: Color[] = [];

  watch(
    () => store.colors,
    (colors) => (colorCache = colors.map(({ hex }) => Color.fromRGBHexString(hex))),
    { immediate: true },
  );

  const initializeCanvas = async (_canvas?: Ref<HTMLCanvasElement | null>) => {
    if (initialized) throw new Error('Canvas already initialized');
    if (!_canvas?.value) throw new Error('Must provide HTMLCanvasElement on Canvas initialization');
    canvas = _canvas.value;

    logger.debug(`Initializing canvas (${store.width}x${store.height})`);

    backCanvas.width = store.width;
    backCanvas.height = store.height;

    const backContext = backCanvas.getContext('2d')!;

    const canvasData = new Uint8Array(await api.getCanvas());
    const canvasImage = initializePixels(canvasData);

    backContext.putImageData(canvasImage, 0, 0);

    for (const { x, y, color } of updateQueue) {
      _setPixel(x, y, color, true);
    }
    updateQueue.length = 0;
  };

  const initializePixels = (canvasData: Uint8Array) => {
    // 4 bytes: Red, Green, Blue, Alpha
    const pixels = new Uint8ClampedArray(store.width * store.height * 4);

    const loadStart = performance.now();

    for (let i = 0; i < canvasData.length; i++) {
      const byte = canvasData[i]!;

      const color1 = colorCache[byte >> 4]!;
      pixels[i * 8 + 0] = color1.red;
      pixels[i * 8 + 1] = color1.green;
      pixels[i * 8 + 2] = color1.blue;
      pixels[i * 8 + 3] = 255;

      const color2 = colorCache[byte & 0x0f]!;
      pixels[i * 8 + 4] = color2.red;
      pixels[i * 8 + 5] = color2.green;
      pixels[i * 8 + 6] = color2.blue;
      pixels[i * 8 + 7] = 255;
    }

    logger.debug(`Rebuilt canvas in ${(performance.now() - loadStart).toFixed(3)}ms`);

    initialized = true;
    return new ImageData(pixels, store.width, store.height);
  };

  const drawCanvas = () => {
    if (!canvas) return;

    const context = canvas.getContext('2d', { desynchronized: true })!;
    context.imageSmoothingEnabled = false;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.translate(store.offsetX, store.offsetY);
    context.scale(store.scale, store.scale);

    context.drawImage(backCanvas, 0, 0);

    context.restore();
  };

  const setPixel = (x: number, y: number, color: number) => {
    if (!initialized) {
      updateQueue.push({ x, y, color });
      return;
    }

    _setPixel(x, y, color);
  };

  const _setPixel = (x: number, y: number, color: number, skipDraw?: boolean) => {
    const backContext = backCanvas.getContext('2d')!;

    const pixel = colorCache[color]!.pixelData;
    backContext.putImageData(pixel, x, y);

    if (skipDraw !== true) drawCanvas();
  };

  // Will be used to draw the pixel cursor to draw
  const getCenterPixel = () => {
    const screenCenterX = canvas.width / 2;
    const screenCenterY = canvas.height / 2;

    const canvasX = (screenCenterX - store.offsetX) / store.scale;
    const canvasY = (screenCenterY - store.offsetY) / store.scale;

    return {
      x: Math.floor(canvasX),
      y: Math.floor(canvasY),
    };
  };

  return { initializeCanvas, drawCanvas, setPixel };
}
