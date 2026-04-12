---
name: decision-graph
description: Replaces flat DECISIONS.md with typed JSON graph — decisions with edges (rationale, impacts[], supersedes[], evidence[ledger_refs]). Queryable — "show every decision impacting HERO", "which decisions depend on this DNA token", etc.
tier: core
triggers: decision-graph, decisions-json, typed-decisions, supersedes, impacts, evidence
version: 0.1.0-provisional
---

# Decision Graph

Upgrades the flat markdown DECISIONS.md into a queryable graph. Each decision is a node with typed edges. Enables "show everything touching HERO" without manual scrape.

## Layer 1 — When to use

- Every significant design/architecture decision → decision node
- Every supersession (new decision replaces old) → edge
- Every decision that affects specific sections → `impacts[]` edges
- Every decision backed by research or findings → `evidence[]` ledger refs

Old DECISIONS.md retained as human-readable surface; the JSON is the source of truth.

## Layer 2 — Schema

`.planning/genorah/decisions.json`:

```json
{
  "version": 1,
  "decisions": [
    {
      "id": "d-042",
      "ts": "2026-04-12T10:30:00Z",
      "actor": "orchestrator",
      "title": "Swap hero-bg from WebGL waves to typographic composition",
      "rationale": "Axis 1 Creative Courage scored 14/22 on 'derivative' finding; archetype testable-markers demand serif display + prose width signature on Editorial HOOK.",
      "status": "pending" | "applied" | "superseded" | "rejected",
      "category": "design" | "architecture" | "content" | "technique" | "scope",
      "impacts": ["sections/hero", "DESIGN-DNA.md#signature-element"],
      "supersedes": ["d-018"],
      "evidence": [
        "journal.ndjson#t=10:25:00Z:subgate-fired/creative-courage",
        "sections/hero/CRITIQUE-senior-designer.md"
      ],
      "reviewer_approved_by": "user",
      "applied_at": null,
      "applied_by": null
    }
  ]
}
```

## Layer 3 — Operations

### Create decision

```
node scripts/decision-graph.mjs add \
  --title "Swap hero bg" \
  --category design \
  --rationale "..." \
  --impacts sections/hero \
  --supersedes d-018 \
  --evidence journal.ndjson#... sections/hero/CRITIQUE...
```

Writes to decisions.json, appends human-readable line to DECISIONS.md for readability.

### Apply decision

```
node scripts/decision-graph.mjs apply d-042 --by user
```

Marks `status: applied`, timestamps.

### Query

```
# Everything impacting HERO:
node scripts/decision-graph.mjs query --impacts sections/hero

# Everything still pending:
node scripts/decision-graph.mjs query --status pending

# Graph of supersessions:
node scripts/decision-graph.mjs query --graph supersedes
```

## Layer 4 — Integration

### Ledger

Every decision create/apply/reject emits ledger:

```json
{ "kind": "decision-made", "subject": "d-042", "payload": { "status": "pending", "category": "design" }, "refs": [".planning/genorah/decisions.json#d-042"] }
```

### Compaction-Survivor

Pending decisions always in Tier B (preserved across compaction).

### Dashboard

`/gen:dashboard` Decisions tab renders:
- Pending decisions with "apply" buttons
- Graph view of supersessions
- Search by impact surface

### Semantic index

Decision titles + rationales embedded into L5 for `/gen:research query "what decisions shaped HERO?"`.

## Layer 5 — Anti-patterns

- ❌ Treating DECISIONS.md as the source of truth after v3.5.3 — JSON is the source; markdown is render.
- ❌ Decisions without rationale — un-auditable later; rationale is not optional.
- ❌ Decisions without impacts — un-queryable; always enumerate impacts.
- ❌ Ad-hoc decision IDs (d-hero-1, d-2nd-try) — use monotonic `d-NNN`; IDs outlive content.
- ❌ Deleting rejected decisions — keep `status: rejected` with rationale; history matters.
