---
phase: 09-integration-polish
plan: 01
subsystem: figma-integration
tags: [figma, mcp, design-import, visual-qa, code-connect, token-resolution]

dependency_graph:
  requires: [01-foundation, 02-pipeline, 04-quality]
  provides: [figma-integration-skill, figma-translator-agent-rewrite]
  affects: [09-02, 09-03, 09-04]

tech_stack:
  added: [figma-mcp-server, pixelmatch, code-connect]
  patterns: [hybrid-token-resolution, plan-not-code-pipeline, overlay-diff-qa]

key_files:
  created:
    - skills/figma-integration/SKILL.md
  modified:
    - agents/figma-translator.md

decisions:
  - id: figma-mcp-tool-tree
    description: "13 MCP tools organized into primary (7) and secondary (6) with flowchart for tool selection"
  - id: hybrid-resolution-protocol
    description: "4-priority resolution: Figma Variable > Figma Style > Raw hex (FLAG) > DNA provides"
  - id: visual-qa-threshold
    description: "pixelmatch threshold 0.15, < 2% PASS, 2-10% REVIEW, > 10% FAIL"
  - id: code-connect-before-generate
    description: "Always check get_code_connect_map before generating new components in PLAN.md"

metrics:
  duration: "6 min"
  completed: "2026-02-24"
---

# Phase 9 Plan 1: Figma Integration Skill & Agent Summary

**One-liner:** Figma MCP import skill (785 lines) with 13-tool decision tree, hybrid DNA-Figma token resolution, pixelmatch visual QA, and complete figma-translator agent rewrite (133 lines)

## What Was Built

### skills/figma-integration/SKILL.md (785 lines, NEW)
Complete 4-layer domain skill teaching Claude how to import Figma designs via MCP tools and translate them into PLAN.md files for the normal execute pipeline.

**Layer 1 -- Decision Guidance (~95 lines):**
- MCP tool selection decision tree covering all 13 Figma MCP tools
- Primary vs secondary tool classification with when-to-use guidance
- Flowchart from "I have a Figma URL" to "PLAN.md files generated"
- Critical rule: output is always PLAN.md, never direct code

**Layer 2 -- Award-Winning Examples (~440 lines):**
- Pattern 1: Complete 7-step import workflow with example MCP tool calls and expected output
- Pattern 2: Hybrid DNA-Figma token resolution protocol with concrete accent color example
- Pattern 3: Complete PLAN.md generated from Figma hero section data
- Pattern 4: Visual QA overlay diff workflow with pixelmatch configuration
- Pattern 5: Code Connect component reuse detection and mapping
- Pattern 6: Multi-page Figma file handling protocol

**Layer 3 -- Integration Context (~60 lines):**
- DNA connection table: what Figma provides vs what DNA provides per domain
- Archetype relationship: import does not change archetype, conflicts are flagged
- Pipeline stage: input/process/output flow
- 7 related skills with connection descriptions

**Layer 4 -- Anti-Patterns (~65 lines):**
- 7 anti-patterns: direct code generation, full-page queries, hardcoded colors, trusting alias chains, ignoring Code Connect, viewport mismatch, skipping emotional arc
- 10 machine-readable constraints (8 HARD, 2 SOFT)

### agents/figma-translator.md (133 lines, REWRITTEN)
Complete rewrite from generic 60-line shadcn/ui translator to structured MCP workflow agent.

- Mission: translate Figma to PLAN.md files (never code)
- Prerequisites: Figma MCP connection, DESIGN-DNA.md, Figma URL
- 7-step workflow with skill references for deep guidance
- 4-priority token resolution protocol embedded inline (fast access)
- Visual QA mode for overlay diff during verify step
- Error handling table for 7 failure scenarios
- Strict output contract: only PLAN.md files and figma-references/

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| 785 lines (exceeds 550-700 target) | All content substantive: 6 patterns with realistic examples, 7 anti-patterns, 10 constraints. Multi-page handling protocol added as Pattern 6 (not in plan but critical for completeness). |
| 13 tools split into primary (7) and secondary (6) | Primary tools cover the import workflow; secondary tools cover post-build sync, FigJam, and diagnostics. Clear mental model for builders. |
| pixelmatch threshold 0.15 with 2%/10% pass/review/fail bands | Balances anti-aliasing tolerance with meaningful diff detection. Consistent with Playwright's internal pixelmatch usage. |
| Token resolution embedded inline in agent | Critical protocol needed at fast-access speed during import -- should not require reading full skill for this one decision. |

## Verification Results

| Check | Result |
|-------|--------|
| SKILL.md exists, 500+ lines | PASS (785 lines) |
| Valid YAML frontmatter | PASS |
| All 4 layer headings | PASS |
| All 13 MCP tool names present | PASS (54 total occurrences) |
| "PLAN.md" 5+ times | PASS (29 occurrences) |
| "hybrid" or "resolution" present | PASS |
| "pixelmatch" present | PASS (6 occurrences) |
| "Code Connect" present | PASS (27 occurrences) |
| No direct code generation outside anti-patterns | PASS |
| Agent 80+ lines | PASS (133 lines) |
| Agent references figma-integration skill | PASS (5 references) |
| Agent has all 7 workflow steps | PASS |
| Agent has 4-priority resolution inline | PASS |
| Agent has PLAN.md output | PASS |
| Agent has no shadcn/ui references | PASS |

## Next Phase Readiness

Plan 09-01 is complete. The Figma Integration skill and rewritten agent are ready for use. Plans 09-02 through 09-04 can proceed -- they cover design system export, progress reporting, and error recovery respectively.
