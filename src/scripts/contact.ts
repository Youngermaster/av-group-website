export function initContact() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const dots = form.querySelector<HTMLElement>('[data-submit-dots]');
  const success = form.querySelector<HTMLElement>('[data-success]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') as string | null) ?? '';
    const phone = (data.get('phone') as string | null) ?? '';
    const zone = (data.get('zone') as string | null) ?? '';

    if (!name || !phone || !zone) return;

    if (button) button.disabled = true;
    if (label) label.style.opacity = '0';
    if (dots) dots.hidden = false;

    // Simulate brief processing for cinematic feedback, then deep-link to WhatsApp.
    setTimeout(() => {
      const number = '573012208586';
      const msg = `Hola AV Group. Soy ${name}. Mi número es ${phone}. Me interesa la categoría ${zone}.`;
      const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener');

      if (success) {
        success.hidden = false;
      }
      if (button) button.disabled = false;
      if (label) label.style.opacity = '1';
      if (dots) dots.hidden = true;
    }, 900);
  });
}
