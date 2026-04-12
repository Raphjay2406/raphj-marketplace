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

## What the dashboard shows

1. **Project header** — archetype, DNA palette swatches (12 chips), tech stack, framework badge.
2. **Wave strip** — pill per wave, color encodes status (pending/building/qa/done/failed).
3. **Sections grid** — card per section: beat icon, current status, latest score.
4. **Score trend** — SVG sparkline per category × 12 showing iteration deltas.
5. **Gate failure hotspots** — horizontal bar chart, top failing categories across project.
6. **Screenshot grid** — section × 4 breakpoints, IntersectionObserver lazy load.
7. **Decision tail** — last 10 entries from `DECISIONS.md`.
8. **Context pane** — current CONTEXT.md rendered.
9. **Quick actions** — re-run audit, regen section, open Obsidian. Action buttons write to `.planning/genorah/.action-queue/` which user-prompt hook detects to suggest the matching `/gen:*` command on next prompt.

## Auto-refresh

Server uses `fs.watch` with 250ms debounce + 5s polling fallback (Windows compatibility). Clients subscribed to `/api/sse` receive pushed state on every file change under `.planning/genorah/`.

## Notes

- Dashboard is read-mostly: direct editing is not supported, use /gen:iterate.
- "Quick action" buttons queue commands the user then invokes — Claude Code can't run slash commands on its own.
- Server is project-scoped: runs against cwd's `.planning/genorah/`, so one dashboard per project.
