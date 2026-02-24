---
phase: 06-brainstorming-content
plan: 02
subsystem: brainstorming
tags: [cross-pollination, industry-rules, constraint-breaking, distant-industry-borrowing, coherence-guardrails]

dependency_graph:
  requires: [01-03, 01-02]
  provides: [cross-pollination-skill, industry-rule-catalogs, constraint-breaking-protocol, coherence-guardrails]
  affects: [06-01, 08-08]

tech_stack:
  added: []
  patterns: [industry-vertical-catalog, double-coherence-gate, boldness-calibration, constraint-breaking-protocol]

file_tracking:
  key_files:
    created:
      - skills/cross-pollination/SKILL.md
    modified: []

decisions:
  - id: "06-02-01"
    decision: "12 industry verticals organized by industry (not archetype) with principle-level cross-pollination pairings"
    rationale: "Industry is the primary research axis -- users say 'I'm building SaaS' not 'I want Neo-Corporate'. Organizing by industry enables direct lookup during brainstorm."
    confidence: HIGH
  - id: "06-02-02"
    decision: "Each cross-pollination pairing describes a design PRINCIPLE with MANIFESTS AS + DNA COMPATIBILITY fields, never surface traits"
    rationale: "Surface-level borrowing ('use serifs from fashion') is what generic AI tools produce. Principle-level borrowing creates genuine differentiation."
    confidence: HIGH
  - id: "06-02-03"
    decision: "Double coherence guardrail as mandatory validation before presenting any break to user"
    rationale: "Prevents impossible directions from being approved. Gate 1 (DNA token expressibility) ensures buildability. Gate 2 (archetype compatibility) ensures personality coherence."
    confidence: HIGH

metrics:
  duration: "6 min"
  completed: "2026-02-24"
---

# Phase 6 Plan 02: Cross-Pollination Skill Summary

**One-liner:** Industry rule catalogs (12 verticals, 51 rules) with distant-industry pairing matrix and double-gate coherence validation for structured convention-breaking during brainstorm.

## What Was Done

### Task 1: Write Industry Rule Catalogs and Cross-Pollination Pairing Matrix
**Commit:** `baf1207`

Created `skills/cross-pollination/SKILL.md` (485 lines) -- a complete industry rule catalog and distant-industry borrowing system with structured coherence guardrails.

**Key content delivered:**
- **12 industry verticals** with 6-8 exemplary sites described as patterns (not just URLs), 4-6 breakable conventions per vertical (51 total rules), and 2-3 principle-level cross-pollination pairings per vertical (26 total pairings)
- **Constraint-breaking protocol** with structured format: INDUSTRY RULE / WE BREAK THIS BY / BORROWED FROM / WHY / DNA EXPRESSION / ARCHETYPE CHECK -- each field mandatory, each break individually approvable
- **Double coherence guardrail**: Gate 1 (DNA Token Expressibility) checks that borrowed elements map to the 12-token color system, type scale, spacing, and motion tokens. Gate 2 (Archetype Compatibility) checks against forbidden patterns and mandatory techniques
- **Boldness calibration table** linking archetype personality to break count: Conservative (1), Moderate (1-2), Bold (2-3), Luxury/Ethereal (1 high-refinement)
- **5 anti-patterns**: Surface-Level Borrowing, Kitchen Sink Pollination, Breaking Without Rebuilding, Ignoring Coherence Gates, Safe Adjacent Borrowing
- **10 machine-readable constraints** for automated enforcement of break counts, gate requirements, and distance minimums
- **Integration context** mapping borrowed principles to creative-tension levels, design-brainstorm workflow, and DNA token generation

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Industry-first organization**: Verticals organized by industry (SaaS, Fashion, etc.) not by archetype -- matches how users describe projects during discovery
2. **Principle-level enforcement**: Every PAIR WITH entry must include BORROW (principle), MANIFESTS AS (implementation), and DNA COMPATIBILITY (token mapping) -- no surface-level borrowing allowed
3. **Mandatory double gate**: Both coherence gates must pass before any break is presented to users -- failed breaks are replaced, never shown

## Verification Results

| Check | Result |
|-------|--------|
| File exists with valid YAML | PASS -- `name: cross-pollination` |
| 4-layer format | PASS -- Decision Guidance, Industry Library, Integration Context, Anti-Patterns |
| All 12 industry verticals | PASS -- 12 verticals with pattern-described sites |
| 4-6 rules per vertical | PASS -- 51 total rules across 12 verticals |
| 2-3 pairings per vertical | PASS -- 26 total pairings |
| Constraint-breaking protocol format | PASS -- RULE/BREAK/BORROWED/WHY/DNA/ARCHETYPE all present |
| Double coherence guardrail | PASS -- Gate 1 (DNA) + Gate 2 (Archetype) explicitly defined |
| Boldness calibration table | PASS -- 4 archetype categories with break counts |
| 5 anti-patterns | PASS -- all with Name, What Goes Wrong, Instead |
| Principle-level pairings | PASS -- 26 MANIFESTS AS instances, 16 principle references |
| design-archetypes integration | PASS -- 5 references to archetype compatibility |
| design-dna integration | PASS -- 10 references to DNA tokens |
| Line count in range | PASS -- 485 lines (target 400-500) |

## Next Phase Readiness

Plan 06-02 delivers the cross-pollination and constraint-breaking methodology. The design-brainstorm skill (Plan 06-01) references this skill during creative direction generation. The copy-intelligence skill (Plan 06-04) and creative-direction-format skill (Plan 06-03) are independent.
