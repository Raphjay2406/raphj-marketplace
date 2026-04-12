---
name: controlnet-conditioning
description: Depth / canny / pose / scribble conditioning for layout-locked image generation. Used by image-cascade when Flux MCP exposes control endpoints. Enables architectural precision, character pose consistency, layout fidelity.
tier: domain
triggers: controlnet, depth-map, canny-edge, pose-lock, image-conditioning, layout-fidelity
version: 0.1.0-provisional
---

# ControlNet Conditioning

Lifts image-gen fidelity when layout matters — product shots locked to composition, hero backgrounds locked to section grid, characters locked to pose reference.

## Layer 1 — When to use

- Product or asset renders where composition MUST match a wireframe
- Hero backgrounds where element positioning is design-critical
- Character work where pose / expression must carry across variants
- Architectural or graphic precision (Brutalist, Data-Dense, Swiss archetypes)

Skip when: painterly / atmospheric imagery where the AI's stochastic composition IS the point (Ethereal HOOK, Vaporwave backdrops).

## Layer 2 — Conditioning types

### depth

Input: depth map (grayscale, near=white far=black).
Effect: locks 3D layout; subjects sit at designated depths.

Sources of depth map:
- Reference image → auto-extract via Midas or Depth-Anything via `scripts/depth-extract.mjs`
- Wireframe → manual authoring
- 3D proxy scene → render depth pass from Three.js

### canny

Input: edge map (black/white line art).
Effect: locks silhouette and internal edges.

Sources:
- Screenshot of wireframe
- Reference image → canny via `scripts/canny-extract.mjs`
- Hand-drawn sketch

### pose (characters)

Input: OpenPose skeleton overlay.
Effect: locks human figure pose + expression reference.

Sources:
- Photograph → OpenPose extraction
- Pose library (v3.5.2 character-consistency skill ships 40-pose library)

### scribble

Input: rough free-hand sketch.
Effect: loose structure match; AI fills detail.

Use when: you want composition direction without hard locking.

## Layer 3 — Integration

### image-cascade wiring

When `--control <type>` flag passed to `/gen:assets image`:
1. Extract control map (or accept user-provided path).
2. Cache key includes `control_hash` so different control maps → different cache entries.
3. Prompt template gains `control_type` and `control_strength` (default 0.7).
4. Calls Flux MCP `flux.controlnet.generate` if available; falls back to prompt-only with warning.

### Asset manifest extension

```json
"source": {
  "tool": "flux-controlnet",
  "model": "flux-1.1-pro-ultra",
  "control_type": "depth",
  "control_map_hash": "sha256:...",
  "control_strength": 0.7,
  "seed": 42
}
```

### Determinism

`control_map + prompt + seed + model` → bit-identical output. Asset regeneration test should pass.

## Layer 4 — Anti-patterns

- ❌ Over-strong control (strength 1.0) — kills AI creativity; reduces to tracing.
- ❌ Under-strong control (< 0.4) — AI ignores map; defeats purpose.
- ❌ Mixing incompatible controls (depth + canny full-strength) — AI confused; bad outputs.
- ❌ Using pose-lock for non-character scenes — irrelevant skeleton data adds noise.
- ❌ Caching without control_map hash — cross-contamination between control variants.
