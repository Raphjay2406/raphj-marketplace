---
phase: "06-brainstorming-content"
plan: "03"
subsystem: "brainstorming"
tags: ["creative-direction", "concept-board", "ascii-mockup", "distinctness-validation", "free-mixing"]

dependency-graph:
  requires: ["01-03 (design-archetypes)", "01-05 (emotional-arc)", "05-02 (creative-tension)"]
  provides: ["creative-direction-format skill -- concept board template, ASCII mockup system, distinctness validation, free mixing protocol"]
  affects: ["06-01 (design-brainstorm references this format)", "06-02 (cross-pollination rule-break format)"]

tech-stack:
  added: []
  patterns: ["Concept board template with 11 mandatory sections", "Standardized ASCII symbol vocabulary (12 symbols)", "6-dimension distinctness validation matrix", "7-step free mixing protocol with coherence check"]

file-tracking:
  key-files:
    created: ["skills/creative-direction-format/SKILL.md"]
    modified: []

decisions:
  - id: "06-03-01"
    decision: "12 ASCII symbols in vocabulary (exceeds 8 minimum)"
    reasoning: "Added //text// for alternative state notes beyond the specified set for richer mockup annotation"
  - id: "06-03-02"
    decision: "Worked example uses Neo-Corporate archetype for fictional SaaS analytics platform"
    reasoning: "Most relatable example for typical plugin users; demonstrates moderate tension level and data-heavy content"
  - id: "06-03-03"
    decision: "Motion Identity has exactly 7 sub-items as HARD constraint"
    reasoning: "Motion is 25% of Awwwards Design score; each sub-item captures a distinct motion dimension that builders need"

metrics:
  duration: "5 min"
  completed: "2026-02-24"
---

# Phase 6 Plan 3: Creative Direction Format Summary

Concept board template, ASCII mockup system, distinctness validation matrix, and free mixing protocol in a 589-line skill that turns brainstorm output into rich, decision-enabling direction presentations.

## What Was Built

### Task 1: Concept Board Template and ASCII Mockup System

Created `skills/creative-direction-format/SKILL.md` (589 lines) containing:

**Layer 1 -- Decision Guidance:**
- When/when-not-to-use guidance, direction assembly process (7 steps), 3-directions-per-brainstorm rule
- Pipeline connection to design-brainstorm (output format), creative director agent (consumer), Design DNA generation (downstream)

**Layer 2 -- Full Concept Board Template:**
- 11 mandatory sections per direction: Identity, Color Mood (12 tokens with character descriptions), Typography Pairing (with sample headline in voice), Motion Identity (7 sub-items), ASCII Hero Mockup, ASCII Sample Section Mockup, Tension Plan Preview, Emotional Arc Suggestion, Constraint Breaks, Why This Direction
- Complete worked example: "Quiet Authority" direction for a SaaS analytics platform using Neo-Corporate archetype -- realistic, award-caliber quality benchmark
- Standardized ASCII mockup format with 12-symbol vocabulary and 7 enforced rules (56-char width, mandatory annotations, viewport heights, motion notes, background specs)
- 5 canonical ASCII mockup templates: Cinematic Hero, Editorial Hero, Bento Features, Split Proof, Minimal CTA

**Layer 3 -- Integration Context:**
- Distinctness validation matrix across 6 dimensions (archetype, color mood, motion style, tension level, typography voice, layout philosophy) with pass/fail at 3+ dimensions
- 7-step free mixing protocol with coherence checking (conflict detection, resolution options, final synthesis)
- BRAINSTORM.md output format specification
- DNA connection table mapping concept board sections to Design DNA tokens
- Archetype variant table showing how concept boards adapt for HIGH/LOW tension and motion/typography-led archetypes

**Layer 4 -- Anti-Patterns:**
- Three Shades of Beige (same archetype, different colors)
- ASCII Art Theater (pretty boxes, no layout communication)
- Motion Afterthought (single-word motion descriptions)
- Missing the "Why" (visual specs without strategic rationale)
- False Choice (two safe + one wild card for rejection)

**Machine-Readable Constraints:** 10 parameters including directions count, section count, color tokens, motion sub-items, ASCII dimensions, distinctness threshold, and mixing protocol steps.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | 12 ASCII symbols in vocabulary | Added //text// for alternative state notes beyond the 8-symbol minimum for richer mockup annotation |
| 2 | Neo-Corporate archetype for worked example | Most relatable for typical users; demonstrates moderate tension and data-heavy content well |
| 3 | 7 motion sub-items as HARD constraint | Motion is 25% of Awwwards Design score; incomplete motion specs guarantee sub-8.0 scores |

## Verification Results

| Check | Result |
|-------|--------|
| File exists, 500-600 lines | PASS (589 lines) |
| Valid YAML frontmatter with name | PASS |
| All 11 concept board sections present | PASS (template + worked example = 20 matches) |
| At least 1 full worked example | PASS ("Quiet Authority" SaaS direction) |
| ASCII symbol vocabulary 8+ symbols | PASS (12 symbols) |
| 3-5 canonical ASCII templates | PASS (5 templates) |
| Distinctness matrix with 6 dimensions | PASS |
| Free mixing protocol 7 steps | PASS |
| All 5 anti-patterns present | PASS |
| References emotional-arc (beat types) | PASS |
| References creative-tension (tension levels) | PASS |
| References design-archetypes | PASS |

## Commits

| Hash | Message |
|------|---------|
| 24b36a5 | feat(06-03): create creative-direction-format skill with concept boards, ASCII mockups, and mixing protocol |

## Next Phase Readiness

Plan 06-03 is complete. The creative-direction-format skill provides the output template that plan 06-01 (design-brainstorm rewrite) will reference for direction presentation. No blockers identified.
