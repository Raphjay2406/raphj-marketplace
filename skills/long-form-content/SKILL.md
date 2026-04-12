---
name: long-form-content
description: Blog post / case study / whitepaper generation with brand voice binding + archetype-band reading grade + cognitive-load gate compliance + inline image generation + SEO meta + related-content links.
tier: domain
triggers: long-form, blog-post, case-study, article, whitepaper, mdx
version: 0.1.0
---

# Long-Form Content

Produces MDX with enforced quality — not just AI draft.

## Layer 1 — When to use

- Blog posts
- Case studies
- Whitepapers
- Documentation pages
- Product changelogs (with voice)

## Layer 2 — Input brief

```yaml
topic: "How we reduced coffee waste by 40% via subscription prediction"
audience: "specialty coffee roasters, founders, ops managers"
length: 1800  # words
voice_anchor: "Editorial archetype — literary, evidence-driven"
goals:
  - demonstrate technical depth
  - drive demo signup
references:
  - https://example-roaster-case.com
seo_primary_keyword: "coffee subscription prediction"
```

## Layer 3 — Generation pipeline

1. **Outline**: generate H2/H3 structure respecting cognitive-load-gate C4 (strict nesting)
2. **Draft paragraphs**: section by section, constrained by reading-grade band (Editorial 10–14, Playful 6–9, Data-Dense 10–12)
3. **Drop in examples**: use brand/project domain vocabulary from brand-voice-extraction
4. **Inline images**: 1 image per ~600 words; generated via image-cascade with archetype+beat modulation
5. **Pull quotes**: identify 2–3 high-impact sentences; format as `<blockquote>` (Editorial) or signature-styled inserts (archetype-specific)
6. **Drop-cap** on first paragraph if archetype is Editorial/Dark Academia/Luxury
7. **SEO**: title (50–60 chars), description (150–160 chars), canonical, og image
8. **Related content**: link 3 related posts from existing site via embedding search
9. **Internal links**: 3–5 internal links within body
10. **Schema.org**: Article + BreadcrumbList + Author JSON-LD

## Layer 4 — Voice binding

Reads `DESIGN-DNA.md` + brand voice anchors. Archetype modulations:

| Archetype | Voice signature |
|---|---|
| Editorial | Literary, full sentences, semicolons, one-thought-per-paragraph, drop-cap + pull quote |
| Neo-Corporate | Clear, scannable, bullet-rich, H3 every 300 words |
| Playful | Conversational, contractions, one-word sentences for emphasis, emoji sparingly |
| Luxury | Restrained, declarative, no superlatives, never exclamation |
| Data-Dense | Precise, numeric, tabular when possible, citations inline |
| Dark Academia | Archaic framing, italicized Latin phrases appropriately, footnotes |

Forbidden vocabulary per archetype (from anti-vanity-check):
- Luxury: "amazing", "awesome", "game-changer"
- Neo-Corporate: "synergy", "leverage" (as verb), "utilize"
- Playful: None specifically — but avoid corporate-speak

## Layer 5 — MDX output format

```mdx
---
title: "{seo title}"
description: "{seo description}"
publishedAt: "2026-04-12"
author: "Raphjay"
tags: ["coffee", "subscription", "ops"]
ogImage: "/assets/raster/og/coffee-prediction.webp"
---

import { Callout, PullQuote, Figure } from '@/components/mdx';

<Figure src="/assets/raster/coffee-prediction-hero.webp" alt="{alt}" caption="{caption}" />

{First-para with drop-cap via ::first-letter CSS}

## H2 heading

{body}

<PullQuote>
  {high-impact sentence}
</PullQuote>

## Conclusion CTA

<Callout variant="primary">
  Ready to try {product}? [Start your trial]({cta-url})
</Callout>
```

## Layer 6 — Quality checks

- Reading grade in band: Flesch-Kincaid ≤ archetype_max
- Heading hierarchy strict (no h2→h4 skip)
- Image alt text present on every image
- Internal link count ≥ 3
- SEO meta complete
- No anti-vanity-check hits
- Word count within ±10% of target

Failures block MDX file write; user shown issues + fix proposals.

## Layer 7 — Integration

- Feeds `db-schema-from-content` Post model
- Sitemap + RSS auto-updated on new post
- Search index (semantic-index or Algolia) gets new entry
- Ledger: `content-generated`
- Cost: tokens per post tracked

## Layer 8 — Anti-patterns

- ❌ Accepting reading grade outside band — content that doesn't fit archetype voice
- ❌ Missing alt text — a11y regression + SEO miss
- ❌ One big block quote per paragraph — defeats Editorial restraint
- ❌ AI-generated fluff ("In today's fast-paced world...") — catch with anti-vanity-check
- ❌ Missing pull quotes on Editorial — archetype-specificity warning
