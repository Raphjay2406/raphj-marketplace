---
phase: 02-pipeline-architecture
plan: 01
subsystem: pipeline-agents
tags: [researcher, section-planner, build-orchestrator, agent-pipeline, spawn-prompts, context-rot-prevention]

dependency_graph:
  requires: [01-01, 01-02, 01-03, 01-04, 01-05]
  provides: [researcher-agent, section-planner-agent, build-orchestrator-agent, spawn-prompt-template, wave-execution-protocol]
  affects: [02-02, 02-03, 02-04, 02-05, 02-06, 02-07]

tech_stack:
  added: []
  patterns: [pipeline-with-artifact-contracts, context-injection-via-spawn-prompt, split-context-ownership, builder-type-routing]

key_files:
  created:
    - agents/pipeline/researcher.md
    - agents/pipeline/section-planner.md
    - agents/pipeline/build-orchestrator.md
  modified: []

decisions:
  - "[Agent structure]: Three specialized agents replace v6.1.0 monolithic design-lead -- researcher (external intelligence), section-planner (build specs), build-orchestrator (wave coordination)"
  - "[Research tracks]: 5 tracks (expanded from v6.1.0's 4) -- added CONTENT-VOICE for brand voice analysis alongside INDUSTRY-ANALYSIS, DESIGN-REFERENCES, COMPONENT-PATTERNS, ANIMATION-TECHNIQUES"
  - "[Context lean orchestrator]: Build-orchestrator reads only CONTEXT.md + MASTER-PLAN.md + current PLANs + SUMMARYs + DESIGN-SYSTEM.md (5 file types, not 6+)"
  - "[Full DNA in spawn prompts]: Complete DESIGN-DNA.md content embedded in every builder spawn prompt (~150 lines for DNA section alone) rather than compressed extract"
  - "[Spawn prompt structure]: 9 sections -- Full Design DNA, Section Assignment, Beat Parameters, Adjacent Sections, Layout Patterns Used, Shared Components, Content, Quality Rules, Lessons Learned"
  - "[Builder type routing]: PLAN.md frontmatter builder_type field routes to section-builder (default), 3d-specialist, animation-specialist, or content-specialist"
  - "[Beat validation embedded]: Section-planner embeds all 10 arc rules and validation process directly -- no skill file reads needed at planning time"
  - "[Layout diversity]: 5+ distinct patterns enforced, no adjacent repeats, beat-appropriate pattern complexity matching"

metrics:
  duration: "6 min"
  completed: "2026-02-24"
---

# Phase 2 Plan 1: Pipeline Agent Definitions Summary

Three core pipeline agents (researcher, section-planner, build-orchestrator) defined under agents/pipeline/ with YAML frontmatter, explicit input/output contracts, and embedded rules replacing v6.1.0's monolithic design-lead.

## What Was Built

### agents/pipeline/researcher.md (192 lines)
Parallel research agent with 5 research tracks:
1. **INDUSTRY-ANALYSIS** -- competitor sites, market positioning, design pattern gaps
2. **DESIGN-REFERENCES** -- Awwwards/Dribbble winners for archetype-matched techniques
3. **COMPONENT-PATTERNS** -- shadcn/ui, Aceternity, Magic UI, marketplace research
4. **ANIMATION-TECHNIQUES** -- GSAP, motion/react, CSS scroll-driven, choreography patterns
5. **CONTENT-VOICE** -- brand voice analysis, competitor copy, micro-copy patterns

Input: PROJECT.md only. Output: research/{TRACK}.md per track.

### agents/pipeline/section-planner.md (401 lines)
Build specification generator that produces two artifact types:
- **MASTER-PLAN.md**: wave map, dependency graph, beat assignments, layout pre-assignments, background progression, creative tension placement, wow moment distribution
- **Per-section PLAN.md**: frontmatter (section, wave, depends_on, builder_type, must_haves) + visual-specification (ASCII layouts, exact Tailwind classes, copy) + component-structure + wow-moment + creative-tension + neighbor-context + tasks + verification

Embeds all validation rules: 10 beat sequence rules, layout diversity enforcement (5+ patterns, no adjacent repeats), background progression planning, builder type assignment logic.

### agents/pipeline/build-orchestrator.md (549 lines)
Wave coordinator with strict context discipline:
- **Input contract**: CONTEXT.md + MASTER-PLAN.md + current wave PLANs + completed SUMMARYs + DESIGN-SYSTEM.md
- **Spawn prompt template**: 9-section Complete Build Context (~300 lines) with FULL Design DNA embedded
- **Post-wave coherence checkpoint**: shadow, spacing, background, layout, typography, color compliance
- **Canary check protocol**: 5 questions (3 DNA + 2 state), 3-tier scoring (healthy/degrading/rot)
- **Session management**: 2-wave soft boundary, turn 31+ hard stop, CONTEXT.md rewrite protocol
- **Builder type routing**: reads builder_type from PLAN.md, spawns correct specialist
- **Failure handling**: bubble to user, no auto-retry, pause + options (retry/skip/abort)
- **DESIGN-SYSTEM.md maintenance**: builder-proposes, orchestrator-collects pattern

## Decisions Made

| Decision | Rationale | Confidence |
|----------|-----------|------------|
| 5 research tracks (not 4) | Added CONTENT-VOICE for brand voice intelligence -- content quality is a scoring axis | HIGH |
| Orchestrator reads 5 file types max | Prevents context overload (Pitfall 3); all other context pre-extracted into PLANs by section-planner | HIGH |
| Full DNA in every spawn prompt | Builders need complete reference, not a summary -- abbreviated DNA produces generic output | HIGH |
| 9-section spawn prompt template | Covers all builder needs: identity, assignment, constraints, neighbors, content, quality, feedback | HIGH |
| Beat validation rules embedded in planner | Eliminates runtime skill file reads; rules are static and well-defined | HIGH |
| Build-orchestrator at 549 lines | Exceeds 300-400 target due to comprehensive spawn prompt template + CONTEXT.md template; all content is substantive and referenced by plan requirements | MEDIUM |

## Deviations from Plan

### Build-orchestrator exceeds line target

**Found during:** Task 2
**Issue:** Plan target was ~300-400 lines. Actual is 549 lines.
**Reason:** The plan requires embedding the full spawn prompt template with all 9 sections (each with table structures for DNA tokens), CONTEXT.md rewrite template, post-wave coherence checks, canary protocol, session management, failure handling, DESIGN-SYSTEM.md maintenance, and beat validation. All of these sections are explicitly required in the plan's verification criteria. The extra length is the template tables (color tokens, type scale, spacing, shadows) that ensure builders get structurally complete DNA.
**Impact:** No functional impact. File is well-structured with clear sections. The orchestrator reads this once at startup; length does not affect context budget at runtime.

## Next Phase Readiness

All downstream plans (02-02 through 02-07) can now reference the three core pipeline agents:
- **02-02** (creative-director): Will reference build-orchestrator's spawn prompt template and CONTEXT.md ownership split
- **02-03** (section-builder + specialists): Will implement the builder contract defined in the spawn prompt template
- **02-04** (quality-reviewer + polisher): Will reference coherence checkpoint structure and lessons learned format
- **02-05** (context protocol): Will build on CONTEXT.md rewrite protocol and canary check
- **02-06** (session management): Will build on session boundary rules
- **02-07** (hooks): Will reference per-agent lifecycle events

No blockers identified.
