---
phase: 05-motion-design-skills
plan: 04
subsystem: motion
tags: [page-transitions, view-transitions-api, animatepresence, motion-react, shared-elements, layoutId, gsap-flip, archetype-choreography]

requires:
  - phase: 01-foundation
    provides: "Design archetypes (19 archetypes), design DNA tokens, emotional arc beats, skill template format"
  - phase: 05-motion-design-skills (05-01)
    provides: "Cinematic motion vocabulary, archetype motion profiles, easing curves"
provides:
  - "Page transition decision tree routing builders to correct approach per framework"
  - "View Transitions API patterns for Astro (stable) and Next.js (experimental)"
  - "AnimatePresence production-ready page transition patterns"
  - "Shared element transition patterns via Motion layoutId"
  - "Per-archetype transition choreography table (all 19 archetypes)"
  - "Machine-readable constraints for transition duration, shared elements, reduced motion"
affects: [08-multi-page-architecture, 05-06-design-system-scaffold, 05-05-performance-aware-animation]

tech-stack:
  added: []
  patterns: ["View Transitions API as progressive enhancement", "AnimatePresence as production fallback", "Per-archetype transition choreography", "Directional navigation detection"]

key-files:
  created: ["skills/page-transitions/SKILL.md"]
  modified: []

key-decisions:
  - "690 lines exceeds 400-500 target but all content substantive (6 implementation patterns + 19 archetype table + 7 anti-patterns)"
  - "GSAP Flip included as Pattern 5 for complex multi-element choreography beyond AnimatePresence capabilities"
  - "Directional navigation detection pattern included to enforce back-vs-forward spatial model"

patterns-established:
  - "Framework maturity matrix pattern: table showing API stability per framework"
  - "Archetype choreography table: numbered rows mapping all 19 archetypes to transition parameters"
  - "Feature detection fallback: check for native API, fall back to Motion library"

duration: 4min
completed: 2026-02-24
---

# Phase 5 Plan 4: Page Transitions Summary

**Page transition system with View Transitions API (Astro stable, Next.js experimental), AnimatePresence fallback, shared element layoutId morphing, and 19-archetype choreography table**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T05:31:04Z
- **Completed:** 2026-02-24T05:34:52Z
- **Tasks:** 1
- **Files created:** 1

## Accomplishments

- Created brand new page-transitions skill (no v6.1.0 predecessor) with complete 4-layer format
- Documented 4 transition approaches: View Transitions API, AnimatePresence, shared elements (layoutId), GSAP Flip
- Built per-archetype choreography table mapping all 19 archetypes to distinct transition styles, durations, and easings
- Framework maturity matrix clearly distinguishes Astro (stable) from Next.js (experimental) View Transitions
- 6 complete implementation patterns with copy-paste code covering all major frameworks and use cases
- 7 anti-patterns addressing common mistakes (experimental API without fallback, slow transitions, wrong direction, etc.)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Page Transitions SKILL.md (4-layer format)** - `5c4573b` (feat)

## Files Created/Modified

- `skills/page-transitions/SKILL.md` - Complete page transition skill with decision tree, framework maturity matrix, 6 implementation patterns, 19-archetype choreography table, integration context, 7 anti-patterns, and machine-readable constraints (690 lines)

## Decisions Made

- **690 lines exceeds target range:** The 400-500 line target was exceeded because the skill covers 4 distinct transition approaches (View Transitions API for 2 frameworks, AnimatePresence, shared elements, GSAP Flip), each needing complete code examples, plus 19 archetype variants and 7 anti-patterns. All content is substantive -- no padding
- **GSAP Flip as fifth pattern:** Added GSAP Flip plugin pattern for complex multi-element choreography that AnimatePresence cannot express (4+ simultaneous morphing elements with stagger). This rounds out the transition toolkit
- **Directional navigation detection:** Included a `useNavigationDirection()` hook pattern that detects back vs forward navigation for directional transitions, enforcing the spatial model anti-pattern

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Page transitions skill is complete and ready for reference by other Phase 5 skills
- Performance-aware animation skill (05-05) can reference transition performance budgets
- Design system scaffold skill (05-06) can reference transition variant objects for Wave 0 generation
- Phase 8 multi-page architecture skill will define WHEN and WHERE transitions are used; this skill provides the HOW

---
*Phase: 05-motion-design-skills*
*Completed: 2026-02-24*
