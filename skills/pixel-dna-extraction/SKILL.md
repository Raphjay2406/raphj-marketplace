---
name: "pixel-dna-extraction"
description: "Pixel-path DNA extraction from breakpoint screenshots. PNG sampling + k-means (k=12) with perceptual distance, role-based semantic slot assignment (bg/text/surface/border/primary/secondary/accent/muted/glow/tension/highlight/signature)."
tier: "domain"
triggers: "pixel kmeans, color extraction from screenshot, pixel dna, image to palette, pixel extraction"
version: "3.22.0"
---

## Layer 1: Decision Guidance

### When to Use

- URL ingestion mode where CSS variables are insufficient (framework baked, no theme file available).
- CSS-var path returned too many gaps.
- Want runtime-accurate palette (what users actually see).

### When NOT to Use

- CSS variables already populated 12 slots at high confidence — skip pixel pass.
- Mobile-only ingestion with a single breakpoint — palette will be biased; require ≥2 breakpoints.

## Layer 2: Algorithm

1. Walk `screenshots/<route>/<breakpoint>.png` files.
2. Sample every 10th pixel (1% sampling) → ~100k-500k samples per mid-size site.
3. K-means (k=12) with perceptual distance weighted by rMean (fast; full ΔE2000 deferred).
4. Assign semantic slots by role:
   - `bg` = most frequent cluster.
   - `text` = cluster with opposite luminance extreme.
   - `surface` / `border` = next most frequent.
   - `primary` / `secondary` / `accent` = top-3 most chromatic (max saturation).
   - `muted` = median luminance.
   - `glow` / `tension` / `highlight` / `signature` = remaining chromatic clusters (user refines).
5. Confidence per slot = `min(0.95, 0.5 + coverage × 5)` — low-coverage slots pair with `gap:dna-low-confidence`.

## Layer 3: Integration Context

- Depends on `crawl-executor` having produced screenshots under `screenshots/<route>/<bp>.png`.
- Peer dependency: `pngjs` (declared optional; emits `gap:pngjs-unavailable` if absent).
- Overrides prior `DNA-EXTRACTED.md` — prior css-var extraction may coexist and user picks best per slot.
- Feeds `archetype-inference` same as CSS-var path.

## Layer 4: Anti-Patterns

- K-means with RGB Euclidean distance — skip colors that are perceptually distinct but numerically close; use weighted distance (rMean-aware) minimum.
- Single-breakpoint extraction — biases toward whichever viewport happened to be captured; always ≥2.
- Sampling every pixel — wasteful; stride 10 is plenty for palette work.
- Assigning slots purely by frequency — text must differ from bg in luminance; frequency alone gets surface/border roles wrong.
