# CLAUDE.md — Pento Luxury Real Estate Landing

## Contexto del Proyecto

Eres el lead developer y diseñador de **Pento Luxury**, una plataforma inmobiliaria de ultra-lujo en Colombia. El sitio debe transmitir la misma sensación que el sitio web de Rolls-Royce, Porsche o Aston Martin: control absoluto, elegancia contenida, y cada pixel con intención. El mercado objetivo son proyectos en **El Poblado (Medellín), Llano Grande, El Retiro y Santa Marta**, para compradores de alto patrimonio neto (HNWI). No hay un solo elemento genérico en este sitio.

---

## Stack Técnico

- **Framework**: Astro 4.x (SSG, zero-JS por defecto, islas para interactividad)
- **Animaciones**: GSAP 3 + ScrollTrigger + SplitText (para texto) + Flip plugin
- **Estilos**: CSS nativo con custom properties (sin frameworks CSS)
- **Fuentes**: Google Fonts o Fontsource — ver sección de tipografía
- **Assets**: Imágenes de Unsplash (propiedades de lujo colombianas/arquitectura moderna)
- **Iconos**: SVG inline únicamente — ningún icon-pack externo
- **Sin**: Tailwind, Bootstrap, ningún framework CSS

---

## Identidad Visual y Diseño

### Paleta de Colores

```css
:root {
  /* Fondos */
  --color-void: #080808; /* negro profundo, fondo principal */
  --color-obsidian: #0f0f0f; /* secciones alternadas */
  --color-charcoal: #1a1a1a; /* cards, superficies elevadas */
  --color-smoke: #2a2a2a; /* borders, separadores */

  /* Acento dorado — identidad Pento */
  --color-gold: #b8965a; /* dorado cálido, principal */
  --color-gold-light: #d4af7a; /* hover states */
  --color-gold-muted: #6b5535; /* dorado apagado, decorativo */
  --color-gold-glow: rgba(184, 150, 90, 0.15); /* glow effects */

  /* Texto */
  --color-white: #f8f6f2; /* texto principal, casi blanco cálido */
  --color-silver: #b0aaa0; /* texto secundario */
  --color-dim: #5c5650; /* texto terciario, labels */

  /* Gradientes */
  --gradient-hero: linear-gradient(
    180deg,
    rgba(8, 8, 8, 0) 0%,
    rgba(8, 8, 8, 0.3) 40%,
    rgba(8, 8, 8, 0.85) 80%,
    rgba(8, 8, 8, 1) 100%
  );
  --gradient-gold: linear-gradient(
    135deg,
    #b8965a 0%,
    #d4af7a 50%,
    #8b6b35 100%
  );
  --gradient-card: linear-gradient(
    180deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(8, 8, 8, 0.95) 100%
  );
}
```

### Tipografía

```css
/* Display — titulares impactantes, editorial */
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cormorant:wght@300;400;500&display=swap");

/* Body + UI — sans-serif refinado */
@import url("https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&display=swap");

/* Mono — datos, métricas, coordenadas */
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap");

:root {
  --font-display: "Cormorant Garamond", "Cormorant", Georgia, serif;
  --font-body: "Jost", sans-serif;
  --font-mono: "DM Mono", monospace;

  /* Escala tipográfica */
  --text-hero: clamp(72px, 10vw, 160px);
  --text-display: clamp(48px, 6vw, 96px);
  --text-title: clamp(32px, 4vw, 56px);
  --text-heading: clamp(20px, 2.5vw, 32px);
  --text-body: clamp(14px, 1.2vw, 16px);
  --text-small: 12px;
  --text-micro: 10px;

  --weight-thin: 200;
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semi: 600;
}
```

### Espaciado y Ritmo Visual

```css
:root {
  --space-section: clamp(100px, 15vw, 200px);
  --space-large: clamp(60px, 8vw, 120px);
  --space-medium: clamp(32px, 4vw, 64px);
  --space-small: clamp(16px, 2vw, 32px);

  --container-max: 1440px;
  --container-pad: clamp(24px, 6vw, 120px);

  --border-thin: 1px solid rgba(184, 150, 90, 0.15);
  --border-gold: 1px solid var(--color-gold-muted);

  --radius-none: 0;
  --radius-sm: 4px;
  --radius-card: 2px; /* casi sin radius — estética arquitectónica */

  --ease-luxury: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-reveal: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration-fast: 0.3s;
  --duration-medium: 0.8s;
  --duration-slow: 1.4s;
}
```

