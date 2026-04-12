---
name: motion-health
tier: core
description: "Motion-quality sub-gate inside Motion & Interaction category. Measures INP regression, GPU layer count, concurrent animations, reduced-motion parity, scroll-timeline fallback, motion conflicts. Fail caps parent category at 50% — blocks SOTD-Ready tier."
triggers: ["motion health", "animation performance", "INP regression", "reduced-motion", "GPU layers", "scroll-driven fallback", "motion conflicts"]
used_by: ["quality-reviewer", "polisher", "visual-refiner"]
version: "3.0.0"
hard_gate: true
gate_type: sub_gate
parent_category: "Motion & Interaction"
---

## Layer 1: Decision Guidance

### Why Motion Health (Sub-Gate, Not Category 13)

Motion & Interaction on the 234-pt gate scores creative motion quality — choreography, entrance polish, hover delight. It does not measure motion *safety*: INP regression, GPU layer explosion, reduced-motion parity, scroll-timeline fallback presence.

Making Motion Health a new category 13 would force rebalancing the 234-pt gate, which ripples through archetype docs, exports, and Obsidian vault queries. Making it a **sub-gate inside Motion & Interaction** preserves the 234-pt total: fail Motion Health → parent category scores capped at 50%, regardless of creative merit.

This separates "is the motion beautiful?" (category) from "is the motion safe?" (sub-gate). A section can be beautifully animated but unsafe; the sub-gate blocks SOTD-Ready tier.

### When to Use

- Stage 6 of validation pipeline, per section.
- After visual-refiner's motion-related edits (recheck safety).
- During /gen:audit for regression detection.

### When NOT to Use

