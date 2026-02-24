---
phase: 05-motion-design-skills
plan: 05
subsystem: motion
tags: [performance, animation, CWV, code-splitting, font-loading, will-change, compositor-thread, LazyMotion, GSAP, Three.js]

requires:
  - phase: 01-foundation
    provides: "Design DNA tokens (fonts, motion), skill template 4-layer format"
  - phase: 05-motion-design-skills (plans 01-04)
    provides: "Cinematic motion CSS-first tree, wow moment tiers, page transition choices"
provides:
  - "Performance-aware animation skill with CSS-first hierarchy, code-splitting patterns, font loading, performance budgets"
  - "Clean separation between animation performance (performance-animation) and general web performance (performance-guardian)"
affects:
  - "Phase 7 (3D/WebGL skills reference code-splitting and R3F loading patterns)"
  - "Phase 8 (framework skills reference font loading strategy per framework)"
  - "Phase 4 quality gates (enforce budgets defined here)"

tech-stack:
  added: []
  patterns:
    - "Animation performance hierarchy (Tier 0-3) with CSS compositor-thread as default"
    - "Viewport-triggered dynamic imports with IntersectionObserver + 200px rootMargin"
    - "LazyMotion + domAnimation for tree-shaken Motion library (~15 KB vs ~25 KB)"
    - "will-change apply/remove discipline with 10-element budget"

key-files:
  created:
    - "skills/performance-animation/SKILL.md"
  modified:
    - "skills/performance-guardian/SKILL.md"

key-decisions:
  - "performance-animation is core tier (always loaded) -- animation performance is fundamental to every build"
  - "will-change budget set to max 10 active elements (up from v6.1.0's 5) based on modern GPU capabilities"
  - "Font loading section moved entirely to performance-animation (not duplicated in both skills)"
  - "Total animation JS budget: < 80 KB gzipped initial load (excludes on-demand code-split chunks)"

patterns-established:
  - "Two-skill performance model: performance-animation (motion-specific) + performance-guardian (general web)"
  - "Machine-readable constraints table with 10 enforceable parameters for automated checking"

duration: 4min
completed: 2026-02-24
---

# Phase 5 Plan 05: Performance-Aware Animation Summary

**CWV-compliant animation performance system with 4-tier hierarchy, code-splitting patterns for GSAP/R3F/Rive/dotLottie, and concrete per-library JS budgets**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T05:30:54Z
- **Completed:** 2026-02-24T05:34:44Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created new performance-animation skill (537 lines) as the animation performance conscience of the motion system
- Documented 4-tier animation performance hierarchy with CSS compositor-thread as Tier 0 default
- Complete code-splitting patterns for all heavy libraries (GSAP, R3F, Rive, dotLottie, Motion)
- Font loading strategy covering Next.js (next/font) and Astro (@fontsource) with < 150 KB total budget
- Trimmed performance-guardian from 293 to 140 lines with clean separation of concerns

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Performance-Aware Animation SKILL.md** - `dabe782` (feat)
2. **Task 2: Trim performance-guardian skill of animation content** - `ad992b1` (refactor)

## Files Created/Modified
- `skills/performance-animation/SKILL.md` - New core skill: animation performance hierarchy, code-splitting, font loading, will-change discipline, performance budgets, reduced-motion baseline, FPS monitoring
- `skills/performance-guardian/SKILL.md` - Trimmed of animation content, cross-references performance-animation, retains image/CSS/bundle/Lighthouse coverage

## Decisions Made
- **performance-animation is core tier:** Animation performance is fundamental to every build -- not optional domain knowledge
- **will-change budget: 10 elements:** Increased from v6.1.0's 5 based on modern GPU capabilities, but still enforced as HARD constraint
- **Font loading moved entirely:** performance-animation owns font loading strategy (Next.js, Astro, budgets) -- not duplicated in performance-guardian
- **80 KB initial animation JS budget:** Concrete, enforceable limit; code-split chunks that load on viewport intersection are excluded from this budget
- **537 lines exceeds 350-450 target:** All content is substantive -- the code-splitting patterns and font loading examples need complete, copy-paste-ready code. No padding

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 5 motion/design skills complete for Phase 5 (cinematic-motion, creative-tension, wow-moments, page-transitions, performance-animation)
- Design system scaffold skill (05-06) is the remaining plan in Phase 5
- performance-animation provides the budgets and loading patterns that the scaffold will reference when generating globals.css and font setup

---
*Phase: 05-motion-design-skills*
*Completed: 2026-02-24*
