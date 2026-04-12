---
name: "brand-motion-sigils"
description: "Motion-first brand marks using Lottie and Rive. Archetype-bound entrance animations, loop sigils, and interactive state machines. DNA color injection at runtime."
tier: "domain"
triggers: "motion logo, lottie sigil, rive brand, animated wordmark, brand motion, motion mark"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Brand needs a "living" mark — preloader, footer signature, CTA flourish.
- Archetype: kinetic, ai-native, retro-future, vaporwave, neon-noir favor Rive state machines.
- Editorial, luxury, swiss-international favor Lottie subtle loops.

### When NOT to Use

- Static print deliverables — use static SVG logo export.
- Users on `prefers-reduced-motion` → always fall back to static SVG.

### Decision Tree

- Needs input-driven state (hover, scroll, click) → Rive.
- Linear timed animation only → Lottie (smaller runtime).
- Both needed → Rive with timeline artboards.

## Layer 2: Example (Rive)

```tsx
import { useRive, Layout, Fit } from '@rive-app/react-canvas';

export function BrandSigil() {
  const { rive, RiveComponent } = useRive({
    src: '/brand/sigil.riv',
    stateMachines: 'Main',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain }),
  });
  // DNA color inputs
  useEffect(() => {
    if (!rive) return;
    rive.setTextRunValue?.('primary', getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
  }, [rive]);
  return <RiveComponent aria-label="Brand sigil" role="img" />;
}
```

## Layer 3: Integration Context

- Assets governed by `asset-forge-manifest` — sha256, license, DNA coverage.
- Complements `3dsvg` hero marks (static 3D) with time-based motion.
- Exported from Figma via LottieFiles plugin; Rive hand-authored in editor.

## Layer 4: Anti-Patterns

- Autoplay with sound — browsers block; degrades UX.
- No `prefers-reduced-motion` fallback — fails a11y gate.
- Multiple heavy sigils on same page — blows perf budget; one per viewport max.
