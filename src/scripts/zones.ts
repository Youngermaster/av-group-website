import { gsap } from 'gsap';

export function initZones() {
  if (!matchMedia('(min-width: 1025px)').matches) return;

  const container = document.querySelector<HTMLElement>('[data-zones]');
  if (!container) return;
  const zones = Array.from(container.querySelectorAll<HTMLElement>('[data-zone-item]'));
  if (zones.length === 0) return;

  zones.forEach((zone) => {
    zone.addEventListener('mouseenter', () => {
      gsap.to(zones, {
        flex: '0 0 13%',
        duration: 0.6,
        ease: 'power3.inOut',
      });
      gsap.to(zone, {
        flex: '0 0 48%',
        duration: 0.6,
        ease: 'power3.inOut',
      });
    });
  });

  container.addEventListener('mouseleave', () => {
    gsap.to(zones, {
      flex: '1 1 20%',
      duration: 0.5,
      ease: 'power3.inOut',
    });
  });
}
