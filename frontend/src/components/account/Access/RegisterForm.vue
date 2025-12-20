<script setup lang="ts">
import z from 'zod';

import { useApi, useForm } from '@/composables';

const emit = defineEmits<{
  close: [];
}>();

const passwordSchema = () =>
  z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(256, 'Password must be at most 256 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>\\\/]/, 'Password must contain at least one special character');

const schema = z
  .object({
    email: z.email('Invalid email address'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(16, 'Username must be at most 16 characters')
      .regex(/^[A-Za-z0-9]{3,16}$/g, 'Username may only contain letters and numbers'),
    password: passwordSchema(),
    confirmPassword: passwordSchema(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const api = useApi();
const { formData, formErrors, onSubmit, errorFieldClasses, loading } = useForm(
  schema,
  {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  },
  async (formData, showError) => {
    try {
      await api.register(formData.email, formData.username, formData.password);
      emit('close');
    } catch (error) {
      if (!(error instanceof Error)) return;

      switch (error.message) {
        case 'user_already_exists':
          showError('email', 'Email address already in use.');
          break;
        default:
          console.error(error);
          showError('email', 'An unexpected error occured');
          break;
      }
    }
  },
);
</script>

<template>
  <form @submit="onSubmit">
    <div class="field">
      <label for="email">Email address</label>
      <input
        type="text"
        name="email"
        id="email"
        autocomplete="email"
        v-model="formData.email"
        formnovalidate
        :class="errorFieldClasses('email')"
        :disabled="loading"
      />
      <span v-if="formErrors.email" class="form-error">{{ formErrors.email }}</span>
    </div>

    <div class="field">
      <label for="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        autocomplete="username"
        v-model="formData.username"
        formnovalidate
        :class="errorFieldClasses('username')"
        :disabled="loading"
      />
      <span v-if="formErrors.username" class="form-error">{{ formErrors.username }}</span>
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        autocomplete="new-password"
        v-model="formData.password"
        :class="errorFieldClasses('password')"
        :disabled="loading"
      />
      <span v-if="formErrors.password" class="form-error">{{ formErrors.password }}</span>
    </div>

    <div class="field">
      <label for="confirm-password">Confirm password</label>
      <input
        type="password"
        name="confirm-password"
        id="confirm-password"
        autocomplete="new-password"
        v-model="formData.confirmPassword"
        :class="errorFieldClasses('confirmPassword')"
        :disabled="loading"
      />
      <span v-if="formErrors.confirmPassword" class="form-error">{{
        formErrors.confirmPassword
      }}</span>
    </div>

    <button type="submit" :disabled="loading">Register</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;

  gap: 1em;

  width: 60%;
}

div.field {
  display: flex;
  flex-direction: column;

  gap: 0.25em;
}

input {
  background-color: var(--surface);
  color: var(--text-primary);

  outline: none;
  border: var(--border);
  border-width: 2px;
  border-radius: 1em;
  padding: 1em;

  font-size: 1em;

  transition: border 250ms ease-in-out;
}

input:focus {
  border-color: var(--accent-primary);
}

input.error {
  border-color: var(--danger);
}

:disabled {
  cursor: not-allowed;
  color: var(--text-muted);
}

span.form-error {
  color: var(--danger);
}

button {
  outline: none;
  border: var(--border);
  border-radius: 1em;
  background-color: var(--accent-primary);

  color: var(--text-primary);
  padding: 1em;
  cursor: pointer;

  font-size: 1em;
}
</style>
