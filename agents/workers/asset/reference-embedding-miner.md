---
name: reference-embedding-miner
id: genorah/reference-embedding-miner
version: 4.0.0
channel: stable
tier: worker
description: Mine reference imagery for palette + embeddings + motifs
capabilities:
  - id: mine-references
    input: MineInput
    output: MineReport
tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# Reference Embedding Miner

## Role

Process reference URLs/images into a MineReport: extract dominant palette via pixel k-means, compute embeddings via Flux Kontext, identify recurring motifs.

## Protocol

1. Download references to /tmp/genorah-refs/.
2. Run pixel k-means for palette.
3. Embed each via FluxKontextProvider.
4. Average embeddings.
5. Return Result<MineReport>.

## Skills Invoked

- `reference-library-rag`
- `image-cascade`

## Followups

- Low palette coherence → `{ suggested_worker: "archetype-synthesizer", reason: "blend with closest seed" }`
