---
name: context-fabric-ledger
description: Append-only NDJSON event log at .planning/genorah/journal.ndjson. Every significant pipeline event writes one line. Foundation for v3.5.3 Context Fabric (L4) — agent episodic memory, semantic index, compaction-survivor protocol, cross-session diff all read from this ledger.
tier: core
triggers: ledger, journal, context-fabric, event-log, memory, retention, compaction
version: 0.1.0-provisional
---

# Context Fabric Ledger (L4)

Append-only NDJSON at `.planning/genorah/journal.ndjson`. One line per significant event, schema-validated. **This is the v3.5 retention foundation** — every other Fabric layer (agent episodic memory, semantic index, cross-project KB, calibration store) reads from here or is seeded from here.

## Layer 1 — When to use

Write a ledger line when:
- A decision is made (DNA locked, archetype chosen, wave approved)
- A significant artifact is produced (section shipped, variant scored, asset generated)
- A sub-gate fires (motion-health FAIL, DNA drift WARN, SSIM cap applied)
- A user provides feedback (/gen:feedback, /gen:postship)
- Judge produces a verdict (tournament result, κ score)
- A critic produces findings
- A trajectory entry is written (variant iteration)

Do **not** write ledger lines for routine tool calls (file reads, small edits) — those live in `METRICS.md`. The ledger is for signal, not noise.

## Layer 2 — Schema

```json
{
  "ts": "2026-04-12T10:14:00Z",
  "actor": "judge",
  "kind": "variant-scored",
  "subject": "hero/variant-3",
  "payload": { "design": 187, "ux": 94, "kappa": 0.78 },
  "refs": ["sections/hero/trajectory.json#it3"]
}
```

**Fields (all required):**

| Field | Type | Notes |
|---|---|---|
| `ts` | ISO-8601 string | Event time in UTC |
| `actor` | enum | `orchestrator` \| `planner` \| `builder` \| `quality-reviewer` \| `judge` \| `critic` \| `ux-probe` \| `visual-refiner` \| `polisher` \| `consistency-auditor` \| `user` \| `hook:<name>` |
| `kind` | string | event type; kebab-case; see taxonomy below |
| `subject` | string | primary entity touched (section id, asset id, decision id, variant id) |
| `payload` | object | event-specific data; schema-validated per `kind` where known |
| `refs` | array of string | pointer refs (file paths with optional #anchor) enabling cross-linkage |

**Kind taxonomy (current):**

- `decision-made` · `dna-locked` · `archetype-chosen` · `wave-approved`
- `section-started` · `section-shipped` · `section-rebuilt`
- `variant-generated` · `variant-scored` · `variant-selected`
- `asset-generated` · `asset-rejected`
- `subgate-fired` · `hardgate-fail` · `cap-applied`
- `feedback-received` · `critique-issued` · `refinement-applied`
- `judge-disagreement` · `calibration-drift-detected`
- `session-started` · `session-ended` · `compaction-run`

## Layer 3 — Integration

### Read patterns

- **Agent spawn (L2)**: specialist agents receive top-3 nearest-neighbor past entries (filtered by `actor`, `kind`, `archetype`) in spawn prompt.
- **Compaction-Survivor (pre-compact.mjs)**: read last N entries + open decisions → pack top-10 most-referenced into `compaction-summary.md`.
- **Session resume (session-start.mjs)**: read entries since last `session-ended` → emit Context Diff block.
- **Dashboard (`/gen:dashboard`)**: stream via SSE, render activity feed + score trajectory.
- **Semantic index (L5)**: embed each entry's payload + subject; sqlite-vec store at `.planning/genorah/index/vectors.db`.

### Write patterns

- **post-tool-use.mjs hook**: intercepts tool calls matching enumerated-kind pattern, writes ledger line.
- **Agent direct write**: any agent can append via `scripts/ledger-write.mjs <kind> <subject> <payload.json>` — atomic append with fsync.

### Rotation & retention

- Rotates at 50MB → archived to `.planning/genorah/archive/journal-YYYYMMDD.ndjson.gz`.
- Monthly compaction: low-signal entries (raw metrics, duplicates) dropped; high-signal (decisions, ship events, feedback) preserved forever.
- Gitignored by default — per-project local memory, not source-controlled. Cross-project lessons flow to Obsidian vault (L6).

## Layer 4 — Anti-patterns

- ❌ Writing a ledger line per file edit — use METRICS.md for that; flood kills L5 semantic index utility.
- ❌ Free-form `kind` strings — breaks taxonomy queries; always use canonical kebab-case.
- ❌ Payloads without `subject` — un-linkable; breaks L2 nearest-neighbor retrieval.
- ❌ Deleting or mutating past lines — append-only is the contract; corrections go as new entries with `kind: "correction"` + `refs: [<original-line-ref>]`.
- ❌ Committing the ledger to git — contains per-session details, potentially PII; always gitignored.
