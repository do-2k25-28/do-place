<script setup lang="ts">
import { useAccountStore } from '@/composables';

const store = useAccountStore();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <div class="surface">
    <button @click="emit('click')">
      <span class="material-symbols-outlined">
        {{ store.connected ? 'account_circle' : 'login' }}
      </span>
    </button>
  </div>
</template>

<style scoped>
button {
  border: none;
  background-color: transparent;
  padding: 0.5em;

  color: var(--text-primary);
  font-size: 1.75em;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}
</style>
