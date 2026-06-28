# Graphify Memory Layer — Design Spec

**Date:** 2026-06-28
**Status:** Approved (brainstorming complete, pending implementation plan)
**Target release:** Genorah v4.3.0

## Problem

The user wants to (1) replace Genorah's Obsidian integration with **graphify**, (2) make memory/knowledge retention **always-on** rather than invoked, (3) get **better repo understanding for big repos**, and (4) keep new work and iterations continuously reflected in the graph, via a `gen:graphify` command that scans the repo.

Two findings reshape this:

- **Obsidian is barely the memory system.** Genorah's actual retention lives in a pure-Node stack: `sqlite-vec-memory-graph` (`memory.db`), `semantic-index` (BM25 over `entries.ndjson`), `agent-episodic-memory` (NDJSON), `decision-graph` (`decisions.json`), and `context-fabric-ledger` (`journal.ndjson`). Obsidian is mostly an **export/mirror surface** plus the cross-project *lessons* vault.
- **Graphify fills a real gap.** It builds tree-sitter **AST code-structure graphs** (call graphs, module relationships) plus optional LLM semantic edges — something none of the existing stack does. This is exactly "understand a big repo."

## Tool facts (verified on the target machine, graphify 0.8.50)

- Python CLI `graphifyy` (PyPI), installed via `uv tool install graphifyy`. Ships two executables: **`graphify`** (CLI) and **`graphify-mcp`** (stdio MCP server).
- **Build/update:** `graphify update <path>` — re-extracts code files and writes/updates the graph, **AST-only, no LLM, no API cost**. Builds on first run, updates incrementally after. (`watch <path>` is a built-in file-watcher alternative.)
- **Outputs:** `graphify-out/graph.json` + `graph.html` (self-contained interactive viz) + `GRAPH_REPORT.md`.
- **Recall verbs:** `query "<question>"` (BFS traversal), `explain "<node>"`, `path "A" "B"`.
- **Cross-repo:** `merge-graphs <g1> <g2> --out <path>`.
- **MCP:** `graphify-mcp [graph.json]` — stdio transport, tools `query_graph`, `get_node`, `get_neighbors`, `shortest_path`.
- Optional LLM passes (`cluster-only`/`label`) name communities; need an LLM key (the user has `OPENAI_API_KEY`). Code-structure graphs need no key.
- Target machine: Python 3.12.10, uv 0.11.7 — prerequisites satisfied; graphify installed during brainstorming.

## Decisions (locked during brainstorming)

- **Graphify role:** single memory **source of truth** — its graph replaces the sqlite-vec vector recall and the Obsidian KB as the retrieval/graph layer.
- **Dependency posture:** **graphify primary, Node fallback** — if Python/graphify is unavailable, retrieval transparently falls back to the existing BM25 `semantic-index`. Memory never goes dark.
- **Update cadence:** **at pipeline checkpoints** (wave/section complete, build done, decision logged, session-end) — background, incremental, non-blocking.
- **Repo scope:** **both, cwd-relative** — `gen:graphify` indexes whichever repo it runs in (the plugin itself, or a generated app); a cross-project merged graph links them.
- **Retrieval:** graphify wired as an **MCP** for live agent queries.
- **Graph preview UI:** **embedded in the existing `localhost:4455` dashboard** as a Graph panel.

## Architecture

One subsystem, the **Graphify Memory Layer**, in four parts. The memory **write path is unchanged** — the append-only ledgers (`journal.ndjson`, `decisions.json`, lessons markdown, `agent-memory/*.ndjson`) and source code are graphify's corpus. Only the recall/graph layer changes.

### 1. The recall seam — `scripts/memory/recall.mjs`

A single retrieval function:

```
recall(question, { kind = null, k = 10 } = {}) -> { hits: [{ id, summary, source, score }], provider }
```

Provider chosen via a cached capability check:
- **Primary (graphify):** if `graphify-out/graph.json` exists and `graphify` is on PATH, answer via `graphify query "<question>"` (parsed to hits). Agents additionally use the graphify MCP tools directly.
- **Fallback (Node):** otherwise route to the existing `semantic-index` BM25 over `entries.ndjson`.

`provider` is returned so the source of every answer is observable. Every former caller of sqlite-vec vector recall or Obsidian KB lookup now calls `recall()` — the single replacement point.

### 2. `gen:graphify` command + storage

`gen:graphify <subcommand>`, cwd-relative:
- **`scan`** — full build of the current repo (`graphify update .`).
- **`update`** — incremental refresh (the checkpoint workhorse).
- **`query "<q>"` / `explain "<node>"` / `path "A" "B"`** — recall verbs for the user.
- **`preview`** — open the graph in the dashboard (Section 4).
- **`status`** — graph freshness, node/edge counts, active provider.
- **`install`** — bootstrap (`uv tool install graphifyy` if missing) then initial scan; clear message if `uv`/Python absent.

**Storage:**
- Per-project graph in `graphify-out/` at the repo root — **gitignored** (derived, rebuildable). Applies to the plugin repo and generated projects alike.
- Cross-project graph at `~/.claude/genorah/graphify/merged-graph.json` via `graphify merge-graphs` (replaces the old cross-project `memory.db` role).

### 3. Always-on

