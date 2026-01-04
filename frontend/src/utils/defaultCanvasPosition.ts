/**
 * Calculates the scale you need to apply to the canvas
 * so the canvas takes 90% of the height of the window.
 * @param height Height of the canvas in pixels
 * @returns The scale value
 */
export function getDefaultScale(height: number): number {
  return (0.9 * globalThis.innerHeight) / height;
}

export function getDefaultOffset(width: number, height: number): { x: number; y: number } {
  const x = (globalThis.innerWidth - width) / 2;
  const y = (globalThis.innerHeight - height) / 2;

  return { x, y };
}
