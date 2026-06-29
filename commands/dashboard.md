---
description: "Launch or stop the Genorah live project dashboard at localhost:4455 — real-time wave progress, quality scores, screenshot grid, decision log."
argument-hint: "start | stop | status | open"
allowed-tools: Read, Write, Bash
---

# /gen:dashboard

Zero-dependency Node dashboard serving `.planning/genorah/` state via SSE at `localhost:4455`. Replaces `grep STATE.md` with a live cockpit.

## Workflow

### Parse argument

- `start` (default) — spawn server detached, write `.planning/genorah/.dashboard-info` with `{port, pid, started_at}`, print URL.
- `stop` — read `.dashboard-info`, kill PID, delete file.
- `status` — read `.dashboard-info`, curl `/api/state`, report up/down.
- `open` — print URL for user to open (no auto-open; user decides).

### Server (one-liner spawn)

```bash
node "${CLAUDE_PLUGIN_ROOT}/companion/dashboard-server.mjs" &
```

See `.claude-plugin/companion/dashboard-server.mjs` for implementation.

### Port collision

If 4455 is busy, fall through 4456, 4457 ... up to 4465. Record chosen port in `.dashboard-info`.

## Look & feel (v4.4.0 redesign)

The dashboard **wears the project's own Design DNA**: on every update it applies the DNA color tokens (`bg`, `surface`, `text`, `primary`, `accent`, `glow`, …) as CSS variables, so each project's cockpit is skinned in its own palette, with a fallback dark theme when tokens are absent. Presentation logic lives in the pure, unit-tested `scripts/dashboard/view-model.mjs` (`buildViewModel`), which the browser imports from the server at `/scripts/dashboard/view-model.mjs` — the same code `node:test` covers, never a duplicate. The surface is a composed **bento** layout with a refined sans/mono type system, layered depth, and motion (staggered panel entrance, number count-ups on change, growing hotspot bars, a live status pulse) — **all gated by `prefers-reduced-motion`**. Zero dependencies, no build step, no web-font fetch (offline-first). Rendering is XSS-safe (`textContent` / element construction; `encodeURIComponent` on URLs).

## What the dashboard shows

1. **Project header** — real project name, archetype, and goal from `project_meta`; DNA palette swatches; live "last update" age.
2. **Stat band** — at-a-glance counts derived from `summarize`: total sections, verified, floor-pass, floor-fail, average score (count-up animated).
3. **Wave strip** — pill per wave with a status dot, color-encoded (pending/building/qa/done/failed); status is derived from each wave's real section verdicts/scores (sections carry an additive `wave` parsed from `PLAN.md`), falling back to scraping `MASTER-PLAN.md` when sections lack a wave.
4. **Sections grid** — card per section: beat, name, latest score in the gate's named tier (Reject→SOTM-Ready) with tier-keyed color.
5. **Section verdicts** — each card shows its Verification Spine FLOOR pass/fail, the failing checks as chips, and the advisory Ceiling score.
6. **Gate Hotspots** — which floor checks fail most across sections, as an animated horizontal bar chart.
7. **Visual QA** — the latest 4-breakpoint screenshot capture from `audit/`, served via `/api/screenshot/`.
8. **Context pane** — current CONTEXT.md rendered.
9. **Decision tail** — last entries from `DECISIONS.md`.
10. **Quick actions** — queue `audit` / `status` / `self-audit`. Buttons write to `.planning/genorah/.action-queue/` which the user-prompt hook detects to suggest the matching `/gen:*` command on next prompt.
11. **Knowledge graph panel** — embeds graphify's interactive `graph.html` (lazy-loaded only when a graph exists) with a node/edge/freshness summary; prompts `gen:graphify scan` when no graph exists.

> **Phase status:** v4.4.0 is Phase 2 (visual redesign) of the dashboard initiative. Phase 3 (section drill-down, screenshot lightbox, filtering) follows as its own release.

## Auto-refresh

Server uses `fs.watch` with 250ms debounce + 5s polling fallback (Windows compatibility). Clients subscribed to `/api/sse` receive pushed state on every file change under `.planning/genorah/`.

## Notes

- Dashboard is read-mostly: direct editing is not supported, use /gen:iterate.
- "Quick action" buttons queue commands the user then invokes — Claude Code can't run slash commands on its own.
- Server is project-scoped: runs against cwd's `.planning/genorah/`, so one dashboard per project.
