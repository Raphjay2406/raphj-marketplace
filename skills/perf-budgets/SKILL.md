---
name: perf-budgets
tier: core
description: "Per-beat performance budgets (LCP/INP/CLS/section-JS/hero-image) enforced via Lighthouse CI and section-scoped measurement. Hard gate in /gen:audit, warning in /gen:build."
triggers: ["perf budgets", "performance budgets", "lighthouse ci", "LCP", "INP", "CLS", "section budget", "bundle budget"]
used_by: ["builder", "quality-reviewer", "polisher"]
version: "3.0.0"
hard_gate: true
mcp_optional: ["playwright"]
---

## Layer 1: Decision Guidance

### Why Per-Beat Budgets

One-size-fits-all perf budgets fail both ways: HOOK sections with heavy 3D legitimately need more runway; BREATHE sections with minimal content should be near-instant. A single "LCP < 2.5s" page target hides section-level regressions.

Per-beat budgets align with emotional-arc intent: HOOK gets the JS budget for wow, BREATHE enforces restraint, PROOF gets bandwidth for logos/testimonials but tight JS. Regressions get attributed to the section that owns them.

### When to Use

- **`/gen:build`** — warning after each section; advisory signal for builder.
- **`/gen:audit`** — hard gate; over-budget blocks SOTD-Ready (caps at Strong 199).
- **Post-polisher** — re-measure to confirm fixes landed.
- **Regression detection** — compare against last wave's perf snapshot.

### When NOT to Use

- Local dev-server measurements (use production build only).
- First build of wave-0 scaffold (no real content yet).
- Sections with `<noscript>` fallbacks being measured with JS disabled (use emulate-js-disabled flag).

## Layer 2: Technical Spec

### Budgets per beat

| Beat | LCP (s) | INP (ms) | CLS | Section JS (KB gz) | Hero img (KB) | TBT (ms) |
|------|--------:|---------:|----:|-------------------:|--------------:|---------:|
| HOOK | 2.0 | 200 | 0.05 | 40 | 200 (AVIF) | 200 |
| TEASE | 1.8 | 200 | 0.05 | 25 | 120 | 150 |
| REVEAL | 2.2 | 250 | 0.08 | 50 | 180 | 250 |
| BUILD | 2.0 | 200 | 0.05 | 35 | 100 | 200 |
| PEAK | 2.5 | 300 | 0.10 | 80 | 300 | 350 |
| BREATHE | 1.5 | 150 | 0.03 | 15 | 60 | 100 |
| TENSION | 2.3 | 250 | 0.10 | 60 | 200 | 300 |
| PROOF | 1.8 | 200 | 0.05 | 30 | 100 | 180 |
| PIVOT | 2.0 | 200 | 0.05 | 35 | 120 | 200 |
| CLOSE | 2.0 | 200 | 0.05 | 30 | 120 | 200 |

PEAK is explicitly loosened — wow moments cost bytes. BREATHE is the strictest — static content should be near-instant.

### Tooling

- **Lighthouse CI** (`@lhci/cli autorun`) with generated `lighthouse-ci.config.cjs` per project; assertions matrix derived from the budgets × beats present in build.
- **Bundle attribution:**
  - Next.js: `@next/bundle-analyzer`
  - Astro: `rollup-plugin-visualizer`
  - Vite: `rollup-plugin-visualizer`
  - Section JS = sum of chunk bytes whose import graph roots include `sections/{name}/**/*.tsx`.
- **Section-scoped metrics:** Playwright `browser_evaluate` injects PerformanceObserver scoped to `[data-section="{name}"]` bounding box. LCP candidate restricted to that subtree (largest element intersected with section rect). INP measured by synthetic `browser_click` on first interactive descendant + `event.timing`.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| measurement_runs | 3 | 5 | count | HARD (median) |
| network_throttle | - | - | preset | "Slow 4G" for scoring, "No throttle" for dev |
| cpu_throttle | 1 | 4 | x | "4x" for scoring |
| image_format_preferred | AVIF | WebP | enum | SOFT — fallback chain |
| max_measurement_time_per_section | — | 60 | s | HARD |

### Output

```
.planning/genorah/audit/
├── perf-{section}.json     # per-section metrics
├── lighthouse-ci.html      # full report
└── perf-summary.md         # aggregated pass/fail table
```

Per-section JSON:
```json
{
  "section": "hero",
  "beat": "HOOK",
  "metrics": { "LCP": 1.82, "INP": 178, "CLS": 0.04, "TBT": 190,
               "section_js_kb_gz": 47.3, "hero_img_kb": 178 },
  "budgets": { "LCP": 2.0, "INP": 200, "CLS": 0.05, "TBT": 200,
               "section_js_kb_gz": 40, "hero_img_kb": 200 },
  "violations": [
    {"metric": "section_js_kb_gz", "actual": 47.3, "budget": 40,
     "owner": "framer-motion (32KB)", "fix": "defer to Wave 2 or use motion/react Lite"}
  ],
  "status": "FAIL_SOFT"
}
```

## Layer 3: Integration Context

### Pipeline

- **Builder** — emits advisory perf block in SUMMARY.md.
- **Quality-reviewer Stage 6** — reads `perf-{section}.json` per section, feeds Performance category (weight 1.0x in 234-pt gate).
- **Polisher** — receives list of fixable violations (bundle reduction, image reformat, motion budget cut).
- **Audit** — aggregates into `perf-summary.md`; any HARD violation caps tier at Strong (199).

### Relationship to other skills

- Upstream: `performance-animation` and `motion-health` (motion budget subset).
- Upstream: `image-asset-pipeline` (image-size budget).
- Downstream: `performance-patterns` (optimization playbook referenced by polisher).

## Layer 4: Anti-Patterns

- ❌ **Measuring in dev mode** — HMR, dev overlays, unminified bundles inflate LCP 2-3x. Production build only.
- ❌ **Single-run measurement** — noise dominates; median of 3-5 required.
- ❌ **Treating page-level Lighthouse as section truth** — a passing page can hide a hero section that's 3x its budget.
- ❌ **Letting PEAK sections "eat" other sections' budgets** — each section accountable independently.
- ❌ **Omitting bundle attribution** — "LCP regressed, unclear why" wastes polisher time. Bundle attribution tells polisher the owner.
- ❌ **Ignoring INP on marketing pages** — "no interaction" is a myth; scroll, hover, focus all count. Measure on representative interaction.
- ❌ **Fixing by lowering budgets instead of code** — budgets reflect tier targets, not "what we happen to ship".
