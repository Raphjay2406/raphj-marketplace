---
name: archetype-arbitration
description: Tension Council — 3-agent vote resolves mandatory-vs-forbidden archetype conflicts in multi-archetype DNA blends. Majority wins; creative-director breaks ties.
tier: core
triggers: tension-council, archetype-conflict, mandatory-forbidden, blend-conflict, archetype-arbitration
version: 1.0.0
---

# Archetype Arbitration — Tension Council

## Layer 1 — When to invoke

Invoked whenever multi-archetype DNA blend produces a conflict: a mandatory technique of archetype A overlaps a forbidden pattern of archetype B (or vice versa). Examples:

- Brutalist mandates **exposed grid lines** — Ethereal forbids visible structure
- Kinetic mandates **velocity-blur effects** — Japanese Minimal forbids motion intensity > 0.3
- Neon Noir mandates **glitch overlays** — Swiss/International forbids decorative noise

Conflict detection runs automatically in `/gen:start-project` and `/gen:archetype-synth` when `primary_weight + secondary_weight > 0.5` for an incompatible pair.

## Layer 2 — The vote protocol

Three voters participate:

1. **creative-director** — casts vote first; evaluates aesthetic coherence and visual impact
2. **brand-voice-enforcer** — evaluates copy/tone consistency against chosen voice parameters
3. **narrative-director** — evaluates emotional arc fit and story throughline

**Resolution:**
- Majority (2/3) wins immediately.
- Tie (impossible with 3 voters unless abstention) → creative-director breaks.
- Abstention allowed only if voter lacks sufficient context; counted as no-vote for majority.

**Vote options per conflict:**
- `ALLOW_A` — keep mandatory technique from archetype A; suppress B's forbidden rule for this technique
- `ALLOW_B` — enforce archetype B's forbidden rule; remove A's mandatory from this project
- `TENSION_OVERRIDE` — register as a creative tension point (counts toward the 1–3 tension quota); both rules active with documented rationale

## Layer 3 — Integration

- Conflict details serialized to DECISIONS.jsonld entry with `@type: "TensionCouncilVote"`
- Each vote logged with `voter`, `choice`, `rationale` fields
- Final resolution emits AG-UI `STATE_DELTA` event: `{ type: "archetype_conflict_resolved", slug, choice }`
- Resolution written to DESIGN-DNA.md under `tension_overrides[]` or `suppressed_rules[]`
- Downstream `/gen:audit` reads `suppressed_rules` to skip those archetype-specificity checks

**DECISIONS.jsonld entry shape:**
```json
{
  "@type": "TensionCouncilVote",
  "conflict": { "techniqueA": "...", "ruleB": "...", "archA": "...", "archB": "..." },
  "votes": [
    { "voter": "creative-director", "choice": "TENSION_OVERRIDE", "rationale": "..." },
    { "voter": "brand-voice-enforcer", "choice": "TENSION_OVERRIDE", "rationale": "..." },
    { "voter": "narrative-director", "choice": "ALLOW_A", "rationale": "..." }
  ],
  "resolution": "TENSION_OVERRIDE",
  "timestamp": "2026-04-13T00:00:00Z"
}
```

## Layer 4 — Anti-patterns

- **Silent override** — applying a resolution without logging the vote trail. BLOCK: DECISIONS.jsonld entry is mandatory.
- **No vote trail** — emitting `STATE_DELTA` without writing the vote objects. Audit will flag missing votes as a conflict-resolution integrity failure.
- **Creative-director unilateral** — skipping brand-voice-enforcer + narrative-director dispatch and deciding alone. Defeats the multi-perspective rationale.
- **Stacking TENSION_OVERRIDE** — using it for every conflict to avoid real decisions. Max 1 tension-override per conflicting pair per project; second conflict in same pair must be ALLOW_A or ALLOW_B.
- **Ignoring the tension quota** — TENSION_OVERRIDE counts toward the page-level 1–3 tension limit. Overflow → demote lowest-impact override to ALLOW_A or ALLOW_B.
