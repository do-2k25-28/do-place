<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { useAccountStore, useCanvasStore } from '@/composables';

const authStore = useAccountStore();
const canvasStore = useCanvasStore();

const timeout = ref<string>();

function updateTimeout() {
  if (canvasStore.timeout === null) return;

  const now = Date.now();
  let delta = Math.abs(now - canvasStore.timeout);

  const minutes = Math.floor(delta / 60000);
  delta %= 60000;
  const seconds = Math.floor(delta / 1000);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  timeout.value = `${mm}:${ss}`;
}

let interval: number;

onMounted(() => {
  interval = setInterval(updateTimeout, 500);

  updateTimeout();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div v-if="authStore.connected" class="surface" v-show="canvasStore.timeout !== null">
    <span class="material-symbols-outlined">hourglass</span>
    <span>{{ timeout }}</span>
  </div>
</template>

<style scoped>
div {
  padding: 0.75em 1em;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}
</style>
