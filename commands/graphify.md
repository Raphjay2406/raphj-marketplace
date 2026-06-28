---
description: "Build and query the repo's graphify knowledge graph (AST + semantic). Subcommands: scan | update | query | explain | path | status | install."
argument-hint: "scan | update | query \"<q>\" | explain \"<node>\" | path \"<A>\" \"<B>\" | status | install"
allowed-tools: Read, Bash
---

# /gen:graphify

Always-on repo understanding + memory recall backed by graphify. Replaces the legacy knowledge-vault surface; falls back to the BM25 semantic-index when graphify isn't installed.

## Usage

Run via the runner: `node ${CLAUDE_PLUGIN_ROOT}/scripts/graphify/run.mjs <subcommand> [args]`

- `scan` — build the graph for the current repo (`graphify update .` → `graphify-out/graph.json` + `graph.html` + `GRAPH_REPORT.md`).
- `update` — incremental refresh (AST-only, no LLM).
- `query "<question>"` — BFS recall over the graph.
- `explain "<node>"` — plain-language explanation of a node + neighbors.
- `path "<A>" "<B>"` — shortest path between two nodes.
- `status` — graphify availability, graph presence + freshness.
- `install` — bootstrap graphify (`uv tool install graphifyy`) then scan. Needs uv + Python 3.10+.

## Notes
- The graph lives in `graphify-out/` (gitignored, rebuildable).
- Agents also query the graph live via the `graphify` MCP (`query_graph`, `get_node`, `get_neighbors`, `shortest_path`).
- When graphify is unavailable, recall transparently falls back to BM25 — nothing breaks.
