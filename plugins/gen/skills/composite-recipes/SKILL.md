---
name: composite-recipes
description: YAML recipe format for orchestrating asset-worker pipelines
tier: domain
triggers:
  - "recipe"
  - "composite pipeline"
version: 4.0.0
---

# Composite Recipes

## Layer 1 — Decision

Use recipes for repeatable multi-step asset generation. Recipe = YAML file under `recipes/`.

## Layer 2 — Example

```yaml
name: brand-marks
version: 1.0.0
steps:
  - worker: recraft-vector-author
    input: { prompt: "${brand.logo_prompt}", substyle: "${dna.archetype}" }
validators_per_step: [dna-compliance, license]
followups_enabled: false
```

## Layer 3 — Integration

- Schema: RecipeSchema in @genorah/asset-forge
- Interpolation: `${previous.artifact.path}`, `${brand.x}`, `${dna.x}`, `${recipe.x}`
- Followups: workers can suggest dynamic corrections mid-recipe via `Result<T>.followups`

## Layer 4 — Anti-Patterns

- Hardcoded paths instead of interpolation
- Disabling followups on photoreal recipes (loses DNA-coverage corrections)
- Recipes without validators_per_step
