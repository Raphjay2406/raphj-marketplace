---
name: content-moderation
description: NSFW + safety moderation on AI-generated assets. OpenAI moderation endpoint + ml5.js local model + provider-native safety + human review queue for flagged.
tier: core
triggers: content-moderation, nsfw-detection, safety-filter, moderation-api
version: 0.1.0
---

# Content Moderation

All AI-generated images must pass moderation before landing in `public/`.

## Layer 1 — Pipeline

```
Image generated → 3 moderation layers (fast to strict):
  1. Provider safety filter (Flux/Meshy built-in) — rejects obvious violations
  2. Local NSFWJS check (ml5 model) — fast, cheap, per-asset
  3. OpenAI moderation endpoint — deeper analysis for borderline
  4. Queue for human review if any layer flags
```

## Layer 2 — Local check (NSFWJS)

```ts
import * as nsfwjs from 'nsfwjs';
import { Canvas } from 'canvas';

const model = await nsfwjs.load();

async function checkImage(buffer: Buffer) {
  const img = await loadImage(buffer);
  const predictions = await model.classify(img);
  const nsfw = predictions.find(p => ['Hentai', 'Porn', 'Sexy'].includes(p.className));
  return { flagged: nsfw && nsfw.probability > 0.7, probability: nsfw?.probability ?? 0 };
}
```

## Layer 3 — OpenAI moderation

```ts
const response = await openai.moderations.create({
  input: imageUrl,
  model: 'omni-moderation-latest',
});

const flagged = response.results[0].flagged;
const categories = response.results[0].categories;
// hate, harassment, self-harm, sexual, sexual/minors, violence, violence/graphic, etc.
```

## Layer 4 — Text moderation

Same endpoint works for text:
```ts
const res = await openai.moderations.create({ input: userMessage });
```

For AI-generated copy (blog posts, product descriptions): moderate before ship.

## Layer 5 — Human review queue

Flagged content goes to `.planning/genorah/moderation-queue/`:

```json
{
  "asset_id": "hero-bg-5",
  "ts": "2026-04-12T10:00:00Z",
  "flags": { "sexy": 0.82 },
  "path": "public/assets/raster/hero-bg-5.webp",
  "status": "pending"
}
```

Dashboard moderation tab shows queue; reviewer approves or rejects.

## Layer 6 — Integration

- image-cascade skill adds post-gen moderation step
- asset-forge-dna-compliance extends with moderation check
- Ledger: `content-moderation-flagged`
- error-taxonomy: GENORAH_MCP_NSFW_BLOCK

## Layer 7 — Anti-patterns

- ❌ Shipping flagged content — legal + reputational risk
- ❌ Moderation after asset in `public/` — should be before
- ❌ Single-layer moderation — false negatives; defense in depth
- ❌ No human review for borderline — automatic reject may be wrong
