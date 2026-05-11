export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const open = document.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
  const close = document.querySelector<HTMLButtonElement>('[data-mobile-close]');
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-mobile-link]');

  if (!nav) return;

  // Scroll show/hide + scrolled state
  let lastY = window.scrollY;
  let ticking = false;
  const SCROLLED_THRESHOLD = 80;

  const onScroll = () => {
    const y = window.scrollY;
    if (y > SCROLLED_THRESHOLD) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    if (y > lastY && y > 200) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Mobile menu
  if (menu && open && close) {
    const setOpen = (v: boolean) => {
      menu.hidden = false;
      // small tick so display:flex is committed before transition
      requestAnimationFrame(() => {
        menu.classList.toggle('is-open', v);
        menu.setAttribute('aria-hidden', v ? 'false' : 'true');
        document.body.style.overflow = v ? 'hidden' : '';
        if (!v) {
          // hide after transition
          setTimeout(() => {
            if (!menu.classList.contains('is-open')) menu.hidden = true;
          }, 600);
        }
      });
    };

    open.addEventListener('click', () => setOpen(true));
    close.addEventListener('click', () => setOpen(false));
    links.forEach((a) => a.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });
  }
}
