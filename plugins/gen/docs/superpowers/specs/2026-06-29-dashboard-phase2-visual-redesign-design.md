# Dashboard Phase 2 — Visual Redesign Design

> **Approval:** Pre-granted. The user authorized an autonomous run ("proceed to phase 2 and automatically proceed to phase 3 … lets meet at the end of 3"), overriding the per-step approval gate. Phase 1 direction was confirmed in the prior session: **Full redesign**, **stay zero-dependency, elevate craft**.

**Goal:** Rebuild the `localhost:4455` dashboard's *presentation* to Awwwards-level craft — typography, layout, depth, motion, and a per-project DNA-themed skin — on the existing zero-dependency Node stack, without changing the data the server produces.

## Why

Phase 1 made the dashboard *correct* (it now surfaces real verification signals). It is still *plain*: everything is monospace, cards are flat, the layout is a single vertical stack, and there is almost no motion. Genorah is a design-quality plugin whose whole thesis is "UI quality should not drift." Its own cockpit should embody that thesis — and right now it doesn't. Phase 2 makes the dashboard look like something Genorah would itself approve through its 394-pt gate.

## Non-Goals (YAGNI — explicitly deferred to Phase 3)

- Section drill-down / detail view, screenshot lightbox, filtering, search — **Phase 3**.
- No new server data model. `snapshot()` / `scanSections()` output is **additive-only**: every existing field is frozen and the Phase 1 test contract keeps passing untouched. The single permitted addition is an optional `section.wave` (parsed from `PLAN.md` `wave:` exactly like the existing `beat:`), needed so wave status is *derived from real data* instead of fabricated.
- No external dependencies, no build step, no CDN/web-font fetch (Genorah is offline-first). Pure HTML/CSS/JS served by the existing server.
- No charting/animation libraries. Motion is CSS + tiny vanilla JS.

## Architecture

Three pieces, with the testable logic pulled out of the DOM exactly as Phase 1 did with `signals.mjs`:

1. **`scripts/dashboard/view-model.mjs` (NEW, pure, unit-tested).** Transforms a raw `snapshot()` object into a flat *view model* of presentation-ready values. No DOM, no I/O — same shape of seam as `signals.mjs`, so it is fully `node:test`-able. It owns every derivation the current inline JS does ad hoc, plus the new ones:
   - `scoreTier(score)` → `{ label, klass }` using the gate's named tiers (Reject <140, Baseline 140–169, Strong 170–199, SOTD-Ready 200–219, Honoree 220–234, SOTM-Ready 235+) — replaces the current 3-bucket `'' | 'low' | 'fail'`.
   - `deriveWaves(masterPlan, sections)` → `[{ n, label, status }]` where status ∈ `pending|building|qa|done|failed`, derived from section statuses/verdicts mapped to their wave, not just regex-scraped numbers.
   - `hotspotBars(hotspots, maxPx)` → `[{ check, count, pct, px }]` (percentage + clamped pixel width, computed once).
   - `themeFromTokens(dnaTokens)` → `{ primary, accent, glow, ok, warn, fail, … }` — the DNA tokens that re-skin the dashboard, each with a safe fallback so a tokenless project still renders the default theme.
   - `relativeTime(iso, nowIso)` → `"3s ago"` / `"2m ago"` (now passed in, never read from the clock — keeps it pure and testable).
   - `summarize(sections)` → headline counts: `{ total, verified, floorPass, floorFail, avgScore }` for a new at-a-glance stat row.
   - `buildViewModel(snapshot)` → composes all of the above into one object the renderer paints.

2. **`.claude-plugin/companion/dashboard.html` (REWRITE).** New semantic markup + a real CSS design system + thin vanilla JS that calls `view-model.mjs` and paints the DOM. Stays a single served file (no new server routes in Phase 2). Served as a module page so it can `import` the view-model — see Server.

