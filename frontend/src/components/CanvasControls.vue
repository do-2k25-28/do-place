<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { useCanvasControls } from '@/composables/useCanvasControls';

const container = useTemplateRef('container');

useCanvasControls(container);
</script>

<template>
  <div id="canvas-controls" ref="container"></div>
</template>

<style scoped>
div {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
