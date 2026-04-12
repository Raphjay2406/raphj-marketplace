---
name: "gltf-authoring-pipeline"
description: "glTF production pipeline: Blender export → gltf-transform optimization (Draco + Meshopt + KTX2) → CDN. Budget enforcement, license capture, DNA-material matching."
tier: "domain"
triggers: "gltf pipeline, gltf optimization, draco, meshopt, ktx2, 3d asset pipeline"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Custom 3D assets need to ship (product models, environments, props).
- Asset size > 500KB raw — optimization required.

## Layer 2: Pipeline

```bash
# Author in Blender with glTF export
# Then optimize:
gltf-transform draco input.glb output.draco.glb --compression-level 10
gltf-transform meshopt output.draco.glb output.meshopt.glb
gltf-transform uastc output.meshopt.glb output.final.glb \
  --filter etc1s --slots *Color
```

Budget enforcement in `scripts/asset-forge/gltf-check.mjs`:
- Raw vertices ≤ 100k per mesh
- Texture dimensions ≤ 2048²
- Total file ≤ 2MB after optimization
- License captured in `asset-forge/MANIFEST.json`

## Layer 3: Integration Context

- DNA material matching: PBR material palette in `seeds/archetype-materials.json` (v3.5.5).
- Preview via `@react-three/drei`'s `<Gltf>` loader with `useGLTF.preload`.
- Fallback for `prefers-reduced-motion`: pre-rendered PNG sequence.
- Licenses: CC0 / CC-BY / commercial — all tracked.

## Layer 4: Anti-Patterns

- Shipping `.glb` straight from Blender export — 5-10x larger than needed.
- Embedded textures uncompressed — use KTX2 always.
- Missing license metadata — fails SBOM scan.
- High-poly assets for hero-only use — use normal maps instead.