---

## Estructura de Archivos

```
/
├── public/
│   └── fonts/           (si se descargan localmente)
├── src/
│   ├── styles/
│   │   ├── global.css   (reset, variables, base)
│   │   ├── animations.css
│   │   └── components.css
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── Manifesto.astro
│   │   ├── FeaturedProperties.astro
│   │   ├── PropertyCard.astro
│   │   ├── StatsBar.astro
│   │   ├── Neighborhoods.astro
│   │   ├── Experience.astro
│   │   ├── Testimonial.astro
│   │   ├── ContactSection.astro
│   │   └── Footer.astro
│   ├── scripts/
│   │   ├── gsap-init.js      (registro de plugins)
│   │   ├── hero-anim.js
│   │   ├── scroll-anim.js
│   │   ├── cursor.js
│   │   └── noise.js
│   └── pages/
│       └── index.astro
├── astro.config.mjs
└── CLAUDE.md
```

---

## Secciones del Landing — Especificaciones Completas

### 1. CURSOR PERSONALIZADO

Implementar cursor custom que reemplaza el cursor del sistema operativo:

- Círculo pequeño (8px) dorado que sigue el cursor exacto
- Círculo grande (40px) con outline dorado tenue que sigue con lag (lerp suave)
- Al hacer hover en links/botones: el círculo grande se expande a 60px y cambia a `mix-blend-mode: difference`
- Al hacer hover en imágenes/propiedades: el cursor grande muestra texto "VER" centrado en font mono 10px
- Implementar con `requestAnimationFrame` y lerp: `x += (targetX - x) * 0.08`
- CSS: `cursor: none` en `html` y todos los elementos interactivos

```javascript
// Estructura base del cursor
class LuxuryCursor {
  constructor() {
    this.dot = document.querySelector(".cursor-dot");
    this.ring = document.querySelector(".cursor-ring");
    this.mouse = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.init();
  }
  // lerp suave, estados hover, estados de imagen
}
```

---

### 2. NAVEGACIÓN

**Comportamiento:**

- Posición: `fixed`, `top: 0`, `z-index: 1000`
- Fondo inicial: completamente transparente
- Al scroll > 80px: `backdrop-filter: blur(20px)` + `background: rgba(8,8,8,0.7)` con transición suave
- Al scroll hacia arriba: aparece. Al scroll hacia abajo: se oculta (translateY(-100%))

**Layout:**

```
[PENTO ◆ LUXURY]          [Propiedades] [Zonas] [Historia] [Contacto]          [Agendar Visita →]
```

**Detalles visuales:**

- Logo: "PENTO" en font-display weight 300, tracking 0.3em + "◆" dorado + "LUXURY" en font-mono weight 300 tracking 0.5em
- Links de nav: font-body weight 300, 12px, tracking 0.15em, uppercase
- Hover en links: underline que crece desde el centro con CSS `scaleX`
- Botón CTA: outline dorado 1px, padding 12px 28px, hover: fondo dorado, texto negro. Transición suave
- Línea decorativa debajo del nav (1px, gradiente de oro a transparente) visible solo cuando nav tiene fondo

---

### 3. HERO — La sección más importante

**Objetivo**: Impacto visual inmediato. Arquitectura modern-luxury colombiana. Escala cinematográfica.

**Estructura visual:**

```
┌─────────────────────────────────────────────────────┐
│  [video/imagen fullscreen con overlay gradient]      │
│                                                      │
│  PENTO                          ← texto gigante      │
│  LUXURY                         ← stack vertical     │
│                                                      │
│  ─────────────────────────                          │
│  Propiedades de ultra-lujo                          │
│  en Antioquia y Colombia                            │
│                                                      │
│           ↓ Scroll                                  │
│                                                      │
├──────────────────────────────────────────────────── │
│  [Zona: El Poblado]  [Proyectos: 24]  [Desde: $800M]│
└─────────────────────────────────────────────────────┘
```

**Implementación técnica:**

