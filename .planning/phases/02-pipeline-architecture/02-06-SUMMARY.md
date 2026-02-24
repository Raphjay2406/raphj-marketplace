---
phase: 02-pipeline-architecture
plan: 06
subsystem: context-rot-prevention
tags: [context-rot, canary-check, session-management, CONTEXT.md, 6-layer-defense, protocol]

dependency_graph:
  requires: [02-01]
  provides: [context-rot-prevention-protocol, canary-check-protocol, CONTEXT.md-lifecycle, session-boundary-rules]
  affects: [02-05, 02-07]

tech_stack:
  added: []
  patterns: [6-layer-defense-in-depth, canary-check-recall-testing, structural-session-boundaries, split-context-ownership]

key_files:
  created:
    - agents/protocols/context-rot-prevention.md
    - agents/protocols/canary-check.md
  modified: []

decisions:
  - "[CONTEXT.md lifecycle]: Full rewrite after every wave (not append). Creative notes trimmed to last wave only. Target 80-100 lines with compression rules if exceeded"
  - "[CONTEXT.md ownership]: Split -- orchestrator writes DNA Identity, Build State, Emotional Arc, Feedback Loop, Next Wave Instructions; CD writes Creative Direction Notes"
  - "[Canary scoring]: 3-tier with real consequences -- HEALTHY (5/5), DEGRADING (3-4/5), ROT_DETECTED (0-2/5 triggers mandatory session boundary)"
  - "[Session boundaries]: Three triggers -- soft (every 2 waves), hard (turn 31+), canary-triggered (score 0-2)"
  - "[Anti-gaming]: Orchestrator must answer all 5 canary questions from memory BEFORE reading any files"
  - "[Warning signs]: 15 specific observable indicators across identity drift, state drift, and creative drift categories"

metrics:
  duration: "4 min"
  completed: "2026-02-24"
---

# Phase 2 Plan 6: Context Rot Prevention Protocols Summary

6-layer structural defense system against LLM attention degradation, with CONTEXT.md lifecycle fully defined and canary check protocol that tests both DNA identity recall and build state recall after every wave.

## What Was Built

### agents/protocols/context-rot-prevention.md (340 lines)
Complete 6-layer defense system documentation:

1. **Layer 0 -- Pre-Commit Hook** (zero context cost): Shell script greps committed files for raw hex, Tailwind defaults, system fonts, banned micro-copy. Hard block, no override
2. **Layer 1 -- CONTEXT.md Anchoring** (low cost): Single source of truth file rewritten after every wave. Full format spec with 6 sections, split ownership, and 80-100 line target with compression rules
3. **Layer 2 -- Pre-Extracted Spawn Prompts** (amortized cost): Orchestrator pre-extracts ALL context into builder spawn prompts. 9 sections covering DNA, assignment, beat, neighbors, layout, components, content, quality, lessons
4. **Layer 3 -- Canary Checks** (minimal cost): 5 questions from memory after every wave. References canary-check.md for full protocol
5. **Layer 4 -- Session Boundaries** (zero cost): Three trigger types (soft/hard/canary-triggered) with specific thresholds and resume protocol
6. **Layer 5 -- Baked-In Rules** (zero cost): Critical rules embedded directly in agent system prompts. Table of what each agent embeds and approximate line counts

Also includes: 15 warning signs (identity drift, state drift, creative drift), detection-to-resolution workflow (flag, present options, record, evaluate session state), and layer interaction summary showing defense-in-depth.

### agents/protocols/canary-check.md (217 lines)
Canary check protocol with:
- **5 questions**: 3 DNA recall (display font, accent hex, forbidden patterns) + 2 state recall (layout patterns used, next beat type)
- **Procedure**: answer from memory, verify against CONTEXT.md, score, record and act
- **3-tier scoring**: HEALTHY/DEGRADING/ROT_DETECTED with specific actions at each level (including 4/5 vs 3/5 differentiation)
- **Question substitution**: rules for adapting questions per project (3 DNA + 2 state invariant, unambiguous answers)
- **Anti-gaming**: answer before reading, no hedging, honest scoring
- **Integration**: Step 9 in wave execution protocol (after coherence, before CONTEXT.md rewrite)
- **Worked example**: Full canary check with scoring demonstration

## Decisions Made

| Decision | Rationale | Confidence |
|----------|-----------|------------|
| CONTEXT.md full rewrite (not append) after every wave | Appending grows file unboundedly; rewriting keeps it at 80-100 lines and forces orchestrator to synthesize current state | HIGH |
| Split CONTEXT.md ownership (orchestrator + CD) | Orchestrator owns build state, CD owns creative direction -- matches authority separation across pipeline | HIGH |
| 15 specific warning signs with severity ratings | Observable indicators let any agent (not just canary) flag drift. Severity helps prioritize response | HIGH |
| Canary questions adaptable per project | Default 5 questions work for most projects, but principle (3 identity + 2 state) is more important than specific questions | HIGH |
| Answer-before-reading anti-gaming rule | If orchestrator reads CONTEXT.md first, canary tests reading comprehension not recall -- defeats the purpose | HIGH |
| canary-check.md at 217 lines (above 100-150 target) | Extra 67 lines from question substitution rules and worked example -- both substantive for implementability | MEDIUM |

## Deviations from Plan

### canary-check.md exceeds target line count

**Found during:** Task 2
**Issue:** Plan target was 100-150 lines. Actual is 217 lines.
**Reason:** Added question substitution rules section (~30 lines) for project-specific adaptation, and a worked example (~25 lines) showing a complete canary check with scoring. Both improve implementability -- an agent following this protocol benefits from seeing what a real check looks like.
**Impact:** No functional impact. All content is substantive and directly referenced by protocol requirements.

## Next Phase Readiness

- **02-05** (context passing protocol): Can now reference CONTEXT.md format and lifecycle defined in context-rot-prevention.md
- **02-07** (hooks): Can now reference Layer 0 (pre-commit hook) specification for implementation details
- Both protocol files are complete and self-contained -- no dependencies on unwritten plans

No blockers identified.
