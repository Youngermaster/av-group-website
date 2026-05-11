/**
 * Lazy, isolated Gaussian-splat (SPZ) viewer.
 *
 * Activation pipeline (per mount):
 *   1. IntersectionObserver marks the slot as "near viewport" → autoload only
 *      when the visitor opts in (or has no save-data / reduced-motion preference).
 *   2. Dynamic import of `three` + `@sparkjsdev/spark` — both ship as their own
 *      chunks (see astro.config.mjs `manualChunks`), so they never enter the
 *      critical bundle for visitors who don't reach a project page with a model.
 *   3. Streamed fetch of the .spz with progress.
 *   4. rAF loop runs only while the canvas is on-screen and the tab is visible.
 */

type Three = typeof import('three');
type Spark = typeof import('@sparkjsdev/spark');
type Orbit = typeof import('three/examples/jsm/controls/OrbitControls.js').OrbitControls;

interface ViewerEls {
  root: HTMLElement;
  canvasHost: HTMLElement;
  hud: HTMLElement;
  placeholder: HTMLElement;
  status: HTMLElement;
  progress: HTMLElement;
  progressBar: HTMLElement;
  loadBtn: HTMLButtonElement;
  errorEl: HTMLElement;
}

function resolveEls(root: HTMLElement): ViewerEls | null {
  const q = <T extends HTMLElement = HTMLElement>(s: string) =>
    root.querySelector<T>(s);
  const canvasHost = q('[data-splat-canvas]');
  const hud = q('[data-splat-hud]');
  const placeholder = q('[data-splat-placeholder]');
  const status = q('[data-splat-status]');
  const progress = q('[data-splat-progress]');
  const progressBar = q('[data-splat-progress-bar]');
  const loadBtn = q<HTMLButtonElement>('[data-splat-load]');
  const errorEl = q('[data-splat-error]');
  if (
    !canvasHost || !hud || !placeholder || !status ||
    !progress || !progressBar || !loadBtn || !errorEl
  ) return null;
  return { root, canvasHost, hud, placeholder, status, progress, progressBar, loadBtn, errorEl };
}

