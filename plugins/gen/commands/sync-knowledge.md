---
description: "Refresh the graphify knowledge graph for this repo and the cross-project graph. Replaces the legacy vault sync."
argument-hint: "(no args)"
allowed-tools: Read, Bash
---

# /gen:sync-knowledge

Refreshes the repo's graphify graph and the cross-project graph. Graphify already updates incrementally on pipeline checkpoints; run this to force a full sync (e.g. after a large refactor or before reviewing the graph).

## Workflow

1. Update this repo's graph: `node ${CLAUDE_PLUGIN_ROOT}/scripts/graphify/run.mjs update`
2. Refresh the cross-project graph (links the plugin + known projects):
   `graphify merge-graphs graphify-out/graph.json "$HOME/.claude/genorah/graphify/"*/graph.json --out "$HOME/.claude/genorah/graphify/merged-graph.json"`
   (skip silently if graphify is unavailable — `gen:graphify status` reports the fallback.)
3. Report node/edge counts via `gen:graphify status`.

## Notes

- When graphify isn't installed, recall falls back to the BM25 semantic-index; nothing breaks.
- Per-project graphs live in each repo's `graphify-out/` (gitignored).
