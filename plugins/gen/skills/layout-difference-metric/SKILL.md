---
name: layout-difference-metric
description: Grid-aware layout difference beyond pixel diff. Bounding-box delta for element positions. Survives font-rendering/antialiasing noise that fools pixel diff.
tier: domain
triggers: layout-diff, bounding-box, grid-compare
version: 0.1.0
---

# Layout Difference Metric

Pixel diff reports fail on subpixel font rendering changes. Layout diff reports only when elements actually move.

## Layer 1 — Capture

```ts
// Baseline + current: capture bounding boxes via Playwright
const boxes = await page.$$eval('*[id], *[data-section]', elements =>
  elements.map(el => {
    const r = el.getBoundingClientRect();
    return { id: el.id || el.dataset.section, x: r.x, y: r.y, w: r.width, h: r.height };
  })
);
```

## Layer 2 — Diff

```ts
function boxDiff(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.w - b.w) + Math.abs(a.h - b.h);
}

function compareLayouts(baseline, current, threshold = 4) {
  const diffs = [];
  for (const base of baseline) {
    const curr = current.find(c => c.id === base.id);
    if (!curr) { diffs.push({ id: base.id, change: 'removed' }); continue; }
    const d = boxDiff(base, curr);
    if (d > threshold) diffs.push({ id: base.id, change: 'moved', delta: d });
  }
  for (const curr of current) {
    if (!baseline.find(b => b.id === curr.id)) diffs.push({ id: curr.id, change: 'added' });
  }
  return diffs;
}
```

## Layer 3 — Grid compliance

```ts
function gridCompliance(boxes, gridUnit = 8) {
  let onGrid = 0, total = 0;
  for (const box of boxes) {
    const modY = Math.abs(box.y % gridUnit);
    if (modY <= 2 || modY >= 6) onGrid++;
    total++;
  }
  return onGrid / total;
}
```

See visual-craft-quantified V1 — this skill provides the measurement.

## Layer 4 — Integration

- Regression-diff extends with layout-diff dimension
- Visual-craft-quantified V1 baseline compliance uses this
- Pareto-selector could add O5 "layout fidelity" vs reference
- Ledger: `layout-drift`

## Layer 5 — Anti-patterns

- ❌ Expecting perfect grid (threshold 0) — rendering vagaries
- ❌ Ignoring width-only changes (100→105px stays on grid but matters)
- ❌ Not tracking added/removed — only drift shows up
