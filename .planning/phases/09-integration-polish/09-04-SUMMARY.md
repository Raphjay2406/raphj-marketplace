---
phase: 09-integration-polish
plan: 04
subsystem: error-recovery
tags: [error-handling, diagnosis, severity, checkpoint, resume, failure-log, recovery]

requires:
  - phase: 02-pipeline-architecture
    provides: "Design-lead and section-builder agent protocols, SUMMARY.md contract, STATE.md 100-line budget"
  - phase: 09-integration-polish/03
    provides: "Progress reporting skill with STATE.md compact format"
provides:
  - "Error recovery protocol skill with severity classification, structured diagnosis, and checkpoint resume"
  - "FAILURE-LOG.md format for detailed error tracking"
  - "SUMMARY.md failure format for section builder error reporting"
  - "Systemic failure escalation protocol (3+ same-type threshold)"
affects: [design-lead, section-builder, build-orchestrator, quality-gate-protocol]

tech-stack:
  added: []
  patterns:
    - "MINOR/MAJOR/CRITICAL severity classification with escalation rules"
    - "Structured diagnosis template with 2-3 fix options and trade-offs"
    - "Pre-wave checkpoint for crash recovery"
    - "FAILURE-LOG.md append-only detailed logging separate from STATE.md"

key-files:
  created:
    - skills/error-recovery/SKILL.md
  modified: []

key-decisions:
  - "Auto-fix (targeted correction) permitted for MINOR; user approval required for MAJOR/CRITICAL -- distinction from auto-retry"
  - "FAILURE-LOG.md is append-only and unbounded; STATE.md capped at 5 most recent failures"
  - "DNA-related failures are always MAJOR minimum due to cascade risk to all consuming sections"
  - "Systemic escalation at 3+ same-type failures proposes project-level fix"
  - "Pre-wave checkpoint is HARD requirement for crash recovery reliability"

patterns-established:
  - "Severity classification: MINOR (auto-fix), MAJOR (user picks), CRITICAL (stop wave)"
  - "Failure detection: SUMMARY.md status check after every builder"
  - "Checkpoint resume: COMPLETE/FAILED/PARTIAL/INTERRUPTED/NOT_STARTED states"
  - "Systemic pattern detection: count failures by type, escalate at 3+"

duration: 4min
completed: 2026-02-24
---

# Phase 9 Plan 4: Error Recovery Skill Summary

**Structured error recovery protocol with 3-tier severity classification, diagnosis templates, checkpoint resume, and systemic failure escalation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-24T15:43:39Z
- **Completed:** 2026-02-24T15:47:47Z
- **Tasks:** 1
- **Files created:** 1

## Accomplishments
- Created error-recovery skill (594 lines) with complete 4-layer format defining how all pipeline agents handle failures
- Three severity levels (MINOR/MAJOR/CRITICAL) with clear classification criteria, escalation rules, and action protocols
- Structured diagnosis template produces consistent failure reports with 2-3 fix options, trade-offs, risk assessments, and recommendations
- Checkpoint resume protocol handles session interruption with 5-state detection (COMPLETE/FAILED/PARTIAL/INTERRUPTED/NOT_STARTED)
- Systemic failure escalation triggers at 3+ same-type failures with project-level fix recommendation
- FAILURE-LOG.md handles unbounded detailed logging while STATE.md stays within 100-line budget (max 5 recent entries)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Error Recovery skill** - `1738f66` (feat)

## Files Created/Modified
- `skills/error-recovery/SKILL.md` - Complete error recovery protocol skill (594 lines, 4-layer format)

## Decisions Made
- Auto-fix for MINOR is explicitly distinguished from auto-retry (targeted correction vs. blind retry of same approach) -- aligns with Phase 2 "no auto-retry" decision
- DNA-related failures classified as MAJOR minimum due to cascade risk (shared components propagate token errors)
- Mid-wave failure handling: let running builders continue, assess wave after all builders return
- Pre-wave checkpoint is a HARD requirement (5 lines in STATE.md enables reliable crash recovery)
- 7 anti-patterns documented to prevent common error handling mistakes (silent retry, STATE.md bloat, ignored builders, etc.)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Error recovery protocol is complete and ready for agent reference
- Integrates with progress-reporting skill for STATE.md failure summary format
- All 4 Phase 9 skills/protocols are now complete (Figma integration, design system export, progress reporting, error recovery)

---
*Phase: 09-integration-polish*
*Completed: 2026-02-24*
