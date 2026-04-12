---
name: semantic-index
description: L5 of Context Fabric — sqlite-vec embedding index over L3 section memories + L4 journal + decision graph. Enables nearest-neighbor retrieval across the project history. Gracefully degrades to BM25 when sqlite-vec unavailable.
tier: core
triggers: semantic-index, context-fabric-l5, sqlite-vec, embeddings, nearest-neighbor, bm25
version: 0.1.0-provisional
---

# Semantic Index (L5)

Embedding + text index over the Context Fabric. Makes the ledger (L4), agent memory (L2), section memory (L3), and decision graph queryable by meaning, not just by key.

## Layer 1 — When to use

- agent-episodic-memory nearest-neighbor lookup
- judge-calibration golden-set retrieval
- /gen:research query cross-project patterns
- dashboard search ("show me every section where motion-health failed")

## Layer 2 — Storage

`.planning/genorah/index/` (gitignored):

- `vectors.db` — sqlite-vec virtual table, 384-dim embeddings
- `meta.db` — mapping from vector ids to source refs + timestamps + tags

Optional global mirror at `~/.claude/genorah/index/` for cross-project queries.

## Layer 3 — Embedding

### Preferred: local sentence-transformer

`Xenova/jina-embeddings-v2-small-en` (384-dim, ~120MB, runs in Node via `@xenova/transformers`). Cached per-user, one-time download.

### Fallback: BM25 over text

If Node can't load the embedder or disk-space constrained, fall back to BM25 via sqlite FTS5. Lower recall but same API shape.

## Layer 4 — Write path

Every L4 ledger write triggers background indexer:

```
1. Extract text summary from ledger entry (actor + kind + subject + payload.notes).
2. Compute embedding (or skip for BM25 mode).
3. Insert into vectors.db + meta.db with refs.
4. Batch commits every 60s to reduce write amplification.
```

L2 (agent memory) + L3 (section memory) similarly indexed on write.

## Layer 5 — Query API

```js
import { query } from 'scripts/semantic-index.mjs';

const results = await query({
  text: "archetype specificity fails on hero",
  filters: { actor: "quality-reviewer", kind: "subgate-fired", since: "2026-03-01" },
  top_k: 5,
  mode: "embedding" // or "bm25"
});
// → [{ score, ref, ts, actor, kind, subject, summary }]
```

## Layer 6 — Integration

### Agent spawn priming

See `skills/agent-episodic-memory` — spawn prompts include top-3 results.

### Decision graph queries

"Show all decisions impacting the HERO section" →
```sql
SELECT * FROM decisions WHERE json_extract(impacts, '$') LIKE '%hero%'
UNION
SELECT * FROM meta WHERE section_id = 'hero' AND kind IN ('decision-made', 'archetype-chosen')
```

### Research queries

`/gen:research query 'SELECT archetype, AVG(final_ux) FROM sections GROUP BY archetype'` — full DuckDB over the indexed tables.

## Layer 7 — Rotation + pruning

- Embeddings recomputed on model-version bump; triggered manually via `/gen:recalibrate --reindex`.
- Low-signal entries (metrics, routine tool calls) not indexed.
- High-signal entries (decisions, ship events, critic findings) never pruned.

## Layer 8 — Anti-patterns

- ❌ Indexing every tool call — blows up index, dilutes signal.
- ❌ Committing `.planning/genorah/index/` to git — per-session local data; always gitignored.
- ❌ Model-version mismatch between write and query — silent quality degradation; detect via embedding model stamp in meta.db.
- ❌ Skipping L4 ledger (writing directly to index) — breaks audit trail; always go through ledger.
- ❌ Synchronous embed on hot path — background-index with batch commit; embed is ~50-200ms.
