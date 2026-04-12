---
name: asset-forge-manifest
description: Canonical schema and helpers for public/assets/MANIFEST.json — every generated asset (3D, 2D, raster, character, pattern, icon) gets a manifest entry with sha256 cache key, source metadata, DNA coverage, archetype compliance, and license. Sub-gate reads this file to compute asset-quality penalties.
tier: domain
triggers: assets, manifest, asset-forge, license, cache-key, dna-coverage
version: 0.1.0-provisional
---

# Asset Forge Manifest

Canonical JSON at `public/assets/MANIFEST.json`. Single source of truth for every asset Genorah generates, imports, or references. The **asset-forge-dna-compliance** sub-gate (v3.5.0) reads this file; missing/malformed entries fail the gate.

## Layer 1 — When to use

Any command that produces a persisted media artifact (3D model, SVG/PNG/WebP/MP4, icon, pattern, character sheet) MUST append a manifest entry. Readers include `/gen:assets audit`, `/gen:brandkit export`, `quality-reviewer` asset sub-gate, and the localhost asset browser.

## Layer 2 — Schema (v1)

```json
{
  "version": 1,
  "generated_at": "2026-04-12T10:00:00Z",
  "dna_hash": "sha256:…",
  "archetype": "editorial",
  "assets": [
    {
      "id": "hero-3d-mark",
      "kind": "3d/hero-glyph",
      "path": "public/assets/3d/hero-mark.glb",
      "preview": "public/assets/3d/hero-mark.webp",
      "cache_key": "sha256:…",
      "source": {
        "tool": "meshy-v4",
        "model": "meshy-4-textured",
        "seed": 42,
        "prompt_id": "prompts/hero-3d-mark.md"
      },
      "dna_coverage": {
        "primary": 0.62,
        "secondary": 0.18,
        "accent": 0.08,
        "off_palette": 0.12
      },
      "material": "chrome",
      "beat": "HOOK",
      "license": "meshy-commercial",
      "bytes": 1843244,
      "quality_scores": {
        "dna_coverage_pct": 88,
        "archetype_compliance": "pass",
        "style_coherence": 0.71
      }
    }
  ]
}
```

### Asset kind taxonomy

- `3d/model`, `3d/scene`, `3d/material`, `3d/hero-glyph`
- `2d/svg`, `2d/icon`, `2d/pattern`, `2d/illustration`, `2d/mesh-gradient`, `2d/blob`
- `raster/hero-bg`, `raster/texture`, `raster/og`, `raster/product`, `raster/character`
- `vector/ai` (Recraft/Firefly output)

### License enum

`cc0` | `cc-by` | `cc-by-sa` | `commercial-paid` | `meshy-commercial` | `flux-commercial` | `ideogram-commercial` | `recraft-commercial` | `user-upload` | `genorah-procedural` | `unknown`

`unknown` blocks commit via `asset-forge-dna-compliance` sub-gate.

### Cache key

```
sha256(dna_hash + archetype + kind + prompt + seed + model_version)
```

Stored in manifest; enables `/gen:assets regenerate` to skip bit-identical re-runs and compute delta when params change.

## Layer 3 — Integration

- **Sub-gate**: `asset-forge-dna-compliance` reads MANIFEST.json, cascades into **Integration Quality** category of quality-gate-v3.
- **Brandkit**: `/gen:brandkit export` pulls icon-system/hero-glyph/pattern assets from manifest instead of regenerating.
- **Companion**: `/gen:dashboard` Assets tab renders manifest with DNA-coverage bars + regen buttons.
- **Ledger**: every manifest write also emits `{kind: "asset-generated", subject: <asset-id>, payload: <manifest-entry>}` to `.planning/genorah/journal.ndjson` (L4).

## Layer 4 — Anti-patterns

- ❌ Writing assets to `public/` without a manifest entry — silent gate failure.
- ❌ `license: "unknown"` — blocks commit; resolve before shipping.
- ❌ Skipping `seed` / `model` in `source` — breaks reproducibility; asset cannot be regenerated deterministically.
- ❌ Re-running generation without reusing cache — wastes API credits; always check cache_key first.
- ❌ Manual edits to `public/assets/` without updating manifest — sub-gate will report `manifest_drift`.