**MCP (live retrieval).** `.claude-plugin/.mcp.json` drops `obsidian` + `obsidian-fs` and adds:
```json
"graphify": { "command": "graphify-mcp", "args": ["graphify-out/graph.json"] }
```
Tools `query_graph`/`get_node`/`get_neighbors`/`shortest_path` become available to agents. If the graph or graphify is absent the MCP just doesn't start; all MCPs are already optional and `recall()` covers the gap.

**Checkpoint updates (freshness).** `post-tool-use.mjs` already emits ledger events (`section-shipped`, `decision-made`, `asset-generated`, `commit-made`). A small **debounced background trigger** spawns a detached `graphify update .` on those events when graphify is available — non-blocking, AST-only, zero API cost. `session-end.mjs` runs a final `update` and refreshes the cross-project `merge-graphs`. Debounce coalesces bursts into one rebuild.

### 4. Graph preview — dashboard panel

`dashboard-server.mjs` gains a route serving `graphify-out/graph.html` (+ assets) from the project. `dashboard.html` gets a **Graph tab** that iframes it, plus a panel rendering the head of `GRAPH_REPORT.md` (node/edge counts, top communities) and a freshness line. Reuses the dashboard's existing SSE so the panel updates when a checkpoint rebuild lands. No graph yet → the panel shows a "Run `gen:graphify scan`" prompt. `gen:graphify preview` ensures the dashboard is running and opens the Graph tab.

## Obsidian retirement (removal surface)

- `.claude-plugin/.mcp.json` — remove `obsidian` + `obsidian-fs`.
- `commands/sync-knowledge.md` — repurpose into graphify sync (`update` + `merge-graphs`) or retire.
- `commands/export.md` — drop Obsidian-vault format conversion; keep artifact export.
- `.claude-plugin/hooks/session-start.mjs` — remove vault-drift detection; `session-end.mjs` — replace the Obsidian KB nudge with a graphify update; `user-prompt.mjs` — route "sync vault" prompts to `gen:graphify`.
- `skills/obsidian-integration/SKILL.md` — retire. `skills/cross-project-kb/SKILL.md` — repoint lesson storage/retrieval to the graph + ledgers (lessons stay as markdown, now graphify-indexed).
- `.claude/genorah.local.md` — replace `vault_path`/`obsidian_installed`/`vault_sync` with graphify config (graph path, auto-update on/off).
- `commands/dashboard.md`, `commands/next.md`, `CLAUDE.md` — drop Obsidian references.

## Degradation (graphify/Python absent)

A cached `graphify --version` check (once per session) drives everything: `recall()` → BM25; checkpoint hooks → skip the spawn silently (logged, never blocking); MCP doesn't start; dashboard panel shows the scan prompt. `gen:graphify install` is the only place that bootstraps and reports missing `uv`/Python clearly. No path lets a missing graphify break a build.

## Components and boundaries

| Unit | Responsibility | Depends on | Consumed by |
|------|----------------|-----------|-------------|
| `scripts/memory/recall.mjs` | route retrieval to graphify or BM25 (cached capability check) | `graphify` CLI, `semantic-index` | agents/commands needing recall |
| `scripts/memory/graphify-capability.mjs` | detect graphify availability + graph freshness (cached) | `graphify --version` | recall, hooks, gen:graphify, dashboard |
| `commands/graphify.md` (`gen:graphify`) | scan/update/query/explain/path/preview/status/install | graphify CLI, capability | user |
| checkpoint trigger (in `post-tool-use.mjs` / `session-end.mjs`) | debounced background `graphify update .` | capability, journal events | — |
| `.claude-plugin/.mcp.json` graphify entry | live MCP recall | `graphify-mcp` | agents |
| dashboard graph route + panel | embed graph.html + GRAPH_REPORT summary | `dashboard-server.mjs` | user |

## Testing

- `recall()` provider selection — graphify-available routes to the graphify path; absent routes to BM25 — capability check + shell-out injected (pure, deterministic).
- `graphify-capability` freshness/availability math.
- `gen:graphify status` output; dashboard `/graph` route serves the file when present, the prompt when absent.
- **Integration smoke:** run real `graphify update` on a tiny fixture dir → assert `graphify-out/graph.json` exists and `recall()` returns a hit from it. **Gated to skip cleanly when graphify is not installed** so CI without Python still passes.
- All wired into `npm run validate`.

## Rollout

- Version **v4.3.0**; `docs/v4.3-changelog.md`.
- Mirror `scripts/memory/` + command/skill/hook/`.mcp.json` edits into `plugins/gen/`; `check-mirror` green.
- Config migration note for `.claude/genorah.local.md`.
- `graphify-out/` added to `.gitignore`.

## Scope guard / non-goals

- Does **not** delete the sqlite-vec `memory.db` write path — it is left dormant behind the fallback so in-flight projects keep recall; a later cleanup removes it once graphify is proven.
- Does **not** rewrite the memory write path — ledgers stay as-is (they are graphify's corpus).
- Does **not** build a new graph visualization — graphify's `graph.html` is reused.

## Open questions for the implementation plan

- Exact parse of `graphify query` CLI output into `{id, summary, source, score}` hits (and whether the graphify MCP `query_graph` is preferred over the CLI when both are available).
- Debounce window + the precise journal events that constitute a "checkpoint."
- Whether `graphify-mcp` needs the absolute graph path or resolves `graphify-out/graph.json` relative to the launch cwd in the Claude Code plugin MCP context.
- Whether semantic (LLM) community labeling runs automatically on `scan` or stays opt-in to avoid API cost.
