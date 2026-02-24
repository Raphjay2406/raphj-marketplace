---
phase: 09-integration-polish
plan: 02
subsystem: design-system-export
tags: [storybook, design-tokens, dtcg, style-dictionary, csf-factories, handoff]

dependency-graph:
  requires: [01-02, 08-01]
  provides: [design-system-export-skill]
  affects: [09-03, 09-04]

tech-stack:
  added: [storybook-10, style-dictionary-5, w3c-dtcg]
  patterns: [csf-factories, dtcg-tokens, multi-platform-export]

file-tracking:
  key-files:
    created:
      - skills/design-system-export/SKILL.md
    modified: []

decisions:
  - id: storybook-csf-factories
    choice: "CSF Factories (preview.meta/meta.story) as exclusive story format"
    rationale: "Storybook 10 recommended format; better type inference than CSF3"
  - id: dtcg-token-format
    choice: "W3C DTCG ($value, $type, $description) as token source format"
    rationale: "Industry standard since v2025.10; supported by Figma, Adobe, Google, Microsoft"
  - id: three-platform-output
    choice: "CSS + JSON + Figma as mandatory export platforms"
    rationale: "CSS for web runtime, JSON for JS consumers, Figma for design sync-back"
  - id: export-curation
    choice: "Curation criteria: 2+ sections OR 3+ variants OR interactive"
    rationale: "Prevents over-documentation; focused exports more valuable than exhaustive ones"
  - id: dna-as-token-source
    choice: "Token files generated from DESIGN-DNA.md, not hardcoded"
    rationale: "Prevents drift between DNA and exported tokens"

metrics:
  duration: "3 min"
  completed: "2026-02-24"
---

# Phase 9 Plan 2: Design System Export Skill Summary

Created the design-system-export skill teaching Claude how to export built design systems as Storybook 10 CSF Factories stories and W3C DTCG token packages via Style Dictionary 5 with CSS, JSON, and Figma output platforms.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Design System Export skill | 0e17fb0 | skills/design-system-export/SKILL.md |

## What Was Built

### skills/design-system-export/SKILL.md (881 lines)

**Layer 1 (Decision Guidance):** Export curation decision tree (what to export vs. skip), story depth decision tree (visual-only vs. interaction vs. responsive), token export scope, and pipeline connection to `/modulo:export` command.

**Layer 2 (Award-Winning Examples):** 8 code patterns:
1. Storybook 10 project setup (preview.ts + main.ts with DNA theme)
2. Button stories with 4 variants + 4 interaction play functions (hover, click, keyboard, disabled)
3. Card stories with responsive viewport stories (mobile, tablet, desktop)
4. SectionWrapper stories with DNA spacing/beat parameters
5. Navigation stories with mobile menu open/close + keyboard navigation play functions
6. W3C DTCG token files (color, spacing, typography, motion) with all 12 DNA color tokens
7. Style Dictionary 5 multi-platform config (CSS + JSON + Figma)
8. DNA-to-token extraction script pattern

**Layer 3 (Integration Context):** DNA token mapping table (6 categories), archetype export variation notes, pipeline stage documentation, export workflow diagram, and 4 related skill connections.

**Layer 4 (Anti-Patterns):** 7 anti-patterns covering CSF3 usage, Style Dictionary v3 patterns, over-documentation, custom token formats, missing play functions, hardcoded token values, and missing DNA theme in Storybook.

**Machine-Readable Constraints:** 8 parameters (5 HARD, 3 SOFT) for automated enforcement.

## Decisions Made

1. **CSF Factories exclusive:** No CSF3 pattern in any story generation -- CSF Factories is the only documented format
2. **W3C DTCG exclusive:** No custom token schemas -- DTCG is the only documented token format
3. **Three-platform mandatory:** CSS + JSON + Figma outputs all required from Style Dictionary 5
4. **Curation over completeness:** Export decision tree prevents over-documentation while ensuring meaningful coverage
5. **DNA as single source:** Token extraction script generates from DESIGN-DNA.md to prevent drift

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- skills/design-system-export/SKILL.md exists: 881 lines (target: 500+)
- Valid YAML frontmatter: Yes (--- delimiters present)
- All 4 layer headings present: Yes
- `preview.meta` present: 8 occurrences (CSF Factories confirmed)
- `meta.story` present: 25+ occurrences (CSF Factories stories)
- `$value` and `$type` present: Extensive DTCG token examples
- Style Dictionary 5 config: ESM `style-dictionary.config.mjs` documented
- `@storybook/test`: Play function imports documented
- `satisfies Meta`: Only in anti-pattern (line 800) -- correct
- `require('style-dictionary')`: Only in anti-pattern (line 814) -- correct

## Next Phase Readiness

This skill is referenced by the planned `/modulo:export` command. Plans 09-03 (Progress Reporting) and 09-04 (Error Recovery) are independent agent protocol extensions that can proceed without dependency on this skill.
