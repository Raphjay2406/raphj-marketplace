---
description: "Generate test suites for the current project. Subcommands: e2e | visual | a11y | api | all."
argument-hint: "[e2e|visual|a11y|api|all]"
allowed-tools: Read, Write, Edit, Bash
recommended-model: sonnet-4-6
---

# /gen:tests

v3.16. Generate tests for the project Genorah shipped (vs tests FOR Genorah plugin itself).

## Subcommands

- `e2e` — Playwright E2E from PLAN.md journeys (see `skills/e2e-test-gen/SKILL.md`)
- `visual` — visual regression baseline + diff suite (see `skills/visual-regression-gen/SKILL.md`)
- `a11y` — axe-core + Playwright per route (see `skills/a11y-test-gen/SKILL.md`)
- `api` — supertest + vitest + msw per route (see `skills/api-test-scaffolds/SKILL.md`)
- `all` — generate all four

## Integration

- Tests run in CI on preview deploys
- Failures block merge
- Quarantine for flaky tests; review-required
- Ledger emits per generation + per run

## Anti-patterns

- ❌ Generating tests but not running in CI — drift immediately
- ❌ Updating snapshots without reviewer approval
- ❌ Ignoring quarantined tests forever — fix or delete
