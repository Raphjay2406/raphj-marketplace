# Dashboard Phase 3 — Interaction / Drill-down Design

> **Approval:** Pre-granted. Autonomous run ("proceed to phase 2 and automatically proceed to phase 3 … lets meet at the end of 3"). This is the final phase of the 3-part dashboard redesign initiated in the prior session.

**Goal:** Make the redesigned dashboard *interactive* — let the user drill into a section's full detail, inspect screenshots full-size, and filter the sections grid — on the same zero-dependency stack, preserving every Phase 2 behavior.

## Why

Phase 1 made the dashboard correct; Phase 2 made it beautiful. Both are still **read-only at a glance** — you can see that `cta` failed its floor on `console`/`overflow`/`perf`, but you can't see *why* (the failure `detail`), read the section's SUMMARY, or open a screenshot larger than a thumbnail. Phase 3 closes that loop: the cockpit becomes a place you can actually *investigate* from, not just monitor.

## Scope (the three interactions)

1. **Section detail drawer.** Click a section card → a slide-in drawer shows that section's full detail: SUMMARY.md, PLAN.md (beat/wave), and the **full** Verification Spine verdict — every failing check **with its `detail` text** (the snapshot/card only carries check names), plus ceiling. Data is fetched **on demand** from a new `GET /api/section/:name` endpoint, keeping the SSE snapshot lean.
2. **Screenshot lightbox.** Click a thumbnail in the Visual QA grid → a full-size overlay with the image, its breakpoint label, and keyboard navigation (`Esc` closes, `←`/`→` move between the captured breakpoints).
3. **Section filtering.** A compact control above the sections grid filters by **floor verdict** (all / pass / fail / unverified) and by a free-text **name** match. Filtering is instant, client-side, and re-applied on every live SSE update.

## Non-Goals (YAGNI)

- No editing/mutation of project state from the dashboard (it stays read-mostly; `/gen:iterate` owns changes).
- No new snapshot fields — the SSE `snapshot()` contract is **frozen** (Phase 1 + Phase 2 tests pass untouched). Drill-down data comes from the lazy endpoint, not the stream.
- No virtualization/pagination, no per-section screenshot capture, no dependencies/build step/web fonts.

## Architecture

Same seam discipline as Phase 2 — pure logic in the tested module, thin DOM/JS, minimal server surface:

1. **`scripts/dashboard/view-model.mjs` (EXTEND, pure, unit-tested).** Two new exports:
   - `filterSections(sections, { q, verdict }) → sections[]` — filters the Phase-2 view-model sections by a case-insensitive name substring (`q`) and a verdict facet (`verdict` ∈ `all|pass|fail|none`, matched against `section.verdict.state`). Empty/omitted facets do not filter. Pure.
   - `buildSectionDetail(raw) → { name, summary, plan, beat, wave, verdict: { state, label, failures:[{check,detail}], ceiling } }` — formats the raw `/api/section/:name` payload (`{ name, summary, plan, verdict }`) for display, reusing `scoreTier`/verdict-state logic; tolerates missing files (empty strings) and a missing/parse-failed verdict (`state:'none'`). **Keeps the full `{check, detail}`** (unlike the card's check-name-only mapping). Pure.

2. **`.claude-plugin/companion/dashboard-server.mjs` (one new endpoint).** `GET /api/section/:name` → JSON `{ name, summary, plan, verdict }` read from `.planning/genorah/sections/<name>/` (`SUMMARY.md`, `PLAN.md`, `VERDICT.json` via the spine's `readVerdict`). **Path-locked**: `name` is resolved under the sections dir and rejected (`403`) if it escapes or isn't a directory (same traversal-guard discipline as `/api/screenshot/` and the Phase-2 module route). Missing section → `404`. No change to `snapshot()`, watchers, or the main-guard.

3. **`.claude-plugin/companion/dashboard.html` (EXTEND).** Adds, on the existing thin-renderer architecture:
   - **Filter bar** above the sections grid (verdict segmented buttons + a text input). The page holds `filterState`; `renderSections` paints `filterSections(lastVm.sections, filterState)`; the last view-model is retained so filter changes re-render without waiting for an SSE frame, and SSE frames re-apply the active filter.
   - **Detail drawer** — a right-side slide-in panel + scrim. Card click (and `Enter`/`Space` for keyboard) calls `openSection(name)` → `fetch('/api/section/'+encodeURIComponent(name))` → `buildSectionDetail` → paint. `Esc`/scrim-click/close-button dismiss. Focus moves into the drawer on open and returns to the invoking card on close.
   - **Lightbox** — a full-screen overlay over the Visual QA grid. Thumbnail click calls `openLightbox(index)`; `Esc` closes, `←`/`→` step through `vm.screenshots`. Image via the existing `/api/screenshot/` route + `encodeURIComponent`.

## Accessibility

- Cards and thumbnails become real controls: `role="button"`, `tabindex="0"`, keyboard-activatable, visible focus rings.
- Drawer/lightbox: `role="dialog"` + `aria-modal`, `Esc` to close, focus trapped while open and restored to the trigger on close.
- All new motion (drawer slide, lightbox fade) is `prefers-reduced-motion`-gated.

## Safety

- **XSS:** SUMMARY/PLAN/detail text and all data painted via `textContent`/element construction; the only URLs (`/api/section/`, `/api/screenshot/`) use `encodeURIComponent`; no new `innerHTML` on data.
- Endpoint path-locked against traversal; fetch failures degrade to an in-drawer "could not load section" message (no blank/broken state).

## Testing

- **Unit (node:test):** extend `tests/dashboard-view-model.test.mjs` for `filterSections` (name match case-insensitivity, each verdict facet, `all`/empty = passthrough, combined facets) and `buildSectionDetail` (full payload, missing files, missing/garbage verdict → `state:'none'`, failure `detail` preserved). New `tests/dashboard-section-endpoint.test.mjs` exercising the `/api/section/:name` reader: returns summary/plan/verdict for a real section, `404` for a missing one, and path-traversal (`../../`) rejected.
- **Interaction (out-of-suite, controller-run):** boot the server against the demo fixture; via Playwright click a card → screenshot the drawer (assert SUMMARY + failure details visible), click a thumbnail → screenshot the lightbox, type a filter → assert the grid narrows; confirm zero console errors.

## Definition of done

Full suite green, clean exit; mirror parity green; new pure helpers + endpoint covered; drawer/lightbox/filter verified via Playwright with no console errors; `commands/dashboard.md` updated; shipped as **v4.5.0**, completing the 3-phase dashboard redesign.
