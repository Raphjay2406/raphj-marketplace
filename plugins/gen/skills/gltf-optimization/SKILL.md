---
name: gltf-optimization
tier: utility
description: "GLTF asset pipeline: Draco geometry compression, Meshopt, KTX2/BasisU textures, LOD generation, budget enforcement (<2MB hero models, <300MB GPU memory). For 3d-webgl sections with heavy assets."
triggers: ["gltf", "glb", "3d model", "draco", "meshopt", "ktx2", "basis", "3d optimization", "model compression", "texture compression", "LOD"]
used_by: ["3d-specialist", "builder", "quality-reviewer"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why GLTF Optimization

Raw GLTF models are often 10-50MB with uncompressed PNG textures. That's the difference between a 8.5 Awwwards score and a 7.0 — the wow moment never loads. This skill codifies the pipeline that gets models under budget without visual degradation.

### When to Use

- Section uses a `.gltf`/`.glb` model >500KB.
- Hero/PEAK beat with 3D showcase.
- Multiple models on the same page (portfolio, product config).

### When NOT to Use

- Spline embeds (Spline handles its own pipeline).
- Procedural geometry (TSL shaders, no model file).
- 3D icons <50KB (over-optimization cost exceeds gain).

## Layer 2: Technical Spec

### Pipeline

```bash
# Using gltf-transform CLI — preferred over browser-side decoders
npx gltf-transform optimize input.glb output.glb \
  --compress meshopt \
  --texture-compress ktx2 \
  --simplify 0.8 \
  --resize 1024
```

Steps:
1. **Simplify** — reduce triangle count by 20% (0.8 ratio). Visually imperceptible for hero assets, huge file savings.
2. **Meshopt** — geometry compression (better than Draco in 2025 for most cases). Fallback: Draco for older runtimes.
3. **KTX2 (Basis)** — GPU-compressed textures. 4-8x smaller than PNG, GPU-direct (no decode).
4. **Resize** — textures capped at 1024 for hero, 512 for decorative, 256 for thumbnails.
5. **LOD** — generate 3 levels (high/med/low) for distance-based swap when camera/scroll-position varies.

### Budget table

| Asset class | Size budget | Texture max | Triangle max |
|-------------|-------------|-------------|--------------|
| Hero showcase | 2 MB | 2048 KTX2 | 100k |
| Secondary prop | 500 KB | 1024 KTX2 | 30k |
| Decorative | 200 KB | 512 KTX2 | 10k |
| Icon | 50 KB | 256 KTX2 | 2k |

GPU memory total page budget: 300MB (3 hero + 2 secondary + 10 decorative).

### Loader wiring (three.js + R3F)

```tsx
import { useGLTF } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

useGLTF.preload('/models/hero.glb', true, false, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
  const ktx2 = new KTX2Loader()
    .setTranscoderPath('/basis/')
    .detectSupport(gl);
  loader.setKTX2Loader(ktx2);
});
```

Basis transcoder (`/basis/`) must be served statically.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| hero_model_size | — | 2 | MB | HARD |
| total_gpu_memory | — | 300 | MB | HARD |
| texture_max | — | 2048 | px | HARD per class |
| LOD_levels | 1 | 3 | count | default 3 for hero |
| fallback_fps | 30 | 55 | fps | SOFT (report at audit) |

## Layer 3: Integration Context

- **3d-specialist agent** — invokes this skill when a section declares a `.glb`/`.gltf` asset.
- **Builder** — runs optimization step before committing; rejects unoptimized assets.
- **Perf-budgets skill** — total page GPU memory contributes to perf category.
- **Three-d-webgl-effects skill** — upstream creative guidance; this skill handles the hand-off to production.

## Layer 4: Anti-Patterns

- ❌ **Shipping raw .gltf** — 10-50MB download kills LCP.
- ❌ **PNG textures in 2025** — KTX2 is supported in every target browser; use it.
- ❌ **Draco for new projects** — Meshopt decodes faster, compresses similarly; Draco only for legacy pipelines.
- ❌ **Single LOD for all distances** — distant models waste triangles; use 3 levels.
- ❌ **Skipping simplify** — 20% triangle reduction is invisible, saves massive bytes.
- ❌ **Using `useGLTF` default loader** — doesn't wire Meshopt/KTX2. Always inject the decoders.
