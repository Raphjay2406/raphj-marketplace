---
name: lpips-similarity
description: LPIPS (Learned Perceptual Image Patch Similarity) for visual diff beyond SSIM. More human-aligned. pHash for coarse pre-filter; LPIPS for precise.
tier: domain
triggers: lpips, perceptual-similarity, phash, image-diff
version: 0.1.0
---

# LPIPS Similarity

SSIM catches some differences but misses perceptual ones (AI-generated hallucinations, subtle style drift). LPIPS better matches human judgment of "different."

## Layer 1 — Pipeline

```
Stage 1: pHash (perceptual hash) — O(1), < 1ms per comparison
   Use: near-dup detection (>0.85 similarity)
Stage 2: SSIM — existing, catches structural
   Use: layout parity
Stage 3: LPIPS — slower, human-aligned
   Use: final quality comparison vs reference
```

## Layer 2 — pHash

```ts
import imghash from 'imghash';
const hashA = await imghash.hash('a.webp');
const hashB = await imghash.hash('b.webp');
const hamming = [...hashA].filter((c, i) => c !== hashB[i]).length;
const similarity = 1 - hamming / hashA.length;
```

## Layer 3 — LPIPS

Via Python subprocess or WASM port:

```ts
const { spawnSync } = require('child_process');
const result = spawnSync('python', ['scripts/lpips_compare.py', img1, img2], { encoding: 'utf8' });
const score = parseFloat(result.stdout);
// 0 = identical; 1 = maximally different. <0.1 is perceptually similar.
```

```python
# scripts/lpips_compare.py
import lpips
import torch
from PIL import Image
import sys

model = lpips.LPIPS(net='alex')
img1 = lpips.im2tensor(lpips.load_image(sys.argv[1]))
img2 = lpips.im2tensor(lpips.load_image(sys.argv[2]))
print(model.forward(img1, img2).item())
```

## Layer 4 — Integration

- Extends reference-diff-protocol with LPIPS as final check
- Pareto-selector's O4 (reference_ssim) becomes `reference_perceptual` using LPIPS
- Visual regression uses LPIPS for borderline diffs

## Layer 5 — Anti-patterns

- ❌ LPIPS on every check — expensive; use pHash/SSIM as pre-filter
- ❌ No Python fallback — LPIPS alone requires torch; pHash pure-JS
- ❌ Treating LPIPS 0.05 as "similar" when prompt expects identical — use pHash for identity
