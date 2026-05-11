export function initLoader() {
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  if (!loader) return;

  // Reveal site after a short cinematic moment.
  // Hero entry timeline starts in parallel — total perceived duration ~1.8s.
  const finish = () => {
    loader.classList.add('is-hidden');
    setTimeout(() => loader.classList.add('is-gone'), 800);
  };

  if (document.readyState === 'complete') {
    setTimeout(finish, 1500);
  } else {
    window.addEventListener('load', () => setTimeout(finish, 800), { once: true });
    // Hard cap so the loader never overstays.
    setTimeout(finish, 2400);
  }
}
