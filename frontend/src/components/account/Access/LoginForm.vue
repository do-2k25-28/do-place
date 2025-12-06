<script setup lang="ts">
import z from 'zod';

import { useApi } from '@/composables';
import { createZodPlugin } from '@formkit/zod';

const api = useApi();

const schema = z.object({
  email: z.email(),
  password: z.string().min(4).max(128),
});

type Body = z.infer<typeof schema>;

const [zodPlugin, submitHandler] = createZodPlugin(schema, async (data) => {
  console.log(data);
});
</script>

<template>
  <FormKit type="form" :plugins="[zodPlugin]" submit-label="Sign in" @submit="submitHandler">
    <FormKit type="email" name="email" label="Email address" autocomplete="email" />
    <FormKit type="password" name="password" label="Password" autocomplete="current-password" />
  </FormKit>
</template>

<style scoped></style>
