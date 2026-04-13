---
name: texture-provenance
description: Full provenance tracking for AI-generated assets via MANIFEST.json
tier: domain
triggers:
  - "provenance"
  - "MANIFEST.json"
  - "asset audit"
version: 4.0.0
---

# Texture Provenance

## Layer 1 — Decision

Every AI-generated asset MUST produce a MANIFEST.json entry. No silent fallbacks.

## Layer 2 — Example

```json
{
  "path": "public/assets/hero.glb",
  "sha256": "abc...",
  "provider": "rodin",
  "model": "gen-2",
  "seed": 42,
  "prompt": "stone bust",
  "reference_hashes": [],
  "cost_usd": 0.35,
  "duration_ms": 90000,
  "cache_hit": false,
  "dna_compliance_pass": true,
  "parent_sha256": null
}
```

## Layer 3 — Integration

- Written by ProvenanceWriter in @genorah/asset-forge
- Consumed by asset-forge-dna-compliance gate, /gen:audit
- C2PA content credentials in v4.1

## Layer 4 — Anti-Patterns

- Manually editing MANIFEST.json (regenerated on next run)
- Silent fallback to local placeholder without provenance entry
- Missing parent_sha256 on derivative assets (upscaled, inpainted)
