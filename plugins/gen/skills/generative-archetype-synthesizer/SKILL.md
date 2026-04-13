---
name: generative-archetype-synthesizer
description: Usage flow for synthesizing bespoke archetypes — mine reference images, blend seed templates, write archetype.json. Backs /gen:archetype-synth command.
tier: domain
triggers: generative-archetype, archetype-synth, mine-report, blend-weights, bespoke-archetype, synthesize
version: 1.0.0
---

# Generative Archetype Synthesizer

When no existing archetype matches the brand, synthesize a new one from reference imagery and weighted blends of seed templates.

## Layer 1 — When to invoke

Use when:
- Brand has a strongly unique visual identity (e.g. high-fashion luxury tech hybrid) not covered by the 50 base archetypes
- Client provides reference images/URLs that don't map to existing archetypes
- `/gen:start-project` returns archetype confidence < 0.65 on top-3 candidates
- Multi-archetype blend has conflict resolution requiring a new merged identity

The flow: **mine → synth → write → validate → use**.

## Layer 2 — Usage flow

**Step 1 — Mine references:**
```bash
# Dispatch reference-embedding-miner worker
node scripts/gen-archetype-synth.mjs mine.json <slug> <seeds-csv> <weights-csv>
# mine.json: output of reference-embedding-miner (palette + embeddings + motifs)
```

**MineReport shape:**
```json
{
  "palette": ["#0a0a0a", "#f0e6d3", "#c8a96e"],
  "embeddings": [[0.12, -0.34, ...], ...],
  "motifs": ["organic-curves", "editorial-grid", "gold-accents"],
  "coherence": 0.82
}
```

**Step 2 — Synthesize:**
```javascript
import { synthesizeArchetype } from "@genorah/generative-archetype";
const archetype = synthesizeArchetype({
  slug: "luxury-editorial",
  mine,
  seed_templates: ["Luxury/Fashion", "Editorial"],
  blend_weights: [0.6, 0.4],
});
```

**Output shape (`GeneratedArchetype`):**
```json
{
  "slug": "luxury-editorial",
  "display_name": "Luxury Editorial",
  "palette": { "primary": "#c8a96e", "bg": "#0a0a0a", "text": "#f0e6d3" },
  "mandatory_techniques": ["gold-typographic-hierarchy", "editorial-whitespace"],
  "forbidden_patterns": ["saturated-colors", "rounded-corners"],
  "tension_zones": ["scale-contrast", "material-contrast"],
  "confidence": 0.87
}
```

**Step 3 — Write + validate:**
Output written to `skills/design-archetypes/archetypes/<slug>/archetype.json`. Run `/gen:self-audit` after synthesis to validate frontmatter + conflict map.

## Layer 3 — Integration

- `/gen:archetype-synth` command invokes this flow end-to-end
- `archetype-synthesizer` worker calls `synthesizeArchetype()` programmatically
- `reference-embedding-miner` worker produces the MineReport input
- Tension Council arbitration invoked automatically if synthesized mandatory techniques conflict with DNA-locked patterns
- Resulting archetype registered in `skills/design-archetypes/archetypes/` — auto-discovered by archetype-loader

## Layer 4 — Anti-patterns

- Blending > 3 seed templates — output coherence degrades below 0.65; stick to 2–3 seeds.
- Using `blend_weights` that don't sum to 1.0 — synthesizer normalizes but warns; supply correct weights.
- Skipping Tension Council when synthesized archetype has conflicts with active DESIGN-DNA.md — always run conflict detection before scaffold.
- Treating `confidence < 0.65` as a warning — it's a blocker; return to mine step or select a base archetype instead.
