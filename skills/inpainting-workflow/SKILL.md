---
name: inpainting-workflow
description: Targeted asset edit loops via mask-based inpainting. Change character expression without re-generating body, replace background element without re-generating foreground, fix artifacts in hero renders.
tier: domain
triggers: inpainting, mask-edit, targeted-edit, expression-change, artifact-fix
version: 0.1.0-provisional
---

# Inpainting Workflow

Surgical asset edits. Rather than regenerate full variants (cost + consistency risk), mask-and-paint specific regions.

## Layer 1 — When to use

- Character expression change (mask face only)
- Background element swap (mask bg region)
- Artifact fix (mask broken hand/eye/text)
- Logo placement on generated product image
- Text-in-image correction (Ideogram did 90% right; inpaint the one wrong letter)

## Layer 2 — Flow

### Input

```
{
  source_image: "public/assets/raster/hero-bg.webp",
  mask: "masks/hero-bg-center.png" OR prompt-based auto-mask via SAM,
  prompt: "what should appear in the masked region",
  strength: 0.7,
  preserve_edges: true
}
```

### Execution paths

#### Path 1: Flux inpaint via flux-mcp

```
flux.inpaint({
  image, mask, prompt, strength
})
```

Preferred — highest quality edge blending.

#### Path 2: nano-banana edit via continue_editing

nano-banana supports iterative editing. Not mask-precise but good for "change X in this image" style edits.

#### Path 3: Manual SAM + local diffusion

If offline, local SAM model + local SD inpainting. Higher latency; one-time local setup.

### Auto-masking via SAM (optional)

When user provides prompt like "the cup" instead of drawing mask:
1. SAM (Segment Anything) embedding
2. Prompt-based segmentation
3. Use result as mask

## Layer 3 — Post-process

Every inpaint result passes:
1. Seam-blending check — compare 5px strip around mask to mask interior; reject if visible seam (ΔE > 10).
2. Content-preservation check — outside-mask pixels should be unchanged (≤ 1% delta); if > 1% → inpaint bled outside mask → regenerate with harder preserve_edges.
3. Manifest update — edit recorded as `source.inpainted: [{mask_hash, prompt, strength}]` array (multiple edits possible).

## Layer 4 — Integration

### Manifest extension

```json
{
  "id": "hero-bg",
  "source": {
    "tool": "flux-mcp",
    "seed": 42,
    "inpainted": [
      { "mask_hash": "sha256:...", "prompt": "replace cup with book", "strength": 0.7, "ts": "2026-04-12T10:00:00Z" }
    ]
  }
}
```

### /gen:assets regenerate with inpaint

```
/gen:assets regenerate hero-bg --inpaint "mask=center;prompt=replace cup with book"
```

Recorded in manifest; keeps original as `source.pre_inpaint_cache_key`.

## Layer 5 — Anti-patterns

- ❌ Inpainting > 3 times same asset — quality compounds down; regenerate from scratch.
- ❌ Strength > 0.85 on preserve_edges=true — contradictory; pick one.
- ❌ No post-process seam check — visible edit bands ship.
- ❌ Mask regions too small (< 5% of image) — model struggles; enlarge mask or use manual edit.
- ❌ Not recording inpaint in manifest — audit cannot reproduce; cache invalidated silently.
