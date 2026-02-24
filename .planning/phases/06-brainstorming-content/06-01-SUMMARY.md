---
phase: 06-brainstorming-content
plan: 01
subsystem: brainstorming
tags: [design-brainstorm, research-first, competitive-teardown, industry-library, creative-direction, brainstorm-protocol]

dependency_graph:
  requires: [06-02, 06-03, 01-02, 01-03, 01-05]
  provides: [design-brainstorm-skill, 7-phase-brainstorm-protocol, curated-industry-library, competitive-teardown-framework, brainstorm-md-format]
  affects: [08-08]

tech_stack:
  added: []
  patterns: [7-phase-sequential-protocol, 3-dimension-competitive-teardown, 12-vertical-industry-library, research-first-ideation]

file_tracking:
  key_files:
    created:
      - skills/design-brainstorm/SKILL.md
    modified: []

decisions:
  - id: "06-01-01"
    decision: "615 lines within 600-800 target -- all content substantive (12 verticals with 6-8 sites each, full teardown template, 7-phase protocol)"
    rationale: "Comprehensive coverage required for the core brainstorm orchestrating skill"
    confidence: HIGH
  - id: "06-01-02"
    decision: "9 skills in reference map (added awwwards-scoring alongside the 8 specified in plan)"
    rationale: "awwwards-scoring provides competitive benchmarking framework referenced during Phase 3 teardown"
    confidence: HIGH
  - id: "06-01-03"
    decision: "Command integration references start-project (not start-design) -- matches actual command naming"
    rationale: "Verified commands directory contains start-project.md, not start-design.md"
    confidence: HIGH

metrics:
  duration: "7 min"
  completed: "2026-02-24"
---

# Phase 6 Plan 01: Design Brainstorm Skill Summary

**One-liner:** Research-first brainstorm protocol with 7 sequential phases, 12-vertical curated industry library (85+ pattern-described sites), 3-dimension competitive teardown, and BRAINSTORM.md output format integrating cross-pollination, creative-direction-format, and copy-intelligence skills.

## What Was Done

### Task 1: Research Protocol and Curated Industry Library
**Commit:** `ec2a3ec`

Created `skills/design-brainstorm/SKILL.md` (615 lines) -- a complete research-first creative direction engine replacing the previously culled lightweight framework.

**Key content delivered:**
- **7-phase brainstorm protocol** (Brief Extraction, Industry Research, Competitive Teardown, Archetype Shortlisting, Direction Generation, User Selection/Mixing, Brand Voice Generation) -- prescriptive, sequential, no phase skippable
- **Competitive teardown framework** with 3 mandatory dimensions per reference: Visual Patterns (color, typography, layout, depth, motion, signature), Content Strategy (headline style, CTA philosophy, social proof, narrative approach, voice), UX Flow Analysis (first impression, scroll depth, conversion path, mobile strategy)
- **Curated Industry Reference Library** covering 12 verticals with 6-8 exemplary sites each, pattern-based descriptions that survive redesigns, visual landscape summaries, content patterns, and differentiation opportunities per vertical
- **Multi-industry project handling** protocol for projects spanning multiple verticals

### Task 2: Integration Context, BRAINSTORM.md Format, and Anti-Patterns
**Commit:** `0584aeb`

Completed the skill with integration context, output format, and quality enforcement:

- **Skill Reference Map** with 9 skill connections: design-archetypes (Phase 4), cross-pollination (Phase 2+5), creative-direction-format (Phase 5+6), copy-intelligence (Phase 7), emotional-arc (Phase 5), creative-tension (Phase 5), micro-copy (Phase 5), awwwards-scoring (Phase 3), design-dna (Phase 6)
- **BRAINSTORM.md output format** with all required sections: Research Summary, Archetype Shortlist, 3 Creative Directions (full concept boards), Distinctness Validation, Competitive Benchmark Comparison, Selection, Mixing Notes, Final Direction Summary with DNA Seed Values, Brand Voice confirmation
- **Command integration** documenting start-project Phase 3/3.5 relationship (this skill produces the seed, start-project converts to DNA)
- **DNA Connection table** mapping 7 concept board sections to their corresponding DNA tokens
- **6 anti-patterns**: Blank Slate Ideation, Reference Tourism, Safe Shortlisting, Copy-Paste Archetype, Thin Directions, Forgetting Phase 7
- **10 machine-readable constraints** for automated enforcement (7 HARD, 3 SOFT)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Command name correction: start-design -> start-project**
- **Found during:** Task 2 (Command Integration section)
- **Issue:** Plan references `start-design` command but actual command is `start-project.md`
- **Fix:** Used correct command name `start-project` throughout the skill
- **Files modified:** skills/design-brainstorm/SKILL.md

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | 615 lines within 600-800 target | All content substantive -- 12 verticals need 6-8 sites each, teardown template is detailed, 7-phase protocol is prescriptive |
| 2 | 9 skills in reference map (plan specified 8 + awwwards-scoring) | awwwards-scoring provides competitive benchmarking during Phase 3 teardown -- natural integration point |
| 3 | start-project command (not start-design) | Verified actual command naming in commands/ directory |

## Verification Results

| Check | Result |
|-------|--------|
| File exists, 600-800 lines | PASS -- 615 lines |
| Valid YAML frontmatter with name | PASS -- `name: design-brainstorm` |
| 7-phase brainstorm protocol complete | PASS -- all 7 phases with prescriptive language |
| Competitive teardown has 3 dimensions | PASS -- Visual Patterns, Content Strategy, UX Flow Analysis |
| Curated library covers 12 verticals | PASS -- 12 verticals, each with 6-8 sites |
| Each vertical has differentiation opportunities | PASS -- 12 instances |
| Skill Reference Map has 8+ skills | PASS -- 9 skills mapped |
| BRAINSTORM.md format fully defined | PASS -- all sections present |
| Command integration documented | PASS -- start-project Phase 3/3.5 flow |
| Multi-industry handling documented | PASS -- in Phase 2 protocol |
| 6 anti-patterns present | PASS -- with actionable alternatives |
| References to cross-pollination | PASS -- 7 references |
| References to creative-direction-format | PASS -- 11 references |
| References to copy-intelligence | PASS -- 4 references |
| Prescriptive language | PASS -- MUST, REQUIRED, MANDATORY, Do NOT throughout |
| Machine-readable constraints | PASS -- 10 parameters |

## Commits

| Hash | Message |
|------|---------|
| ec2a3ec | feat(06-01): write design-brainstorm research protocol and curated industry library |
| 0584aeb | feat(06-01): complete design-brainstorm integration context, BRAINSTORM.md format, and anti-patterns |

## Next Phase Readiness

Plan 06-01 completes the design-brainstorm skill rewrite. This was the final dependency in Phase 6 -- all 4 brainstorming and content skills are now complete:
- `design-brainstorm` (06-01) -- the orchestrating protocol
- `cross-pollination` (06-02) -- industry rule catalogs and distant-industry borrowing
- `creative-direction-format` (06-03) -- concept board template and distinctness validation
- `copy-intelligence` (06-04) -- brand voice generation and content bank

Phase 6 is fully complete. Ready for Phase 7 planning.
