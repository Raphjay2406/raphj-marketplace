---
phase: 15-structured-data-geo
plan: 02
subsystem: structured-data-skill
tags: [structured-data, json-ld, integration-context, anti-patterns, constraints, emotional-arc, geo, archetype-mapping, beat-mapping, schema-audit]

dependency-graph:
  requires:
    - "15-01 (structured-data Layers 1-2 -- interfaces, code patterns, GEO patterns)"
    - "14-01 (seo-meta Layers 1-2 -- boundary definition)"
    - "14-02 (seo-meta appendix-ai-bots.md -- crawler taxonomy reference)"
  provides:
    - "structured-data SKILL.md Layers 3-4 (Integration Context + Anti-Patterns)"
    - "SEO-Emotional Arc beat mapping (GEO-05) with hard enforcement on 4 beats"
    - "Archetype-to-GEO intensity mapping (19 archetypes in 4 tiers)"
    - "8 anti-patterns covering major structured data and GEO mistakes"
    - "18-row machine-readable constraint table (16 HARD, 2 SOFT)"
    - "Complete 4-layer Domain-tier structured-data skill"
  affects:
    - "16 (search-visibility skill referenced as related skill)"
    - "14 (seo-meta skill referenced as complementary)"
    - "Quality reviewer (constraint table enables automated checking)"

tech-stack:
  added: []
  patterns:
    - "SEO-Emotional Arc beat-to-schema mapping (4 high-impact + 6 emotional)"
    - "Archetype-aware GEO intensity tiers (Full/Moderate/Subtle/Minimal)"
    - "Hard enforcement on beat SEO elements via constraint table"
    - "Schema audit as mandatory quality gate (every reviewer pass)"

key-files:
  created:
    - ".planning/phases/15-structured-data-geo/15-02-SUMMARY.md"
  modified:
    - "skills/structured-data/SKILL.md"

decisions:
  - id: "15-02-D1"
    decision: "1091 total lines for complete SKILL.md (above 600-800 target)"
    rationale: "Layers 1-2 were already 941 lines (decision 15-01-D1). Layers 3-4 add only ~150 lines -- the most concise integration and anti-pattern content possible. All content is substantive."

metrics:
  duration: "2m 56s"
  completed: "2026-02-25"
---

# Phase 15 Plan 02: Structured Data Layers 3-4 + Constraints Summary

Complete structured-data SKILL.md with Emotional Arc beat-to-schema mapping (4 high-impact beats with hard enforcement), archetype-to-GEO intensity tiers for all 19 archetypes, 8 anti-patterns covering schema-content mismatch through post-iteration audit, and 18-row constraint table enabling automated quality checking.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Append Layer 3 (Integration Context) with Emotional Arc + Archetype Mapping | 1b686a1 | DNA Connection table, archetype-to-GEO intensity mapping (19 archetypes/4 tiers), SEO-Emotional Arc beat mapping (GEO-05), pipeline stage, 7 related skill references |
| 2 | Append Layer 4 (Anti-Patterns) + Machine-Readable Constraints | 7555c87 | 8 anti-patterns, 18-row constraint table (16 HARD, 2 SOFT), beat-specific enforcement |

## What Was Built

**Layer 3 (Integration Context):**

DNA Connection:
- 6-row table mapping brand identity tokens to schema fields (name, URL, description, logo, social profiles)
- Explicit note that colors/fonts/spacing/motion do NOT affect structured data (invisible machine-readable data)

Archetype-to-GEO Intensity Mapping:
- 4-tier system: Full (Neo-Corporate, Data-Dense, Editorial, Dark Academia), Moderate (Playful/Startup, Organic, Warm Artisan, Retro-Future, Neubrutalism, AI-Native), Subtle (Luxury/Fashion, Japanese Minimal, Ethereal, Swiss/International, Glassmorphism), Minimal (Brutalist, Kinetic, Neon Noir, Vaporwave)
- Per-archetype edge case guidance for Japanese Minimal, Luxury/Fashion, Brutalist, Data-Dense
- Key principle: same SEO signals, different visual expression

SEO-Emotional Arc Beat Mapping (GEO-05):
- 10-beat table with 4 high-impact beats (HOOK, TENSION, PROOF, CLOSE) carrying required SEO elements
- 6 purely emotional beats (TEASE, REVEAL, BUILD, PEAK, BREATHE, PIVOT) with no SEO requirements
- Hard enforcement statement for quality reviewer
- Schema assembly guidance showing how beats contribute to page-level @graph

Pipeline Stage:
- Input: section planner (beat + schema assignment), content specialist (content), Design DNA (brand info)
- Output: JSON-LD script tags, GEO-structured content, schema audit checklist
- Position: plan-dev (assignment), execute Wave 2+ (generation), reviewer (audit)

