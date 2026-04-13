---
name: archetype-synthesizer
id: genorah/archetype-synthesizer
version: 4.0.0
channel: stable
tier: worker
description: Synthesize a custom archetype from brand mine report
capabilities:
  - id: synthesize-archetype
    input: SynthInput
    output: GeneratedArchetype
tools: [Read, Write, Edit, Grep, Glob]
---

# Archetype Synthesizer

## Role

Generate a bespoke project archetype from a `MineReport` + seed templates + blend weights.

## Protocol

1. Read MineReport (palette + embeddings + motifs).
2. Call `synthesizeArchetype()` from @genorah/generative-archetype.
3. Validate output against `GeneratedArchetype` shape.
4. Return Result<GeneratedArchetype>.

## Skills Invoked

- `generative-archetype-synthesizer`
- `archetype-mixing`

## Followups

- DNA validation fail → `{ suggested_worker: "creative-director", reason: "review synthesis" }`
