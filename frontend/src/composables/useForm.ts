import { reactive, ref } from 'vue';
import z from 'zod';

export function useForm<Schema extends z.ZodType<object>>(
  schema: Schema,
  defaultValues: z.output<Schema>,
  postSubmit: (
    formData: z.output<Schema>,
    showError: (field: keyof z.output<Schema>, message: string) => void,
  ) => Promise<void> | void,
) {
  const formData = reactive(defaultValues);
  const formErrors = reactive<{ [key in keyof z.output<Schema>]: string }>(
    // @ts-ignore Typescript deoesn't know I'm not adding keys
    Object.fromEntries(Object.keys(defaultValues).map((key) => [key, ''])),
  );
  const loading = ref(false);

  const onSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    loading.value = true;

    const parsed = await schema.safeParseAsync(formData);

    for (const key in defaultValues) {
      // @ts-ignore
      formErrors[key] = '';
    }

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        // @ts-ignore
        if (!formErrors[issue.path[0]]) formErrors[issue.path[0]] = issue.message;
      }
    } else {
      // @ts-ignore
      await postSubmit(formData, (field, message) => {
        // @ts-ignore
        formErrors[field] = message;
      });
    }

    loading.value = false;
  };

  const errorFieldClasses = (key: keyof typeof formErrors): Record<string, boolean> => {
    return { error: !!formErrors[key] };
  };

  return { formData, formErrors, onSubmit, errorFieldClasses, loading };
}
