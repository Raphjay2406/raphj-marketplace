---
name: photoreal-compositing-pipeline
description: Multi-layer photoreal composite via recipe-driven asset workers
tier: domain
triggers:
  - "photoreal"
  - "composite"
  - "hero scene"
version: 4.0.0
---

# Photoreal Compositing Pipeline

## Layer 1 — Decision

Invoked when a recipe requires multi-layer composition (background + character + product + lighting coherence). Asset director consumes this skill via `recipes/photoreal-character-product.yml`.

## Layer 2 — Example

```yaml
# recipes/hero-scene.yml
steps:
  - worker: flux-hero-gen
    input: { prompt: "${brand.hero_prompt}" }
  - worker: rodin-3d-gen
    input: { prompt: "${brand.subject_prompt}" }
  - worker: ktx2-encoder
    input: { source: "${previous.artifact.path}" }
```

## Layer 3 — Integration

- DNA tokens consumed: archetype, primary/accent color, reference_images
- Pipeline stage: Wave 2+, dispatched by asset-director
- Outputs: MANIFEST.json entries with full provenance

## Layer 4 — Anti-Patterns

- Manually orchestrating workers outside recipe context (loses cache + ledger benefits)
- Skipping `validators_per_step` (silent DNA drift)
- Mixing asset providers without downgrade_chain in DNA
