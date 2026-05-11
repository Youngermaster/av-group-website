import { onIdle } from './utils';
import { initCursor } from './cursor';
import { initParallax } from './tilt-parallax';
import { initHero } from './hero-anim';
import { initNav } from './nav';
import { initLoader } from './loader';
import { initScrollAnimations } from './scroll-anim';
import { initZones } from './zones';
import { initContact } from './contact';
import { initMotionPermission } from './motion-permission';
import { initSplatViewers } from './splat-viewer';

function boot() {
  // Eager: nav + loader + cursor + hero entry timeline
  initLoader();
  initNav();
  initCursor();
  initHero();
  initContact();

  // Defer heavier setup until idle
  onIdle(() => {
    initParallax();
    initScrollAnimations();
    initZones();
    initMotionPermission();
    initSplatViewers();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
