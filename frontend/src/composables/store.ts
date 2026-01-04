import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import type { CanvasColor } from './useApi';
import { getDefaultOffset, getDefaultScale } from '@/utils';

export const useCanvasStore = defineStore(
  'canvas',
  () => {
    const scale = ref(getDefaultScale(1000));

    const defaultOffset = getDefaultOffset(1000 * scale.value, 1000 * scale.value);
    const offsetX = ref(defaultOffset.x);
    const offsetY = ref(defaultOffset.y);

    const width = ref(0);
    const height = ref(0);

    const colors = ref<CanvasColor[]>([]);
    const selectedColor = ref(0);

    const timeout = ref<number | null>(null);

    // pinia-plugin-persistedstate triggers a set
    // so this runs on initial load (unless null)
    watch(timeout, (value) => {
      if (value === null) return;

      if (value <= Date.now()) timeout.value = null;
      setTimeout(() => (timeout.value = null), value - Date.now());
    });

    return { scale, offsetX, offsetY, width, height, colors, selectedColor, timeout };
  },
  { persist: true },
);

export const useAccountStore = defineStore('account', () => {
  const connected = ref(false);
  const id = ref<string>();

  return { connected, id };
});
