---
phase: 11-fix-stale-cross-references
plan: 02
subsystem: pipeline
tags: [cross-references, data-flow, REFERENCES.md, DESIGN-REFERENCES.md, producer-consumer]

# Dependency graph
requires:
  - phase: 11-fix-stale-cross-references (research)
    provides: Identification of REFERENCES.md producer-consumer gap across 9 files
provides:
  - Consistent REFERENCES.md data flow: researcher writes to research/DESIGN-REFERENCES.md, all consumers read from research/DESIGN-REFERENCES.md
  - Zero bare REFERENCES.md references in any v2.0 agent or skill file
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "research/DESIGN-REFERENCES.md as canonical reference data path"

key-files:
  created: []
  modified:
    - skills/reference-benchmarking/SKILL.md
    - agents/pipeline/section-planner.md
    - agents/pipeline/quality-reviewer.md
    - agents/pipeline/polisher.md
    - agents/pipeline/build-orchestrator.md
    - agents/pipeline/section-builder.md
    - agents/specialists/3d-specialist.md
    - agents/specialists/animation-specialist.md
    - agents/specialists/content-specialist.md

key-decisions:
  - "ASCII pipeline diagram in reference-benchmarking skill updated with multi-line path format to fit research/DESIGN-REFERENCES.md in column-aligned diagram"
  - "build-orchestrator line 25 expanded with clarifying note: reference data available in research/DESIGN-REFERENCES.md AND embedded in section PLAN.md files by section-planner"

patterns-established:
  - "All reference data consumers use research/DESIGN-REFERENCES.md path consistently"

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 11 Plan 02: Fix REFERENCES.md Producer-Consumer Gap Summary

**Aligned all 9 consumer files to read research/DESIGN-REFERENCES.md instead of non-existent bare REFERENCES.md, closing the broken reference data flow**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T17:29:57Z
- **Completed:** 2026-02-24T17:32:07Z
- **Tasks:** 1
- **Files modified:** 9

## Accomplishments
- Eliminated all bare REFERENCES.md references across 5 pipeline agents, 3 specialist agents, and 1 skill
- Made reference data flow consistent end-to-end: researcher writes to research/DESIGN-REFERENCES.md, consumers read from research/DESIGN-REFERENCES.md
- Updated build-orchestrator in both locations (input contract note at line 25 and QR contracted files list at line 125)
- Fixed ASCII pipeline diagram in reference-benchmarking skill to reflect correct paths

## Task Commits

Each task was committed atomically:

1. **Task 1: Update reference-benchmarking skill output path and all agent REFERENCES.md paths** - `5d25a16` (fix)

## Files Created/Modified
- `skills/reference-benchmarking/SKILL.md` - Updated output path instruction (line 407), ASCII diagram (lines 429-433), and pipeline input reference (line 512)
- `agents/pipeline/section-planner.md` - Updated description, input contract reads list, and step 5 planning process
- `agents/pipeline/quality-reviewer.md` - Updated always-read list entry
- `agents/pipeline/polisher.md` - Updated do-not-read list entry
- `agents/pipeline/build-orchestrator.md` - Updated input contract note (line 25) and QR contracted files list (line 125)
- `agents/pipeline/section-builder.md` - Updated do-not-read list entry
- `agents/specialists/3d-specialist.md` - Updated do-not-read list entry
- `agents/specialists/animation-specialist.md` - Updated do-not-read list entry
- `agents/specialists/content-specialist.md` - Updated do-not-read list entry

## Decisions Made
- ASCII pipeline diagram updated with multi-line path format to accommodate longer `research/DESIGN-REFERENCES.md` path within column alignment constraints
- build-orchestrator line 25 note expanded from simple parenthetical to clarify dual availability: in research/DESIGN-REFERENCES.md directly and embedded in section PLAN.md files

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed additional bare REFERENCES.md in ASCII pipeline diagram**
- **Found during:** Task 1 (verification step)
- **Issue:** The ASCII pipeline diagram in reference-benchmarking skill had a second `REFERENCES.md` reference (line 429, section-planner column) that was not listed in the plan's occurrence count
- **Fix:** Updated the diagram line to split `research/DESIGN-REFERENCES.md` across two lines matching the same pattern used for the researcher column
- **Files modified:** skills/reference-benchmarking/SKILL.md
- **Verification:** `rg "\bREFERENCES\.md\b" ... | rg -v "DESIGN-REFERENCES"` returns zero results
- **Committed in:** 5d25a16

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor -- one additional occurrence in ASCII diagram not listed in plan's occurrence count. Fix was straightforward.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- REFERENCES.md producer-consumer gap (GAP-2) is now closed
- All other Phase 11 plans can proceed independently
- No blockers or concerns

---
*Phase: 11-fix-stale-cross-references*
*Completed: 2026-02-25*
