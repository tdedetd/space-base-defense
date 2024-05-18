export function getContext2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(`Cannot get context 2d. id: "${canvas.id}"`);
  }

  return ctx;
}
