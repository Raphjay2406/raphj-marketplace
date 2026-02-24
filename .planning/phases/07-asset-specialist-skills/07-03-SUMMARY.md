---
phase: 07-asset-specialist-skills
plan: 03
subsystem: asset-specialists
tags: [component-marketplace, aceternity-ui, magic-ui, 21st-dev, framer-marketplace, restyling-protocol, dna-token-integration, marketplace-cap]

dependency_graph:
  requires: [01-02, 01-03, 01-04, 05-01]
  provides: [component-marketplace-skill, restyling-protocol, archetype-beat-category-matrix, marketplace-audit-checklist]
  affects: [08-08]

tech_stack:
  added: []
  patterns: [4-step-restyling-protocol, category-level-recommendations, 30-percent-marketplace-cap, archetype-x-beat-matrix]

file_tracking:
  key_files:
    created:
      - skills/component-marketplace/SKILL.md
    modified: []

decisions:
  - id: "07-03-01"
    decision: "362 lines within 350-500 target -- all content substantive (19 archetypes across 10 beats in 4 tables, full restyling protocol with code examples)"
    rationale: "Category matrix requires comprehensive coverage for all archetypes; grouped into 4 tables by intensity tier for readability"
    confidence: HIGH
  - id: "07-03-02"
    decision: "Archetype x beat matrix split into 4 intensity-tier tables (high, medium, low, remaining) instead of one massive table"
    rationale: "A single 19-column table is unreadable in markdown; grouping by intensity tier keeps tables manageable and aids builder lookup"
    confidence: HIGH
  - id: "07-03-03"
    decision: "8 machine-readable constraints (6 HARD, 2 SOFT) for automated marketplace usage enforcement"
    rationale: "HARD constraints on cap, restyling completeness, and import paths prevent the most damaging anti-patterns; SOFT constraints on per-page count guide without blocking"
    confidence: HIGH

metrics:
  duration: "4 min"
  completed: "2026-02-24"
---

# Phase 7 Plan 03: Component Marketplace Skill Summary

**One-liner:** Category-level marketplace component guidance for Aceternity UI, Magic UI, 21st.dev, and Framer marketplace with full 19-archetype x 10-beat matrix, 4-step DNA restyling protocol, 30% hard cap, and 10-point audit checklist.

## What Was Done

### Task 1: Write Component Marketplace SKILL.md (4-layer format)
**Commit:** `8a99d49`

Created `skills/component-marketplace/SKILL.md` (362 lines) -- a domain-tier skill providing category-level marketplace component sourcing and restyling guidance.

**Key content delivered:**

- **Layer 1: Decision Guidance** -- When to use marketplace components (animated interactions, complex micro-interactions) vs. when to build custom (simple layouts, brand moments, tension). Marketplace profiles for all 4 platforms with technology, strengths, and installation methods. Category-to-marketplace mapping (10 categories). Import path warning for deprecated `framer-motion` -> `motion/react`. Framer marketplace explicitly documented as design reference only (not directly portable to Next.js/Astro).

- **Layer 2: Award-Winning Examples** -- Full archetype x beat category matrix covering all 19 archetypes across 10 beat types, organized into 4 intensity-tier tables (high, medium, low, remaining). All entries are category descriptions (animated grid, scroll reveal), never specific component names. 4-step restyling protocol with copy-paste code examples: (1) Token Mapping -- replace all hardcoded colors with DNA tokens, (2) Structural Modifications -- adjust layout for archetype personality, (3) Animation Restyling -- match DNA motion tokens, (4) Archetype-Specific Customization -- 10 archetypes with specific customization instructions. 21st.dev `npx shadcn add` installation pattern. 10-point marketplace usage audit checklist.

- **Layer 3: Integration Context** -- DNA token connection table (12 tokens mapped to marketplace restyling usage). 7 related skills mapped (design-dna, design-archetypes, cinematic-motion, anti-slop-gate, creative-tension, emotional-arc, performance-animation). Pipeline stage documented.

- **Layer 4: Anti-Patterns** -- 6 anti-patterns: Unstyled Marketplace Drop-In, Marketplace-Heavy Pages, Specific Component Lock-In, Deprecated Framer Motion Imports, Framer Marketplace Direct Use, Skipping the Audit.

- **Machine-Readable Constraints** -- 8 parameters (6 HARD, 2 SOFT) for automated enforcement of marketplace usage limits, restyling completeness, and import path compliance.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | 362 lines within 350-500 target | All content substantive -- 19 archetypes need comprehensive matrix coverage |
| 2 | Matrix split into 4 intensity-tier tables | Single 19-column table unreadable; grouping by intensity tier aids lookup |
| 3 | 8 machine-readable constraints (6 HARD, 2 SOFT) | HARD on cap/restyling/imports prevents most damaging patterns; SOFT on per-page count guides without blocking |

## Verification Results

| Check | Result |
|-------|--------|
| File exists, 350+ lines | PASS -- 362 lines |
| YAML frontmatter with tier: domain, version: "2.0.0" | PASS |
| All 4 layer headings present | PASS |
| All 4 marketplaces documented | PASS -- Aceternity, Magic UI, 21st.dev, Framer |
| Framer as reference/inspiration only | PASS -- 5 explicit references |
| Category matrix covering multiple archetypes | PASS -- all 19 archetypes across 10 beats |
| Full 4-step restyling protocol | PASS -- Token Mapping, Structural, Animation, Archetype |
| 30% hard cap documented | PASS -- 5 references including constraint table |
| motion/react import guidance | PASS -- 9 references with before/after examples |
| npx shadcn add installation pattern | PASS -- 2 references with command example |
| Marketplace usage audit checklist | PASS -- 10-point checklist |
| No specific component names as recommendations | PASS -- names only in anti-pattern example |
| hsl(var(--color-*)) DNA token patterns | PASS -- 3 code examples with DNA tokens |
| HOOK/PEAK beat-appropriate categories | PASS -- all beats covered in matrix |

## Commits

| Hash | Message |
|------|---------|
| 8a99d49 | feat(07-03): write component marketplace skill with restyling protocol and archetype x beat matrix |

## Next Phase Readiness

Plan 07-03 completes the component marketplace skill. This is the 3rd of 6 plans in Phase 7. The remaining plans cover shape generation (07-01), 3D/WebGL effects (07-02), and image prompt generation (07-06). Plans 07-04 (Remotion) and 07-05 (Spline) are already complete.
