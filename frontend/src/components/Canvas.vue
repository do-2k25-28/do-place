<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';

import {
  useApi,
  useCanvas,
  useCanvasControls,
  useCanvasGateway,
  useCanvasStore,
} from '@/composables';

const canvasContainer = useTemplateRef('canvas-container');
const canvasEl = useTemplateRef('canvas-el');

const store = useCanvasStore();
const api = useApi();
const { initializeCanvas, drawCanvas } = useCanvas();
useCanvasControls(canvasContainer);
const { connectToGateway } = useCanvasGateway();

function onWindowResize() {
  if (!canvasEl.value) return;
  canvasEl.value.width = window.innerWidth;
  canvasEl.value.height = window.innerHeight;

  drawCanvas();
}

// Re render canvas when zoom/offset changes
watch(
  () => ({
    scale: store.scale,
    offsetX: store.offsetX,
    offsetY: store.offsetY,
  }),
  () => {
    drawCanvas();
  },
  { deep: true },
);

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
    <canvas ref="canvas-el"></canvas>
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
