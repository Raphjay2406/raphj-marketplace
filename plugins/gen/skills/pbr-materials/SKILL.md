---
name: pbr-materials
description: PBR material authoring for 3D assets — archetype-curated material sets with baseColor, roughness, metalness, normal, emissive, AO maps. Procedural via TSL nodes + AI-generated tileable textures via Flux depth/canny. Integrates with glTF export and asset-forge-manifest.
tier: domain
triggers: pbr, materials, textures, gltf, metalness, roughness, tileable, tsl, archetype-materials
version: 0.1.0-provisional
---

# PBR Materials

Physically-based materials for every 3D asset Genorah emits. Two authoring paths: procedural (TSL nodes, deterministic, offline) and AI-generated (Flux controlnet with depth/canny for tileable textures).

## Layer 1 — When to use

Every 3D asset (model, scene, hero-glyph) needs a material. Default sets are archetype-curated to keep 3D output on-DNA without per-project tuning.

## Layer 2 — Archetype material sets

Per archetype, 3–5 curated materials with explicit allow/forbid relationships to 3dsvg preset library:

| Archetype | Preferred | Forbidden |
|---|---|---|
| Brutalist | concrete, raw-steel, matte-plastic | chrome, glass, clay |
| Ethereal | frosted-glass, iridescent, pearlescent | concrete, raw-steel |
| Editorial | matte-paper, ink, warm-metal | holographic, neon |
| Kinetic | chrome, glass, holographic | clay, matte-paper |
| Luxury | brushed-gold, lacquered-black, marble | rubber, plastic |
| Neo-Corporate | matte-neutral, subtle-metal, glass | holographic, iridescent |
| Playful | plastic, rubber, clay | marble, brushed-gold |
| Data-Dense | wireframe, matte-dark | glass, iridescent |
| Vaporwave | holographic, chrome, iridescent | matte-paper, concrete |
| Cyberpunk-HUD | emissive-neon, matte-dark, glass | warm-metal, marble |
| Claymorphism | clay, soft-plastic | chrome, glass |
| (full table in seeds/archetype-materials.json) | | |

Cross-references with `skills/design-archetypes/seeds/3dsvg-presets.json` `preferred_materials` — must stay consistent.

## Layer 3 — Procedural path (TSL)

Three.js TSL (Three Shading Language) nodes for deterministic procedural materials. No external assets.

```js
// Example: concrete
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { noise, uv, mix, color } from 'three/tsl';

const concrete = new MeshStandardNodeMaterial();
concrete.colorNode = mix(color('#6b6b6b'), color('#8c8c8c'), noise(uv().mul(20)));
concrete.roughnessNode = noise(uv().mul(30)).mul(0.2).add(0.75);
concrete.metalnessNode = 0;
```

Library at `scripts/asset-forge/tsl-materials/` — one file per material.

## Layer 4 — AI path (tileable textures)

For photographic / complex materials:
1. `image-cascade` with `--control depth` using noise-based depth map for micro-surface.
2. Seamless tiling enforced via prompt + post-process (MATLAB-style frequency-domain or `libvips` tile-seam blending).
3. PBR channel extraction via Materialize-style pipeline (albedo, normal, roughness, AO derived from base).
4. Output as glTF KHR_materials_pbrSpecularGlossiness or pbrMetallicRoughness.

## Layer 5 — Integration

- **glTF export**: materials embedded; textures in KTX2 (via skills/gltf-optimization).
- **Manifest**: `material` field references material name from archetype set.
- **asset-forge-dna-compliance A3**: validates `material ∈ preferred`.
- **3dsvg preset library**: `preferred_materials` pulled from this skill's table.

## Layer 6 — Anti-patterns

- ❌ Authoring materials in GLSL directly when TSL suffices — harder to maintain.
- ❌ Ignoring archetype forbidden list because "it looks good" — compliance sub-gate will catch it.
- ❌ Non-tileable AI textures used as tileable — visible seams ship; review always.
- ❌ Forgetting KTX2 transcode — uncompressed textures blow perf budget on 3D sections.
- ❌ Baking lighting into baseColor — destroys PBR; use AO map + scene lighting instead.
