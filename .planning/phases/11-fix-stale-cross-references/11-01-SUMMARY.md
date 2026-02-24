---
phase: 11-fix-stale-cross-references
plan: 01
subsystem: cross-references
tags: [markdown, cross-references, agent-names, command-names, refactoring]

requires:
  - phase: 01-foundation
    provides: skill template format and design-dna skill
  - phase: 02-pipeline-architecture
    provides: v2.0 agent names (build-orchestrator, section-planner, etc.)
  - phase: 03-command-system
    provides: v2.0 command names (start-project, plan-dev, audit, etc.)
provides:
  - Zero stale agent/command cross-references in all v2.0 skill and agent files
  - Deleted legacy agents/discussion-protocol.md (v6.1.0)
  - Figma integration skill uses start-project discovery flow instead of nonexistent --figma flag
  - Design system export skill describes export as user-triggered post-build action
affects: [12-skill-directory-readme, 13-legacy-cleanup]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - skills/progress-reporting/SKILL.md
    - skills/error-recovery/SKILL.md
    - skills/figma-integration/SKILL.md
    - skills/emotional-arc/SKILL.md
    - skills/anti-slop-gate/SKILL.md
    - skills/multi-page-architecture/SKILL.md
    - skills/design-archetypes/SKILL.md
    - skills/awwwards-scoring/SKILL.md
    - skills/design-system-export/SKILL.md
    - agents/figma-translator.md

key-decisions:
  - "Figma entry path: removed --figma flag references, describe providing Figma URL during normal /modulo:start-project discovery instead"
  - "design-system-export: /modulo:export replaced with 'post-build export workflow (user-triggered)' since command does not exist"
  - "emotional-arc: beat assignment agent is section-planner (not build-orchestrator) -- section-planner is the agent that actually assigns beats"
  - "Legacy agents/discussion-protocol.md deleted (v2.0 replacement exists at agents/protocols/discussion-protocol.md)"

patterns-established:
  - "All v2.0 skill/agent files now use consistent v2.0 naming: build-orchestrator, start-project, plan-dev, audit"

duration: 4min
completed: 2026-02-25
---

# Phase 11 Plan 01: Fix Stale Cross-References Summary

**Repaired 66 stale agent/command references across 10 v2.0 files and deleted 1 legacy file, achieving zero stale refs for 5 categories (design-lead, start-design, plan-sections, /modulo:verify, /modulo:export)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T17:30:05Z
- **Completed:** 2026-02-24T17:34:26Z
- **Tasks:** 2
- **Files modified:** 10 (+ 1 deleted)

## Accomplishments
- Eliminated all 35 `design-lead` references across skills/ and agents/ v2.0 files, replacing with `build-orchestrator` (or `section-planner` where semantically correct)
- Eliminated all 7 `start-design` references, replacing with `start-project` and removing nonexistent `--figma` flag
- Eliminated all 3 `plan-sections` references, replacing with `plan-dev`
- Eliminated all 22 `/modulo:verify` references across v2.0 files, replacing with `/modulo:audit`
- Eliminated all 2 `/modulo:export` references, replacing with user-triggered post-build workflow description
- Deleted `agents/discussion-protocol.md` (v6.1.0 legacy with 6 stale refs, replaced by `agents/protocols/discussion-protocol.md`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Repair stale refs in 3 heavy skills + figma-translator + delete legacy** - `cbc2130` (fix)
2. **Task 2: Repair stale refs in remaining 6 skill files + full verification** - `0cf8268` (fix)

## Files Created/Modified
- `skills/progress-reporting/SKILL.md` - 26 replacements (22 design-lead + 2 Design-lead + 4 /modulo:verify)
- `skills/error-recovery/SKILL.md` - 15 replacements (12 design-lead + 3 Design-lead, including special cases for line 61 and 538)
- `skills/figma-integration/SKILL.md` - 11 replacements (6 start-design with --figma removal + 5 /modulo:verify)
- `agents/figma-translator.md` - 3 replacements (1 start-design + 2 /modulo:verify)
- `agents/discussion-protocol.md` - DELETED (v6.1.0 legacy)
- `skills/emotional-arc/SKILL.md` - 6 replacements (1 design-lead->section-planner + 3 plan-sections + 2 /modulo:verify)
- `skills/anti-slop-gate/SKILL.md` - 4 replacements (/modulo:verify)
- `skills/multi-page-architecture/SKILL.md` - 3 replacements (/modulo:verify)
- `skills/design-archetypes/SKILL.md` - 1 replacement (/modulo:verify)
- `skills/awwwards-scoring/SKILL.md` - 1 replacement (/modulo:verify)
- `skills/design-system-export/SKILL.md` - 2 replacements (/modulo:export)

## Decisions Made
- **Figma entry path:** Removed `--figma` flag references entirely rather than adding the flag to start-project.md. The figma-integration skill now describes providing a Figma URL during the normal `/modulo:start-project` discovery flow. This avoids adding a new flag to a command that was not designed for it.
- **emotional-arc beat assignment agent:** Used `section-planner` (not `build-orchestrator`) as the replacement for `design-lead` in the beat assignment context, because the section-planner is the agent that actually assigns beats to sections.
- **design-system-export:** Replaced `/modulo:export` with "post-build export workflow (user-triggered)" description since the command does not exist and creating it is out of scope.
- **Capitalized variants:** Caught and replaced `Design-lead` (capital D) occurrences in addition to lowercase `design-lead` -- the replace_all only caught exact case matches, requiring manual fixes for 5 additional capitalized instances.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Capitalized "Design-lead" variants missed by case-sensitive replace**
- **Found during:** Task 1 (progress-reporting and error-recovery)
- **Issue:** `replace_all` for `design-lead` did not catch `Design-lead` (capital D) occurrences. Found 2 in progress-reporting (lines 391, 448) and 3 in error-recovery (lines 219, 417, 512).
- **Fix:** Manually replaced all 5 capitalized variants with `Build-orchestrator`
- **Files modified:** skills/progress-reporting/SKILL.md, skills/error-recovery/SKILL.md
- **Verification:** Case-insensitive grep returned zero results for both files
- **Committed in:** cbc2130 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (bug: case-sensitive replacement missed capitalized variants)
**Impact on plan:** Minor -- 5 additional replacements caught and fixed. No scope creep.

## Issues Encountered
None -- all replacements applied cleanly and verification passed on first run.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All v2.0 skill and agent files now have consistent, correct cross-references
- v6.1.0 legacy files at agents/ root (design-lead.md, section-builder.md, quality-reviewer.md, design-researcher.md) still exist but are deferred to Phase 13 (legacy cleanup)
- REFERENCES.md producer-consumer gap (Category 6 from research) is deferred to Plan 11-02
- README.md and SKILL-DIRECTORY.md updates are Phase 12 scope

---
*Phase: 11-fix-stale-cross-references*
*Completed: 2026-02-25*
