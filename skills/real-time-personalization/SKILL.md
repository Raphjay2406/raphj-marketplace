---
name: real-time-personalization
description: User-preference-driven DNA adjustments — reduced motion, reduced data, high contrast, battery-aware, connection-aware, ambient-light, input-device, locale. Every site adapts live without server round-trip.
tier: core
triggers: real-time-personalization, prefers-*, media-query, adaptive-ux, battery-api, connection-api
version: 0.1.0
---

# Real-Time Personalization

User preference signals drive live DNA + UX adjustments. All client-side; no tracking.

## Layer 1 — When to use

Every project gets this; it's baseline 2026 expectation. Sections that adapt:
- Motion (reduce animation intensity)
- Data (swap video for poster)
- Contrast (drop subtle gradients)
- Density (larger text + hit areas)
- Layout (reflow for input device)

## Layer 2 — Signal sources

### Media queries (universal)

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

@media (prefers-color-scheme: dark) {
  :root { --bg: oklch(12% 0.02 240); --fg: oklch(92% 0.01 240); }
}

@media (prefers-reduced-data: reduce) {
  .hero-video { display: none; }
  .hero-poster { display: block; }
}

@media (prefers-contrast: more) {
  :root { --border: currentColor; }
}

@media (forced-colors: active) {
  button { border: 2px solid ButtonText; }
}
```

### JavaScript APIs

```ts
// Battery Status
if ('getBattery' in navigator) {
  const battery = await navigator.getBattery();
  if (battery.level < 0.2 && !battery.charging) {
    document.documentElement.dataset.mode = 'battery-saver';
  }
}

// Connection
const conn = navigator.connection;
if (conn?.effectiveType === '2g' || conn?.saveData) {
  document.documentElement.dataset.data = 'reduced';
}

// Ambient light (Chrome flag)
if ('AmbientLightSensor' in window) {
  const sensor = new AmbientLightSensor();
  sensor.addEventListener('reading', () => {
    document.documentElement.dataset.light = sensor.illuminance < 50 ? 'dark' : 'bright';
  });
  sensor.start();
}

// Input device
window.addEventListener('pointerdown', (e) => {
  document.documentElement.dataset.input = e.pointerType; // 'mouse' | 'touch' | 'pen'
}, { once: false });
```

## Layer 3 — DNA adaptations

| Signal | DNA adjustment |
|---|---|
| prefers-reduced-motion | disable animations; scroll-jump fallbacks |
| prefers-color-scheme: dark | apply dark palette from seeds |
| prefers-reduced-data | swap video→poster, disable autoplay GIFs |
| prefers-contrast: more | increase border visibility, drop subtle gradients |
| forced-colors | use ButtonText / CanvasText system keywords |
| Battery low | disable non-critical animation (GSAP timelines paused) |
| Connection 2G/saveData | image quality 50%, lazy-load everything |
| Ambient light dark | shift to dark mode even if prefers-color-scheme not set |
| Touch input | larger hit targets, swipe affordances |
| Keyboard input | visible focus rings, skip-link visibility |

## Layer 4 — Archetype compatibility

Not every archetype adapts the same way. Kinetic archetype with reduced-motion must still FEEL kinetic — through micro-interactions that respect reduce (hover color shift, scroll-driven layout morph).

See `skills/motion-health/SKILL.md` for reduced-motion parity requirement.

## Layer 5 — Integration

- Wave 0 scaffold includes `<html data-*>` attributes from client hydration
- Components read via `data-mode="battery-saver"` CSS selectors
- UX sub-gate interaction-fidelity I2 checks focus-ring presence for keyboard input
- Ledger: `personalization-signal-detected` (rate-limited)

## Layer 6 — Privacy

All signals are client-side; no network round-trip. No tracking. User can override any adjustment via explicit toggle.

## Layer 7 — Anti-patterns

- ❌ Prompting user to "enable reduced motion" instead of respecting it — ignore the signal = regression
- ❌ Battery API blocking render — read async, don't await
- ❌ Aggressive data-saver (disabling all images) — broken experience
- ❌ Overriding forced-colors — breaks Windows High Contrast users
- ❌ Auto-dark-mode without prefers-color-scheme fallback — violates user choice
