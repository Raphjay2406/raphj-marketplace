---
description: "Unified ship-readiness gate. Single go/no-go scorecard spanning build, typecheck, lint, test, lighthouse, axe, visual-regression, SEO, security, license. Replaces the scattered 6-command ship checklist."
argument-hint: "[--fix] [--skip-slow]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate
recommended-model: sonnet-4-6
---

# /gen:ship-check

v3.5.3 pipeline-depth Stage 12. Unified pre-deploy gate. One command, one scorecard, one decision.

## Workflow

Runs the following checks **in parallel where independent**. Aggregates to single go/no-go:

### Tier 1 — Build (blocking)

| Check | Tool | Pass criteria |
|---|---|---|
| Compile | `npm run build` (or framework equivalent) | exit 0 |
| Typecheck | `tsc --noEmit` | exit 0 |
| Lint | `eslint` or `biome check` | exit 0 (warnings OK, errors block) |
| Unit/Integration tests | `npm test` | 100% pass |

### Tier 2 — Runtime (blocking when dev server reachable)

| Check | Tool | Pass criteria |
|---|---|---|
| Lighthouse CI | `lhci autorun` | Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 90, SEO ≥ 95 |
| axe-core | Playwright + axe | 0 serious / critical violations |
| Visual regression | Playwright snapshot diff | 0 unexpected diffs vs baseline |
| Broken-link scan | `linkinator` or custom | 0 broken internal links; external 200s |

### Tier 3 — Pipeline artifacts (warn only)

| Check | Source | Pass criteria |
|---|---|---|
| DNA drift | `scripts/dna-drift-check.mjs` | coverage ≥ 92% |
| Manifest integrity | asset-forge-dna-compliance | 0 `manifest_drift` |
| Quality-gate-v3 | .planning/genorah/audit/ | all sections cleared target tier on BOTH axes |
| Motion-health | audit/motion-health.json | per-section INP/CLS within budget |

### Tier 4 — Metadata (blocking)

| Check | Detail | Pass criteria |
|---|---|---|
| License manifest | every asset has license | 0 `license: unknown` |
| PII scan | dna-compliance-check.sh | 0 BLOCK findings |
| Bundle-size budget | stat-analysis or webpack-bundle-analyzer | main ≤ archetype budget |
| SEO meta | head scan | title, description, og:image, canonical present per route |

## Output

Single scorecard written to stdout + `.planning/genorah/ship-check.md`:

```
SHIP-READINESS SCORECARD
========================
Tier 1 (Build):       ✅ 4/4
Tier 2 (Runtime):     ⚠️  3/4 — visual-regression has 2 expected-diffs awaiting approval
Tier 3 (Pipeline):    ✅ 4/4
Tier 4 (Metadata):    ❌ 3/4 — 2 assets missing license (public/hero-bg.webp, public/og.png)

DECISION: BLOCK
Blockers:
  - [metadata] Add license for hero-bg.webp (see MANIFEST.json)
  - [metadata] Add license for og.png (see MANIFEST.json)

Warnings (non-blocking):
  - [runtime] Visual-regression diffs pending review in .planning/genorah/audit/visual-regression/pending.md
```

## Flags

- `--fix` — attempt auto-fixes for lint, format, sort imports, missing meta tags. Does not touch content or design.
- `--skip-slow` — skip Lighthouse + visual-regression for quick pre-push checks. Not for final ship.

## Ledger

```json
{
  "kind": "ship-check-ran",
  "subject": "project",
  "payload": { "tiers": {"1":4,"2":3,"3":4,"4":3}, "decision": "BLOCK", "blockers": 2 }
}
```

## Parallel execution

Tier 1 checks are independent → run in parallel.
Tier 2 checks need dev server running → ensure started, then parallel.
Tier 3 reads existing audit artifacts → fast.
Tier 4 file inspection → fast, parallel.

Total wall time target: ≤ 5 minutes on standard hardware.

## Pipeline guidance

After PASS, primary next is `/gen:export` (deliverables) or direct deploy. After BLOCK, address blockers then re-run `/gen:ship-check`. Render `skills/pipeline-guidance/SKILL.md` NEXT block.

## Anti-patterns

- ❌ Shipping on "all warnings" without re-running after fixes.
- ❌ `--skip-slow` on production deploys.
- ❌ Marking visual-regression diffs as expected without review — expected-diff file must have reviewer + timestamp.
- ❌ Treating Tier 3 warns as blocking silently — they're explicitly non-blocking for velocity.
