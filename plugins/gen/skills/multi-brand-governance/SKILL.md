---
name: "multi-brand-governance"
description: "One parent Design DNA → N sub-brand overlays with inheritance, override rules, and per-sub-brand drift detection. For platforms, agencies, and holding-company portfolios."
tier: "domain"
triggers: "multi brand, sub brand, brand overlay, multi tenant brand, brand inheritance, brand family"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Parent brand has ≥2 child brands sharing primitives (type scale, spacing, motion) but diverging on color/voice/archetype.
- Multi-tenant SaaS with tenant-specific theming.
- Agency managing 5+ client sites off a shared component library.

### When NOT to Use

- Single brand with dark/light modes — that's mode variation, not sub-brand.
- Unrelated brands — each deserves its own DNA.

## Layer 2: Structure

```
brands/
  parent/
    DESIGN-DNA.md        # canonical base
    testable-markers.json
  sub-brand-a/
    OVERLAY.md           # overrides color/voice; inherits rest
    DRIFT-POLICY.md      # which tokens may differ, which may not
  sub-brand-b/
    OVERLAY.md
    DRIFT-POLICY.md
```

OVERLAY.md allowed fields: `colors.*`, `voice.*`, `archetype.secondary`, `signature-element`. Everything else inherits.

## Layer 3: Integration Context

- Sub-brand build: `/gen:build --brand=sub-brand-a` merges parent + overlay before DNA strict check.
- Drift gate runs per-brand: a sub-brand failing its `DRIFT-POLICY.md` blocks ship.
- Registry: `scripts/multi-brand-registry.mjs` lists all brands + last drift timestamp.
- Archetype mixing (v3.14) applies per-brand: parent archetype = primary, sub-brand archetype = secondary.

## Layer 4: Anti-Patterns

- Overlays that fork primitives (type scale, spacing) — destroys family coherence.
- No drift policy — sub-brands silently diverge until nothing shared remains.
- Duplicating full DNA per brand — defeats inheritance; maintenance explodes.
