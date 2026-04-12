---
name: 3dsvg-preset-library
tier: domain
description: "75 curated 3dsvg presets (25 archetypes × 3 beats: HOOK/PEAK/CLOSE) with decision tree, override matrix, collision resolution, and motion-health + perf-budget coupling. Consumed by 3d-specialist agent + /gen:hero-mark command. Ships schema.json for AJV validation."
triggers: ["3dsvg preset", "svg extrusion preset", "hero mark preset", "glyph preset", "3d brand moment", "preset-library"]
used_by: ["3d-specialist", "builder", "hero-mark"]
version: "3.4.0"
injection_regex: "/preset.*3dsvg|3dsvg.*preset|hero.*mark.*preset|glyph.*3d.*preset/i"
metadata:
  pathPatterns:
    - "**/*.tsx"
    - "**/HeroMark.tsx"
    - "**/*.json"
---

## Layer 1: Decision Guidance

### Why a Preset Library

Hand-picking material/animation/depth/bevel per section for 25 archetypes × 3 beats is 75 decisions that should be made ONCE and governed, not repeatedly by builders. This library pre-resolves those decisions while respecting archetype mandatory/forbidden rules, preserves field-level override capability where legitimate customization exists, and disables entries where 3D extrusion is architecturally wrong (Pixel-Art).

### When to Use

- Builder encounters a section with `hero_mark.enabled: true` in PLAN.md.
- `/gen:hero-mark` command needs a starting point to open the 3dsvg.design tool with pre-populated settings.
- 3d-specialist agent routing decision for a PEAK beat with archetype constraint.

### When NOT to Use

- Section is NOT a HOOK/PEAK/CLOSE beat — 3dsvg adds no value in BREATHE/PROOF/REVEAL/etc.
- Archetype has disabled preset (Pixel-Art) — use fallback_strategy documented in preset entry.
- User wants a full 3D scene, not a glyph — route to `three-d-webgl-effects` or `spline-integration`.

### Decision Tree

```
hero_mark.enabled in PLAN.md?
├─ yes → lookup (archetype, beat) in 3dsvg-presets.json
│   ├─ found + disabled=true → execute fallback_strategy, skip SVG3D emission
│   ├─ found + enabled       → merge with user-overrides per field_overridable matrix
│   │                          → emit <GenorahSVG3D> wrapper (a11y + RM fallback + SSR gate)
│   │                          → account: motion-health += budget_units, perf-budgets += cost_kb
│   └─ not found             → ERROR: preset missing for (archetype, beat) — report and halt
└─ no → skip; no 3D emitted
```

## Layer 2: Preset Schema

See `schema.json` for strict AJV spec. Key fields per enabled entry:

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Unique `{archetype}_{beat}_{nnn}` — lookup key |
| `archetype` | string | Must match a registered archetype |
| `beat` | enum | HOOK / PEAK / CLOSE |
| `text_template` | string | Placeholder like `{brand_name}`, `{headline}`, `{cta_text}` — substituted at build |
| `material` | enum | One of 10 verified 3dsvg materials (plastic/metal/glass/rubber/chrome/gold/clay/emissive/holographic/default) |
| `animation` | enum | One of 7 verified animations (spin/float/pulse/wobble/swing/spinFloat/none) |
| `depth` | 0.1-2.0 | Extrusion depth — archetype-tuned |
| `bevel` | {thickness, segments} \| null | Null for brutal/minimal archetypes |
| `color_override` | hex \| null | Override default DNA primary color |
| `intro` | {type, duration} | Entry animation (fade/zoom/none) |
| `export_formats` | array | Which exports this preset ships (png-4k, mp4-60fps, webm-60fps, jsx-component) |
| `motion_health_budget_units` | 0-2 | Concurrent-animation budget consumed (for motion-health sub-gate) |
| `live_component_cost_kb` | KB | JS bundle delta when using live `<SVG3D>` (0 for offline export) |
| `offline_export_cost_kb` | KB | Asset bytes when using PNG/MP4 export (0 for live component) |

Disabled entries have `disabled: true` + `fallback_strategy` + `reason`.

## Layer 2: Field-Overridable Matrix

Shared defaults (top of presets JSON) declare what users may override:

```
field_overridable: {
  color_override: true,    // always OK — DNA token swap acceptable
  depth:          false,   // archetype-locked
  material:       false,   // archetype-locked (forbidden-material compliance)
  animation:      false,   // archetype-locked (motion-health budget depends on type)
  text_template:  true,    // always OK — brand content
  bevel:          false    // archetype-locked
}
```

Per-preset overrides can loosen (enable material override for archetypes with 2+ preferred materials like Luxury {gold, chrome, metal}).

Builder enforcement: override request → validate against matrix → if forbidden, reject with specific error:

```
ERROR: hero_mark.material override rejected
  preset: luxury_hook_001 (material=gold, archetype=Luxury)
  requested: clay
  reason: Luxury archetype forbids clay (Luxury.forbidden_materials: [clay, plastic])
  suggest: use gold (default) or chrome or metal (all preferred)
```

