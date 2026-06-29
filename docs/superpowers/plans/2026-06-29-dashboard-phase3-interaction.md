# Dashboard Phase 3 — Interaction / Drill-down Implementation Plan

> **For agentic workers:** controller-authored; two review gates (task review where useful + final whole-branch review) per superpowers:subagent-driven-development. Checkbox (`- [ ]`) tracking.

**Goal:** Add section-detail drawer, screenshot lightbox, and section filtering to the dashboard, with pure logic in the unit-tested view-model and one lazy server endpoint.

**Architecture:** Extend the pure `view-model.mjs` (`filterSections`, `buildSectionDetail`); add `GET /api/section/:name` (path-locked, lazy detail); extend `dashboard.html` (filter bar, drawer, lightbox) on the Phase-2 thin-renderer.

**Tech Stack:** Zero-dep Node HTTP+SSE (existing), vanilla ES-module browser JS, hand-authored CSS. No libraries/build/web-fonts.

## Global Constraints

- Zero runtime dependencies; no build; no external/CDN/web-font.
- XSS-safe: data via `textContent`/element construction; URLs via `encodeURIComponent`; no new `innerHTML` on data.
- SSE `snapshot()` contract **frozen** — Phase 1 + Phase 2 tests pass untouched. Drill-down data comes from the lazy endpoint, not the stream.
- Side-effects stay behind the main-guard (no import-hang). Full suite completes with a clean exit.
- New endpoint path-locked against traversal (resolve + `startsWith` boundary; reject escapes/non-dirs).
- Drawer/lightbox: `role="dialog"`+`aria-modal`, `Esc` close, focus restore; all new motion `prefers-reduced-motion`-gated.
- Mirror to `plugins/gen/`; `check-mirror` green.

---

### Task 1: pure interaction helpers in `view-model.mjs`

**Files:** Modify `scripts/dashboard/view-model.mjs`; extend `tests/dashboard-view-model.test.mjs`.

**Produces (exact signatures):**
- `filterSections(sections, opts = {}) → sections[]` — `opts.q` (string): keep sections whose `name` contains `q` case-insensitively (trim; empty/absent = no name filter). `opts.verdict` (string): one of `all|pass|fail|none`; keep where `section.verdict.state === opts.verdict`; `all`/absent/unknown = no verdict filter. Pure; returns a new array; never mutates input. Non-array input → `[]`.
- `buildSectionDetail(raw = {}) → { name, summary, plan, beat, wave, verdict }` where `verdict` = `{ state, label, failures:[{check,detail}], ceiling }`. Input `raw` = `{ name, summary, plan, verdict }` (verdict is the raw spine shape `{ floor:{pass,failures:[{check,detail}]}, ceiling:{score} }` or null). Derive `beat` from `plan` via `/beat:\s*(\w+)/i`, `wave` via `/wave:\s*(\d+)/i` (→ number|null). Verdict mapping: null/parse-fail → `{state:'none',label:'not verified',failures:[],ceiling:null}`; `floor.pass===true` → `{state:'pass',label:'FLOOR PASS',failures:[],ceiling:floor? }`; else `{state:'fail',label:'FLOOR FAIL', failures: floor.failures (full {check,detail} kept), ceiling: ceiling.score ?? null}`. Missing `summary`/`plan` → `''`. Pure.

**Test matrix:** filterSections — name substring case-insensitive; each verdict facet (`pass`/`fail`/`none`); `all` and `{}` passthrough; combined `q`+`verdict`; non-array → `[]`; input not mutated. buildSectionDetail — full payload keeps failure `detail`; pass verdict → empty failures; null verdict → `state:'none'`; beat/wave parsed; missing files → `''`.

**TDD:** add tests → fail → implement → green → commit.

---

### Task 2: `GET /api/section/:name` endpoint

**Files:** Modify `.claude-plugin/companion/dashboard-server.mjs`; create `tests/dashboard-section-endpoint.test.mjs`.

