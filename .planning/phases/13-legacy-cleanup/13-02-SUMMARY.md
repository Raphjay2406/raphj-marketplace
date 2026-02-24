# Phase 13 Plan 02: Remove Superseded Skills, Fix Bookkeeping, Wire Brainstorm Skills Summary

**One-liner:** Removed 12 superseded v6.1.0 skill directories, fixed REQUIREMENTS.md and ROADMAP.md checkboxes, added Machine-Readable Constraints to react-vite-patterns, and wired 4 brainstorm skills into 5 agent/command files (8 references total).

## What Was Done

### Task 1: Remove 12 superseded v6.1.0 skill directories and fix bookkeeping
- Deleted 12 superseded skill directories: accessibility-patterns, conversion-patterns, creative-sections, light-mode-patterns, micro-copy, mobile-navigation, mobile-patterns, modal-dialog-patterns, nextjs-app-router, premium-dark-ui, premium-typography, responsive-layout (3,328 lines removed)
- Fixed REQUIREMENTS.md: marked FOUND-01 through FOUND-04 and SKIL-01 through SKIL-03 as [x] (7 checkboxes)
- Fixed ROADMAP.md: marked Phase 4 and Phase 7 as [x] (2 checkboxes)
- Updated SKILL-DIRECTORY.md: removed deleted skills from Legacy tables, updated counts (85 -> 73 total filesystem skills, superseded count 10 -> 1)
- Phantom typography/color-system entries: already resolved by Phase 12 rebuild (no standalone entries existed)
- Commit: `a0bc8a2`

### Task 2: Add Machine-Readable Constraints to react-vite-patterns and wire brainstorm skills
- Added Machine-Readable Constraints table with 8 SPA-appropriate parameters to react-vite-patterns/SKILL.md (consistent with nextjs-patterns, astro-patterns, desktop-patterns format)
- Wired brainstorm skill references into 5 files (8 total references):
  - researcher.md: design-brainstorm (INDUSTRY-ANALYSIS track), design-brainstorm + cross-pollination (DESIGN-REFERENCES track)
  - creative-director.md: creative-direction-format + cross-pollination (role description)
  - section-planner.md: copy-intelligence (input contract)
  - start-project.md: design-brainstorm (Phase 3: Creative Direction)
  - lets-discuss.md: cross-pollination + creative-direction-format (Discussion Protocol)
- Commit: `115cd54`

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Phantom entries "already resolved" | Phase 12 rebuilt SKILL-DIRECTORY.md from scratch -- no standalone `typography` or `color-system` entries existed |
| chart-data-viz kept in Superseded table | Not in the 12-directory deletion list; remains as legacy skill pending evaluation |
| Skill references placed inline in existing structure | Minimal disruption -- added at natural locations within each file's existing flow |
| section-planner "Does NOT read" line updated | Removed "any skill files" clause since copy-intelligence is now an explicit reference |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Updated SKILL-DIRECTORY.md Legacy section**
- **Found during:** Task 1
- **Issue:** The 12 deleted skills were still listed in the Superseded and Unrewritten Legacy tables in SKILL-DIRECTORY.md
- **Fix:** Removed deleted entries from both tables, updated counts, added note about Phase 13 removal
- **Files modified:** skills/SKILL-DIRECTORY.md
- **Commit:** a0bc8a2

**2. [Rule 1 - Bug] Updated section-planner "Does NOT read" clause**
- **Found during:** Task 2
- **Issue:** section-planner.md stated "Does NOT read: any skill files" but we added a copy-intelligence skill reference
- **Fix:** Changed clause to "Does NOT read: STATE.md, CONTEXT.md, or any source code" (removed blanket skill exclusion)
- **Files modified:** agents/pipeline/section-planner.md
- **Commit:** 115cd54

## Verification Results

| Check | Result |
|-------|--------|
| Skill directory count (86 -> 74) | PASS (12 fewer) |
| All 12 superseded dirs gone | PASS (all confirmed deleted) |
| v2.0 replacements intact | PASS (accessibility, dark-light-mode, responsive-design, nextjs-patterns, copy-intelligence verified) |
| REQUIREMENTS.md unchecked count | PASS (0 unchecked) |
| ROADMAP.md Phase 4/7 checked | PASS (both [x]) |
| react-vite-patterns constraints | PASS (8 parameters) |
| All 8 brainstorm wiring references | PASS (all greps return matches) |

## Key Files

### Created
- `.planning/phases/13-legacy-cleanup/13-02-SUMMARY.md`

### Modified
- `.planning/REQUIREMENTS.md` -- 7 checkboxes marked [x]
- `.planning/ROADMAP.md` -- 2 phase checkboxes marked [x]
- `skills/SKILL-DIRECTORY.md` -- Legacy section updated, counts corrected
- `skills/react-vite-patterns/SKILL.md` -- Machine-Readable Constraints table added
- `agents/pipeline/researcher.md` -- design-brainstorm and cross-pollination references
- `agents/pipeline/creative-director.md` -- creative-direction-format and cross-pollination references
- `agents/pipeline/section-planner.md` -- copy-intelligence reference
- `commands/start-project.md` -- design-brainstorm reference
- `commands/lets-discuss.md` -- cross-pollination and creative-direction-format references

### Deleted
- `skills/accessibility-patterns/` (replaced by skills/accessibility/)
- `skills/conversion-patterns/` (absorbed into skills/copy-intelligence/)
- `skills/creative-sections/` (replaced by skills/emotional-arc/ + skills/creative-tension/)
- `skills/light-mode-patterns/` (replaced by skills/dark-light-mode/)
- `skills/micro-copy/` (absorbed into skills/copy-intelligence/)
- `skills/mobile-navigation/` (absorbed into skills/responsive-design/)
- `skills/mobile-patterns/` (absorbed into skills/responsive-design/)
- `skills/modal-dialog-patterns/` (generic UI, out of scope)
- `skills/nextjs-app-router/` (replaced by skills/nextjs-patterns/)
- `skills/premium-dark-ui/` (replaced by skills/dark-light-mode/)
- `skills/premium-typography/` (absorbed into skills/design-dna/ + skills/design-system-scaffold/)
- `skills/responsive-layout/` (replaced by skills/responsive-design/)

## Metrics

- **Duration:** ~4 min
- **Completed:** 2026-02-25
- **Tasks:** 2/2
- **Lines removed:** 3,328 (12 legacy skills)
- **Lines added:** ~28 (constraints table + skill references)
