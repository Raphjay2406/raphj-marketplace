# Dashboard Phase 2 — Visual Redesign Implementation Plan

> **For agentic workers:** controller-authored (visual taste is not delegable); the two review gates (task review + final whole-branch review) are dispatched as subagents per superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) tracking.

**Goal:** Rebuild the dashboard's presentation to Awwwards-level craft (typography, layout, depth, motion, per-project DNA theming) on the zero-dependency Node stack, with the testable logic factored into a pure, unit-tested `view-model.mjs`.

**Architecture:** Pure transform module (`scripts/dashboard/view-model.mjs`) consumed by BOTH node:test and the browser page (served via a new path-locked static route). `dashboard.html` becomes a thin renderer over the view model. `snapshot()` is additive-only (`section.wave` added).

**Tech Stack:** Zero-dep Node HTTP+SSE server (existing), vanilla ES-module browser JS, hand-authored CSS. No libraries, no build, no web-font fetch (offline-first).

## Global Constraints

- Zero runtime dependencies; no build step; no external/CDN assets or fonts. System font stacks only.
- XSS-safe: all data painted via `textContent`/element construction; URLs via `encodeURIComponent`; `innerHTML` only on static constant strings.
- The Phase 1 `tests/dashboard-snapshot.test.mjs` must keep passing **untouched**. Snapshot changes are additive-only (`section.wave`).
- Side-effects (timers, watchers, `listen()`) stay behind the main-guard — do not reintroduce the import-hang. Full suite must complete with a clean exit.
- All motion gated by `@media (prefers-reduced-motion: reduce)`.
- Mirror to `plugins/gen/` before release; `npm run check-mirror` green.

---

### Task 1: `view-model.mjs` pure transform + unit tests

**Files:**
- Create: `scripts/dashboard/view-model.mjs`
- Test: `tests/dashboard-view-model.test.mjs`

**Interfaces — Produces (exact signatures; self-contained, no imports):**
- `scoreTier(score) → { label, klass }` — gate tiers: ≥235 `SOTM-Ready/sotm`, ≥220 `Honoree/honoree`, ≥200 `SOTD-Ready/sotd`, ≥170 `Strong/strong`, ≥140 `Baseline/baseline`, else `Reject/reject`; null/NaN → `{ label:'—', klass:'none' }`.
- `summarize(sections) → { total, verified, floorPass, floorFail, avgScore }` — `verified` = has `verdict`; `floorPass/floorFail` count `verdict.floorPass === true/false`; `avgScore` = rounded mean of numeric `score`s, or `null` if none.
- `hotspotBars(hotspots, maxPx=200) → [{ check, count, pct, px }]` — `pct` 0–100 vs max count; `px` = `max(2, round(count/max*maxPx))`; `[]` on empty.
- `themeFromTokens(dnaTokens) → { bg, surface, raised, text, muted, border, primary, accent, glow, ok, warn, fail }` — each value is the DNA token if a non-empty string else the default-dark fallback. Defaults: bg `#0a0a0b`, surface `#141418`, raised `#1c1c22`, text `#e8e8ea`, muted `#8a8a95`, border `#2a2a31`, primary/accent/glow `#7c5cff`, ok `#3fc28a`, warn `#f0a830`, fail `#ef4458`.
- `relativeTime(iso, nowIso) → string` — `Ns ago` < 60s, `Nm ago` < 60m, `Nh ago` < 24h, else `Nd ago`; unparseable → `'—'`. Pure (now is passed in, never read from the clock).
- `deriveWaves(sections, masterPlan='') → [{ n, label, count, status }]` — group sections by `section.wave`; status `failed` if any `verdict.floorPass===false`, else `done` if every section has `score>=200` or `verdict.floorPass===true`, else `building` if any status matches `/build|progress|wip/i`, else `qa` if any matches `/qa|review/i`, else `pending`. If no section carries a wave, fall back to scraping `/wave[:\s]+(\d+)/gi` from `masterPlan` → `status:'planned', count:0`. Sorted numerically.
- `buildViewModel(snapshot, nowIso='') → { ts, tsLabel, project:{name,sub}, theme, dnaChips:[{token,value}], stats, waves, sections:[{name,beat,score,scoreLabel,tierLabel,tierKlass,verdict:{state,label,failures:[check],ceiling}}], hotspots, screenshots, graph, context, decisions, queue }`. `project.name` falls back to `'Genorah Dashboard'`; `verdict.state` ∈ `none|pass|fail`.

**Test matrix (`node:test`):** tier boundaries (139/140/169/170/199/200/219/220/234/235/null); summarize on mixed verified/unverified/unscored; hotspotBars scaling + min-2px + empty; themeFromTokens uses tokens when present and falls back per-key when absent/empty; relativeTime across all four buckets + unparseable; deriveWaves real-section grouping + status precedence (failed > done > building > qa > pending) + masterPlan fallback; buildViewModel end-to-end against a representative snapshot (asserts project name fallback, chips, stats, a pass section + a fail section with failure checks, hotspots, screenshots passthrough).

