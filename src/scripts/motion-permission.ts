import { attachOrientationSource } from './tilt-parallax';

const STORAGE_KEY = 'pento.tilt';

type Req = (() => Promise<'granted' | 'denied' | string>) | undefined;

function getOrientationRequester(): Req {
  const DOE = (window as unknown as {
    DeviceOrientationEvent?: { requestPermission?: Req };
  }).DeviceOrientationEvent;
  return DOE && typeof DOE.requestPermission === 'function' ? DOE.requestPermission.bind(DOE) : undefined;
}

function getMotionRequester(): Req {
  const DME = (window as unknown as {
    DeviceMotionEvent?: { requestPermission?: Req };
  }).DeviceMotionEvent;
  return DME && typeof DME.requestPermission === 'function' ? DME.requestPermission.bind(DME) : undefined;
}

function setLabel(chip: HTMLElement, text: string) {
  const label = chip.querySelector<HTMLElement>('[data-tilt-label]');
  if (label) label.textContent = text;
}

export function initMotionPermission() {
  const chip = document.querySelector<HTMLButtonElement>('[data-tilt-chip]');

  const reqOrient = getOrientationRequester();
  const reqMotion = getMotionRequester();

  // No iOS-style permission gate present.
  // Android Chrome / desktop Safari: deviceorientation works freely on HTTPS.
  if (!reqOrient && !reqMotion) {
    if (chip) chip.hidden = true;
    if ('DeviceOrientationEvent' in window) {
      attachOrientationSource();
    }
    return;
  }

  if (!chip) return;
  chip.hidden = false;

  // Don't honor a stored 'denied' anymore — let the user retry on every visit.
  // (Persisting denial means a single accidental tap permanently kills the feature.)

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'granted') {
    chip.classList.add('tilt-chip--active');
    chip.setAttribute('aria-pressed', 'true');
    setLabel(chip, 'Movimiento activo · toca para reactivar');
  }

  // Helper: fail-loud feedback on the chip.
  const fail = (msg: string) => {
    chip.classList.add('tilt-chip--error');
    setLabel(chip, msg);
    setTimeout(() => {
      chip.classList.remove('tilt-chip--error');
      setLabel(chip, 'Activar movimiento');
    }, 4000);
  };

  // HTTPS sanity check — iOS rejects DeviceOrientation permission over plain HTTP.
  const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!isSecure) {
    chip.addEventListener('click', () => fail('Requiere HTTPS · usa preview en línea'), { once: false });
    return;
  }

  chip.addEventListener('click', async () => {
    try {
      // Request whichever APIs exist. Orientation is the one we actually need;
      // we also try motion in case the OS treats them as a bundle.
      const results = await Promise.all([
        reqOrient ? reqOrient() : Promise.resolve('granted'),
        reqMotion ? reqMotion() : Promise.resolve('granted'),
      ]);

      const granted = results.every((r) => r === 'granted');

      if (granted) {
        attachOrientationSource();
        localStorage.setItem(STORAGE_KEY, 'granted');
        chip.classList.add('tilt-chip--active');
        chip.setAttribute('aria-pressed', 'true');
        setLabel(chip, 'Movimiento activo');
      } else {
        // Don't persist denial; just let user retry next session.
        fail('Permiso denegado · toca para reintentar');
      }
    } catch (err) {
      console.error('[pento] motion permission error:', err);
      fail('No disponible · revisa los ajustes de Safari');
    }
  });
}
