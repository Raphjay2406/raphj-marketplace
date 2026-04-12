---
name: animation-path-similarity
description: Compare animation paths/timelines between reference + current. Keyframe curves + easing + duration + trigger timing. Different from layout-diff (motion, not position).
tier: domain
triggers: animation-diff, keyframe-compare, timeline-similarity
version: 0.1.0
---

# Animation Path Similarity

Two sections can have identical layouts but wildly different motion quality. This skill measures motion itself.

## Layer 1 — Capture

```ts
// Sample element transform over 2 seconds at 60fps
const samples = await page.evaluate(async (selector) => {
  const el = document.querySelector(selector);
  const frames = [];
  const start = performance.now();
  while (performance.now() - start < 2000) {
    const style = getComputedStyle(el);
    frames.push({
      t: performance.now() - start,
      opacity: parseFloat(style.opacity),
      transform: style.transform,
    });
    await new Promise(r => requestAnimationFrame(r));
  }
  return frames;
}, '#hero');
```

## Layer 2 — Normalize + compare

Both reference + current sampled at same rate. Compute DTW (dynamic time warping) distance or simple RMSE:

```ts
function rmse(ref, cur) {
  const n = Math.min(ref.length, cur.length);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (ref[i].opacity - cur[i].opacity) ** 2;
    // + transform component-wise diff
  }
  return Math.sqrt(sum / n);
}
```

## Layer 3 — Derived metrics

- **Duration delta** — ref 800ms, cur 1200ms → 50% longer, flag
- **Easing similarity** — fit curve to cubic-bezier points; compare control points
- **Trigger timing** — when animation starts vs scroll position
- **Concurrent animations** — how many elements animating simultaneously

## Layer 4 — Integration

- Motion-health sub-gate extends with path similarity for refresh parity
- Regression check flags animation drift even when layout identical
- Quality-gate: reference-diff SSIM + animation-path-similarity both feed Creative Courage cap

## Layer 5 — Anti-patterns

- ❌ Zero-tolerance on timing — reduced-motion path legitimately differs
- ❌ Ignoring trigger timing — fires-on-load vs fires-on-scroll visually identical mid-animation, wildly different UX
- ❌ RMSE on raw transforms without decomposition — rotate vs translate weighted equally is wrong
