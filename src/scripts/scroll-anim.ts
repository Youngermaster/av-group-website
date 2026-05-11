import { initGsap } from './gsap-init';
import { prefersReducedMotion } from './utils';

export function initScrollAnimations() {
  if (prefersReducedMotion()) {
    document.querySelectorAll<HTMLElement>('.manifesto__line-inner').forEach((el) => {
      el.style.clipPath = 'inset(0 0% 0 0)';
    });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const { gsap, ScrollTrigger } = initGsap();

  // Manifesto reveal — line by line clip-path.
  const manifestoLines = gsap.utils.toArray<HTMLElement>('.manifesto__line-inner');
  if (manifestoLines.length) {
    gsap.fromTo(
      manifestoLines,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.3,
        scrollTrigger: {
          trigger: '[data-manifesto]',
          start: 'top 70%',
        },
      }
    );
  }

  // Generic reveal-on-scroll — batched into a single ScrollTrigger.batch
  // call so we don't pay the cost of N independent trigger instances.
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (reveals.length) {
    gsap.set(reveals, { opacity: 0, y: 60 });
    ScrollTrigger.batch(reveals, {
      start: 'top 88%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.06,
          overwrite: 'auto',
        }),
      // No onEnterBack — once revealed, it stays revealed.
    });
  }

  // Generic counters via [data-counter-scroll]
  const counters = gsap.utils.toArray<HTMLElement>('[data-counter-scroll]');
  counters.forEach((el) => {
    const target = parseInt(el.dataset.counterScroll || '0', 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString('es-CO');
      },
    });
  });

  // Parallax on .parallax-img — desktop only. On mobile the scrub triggers
  // create real scroll jank with no perceived payoff (small viewport, fast
  // scroll velocity). Disabled below 1024px.
  if (window.matchMedia('(min-width: 1024px)').matches) {
    gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
      const parent = img.parentElement;
      if (!parent) return;
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: parent,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );
    });
  }

  // Refresh after fonts/images settle
  if (document.fonts && 'ready' in document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
