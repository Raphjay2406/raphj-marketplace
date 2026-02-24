---
phase: 09-integration-polish
plan: 03
subsystem: progress-reporting
tags: [progress, state-management, wave-summary, review-gate, screenshots, reporting-protocol]

requires:
  - "Phase 2 (design-lead agent, build-orchestrator agent, STATE.md format)"
  - "Phase 4 (quality-gate-protocol, anti-slop-gate scoring tiers)"

provides:
  - "4-tier progress reporting protocol (task/section/wave/milestone)"
  - "STATE.md budget management rules (100-line limit enforcement)"
  - "Screenshot protocol (4 breakpoints, final-wave-only automatic capture)"
  - "Wave review gate specification (hard gate with user approval)"
  - "FAILURE-LOG.md overflow format for detailed error diagnostics"

affects:
  - "09-04 (error recovery references failure reporting format from this skill)"

tech-stack:
  added: []
  patterns:
    - "Tiered reporting: machine-readable STATE.md + human-friendly conversation output"
    - "Budget-aware state management: 100-line cap with current-wave scoping"
    - "Hard review gates: mandatory user approval at wave boundaries"

key-files:
  created:
    - skills/progress-reporting/SKILL.md
  modified: []

decisions:
  - "[Skill structure]: Full standalone skill (not agent protocol extension) -- research suggested protocol extensions but the PLAN.md specified a complete 4-layer skill, which provides better discoverability and self-documentation"
  - "[Reporting tiers]: 4 tiers (task/section/wave/milestone) with escalating verbosity -- per-task is machine-only, per-section is one-liner, wave is detailed, milestone is comprehensive"
  - "[Screenshot timing]: Automatic after final wave only, mid-build on explicit request -- avoids performance overhead of browser automation during active builds"
  - "[STATE.md scope]: Current wave task data only, previous waves cleared on new wave start -- enforces 100-line budget naturally"
  - "[Failure overflow]: FAILURE-LOG.md as dedicated overflow destination with max 5 entries in STATE.md -- prevents diagnostic bloat"

metrics:
  duration: "4 min"
  completed: "2026-02-24"
---

# Phase 9 Plan 3: Progress Reporting Skill Summary

**One-liner:** 4-tier progress reporting skill with STATE.md budget management, wave review gates, and 4-breakpoint screenshot protocol

## What Was Built

A complete progress-reporting skill (`skills/progress-reporting/SKILL.md`, 539 lines) defining the multi-level reporting protocol for Modulo's wave-based build system. The skill teaches the design-lead, build-orchestrator, and section-builder agents exactly how and when to report status at four tiers:

1. **Tier 1 (Task):** Machine-readable STATE.md table rows updated at task completion only. No conversation output. Max 20 rows (current wave only).
2. **Tier 2 (Section):** Compact one-liner in conversation when all tasks in a section complete. Includes beat type and layout pattern.
3. **Tier 3 (Wave):** Detailed wave summary with section table, anti-slop score (with tier label), DNA compliance, layout diversity, canary check, next wave preview, and mandatory "Awaiting user approval" review gate.
4. **Tier 4 (Milestone):** Full build report with all quality scores, Awwwards estimates, performance metrics, auto-fix summary, and screenshot references.

The skill also defines:
- STATE.md budget management (100-line limit with line allocation breakdown)
- FAILURE-LOG.md overflow format for detailed error diagnostics
- Screenshot protocol (375/768/1024/1440px breakpoints, automatic after final wave only)
- Review gate protocol (hard gate, explicit user approval required)
- 7 anti-patterns covering common reporting mistakes
- 10 machine-readable constraints for automated enforcement

## Files Created

- `skills/progress-reporting/SKILL.md` (539 lines): Complete 4-layer skill with YAML frontmatter, decision guidance, 7 example patterns, integration context, 7 anti-patterns, and machine-readable constraints table

## Dependencies Added

None -- this is a markdown skill file with no code dependencies.

## Integration Notes

- The design-lead agent references this skill during wave orchestration for Tier 2/3/4 templates
- Section builders contribute to Tier 1 via SUMMARY.md frontmatter (tasks_completed, duration, auto_fixes)
- The quality-gate-protocol skill provides anti-slop scores consumed by wave summaries
- The error-recovery skill (09-04) will reference the failure reporting format defined here

## Deviations from Plan

None -- plan executed exactly as written. The skill came in at 539 lines, slightly above the 400-500 target, but all content is substantive (7 patterns with complete markdown templates, 7 anti-patterns, detailed STATE.md budget allocation, FAILURE-LOG.md format).
