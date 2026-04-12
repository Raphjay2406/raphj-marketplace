---
name: translation-pipeline
description: Automated translation with staged human-review gate. DeepL for major locales + Claude for brand voice nuance + TM reuse. Never auto-ship AI translation.
tier: domain
triggers: translation-pipeline, deepl, i18n-flow, l10n, translation-review
version: 0.1.0
---

# Translation Pipeline

AI draft → TM reuse → human review → ship. Never skip review.

## Layer 1 — Flow

```
1. Extract strings — locale-aware key extraction from source (next-intl, paraglide, vue-i18n, i18next)
2. TM lookup — existing translation? 100% match = reuse, 70-95% = suggest-to-reviewer
3. AI draft (only for net-new or <70% TM) — DeepL (accuracy) OR Claude (voice nuance)
4. Write to staging — locale-specific files in `messages/staging/<locale>.json`
5. Review gate — human must approve each string; UI in /gen:i18n review
6. Promote — staging → production; TM record updated with quality score
```

## Layer 2 — Provider matrix

| Provider | Best for | Cost |
|---|---|---|
| DeepL API | EU locales (DE/FR/ES/IT/NL/PL); highly accurate | $5.49/mo free + $25/M chars |
| Claude | Brand-voice-dependent copy; archetype-aware | tokens |
| Google Translate | Fallback; broad locale coverage | $20/M chars |
| Human translator | Legal/medical/regulated domains | highest |

## Layer 3 — Brand voice binding

Translation prompts include DNA voice anchor:

```
You are translating for {brand} — a {archetype} {domain} company.
Target locale: {locale}.
Tone anchors: {anchors from DESIGN-DNA.md}.
Avoid: {forbidden vocabulary per archetype}.
Preserve: proper nouns, numbers, placeholders {like_this}.

Source ({source_locale}): "{text}"

Translate ({target_locale}):
```

## Layer 4 — Review UI

`/gen:i18n review` opens localhost review panel:

```
Key: hero.headline
Source (en): "Brew your best cup ever."
Draft (de): "Brühen Sie Ihre beste Tasse überhaupt."
TM match: none
Reviewer: [approve] [edit] [reject]
Notes: [text area]
```

Reviewer can approve/edit/reject; approved strings land in production + TM.

## Layer 5 — Extraction per framework

- **Next.js + next-intl**: `messages/en.json` → `messages/{locale}.json`
- **Nuxt i18n**: `locales/en.json` → `locales/{locale}.json`
- **SvelteKit + paraglide**: `messages/{locale}/...`
- **Astro i18n**: `src/locales/{locale}/...`

## Layer 6 — Integration

- `/gen:i18n extract` pulls strings
- `/gen:i18n translate --locale de` runs AI draft with TM
- `/gen:i18n review --locale de` opens review UI
- `/gen:i18n promote --locale de` publishes approved strings
- Env: `DEEPL_API_KEY`, `ANTHROPIC_API_KEY` (via Gateway)
- Ledger: `translation-drafted`, `translation-reviewed`, `translation-promoted`

## Layer 7 — Anti-patterns

- ❌ Auto-ship without review — terms-of-service translated wrong = legal exposure
- ❌ Single AI pass for legal/medical — use certified human translator
- ❌ Ignoring text expansion — German 30% longer; plan layouts
- ❌ Lost placeholders in translation — regex check pre-promote
