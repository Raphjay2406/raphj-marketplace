# Genorah v4.0.0 — Retrospective

**Written:** 2026-04-13 (day of GA ship)

---

## What Went Well

- **Subagent batching** — Parallel execution of independent tasks (docs, package tests, version bumps) kept the M6 day-of-ship push to a single session. No blocking dependencies between T7–T14.
- **Clean commit history** — Each task produced exactly one commit with a scoped conventional-commit message. `git log --oneline` reads as a clean narrative.
- **Semver discipline** — All 9 packages + plugin.json + marketplace.json + root package.json stayed in lockstep via the `audit-versions.mjs` script. Zero manual version drift.
- **Test suite health** — 225 tests across 10 suites. Only 5 skipped (Deno-gated, not broken). Only 1 fix needed in M6 (protocol integration-cards count 105→108 after M5 added 3 agents).
- **Self-audit as CI proxy** — The 24-check self-audit script caught the version string mismatch immediately, confirming it functions as intended as a fast local CI gate.

---

## What Surprised Us

- **Theatre.js 0.7.x** — The latest stable is 0.7.x, not 0.8.x. The 0.8 branch exists but is not yet production-stable. All Theatre.js integrations target the 0.7 API surface which is stable.
- **gsap 3.13** — GSAP did not ship a major v4 release. Latest is 3.13. All motion choreography targets 3.13.
- **npm workspace hoisting** — Helped (shared vitest, TypeScript, zod versions across packages) but also hurt (glob v7 CJS in root vs. glob v10 ESM expected by some scripts — worked around with manual file enumeration in audit-versions.mjs).
- **Memory-graph test count** — `@genorah/memory-graph` reports only 2 tests via vitest (the suite is mostly covered by the root node:test suite). Expected more; actual coverage is fine but the per-package count looks thin.

---

## What We Cut

| Feature | Reason | Target |
|---------|--------|--------|
| Cloud relay (ROD backend) | Infrastructure cost; API key optional + ROD_API_KEY env var present | v4.1 |
| C2PA content credentials | Spec still in flux; tooling (c2patool) requires native binary | v4.1 |
| CDN-shared asset cache pool | Requires cloud infra agreement; local SQLite cache ships instead | v4.1 |
| Visual regression baseline capture | Playwright baseline capture needs stable viewport harness first | Post-release |
| Cinematic demo project | Not required for GA; would add scope without unblocking anything | Post-release |

---

## v4.1 Priorities

1. **Visual regression** — Automated baseline capture + `--capture-baseline` flag in `/gen:regression`
2. **Cloud relay** — ROD API backend for multi-agent cloud pipelines
3. **C2PA content credentials** — Provenance signing for AI-generated assets
4. **Expanded marketplace** — Community plugin submission workflow + review queue
5. **Theatre.js 0.8 upgrade** — When stable; seamless migration path from 0.7 API