function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isDataSaver(): boolean {
  // Standard NetworkInformation API. Treat undefined as "no preference".
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

async function fetchWithProgress(
  url: string,
  signal: AbortSignal,
  onProgress: (loaded: number, total: number | null) => void,
): Promise<Uint8Array> {
  const response = await fetch(url, { signal });
  if (!response.ok || !response.body) {
    throw new Error(`No se pudo cargar el modelo (${response.status})`);
  }

  const totalHeader = response.headers.get('Content-Length');
  const total = totalHeader ? Number(totalHeader) : null;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.byteLength;
      onProgress(received, total);
    }
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function loadDeps(): Promise<{ THREE: Three; SparkLib: Spark; OrbitControls: Orbit }> {
  const [THREE, SparkLib, controlsMod] = await Promise.all([
    import('three'),
    import('@sparkjsdev/spark'),
    import('three/examples/jsm/controls/OrbitControls.js'),
  ]);
  return { THREE, SparkLib, OrbitControls: controlsMod.OrbitControls };
}

function setStatus(els: ViewerEls, label: string, sub?: string) {
  els.status.textContent = label;
  if (sub !== undefined) {
    const subEl = els.placeholder.querySelector('[data-splat-sub]');
    if (subEl) subEl.textContent = sub;
  }
}

function showPlaceholder(els: ViewerEls, show: boolean) {
  els.placeholder.toggleAttribute('hidden', !show);
}

function showError(els: ViewerEls, message: string) {
  els.errorEl.textContent = message;
  els.errorEl.removeAttribute('hidden');
  showPlaceholder(els, false);
}

function setProgress(els: ViewerEls, ratio: number | null) {
  if (ratio === null) {
    els.progress.setAttribute('aria-valuetext', 'desconocido');
    els.progressBar.style.transform = 'scaleX(0.15)';
    return;
  }
  const pct = Math.max(0, Math.min(1, ratio));
  els.progress.setAttribute('aria-valuenow', String(Math.round(pct * 100)));
  els.progressBar.style.transform = `scaleX(${pct})`;
}

function mountViewer(els: ViewerEls) {
  let disposed = false;
  const abort = new AbortController();

  // Track cleanup hooks individually so we can dispose half-built state.
  const cleanups: Array<() => void> = [];
  const cleanup = () => {
    disposed = true;
    abort.abort();
    while (cleanups.length) {
      try { cleanups.pop()!(); } catch { /* ignore */ }
    }
  };

  els.loadBtn.disabled = true;
  setStatus(els, 'Preparando renderer', 'Cargando renderer de splats.');

  (async () => {
    if (!hasWebGL2()) {
      showError(els, 'Tu navegador no soporta WebGL2; el recorrido 3D no puede mostrarse.');
      return;
    }

    let deps;
    try {
      deps = await loadDeps();
    } catch (err) {
      console.error(err);
      showError(els, 'No se pudo iniciar el renderer.');
      return;
    }
    if (disposed) return;

    const { THREE, SparkLib, OrbitControls } = deps;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x080808, 1);
    cleanups.push(() => renderer.dispose());

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.01, 500);
    camera.position.set(0, 0, 3);

    const spark = new SparkLib.SparkRenderer({ renderer });
    scene.add(spark);
    cleanups.push(() => { scene.remove(spark); });

    const resize = () => {
      const { clientWidth, clientHeight } = els.canvasHost;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();

    els.canvasHost.appendChild(renderer.domElement);
    renderer.domElement.classList.add('splat__canvas');
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute('aria-label', 'Modelo 3D interactivo');
    renderer.domElement.setAttribute('data-cursor', 'hide');
    cleanups.push(() => {
      if (renderer.domElement.parentNode === els.canvasHost) {
        els.canvasHost.removeChild(renderer.domElement);
      }
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(els.canvasHost);
    cleanups.push(() => resizeObserver.disconnect());

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.9;
    controls.panSpeed = 0.8;
    controls.minDistance = 0.4;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);
    cleanups.push(() => controls.dispose());

    // Keys scoped to the canvas only — pressing W elsewhere on the page must
    // not preventDefault or hijack page scrolling.
    const keys = new Set<string>();
    const onKey = (down: boolean) => (event: KeyboardEvent) => {
      const k = event.key.toLowerCase();
      if (!['w', 'a', 's', 'd', 'q', 'e', 'shift'].includes(k)) return;
      if (down) {
        keys.add(k);
        event.preventDefault();
      } else {
        keys.delete(k);
      }
    };
    const onDown = onKey(true);
    const onUp = onKey(false);
    renderer.domElement.addEventListener('keydown', onDown);
    renderer.domElement.addEventListener('keyup', onUp);
    cleanups.push(() => {
      renderer.domElement.removeEventListener('keydown', onDown);
      renderer.domElement.removeEventListener('keyup', onUp);
    });

    const tmpForward = new THREE.Vector3();
    const tmpRight = new THREE.Vector3();
    const tmpUp = new THREE.Vector3(0, 1, 0);
    const tmpMove = new THREE.Vector3();
    const clock = new THREE.Clock();

    const applyWasd = (dt: number) => {
      if (!keys.size) return;
      const speed = (keys.has('shift') ? 4.5 : 1.6) * dt;
      tmpForward
        .subVectors(controls.target, camera.position)
        .setY(0)
        .normalize();
      tmpRight.crossVectors(tmpForward, tmpUp).normalize();
      tmpMove.set(0, 0, 0);
      if (keys.has('w')) tmpMove.add(tmpForward);
      if (keys.has('s')) tmpMove.sub(tmpForward);
      if (keys.has('d')) tmpMove.add(tmpRight);
      if (keys.has('a')) tmpMove.sub(tmpRight);
      if (keys.has('e')) tmpMove.add(tmpUp);
      if (keys.has('q')) tmpMove.sub(tmpUp);
      if (tmpMove.lengthSq() === 0) return;
      tmpMove.normalize().multiplyScalar(speed);
      camera.position.add(tmpMove);
      controls.target.add(tmpMove);
    };

    let rafId = 0;
    let onScreen = true;
    let visible = !document.hidden;
    const isActive = () => onScreen && visible && !disposed;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      applyWasd(dt);
      controls.update();
      renderer.render(scene, camera);
      rafId = isActive() ? requestAnimationFrame(animate) : 0;
    };

    const resume = () => {
      if (!isActive() || rafId) return;
      clock.getDelta(); // reset delta so we don't get a big jump after a pause
      rafId = requestAnimationFrame(animate);
    };

    const pauseObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          onScreen = e.isIntersecting;
          if (onScreen) resume();
        }
      },
      { rootMargin: '50px 0px' },
    );
    pauseObserver.observe(els.canvasHost);
    cleanups.push(() => pauseObserver.disconnect());

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) resume();
    };
    document.addEventListener('visibilitychange', onVisibility);
    cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

    cleanups.push(() => { if (rafId) cancelAnimationFrame(rafId); });

    // ----- Stream the SPZ + decode -----
    const url = els.root.dataset.splatSrc!;
    const fileName = els.root.dataset.splatFilename ?? 'model.spz';

    let mesh: InstanceType<Spark['SplatMesh']> | null = null;
    cleanups.push(() => {
      if (mesh) {
        scene.remove(mesh);
        mesh.dispose();
        mesh = null;
      }
    });

    setStatus(els, 'Cargando captura', 'Transmitiendo los splats…');

    try {
      const bytes = await fetchWithProgress(url, abort.signal, (loaded, total) => {
        if (disposed) return;
        const ratio = total ? loaded / total : null;
        setProgress(els, ratio);
      });
      if (disposed) return;

      setStatus(els, 'Decodificando', 'Procesando los splats — el primer cuadro aparece enseguida.');
      mesh = new SparkLib.SplatMesh({ fileBytes: bytes, fileName });
      await mesh.initialized;
      if (disposed) return;

      scene.add(mesh);

      // Frame camera to the mesh's bounding box.
      const box = mesh.getBoundingBox(true);
      if (!box.isEmpty()) {
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
        const fov = THREE.MathUtils.degToRad(camera.fov);
        const distance = (radius / Math.sin(fov / 2)) * 1.4;
        mesh.position.sub(center);
        controls.target.set(0, 0, 0);
        camera.position.set(0, radius * 0.4, distance);
        controls.update();
      }

      showPlaceholder(els, false);
      els.hud.removeAttribute('hidden');
      els.root.dataset.splatState = 'ready';
      clock.start();
      resume();
    } catch (err) {
      if (disposed) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error(err);
      showError(els, err instanceof Error ? err.message : 'Error al cargar el modelo.');
    }
  })();

  return cleanup;
}

function activateOnce(root: HTMLElement) {
  if (root.dataset.splatActivated === '1') return;
  root.dataset.splatActivated = '1';

  const els = resolveEls(root);
  if (!els) return;

  const cleanup = mountViewer(els);

  // If the host element is removed (e.g. SPA navigation in future), tear down.
  const observer = new MutationObserver(() => {
    if (!document.body.contains(root)) {
      cleanup();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function initOne(root: HTMLElement) {
  const els = resolveEls(root);
  if (!els) return;

  // Manual button is always available; it activates the viewer immediately.
  els.loadBtn.addEventListener('click', () => activateOnce(root), { once: true });

  // Decide whether to auto-activate when the section nears the viewport.
  const autoload =
    root.dataset.splatAutoload !== 'false' &&
    !prefersReducedMotion() &&
    !isDataSaver();

  if (!autoload) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          activateOnce(root);
          io.disconnect();
          break;
        }
      }
    },
    { rootMargin: '300px 0px' },
  );
  io.observe(root);
}

export function initSplatViewers() {
  const roots = document.querySelectorAll<HTMLElement>('[data-splat-viewer]');
  roots.forEach(initOne);
}
