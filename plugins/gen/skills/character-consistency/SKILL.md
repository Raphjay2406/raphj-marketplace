---
name: character-consistency
description: Consistent character/mascot generation across variants using IP-Adapter Plus Face, PuLID, InstantID, or Flux-LoRA character sheets. Produces reference + turnaround + expression variants + pose variants with identity preserved.
tier: domain
triggers: character-consistency, mascot, ip-adapter, pulid, instantid, flux-lora, character-sheet, turnaround
version: 0.1.0-provisional
---

# Character Consistency

Generates a consistent character across a brand-matrix of variants (turnaround, expressions, poses) with identity preserved. Used by `/gen:assets character`.

## Layer 1 — When to use

- Mascot or illustrated brand character needed across site
- Founder portrait styling consistently
- Character set for product UI (onboarding avatars, error-state companions)
- NOT for stock photography — use `image-cascade` directly.

## Layer 2 — Methods (by MCP availability)

### Path 1: Flux + IP-Adapter Plus Face (preferred)

Requires `flux-mcp` with IP-Adapter endpoint:

1. Generate 1 canonical reference image (seed-pinned).
2. For each variant: use canonical as IP-Adapter input at strength 0.7, vary prompt for pose/expression.
3. Face-consistency via IP-Adapter Plus Face; structure via ControlNet pose.

### Path 2: PuLID (stronger identity lock)

Same flow, PuLID offers higher identity-lock strength — good for realistic humans.

### Path 3: InstantID (fastest)

Lower quality than PuLID but faster; good for UI-scale avatars.

### Path 4: Flux LoRA character sheet (long-term consistency)

When character will appear across many projects or long-term:
1. Generate or gather 15-30 reference images.
2. Train lightweight LoRA on Replicate/local (1-2 hours).
3. All generation uses LoRA; identity rock-solid.

Path selection at `/gen:assets character` time based on MCP availability and project scope.

## Layer 3 — Brand matrix output

For a character, produce:

| Variant kind | Count | Purpose |
|---|---|---|
| Canonical reference | 1 | IP-Adapter / LoRA seed |
| Turnaround (0°, 90°, 180°, 270°) | 4 | 3D feel + any angle usable |
| Expression variants | 3–5 | happy, neutral, confused, excited, thinking |
| Pose variants | 2–4 | idle, action, pointing, waving |
| Thumbnail/avatar | 1 | 256×256 crop |

Every variant gets a manifest entry referencing the canonical via `source.parent_id`.

## Layer 4 — Integration

### Manifest extensions

```json
{
  "id": "mascot-canonical",
  "kind": "raster/character",
  "source": {
    "tool": "flux-mcp",
    "model": "flux-1.1-pro-ultra",
    "method": "ip-adapter-plus-face",
    "seed": 42,
    "prompt_id": "prompts/mascot-canonical.md"
  },
  "character": {
    "id": "pip",
    "role": "canonical",
    "identity_lock_strength": 0.7
  }
},
{
  "id": "mascot-turnaround-90",
  "kind": "raster/character",
  "source": {
    ...,
    "control_type": "pose",
    "control_map_hash": "sha256:..."
  },
  "character": {
    "id": "pip",
    "role": "turnaround",
    "variant": "90deg",
    "parent_id": "mascot-canonical"
  }
}
```

### DNA compliance

Characters tinted into DNA palette via post-generation color-grade pipeline (see `image-cascade` photo-pipeline). Failing assets < 60% DNA coverage per asset-forge-dna-compliance A2.

## Layer 5 — Anti-patterns

- ❌ Using different methods (Path 1 + Path 3) across same character matrix — identity drifts visibly.
- ❌ Identity lock > 0.85 — kills pose/expression variation; matrix flattens.
- ❌ Identity lock < 0.5 — character identity breaks across variants.
- ❌ Skipping canonical — every variant needs a reference; no canonical = no consistency.
- ❌ LoRA training without 15+ reference images — underfits; low-quality character emerges.
