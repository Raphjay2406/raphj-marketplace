---
phase: 02-pipeline-architecture
plan: 04
subsystem: agents
tags: [quality-review, anti-slop, gap-fix, polisher, verification, feedback-loop]

requires:
  - phase: 01-foundation
    provides: "Anti-slop gate skill (35-point scoring system, 7 categories, penalties)"

provides:
  - "Quality reviewer agent with 3-level goal-backward verification"
  - "Full 35-point anti-slop scoring embedded in reviewer"
  - "GAP-FIX.md contract format between reviewer and polisher"
  - "Polisher agent with minimal-context targeted fix protocol"
  - "Lessons learned aggregation format for feedback loop"

affects:
  - "02-05 (build-orchestrator needs to spawn reviewer/polisher)"
  - "02-06 (section-builder awareness of light polish vs deep polish)"
  - "Phase 4 (quality gates reference reviewer verification levels)"

tech-stack:
  added: []
  patterns:
    - "Reviewer-polisher separation: diagnose thoroughly, fix minimally"
    - "GAP-FIX.md as inter-agent contract"
    - "Severity-based fix ordering (critical > major > minor)"
    - "Lessons learned feedback loop (reviewer -> orchestrator -> builders)"
    - "Persistent memory via memory: project for cross-session pattern accumulation"

key-files:
  created:
    - "agents/pipeline/quality-reviewer.md"
    - "agents/pipeline/polisher.md"
  modified: []

key-decisions:
  - "Quality reviewer embeds full anti-slop scoring inline (not skill reference at runtime) -- zero-cost enforcement"
  - "Polisher reads exactly 3 things: GAP-FIX.md, specific code files, DESIGN-DNA.md -- nothing else"
  - "Scope discipline is non-negotiable: polisher NEVER changes unlisted code"
  - "New gaps discovered during polish get documented, not fixed in same pass"
  - "Lessons learned format includes DESIGN_SYSTEM_PROPOSALS from builder SUMMARY.md files"

patterns-established:
  - "GAP-FIX.md format: YAML frontmatter (section, severity, score) + gaps with Level/Truth/Evidence/Fix/Files + anti-slop breakdown"
  - "Verification report: per-section 3-level results + anti-slop score + section verdict"
  - "Feedback loop: REPLICATE/AVOID/PATTERNS_SEEN/DESIGN_SYSTEM_PROPOSALS"
  - "Severity classification: critical (non-functional) > major (implementation gaps) > minor (polish)"

duration: 5min
completed: 2026-02-24
---

# Phase 2 Plan 4: Quality Reviewer & Polisher Summary

**Two-agent quality pipeline: reviewer performs 3-level goal-backward verification with 35-point anti-slop scoring and GAP-FIX.md generation; polisher reads minimal context and applies atomic severity-ordered fixes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-24T03:58:38Z
- **Completed:** 2026-02-24T04:03:21Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Quality reviewer agent with full 3-level verification protocol (Existence, Substantive, Wired) checking must_haves from PLAN.md
- Complete 35-point anti-slop scoring embedded inline with all 7 categories, 26 individual checks, 5 penalty types, and 4 named quality tiers
- Structured GAP-FIX.md format serving as the contract between reviewer/CD and polisher
- Polisher agent with strict minimal-context input (GAP-FIX.md + code files + DNA only) and atomic fix protocol
- Lessons learned aggregation format enabling the reviewer -> orchestrator -> builder feedback loop
- Persistent memory system for cross-session quality pattern accumulation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create quality-reviewer agent definition** - `135aead` (feat)
2. **Task 2: Create polisher agent definition** - `a2492d6` (feat)

## Files Created/Modified
- `agents/pipeline/quality-reviewer.md` - 362 lines: 3-level verification, 35-point scoring, GAP-FIX output, lessons learned aggregation, persistent memory
- `agents/pipeline/polisher.md` - 190 lines: minimal-context fix execution, severity ordering, scope discipline, error handling

## Decisions Made
- Quality reviewer embeds the full anti-slop scoring system inline rather than referencing the skill at runtime -- this means the reviewer always has the scoring protocol available without additional file reads, reducing context cost during review
- Polisher's input contract is strictly limited to 3 sources (GAP-FIX.md, specific code files, DESIGN-DNA.md) -- the thorough analysis was already done by the reviewer, so the polisher only needs the prescription and the patient
- Scope discipline rules are absolute: the polisher never changes code not listed in GAP-FIX.md and never improves adjacent code -- new issues discovered during fixing are documented as new gaps for a separate pass
- Lessons learned format includes DESIGN_SYSTEM_PROPOSALS section to capture reusable component proposals from builder SUMMARY.md files, feeding the design system growth pattern

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness
- Quality reviewer and polisher are ready for integration with build-orchestrator (02-05)
- GAP-FIX.md format is defined and consistent between both agents
- Lessons learned aggregation format is ready for orchestrator to embed in spawn prompts
- The feedback loop chain is complete: reviewer aggregates -> orchestrator embeds -> builders learn

---
*Phase: 02-pipeline-architecture*
*Completed: 2026-02-24*
