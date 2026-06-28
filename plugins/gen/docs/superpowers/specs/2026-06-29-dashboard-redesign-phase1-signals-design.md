# Dashboard Redesign — Phase 1 (Signal Foundation) Design Spec

**Date:** 2026-06-29
**Status:** Approved (brainstorming complete, pending implementation plan)
**Part of:** Dashboard full redesign (Phase 1 of 3 — signals → visuals → interaction)

## Problem

The Genorah live dashboard (`localhost:4455`) has drifted behind the plugin:

- **It under-delivers vs its own docs.** `commands/dashboard.md` advertises score sparklines, gate-failure hotspots, and a screenshot grid — none exist in `dashboard.html` (190 lines). It actually renders: header, DNA chips, Waves, Sections grid, Quick Actions, the Graph panel, Context, Decisions.
- **It predates v4.1–4.3.** It shows a section's raw `score` but nothing about the **Verification Spine `VERDICT.json`** (floor pass/fail + which checks failed) — now the central quality signal. The server has a `/api/screenshot/` route the HTML never uses.
- **The header is hardcoded** "Genorah Dashboard" and ignores the real project.

## Decisions (locked during brainstorming)

- **Full redesign, decomposed into 3 phases** (each its own spec → plan → build → merge): **(1) signal foundation** [this spec], (2) visual redesign, (3) interaction/drill-down.
- **Zero-dependency, craft elevated.** Keep vanilla HTML/CSS/JS + the zero-dep Node server (no build step, no framework, "just runs" via `node dashboard-server.mjs`). Beauty (Phase 2) comes from native CSS / View Transitions / scroll-driven animation / canvas-SVG.
- **Phase 1 signals (all four):** Verification VERDICT per section, gate-failure hotspots, screenshot grid, real project header.

## Grounding facts (verified)

- `readVerdict(sectionDir)` + `isVerdictFresh(sectionDir, verdict)` are exported from `scripts/verify/verdict.mjs` — **reuse**, don't re-parse. A `VERDICT.json` has `floor.pass`, `floor.failures[] = {check, detail}`, and `ceiling.score`.
- Screenshots are written **flat** to `.planning/genorah/audit/screenshot-{375,768,1280,1440}px.png` (per `skills/visual-qa-protocol`), overwritten each QA run — **not** per-section. So the screenshot panel shows the **latest 4-breakpoint capture**, honestly framed; true per-section screenshots would require a verify-section change (future, out of scope).
- The dashboard targets a **generated project's** `.planning/genorah/` (cwd), not the plugin repo.
- `dashboard-server.mjs` `snapshot()` already returns `project` (raw PROJECT.md), `dna_tokens`, `master_plan`, `sections[]` (name/score/tier/status/beat), `decisions_tail`, `action_queue`, `graph`. It serves `/api/screenshot/:path` from `audit/`.

## Architecture

Extend the existing zero-dep cockpit — do not replace it. The server's `snapshot()` gains parsed signals; `dashboard.html` renders them; everything stays SSE-driven, XSS-safe, buildless.

### New helper module — `scripts/dashboard/signals.mjs` (pure, unit-tested)

- `parseProjectMeta(projectMd, dnaMd) -> { name, archetype, goal }` — extract the project name + goal from `PROJECT.md` and the archetype from `DESIGN-DNA.md` via regex; any field that can't be found is `null`.
- `computeHotspots(sections) -> [{ check, count }]` — aggregate `section.verdict.failures[].check` across all sections, sorted by `count` desc; sections without a verdict or failures contribute nothing; empty input → `[]`.
- `listAuditShots(auditFiles) -> [{ label, width, file }]` — given an `audit/` directory file listing, return entries for the breakpoints present among `screenshot-375px.png` / `-768px` / `-1280px` / `-1440px`, labeled Mobile/Tablet/Desktop/Wide; missing files omitted.

### `dashboard-server.mjs` changes

