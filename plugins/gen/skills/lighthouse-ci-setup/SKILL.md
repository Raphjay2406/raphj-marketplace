---
name: lighthouse-ci-setup
tier: utility
description: "Lighthouse CI + Playwright preview-smoke scaffold for Genorah projects. Per-beat assertion matrix from perf-budgets skill, GitHub Actions workflow, Vercel preview hook integration. Blocks PRs that regress perf or a11y vs baseline."
triggers: ["lighthouse ci", "lhci", "performance ci", "preview smoke", "vercel preview hook", "perf gate", "ci setup"]
used_by: ["ci-setup", "export"]
version: "3.2.0"
metadata:
  bashPatterns:
    - "lhci"
    - "lighthouse-ci"
---

## Layer 1: Decision Guidance

### Why

Genorah's 234-pt quality gate runs locally. Production regressions slip through when someone edits a component and doesn't re-audit. Lighthouse CI + Playwright smoke on every PR catches that. This skill scaffolds the CI config from the project's `perf-budgets` assertions.

### When to Use

- Project finishing `/gen:build` + first passing `/gen:audit` — this is the right moment to lock the baseline.
- User runs `/gen:ci-setup` (new v3.2 command).
- CI setup required by client / compliance (regulated industries).

### When NOT to Use

- Pre-build scaffolds (no baseline yet).
- Static one-page sites (LHCI overhead not worth it).

## Layer 2: Config Generation

### `.lighthouserc.json` (generated from perf-budgets.json per beat)

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/pricing",
        "http://localhost:3000/about"
      ],
      "settings": { "preset": "desktop", "throttlingMethod": "simulate" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

Thresholds are derived per-URL from the per-beat budgets in `perf-budgets` skill (HOOK/PEAK loosened, BREATHE/PROOF tightened).

### `.github/workflows/lighthouse.yml`

```yaml
name: lighthouse-ci
on: [pull_request]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Playwright preview-smoke

Runs against Vercel preview URL after deploy. Validates:
- Page loads, no console errors
- Hero section present (data-section="hero" mounts)
- No regressions in visual-qa-protocol dimensions
- Accessibility axe-core scan clean

Generated at `e2e/preview-smoke.spec.ts` scaffold.

### Vercel preview hook

Generated `vercel.json` snippet:

```json
{
  "github": {
    "autoAlias": true,
    "silent": false
  }
}
```

Plus a GH Actions workflow that triggers on `deployment_status` event, polls the Vercel preview URL, and runs Playwright against it.

## Layer 3: Integration Context

- **`/gen:ci-setup`** — new v3.2 command that invokes this skill.
- **perf-budgets** — source of assertion values; this skill translates to LHCI assertions format.
- **live-testing** — existing skill; extends to CI mode.
- **git-workflow** — CI runs complement per-section commit body perf data.

## Layer 4: Anti-Patterns

- ❌ **Generic Lighthouse config for all projects** — perf budgets are archetype+beat-specific. Per-project generation is the whole point.
- ❌ **Running LHCI on dev server** — HMR, dev overlays, unminified bundles inflate LCP 2-3x. Production build only.
- ❌ **Single-run measurement** — noise dominates. `numberOfRuns: 3` minimum; median used.
- ❌ **Blocking PRs on flaky tests** — allow `continue-on-error: true` during first 2 weeks of CI adoption while tuning thresholds.
- ❌ **Missing Vercel preview hook** — without it, LHCI runs against localhost build only, misses CDN/edge effects.
