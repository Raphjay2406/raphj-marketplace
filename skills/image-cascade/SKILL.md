---
name: image-cascade
description: Graceful-degrade image generation pipeline — Flux 1.1 Pro Ultra → Flux Pro Raw → Ideogram 3 → nano-banana → text prompt file. First available provider wins; results cached by sha256 prompt+seed+model.
tier: domain
triggers: image-cascade, image-generation, flux, ideogram, nano-banana, asset-forge, image-pipeline
version: 0.1.0-provisional
---

# Image Cascade

Resilient raster image generation that degrades gracefully across 4 providers. Used by `/gen:assets image` and builder agents for hero backgrounds, textures, OG images.

## Layer 1 — When to use

Any raster asset requiring photographic or painterly output. Vector output → use `vector-ai` (Recraft) or procedural SVG. 3D → `meshy` or procedural geometry.

## Layer 2 — Cascade order

```
Priority:
  1. flux-mcp (Flux 1.1 Pro Ultra — highest fidelity, painterly + photographic)
  2. flux-mcp (Flux 1.1 Pro Raw — documentary realism)
  3. nano-banana (Gemini 3.1 Flash Image — fast, good iteration)
  4. ideogram-mcp (Ideogram 3 — typography-in-image, stylized)
  5. text-prompt fallback — write prompt to .planning/genorah/image-prompts/ for manual gen
```

### Provider selection rules

| Intent | Preferred provider |
|---|---|
| Hero background, cinematic | Flux 1.1 Ultra |
| Photographic realism | Flux 1.1 Raw |
| Stylized / iterative | nano-banana |
| Text-in-image (poster, OG with typography) | Ideogram 3 |

Override via `--provider` flag on `/gen:assets image`.

### Fallback triggers

- MCP unavailable → next in cascade
- API error (rate limit, 5xx) → next with 1 retry
- Safety block → flag, try alternate provider once, then write prompt file

## Layer 3 — Prompt template

Every image gen goes through a structured template blending DNA + archetype + beat intent:

```
{archetype} {beat-intent} composition.
DNA palette (hex): {primary}, {secondary}, {accent}, {muted}.
Tone: {brand_voice}.
Subject: {subject from command args or asset spec}.
Composition: {layout_pattern from RAG or beat default}.
Aspect ratio: {target}.
Style modifiers: {archetype's style_modifiers from design-archetypes}.
Avoid: {archetype's forbidden_patterns}.
```

Beat intent table:

| Beat | Intent modifier |
|---|---|
| HOOK | dramatic, cinematic, high-contrast |
| TEASE | subtle, intriguing, partial reveal |
| REVEAL | clear, luminous, confident |
| BUILD | layered, rich, informational |
| PEAK | maximum expression, signature |
| BREATHE | atmospheric, muted, spacious |
| TENSION | asymmetric, unresolved |
| PROOF | documentary, evidence |
| PIVOT | transitional, directional |
| CLOSE | reflective, conclusive |

## Layer 4 — Cache + manifest

Cache key: `sha256(prompt + provider + model_version + seed)`. Stored under `.planning/genorah/assets-cache/raster/<key>/`.

Every successful gen:
1. Writes output to `public/assets/raster/<id>.webp` (+ `.avif` when supported)
2. Appends manifest entry per `skills/asset-forge-manifest/SKILL.md`
3. Records source metadata including provider, model version, seed
4. Emits ledger `{kind: "asset-generated", payload: {provider, model, cache_hit}}`

Second run with same prompt = cache hit, zero API cost.

## Layer 5 — ControlNet conditioning (optional)

When Flux MCP exposes ControlNet endpoints:

- `depth` — layout-lock via depth map (from reference image or generated)
- `canny` — edge-lock for architectural / graphic precision
- `pose` — human figure pose-lock for character work

See `skills/controlnet-conditioning/SKILL.md` for patterns.

## Layer 6 — Anti-patterns

- ❌ Calling provider API directly without cache check — cost leak.
- ❌ Text prompt fallback as silent no-op — always surface to user explicitly with prompt file path.
- ❌ Using Ideogram for photorealism — wrong tool; falls out of provider selection.
- ❌ Prompts without DNA palette — color drift; fails asset-forge-dna-compliance.
- ❌ Skipping manifest write on success — breaks audit; asset exists but gate doesn't see it.
