---
name: archetype-mixing
description: Formal protocol for mixing archetypes — primary 60% + secondary 30% + tension 10%. Compatibility matrix, conflict detection, weighted specificity scoring.
tier: core
triggers: archetype-mixing, primary-secondary, tension-archetype, hybrid-design
version: 0.1.0
---

# Archetype Mixing

Most projects use a single archetype. Some need two. Very rarely three. v3.14 formalizes when and how.

## Layer 1 — When to mix

- Content spans categories (tech + literary, finance + artisan, playful + educational)
- Multi-audience sites (investor vs customer views)
- Brand repositioning (evolving from X to Y; show both)
- Product with dual nature (calm onboarding + intense dashboard)

## Layer 2 — Weights

```yaml
archetype:
  primary: editorial       # 60% of sections lean here
  secondary: cyberpunk-hud # 30% of sections use this voice
  tension: vaporwave       # 10% — signature HOOK/PEAK only
```

## Layer 3 — Section assignment

Not every section uses primary. PLAN.md per-section:

```yaml
sections:
  - id: hero
    beat: HOOK
    archetype_voice: tension   # vaporwave expressive moment
  - id: features
    beat: BUILD
    archetype_voice: primary    # editorial long-form
  - id: dashboard-preview
    beat: PEAK
    archetype_voice: secondary  # cyberpunk-HUD for tech demo
  - id: testimonials
    beat: PROOF
    archetype_voice: primary
  - id: close
    beat: CLOSE
    archetype_voice: primary
```

Primary voice dominates; secondary punctuates; tension only at signature moments.

## Layer 4 — Quality-gate scoring

Archetype-specificity hard gate weighted:
- Sections marked `primary` → tested against primary markers strictly
- Sections marked `secondary` → tested against secondary markers strictly
- Sections marked `tension` → permitted even if they break primary (purpose of tension)

Overall archetype_fit objective:

```
archetype_fit = 0.6 × specificity(primary) + 0.3 × specificity(secondary) + 0.1 × tension_legitimate
```

## Layer 5 — Conflict detection

On DNA lock, check pair against compatibility matrix:

```json
{
  "editorial": {
    "compatible": ["cyberpunk-hud", "dark-academia", "luxury", "warm-artisan"],
    "tense": ["brutalist", "vaporwave"],
    "impossible": ["pixel-art", "y2k"]
  },
  "luxury": {
    "compatible": ["editorial", "dark-academia", "japanese-minimal"],
    "tense": ["data-dense"],
    "impossible": ["playful", "vaporwave", "y2k", "gaming-ui"]
  },
  ...
}
```

BLOCK on impossible pair. WARN on tense pair with rationale requirement.

## Layer 6 — Integration

- `/gen:start-project` Q for primary + (optional) secondary archetype
- DESIGN-DNA.md extended with archetype block
- Pareto tiebreaker weighted across primary + secondary
- Testable-markers grep against section's assigned voice

## Layer 7 — Anti-patterns

- ❌ Three equal archetypes — no dominant voice, incoherent
- ❌ Secondary voice in >50% of sections — it's the new primary; demote primary
- ❌ Impossible pair shipped via tension-override — defeats conflict detection
- ❌ Skipping per-section archetype_voice assignment — all sections score poorly on specificity
