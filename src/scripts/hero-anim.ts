import { initGsap } from './gsap-init';
import { prefersReducedMotion } from './utils';

export function initHero() {
  const { gsap, SplitText } = initGsap();

  const heroTitle = document.querySelector<HTMLElement>('.hero__title');
  const heroSub = document.querySelector<HTMLElement>('.hero__subtitle');
  const heroLine = document.querySelector<HTMLElement>('.hero__line');
  const stats = document.querySelectorAll<HTMLElement>('.hero__stat');
  const scroll = document.querySelector<HTMLElement>('.hero__scroll');
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');

  if (prefersReducedMotion()) {
    if (heroTitle) heroTitle.style.opacity = '1';
    if (heroSub) heroSub.style.opacity = '1';
    if (heroLine) heroLine.style.transform = 'scaleX(1)';
    counters.forEach((el) => {
      const target = parseInt(el.dataset.counter || '0', 10);
      el.textContent = target.toLocaleString('es-CO');
    });
    if (stats.length) stats.forEach((s) => (s.style.opacity = '1'));
    if (scroll) scroll.style.opacity = '1';
    return;
  }

  const splitTitle = heroTitle ? new SplitText(heroTitle, { type: 'chars', charsClass: 'char' }) : null;
  const splitItalic = document.querySelector<HTMLElement>('.hero__italic')
    ? new SplitText('.hero__italic', { type: 'chars', charsClass: 'char' })
    : null;

  const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power4.out' } });

  if (splitTitle) {
    gsap.set(splitTitle.chars, { yPercent: -120, opacity: 0 });
    tl.to(splitTitle.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.06,
    }, 0);
  }

  if (splitItalic) {
    gsap.set(splitItalic.chars, { yPercent: 120, opacity: 0 });
    tl.to(splitItalic.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.06,
    }, 0.3);
  }

  if (heroLine) {
    gsap.set(heroLine, { scaleX: 0, transformOrigin: 'left center' });
    tl.to(heroLine, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0.9);
  }

  if (heroSub) {
    gsap.set(heroSub, { y: 24, opacity: 0 });
    tl.to(heroSub, { y: 0, opacity: 1, duration: 1 }, 1.1);
  }

  if (stats.length) {
    gsap.set(stats, { y: 30, opacity: 0 });
    tl.to(stats, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 1.3);
  }

  if (scroll) {
    gsap.set(scroll, { opacity: 0 });
    tl.to(scroll, { opacity: 1, duration: 0.8 }, 1.6);
  }

  // Animated counters
  counters.forEach((el) => {
    const target = parseInt(el.dataset.counter || '0', 10);
    const obj = { v: 0 };
    tl.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString('es-CO');
      },
    }, 1.5);
  });
}
