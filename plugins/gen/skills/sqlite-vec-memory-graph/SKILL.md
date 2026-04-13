---
name: sqlite-vec-memory-graph
description: Cross-project memory via @genorah/memory-graph — sqlite-vec embeddings, node/edge schema, semantic recall
tier: domain
triggers: [memory graph, sqlite-vec, cross-project memory, memory-graph, semantic recall, long-term memory, episodic memory]
version: 4.0.0
---

## Layer 1: Decision Guidance

### When to Use

- When an agent needs to recall decisions, DNA tokens, or patterns from past projects
- When `/gen:memory-query` is invoked to surface related prior work
- When the agent-episodic-memory worker seeds the graph with a completed wave's artifacts
- When building cross-project pattern discovery (archetype drift, reusable components)

### When NOT to Use

- Single-project in-session context — use `CONTEXT.md` / `context-anchor-v2` instead
- Transient scratchpad data that won't outlive the session — use L1 scratchpad
- Real-time streaming retrieval with strict latency budgets — use `supabase-vector` for hosted pgvector

### Decision Tree

- If recall needed at session start → query graph with project DNA tokens as seed
- If saving a completed section → upsert node with `type: "section"`, edges to DNA + archetype nodes
- If surfacing similar prior designs → cosine similarity query over embedding column
- If graph grows beyond 50k nodes → run `VACUUM` + `ANALYZE` on the SQLite file

### Pipeline Connection

- **Referenced by:** agent-episodic-memory worker, `/gen:memory-query` command, wave-director preamble
- **Consumed at:** session-start hook (drift check), `/gen:start-project` research phase

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Initialize memory-graph and upsert a node

```typescript
import { MemoryGraph } from "@genorah/memory-graph";

const graph = new MemoryGraph({ dbPath: ".planning/genorah/memory.db" });
await graph.open();

await graph.upsertNode({
  id: "project:acme-redesign",
  type: "project",
  label: "Acme Redesign",
  embedding: await graph.embed("Brutalist archetype, primary #FF3B00, display Bebas Neue"),
  meta: { archetype: "Brutalist", version: "4.0.0" },
});
```

#### Pattern: Semantic recall query

```typescript
const results = await graph.query({
  text: "kinetic typography hero with split-screen layout",
  topK: 5,
  filter: { type: "section" },
});

for (const node of results) {
  console.log(node.label, "similarity:", node.score);
}
```

#### Pattern: Add a relationship edge

```typescript
await graph.upsertEdge({
  from: "project:acme-redesign",
  to: "archetype:brutalist",
  rel: "uses_archetype",
  weight: 1.0,
});
```

### Reference Sites

- **sqlite-vec docs** (alexgarcia.xyz/sqlite-vec) — cosine distance, vector column syntax, VACUUM strategy
- **Obsidian Dataview** (blacksmithgu.github.io/obsidian-dataview) — graph query inspiration for node/edge mental model

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--primary` | Node highlight color in memory-graph visualizer |
| `--accent` | Edge connection color in graph UI |
| `--muted` | Low-similarity result label color |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| AI-Native | Surface top-3 memory recalls as visible context cards at session start |
| Minimal | Suppress recall UI; inject context silently into agent preamble |

### Pipeline Stage

- **Input from:** Completed wave artifacts (SUMMARY.md, DESIGN-DNA.md, section TSX)
- **Output to:** Session-start context preamble, `/gen:memory-query` result table

### Related Skills

- `context-anchor-v2` — in-session context anchor; memory-graph is the cross-session layer
- `supabase-vector` — hosted alternative for teams; sqlite-vec is local-first
- `self-improving-judge` — recalibration uses memory-graph delta log to update weights

## Layer 4: Anti-Patterns

### Anti-Pattern: Querying without an embedding

**What goes wrong:** Passing a raw string to `graph.query()` without pre-embedding skips the similarity step and returns random rows.
**Instead:** Always pass `text` (auto-embedded internally) or a pre-computed `embedding` Float32Array — never a plain object filter alone.

### Anti-Pattern: Storing full TSX source in node meta

**What goes wrong:** SQLite rows balloon to MB-scale; VACUUM cycles become blocking; query latency spikes.
**Instead:** Store only the artifact path and a 200-char summary in `meta`; keep the full source on disk.

### Anti-Pattern: Opening multiple MemoryGraph instances on the same file

**What goes wrong:** Concurrent writes to SQLite without WAL mode cause SQLITE_BUSY errors under parallel wave execution.
**Instead:** Open one shared instance per process via `MemoryGraph.singleton()`; enable WAL mode at init (`PRAGMA journal_mode=WAL`).
