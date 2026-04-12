---
name: recraft-vector-ai
description: Native SVG output via Recraft V3 (or Adobe Firefly vectors). Produces logo variants, icon sets, illustrations directly as editable SVG — bypasses raster→vectorize pipeline.
tier: domain
triggers: recraft, vector-ai, svg-gen, native-svg, firefly, logo-variant, editable-svg
version: 0.1.0-provisional
---

# Recraft Vector AI

Native-SVG generation. Recraft V3 outputs editable vectors; no raster-to-vectorize step. Fallback to parametric SVG generators when `recraft-mcp` unavailable.

## Layer 1 — When to use

- Logo variants (monochrome, horizontal, stacked, mark-only)
- Icon sets (consistent stroke weight across many glyphs)
- Simple illustrations for onboarding, empty states, error states
- Brand-kit assets where future edits are expected

NOT for: photographic or painterly output (→ `image-cascade`), complex scenes (→ 3D pipeline).

## Layer 2 — Flow

### Path 1: recraft-mcp (preferred)

```
recraft.generate({
  prompt: "{archetype-styled logo prompt}",
  style: "vector-illustration" | "logo" | "icon",
  substyle: "{archetype-mapped}",
  color_palette: [{dna-colors}],
  controls: { transparent_background: true, ... }
})
→ SVG string
```

### Path 2: Firefly vectors (fallback)

If `firefly-mcp` instead: similar API; different style enum.

### Path 3: Parametric generator + AI refinement

If neither MCP available:
1. Start with `scripts/asset-forge/svg-parametric.mjs` output
2. Optionally refine via nano-banana → raster → AI vectorize via vectorizer.ai library locally
3. Lower quality but offline-safe

## Layer 3 — Archetype → Recraft substyle mapping

| Archetype | Recraft substyle |
|---|---|
| Brutalist | `bold-geometric` |
| Ethereal | `airy-soft` |
| Editorial | `elegant-line` |
| Kinetic | `dynamic-shapes` |
| Neo-Corporate | `clean-modern` |
| Playful | `playful-hand` |
| Data-Dense | `technical-diagram` |
| Cyberpunk-HUD | `neon-outline` |
| Vaporwave | `retro-80s` |
| (full map in seeds/recraft-substyle-map.json) | |

## Layer 4 — SVG post-processing

All Recraft output passes through:
1. svgo with allowlist from `skills/3dsvg-extrusion` sanitization patterns
2. DNA color binding: replace hex literals with CSS vars (`var(--color-primary)` etc.)
3. Dimension normalization: explicit width/height + viewBox
4. Structural validation: max nesting depth 10, no scripts, no external refs
5. Manifest entry written

## Layer 5 — Integration

### Brandkit

`/gen:brandkit export` uses recraft-vector-ai for logo variants when requested. Falls back to `scripts/asset-forge/svg-parametric.mjs` when Recraft absent.

### Icon system

`/gen:assets 2d icon-set` emits a coherent icon family (24/48/96 sizes × outline/solid/duotone variants) via one Recraft session with consistent style + prompt scaffold.

## Layer 6 — Anti-patterns

- ❌ Accepting Recraft SVG without svgo post-process — ships security surface.
- ❌ Different substyle across logo matrix — visual incoherence.
- ❌ Raster vectorizers (potrace) used when Recraft available — lower fidelity.
- ❌ Hex literals surviving post-process — breaks DNA coverage sub-gate.
- ❌ Icons with inconsistent stroke weight — icon-system failure.
