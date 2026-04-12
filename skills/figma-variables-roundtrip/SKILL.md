---
name: "figma-variables-roundtrip"
description: "Bidirectional sync between Design DNA tokens and Figma Variables / Tokens Studio. REST API v1 for Variables; JSON round-trip via Tokens Studio plugin."
tier: "domain"
triggers: "figma variables, figma tokens, tokens studio, design tokens export, figma roundtrip, dna to figma"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Design team uses Figma and must stay aligned with coded DNA.
- Token changes originate either side — need bidirectional sync.

## Layer 2: Flow

**Export (Genorah → Figma):**
```bash
node scripts/figma-variables-export.mjs \
  --dna DESIGN-DNA.md \
  --file-key <FIGMA_FILE_KEY> \
  --mode light,dark
```
Produces Variables via `POST /v1/files/{key}/variables` (requires Enterprise; else emits Tokens Studio JSON).

**Import (Figma → Genorah):**
```bash
node scripts/figma-variables-import.mjs --file-key <KEY> --write DESIGN-DNA.md
```

Diff and approve via `/gen:feedback` before merge.

## Layer 3: Integration Context

- Token Studio JSON format: DTCG-compliant (`$value`, `$type`, `$description`).
- Modes: light, dark, high-contrast — map to DNA variants.
- Semantic naming enforced: `color.semantic.primary` not `color.blue.500` (DNA is semantic-first).
- Conflicts during import → block with `DNA_STRICT=1` drift check.

## Layer 4: Anti-Patterns

- Overwriting DNA silently on import — always require `/gen:feedback` approval.
- Exposing raw color values in Figma — lose semantic intent.
- Skipping modes — light-only exports break dark-mode previews.
