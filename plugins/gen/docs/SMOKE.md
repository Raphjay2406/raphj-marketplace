# Genorah Pre-Release Smoke Playbook

Manual verification for each release. Run from a fresh Claude Code session with the plugin linked.

## Prerequisites

- Node 20+
- Fresh scratch dir (e.g., `/tmp/gen-smoke-$(date +%s)`)
- Optional: Playwright MCP enabled for full coverage

## Core flow (S1-S10, pre-v3.1)

1. **S1** `/gen:start-project` — decline all v3.1 opt-ins → identical v3.0.1 behavior.
2. **S2** `/gen:plan` → `MASTER-PLAN.md` + per-section `PLAN.md` exist.
3. **S3** `/gen:build` → each section has `SUMMARY.md` with `Score:`.
4. **S4** `/gen:companion start` → `curl localhost:4455/api/state` returns 200 JSON.
5. **S5** Dashboard action queue: `curl -X POST localhost:4455/api/action/audit` → queue file appears, next `/gen:*` prompt surfaces the queued command.
6. **S6** `/gen:tournament hero --variants=3` → 3 variants built, winner committed, loser archive preserved.
7. **S7** `/gen:self-audit` → `BLOCK=0`.
8. **S8** `/gen:next` → renders ⚡ NEXT ACTION block with primary + alternatives.
9. **S9** Lost-user prompt: "I'm stuck, what should I run?" → hook injects routing hint.
10. **S10** `/gen:audit` → score ≥ target tier passes, below tier caps at Strong.

## v3.1 additions (S11-S16)

11. **S11** Fresh `/gen:start-project` → decline preloader/brandkit/uipro/deep-inspiration → `PROJECT.md` has named-key YAML (grep `^preloader:\|^brandkit:\|^inspiration_depth:`), no ordinal `q1:`/`q2:`.
12. **S12** `/gen:brandkit export` → `ls .planning/genorah/brandkit/` shows 7 categories: logo-variants/, favicons/, colors.{json,css,scss}, og/, typography-*.html, brand-guidelines.pdf, public brand.zip.
13. **S13** Enable preloader=Brutalist, run `/gen:discuss` + `/gen:build` → grep generated `app/layout.tsx` for `<Preloader>` + `animation-duration: 1.5s` or less.
14. **S14** Unset Playwright MCP (or simulate via env), run `/gen:start-project` with `inspiration_depth: deep` → BRAINSTORM.md contains `research_mode: offline (uipro-rules)`, no unhandled error.
15. **S15** Claymorphism archetype lock + `/gen:build` → `grep -r "rounded-none\|border-radius:\s*0" sections/` returns 0 matches.
16. **S16** `/gen:build` twice on same section → `grep -c "genorah:dna-anchor-refresh" METRICS.md` reports same count on 2nd run (animation-orchestration injection idempotent).

## v3.2 additions (S17+)

17. **S17** `npm run validate` at plugin root → all 5 steps pass (lint:syntax, lint:json, lint:frontmatter, self-audit, test).
18. **S18** GitHub Actions PR workflow triggers on feature-branch push → `.github/workflows/validate.yml` green on both ubuntu-latest and windows-latest matrix rows.
19. **S19** `/gen:ci-setup` on a target project → `.github/workflows/lighthouse.yml` created with Lighthouse CI assertions from perf-budgets skill.
20. **S20** `/gen:security-audit` → generates CSP header + OWASP scan summary + CVE dep report.
21. **S21** `/gen:docs` → generates per-section README + repo-level CHANGELOG.

## Convergence proof (one-time per release)

Deliberately break a section (strip motion, inject forbidden #hex), run `/gen:audit`, verify closed-loop visual-refiner raises score on 2nd pass. Record before/after in release notes.

## Deprecations to verify

- No `stop.mjs` references (renamed `session-end.mjs` since v2.9).
- No `--from-gaps` flag (auto-read since v2.8).
- `/modulo:*` commands surface migration hint via user-prompt hook.
- No `tmpdir()` import in `pre-tool-use.mjs` (moved to `.claude/genorah-dedup/` in v3.0.1).
