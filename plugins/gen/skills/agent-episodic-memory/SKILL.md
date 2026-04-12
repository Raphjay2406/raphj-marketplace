---
name: agent-episodic-memory
description: L2 of Context Fabric — per-agent-kind NDJSON of (task_fingerprint, input_context, output, score, feedback). Spawn prompts include top-3 nearest-neighbor past entries retrieved via semantic-index (L5). Cuts redundant rediscovery across spawns.
tier: core
triggers: agent-memory, episodic-memory, context-fabric-l2, nearest-neighbor, spawn-priming
version: 0.1.0-provisional
---

# Agent Episodic Memory (L2)

Makes specialists non-amnesiac. Each kind of agent (builder, critic, judge, ux-probe, refiner) keeps a ledger of its own past work. Nearest-neighbor retrieval primes new spawns with the 3 most-relevant past cases.

## Layer 1 — When to use

Invoked automatically by orchestrator on agent spawn. Requires `semantic-index` (L5) for retrieval. Gracefully degrades to last-N if L5 unavailable.

## Layer 2 — Storage

Per-agent-kind NDJSON: `.planning/genorah/agent-memory/{agent-kind}.ndjson`

Entry schema:

```json
{
  "ts": "2026-04-12T10:00:00Z",
  "task_fingerprint": {
    "section_id": "hero",
    "archetype": "editorial",
    "beat": "PEAK",
    "budget_mode": "standard"
  },
  "input": {
    "plan_hash": "sha256:...",
    "rag_refs": ["linear-hero-kinetic-001", ...],
    "prior_score": { "design": 168, "ux": 88 }
  },
  "output": {
    "final_score": { "design": 193, "ux": 92 },
    "techniques_used": ["SplitText", "viewTransitions", "drop-cap"],
    "key_choices": ["reject-waves-bg-for-typographic", "increased-type-scale"]
  },
  "feedback": {
    "shipped": true,
    "user_modified_after": false,
    "downstream_issues": []
  },
  "refs": ["sections/hero/trajectory.json"]
}
```

## Layer 3 — Retrieval (spawn priming)

Orchestrator on spawn:

```
1. Compute task_fingerprint for new task.
2. Query semantic-index (L5) for top-3 memory entries matching:
   - archetype exact
   - beat exact (preferred) or adjacent
   - feedback.shipped == true
3. Inject into spawn prompt as:

   "PAST RELEVANT WORK (top 3, informational — your task is the CURRENT one):
   1. [task sig] → [key outcome] (final score: 193/92)
      Key choices: ..."

4. Persist new entry at task completion.
```

Spawn budget cost: +500-1500 tokens; often repays by avoiding rediscovery.

## Layer 4 — Agents that keep memory

| Agent kind | Use case |
|---|---|
| builder | "last 3 times I built Editorial PEAK, what worked?" |
| adversarial-critic | "last 3 senior-designer critiques on Editorial — common findings" |
| judge | "golden-set comparables for this (archetype, beat)" |
| ux-probe | "last P3-Power-user runs on similar layouts" |
| visual-refiner | "refinement patterns that hit convergence in 1 cycle" |

## Layer 5 — Integration

### Dedup + pruning

- Duplicate task_fingerprint within 7d → merge (keep higher score).
- Entries with `feedback.shipped: false` still kept (negative examples useful).
- Entries with `feedback.user_modified_after: true` flagged (user disagreed with agent).
- Rotate at 10MB per agent-kind → archive to `.planning/genorah/archive/agent-memory/`.

### Ledger

Every memory write also emits ledger:

```json
{
  "kind": "agent-memory-written",
  "subject": "builder/hero",
  "payload": { "final_score_total": 285, "techniques": 3 }
}
```

### Cross-project

Entries with `feedback.shipped: true` AND score ≥ archetype 95th percentile eligible for promotion to L6 cross-project KB (session-end prompts for extract).

## Layer 6 — Anti-patterns

- ❌ Writing memory entries mid-task — incomplete data; always write at task completion.
- ❌ Injecting > 3 entries in spawn — context bloat, diminishing returns.
- ❌ Querying across agent-kinds — semantics differ (builder outcomes vs critic findings); keep silo'd.
- ❌ Manual memory edits — corrupts learning signal; use correction events via ledger instead.
- ❌ No `feedback` field — entry can't inform future decisions; require at write time.
