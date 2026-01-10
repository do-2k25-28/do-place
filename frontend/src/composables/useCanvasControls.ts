import { onMounted, onUnmounted, watch, type Ref } from 'vue';

import { useCanvasStore } from './store';
import { useKeyPressListener } from './useKeyPressListener';

export function useCanvasControls(container: Ref<HTMLDivElement | null>) {
  const store = useCanvasStore();
  const { isPressed: isSpacedPressed } = useKeyPressListener('Space');

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastOffsetX = 0;
  let lastOffsetY = 0;

  watch(isSpacedPressed, (isPressed) => {
    if (isPressed) container.value?.classList.add('can-drag');
    else container.value?.classList.remove('can-drag');
  });

  const zoom = (factor: number, centerX?: number, centerY?: number) => {
    const canvas = container.value;
    if (!canvas) return;

    const zoomCenterX = centerX ?? canvas.clientWidth / 2;
    const zoomCenterY = centerY ?? canvas.clientHeight / 2;

    const newScale = store.scale * factor;

    if (newScale < 0.5 || newScale > 30) return;

    store.offsetX = zoomCenterX - (zoomCenterX - store.offsetX) * factor;
    store.offsetY = zoomCenterY - (zoomCenterY - store.offsetY) * factor;

    store.scale = newScale;
  };

  // Mouse event handlers
  const handleMouseDown = (event: MouseEvent) => {
    // Only allow middle click to move if space is not pressed
    if ((isSpacedPressed.value && event.buttons === 1) || event.buttons === 4) {
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      lastOffsetX = store.offsetX;
      lastOffsetY = store.offsetY;
      container.value?.classList.add('dragging');
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    store.offsetX = lastOffsetX + dx;
    store.offsetY = lastOffsetY + dy;
  };

  const handleMouseUp = () => {
    isDragging = false;
    container.value?.classList.remove('dragging');
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    zoom(zoomFactor, event.clientX, event.clientY);
  };

  onMounted(() => {
    const controls = container.value;
    if (!controls) return;

    controls.addEventListener('mousedown', handleMouseDown);
    controls.addEventListener('mousemove', handleMouseMove);
    controls.addEventListener('mouseup', handleMouseUp);
    controls.addEventListener('mouseleave', handleMouseUp);
    controls.addEventListener('wheel', handleWheel, { passive: false });
  });

  onUnmounted(() => {
    const controls = container.value;
    if (!controls) return;

    controls.removeEventListener('mousedown', handleMouseDown);
    controls.removeEventListener('mousemove', handleMouseMove);
    controls.removeEventListener('mouseup', handleMouseUp);
    controls.removeEventListener('mouseleave', handleMouseUp);
    controls.removeEventListener('wheel', handleWheel);
  });

  return { isSpacedPressed };
}
