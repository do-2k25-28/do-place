<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import LoginForm from './Access/LoginForm.vue';
import RegisterForm from './Access/RegisterForm.vue';

const dialog = useTemplateRef('dialog');

const onceLoggedIn = Boolean(localStorage.getItem('onceLoggedIn'));

const basicAuthType = ref<'login' | 'register'>(onceLoggedIn ? 'login' : 'register');

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

      <div class="basic-auth">
        <button
          class="basic-auth-type"
          :class="{ selected: basicAuthType === 'login' }"
          @click="basicAuthType = 'login'"
        >
          Login
        </button>
        <button
          class="basic-auth-type"
          :class="{ selected: basicAuthType === 'register' }"
          @click="basicAuthType = 'register'"
        >
          Register
        </button>
      </div>

      <LoginForm v-if="basicAuthType === 'login'" @close="dialog?.close()" />
      <RegisterForm v-else-if="basicAuthType === 'register'" @close="dialog?.close()" />

      <!-- <div class="separator">
        <span>or continue with</span>
      </div>

      <div class="socials">
        <div>Continue with GitHub</div>
        <div>Continue with Google</div>
      </div> -->
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
  width: 35%;
  padding: 2em;

  background-color: var(--bg-surface);
  box-shadow: var(--shadow-floating);
  border: var(--border);
  border-radius: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1em;
}

div.separator {
  width: 60%;
  text-align: center;
  position: relative;
}

div.separator::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 1px;
  background-color: var(--text-muted);
  transform: translateX(-50%);
  left: 50%;
  top: 55%;
  z-index: 0;
}

div.separator > span {
  position: relative;
  background-color: var(--bg-surface);
  padding: 0 0.5em;
}

div.basic-auth {
  width: 60%;
  display: flex;
  gap: 0.5em;
}

button.basic-auth-type {
  width: 100%;
  padding: 0.5em;
  background-color: var(--bg-surface);
  outline: none;
  color: var(--text-primary);
  font-size: 1em;
  outline: none;
  border: var(--border);
  border-radius: 1em;
  cursor: pointer;
}

button.basic-auth-type.selected {
  background-color: var(--accent-primary);
}
</style>
