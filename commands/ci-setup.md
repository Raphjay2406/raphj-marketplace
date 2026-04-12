---
description: "Scaffold CI/CD infrastructure — Lighthouse CI + GitHub Actions + Playwright preview-smoke + Vercel preview hook. Per-beat thresholds sourced from perf-budgets skill."
argument-hint: "[github | gitlab | none]"
allowed-tools: Read, Write, Edit, Bash, Glob
recommended-model: sonnet-4-6
---

# /gen:ci-setup

Scaffold CI infrastructure that enforces Genorah's perf + a11y + SEO budgets on every PR. See `skills/lighthouse-ci-setup/SKILL.md`.

## Workflow

1. **Prereq check:** `.planning/genorah/DESIGN-DNA.md` exists + at least one passing `/gen:audit` (have a baseline).
2. **Parse argument:** github (default) | gitlab | none (generate configs without CI YAML).
3. **Generate `.lighthouserc.json`** from perf-budgets per detected beats in MASTER-PLAN.md.
4. **Generate CI workflow** (`.github/workflows/lighthouse.yml` or GitLab equivalent).
5. **Generate preview-smoke** (`e2e/preview-smoke.spec.ts`).
6. **Patch `package.json`** scripts: `"lhci": "lhci autorun"`, `"smoke": "playwright test e2e/preview-smoke.spec.ts"`.
7. **Instruct user** on secrets: `LHCI_GITHUB_APP_TOKEN` from https://github.com/apps/lighthouse-ci.
8. **Render NEXT ACTION** block per pipeline-guidance (typical: commit + PR to trigger first CI run).
