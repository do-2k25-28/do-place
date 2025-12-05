<script setup lang="ts">
import { useAccountStore, useCanvasStore } from '@/composables';

const authStore = useAccountStore();
const canvasStore = useCanvasStore();
</script>

<template>
  <div v-if="authStore.connected" class="surface">
    <span
      v-for="(color, i) in canvasStore.colors"
      class="color"
      :class="{ selected: canvasStore.selectedColor === i }"
      :style="{ '--color': color.hex }"
      role="button"
      @click="canvasStore.selectedColor = i"
    ></span>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: row;
  gap: 1em;

  padding: 1em 1.5em 1.5em 1.5em;
}

span.color {
  width: 1.5em;
  height: 1.5em;

  border-radius: 0.25em;
  background-color: var(--color);

  cursor: pointer;
  position: relative;
}

span.color::after {
  content: 'arrow_drop_up';
  font-size: 1.5em;
  font-family: 'Material Symbols Outlined';
  color: var(--text-primary);
  opacity: 0;

  position: absolute;
  bottom: -100%;
  left: 50%;
  transform: translateX(-50%);

  transition: opacity 150ms ease-in-out;
}

span.color.selected::after {
  opacity: 1;
}
</style>
