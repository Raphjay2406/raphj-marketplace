---
name: locale-archetype-overrides
description: Per-locale archetype adjustments. Japanese Minimal renders differently in JP (narrower column, vertical text option, CJK typography) vs EN. Cultural color/symbol awareness.
tier: core
triggers: locale-archetype, i18n-archetype, cjk, rtl, cultural-design
version: 0.1.0
---

# Locale Archetype Overrides

Same archetype, different locale → different defaults.

## Layer 1 — Override matrix

| Archetype | Locale | Override |
|---|---|---|
| Japanese Minimal | ja-JP | Noto Serif JP + Noto Sans JP; narrower column (60-65ch → 30-40ja); optional vertical writing-mode |
| Japanese Minimal | en-US | Fraunces + Inter; standard column |
| Editorial | ja-JP | Noto Serif JP; no drop-cap (CJK doesn't use); pull-quote style differs |
| Editorial | ar | Amiri + Noto Sans Arabic; RTL; justify differently |
| Luxury | zh-CN | Noto Serif SC; gold/red cultural affinity; avoid white on funerary pages |
| Neo-Corporate | de-DE | Account for 30% German text expansion (layout reflow) |
| Playful | ja-JP | Avoid overly-kawaii in B2B contexts |
| Dark Academia | any non-Latin | Adjust italicization (no native italic in CJK fonts) |

## Layer 2 — Font-pair matrix per language

```json
{
  "editorial": {
    "en": { "display": "Fraunces", "body": "Inter" },
    "ja": { "display": "Noto Serif JP", "body": "Noto Sans JP" },
    "zh-CN": { "display": "Noto Serif SC", "body": "Noto Sans SC" },
    "zh-TW": { "display": "Noto Serif TC", "body": "Noto Sans TC" },
    "ar": { "display": "Amiri", "body": "Noto Sans Arabic" },
    "he": { "display": "Frank Ruhl Libre", "body": "Rubik" },
    "ru": { "display": "PT Serif", "body": "Inter" },
    "ko": { "display": "Noto Serif KR", "body": "Pretendard" },
    "th": { "display": "Noto Serif Thai", "body": "Noto Sans Thai" }
  }
}
```

Full matrix at `skills/design-archetypes/seeds/archetype-locale-fonts.json`.

## Layer 3 — Cultural a11y

| Culture | Avoid | Prefer |
|---|---|---|
| Japan (funeral/mourning) | White on death-related; chrysanthemum imagery | Neutral warm tones |
| China (unlucky) | 4 (sounds like death); clocks as gifts | 8 (prosperity); red for celebration |
| Middle East (religious) | Pork/alcohol imagery; inappropriate gender depictions | Culturally-neutral lifestyle |
| Global (universal) | Hand gestures: thumbs-up offensive in some regions; OK-sign white-nationalist association | Full-hand palm open |

## Layer 4 — Integration

- `/gen:start-project` Q asks target locales; seeds locale-specific overrides
- Per-archetype + locale lookup in `seeds/archetype-locale-fonts.json`
- Translation pipeline uses archetype voice anchor per locale
- Cultural-a11y-lint (in skills/cultural-a11y) flags concerns at quality-gate

## Layer 5 — Anti-patterns

- ❌ Single archetype "looks" across all locales — visually foreign in target market
- ❌ Machine translation without cultural review
- ❌ Hand-picked Japan image from US stock — obvious to target audience
- ❌ German layout assuming English text length — truncation everywhere
