import { lerp, isFinePointer } from './utils';

export function initCursor() {
  if (!isFinePointer()) return;

  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!dot || !ring) return;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const dotPos = { x: mouse.x, y: mouse.y };
  const ringPos = { x: mouse.x, y: mouse.y };
  let visible = false;
  let running = false;
  const SETTLED = 0.3;

  function paint() {
    dot!.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
    ring!.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
  }

  function tick() {
    const ddx = mouse.x - dotPos.x;
    const ddy = mouse.y - dotPos.y;
    const rdx = mouse.x - ringPos.x;
    const rdy = mouse.y - ringPos.y;
    const settled =
      Math.abs(ddx) < SETTLED && Math.abs(ddy) < SETTLED &&
      Math.abs(rdx) < SETTLED && Math.abs(rdy) < SETTLED;

    if (settled) {
      // Snap to exact target so we don't carry sub-pixel drift forward.
      dotPos.x = mouse.x; dotPos.y = mouse.y;
      ringPos.x = mouse.x; ringPos.y = mouse.y;
      paint();
      running = false;
      return;
    }

    dotPos.x = lerp(dotPos.x, mouse.x, 0.4);
    dotPos.y = lerp(dotPos.y, mouse.y, 0.4);
    ringPos.x = lerp(ringPos.x, mouse.x, 0.12);
    ringPos.y = lerp(ringPos.y, mouse.y, 0.12);
    paint();
    requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(tick);
  }

  window.addEventListener(
    'mousemove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        visible = true;
      }
      start();
    },
    { passive: true }
  );

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    visible = false;
  });

  // Hover states
  const setHover = (on: boolean) => {
    ring.classList.toggle('cursor-ring--hover', on);
  };
  const setView = (on: boolean) => {
    ring.classList.toggle('cursor-ring--view', on);
    ring.textContent = on ? 'VER' : '';
  };
  const setHidden = (on: boolean) => {
    dot.style.opacity = on ? '0' : visible ? '1' : '0';
    ring.style.opacity = on ? '0' : visible ? '1' : '0';
  };

  document.addEventListener('mouseover', (e) => {
    const t = e.target as HTMLElement;
    if (!t || !t.closest) return;
    if (t.closest('a, button, .interactive')) setHover(true);
    if (t.closest('[data-cursor="view"]')) setView(true);
    if (t.closest('[data-cursor="hide"]')) setHidden(true);
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target as HTMLElement;
    if (!t || !t.closest) return;
    if (t.closest('a, button, .interactive')) setHover(false);
    if (t.closest('[data-cursor="view"]')) setView(false);
    if (t.closest('[data-cursor="hide"]')) setHidden(false);
  });
}