**Implementation:**
- Export a pure-ish reader `readSectionDetail(name)` (so it is testable without HTTP): resolve `dir = path.join(root(), 'sections', name)`; if `!dir.startsWith(sectionsRoot + path.sep)` → return `{ error: 'forbidden' }`; if not an existing directory → return `{ error: 'not found' }`; else return `{ name, summary: safeRead(SUMMARY.md), plan: safeRead(PLAN.md), verdict: readVerdict(dir) }`.
- Route: `else if (p.startsWith('/api/section/'))` → `const name = decodeURIComponent(p.slice('/api/section/'.length))`; `const d = readSectionDetail(name)`; map `d.error==='forbidden'`→403, `'not found'`→404, else `200` JSON. Decode once (avoid the double-decode bug noted in prior phases).
- Place before the `/api/screenshot/` block is fine; ensure it doesn't shadow other routes.

**Test (`tests/dashboard-section-endpoint.test.mjs`, own process):** fixture with `sections/hero/{SUMMARY.md,PLAN.md,VERDICT.json}`; assert `readSectionDetail('hero')` returns summary/plan/verdict; `readSectionDetail('ghost')` → `{error:'not found'}`; `readSectionDetail('../../package')` → `{error:'forbidden'}`.

---

### Task 3: drawer + lightbox + filter UI in `dashboard.html`

**Files:** Modify `.claude-plugin/companion/dashboard.html`.

**Filter bar (above sections grid):** verdict segmented buttons (`All`/`Pass`/`Fail`/`Unverified` → `all|pass|fail|none`) + text input (`name…`). Page holds `filterState = { q:'', verdict:'all' }`; `render(vm)` stores `lastVm` and calls `renderSections(filterSections(vm.sections, filterState))`; filter controls update `filterState` and re-render from `lastVm` (no SSE wait); active verdict button gets an `aria-pressed`/active style. Empty filtered result → an "no sections match" empty state.

**Section cards become controls:** `role="button"`, `tabindex="0"`, focus ring; click and `Enter`/`Space` → `openSection(name)`.

**Detail drawer:** fixed right-side panel (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) + scrim. `openSection(name)`: show loading, `fetch('/api/section/'+encodeURIComponent(name))`; on ok → `buildSectionDetail(json)` → paint name/beat/wave, verdict badge + **per-failure `check` + `detail`** rows, ceiling, and SUMMARY + PLAN in `<pre>` (textContent). On failure → "could not load section" text. Move focus into the drawer; `Esc`/scrim/close-btn → close + restore focus to the invoking card. Slide-in transition `prefers-reduced-motion`-gated.

**Lightbox:** overlay (`role="dialog"`, `aria-modal`) over Visual QA. Thumbnails get `role="button"`/`tabindex=0`; activate → `openLightbox(i)`. Holds `shotIndex` + the current `vm.screenshots`; renders full image (`/api/screenshot/`+`encodeURIComponent`) + label; `Esc` close (restore focus), `←`/`→` step (clamp). Fade `prefers-reduced-motion`-gated.

**Preserve:** all Phase-2 behavior (theme, stat band, waves, hotspots, graph, context/decisions, quick actions, SSE+reconnect, count-up, bar-grow). New keydown handlers must not break when drawer/lightbox closed.

**Verify:** `node --check` server; controller boots fixture server + Playwright: click card → drawer shows SUMMARY + failure detail; click thumbnail → lightbox; type filter → grid narrows; **zero console errors**. Commit.

---

### Task 4: integration — command doc, mirror, full suite

**Files:** Modify `commands/dashboard.md` (document drawer/lightbox/filter; note this completes the 3-phase redesign). Mirror `plugins/gen/`.

**Steps:** update doc; `npm run sync-mirror`; `npm test` (full suite, **clean exit**); `npm run check-mirror`; `node scripts/lint-syntax.mjs`. Commit.

---

## Self-review

- **Spec coverage:** drawer (T2 endpoint + T3 UI + buildSectionDetail), lightbox (T3), filtering (filterSections T1 + T3 UI), a11y/XSS in T3 constraints, doc/mirror T4. ✓
- **No placeholders:** signatures, verdict-mapping, route status codes, test matrix all concrete. ✓
- **Type consistency:** `filterSections` consumes Phase-2 `vm.sections` (with `verdict.state`); `buildSectionDetail` consumes the endpoint `{name,summary,plan,verdict}` and the spine verdict shape from `readVerdict`; UI consumes `detail.verdict.failures[].{check,detail}`. ✓
