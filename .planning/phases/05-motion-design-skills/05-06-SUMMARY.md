---
phase: 05-motion-design-skills
plan: 06
subsystem: design-system
tags: [scaffold, design-system, tailwind-v4, typed-utilities, beat-templates, DNA-enforcement, wave-0]
completed: 2026-02-24
duration: 7 min
tasks_completed: 1
tasks_total: 1

dependency_graph:
  requires: [01-02, 01-05, 05-01]
  provides: [design-system-scaffold-skill-v2]
  affects: [08-08]

tech_stack:
  added: []
  patterns: [tailwind-v4-theme-directive, typed-DNA-utilities, beat-template-enforcement, extension-mechanism, CSS-custom-properties-for-JS]

key_files:
  created: []
  modified: [skills/design-system-scaffold/SKILL.md]

decisions:
  - id: 05-06-01
    description: "768 lines exceeds 600-750 target but all content substantive (complete templates for globals.css, tokens.ts, motion.ts, beats.ts, section-wrapper.tsx, extension mechanism, font preloading)"
    confidence: HIGH
  - id: 05-06-02
    description: "Motion custom properties (--motion-*) in :root not @theme -- JS libraries read via getComputedStyle, Tailwind does not need to generate utilities from them"
    confidence: HIGH
  - id: 05-06-03
    description: "Beat templates compacted to 3-line-per-beat format for readability while preserving all 8 constraint fields per beat"
    confidence: HIGH

metrics:
  skill_lines: 768
  v6_lines_replaced: 446
  beat_types_defined: 10
  dna_color_tokens: 12
  anti_patterns: 7
  constraint_parameters: 10
  scaffold_files: 6
---

# Phase 5 Plan 6: Design System Scaffold Summary

Tailwind v4 @theme scaffold with typed TypeScript utilities enforcing DNA tokens, all 10 emotional arc beat templates, and extension mechanism for organic design system growth.

## What Was Done

### Task 1: Rewrite Design System Scaffold SKILL.md

Replaced the v6.1.0 design-system-scaffold skill (446 lines, Tailwind v3 patterns) with a complete 2.0 rewrite (768 lines) using Tailwind v4 CSS-first `@theme` directive and hard token enforcement.

**Core templates generated:**
- **globals.css** -- `@theme` block with `--color-*: initial` reset, 12 DNA color tokens, 8-level type scale, 5-level spacing, 3 easing curves, 6 `--animate-*` presets with `@keyframes`, reduced-motion baseline, `:root --motion-*` properties for JS consumption
- **lib/tokens.ts** -- `DNAColor`, `DNASpacing`, `DNATypeScale`, `DNAFont`, `DNAAnimation` types with utility functions (`bg()`, `text()`, `padding()`, `gap()`, `fontSize()`, `font()`, `animate()`) that produce Tailwind class strings. Arbitrary values cause TypeScript errors
- **lib/motion.ts** -- Motion library (`motion/react`) variants reading DNA timing from CSS custom properties via `getComputedStyle`. Rise, reveal, expand, enterLeft, enterRight variants with DNA-connected stagger
- **lib/beats.ts** -- All 10 emotional arc beat templates with hard constraints (minHeight, maxElements, whitespace, motionPreset, background, scrollBehavior, tensionAllowed, energy)
- **section-wrapper.tsx** -- Beat-aware container with `data-beat`, `data-scroll-behavior`, `data-energy` attributes for CSS scroll-driven animation targeting
- **Extension mechanism** -- `// EXTENDED: reason` comments for builder-proposed tokens, quality reviewer validation

**Key architectural decisions:**
- `--motion-*` in `:root` (not `@theme`) because JS libraries read via getComputedStyle
- `--animate-*` in `@theme` to generate Tailwind `animate-{name}` utility classes
- `--color-*: initial` resets ALL Tailwind default colors -- project owns full palette
- 7 anti-patterns covering v3 config, arbitrary hex, hardcoded spacing, missing beats, system fonts, unconnected motion, undocumented extensions
- 10 machine-readable constraint parameters for automated quality checking

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| # | Decision | Confidence |
|---|----------|-----------|
| 1 | 768 lines exceeds target but all content substantive (6 complete templates + extension docs + 7 anti-patterns) | HIGH |
| 2 | --motion-* in :root not @theme -- JS libraries need getComputedStyle access, Tailwind does not need utilities | HIGH |
| 3 | Beat templates compacted to 3-line format preserving all 8 fields | HIGH |

## Commit Log

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 0bd9eac | feat(05-06): rewrite design-system-scaffold skill with Tailwind v4 hard token enforcement |

## Next Phase Readiness

This is the final plan in Phase 5 (Motion & Design Skills). Phase 5 deliverables:
- 05-01: Cinematic Motion skill (705 lines)
- 05-02: Creative Tension skill
- 05-03: Wow Moment Library skill
- 05-04: Page Transition skill
- 05-05: Performance-Aware Animation skill
- 05-06: Design System Scaffold skill (768 lines) -- THIS PLAN

Phase 5 requires verification before proceeding to Phase 6 (Content & Brainstorming Skills).
