export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const onIdle = (cb: () => void): void => {
  if (typeof window === 'undefined') return;
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(cb);
  } else {
    setTimeout(cb, 1);
  }
};

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number): T => {
  let id: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  }) as T;
};
