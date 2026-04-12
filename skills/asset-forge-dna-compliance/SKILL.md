---
name: asset-forge-dna-compliance
description: Sub-gate that reads public/assets/MANIFEST.json and verifies DNA coverage, archetype-material compliance, license presence, and cross-asset style coherence. Cascades into Integration Quality category of quality-gate-v3.
tier: core
triggers: asset-forge, asset-compliance, manifest-audit, asset-sub-gate, quality-gate-v3
version: 0.1.0-provisional
---

# Asset Forge DNA Compliance Sub-Gate

Reads `public/assets/MANIFEST.json` and enforces the asset-governance rules established in `skills/asset-forge-manifest/`. Runs as part of quality-reviewer Stage 9 (Audit).

## Layer 1 — When to use

Every project that generates assets via `/gen:assets` or `/gen:brandkit` must pass this sub-gate before ship. Projects with no `public/assets/` tree skip the gate (returns `status: no-assets`).

## Layer 2 — Checks

### A1. Manifest entry required for every asset file (block)

- **PASS**: Every file under `public/assets/` has a matching entry in `MANIFEST.json`.
- **FAIL**: orphan file → record `manifest_drift: [filename]`.
- **Action on fail**: Integration Quality × 0.6 cap.

### A2. DNA color coverage ≥ 60% (−6 per asset)

- **PASS**: Each asset's `dna_coverage.primary + secondary + accent` ≥ 0.6.
- **CHECK**: Compute per-asset coverage from its rendered/preview image: extract dominant colors (top 8), compare ΔE2000 to DNA palette, classify each dominant into `primary | secondary | accent | muted | off_palette`.
- **Action on fail**: −6 per failing asset (capped at −24 total).

### A3. Archetype material compliance (−6 per asset)

- **PASS**: Asset's `material` field ∈ archetype's `preferred_materials` (read from `skills/design-archetypes/seeds/3dsvg-presets.json` archetype entry).
- **FAIL**: material used is in archetype's `forbidden_materials`.
- **Action on fail**: −6 per asset; if forbidden, additionally BLOCK until resolved.

### A4. Forbidden-pattern scan (−8 per asset)

- **PASS**: Asset doesn't contain archetype's forbidden techniques (rounded corners on Brutalist 3D model, pastel tint on Neo-Corporate mascot, etc.).
- **CHECK**: Image analysis — corner-radius detection for 3D/vector; hue/saturation histogram for raster.
- **Action on fail**: −8 per asset.

### A5. Style coherence across kind+beat set (−4 per divergent asset)

- **PASS**: All assets with same `kind` + `beat` have pairwise SSIM ≥ 0.45.
- **CHECK**: Cross-correlate preview images within each (kind, beat) group.
- **Action on fail**: Flag divergent asset; −4 per outlier.

### A6. License clear (block)

- **PASS**: No asset has `license: "unknown"`.
- **FAIL**: BLOCK commit; require resolution in DECISIONS.md or regeneration.

### A7. Cache reproducibility (−3 per asset)

- **PASS**: Asset has either bit-identical re-generation capability OR `source.seed + source.prompt_id + source.model` fully specified.
- **Action on fail**: −3 per asset; non-blocking but logged.

## Layer 3 — Integration

### Ledger

Each asset-compliance check emits:

```json
{
  "kind": "asset-compliance-checked",
  "subject": "<asset-id>",
  "payload": { "checks": { "A1": "pass", "A2": "fail:0.42", "A3": "pass", ... }, "penalty": -6 }
}
```

### Cascade

Total asset penalty aggregates into Integration Quality category (Axis 1). Soft cap at × 0.5 if ≥ 30% of assets fail ≥ 2 checks each.

### Dashboard

`/gen:dashboard` Assets tab renders per-asset compliance bars; click-to-regenerate sends `/gen:assets regenerate <id>` to the orchestrator.

## Layer 4 — Anti-patterns

- ❌ Running without a valid `MANIFEST.json` — the gate cannot scope; fails fast.
- ❌ Adding files to `public/assets/` manually without manifest entries — `manifest_drift` flags, gate blocks ship.
- ❌ Overriding `license: "unknown"` with `"cc0"` without verification — audit detectable via mismatched source metadata; explicit human sign-off required.
- ❌ Using generic `dna_coverage` values without actual color analysis — gate requires per-asset numerical coverage, not copy-paste defaults.
