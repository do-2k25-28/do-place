<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import LoginForm from './Access/LoginForm.vue';

const dialog = useTemplateRef('dialog');

const basicAuthType = ref<'login' | 'register'>('login');

function handleBackdropClick(event: PointerEvent) {
  if (event.target === dialog.value) dialog.value?.close();
}

defineExpose({
  show: () => {
    dialog.value?.showModal();
  },
  close: () => {
    dialog.value?.close();
  },
});
</script>

<template>
  <dialog ref="dialog" @click="handleBackdropClick">
    <div class="access">
      <h1>Access your account</h1>

      <div>
        <button class="basic-auth-type">Login</button>
        <button class="basic-auth-type">Register</button>
      </div>

      <LoginForm v-if="basicAuthType === 'login'" />

      <div class="separator">or continue with</div>

      <div class="socials">
        <div>Continue with GitHub</div>
        <div>Continue with Google</div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;

  background: unset;
  border: unset;
  outline: unset;

  color: var(--text-primary);

  display: flex;
  justify-content: center;
  align-items: center;
}

dialog:not([open]) {
  display: none;
}

div.access {
  padding: 2em;

  background-color: var(--bg-surface);
  box-shadow: var(--shadow-floating);
  border: var(--border);
  border-radius: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
