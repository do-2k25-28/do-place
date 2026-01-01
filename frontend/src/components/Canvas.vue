<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';

import {
  useAccountStore,
  useApi,
  useCanvas,
  useCanvasControls,
  useCanvasGateway,
  useCanvasStore,
} from '@/composables';

const canvasContainer = useTemplateRef('canvas-container');
const canvasEl = useTemplateRef('canvas-el');

const canvasStore = useCanvasStore();
const authStore = useAccountStore();
const api = useApi();
const { initializeCanvas, drawCanvas } = useCanvas();
useCanvasControls(canvasContainer);
const { connectToGateway, place } = useCanvasGateway();

function onWindowResize() {
  if (!canvasEl.value) return;
  canvasEl.value.width = window.innerWidth;
  canvasEl.value.height = window.innerHeight;

  drawCanvas();
}

// Re render canvas when zoom/offset changes
watch(
  () => ({
    scale: canvasStore.scale,
    offsetX: canvasStore.offsetX,
    offsetY: canvasStore.offsetY,
  }),
  () => {
    drawCanvas();
  },
  { deep: true },
);

function handleClick(event: PointerEvent): void {
  if (!authStore.connected) return;

  const canvas = event.target as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();

  // Get click position relative to canvas
  const screenX = event.clientX - rect.left;
  const screenY = event.clientY - rect.top;

  // Convert screen coordinates to canvas pixel coordinates
  const canvasX = (screenX - canvasStore.offsetX) / canvasStore.scale;
  const canvasY = (screenY - canvasStore.offsetY) / canvasStore.scale;

  // Floor to get the pixel index
  const pixelX = Math.floor(canvasX);
  const pixelY = Math.floor(canvasY);

  // Check if click is within bounds
  if (pixelX >= 0 && pixelX < canvasStore.width && pixelY >= 0 && pixelY < canvasStore.height) {
    if (canvasStore.timeout === null) {
      place(pixelX, pixelY, canvasStore.selectedColor);
      canvasStore.timeout = Date.now() + 1000 * 60;
    }
  }
}

onMounted(async () => {
  window.addEventListener('resize', () => onWindowResize());

  connectToGateway();

  await api.getCanvasProperties();
  await initializeCanvas(canvasEl);

  onWindowResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', () => onWindowResize());
});
</script>

<template>
  <div id="canvas" ref="canvas-container">
    <canvas ref="canvas-el" @click="handleClick"></canvas>
  </div>
</template>

<style scoped>
div#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;

  overflow: hidden;
}

canvas {
  aspect-ratio: unset;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
