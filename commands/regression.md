---
description: "Regression Check — delta vs last snapshot across Lighthouse, visual-diff, broken-link, bundle-size, a11y. Catches 'wave N broke wave N-1' before ship."
argument-hint: "[--snapshot] [--baseline <commit-sha>]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate
recommended-model: sonnet-4-6
---

# /gen:regression

v3.5.3 pipeline-depth Stage 11. Compares current build to a stored baseline, reports deltas.

## Workflow

### 1. Locate baseline

`.planning/genorah/regression-baseline/` with subdirs per dimension:
- `lighthouse/` — one LHCI report per page
- `visual/` — Playwright screenshots at 4 breakpoints per section
- `bundle/` — webpack/vite bundle analysis JSON
- `a11y/` — axe-core violation counts per page
- `links/` — sitemap crawl result

`--baseline <commit-sha>` overrides default "last shipped state"; useful for comparing against a specific release.

### 2. Capture current state

In parallel:
- Run Lighthouse CI against dev server
- Playwright screenshots at 4 breakpoints
- Bundle analyzer on `dist/`
- Axe-core on each route
- Linkinator on sitemap

### 3. Diff each dimension

| Dimension | Delta signal | Severity |
|---|---|---|
| Lighthouse performance | score drop > 3 OR CWV regression | HIGH |
| Lighthouse a11y | any score drop | HIGH |
| Visual diff | pixel delta > 2% in any section | MEDIUM (unless explicitly approved) |
| Bundle size | main > +10% OR > absolute budget | HIGH |
| Axe violations | any new serious/critical | HIGH |
| Broken links | any new 4xx/5xx | CRITICAL |

### 4. Report

`.planning/genorah/regression-report.md`:

```
REGRESSION REPORT — vs baseline (commit: af98a63)
==================================================
Lighthouse perf:     -7 pts  (91 → 84)  HIGH
  /features: LCP +800ms due to new image asset without AVIF path
Lighthouse a11y:     0      (95 → 95)
Visual diff:         2 unexpected at hero (pixel delta 3.2%)  MEDIUM
Bundle size:         +18%   (142KB → 168KB)  HIGH
  main.js: +24KB from new GSAP ScrollTrigger import
Axe violations:      0
Broken links:        0

CRITICAL: 0
HIGH:     3
MEDIUM:   1

Recommendation: resolve HIGH items before ship.
```

### 5. Flags

- `--snapshot` — store CURRENT as new baseline (use after intentional change is approved).
- `--baseline <sha>` — compare against specific commit's snapshot.

### 6. Ledger

```json
{
  "kind": "regression-checked",
  "subject": "project",
  "payload": {
    "high": 3, "medium": 1, "critical": 0,
    "baseline_sha": "af98a63",
    "recommendation": "address-before-ship"
  }
}
```

## Pipeline guidance

Runs between audit (Stage 9) and ship-check (Stage 12). Integrates into `/gen:ship-check` Tier 2 automatically.

After ship, `--snapshot` records new baseline for next comparison.

## Anti-patterns

- ❌ No baseline → every check is "new"; always snapshot after first ship.
- ❌ Accepting visual diffs without review — expected-diff file requires reviewer + rationale.
- ❌ Snapshotting over a failed state — lock in bad baseline.
- ❌ Bundle budget ignored — "it's only +12KB" compounds across 20 PRs.
