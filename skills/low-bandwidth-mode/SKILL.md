---
name: low-bandwidth-mode
description: 2G-viable mode — swap video→poster, reduce image quality 60%, defer non-critical JS, strip web fonts. prefers-reduced-data + connection.effectiveType detection.
tier: domain
triggers: low-bandwidth, 2g-mode, reduced-data, save-data, connection-api
version: 0.1.0
---

# Low Bandwidth Mode

## Layer 1 — Detection

```ts
const conn = navigator.connection;
const slow = conn?.effectiveType === '2g'
          || conn?.effectiveType === 'slow-2g'
          || conn?.saveData === true;

if (slow) document.documentElement.dataset.bandwidth = 'low';
```

Plus media query:
```css
@media (prefers-reduced-data: reduce) {
  :root { --bandwidth: low; }
}
```

## Layer 2 — Adjustments

| Asset | Default | Low mode |
|---|---|---|
| Hero video | autoplay MP4 | Replace with static poster (WebP) |
| Background video | loop | Remove; use bg-color + gradient |
| Images | WebP srcset | AVIF srcset at 60% quality, smaller sizes |
| Web fonts | Load all weights | System stack only; custom font only for display |
| Non-critical JS | Immediate | Defer via Intersection Observer only |
| Animations | Full motion | Disabled (respects prefers-reduced-motion too) |
| Analytics | Full | Minimal or deferred |

## Layer 3 — Integration

- Build emits two critical-path bundles: default + low-bandwidth
- Server-hint header for Server-Timing + 103 Early Hints
- UX sub-gate: interaction-fidelity I1 touch targets still 44px (no compromise)

## Layer 4 — Anti-patterns

- ❌ Disabling core features (CTA, forms) in low mode — regression
- ❌ Not testing low mode — ships but never verified
- ❌ Forcing user to opt-in to fast mode — default should be respectful of signal
