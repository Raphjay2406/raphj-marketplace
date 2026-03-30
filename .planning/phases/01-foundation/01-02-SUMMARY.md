---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [design-dna, color-tokens, typography, spacing, motion, tailwind-v4, css-variables]

# Dependency graph
requires:
  - phase: 01-foundation-01
    provides: Skill template (4-layer format), plugin skeleton, CLAUDE.md
provides:
  - Complete Design DNA skill defining 12 color tokens, 8-level type scale, 5-level spacing, signature element, 8 motion tokens
  - Full DESIGN-DNA.md template for agent generation in target projects
  - Tailwind v4 @theme integration mapping DNA tokens to utility classes
  - Machine-readable validation checklist (12 checks)
affects: [01-foundation-03 (archetypes reference DNA tokens), 01-foundation-04 (anti-slop gates DNA compliance), 01-foundation-05 (emotional arc template in DNA), 02-pipeline (builders consume DNA), 05-design-system (scaffold generates from DNA)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DNA tokens as CSS custom properties in @theme namespace for colors/fonts"
    - "Motion tokens as :root CSS properties (not @theme) for JS library consumption"
    - "Signature element as machine-readable name: param=value format"
    - "All type scale sizes use clamp() for fluid responsive scaling"

key-files:
  created: []
  modified:
    - skills/design-dna/SKILL.md

key-decisions:
  - "12 color tokens split 8 semantic + 4 expressive -- expressive tokens (glow, tension, highlight, signature) encode creative intent beyond functional roles"
  - "Motion tokens use :root CSS custom properties, NOT @theme -- consumed by GSAP/motion-react, not Tailwind utilities"
  - "@theme block includes --color-*: initial to reset Tailwind defaults -- project owns full palette"
  - "Signature element format: name: param=value -- machine-parseable, enforceable by anti-slop gate"

patterns-established:
  - "DNA template: structured markdown with tables for every component (colors, type, spacing, motion, forbidden, tension, arc)"
  - "Validation checklist: numbered checks with HARD/SOFT enforcement levels"
  - "Integration mapping: explicit code examples showing DNA -> Tailwind -> Builder -> Output pipeline"

# Metrics
duration: 3min
completed: 2026-02-24
---

# Phase 1 Plan 2: Design DNA Skill Summary

**Machine-enforceable Design DNA skill with 12 color tokens, Tailwind v4 @theme mapping, 8-level clamp() type scale, 8 motion tokens as CSS custom properties, and copy-paste-ready DESIGN-DNA.md template**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-24T03:33:40Z
- **Completed:** 2026-02-24T03:36:32Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Complete 2.0 rewrite of design-dna SKILL.md (477 lines, up from 306) in the 4-layer format
- Full DESIGN-DNA.md template that agents can fill in with archetype-specific values -- includes color system, typography, spacing, signature element, motion language, forbidden patterns, tension plan, and emotional arc
- Tailwind v4 integration with exact `@theme` block showing `--color-*: initial` reset and all 12 tokens mapped to utility classes
- Machine-readable constraints table and 12-point validation checklist with HARD/SOFT enforcement

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Design DNA SKILL.md (4-layer format)** - `14cd7fc` (feat)

## Files Created/Modified

- `skills/design-dna/SKILL.md` - Complete Design DNA skill with 4 layers: decision guidance (when/how to generate DNA), award-winning examples (full template + reference sites), integration context (DNA connections to archetypes, builders, gate, Tailwind, motion libs), and anti-patterns (6 common mistakes)

## Decisions Made

- **12 color tokens (8+4 split):** 8 semantic tokens (bg, surface, text, border, primary, secondary, accent, muted) for functional roles + 4 expressive tokens (glow, tension, highlight, signature) for creative intent. The expressive tokens are what differentiate Genorah's palette from generic design token systems.
- **Motion tokens outside @theme:** Motion tokens are CSS custom properties in `:root {}`, not in `@theme {}`, because they are consumed by JS animation libraries (GSAP, motion/react), not by Tailwind utility generation.
- **@theme palette reset:** `--color-*: initial` in `@theme` block resets all Tailwind default colors. The project owns its complete palette through DNA -- no Tailwind defaults leak through.
- **Signature element format:** `name: param=value, param=value` is machine-readable. The `name` is a lookup key, parameters are individually enforceable. This replaces the v6.1.0 prose description format.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Design DNA skill is complete and ready for downstream skills to reference
- Archetypes skill (01-03) will define the locked palettes/fonts/signatures that populate DNA templates
- Anti-slop gate skill (01-04) will define scoring criteria that verify DNA compliance
- Emotional arc skill (01-05) will define beat constraints referenced by DNA arc template
- All integration touchpoints are documented in Layer 3, ready for cross-referencing

---
*Phase: 01-foundation*
*Completed: 2026-02-24*