3. **`.claude-plugin/companion/dashboard-server.mjs` (MINIMAL CHANGE).** One new static route so the browser can load the pure ES module the page imports: `GET /scripts/dashboard/view-model.mjs` and `GET /scripts/dashboard/signals.mjs` stream those files with `Content-Type: text/javascript`. (Alternative considered: inline a copy of the logic into the HTML — rejected; it would duplicate the tested module and let the two drift, the exact anti-pattern Phase 1's ledger warns about.) The route is path-locked to `scripts/dashboard/*.mjs` under the repo root — same traversal-guard discipline as `/api/screenshot/`. No change to `snapshot()`, watchers, or the main-guard.

### The visual system (the actual craft)

- **Typography:** dual-track. A refined system **sans** stack for UI/headings (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", …`) and the existing **mono** stack reserved for data/scores/code (`ui-monospace, …`). A disciplined modular type scale (not the current single 14px). Tabular-nums on all numeric readouts so live updates don't reflow.
- **Layout:** a composed grid, not a vertical stack. Sticky header band with the live project identity + the new stat row; a responsive **bento** of panels (Waves, Sections, Hotspots, Visual QA, Graph, Context/Decisions) that reflows 1→2→3 columns across the existing breakpoints. Sections grid uses real cards with hierarchy.
- **Depth & polish:** layered surfaces (bg → surface → raised), hairline borders, a soft primary-tinted glow on the active/header elements, focus rings, rounded geometry consistent with a single radius scale. All depth derives from the DNA theme so it re-tints per project.
- **DNA theming (signature feature):** on each render, the project's real DNA tokens are applied as CSS custom properties on `:root`, so the dashboard literally *wears the design system it is helping build*. Missing tokens fall back to the default dark theme.
- **Motion (CSS + tiny JS, all gated by `prefers-reduced-motion`):**
  - Staggered entrance reveal of panels/cards on first paint.
  - Live **count-up** on the stat-row numbers and section scores when an SSE update changes them.
  - Hotspot bars **grow** to width on update (CSS transition on width).
  - A gentle "live" pulse on the status dot; subtle hover lift on cards.
  - `@media (prefers-reduced-motion: reduce)` removes all of the above (instant states), per Genorah's own accessibility baseline.

## Data flow (unchanged contract)

`server.snapshot()` → SSE `data:` frame → `buildViewModel(snapshot)` (browser-side import of the same tested module) → DOM paint. The server's JSON is byte-for-byte what Phase 1 produced; Phase 2 only adds a *consumer* and a static route to serve the module.

## Error / empty / safety

- Every empty state keeps its current copy ("no sections yet — run /gen:plan", etc.), restyled.
- **XSS:** all data fields painted via `textContent` / element construction; URLs via `encodeURIComponent`; `innerHTML` only on static constant strings. (Same rule Phase 1's review enforced.)
- SSE reconnect behavior (`onerror → reload after 3s`) is preserved.
- If the view-model import fails for any reason, the page shows a one-line "renderer failed to load" notice rather than a blank screen.

## Testing

- **Unit (node:test, fast, in the suite):** `tests/dashboard-view-model.test.mjs` covering every `view-model.mjs` function — tier boundaries, wave-status derivation, hotspot scaling/clamping, theme fallback when tokens are missing, relative-time formatting, and `buildViewModel` end-to-end against a representative snapshot. The frozen Phase 1 `dashboard-snapshot.test.mjs` must keep passing untouched.
- **Visual (out-of-suite, controller-run):** boot the server against a rich demo fixture, screenshot 375/768/1280/1440 via Playwright, confirm zero console errors and that the DNA theme is applied. This is the design-taste sign-off and is done by the controller, not asserted in CI (no browser-spawning test added to the suite).

## Definition of done

Full suite green with a clean exit (no reintroduced hang); mirror parity green; `view-model.mjs` covered; dashboard renders at all four breakpoints with the DNA theme applied and no console errors; `commands/dashboard.md` updated to describe the redesigned surface; shipped as **v4.4.0**.