Background: Video HTML5 en loop muted autoplay, con fallback a imagen. Usar video de arquitectura de lujo (drone shots, atardeceres, piscinas infinitas). El video tiene `object-fit: cover`, `opacity: 0.6`, y un `filter: saturate(0.8) contrast(1.1)`.

El overlay tiene el gradiente `--gradient-hero` aplicado como pseudo-elemento.

**Texto del Hero:**

- "PENTO" en `--text-hero` (hasta 160px), `font-family: var(--font-display)`, `font-weight: 300`, `letter-spacing: -0.02em`, color blanco. **IMPORTANTE**: La "O" de PENTO debe ser un círculo dorado (SVG inline o `color: var(--color-gold)`)
- "LUXURY" en `--text-hero` pero `font-weight: 200`, `font-style: italic`, ligeramente desplazado a la derecha (padding-left: 15%)
- Línea horizontal dorada (1px, 80px de ancho) entre el título y el subtítulo, animada desde width: 0
- Subtítulo en font-body, weight 200, tracking 0.2em, uppercase, 14px

**Animación de entrada (GSAP timeline, duración total ~2.5s):**

```javascript
const tl = gsap.timeline({ delay: 0.3 });
// 1. Overlay fade in (0.01s) — para que no haya flash
// 2. "PENTO" — cada letra cae desde Y: -100, stagger 0.08s, ease: "power4.out"
// 3. "LUXURY" — cada letra sube desde Y: 100, stagger 0.08s, con delay 0.2s respecto a PENTO
// 4. Línea dorada — scaleX de 0 a 1, transformOrigin: "left center"
// 5. Subtítulo — opacity 0 → 1, Y: 20 → 0
// 6. Stats bar — fade in staggered
// 7. Scroll indicator — rebote suave infinito
```

Usar **GSAP SplitText** para dividir letras: `new SplitText(".hero-title", { type: "chars" })`

**Stats Bar (bottom del hero):**

- Fondo: `rgba(8,8,8,0.8)` + `backdrop-filter: blur(10px)`
- Border top: 1px dorado tenue
- 3 stats separados por líneas verticales:
  - "ZONA" label mono + "El Poblado, Llano Grande" valor display
  - "PROYECTOS" label mono + contador animado "24" valor display
  - "PRECIO DESDE" label mono + "$800M COP" valor display
- Los números se animan con contador GSAP cuando el hero entra

**Scroll Indicator:**

- Texto "DESCUBRIR" en font-mono 10px, rotado 90deg, lado derecho
- Línea vertical debajo que crece y encoge en loop infinito
- Arrow SVG bouncing suave

---

### 4. MANIFESTO — Sección de filosofía

**Texto centrado, solo tipografía, sin imágenes:**

```
"No vendemos propiedades.
 Creamos el escenario
 de tu mejor vida."
```

- Fondo: `--color-void`
- Texto en `--text-display`, font-display, italic, weight 300
- Animación: SplitText por líneas. Cada línea hace reveal con clip-path:
  `clip-path: inset(0 100% 0 0)` → `clip-path: inset(0 0% 0 0)` al entrar en viewport
- Duración 1.2s por línea, stagger 0.3s, ease: power4.out
- Debajo del texto: número decorativo "— 2024" en font-mono, color dim
- Línea horizontal decorativa dorada que atraviesa el ancho completo

---

### 5. PROPIEDADES DESTACADAS

**Título de sección:**

- Label: "◆ PROPIEDADES" en font-mono 11px, color gold, tracking 0.4em, uppercase
- Título: "Residencias de Autor" en font-display, --text-title, weight 300
- Link "Ver todas →" alineado a la derecha del título

**Grid de propiedades:**

Layout asimétrico:

```
┌────────────────────┬──────────┐
│                    │  Card 2  │
│      Card 1        ├──────────┤
│   (2x height)      │  Card 3  │
└────────────────────┴──────────┘
```

Cada **PropertyCard** contiene:

- Imagen fullbleed con `object-fit: cover`
- Badge de estado: "DISPONIBLE" / "PREVENTA" / "EXCLUSIVO" en font-mono 9px, dorado
- Overlay gradient desde abajo
- Zona: "El Poblado, Medellín" en font-mono 10px, plateado
- Nombre: "Residencia Nogal" en font-display 28px, blanco
- Precio: "$2.400.000.000" en font-display 22px, dorado
- Stats inline: "4 hab · 420 m² · 3 parqueaderos"
- Botón hover: "→ Ver Detalles" que aparece desde abajo

**Animaciones de las cards:**

- Parallax en imagen: `background-position-y` se mueve con scroll (GSAP ScrollTrigger)
- Hover: la imagen hace `scale(1.05)` suave (transición 0.8s ease)
- Hover: overlay se oscurece ligeramente
- Al entrar en viewport: cards aparecen con `opacity: 0 → 1` + `translateY: 60px → 0`, stagger 0.15s

**Datos de propiedades (hardcoded para el MVP landing):**

1. **Residencia Nogal** — El Poblado alto — $2.4B COP — 420m² — 4 hab
2. **Penthouse Milla de Oro** — Medellín — $3.8B COP — 560m² — 5 hab
3. **Casa Llano Grande** — Llano Grande, Rionegro — $1.9B COP — 680m² — 5 hab
4. **Villa Santa Marta** — El Rodadero — $2.1B COP — 380m² — 4 hab

---

### 6. BARRA DE ESTADÍSTICAS ANIMADAS

Fondo negro con textura de ruido sutil (noise.js o CSS noise filter).

```
[+200]              [20+]               [$500B+]            [15]
Propiedades         Años de             en transacciones    ciudades
vendidas            experiencia         gestionadas         Colombia
```

- Números en `--text-display`, font-display, color gold
- Labels en font-mono 11px, color silver, uppercase tracking
- Al entrar en viewport: números cuentan desde 0 con GSAP `CountTo`
- Separados por líneas verticales `var(--border-thin)`
- Fondo tiene efecto "grain" CSS: `filter: url(#noise)` con SVG filter inline

---

### 7. ZONAS — Sección de barrios

**Concepto**: Mapa visual de zonas con hover reveal.

**Layout horizontal scrollable (en desktop):**

```
El Poblado  |  Llano Grande  |  El Retiro  |  Envigado  |  Santa Marta
```

Cada zona:

- Imagen de fondo fullbleed (arquitectura, vista aérea)
- Altura: 70vh
- Ancho: 20% cada una, pero al hover la activa expande a 50% y las demás se comprimen (CSS transition en flex)
- Texto al hover: nombre de zona + "X propiedades disponibles" + "Explorar →"
- Animación de expansión: GSAP con duración 0.6s, ease: power2.inOut

**Zonas:**

1. **El Poblado** — "El epicentro del lujo en Medellín"
2. **Llano Grande** — "Haciendas y fincas de autor en el Oriente"
3. **El Retiro** — "Exclusividad a 30 minutos de la ciudad"
4. **Envigado** — "Tranquilidad y sofisticación urbana"
5. **Santa Marta** — "Frente al mar Caribe"

---

### 8. EXPERIENCIA PENTO — Sección de diferenciadores

Tres columnas con líneas divisoras doradas:

```
DISCRECIÓN          CURADURÍA           CONCIERGE
─────────           ─────────           ─────────
Cada transacción    Solo propiedades    Tu asesor personal
manejada con        que pasan nuestro   disponible 24/7
absoluta reserva    filtro de 47 puntos durante todo el proceso
```

- Número ordinal en font-mono, color gold-muted: "01", "02", "03"
- Título en font-display 24px, weight 400
- Línea dorada separadora 40px
- Texto en font-body 14px, color silver, line-height 1.8

**Animación**: Al entrar en viewport, cada columna hace reveal desde abajo con stagger 0.2s

---

### 9. TESTIMONIAL

**Fullscreen dark, centrado:**

```
"                                                  "

  Pento no es una inmobiliaria.
  Es el guardián del patrimonio familiar
  que construí en 30 años.

                              — Juan Camilo Álvarez
                                Empresario, Medellín
```

- Quote marks decorativos en font-display, 200px, color gold-muted, opacity 0.3
- Texto en font-display italic, --text-heading, weight 300
- Autor en font-mono 12px, color silver
- Background: foto de lujo extremadamente oscura y difuminada
- **Animación**: SplitText palabra por palabra, stagger 0.04s, fade in desde opacity 0