Related Skills:
- 7 skills referenced: seo-meta, emotional-arc, search-visibility, blog-patterns, ecommerce-ui, landing-page, copy-intelligence

**Layer 4 (Anti-Patterns):**
- 8 anti-patterns in standard format (Name / What goes wrong / Instead):
  1. Schema-Content Mismatch -- #1 violation, references audit protocol
  2. Fabricated FAQ Schema -- invisible FAQ triggers manual actions
  3. HowTo Schema Expecting Rich Results -- deprecated Aug-Sep 2023
  4. Over-Optimizing Emotional Beats -- only 4 beats carry SEO elements
  5. Blanket AI Bot Content Blocking -- distinguish training vs search bots
  6. Duplicate @context in @graph -- declare once at root
  7. GEO Patterns on Every Page -- match page type + archetype tier
  8. Ignoring Schema Audit After Iteration -- audit runs on EVERY pass

**Machine-Readable Constraints:**
- 18-row constraint table (16 HARD, 2 SOFT)
- Structural constraints: @context count, headline length, date formats, position sequences
- Content-match constraints: FAQ visible-to-schema, headline match, logo validity
- Beat enforcement: HOOK (H1 + keyword), TENSION (FAQ section), PROOF (stats/author), CLOSE (CTA + Organization)
- Soft warnings: GEO intensity tier mismatch, orphaned @id references

## Decisions Made

1. **1091 total lines for complete SKILL.md** -- Layers 1-2 were already 941 lines (documented in 15-01-D1 as necessary for 25+ interfaces and 14 code patterns). Layers 3-4 add only ~150 lines of integration context, anti-patterns, and constraints -- the most concise possible. All content is substantive and non-redundant.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

**Task 1 (Layer 3):**
- DNA Connection table with brand name, URL, logo, social profiles -- PASS
- Archetype-to-GEO intensity table with all 19 archetypes in 4 tiers -- PASS
- SEO-Emotional Arc beat mapping with all 10 beats -- PASS
- 4 high-impact beats with required SEO elements -- PASS
- 6 purely emotional beats with "No required SEO elements" -- PASS
- "Hard enforcement" statement exists -- PASS
- Pipeline Stage with plan-dev/execute/reviewer -- PASS
- Related Skills: seo-meta, emotional-arc, search-visibility, blog-patterns, ecommerce-ui, landing-page, copy-intelligence -- PASS

**Task 2 (Layer 4 + Constraints):**
- 8 anti-patterns in correct format -- PASS
- Schema-content mismatch references audit protocol -- PASS
- HowTo deprecation note present -- PASS
- Over-optimizing emotional beats references 4 high-impact beats -- PASS
- 18 constraint rows (target: 15+) -- PASS
- Beat-specific enforcement (HOOK, TENSION, PROOF, CLOSE) -- PASS
- Both HARD (16) and SOFT (2) enforcement levels -- PASS
- Complete file has all 4 layers + constraints -- PASS

**Full Phase Verification (all 11 requirements):**
- SDATA-01 (Typed JSON-LD): Layer 2 TypeScript interfaces + @graph pattern -- COVERED
- SDATA-02 (FAQ schema): Layer 2 FAQ pattern with restriction warning -- COVERED
- SDATA-03 (HowTo schema): Layer 2 HowTo pattern with deprecation notice -- COVERED
- SDATA-04 (Article schema): Layer 2 Article/BlogPosting/NewsArticle pattern -- COVERED
- SDATA-05 (Organization schema): Layer 2 Organization pattern -- COVERED
- SDATA-06 (Schema audit): Layer 2 audit protocol + Layer 4 anti-pattern -- COVERED
- GEO-01 (Content structuring): Layer 2 GEO patterns section -- COVERED
- GEO-02 (BLUF + statistics): Layer 2 BLUF and quotable stats patterns -- COVERED
- GEO-03 (FAQ-first): Layer 2 FAQ-first content pattern -- COVERED
- GEO-04 (AI crawler taxonomy): Layer 2 AI crawler content guidance -- COVERED
- GEO-05 (SEO-Emotional Arc): Layer 3 beat mapping with hard enforcement -- COVERED

All 11 requirements verified as covered across both plans. Phase 15 is complete.

## Next Phase Readiness

**Phase 15 is complete.** The structured-data skill is a fully self-contained Domain-tier knowledge base.

Remaining phases:
- Phase 16 (search-visibility): Already complete (16-01 done)
- Phase 17 (API integration patterns): Independent of phases 14-16, can proceed
- Phase 18-19: Per roadmap