- Import `readVerdict` from `../../scripts/verify/verdict.mjs` and the three helpers from `../../scripts/dashboard/signals.mjs`.
- `scanSections()`: add `verdict` to each section by calling `readVerdict(dir)` and normalizing to `{ floorPass: v.floor?.pass ?? null, failures: v.floor?.failures ?? [], ceiling: v.ceiling?.score ?? null }` (or `null` when no verdict file).
- `snapshot()` gains:
  - `project_meta: parseProjectMeta(safeRead(PROJECT.md), safeRead(DESIGN-DNA.md))`
  - `hotspots: computeHotspots(sections)`
  - `screenshots: listAuditShots(safeReaddir(audit dir))`

### `dashboard.html` changes (in the SSE `render(state)`)

- **Header** — render `state.project_meta.name` (fallback "Genorah Dashboard"), an archetype chip, and the goal as a subtitle.
- **Section cards** — add a verdict row: a **FLOOR badge** (green `PASS` / red `FAIL` / muted "not verified"), the **Ceiling** score, and, when `floorPass === false`, small **check chips** for each `failures[].check`.
- **Gate Hotspots panel** (new `<section>`) — a ranked horizontal-bar list (`check ████ count`) built from styled divs (no chart lib). Empty → "no failures — floor clean."
- **Visual QA panel** (new `<section>`) — a 4-up grid of `<img loading="lazy" src="/api/screenshot/<file>">` from `state.screenshots`, each labeled. Empty → "no captures yet — run /gen:audit."
- All data reaches the DOM via `textContent` / element construction (the file's existing XSS-safe idiom); no untrusted `innerHTML`.

### `commands/dashboard.md`

Update "What the dashboard shows" so the documented panels match reality (add verdict/hotspots/screenshots; the doc currently lists panels that don't exist).

## Components and boundaries

| Unit | Responsibility | Depends on | Consumed by |
|------|----------------|-----------|-------------|
| `scripts/dashboard/signals.mjs` | parse project meta, aggregate hotspots, list audit shots (pure) | — | dashboard-server |
| `dashboard-server.mjs` `scanSections`/`snapshot` | add verdict + meta + hotspots + screenshots to state | `readVerdict`, `signals.mjs` | SSE clients |
| `dashboard.html` `render()` | render the new signals (XSS-safe, SSE) | snapshot shape | the browser |

## Testing

- Unit tests (`tests/dashboard-signals.test.mjs`): `parseProjectMeta` (extracts name/archetype/goal from sample markdown; missing → null), `computeHotspots` (aggregates + sorts across a sections array; no-verdict/empty → `[]`), `listAuditShots` (picks present breakpoints from a file list; missing omitted).
- Presence tests (`tests/dashboard-signals-panel.test.mjs`): `dashboard.html` contains the FLOOR badge logic (reads `state`/`verdict`/`floorPass`), a hotspots panel reading `state.hotspots`, and a screenshot grid reading `state.screenshots` + `/api/screenshot/`.
- `node --check .claude-plugin/companion/dashboard-server.mjs` after wiring.
- The `verdict` read reuses the spine's already-tested `readVerdict` (not re-tested).
- Wired into `npm run validate`.

## Rollout

- No version bump in Phase 1 (the redesign ships across phases; bump when the full redesign completes, or per-phase at the team's discretion). Mirror sync runs (`sync-mirror` + `check-mirror`).
- Mirror: `scripts/dashboard/signals.mjs` + the edited `dashboard-server.mjs`/`dashboard.html`/`commands/dashboard.md` sync into `plugins/gen/`.

## Scope guard / non-goals

- Phase 1 is signals + honest rendering in the **current** single-column layout. **Not** in Phase 1: the visual/layout redesign (Phase 2), drill-down/interaction (Phase 3).
- **Not** building per-section screenshot namespacing or score history — the data model doesn't support them yet (noted as future enhancements; the screenshot panel shows the latest flat `audit/` capture).
- Does not change the verification spine, the graphify layer, or any pipeline behavior — read-only consumption of artifacts they already write.

## Open questions for the implementation plan

- Exact regex for the project name/goal in `PROJECT.md` and archetype in `DESIGN-DNA.md` (verify against the real artifact formats; degrade to null on no-match).
- Whether the hotspots bar widths are normalized to the max count or absolute (cosmetic; plan picks one).
