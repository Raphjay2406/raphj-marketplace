---
name: upscaling
description: Raster upscaling via Real-ESRGAN (local) or SUPIR (via Replicate). Preserves detail on hero backgrounds, character references, OG images at delivery sizes (4K, retina).
tier: domain
triggers: upscaling, real-esrgan, supir, 4k, retina, image-upscale
version: 0.1.0-provisional
---

# Upscaling

Post-gen upscaling for hero + retina delivery. Real-ESRGAN default (local, no API), SUPIR for peak quality on final brand assets.

## Layer 1 — When to use

- Hero backgrounds delivered at 2× or 4×
- Retina display of brand assets (logo, product imagery)
- OG images that need to render crisp at 1200×630 when originally smaller
- Character references used at print quality

Skip: thumbnails, UI icons (use Recraft/procedural), any asset < 512px base.

## Layer 2 — Methods

### Path 1: Real-ESRGAN (local, default)

Local Python sidecar via `esrgan-mcp` OR fallback shell:

```
scripts/asset-forge/upscale.mjs <input> --scale 4 --model realesrgan-x4plus --out <output>
```

Requires `realesrgan-ncnn-vulkan` binary on PATH. Silent fallback to Path 2 if absent.

### Path 2: Replicate SUPIR (API)

Higher quality, especially on faces + text. API call:

```
replicate.run("camenduru/supir:...", {
  image: <input>,
  upscale: 4,
  model: "v0Q"
})
```

Requires `REPLICATE_API_TOKEN`. Cost ~$0.10 per upscale.

### Path 3: Skip (no upscale; warn)

If neither available, asset ships at native resolution; user warned that delivery may look soft on hero surfaces.

## Layer 3 — Integration

### Manifest extension

```json
"source": {
  ...,
  "upscaled": {
    "method": "realesrgan-x4plus",
    "scale": 4,
    "from_bytes": 523144,
    "to_bytes": 2183920
  }
}
```

### Perf budget check

After upscale, asset size check against perf-budgets skill:
- Hero bg ≤ 300KB WebP at 2K
- Product imagery ≤ 150KB
- OG image ≤ 200KB

Fail → retry with lower scale or WebP quality tuning.

### Build pipeline

Upscaled assets go through image-asset-pipeline skill → AVIF + WebP + fallback JPEG at multiple sizes (`srcset` ready).

## Layer 4 — Anti-patterns

- ❌ Upscaling < 512px base — ESRGAN hallucinations; artifacts visible.
- ❌ Scale > 4× — diminishing returns; use native 4K gen instead.
- ❌ Upscaling without perf-budget check — ships multi-megabyte assets.
- ❌ SUPIR on every asset — cost explosion; reserve for final brand-critical.
- ❌ Not updating manifest bytes field — cache + audit mismatch.
