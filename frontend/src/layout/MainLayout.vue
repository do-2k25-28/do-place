<script setup lang="ts">
import Canvas from '@/components/Canvas.vue';
import Overlay from '@/components/Overlay.vue';
</script>

<template>
  <Canvas />
  <Overlay />
</template>

<style scoped>
div#ui {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    display: flex;

    &.right {
      justify-content: end;
    }

    &.center {
      justify-content: space-around;
    }

    & > div {
      padding: 1em;
    }
  }
}
</style>
