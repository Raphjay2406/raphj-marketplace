---
name: visual-craft-quantified
description: Baseline-grid compliance, vertical rhythm, type-scale ratio, whitespace band, color harmony (off-DNA hue count), and Gestalt proximity — all as binary machine checks. Replaces v2's vague "focal rhythm" / "guides the eye" with measurable criteria. Scores 20 in Axis 2.
tier: core
triggers: visual-craft, baseline-grid, vertical-rhythm, type-scale, gestalt, color-harmony, quality-gate-v3
version: 0.1.0-provisional
---

# Visual Craft (Quantified) Gate

20 points. 5 checks. This is where v3 de-vagues v2 — every criterion here has a measurement rule.

## Layer 1 — When to use

Axis 2 of quality-gate-v3. Measures visual craft with numbers, not taste. Subjective craft lives in Axis 1 (Creative Courage); this sub-gate catches the mechanical failures Axis 1 can't see.

## Layer 2 — Checks

### V1. Baseline-grid compliance ≥ 90% (4pt)

- **PASS**: ≥ 90% of text-containing elements have computed `top` value that is a multiple of 8px (±2px tolerance) at 1280 viewport.
- **CHECK**: Playwright `browser_evaluate`:

```js
const els = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
let on = 0, total = 0;
els.forEach(el => {
  const top = el.getBoundingClientRect().top;
  const mod = Math.abs(top % 8);
  if (mod <= 2 || mod >= 6) on++;
  total++;
});
return { compliance: on / total };
```

### V2. Type-scale ratio ∈ 1.125–1.333 (4pt)

- **PASS**: Consecutive type steps in the section (by font-size) form a consistent ratio in the band.
- **CHECK**: Extract all distinct `font-size` values from computed styles; sort; check adjacent ratios.
- Allowed deviations: 1 outlier per section (display type can break the scale).

### V3. Whitespace ratio ∈ band per beat (4pt)

- See `cognitive-load-gate` C6. Cross-referenced: this check and C6 must agree (same measurement). If they disagree, bug in measurement — investigate.
- Overlap is intentional: cognitive load and visual craft both care about density.

### V4. Color harmony — off-DNA hue count ≤ 3 (4pt)

- **PASS**: After subtracting DNA palette (primary, secondary, accent, muted, bg, surface, text, border + 4 expressive), computed page colors contain ≤ 3 distinct hues at ΔE2000 > 8 from any DNA token.
- **CHECK**: Playwright extracts all rendered colors (via `getComputedStyle` on every element + image histogram sampling); cluster by hue; count off-DNA.

### V5. Gestalt proximity coherence (4pt)

- **PASS**: Related elements (share parent, share semantic role, within a `<section>` / `<article>` / `<li>`) have spacing ≤ 1.5× the spacing unit; unrelated elements ≥ 2× spacing unit apart.
- **CHECK**: For each sibling pair at same depth, compute inter-element distance; classify "related" (shared parent, adjacent in same list) vs "unrelated" (different sections); verify spacing ratio.

## Layer 3 — Integration

- **Output**: `.planning/genorah/audit/visual-craft/<section-id>.json`
- **Ledger**: subgate-fired event.
- **Cross-references**:
  - V3 shared with cognitive-load-gate C6 (single measurement, two rubrics).
  - V4 consumes DNA tokens from DESIGN-DNA.md; no re-extraction.
  - V5 interlocks with layout-techniques skill for proximity rules.

## Layer 4 — Anti-patterns

- ❌ Scoring V1 without a baseline set in DNA — skill requires `baseline: 8px` (or DNA override) declared.
- ❌ Counting gradient stops as off-DNA hues for V4 — gradients between DNA tokens are legal.
- ❌ Penalizing archetypes that deliberately break proximity (Brutalist, Vaporwave) on V5 — archetype override allowed when documented in DECISIONS.md.
- ❌ Using V2 to forbid display-type scale breaks — display is explicitly allowed one outlier.
