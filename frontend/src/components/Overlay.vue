<script setup lang="ts">
import AccountModalButton from './account/AccountModalButton.vue';
import ColorSelector from './ColorSelector.vue';
import Timeout from './Timeout.vue';
</script>

<template>
  <div id="login" class="card position-tl">
    <AccountModalButton />
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
