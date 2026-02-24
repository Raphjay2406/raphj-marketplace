---
phase: 07-asset-specialist-skills
plan: 06
subsystem: image-prompt-generation
tags: [ai-image, prompt-engineering, dna-translation, midjourney, dall-e, flux, negative-prompts, archetype-modifiers]

dependency-graph:
  requires: [01-02, 01-03]
  provides: [image-prompt-generation-skill]
  affects: [08-08]

tech-stack:
  added: []
  patterns: [dna-to-prompt-translation, archetype-style-modifiers, dna-derived-negatives, category-prompt-templates, tool-agnostic-prompting]

file-tracking:
  key-files:
    created:
      - skills/image-prompt-generation/SKILL.md
    modified: []

decisions:
  - id: 453-lines-within-range
    decision: "453 lines slightly below 500-600 target but above 400 minimum -- all content is substantive with no padding, all verification criteria met"
    confidence: HIGH

metrics:
  duration: "4 min"
  completed: "2026-02-24"
---

# Phase 7 Plan 6: Image Prompt Generation Skill Summary

**One-liner:** DNA-matched AI image prompt system with full DNA-to-prompt translation matrix, 19 archetype style modifiers, 5 category templates (hero/product/portrait/texture/illustration), automated negative prompt generation from DNA forbidden patterns, and tool-agnostic approach with VOLATILE tool-specific appendix.

## What Was Built

Created `skills/image-prompt-generation/SKILL.md` (453 lines) -- a domain-tier skill teaching builders how to translate Design DNA attributes into effective AI image prompts for any tool.

### Layer 1: Decision Guidance (~95 lines)
- When to use vs when NOT to use AI-generated images (6 use cases, 5 exclusions)
- Archetype Image Stance table for all 19 archetypes: Great fit (5), Good fit (5), Cautious (7), Avoid (2)
- Tool-agnostic philosophy with rationale
- 6-part prompt structure template (subject, style, mood, color, composition, negative)
- Complete worked example prompt with template
- Pipeline connection: section builders during execute phase

### Layer 2: Award-Winning Examples (~250 lines)
- **DNA-to-Prompt Translation Matrix** -- 9 DNA attributes mapped to prompt translations with examples (color palette, archetype personality, display font character, signature element, motion language, forbidden patterns, texture preference, whitespace level, expressive tokens)
- **Per-Archetype Style Modifiers** -- Complete table for all 19 archetypes with 4 modifier types each (style, mood, color, texture)
- **Category-Specific Prompt Templates** -- 5 complete templates with DNA placeholders:
  - Hero Backgrounds (with 3 worked examples: Ethereal, Brutalist, Neon Noir)
  - Product Shots (with real-photography caveat)
  - Team Portraits -- Stylized Only (with critical AI-team-photo warning)
  - Abstract Textures (with procedural-generation cross-reference)
  - Illustrations (with beat-aware guidance for HOOK/BUILD/PEAK/BREATHE/PROOF)
- **DNA-Derived Negative Prompts** -- 14 automatic generation rules, universal negatives, quality negatives
- **Prompt Consistency Guidance** -- 5 cross-image rules and 6-item consistency checklist
- **Tool-Specific Appendix** -- Clearly marked VOLATILE, 8-row mapping table (Midjourney, DALL-E, Flux/SD)

### Layer 3: Integration Context (~50 lines)
- DNA Connection table: all 12 color tokens + 5 non-color DNA attributes mapped to prompt usage
- Archetype variant strategy by stance group (Great fit / Good fit / Cautious / Avoid)
- Pipeline stage: DNA + section PLAN + emotional arc as input
- 7 related skills cross-referenced: design-dna, design-archetypes, emotional-arc, shape-asset-generation, anti-slop-gate, creative-tension, remotion

### Layer 4: Anti-Patterns (~50 lines)
- Tool-Specific Syntax in Main Prompts (lock-in risk)
- AI Team Photos (ethical/deceptive concern)
- Ignoring Archetype Image Stance (authenticity violations)
- No Negative Prompts (DNA constraint violations)
- Generic Prompts Without DNA (template-feel imagery)
- AI Images for Everything (homogeneous "AI slop" feel)
- Color Mismatch Acceptance (palette drift from DNA tokens)

### Machine-Readable Constraints
- 7 parameters: prompt-sections, negative-prompt-items, archetype-stance-check, color-token-references, consistency-modifiers-match, ai-image-ratio, real-team-photos

## Decisions Made

1. **453 lines slightly below 500-600 target:** All verification criteria met. Content is substantive with no padding -- the skill covers all 19 archetypes, 5 category templates, 14 negative generation rules, and 7 anti-patterns. Adding filler would reduce signal density.

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| # | Hash | Message |
|---|------|---------|
| 1 | 8f0cf41 | feat(07-06): write image-prompt-generation skill |

## Verification Results

| Criterion | Result |
|-----------|--------|
| File exists and is 400+ lines | PASS (453 lines) |
| YAML frontmatter with tier: domain, version: 2.0.0 | PASS |
| All 4 layer headings present | PASS |
| DNA-to-prompt translation matrix (color, archetype, typography, signature, motion, forbidden) | PASS (9 DNA attributes mapped) |
| Per-archetype style modifier table for all 19 archetypes | PASS (19 rows, 4 columns each) |
| "When AI Images HURT" table with archetype stance | PASS (19 archetypes rated) |
| Category templates: hero backgrounds, product shots, portraits, textures, illustrations | PASS (5 categories with DNA placeholders) |
| DNA-derived negative prompt generation system | PASS (14 automatic rules + universal + quality negatives) |
| Prompt consistency guidance for multi-image projects | PASS (5 rules + 6-item checklist) |
| Tool-specific appendix clearly marked VOLATILE | PASS (3 VOLATILE references) |
| Prompt structure template (subject, style, mood, color, composition, negative) | PASS |
| Anti-pattern for AI team photos (ethical concern documented) | PASS |
| No tool-specific syntax in main prompt templates (only in appendix) | PASS |

## Next Phase Readiness

Plan 07-06 is the final plan in Phase 7. All 6 asset and specialist skills are now complete. Phase 7 is ready for verification.