## Layer 3: Integration Context

### 3d-specialist agent

Consumes this library as decision input. New section in agent spec: "3dsvg Preset Routing" — see `agents/specialists/3d-specialist.md` v3.4 addendum.

### Builder

At Stage 2 (render validation) for HOOK/PEAK/CLOSE sections with `hero_mark.enabled`:

1. Resolve preset by `(archetype, beat)` lookup.
2. If disabled: emit fallback per `fallback_strategy`; skip SVG3D.
3. Otherwise: merge user-overrides with preset, pass to `<GenorahSVG3D>` wrapper (see accessibility pattern below).
4. Emit accounting hooks: motion-health consumption + perf-budget cost.

### /gen:hero-mark command (v3.4.1)

Opens 3dsvg.design with preset config pre-populated via URL params, waits for user export, commits assets.

### Accessibility wrapper pattern (ship as skill-documented pattern, not vendored code)

Every project that uses 3dsvg in Genorah builds its own `<GenorahSVG3D>` wrapper from this template. Vendor-free = no version pinning burden on the plugin itself.

```tsx
// components/GenorahSVG3D.tsx  (each project copy-pastes this wrapper)
'use client';
import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import type { SVG3DProps } from '3dsvg';

// 3dsvg is NOT SSR-safe — dynamic import with ssr:false is MANDATORY.
const SVG3D = dynamic(() => import('3dsvg').then(m => ({ default: m.SVG3D })), {
  ssr: false,
  loading: () => null,
});

interface GenorahSVG3DProps extends SVG3DProps {
  /** Required: alt-text / aria-label for the 3D glyph */
  ariaLabel: string;
  /** Static fallback shown when reduced-motion preferred (same URL as the offline PNG export) */
  fallbackSrc?: string;
}

export function GenorahSVG3D({ ariaLabel, fallbackSrc, animate, intro, ...rest }: GenorahSVG3DProps) {
  const reducedMotion = useReducedMotion();

  // Reduced motion: prefer static PNG fallback if provided, else emit static SVG3D
  if (reducedMotion) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={ariaLabel} role="img" />;
    }
    return (
      <div role="img" aria-label={ariaLabel}>
        <SVG3D {...rest} animate="none" intro={{ type: 'none', duration: 0 }} />
      </div>
    );
  }

  return (
    <div role="img" aria-label={ariaLabel}>
      <SVG3D {...rest} animate={animate} intro={intro} />
    </div>
  );
}
```

### Usage by builder (emitted TSX pattern)

```tsx
<GenorahSVG3D
  text="ACME"
  ariaLabel="ACME brand mark"
  fallbackSrc="/og/hero-mark-acme.png"
  material="gold"
  animation="float"
  depth={0.5}
  intro={{ type: 'fade', duration: 3.0 }}
/>
```

## Layer 3: Collision Resolution

If user archetype AND preset selection conflict (e.g., user forces `material: clay` on a Luxury preset where clay is in forbidden list):

1. Builder computes collision via forbidden-material lookup.
2. Build fails with explicit error listing conflicting constraints.
3. Suggested resolutions:
   - Use preset default material (respect archetype).
   - Switch to a preset from a compatible archetype (e.g., Warm-Artisan for clay material).
   - Disable hero_mark for this section.
4. User's choice logged in `.planning/genorah/DECISIONS.md`.

## Layer 4: Anti-Patterns

- ❌ **Ignoring disabled entries** — Pixel-Art has disabled preset for architectural reason; silently emitting SVG3D anyway breaks aesthetic.
- ❌ **Overriding archetype-locked fields** — the field_overridable matrix is a safety rail. Disabling it defeats the preset library's governance role.
- ❌ **Stacking multiple live SVG3D per page** — WebGL context limit 8-16 per browser. Genorah caps at 3 total via motion-health + perf-budgets coupling.
- ❌ **Using live `<SVG3D>` in BREATHE sections** — contradicts beat's restraint budget. If brand 3D needed in BREATHE context, use offline PNG export.
- ❌ **Skipping the `<GenorahSVG3D>` wrapper** — exposes users to SSR footguns + missing a11y + API churn risk. Wrapper is mandatory for every project using 3dsvg.
- ❌ **Hand-editing the seed JSON** — use a preset override in PLAN.md instead. Seed JSON changes require schema validation + PR review.
- ❌ **Forgetting SVG input sanitization** — if user-provided SVG path (not brand text) used, must run through `svgo` allowlist first (XXE, recursive `<use>`, `<script>` rejection). See `skills/3dsvg-extrusion/SKILL.md` security section.

## Attribution

`3dsvg` package by renatoworks (MIT). Presets curated by Genorah; decisions grounded in archetype mandatory/forbidden constraints from `skills/design-archetypes/SKILL.md`.
