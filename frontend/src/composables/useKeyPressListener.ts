import { onMounted, onUnmounted, ref } from 'vue';

export function useKeyPressListener(code: string) {
  const isPressed = ref(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code !== code) return;
    isPressed.value = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code !== code) return;
    isPressed.value = false;
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  });

  return { isPressed };
}
