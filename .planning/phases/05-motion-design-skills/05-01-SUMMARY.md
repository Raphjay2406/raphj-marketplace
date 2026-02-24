---
phase: 05-motion-design-skills
plan: 01
subsystem: motion-design
tags: [motion, animation, CSS-scroll-driven, GSAP, motion-react, tailwind-v4, archetype-motion]
completed: 2026-02-24
duration: 4 min
tasks_completed: 2
tasks_total: 2

dependency_graph:
  requires: [01-02, 01-03, 01-05]
  provides: [cinematic-motion-skill-v2]
  affects: [05-02, 05-03, 05-04, 05-05, 05-06, 08-08]

tech_stack:
  added: []
  patterns: [CSS-first-motion-decision-tree, hybrid-motion-presets, beat-dependent-scroll, motion-diversity-enforcement]

key_files:
  created: []
  modified: [skills/cinematic-motion/SKILL.md]
  deleted: [skills/css-animations/SKILL.md, skills/framer-motion/SKILL.md, skills/gsap-animations/SKILL.md]

decisions:
  - id: 05-01-01
    description: "Unified motion skill at 705 lines (within 550-700 target range) subsumes 3 library skills (779 lines total deleted)"
    confidence: HIGH
  - id: 05-01-02
    description: "All 19 archetype profiles in compact single-row table format (20 lines vs 100+ if expanded)"
    confidence: HIGH
  - id: 05-01-03
    description: "10 machine-readable constraint parameters for automated motion quality checking"
    confidence: HIGH

metrics:
  skill_lines: 705
  lines_deleted: 779
  archetype_profiles: 19
  constraint_parameters: 10
  css_patterns_with_supports: 4
---

# Phase 5 Plan 1: Cinematic Motion Skill Summary

**One-liner:** Unified motion system with CSS-first decision tree, 19 archetype profiles, beat-dependent scroll behavior, and diversity enforcement -- replaces 3 v6.1.0 library skills.

## What Was Done

### Task 1: Rewrite Cinematic Motion SKILL.md (4-layer format)
**Commit:** `812a3e3`

Rewrote `skills/cinematic-motion/SKILL.md` from v6.1.0 (521 lines, Motion-centric) to v2.0 (705 lines, unified system) that subsumes css-animations, framer-motion, and gsap-animations into one authoritative skill.

**Layer 1 (Decision Guidance):**
- CSS-first decision tree with 6 branch levels -- defaults to CSS, escalates to Motion or GSAP only when CSS cannot express the effect
- Motion intensity table mapping all 19 archetypes to HIGH/MEDIUM/LOW/BOLD/VARIABLE
- Beat-dependent scroll behavior table for all 10 beat types (HOOK/PEAK continuous, others entrance-only)
- Motion diversity enforcement rules (no 3 consecutive same-direction/timing, min 3 directions per page)

**Layer 2 (Award-Winning Examples):**
- Hybrid motion preset model showing archetype-base + DNA-tweak pattern with Kinetic and Japanese Minimal contrast examples
- 4 CSS scroll-driven patterns (entrance, parallax, progress, sticky header) all with `@supports` progressive enhancement
- Motion library patterns with correct `motion/react` imports (standard, RSC, bundle-optimized, reduced-motion)
- GSAP patterns (SplitText reveal, timeline choreography, React cleanup) -- all plugins documented as free
- Complete 19-archetype motion profiles table with easing, duration, stagger, directions, scroll mode, intensity
- Tailwind v4 `@theme` integration with 9 `--animate-*` presets and `@keyframes` blocks
- Reduced motion handling for CSS, Motion library, and GSAP
- Multi-layer hover choreography pattern
- Frame-by-frame choreography sequences for HOOK, PEAK, and BUILD beats

**Layer 3 (Integration Context):**
- DNA connection: 6 motion token mappings
- Related skills: emotional-arc, design-system-scaffold, wow-moments, page-transitions, creative-tension, performance-aware-animation
- Pipeline stage: input from DNA/arc/master-plan, output to spawn prompts/section plans/scaffold

**Layer 4 (Anti-Patterns):**
- 7 anti-patterns: All-JS Motion, Generic Fade-In Everywhere, will-change Abuse, framer-motion Imports, GSAP Premium Mentions, Safari 18 Assumption, Same Motion Every Section

**Machine-Readable Constraints:**
- 10 parameters for automated checking (speed-multiplier range, diversity limits, beat-specific scroll modes, @supports requirement, reduced-motion requirement)

### Task 2: Delete culled v6.1.0 library skills
**Commit:** `0aaef6a`

Deleted 3 v6.1.0 library-specific skills (779 lines total):
- `skills/css-animations/SKILL.md` (244 lines) -- CSS @keyframes, transitions, scroll-driven patterns
- `skills/framer-motion/SKILL.md` (258 lines) -- Framer Motion variants, gestures, layout animations
- `skills/gsap-animations/SKILL.md` (277 lines) -- GSAP tweens, timelines, ScrollTrigger

All patterns from these skills are now integrated into cinematic-motion Layer 2.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Skill length at 705 lines** -- within 550-700 target range. All content substantive: decision tree, 19-archetype table, 4 CSS patterns, Motion patterns, GSAP patterns, Tailwind integration, reduced motion, hover choreography, choreography sequences, integration context, 7 anti-patterns, 10 constraint parameters.

2. **Compact table format for archetypes** -- single-row-per-archetype table (20 lines) instead of expanded blocks (would be 100+ lines). Highly scannable, all data in one view.

3. **10 machine-readable constraint parameters** -- covers speed multiplier bounds, diversity limits, beat-specific scroll mode requirements, `@supports` mandate, and reduced-motion mandate. Sufficient for automated quality checking.

## Verification Results

| Check | Status |
|-------|--------|
| File exists and 500+ lines | PASS (705 lines) |
| YAML frontmatter with tier: core, version: 2.0.0 | PASS |
| All 4 layer headings present | PASS |
| CSS-first decision tree | PASS |
| animation-timeline: view() with @supports patterns | PASS (4 patterns) |
| motion/react imports (not framer-motion) | PASS |
| 19 archetype motion profiles table | PASS |
| Beat-dependent scroll behavior table | PASS |
| Motion diversity enforcement rules | PASS |
| Hybrid preset model with DNA tweak variables | PASS |
| @theme { --animate-* pattern | PASS |
| Reduced motion handling | PASS |
| No framer-motion imports in code | PASS |
| No paid/premium/Club mentions for GSAP | PASS |
| No Safari 18 scroll-driven claims | PASS |
| v6.1.0 skills deleted | PASS (3 directories removed) |
| cinematic-motion preserved | PASS |
| performance-guardian preserved | PASS |

## Next Phase Readiness

Plan 05-01 establishes the motion foundation that all subsequent Phase 5 skills reference:
- **05-02 (Creative Tension):** References motion profiles for tension animation behavior
- **05-03 (Wow Moments):** References CSS-first decision tree and archetype motion profiles
- **05-04 (Page Transitions):** References archetype easing/duration from motion profiles
- **05-05 (Performance-Aware Animation):** References the same CSS-first decision tree
- **05-06 (Design System Scaffold):** Generates the `@theme` motion presets documented here
