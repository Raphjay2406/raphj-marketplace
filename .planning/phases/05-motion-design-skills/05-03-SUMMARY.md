---
phase: 05-motion-design-skills
plan: 03
subsystem: wow-moments
tags: [wow-moments, interaction-design, cursor-effects, scroll-animation, ambient-effects, tiered-code, auto-suggestion, rive, dotlottie, webgl]
completed: 2026-02-24
duration: 9 min
tasks_completed: 1
tasks_total: 1

dependency_graph:
  requires: [01-02, 01-03, 01-05, 05-01]
  provides: [wow-moments-skill-v2]
  affects: [05-06, 08-08]

tech_stack:
  added: []
  patterns: [tiered-code-specificity, three-factor-auto-suggestion, archetype-intensity-modifier, css-scroll-driven-parallax]

key_files:
  created: []
  modified: [skills/wow-moments/SKILL.md]

decisions:
  - id: 05-03-01
    description: "35 patterns across 4 categories (8 cursor, 10 scroll, 7 interactive, 10 ambient) exceeds 33+ target"
    confidence: HIGH
  - id: 05-03-02
    description: "File at 1417 lines exceeds 800-950 target -- all content substantive (35 patterns with code), no filler to cut"
    confidence: MEDIUM
  - id: 05-03-03
    description: "Archetype intensity table deduplicated -- full table in Layer 1, compact summary in Auto-Suggestion Matrix section"
    confidence: HIGH
  - id: 05-03-04
    description: "Tier 3 patterns (WebGL, Rive, dotLottie, Physics) use setup skeletons not full implementations -- keeps guidance focused"
    confidence: HIGH

metrics:
  skill_lines: 1417
  total_patterns: 35
  tier_1_patterns: 18
  tier_2_patterns: 10
  tier_3_patterns: 7
  constraint_parameters: 10
  archetypes_covered: 19
  reduced_motion_docs: 35
---

# Phase 5 Plan 3: Wow Moment Library Summary

**One-liner:** 35 signature interaction patterns in 4 categories with three-tier code specificity, three-factor auto-suggestion matrix (archetype x beat x content), and complete reduced-motion fallback documentation.

## What Was Done

### Task 1: Rewrite Wow Moments SKILL.md (4-layer format with tiered patterns)

Replaced the v6.1.0 wow-moments skill (561 lines, 30 patterns with inconsistent code depth) with a comprehensive 2.0 rewrite featuring:

**Layer 1 -- Decision Guidance:**
- Beat-based rules for when to add wow moments (PEAK always, BREATHE ambient-only, etc.)
- 19-archetype intensity modifier table with max wow/page, preferred categories, and avoid categories
- Tier system explanation (Tier 1 copy-paste, Tier 2 pattern+setup, Tier 3 guidance+reference)
- Reduced motion requirement documented as a hard rule

**Layer 2 -- 35 Patterns in 4 Categories:**
- Category 1: Cursor-Responsive (8 patterns, all Tier 1): Magnetic button, custom cursor, spotlight card, tilt card, text distortion, cursor trail, hover reveal, repulsion grid
- Category 2: Scroll-Responsive (10 patterns, 6 Tier 1 + 4 Tier 2): Parallax layers (CSS scroll-driven), perspective zoom, sticky stack, animated counters, SVG line draw, word-by-word reveal (CSS), horizontal scroll-jack, before/after slider, scroll-linked video, split screen merge
- Category 3: Interactive (7 patterns, 3 Tier 1 + 2 Tier 2 + 2 Tier 3): Expandable cards, drag-to-reveal, interactive calculator, 3D product viewer, interactive timeline, morphing shape menu, physics playground
- Category 4: Ambient (10 patterns, 5 Tier 1 + 2 Tier 2 + 3 Tier 3): Gradient mesh, aurora, morphing blob, particle field, living grid, noise texture, generative art, WebGL shader, Rive state machine, dotLottie

**Auto-Suggestion Matrix:**
- Table 1: Beat type -> pattern category recommendations (7 beat types x 4 categories)
- Table 2: Archetype intensity modifier (compact reference to Layer 1's full table)
- Table 3: Section content modifier (14 content types with specific pattern recommendations)

**Layer 3 -- Integration Context:**
- DNA token mapping table (8 tokens with wow moment usage)
- Cross-references to cinematic-motion, creative-tension, emotional-arc, design-dna, performance-aware-animation, design-archetypes
- Pipeline stage documentation (input from section planner, output to builder/reviewer)

**Layer 4 -- Anti-Patterns:**
- 6 anti-patterns: Wow moment overload, wrong category for archetype, all Tier 1 for high-intensity PEAK, missing reduced motion, arbitrary colors, unbundled heavy libraries

**Machine-Readable Constraints:**
- 10 enforcement parameters covering intensity limits, code length, accessibility, and performance

**Commit:** `5058958` feat(05-03): rewrite wow-moments skill with tiered patterns and auto-suggestion matrix

## Deviations from Plan

### Size Overshoot

**Found during:** Task 1 verification
**Issue:** File at 1417 lines exceeds 800-950 target range from plan. Research estimated 830-1260 with a warning at 1000.
**Reason:** 35 patterns (vs. 33 minimum) each with full TSX code (Tier 1), component structure (Tier 2), or setup skeleton (Tier 3), plus every pattern having beat/archetype compatibility and reduced-motion documentation.
**Impact:** Larger context consumption when skill is loaded. All content is substantive -- no obvious filler to cut.
**Mitigation:** Deduplicated the archetype intensity table (full in Layer 1, compact summary in auto-suggestion matrix). Compacted code examples where possible without sacrificing readability.

## Decisions Made

| ID | Decision | Confidence |
|----|----------|------------|
| 05-03-01 | 35 patterns (8+10+7+10) exceeds 33+ target | HIGH |
| 05-03-02 | 1417 lines exceeds 800-950 target, all content substantive | MEDIUM |
| 05-03-03 | Archetype table deduplicated between Layer 1 and auto-suggestion section | HIGH |
| 05-03-04 | Tier 3 patterns use setup skeletons, not full implementations | HIGH |

## Verification

- [x] File exists and is 700+ lines (1417 lines)
- [x] YAML frontmatter with `tier: core` and `version: "2.0.0"`
- [x] All 4 layer headings present
- [x] 35 numbered patterns across 4 categories
- [x] Categories: Cursor-Responsive (8), Scroll-Responsive (10), Interactive (7), Ambient (10)
- [x] Tier 1 patterns have complete TSX (magnetic button verified)
- [x] Tier 2 patterns have component structure + key code (horizontal scroll-jack verified)
- [x] Tier 3 patterns have architecture description (WebGL shader verified)
- [x] Auto-Suggestion Matrix with 3 tables (beat type, archetype, content)
- [x] Rive integration pattern with @rive-app/react-canvas
- [x] dotLottie integration pattern with @lottiefiles/dotlottie-react
- [x] Every pattern has "Reduced motion" documentation (36 mentions)
- [x] All code examples use DNA token CSS variables
- [x] All imports use `motion/react` (no `framer-motion`)

## Next Phase Readiness

No blockers for subsequent plans. The wow-moments skill integrates with:
- Cinematic motion (05-01) for archetype motion profiles
- Creative tension (05-02) for tension-type wow moments
- Performance-aware animation (05-05) for code-splitting guidance
- Design system scaffold (05-06) for DNA token enforcement
