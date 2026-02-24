---
phase: 01-foundation
plan: 03
name: "Design Archetypes Skill"
status: complete
subsystem: identity
tags: [archetypes, design-personality, constraints, color-tokens, tension-zones]

dependency_graph:
  requires: ["01-01"]
  provides: ["19 archetype definitions with machine-enforceable constraints", "archetype selection guide", "custom archetype builder", "tension override mechanism"]
  affects: ["01-02", "01-04", "01-05", "02-*", "03-*", "05-*"]

tech_stack:
  added: []
  patterns: ["named-pattern signature elements", "12-token palette per archetype", "structured constraint tables"]

file_tracking:
  key_files:
    created: []
    modified:
      - skills/design-archetypes/SKILL.md

decisions:
  - id: "arch-format"
    decision: "Single file with all 19 archetypes in structured table format"
    rationale: "1184 lines is within the 800-1250 acceptable range; structured tables are token-efficient"
  - id: "arch-ai-native"
    decision: "AI-Native defined as machine-intelligence-visible aesthetic with monospace, cool blue-purple palette, data viz as decoration"
    rationale: "No settled standard exists; synthesized from research's 'command-line rebellion' and 'machine intelligence' interpretations"
  - id: "signature-format"
    decision: "Named pattern format: name: param=value, param=value for all 19 signature elements"
    rationale: "Machine-readable, enforceable by agents extracting specific values"

metrics:
  duration: "7 min"
  completed: "2026-02-24"
---

# Phase 1 Plan 3: Design Archetypes Skill Summary

19 archetype personality systems with 12-token locked palettes, specific Google Fonts, enforceable mandatory techniques, greppable forbidden patterns, named-pattern signature elements, and 3 tension zones per archetype -- plus selection guide, custom builder, and tension override mechanism.

## Tasks Completed

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Write Archetypes Framework (Layers 1, 3, 4) | `7e6a642` | Selection guide (12 industries), tension override (4 conditions), custom builder (wizard + reference), 4 anti-patterns, DNA/arc/gate/builder integration |
| 2 | Write all 19 archetype definitions (Layer 2) | `badb6fe` | 19 archetypes with complete constraint blocks, all 12 tokens, named-pattern signatures, 3 tension zones each |

## Decisions Made

1. **Single-file structure** -- All 19 archetypes in one SKILL.md (1184 lines). Structured tables are token-efficient and the total is within the acceptable 800-1250 line range identified in RESEARCH.md.

2. **AI-Native aesthetic** -- Defined as "machine intelligence made visible" with monospace-dominant type, cool blue-to-purple palette (`#6478ff` primary), grid/scan-line patterns, data visualization as decoration, and neural-grid signature element. LOW confidence per RESEARCH.md; this is creative synthesis, not a documented standard.

3. **Named-pattern signature format** -- Every signature element uses `name: param=value, param=value` format (e.g., `exposed-grid: border-width=2px, border-color=#0a0a0a, shadow-offset=4px, shadow-blur=0`). This is machine-readable and can be parsed by agents to enforce signature element presence.

4. **12-token palette standard** -- All archetypes use the same 12 tokens (bg, surface, text, border, primary, secondary, accent, muted, glow, tension, highlight, signature). Archetypes that do not naturally use certain tokens (e.g., Brutalist has no glow) set the value to `none`.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- 19 archetype headings confirmed (programmatic count)
- All 19 archetypes have all 12 color tokens (programmatic verification)
- All 19 have: Locked Palette, Required Fonts, Mandatory Techniques, Forbidden, Signature Element, Tension Zones
- All signature elements use named-pattern format
- All 57 tension zones (19 x 3) use the 5 tension types (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock)
- File is 1184 lines (within 800-1250 target)
- 4-layer format verified: Layer 1 (Decision Guidance), Layer 2 (Archetype Definitions), Layer 3 (Integration Context), Layer 4 (Anti-Patterns)

## Next Phase Readiness

- Design DNA skill (01-02) can reference archetypes for palette population
- Anti-Slop Gate skill (01-04) can reference forbidden patterns and signature elements
- Emotional Arc skill (01-05) can reference archetype-specific arc modifications
- All downstream builder agents have structured constraint data to parse
