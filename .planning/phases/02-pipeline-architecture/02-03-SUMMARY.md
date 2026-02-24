---
phase: 02-pipeline-architecture
plan: 03
subsystem: pipeline-agents
tags: [section-builder, stateless-agent, spawn-prompt, beat-parameters, anti-slop, auto-polish, reusable-components]

dependency_graph:
  requires: [02-01]
  provides: [section-builder-agent, builder-summary-format, beat-compliance-protocol, reusable-component-proposals]
  affects: [02-05, 02-06, 02-07, 03-01, 03-02, 03-03]

tech_stack:
  added: []
  patterns: [stateless-builder-with-context-injection, embedded-quality-rules, machine-readable-summary-output, mandatory-auto-polish]

key_files:
  created:
    - agents/pipeline/section-builder.md
  modified: []

decisions:
  - "[No fallback reads]: Builder with missing spawn prompt context STOPs immediately -- no fallback to reading DESIGN-DNA.md or other files. Incomplete context produces incorrect output."
  - "[10-item auto-polish]: Light auto-polish expanded from v6.1.0's 5 items to 10 (added focus-visible, active states, custom selection color, focus order, touch targets)"
  - "[Explicit file exclusion list]: 10 specific file types listed as NOT to read (DNA, STATE, BRAINSTORM, CONTENT, REFERENCES, CONTEXT, skills, other builders' code, other SUMMARY.md, other section directories)"
  - "[Anti-context-rot DNA checks]: 3-question quick check after every task, 7-question expanded check every 3rd task, full quality gate on last task"
  - "[Machine-readable SUMMARY.md]: Frontmatter includes beat_compliance (actual vs required), anti_slop_self_check (5 booleans), reusable_components (structured proposals) for orchestrator consumption"

metrics:
  duration: "3 min"
  completed: "2026-02-24"
---

# Phase 2 Plan 3: Section Builder Agent Summary

Stateless section-builder agent (440 lines) with embedded beat parameter table, 5-item anti-slop quick check, 10-item auto-polish pass, and machine-readable SUMMARY.md output with structured reusable_components proposals for design system growth.

## What Was Built

### agents/pipeline/section-builder.md (440 lines)

The workhorse builder agent that implements individual sections from PLAN.md specifications. Completely stateless -- receives ALL context via spawn prompt from the build-orchestrator and reads exactly one file (its PLAN.md).

**Key sections:**

1. **Context Source (critical first section):** Declares all 8 spawn prompt sections the builder expects (Full DNA, Beat Assignment, Adjacent Sections, Layout Patterns, Shared Components, Content, Quality Rules, Lessons Learned). Lists 10 specific file types it does NOT read. Missing Context Guard stops immediately if spawn prompt lacks Complete Build Context -- no fallback.

2. **Embedded Beat Parameter Table:** Full 10-row table (HOOK, TEASE, REVEAL, BUILD, PEAK, BREATHE, TENSION, PROOF, PIVOT, CLOSE) with 6 columns (Height, Density, Anim Intensity, Whitespace, Type Scale, Layout Complexity). Copied from v6.1.0 with identical values. Marked as HARD CONSTRAINTS with explicit examples of violations.

3. **Embedded Quality Rules (zero skill reads):**
   - Anti-slop quick check: 5 items (DNA tokens, fonts, spacing, beat params, signature)
   - Performance rules: image optimization, animation constraints, dynamic imports, prefers-reduced-motion
   - Micro-copy rules: 4 banned phrases, outcome-driven CTA requirement, friction reducer rule

4. **Build Process (6 steps):** Internalize context, read PLAN.md, execute tasks sequentially, light auto-polish, self-verify (9 quality questions), write SUMMARY.md.

5. **Light Auto-Polish (10 items, mandatory):** Hover states, focus-visible outlines, active states, micro-transforms, texture application, smooth scroll, prefers-reduced-motion, custom selection color, focus order, touch targets.

6. **Anti-Context-Rot DNA Checks:** 3-question check after every task, 7-question expanded check every 3rd task, full quality gate on last task.

7. **SUMMARY.md Format:** Machine-readable frontmatter with beat_compliance (actual vs required for 4 metrics), anti_slop_self_check (5 boolean fields), reusable_components (structured name/path/props/usage), deviations list.

8. **Error Handling:** Three failure modes covered -- missing PLAN.md (STOP, write FAILED SUMMARY), incomplete spawn prompt (STOP, report missing sections), task failure (continue if possible, mark PARTIAL).

## Decisions Made

| Decision | Rationale | Confidence |
|----------|-----------|------------|
| No fallback file reads on missing context | v6.1.0 had a fallback to read DESIGN-DNA.md; v2.0 removes this because partial context produces subtly wrong output that is harder to catch than a hard stop | HIGH |
| 10-item auto-polish (expanded from v6.1.0's 5) | Added focus-visible, active states, custom selection, focus order, touch targets -- these are accessibility and polish requirements that were implicit in v6.1.0 | HIGH |
| 440 lines (within 350-450 target) | All content is substantive: beat table, 3 embedded rule sets, 10-item polish list, structured SUMMARY format, error handling. No padding | HIGH |
| 9-question self-verify checklist | Covers beat compliance, choreography, wow moments, creative tension, performance, micro-copy, copy accuracy, visual spec compliance, and the "screenshot test" | HIGH |
| Dead code prevention as explicit step | Builders creating unused code waste context and cause confusion for reviewers; explicit check prevents this | HIGH |

## Deviations from Plan

None -- plan executed exactly as written.

## Next Phase Readiness

The section-builder agent completes the core pipeline agent set (researcher, section-planner, build-orchestrator, creative-director, quality-reviewer, polisher, section-builder). Remaining 02-phase plans can now reference all 7 pipeline agents:

- **02-05** (context protocol): Will reference section-builder's "do NOT read" contract and SUMMARY.md output format
- **02-06** (session management): Will reference the anti-context-rot DNA checks embedded in the builder
- **02-07** (hooks): Will reference builder lifecycle events

No blockers identified.
