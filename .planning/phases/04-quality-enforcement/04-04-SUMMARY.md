---
phase: 04-quality-enforcement
plan: 04
subsystem: testing
tags: [playwright-mcp, lighthouse, axe-core, fps-monitoring, browser-testing, accessibility, performance]

# Dependency graph
requires:
  - phase: 02-pipeline-architecture
    provides: "quality-reviewer agent that executes this testing protocol"
  - phase: 01-foundation
    provides: "anti-slop-gate scoring thresholds, skill 4-layer format"
provides:
  - "5-step live browser testing protocol (screenshots, Lighthouse, axe-core, FPS, report)"
  - "Hard-fail thresholds for pipeline gating (Lighthouse <80, critical a11y, FPS <30)"
  - "Graceful degradation path when Playwright MCP is unavailable"
  - "Structured testing report format with per-check PASS/WARN/FAIL verdicts"
affects: [04-05-quality-gate-protocol, 08-surviving-skill-rewrites]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Playwright MCP as primary browser automation tool for quality verification"
    - "CDN injection pattern for axe-core accessibility auditing"
    - "rAF-based FPS monitoring with 500ms sampling intervals"
    - "Graceful degradation protocol for optional MCP tools"

key-files:
  created:
    - "skills/live-testing/SKILL.md"
  modified: []

key-decisions:
  - "FPS monitoring is a signal for investigation, not absolute ground truth -- automated scroll differs from real user scrolling"
  - "axe-core injected from CDN as primary approach, CLI fallback if CDN fails"
  - "Testing report uses 3-tier verdict: CRITICAL_FAIL / WARNINGS_ONLY / PASS"
  - "7 anti-patterns defined covering frequency, timing, interpretation, and degradation"

patterns-established:
  - "5-step sequential protocol: screenshots -> Lighthouse -> axe-core -> FPS -> report"
  - "Degradation table: each test has a with-MCP and without-MCP path"
  - "Machine-readable constraints table for enforceable thresholds"

# Metrics
duration: 3min
completed: 2026-02-24
---

# Phase 4 Plan 04: Live Testing Skill Summary

**5-step browser testing protocol using Playwright MCP with Lighthouse, axe-core, FPS monitoring, 4-breakpoint screenshots, and graceful degradation for MCP-unavailable environments**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-24T05:08:56Z
- **Completed:** 2026-02-24T05:12:15Z
- **Tasks:** 1
- **Files created:** 1

## Accomplishments

- Created live-testing skill (526 lines) with complete 5-step protocol the quality-reviewer agent can execute step-by-step
- Defined unambiguous thresholds: Lighthouse < 80 = CRITICAL FAIL, critical axe-core = CRITICAL FAIL, FPS < 30 = CRITICAL FAIL
- Included exact JavaScript snippets for FPS monitoring (rAF counter) and axe-core injection (CDN script)
- Built graceful degradation protocol so testing works even without Playwright MCP
- Structured testing report format with per-check verdicts and overall PASS/CRITICAL_FAIL/WARNINGS_ONLY

## Task Commits

Each task was committed atomically:

1. **Task 1: Create live-testing skill with 4-step protocol and MCP integration** - `f850027` (feat)

**Plan metadata:** [pending]

## Files Created/Modified

- `skills/live-testing/SKILL.md` - 4-layer skill defining the automated browser testing protocol: 5-step process (screenshots, Lighthouse, axe-core, FPS, report), hard-fail thresholds, JS snippets, report format, graceful degradation

## Decisions Made

- FPS monitoring positioned as a signal for investigation rather than absolute truth -- rAF readings during Playwright automated scroll do not perfectly replicate real user scrolling physics
- axe-core primary injection via CDN (`cdnjs.cloudflare.com`) with CLI fallback (`@axe-core/cli`) -- avoids requiring npm install in target project
- Testing report uses 3-tier overall verdict (CRITICAL_FAIL / WARNINGS_ONLY / PASS) matching the quality-gate-protocol severity system
- 7 anti-patterns defined (more than the typical 3-5) because testing has many common failure modes: too-frequent testing, testing before polish, FPS over-reliance, ignoring degradation, over-escalating a11y, screenshots without comparison, desktop-only testing

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None -- no external service configuration required.

## Next Phase Readiness

- Live testing skill ready for quality-reviewer agent integration (skill listed in agent's `skills` frontmatter)
- Testing report format ready for quality-gate-protocol to consume and act on
- Graceful degradation ensures testing works in any user environment
- The quality-gate-protocol (plan 04-05) can now reference this skill's verdict system for pipeline decisions

---
*Phase: 04-quality-enforcement*
*Completed: 2026-02-24*