---

### 10. FORMULARIO DE CONTACTO / CTA FINAL

**Headline impactante:**
"Tu siguiente propiedad merece una conversación privada."

- Formulario minimalista: solo 3 campos
  - Nombre (input, font-body, background transparente, border-bottom dorado 1px)
  - WhatsApp / Teléfono
  - Zona de interés (select estilizado)
- Botón: "Solicitar Asesoría Privada" — fullwidth, background dorado, texto negro peso 500, 16px tracking 0.1em
- Al hover: background cambia a gold-light + scale(1.01) muy sutil
- Al submit: botón hace loading animation (dots pulsantes) → mensaje de confirmación elegante

**Info lateral:**

- Teléfono: `+57 (4) 444 0000`
- Email: `asesores@pentoluxury.com`
- "O escríbenos directamente en" + ícono de WhatsApp dorado

---

### 11. FOOTER

```
PENTO ◆ LUXURY                    Propiedades    Zonas      Historia
                                   El Poblado     Envigado   Equipo
Medellín, Colombia                 Llano Grande   Retiro     Prensa
                                   Santa Marta
──────────────────────────────────────────────────────────────────
© 2024 Pento Luxury. Todos los derechos reservados.    [IG] [LI]
```

- Fondo `--color-obsidian`
- Logo grande en la izquierda, 64px, weight 200
- Grid de links a la derecha
- Línea dorada separadora antes del copyright
- Iconos sociales: SVG inline, hover: dorado

---

## Animaciones GSAP — Configuración Completa

### Setup inicial (gsap-init.js)

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

// Configuración global
gsap.config({
  nullTargetWarn: false,
  trunc: 4,
});

// Defaults para todas las animaciones de scroll
ScrollTrigger.defaults({
  markers: false,
  toggleActions: "play none none none",
});
```

### Animaciones de Scroll (scroll-anim.js)

**Revelar elementos al scroll** — función reutilizable:

```javascript
function revealOnScroll(selector, options = {}) {
  const elements = gsap.utils.toArray(selector);
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: options.y || 80 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 1.2,
        ease: options.ease || "power3.out",
        scrollTrigger: {
          trigger: el,
          start: options.start || "top 85%",
          ...options.scrollTrigger,
        },
      },
    );
  });
}
```

**Parallax en imágenes:**

```javascript
gsap.utils.toArray(".parallax-img").forEach((img) => {
  gsap.to(img, {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: img.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});
```

**Texto que cambia de color con scroll (para el manifesto):**

```javascript
gsap.to(".manifesto-text", {
  color: "var(--color-white)",
  scrollTrigger: {
    trigger: ".manifesto-section",
    start: "top 60%",
    end: "bottom 40%",
    scrub: 1,
  },
});
```

**Número contador:**

```javascript
function animateCounter(el, target) {
  gsap.to(
    { val: 0 },
    {
      val: target,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 80%" },
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].val).toLocaleString(
          "es-CO",
        );
      },
    },
  );
}
```

### Animación de Zonas (horizontal expand)

```javascript
const zones = document.querySelectorAll(".zone-item");
zones.forEach((zone) => {
  zone.addEventListener("mouseenter", () => {
    gsap.to(zones, { flex: "0 0 15%", duration: 0.5, ease: "power2.inOut" });
    gsap.to(zone, { flex: "0 0 50%", duration: 0.5, ease: "power2.inOut" });
  });
});
document
  .querySelector(".zones-container")
  .addEventListener("mouseleave", () => {
    gsap.to(zones, { flex: "0 0 20%", duration: 0.5, ease: "power2.inOut" });
  });
```

---

## Efectos Visuales Adicionales

### Noise Texture

```javascript
// Aplicar grano fotográfico sobre toda la página
// SVG filter inline en el body:
const noiseFilter = `
<svg style="position:fixed;top:-50%;left:-50%;width:200%;height:200%;z-index:9999;pointer-events:none;opacity:0.035">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)"/>
</svg>`;
```

### Smooth Scroll

```javascript
// Implementar smooth scroll con lerp usando requestAnimationFrame
// O usar el plugin nativo de GSAP Observer para scroll suave
// Importante: no afectar el ScrollTrigger
```

### Loader / Intro Screen (opcional pero recomendado)

```
[pantalla negra]
  PENTO           (aparece letra por letra, 0.5s)
  ────────        (línea que crece, 0.3s)
  LUXURY          (aparece, 0.3s)
