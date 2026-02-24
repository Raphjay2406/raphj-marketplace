---
phase: 06-brainstorming-content
plan: 04
title: "Copy Intelligence Engine"
subsystem: content
tags: [brand-voice, copy-intelligence, content-bank, banned-phrases, archetype-voice, voice-extraction]

dependency-graph:
  requires: [01-03, 01-05, 06-01, 06-02, 06-03]
  provides: ["Brand voice generation template", "Content bank matrix (beat x section)", "Tiered banned phrase system", "Archetype voice personality profiles (19)", "Voice extraction protocol for section PLAN.md"]
  affects: [07, 08]

tech-stack:
  added: []
  patterns: ["Generator/enforcer split (copy-intelligence generates, micro-copy enforces)", "Template-based on-demand content generation", "Tiered enforcement (hard-banned vs discouraged)", "Voice extraction protocol (BRAND-VOICE.md -> Copy Specification in PLAN.md)"]

file-tracking:
  key-files:
    created:
      - skills/copy-intelligence/SKILL.md
    modified: []

decisions:
  - id: "06-04-01"
    description: "629 lines within 600-800 target -- all content substantive (19 archetype voice profiles, 6 FULL content bank cells, 18 banned phrases)"
    confidence: HIGH
  - id: "06-04-02"
    description: "Voice extraction protocol produces ~15-20 line Copy Specification per section PLAN.md -- fits within 300-line spawn prompt budget"
    confidence: HIGH
  - id: "06-04-03"
    description: "18 hard-banned phrases + 8 discouraged phrases with contextual override -- tiered enforcement matches CONTEXT.md requirements"
    confidence: HIGH
  - id: "06-04-04"
    description: "Content bank uses formula + archetype modifier pattern -- prevents generic output while keeping skill manageable"
    confidence: HIGH

metrics:
  duration: "7 min"
  completed: "2026-02-24"
---

# Phase 6 Plan 04: Copy Intelligence Engine Summary

Brand voice generation engine with content bank matrix, tiered banned phrases, 19 archetype voice profiles, and voice extraction protocol into section PLAN.md files

## What Was Built

Created `skills/copy-intelligence/SKILL.md` (629 lines) -- a domain-tier skill that generates comprehensive brand voice documents during brainstorm and provides formula templates for every content need during section planning and build.

### Key Components

1. **Brand Voice Document Template** (~100 lines when filled per-project): 8 mandatory sections covering Voice Identity, Tone Spectrum, Vocabulary Rules, Sentence Patterns, Per-Section Voice Variation, Content Density Rules, Headline Formula Library, and CTA Philosophy

2. **Archetype Voice Personality Profiles** (19 archetypes): Full table with 9 columns per archetype (Personality, Sentence Style, Punctuation, Humor, Formality, Vocabulary Character, Sample Headline, Sample CTA). Plus contextual voice variation by boldness tier (Conservative/Moderate/Bold) across 8 contexts

3. **Content Bank Matrix** (beat x section): 6 FULL cells with formula + 5-8 archetype-varied worked examples (HOOK-Hero, REVEAL/BUILD-Features, BUILD-Pricing, PROOF-Testimonial, PIVOT-About, CLOSE-CTA). 18 template cells with formula + 1-2 examples. Content bank usage protocol with 6-step sequence

4. **Tiered Banned Phrase System**: 18 hard-banned phrases (NEVER appear in output) with "Why Banned" and "Write Instead" columns. 8 discouraged phrases with contextual override rules. 6-step enforcement protocol across brainstorm, planning, build, and review stages

5. **Voice Extraction Protocol**: Defines how brand voice rules get extracted into section PLAN.md files as a "Copy Specification" heading (~15-20 lines). Includes worked example (Neo-Corporate HOOK section). Ensures builders never read BRAND-VOICE.md directly

6. **5 Anti-Patterns**: The Generic Fallback, Voice Amnesia, One Voice Fits All, Archetype-Blind Templates, Banned Phrase Whack-a-Mole

7. **Machine-Readable Constraints**: 10 parameters for automated voice compliance checking

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| 629 lines within 600-800 target | All content substantive -- 19 archetype voice profiles, 6 FULL content bank cells, 18 banned phrases |
| Voice extraction produces ~15-20 line Copy Specification | Fits within 300-line spawn prompt budget (Phase 2 architecture) |
| 18 hard-banned + 8 discouraged phrases | Tiered enforcement matches CONTEXT.md decision for nuanced banned-phrase system |
| Formula + archetype modifier pattern | Every formula includes a boldness-tier modifier preventing generic output |
| micro-copy kept as companion (not absorbed) | Different pipeline stages: copy-intelligence for brainstorm/planning, micro-copy for execution |
| Boldness tiers (Conservative/Moderate/Bold) for voice variation | Efficient alternative to 19 individual variation tables -- groups archetypes by behavior |

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 7846f1b | Brand voice template, archetype voice profiles, Layer 1 Decision Guidance |
| Task 2 | dd250ac | Content bank matrix, banned phrases, voice extraction protocol, anti-patterns |

## Verification Results

All 8 plan verification criteria passed:

1. File exists with valid YAML frontmatter (`name: copy-intelligence`)
2. 629 lines (within 600-800 range)
3. Brand voice document template covers all 8 required sections
4. 19 archetypes covered in voice profile table
5. Content bank matrix uses formula templates with archetype modifiers in all 6 FULL cells
6. Banned phrase system has two tiers with explicit enforcement protocol
7. Voice extraction protocol solves write-once-never-read pitfall with Copy Specification format
8. micro-copy relationship clearly documented (generator vs. enforcer)

## Next Phase Readiness

Phase 6 is now complete (4/4 plans executed). The brainstorming and content skill suite is:
- `skills/design-brainstorm/SKILL.md` (06-01) -- research-first brainstorming protocol with industry reference library
- `skills/cross-pollination/SKILL.md` (06-02) -- constraint-breaking methodology with industry rules catalog
- `skills/creative-direction-format/SKILL.md` (06-03) -- direction presentation format with ASCII mockups
- `skills/copy-intelligence/SKILL.md` (06-04) -- brand voice engine with content bank and banned phrases

Phase 7 (Visual Assets & 3D) can proceed -- no blockers.