- Sections with zero animation (Motion & Interaction hard-gate #1 catches that).
- Pre-build planning (nothing to measure yet).
- Third-party component motion (annotate as out-of-scope).

## Layer 2: Technical Spec

### Constraints (machine-readable, hard-enforced)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| INP_regression_vs_static | — | 50 | ms | HARD — fail section |
| concurrent_animations_HOOK | — | 3 | count/viewport | HARD |
| concurrent_animations_BREATHE | — | 1 | count/viewport | HARD |
| concurrent_animations_PEAK | — | 4 | count/viewport | HARD |
| concurrent_animations_other | — | 2 | count/viewport | HARD |
| GPU_compositor_layers | — | 12 | count | SOFT >8 warn, HARD >12 |
| reduced_motion_parity_coverage | 1.0 | 1.0 | ratio | HARD — every keyframed animation needs RM fallback |
| scroll_timeline_fallback_present | true | true | bool | HARD when `animation-timeline: scroll()` used |
| nested_transform_depth | — | 2 | depth | SOFT |
| overlapping_transform_targets | — | 0 | conflicts | HARD |
| motion_health_score | 0 | 20 | pts | Sub-gate |

### Measurement methodology

- **INP regression:** run twice — once with section rendered, once with `* { animation: none !important; transition: none !important; }` injected. Delta is the regression. Synthetic measurement via Playwright + PerformanceObserver on `event` entries. Average of 3 runs.
- **Concurrent animations:** scan for `motion.*`, `animate-*`, `gsap.*`, `@keyframes` references in first-viewport DOM. Count simultaneously active at any frame.
- **GPU layers:** enumerate elements with `transform`, `opacity !== 1`, `will-change`, `filter`, or `mix-blend-mode`. Chrome DevTools Protocol `LayerTree.layerPainted` for authoritative count; fall back to CSS heuristic.
- **Reduced-motion parity:** every `@keyframes` or `motion.*` must have a `@media (prefers-reduced-motion: reduce)` override or `useReducedMotion()` gate. Coverage = guarded / total. Hard gate at 1.0.
- **Scroll-timeline fallback:** if source uses `animation-timeline: scroll()` or `view()`, must have `@supports not (animation-timeline: scroll())` fallback or `IntersectionObserver`-based polyfill.
- **Motion conflicts:** same element targeted by multiple concurrent transform animations, or nested `transform` depth > 2 (parent animated transform + child animated transform + grandchild = depth 3 = flag).

### Scoring

```
motion_health_score = 20
  - 5 × (INP_regression > 50ms ? 1 : 0)
  - 3 × (concurrent_over_budget ? 1 : 0)
  - 2 × (GPU_layers > 12 ? 1 : 0)
  - 5 × (RM_parity < 1.0 ? (1 - RM_parity) × 5 : 0)
  - 3 × (scroll_timeline_no_fallback ? 1 : 0)
  - 2 × (motion_conflicts > 0 ? 1 : 0)
```

Sub-gate trigger: `motion_health_score < 12` → parent Motion & Interaction category × 0.5 multiplier.

### Output

`.planning/genorah/audit/motion-health-{section}.json`:
```json
{
  "section": "hero",
  "beat": "HOOK",
  "motion_health_score": 18,
  "sub_gate_pass": true,
  "measurements": {
    "inp_regression_ms": 32,
    "concurrent_animations": 3,
    "gpu_layers": 7,
    "rm_parity": 1.0,
    "scroll_timeline_fallback": "n/a",
    "motion_conflicts": 0
  },
  "violations": []
}
```

Polisher receives `motion-health-remediation.json` with specific fixes:
```json
[
  {"file": "Hero.tsx", "line": 67, "issue": "concurrent_animations_HOOK: 5/3",
   "fix": "consolidate parallax + glow into single transform"},
  {"file": "Hero.css", "line": 104, "issue": "scroll_timeline_no_fallback",
   "fix": "add @supports not (animation-timeline: scroll()) block with IntersectionObserver"}
]
```

## Layer 3: Integration Context

- **Quality-reviewer Stage 6** — runs Playwright to measure INP/GPU; runs Grep to count concurrent animations + RM parity.
- **Polisher** — consumes remediation.json; applies fixes.
- **Visual-refiner** — Motion category deficits may include Motion Health failures; refiner targets those fixes specifically.
- **Perf-budgets** — complementary (measures LCP/CLS); Motion Health measures motion-specific INP delta.
- **Cinematic-motion skill** — upstream (creative motion design); Motion Health is the downstream safety check.

## Layer 4: Anti-Patterns

- ❌ **Rebalancing 234-pt gate into 253-pt** — breaks archetype docs, export schema, vault queries. Sub-gate pattern preserves stability.
- ❌ **Treating synthetic INP as field INP** — synthetic is a regression delta, not absolute. Report as "Motion INP delta: +32ms vs static baseline", not "Field INP = 182ms".
- ❌ **Omitting RM parity on decorative-only animations** — WCAG 2.1 SC 2.3.3 requires RM for all motion >5s or >50% viewport. Even "decorative" fails without guard.
- ❌ **Using Framer Motion's auto-reduce** — doesn't cover GSAP or CSS keyframes. Enforce at source level.
- ❌ **Flagging scroll-timeline without fallback on non-Chromium** — other engines don't support; fallback is mandatory, not optional.
- ❌ **Letting will-change persist after animation** — creates permanent GPU layer. Remove `will-change` on animation end.
- ❌ **Measuring once** — INP is noisy; 3-run average minimum.


---

## v3.4 Addendum: 3dsvg Live Instance Accounting

Every live `<GenorahSVG3D>` in a section counts toward the per-beat concurrent-animation budget:

| Preset animation field | Motion-health budget consumed |
|---|---|
| `none` | 0 |
| `float`, `pulse`, `swing`, `wobble`, `spin` | 1 |
| `spinFloat` (composite) | 1 (single loop, counts once) |

Quality-reviewer Stage 6 greps section TSX for `<GenorahSVG3D>` + `<SVG3D>`, looks up `motion_health_budget_units` per preset in `skills/design-archetypes/seeds/3dsvg-presets.json`, adds to concurrent count. Exceeds per-beat limit = gate fail.

### WebGL context hard cap

**Max 3 live `<SVG3D>` per page** regardless of beat — WebGL context limit at browser level. For brand pages needing more, switch N-3 to offline PNG.
