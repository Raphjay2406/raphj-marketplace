---
phase: 04-quality-enforcement
plan: 01
subsystem: quality-enforcement
tags: [reference-benchmarking, quality-targets, curated-library, comparison-protocol]

dependency_graph:
  requires: [01-04, 01-05, 02-04]
  provides: [reference-benchmarking-skill, plan-md-reference-target-format, quality-comparison-protocol]
  affects: [04-02, 04-05]

tech_stack:
  added: []
  patterns: [reference-target-embedding, 6-attribute-quality-specification, curated-library-per-archetype]

file_tracking:
  key_files:
    created:
      - skills/reference-benchmarking/SKILL.md
    modified: []

decisions:
  - id: REF-01
    decision: "6 quality attributes (Layout, Typography, Color, Motion, Depth, Micro-detail) as the standard reference target specification"
    reason: "These 6 map to the visible craft dimensions that separate premium from generic. Specific enough to be actionable, general enough to apply across all archetypes."
  - id: REF-02
    decision: "Key beats only (HOOK, PEAK, CLOSE, high-tension) get reference targets; supporting beats do not"
    reason: "Supporting beats (TEASE, BUILD, BREATHE, PROOF) derive quality from restraint and organization, not visual spectacle. Over-constraining them kills the page's breathing rhythm."
  - id: REF-03
    decision: "Top 5 archetypes (Neo-Corporate, Kinetic, Ethereal, Editorial, Luxury) get full curated reference sets; others get quality personality definitions"
    reason: "Curated libraries are content-intensive. Starting with the most common archetypes provides coverage; per-project research fills gaps for less common archetypes."
  - id: REF-04
    decision: "Reference comparison produces WARNING verdicts (not CRITICAL) -- aspirational quality bar, not blocking gate"
    reason: "Reference targets set the quality ceiling; anti-slop gate sets the quality floor. Conflating them would make the system too punitive for creative variation."
  - id: REF-05
    decision: "REVEAL beat gets conditional reference target (YES if product showcase, No if supporting)"
    reason: "REVEAL can be either a high-impact product moment or a supporting reveal. Context determines whether it needs a quality bar."

metrics:
  duration: "5 min"
  completed: "2026-02-24"
---

# Phase 4 Plan 1: Reference Benchmarking Skill Summary

**One-liner:** Per-section quality targets from award-winning sites with 6-attribute specification format, curated library for 5 archetypes, and 6-step comparison protocol for quality-reviewer.

## What Was Built

Created `skills/reference-benchmarking/SKILL.md` (568 lines) -- a 4-layer core skill defining the complete reference benchmarking system for Modulo 2.0.

### Key Components

**Reference Target Format (Layer 2):**
- PLAN.md frontmatter: `reference_target` with url, section, quality_bar, screenshot fields
- Body block: `<reference_quality_target>` with 6 mandatory quality attributes
- Each attribute requires SPECIFIC measurable details (e.g., "-0.04em tracking, gradient from white to white/40") -- not vague descriptions

**Beat Scoping (Layer 1):**
- HOOK, PEAK, CLOSE, TENSION (level 3+): YES -- get reference targets
- TEASE, BUILD, BREATHE, PROOF, PIVOT: NO -- rely on DNA + archetype
- REVEAL: Conditional (product showcase = yes, supporting = no)

**Curated Reference Library (Layer 2):**
- Full reference sets for Neo-Corporate, Kinetic, Ethereal, Editorial, Luxury (3-4 sites each with quality signals)
- Per-section quality attributes (Hero/Peak/CTA) for each archetype
- Quality personality definitions for all 14 remaining archetypes
- Researcher agent supplementation instructions for per-project freshness

**Comparison Protocol (Layer 3):**
- 6-step protocol: read target, read output, compare 6 attributes, produce verdict, write GAP-FIX, contextualize
- Per-attribute verdicts: EXCEEDS / MATCHES / BELOW
- Thresholds: 2+ BELOW = GAP-FIX entry, 4+ BELOW = major gap
- Comparison is WARNING severity (not CRITICAL) -- aspirational, not blocking

**3 Complete Examples (Layer 2):**
1. Neo-Corporate hero (Linear-style) -- split layout, gradient text, staggered entrance
2. Kinetic peak section (Basement Studio-style) -- scroll-driven, 3D, continuous interaction
3. Ethereal CTA (Stripe-style) -- extreme whitespace, single focal CTA, atmospheric

## Commits

| # | Hash | Description |
|---|------|-------------|
| 1 | 770a566 | feat(04-01): create reference-benchmarking skill with curated library and comparison protocol |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

See frontmatter `decisions` for the 5 decisions made during execution. Key decision: REVEAL beat gets conditional reference targets (not in the original plan's beat table but consistent with its design -- REVEAL can be either high-impact or supporting depending on context).

## Next Phase Readiness

- Section-planner can now reference this skill to generate `reference_target` blocks in PLAN.md
- Quality-reviewer can now reference this skill for the 6-step comparison protocol
- Researcher agent has clear instructions for supplementing the curated library
- Plan 04-02 (compositional diversity) can proceed independently
- Plan 04-05 (quality gate integration) will reference this skill's comparison protocol
