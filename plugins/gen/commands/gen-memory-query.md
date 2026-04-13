---
description: Query the cross-project memory graph by natural language or archetype
argument-hint: "<natural-language-or-json-filter>"
---

# /gen:memory-query

1. Embed the query string via embedder (Flux Kontext text-to-embedding; falls back to hash-based stub for offline mode).
2. Load MemoryGraph from `~/.claude/genorah/memory.db`.
3. Run k=10 nearest query with filters parsed from arguments.
4. Print matching decisions with scores, archetype, and summary.

Run: `node ${plugin_root}/scripts/gen-memory-query.mjs "$ARGUMENTS"`.
