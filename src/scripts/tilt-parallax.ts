import { lerp, clamp, prefersReducedMotion } from './utils';

type Layer = { el: HTMLElement; depth: number };

let layers: Layer[] = [];
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let inView = true;
let running = false;
let mouseAttached = false;
let orientationAttached = false;

const SETTLED = 0.05;

function tick() {
  // Stop running when (a) the section is out of view, or (b) we've settled at target.
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const settled = Math.abs(dx) < SETTLED && Math.abs(dy) < SETTLED;

  if (!inView || settled) {
    if (settled) {
      // Snap to exact target so the next start has clean state.
      current.x = target.x;
      current.y = target.y;
      for (const { el, depth } of layers) {
        const tx = current.x * depth;
        const ty = current.y * depth;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }
    }
    running = false;
    return;
  }

  current.x = lerp(current.x, target.x, 0.06);
  current.y = lerp(current.y, target.y, 0.06);
  for (const { el, depth } of layers) {
    const tx = current.x * depth;
    const ty = current.y * depth;
    el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
  }
  requestAnimationFrame(tick);
}

function start() {
  if (running || !inView) return;
  running = true;
  requestAnimationFrame(tick);
}

function onMouseMove(e: MouseEvent) {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  target.x = -nx * 30;
  target.y = -ny * 22;
  start();
}

// Baseline calibrates on first orientation event so tilt origin is wherever
// the user is currently holding the phone. Avoids a hard 30° assumption.
let baseline: { gamma: number; beta: number } | null = null;

function onOrientation(e: DeviceOrientationEvent) {
  const g = e.gamma ?? 0;
  const b = e.beta ?? 0;
  if (!baseline) baseline = { gamma: g, beta: b };
  // Cap deflection to ±25° from baseline so motion stays subtle.
  const dg = clamp(g - baseline.gamma, -25, 25) / 25;
  const db = clamp(b - baseline.beta, -25, 25) / 25;
  target.x = -dg * 30;
  target.y = -db * 22;
  start();
}

export function initParallax(selector = '.parallax-layer') {
  if (prefersReducedMotion()) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (els.length === 0) return;
  layers = els.map((el) => {
    const depth = parseFloat(el.dataset.depth ?? '1');
    return { el, depth: Number.isFinite(depth) ? depth : 1 };
  });

  // Pause when the parallax stage scrolls off-screen — saves a 60fps loop.
  const stage = (els[0].closest('.hero, [data-parallax-stage]') as HTMLElement) || els[0];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting;
          if (inView) start();
        }
      },
      { threshold: 0, rootMargin: '20% 0px 20% 0px' }
    );
    io.observe(stage);
  }

  attachMouseSource();
}

export function attachMouseSource() {
  if (mouseAttached) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  mouseAttached = true;
}

export function attachOrientationSource() {
  if (orientationAttached) return;
  window.addEventListener('deviceorientation', onOrientation, { passive: true });
  orientationAttached = true;
}

export function stopParallax() {
  if (mouseAttached) {
    window.removeEventListener('mousemove', onMouseMove);
    mouseAttached = false;
  }
  if (orientationAttached) {
    window.removeEventListener('deviceorientation', onOrientation);
    orientationAttached = false;
  }
}
