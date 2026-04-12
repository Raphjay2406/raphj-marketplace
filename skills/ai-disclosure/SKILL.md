---
name: ai-disclosure
description: AI content disclosure patterns. Watermark + visible badge for AI-generated assets. Required by CA AB 2013 (US) + EU AI Act transparency rules.
tier: domain
triggers: ai-disclosure, ai-watermark, ai-generated, transparency, ca-ab-2013, eu-ai-act
version: 0.1.0
---

# AI Disclosure

Legal requirement in California (AB 2013, effective 2026) + EU AI Act (Art 50 transparency obligations).

## Layer 1 — What requires disclosure

| AI output | Disclosure required |
|---|---|
| AI-generated hero image | Yes (EU + CA) |
| AI-written blog post | Yes (EU deepfakes, CA if training data disclosure applies) |
| AI chatbot | Yes (must disclose non-human before significant interaction) |
| AI voice clone (actor mimicry) | Yes (explicit, prominent) |
| AI video / deepfake | Yes (watermark + label) |
| AI-generated stock (incidental use) | Best practice |
| AI-assisted writing (minor edit) | Not required, but credit encouraged |

## Layer 2 — Watermark patterns

### Invisible (C2PA)

Content Provenance and Authenticity — embedded metadata tracing origin.

```ts
import { C2PA } from 'c2pa';
const manifest = await c2pa.sign({
  asset,
  claims: {
    'c2pa.actions': [{ action: 'c2pa.created', parameters: { 'c2pa.digitalSourceType': 'trainedAlgorithmicMedia' } }],
  },
});
```

Major AI providers (OpenAI DALL-E 3, Google Imagen, Adobe Firefly) emit C2PA by default. Preserve through pipeline.

### Visible

Small badge on AI-generated images:

```tsx
<figure>
  <img src={aiImage} alt="AI-generated illustration" />
  <figcaption className="text-xs text-muted mt-1 flex items-center gap-1">
    <SparkleIcon className="w-3 h-3" />
    Generated with AI
  </figcaption>
</figure>
```

## Layer 3 — AI chatbot disclosure

First message from AI always identifies:

```
Hi, I'm {brand} AI, a chatbot. I can help with product questions and signup. Want to talk to a human instead? [button]
```

California Senate Bill 1001: bots must disclose upon "significant interaction"; recommend front-load to avoid ambiguity.

## Layer 4 — Training data disclosure (CA AB 2013)

California requires AI model developers to publish summary of training data used, effective 2026. If your site trains an internal AI, publish this on `/ai-training-data` route.

For AI consumers (most Genorah users): not required, but best-practice paragraph in privacy policy.

## Layer 5 — Integration

- Asset-forge manifest tracks `ai_generated: true` + `provider` field
- Rendering pipeline auto-adds visible badge when `ai_generated === true`
- `/gen:legal ai-disclosure` generates privacy-policy paragraph
- Chains with `skills/content-moderation/SKILL.md`

## Layer 6 — Anti-patterns

- ❌ Stripping C2PA metadata in image optimization — regulatory risk
- ❌ AI chatbot that evades disclosure — CA $2500/violation
- ❌ Mimicking real person without consent — deepfake laws (20+ US states)
- ❌ Hiding AI badge behind tooltip — EU considers "clear and prominent" required
