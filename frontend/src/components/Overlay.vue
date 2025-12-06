<script setup lang="ts">
import { useAccountStore } from '@/composables';
import { useTemplateRef } from 'vue';
import AccessModal from './account/AccessModal.vue';
import AccountModalButton from './account/AccountModalButton.vue';
import ColorSelector from './ColorSelector.vue';
import Timeout from './Timeout.vue';

const authStore = useAccountStore();

const accessModal = useTemplateRef('access-modal');

function openAccountModal() {
  if (authStore.connected) {
  } else accessModal.value?.show();
}
</script>

<template>
  <AccessModal ref="access-modal" />
  <div id="login" class="card position-tl">
    <AccountModalButton @click="openAccountModal" />
  </div>
  <div id="login" class="card position-bc">
    <Timeout />
    <ColorSelector />
  </div>
</template>

<style scoped>
div.card {
  position: absolute;

  padding: 1em;

  &.position-tl {
    top: 0;
    right: 0;
  }

  &.position-bc {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75em;
  }
}
</style>
