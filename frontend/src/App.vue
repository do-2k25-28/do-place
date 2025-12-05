<script setup lang="ts">
import MainLayout from '@/layout/MainLayout.vue';
import { useApi } from './composables';

const api = useApi();

if (import.meta.env.DEV) {
  Object.defineProperty(globalThis, 'api', { value: api, writable: false });
}

api.accountState();
</script>

<template>
  <MainLayout />
</template>

<style>
:root {
  --bg-primary: #1e1e1e;
  --bg-secondary: #252525;
  --bg-surface: #2e2e2e;
  --border-color: #3a3a3a;
  --accent-primary: #6c9eff;
  --accent-secondary: #ffdd82;
  --success: #7bd88f;
  --danger: #ff6b6b;
  --text-primary: #f2f2f2;
  --text-secondary: #c6c6c6;
  --text-muted: #8e8e8e;

  --border: 1px solid var(--border-color);
  --shadow-floating: 0 4px 12px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4);
}

* {
  padding: 0;
  margin: 0;
}

body {
  width: 100vw;
  height: 100vh;

  background: var(--bg-primary);
  color: var(--text-primary);

  font-family: 'Noto Sans', sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings: 'wdth' 100;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;

  font-size: 1em;
}

.surface {
  border-radius: 1em;
  border: var(--border);
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-floating);
}
</style>