**TDD:** write the test file first → run, watch it fail (module missing) → implement → run, all green → commit.

---

### Task 2: server module route + `dashboard.html` visual rebuild

**Files:**
- Modify: `.claude-plugin/companion/dashboard-server.mjs` (add `section.wave` to `scanSections`; add static route)
- Create: `tests/dashboard-wave.test.mjs` (asserts `scanSections` emits parsed `wave`)
- Rewrite: `.claude-plugin/companion/dashboard.html`

**Server changes (minimal, behavior-preserving):**
- In `scanSections`, parse `const wave = (plan.match(/wave:\s*(\d+)/i) || [])[1];` and include `wave: wave ? +wave : null` in the returned object. Additive only.
- Add route: `GET /scripts/dashboard/:file` → stream `path.join(repoRoot, 'scripts', 'dashboard', file)` with `Content-Type: text/javascript; charset=utf-8`, **path-locked** to `scripts/dashboard/` and `.mjs` only (resolve + `startsWith` guard like `/api/screenshot/`; reject otherwise with 403). `repoRoot` = two levels up from `__dirname` (`.claude-plugin/companion` → repo). This lets the browser `import` the tested module instead of duplicating it.
- `tests/dashboard-wave.test.mjs`: fixture section with `PLAN.md` containing `wave: 2`; assert `scanSections()[0].wave === 2`. Separate file → own process (no chdir clash with the frozen snapshot test).

**`dashboard.html` rewrite — requirements (controller authors; verified by Playwright + the view-model tests):**
- `<script type="module">` imports `buildViewModel` from `/scripts/dashboard/view-model.mjs`; on each SSE frame calls `buildViewModel(JSON.parse(e.data), new Date().toISOString())` and paints. On import failure, show a single "renderer failed to load" line (not a blank page).
- **Theme application:** `for (const [k,v] of Object.entries(vm.theme)) root.style.setProperty('--'+k, v)` so the page wears the project DNA; defaults when tokenless.
- **Typography:** sans stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) for UI/headings; mono stack for scores/data/code; modular scale; `font-variant-numeric: tabular-nums` on all numeric readouts.
- **Layout:** sticky header (live status dot + project name/sub + relative-time + DNA chips); a **stat row** (`summarize`: total / verified / floor-pass / floor-fail / avg score); a responsive **bento** of panels (Waves, Sections, Gate Hotspots, Visual QA, Quick Actions, Knowledge Graph, Context, Decisions) reflowing 1→2→3 cols at 768/1280; section **cards** show beat, name, score (mono, tier-colored), tier label, and the FLOOR verdict row (badge + failure chips + ceiling) from Phase 1, restyled.
- **Depth:** three surface levels + hairline borders + a soft `--glow`-tinted shadow on header/active cards + visible focus rings; one radius scale.
- **Motion (all `prefers-reduced-motion`-gated):** staggered panel/card entrance; count-up on stat numbers + section scores when a value changes between frames; hotspot bars transition width to `vm.hotspots[i].px`; status-dot pulse; hover lift on cards.
- **Preserve behavior:** SSE endpoint + reconnect (`onerror → reload after 3s`); DNA chips; quick-action POST + queued banner; screenshot grid (`/api/screenshot/` + `encodeURIComponent`); graph iframe (`/api/graph`) with summary; context/decisions panes. Empty-state copy preserved, restyled.

**Verify:** `node --check` the server; run the suite (Task-1 + wave tests green, Phase-1 untouched); controller boots the server against the demo fixture and screenshots 375/768/1280/1440, confirming DNA theme applied + zero console errors. Commit.

---

### Task 3: integration — command doc, mirror, full suite

**Files:**
- Modify: `commands/dashboard.md` (describe the redesigned surface: stat row, DNA-themed skin, motion; note Phase 3 drill-down still pending)
- Mirror: `plugins/gen/` (`npm run sync-mirror`)

**Steps:** update `commands/dashboard.md`; `npm run sync-mirror`; `npm test` (full suite, **clean exit**, 222+ tests); `npm run check-mirror` (green); `node scripts/lint-syntax.mjs` (green). Commit.

---

## Self-review

- **Spec coverage:** typography/layout/depth/motion/DNA-theming → Task 2 visual reqs; testable logic → Task 1; additive `wave` → Task 2 server; doc/mirror → Task 3. ✓
- **No placeholders:** signatures + behaviors + defaults are exact; test matrix enumerated. ✓
- **Type consistency:** `buildViewModel` consumes `scoreTier`/`summarize`/`hotspotBars`/`themeFromTokens`/`relativeTime`/`deriveWaves` with the signatures defined above; renderer consumes `vm.theme` (object), `vm.sections[].verdict.failures` (array of check strings), `vm.hotspots[].px`. ✓