[fade out del loader, fade in del sitio]
```

- Duración total del loader: ~2 segundos
- Implementar con `position: fixed`, `z-index: 9999`, luego `pointer-events: none` y `opacity: 0` al terminar

---

## Responsividad

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  /* Hero: título más pequeño, video de fondo con mayor contraste */
  /* Zonas: scroll horizontal touch-friendly en lugar de expand */
  /* Grid propiedades: 1 columna */
  /* Stats bar: 2x2 grid */
  /* Nav: hamburger menu con panel lateral */
}

/* Tablet */
@media (max-width: 1024px) {
  /* Grid propiedades: 2 columnas iguales */
  /* Zonas: acordeón vertical en lugar de horizontal expand */
}
```

**Hamburger Menu Mobile:**

- Ícono: 3 líneas → X con animación GSAP
- Panel: slide desde la derecha, fullscreen, fondo negro
- Links: aparecen en stagger desde la derecha

---

## Performance

- Todas las imágenes deben usar `loading="lazy"` excepto el hero
- El video del hero debe cargar con `preload="metadata"` y empezar solo cuando sea visible
- GSAP debe importarse solo en el cliente (en Astro: `<script>` tag sin `is:inline` para tree-shaking)
- Fuentes: `font-display: swap` en todos los @font-face
- Las animaciones deben usar `will-change: transform, opacity` solo en elementos que van a animar, y removerlo después (`onComplete`)
- `ScrollTrigger.refresh()` llamar después de que todas las imágenes carguen

---

## SEO y Meta Tags

```html
<title>Pento Luxury — Propiedades de Ultra-Lujo en Colombia</title>
<meta
  name="description"
  content="Residencias exclusivas en El Poblado, Llano Grande, El Retiro y Santa Marta. Curaduría de propiedades de alto patrimonio en Colombia."
/>
<meta property="og:title" content="Pento Luxury" />
<meta property="og:image" content="/og-image.jpg" />
<!-- Schema.org RealEstateAgent -->
```

---

## Contenido en Español — Tono de Voz

**Principios:**

- Nunca "compra" — siempre "adquiere" o "invierte"
- Nunca "apartamento" — siempre "residencia" o "penthouse"
- Nunca "barato" ni "precio" casual — siempre "valorización", "inversión", "patrimonio"
- Nunca jerga inmobiliaria genérica

**Ejemplos de copy:**

- ❌ "Compra tu apartamento ideal"
- ✓ "Encuentra la residencia que merece tu nombre"
- ❌ "Tenemos los mejores precios"
- ✓ "Cada propiedad es una decisión de patrimonio"
- ❌ "Llámenos ya"
- ✓ "Iniciemos una conversación privada"

---

## Notas Finales de Implementación

1. **Orden de implementación recomendado:**
   - [ ] Setup Astro + estructura de archivos
   - [ ] CSS global (variables, reset, tipografía)
   - [ ] Nav + Footer (estructura)
   - [ ] Hero (sección más compleja, empezar aquí)
   - [ ] GSAP setup + animación hero
   - [ ] Cursor personalizado
   - [ ] Loader/intro
   - [ ] Secciones en orden: Manifesto → Propiedades → Stats → Zonas → Experiencia → Testimonial → Contacto
   - [ ] Scroll animations (ScrollTrigger)
   - [ ] Responsividad mobile
   - [ ] Noise texture + efectos finales
   - [ ] Performance pass

2. **Nunca usar**: colores brillantes, fonts genéricas (Inter, Roboto), bordes redondeados excesivos, sombras de caja genéricas, animaciones de bounce, gradientes de arcoíris.

3. **Siempre**: movimientos lentos y controlados, letras con tracking amplio en labels, espacio negativo generoso, jerarquía visual clara, gold como único acento.

4. El resultado final debe sentirse como el sitio web de **Rolls-Royce** o **One&Only Resorts** — no como una inmobiliaria colombiana promedio.
