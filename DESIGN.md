# Design System — NIBEDULA TECH E.I.R.L.

## Color strategy

**Committed** — el teal oscuro del logo (#0d6470) lleva 40-60% del surface en hero, footer y secciones CTA. Las secciones de contenido son claras (#f8fafb / #fff) para que el teal tenga peso cuando aparece. El acento vibrante (#00d4aa) se reserva para acciones primarias y highlights inline, no para fondos completos.

### Palette

```
--color-primary:       oklch(42% 0.08 192)   /* #0d6470 — teal oscuro, logo */
--color-primary-light: oklch(52% 0.08 192)   /* #1a8a9a */
--color-primary-dark:  oklch(32% 0.08 192)   /* #094a54 */
--color-accent:        oklch(78% 0.14 170)   /* #00d4aa — acción, highlight */
--color-accent-dark:   oklch(68% 0.13 170)   /* #00a882 */

--color-dark:          oklch(10% 0.015 230)  /* #07111e — fondo hero/footer */
--color-dark-2:        oklch(13% 0.018 230)  /* #0a1628 */
--color-dark-3:        oklch(15% 0.022 230)  /* #0d2040 */

--color-text:          oklch(20% 0.015 230)  /* #1a2332 */
--color-text-muted:    oklch(45% 0.01 230)   /* #5a6a7e */
--color-surface:       oklch(98% 0.003 230)  /* #f8fafb */
```

### Usage rules

- **Dark sections** (hero, footer, cta-final, importaciones): `var(--color-dark)` a `var(--color-dark-3)`.
- **Light sections** (servicios, proceso, faq): `var(--color-surface)` o `#fff`.
- `var(--color-accent)` solo en: botones primarios, links de acción, highlights de texto puntual. Nunca como fondo de sección completa.
- No usar gradient text (`background-clip: text`). Usar solid `var(--color-accent)` para enfasis.

## Typography

### Fonts in use

```css
--font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
```

**Nota:** Ambas están en la lista de reflex-reject del sistema. Para rediseños futuros, considerar Geist (headings técnicos) + Onest (body legible). Por ahora se mantienen por consistencia con la implementación actual.

### Scale

```
Hero H1:    clamp(3rem, 6vw, 4.5rem)  — extrabold, leading 1.08, tracking -0.03em
Section H2: clamp(2rem, 4vw, 2.5rem)  — bold, leading 1.2
Card H3:    1.25rem                    — bold
Body:       1rem                       — regular, leading 1.75
Body sm:    0.875rem                   — muted, leading 1.6
```

### Rules

- Contraste mínimo texto/fondo: 4.5:1 (WCAG AA). En superficies oscuras: usar `rgba(255,255,255,0.65)` mínimo para texto secundario.
- Max-width párrafos: 65ch en cuerpo, 520px en subtítulos de hero.
- Texto en oscuro: añadir 0.05 al line-height respecto al claro.

## Buttons

| Variant | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| `btn--primary` | `--color-primary` | blanco | mismo | CTA principal siempre |
| `btn--white` | blanco | `--color-primary-dark` | blanco | CTA sobre fondo oscuro |
| `btn--ghost` | `rgba(255,255,255,0.08)` | blanco | `rgba(255,255,255,0.15)` | secundario en hero dark |
| `btn--outline-white` | transparente | blanco | `rgba(255,255,255,0.4)` | alternativa en CTA oscuro |

- Shape: `border-radius: 9999px` (pill). Tamaño base: `padding: 0.75rem 1.5rem`.
- Focus visible: outline 2px solid `var(--color-accent)` con offset 3px.

## Components

### Navbar

- Posición: `fixed`, `z-index: 200`. Starts transparent, gains `background: rgba(7,17,30,0.92) + blur(12px)` al scroll.
- Logo: imagen + texto "NIBEDULA **TECH**" donde TECH es `var(--color-accent)`.
- Mobile: panel lateral derecho (300px) con `transform: translateX(100%)` → `translateX(0)`.

### Service Cards

- Border: 1px `var(--color-border)`. Hover: border-color `rgba(13,100,112,0.3)`, shadow-md, `translateY(-3px)`.
- Ícono: 40x40px sin caja de fondo. El ícono flota sobre el contenido, `opacity: 0.75` → `1` en hover.
- No usar el patrón "icono grande en caja redondeada sobre heading" — brand ban.
- Feature list: viñetas con SVG inline (circle + checkmark en teal).

### FAQ

- `<details>`/`<summary>` nativos, con animación `max-height` via JS.
- Solo un ítem abierto a la vez (accordion).
- Chevron rota 180° al abrir. Pregunta toma `--color-primary` cuando está activa.

### Hero

- Full-viewport, fondo `var(--gradient-hero)` (dark radial teal).
- Grid 2 columnas en desktop, stack en mobile. Ilustración con `animation: hero-float`.
- Trust signals debajo del CTA: horizontal, texto pequeño, separados por líneas verticales de 1px. No usar el template "número grande + etiqueta".

## Motion

- Entrance animations: `IntersectionObserver` con `translateY(28px)` → `none` + `opacity: 0` → `1`. Threshold 10%.
- Duration: 380ms, `cubic-bezier(0.4, 0, 0.2, 1)`.
- Hero illustration: `translateY 0 → -14px` loop de 6s, ease-in-out. No bounce.
- Canvas particles: nodos flotantes en el hero, `opacity: 0.14`, velocidad lenta.
- `prefers-reduced-motion: reduce`: desactiva todas las animaciones. Se muestra estado final desde el inicio.

## Spacing rhythm

| Prop | Uso |
|---|---|
| `clamp(4rem, 8vw, 6rem)` | `padding-block` secciones |
| `var(--space-12)` | gap section-header → contenido |
| `var(--space-8)` | gap dentro de grids de cards |
| `var(--space-6)` | padding interno de cards |
| `var(--space-16)` | footer padding-top |

## Accessibility

- WCAG AA target.
- Skip link activo (aparece con :focus).
- Focus visible: `outline: 2px solid var(--color-accent)` con `outline-offset: 3px`.
- ARIA: `aria-label` en todos los CTAs con contexto, `aria-current="page"` en nav activo, `aria-expanded` en toggles.
- Imágenes decorativas: `alt=""`. Imágenes de cliente: alt descriptivo.
- `prefers-reduced-motion` respetado globalmente.

## Anti-patterns to avoid

- Gradient text (`background-clip: text`). Usar `color: var(--color-accent)` sólido.
- Hero-metric template (número grande + etiqueta estadística abajo).
- Rounded icon boxes (`border-radius` + background teal) encima de cada heading de card.
- Borders laterales de color (`border-left: 4px solid teal`) como decoración de cards o alerts.
- Templates SaaS genéricos: métricas infladas, stock photos de laptops, gradientes azul/morado.
- Glassmorphism decorativo sin propósito.
