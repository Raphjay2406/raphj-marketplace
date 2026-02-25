---
phase: 15-structured-data-geo
plan: 01
subsystem: structured-data-skill
tags: [structured-data, json-ld, schema, rich-results, faq, howto, article, organization, breadcrumb, product, local-business, event, geo, bluf, question-headings, quotable-statistics, schema-audit]

dependency-graph:
  requires:
    - "14-01 (seo-meta Layers 1-2 -- boundary definition)"
    - "14-02 (seo-meta appendix-ai-bots.md -- crawler taxonomy)"
  provides:
    - "structured-data SKILL.md Layers 1-2 (Decision Guidance + Code Patterns)"
    - "25+ TypeScript interfaces for JSON-LD schema types (plain, no schema-dts)"
    - "@graph combination pattern with conditional schema inclusion"
    - "Per-page-type schema recipe table (11 page types)"
    - "GEO content patterns (BLUF, question headings, quotable stats, FAQ-first)"
    - "Schema audit protocol (14-item checklist + auto-fix)"
  affects:
    - "15-02 (Layers 3-4, constraints, will append to this file)"
    - "16 (search-visibility skill referenced as related skill)"
    - "14 (seo-meta skill referenced as complementary)"

tech-stack:
  added: []
  patterns:
    - "Plain TypeScript interfaces for JSON-LD (no schema-dts dependency)"
    - "@graph array for multi-schema pages with @id cross-referencing"
    - "Single data source pattern (same array drives visible component + JSON-LD)"
    - "GEO archetype intensity tiers (Full/Moderate/Subtle/Minimal)"
    - "Content-schema consistency audit protocol"

key-files:
  created:
    - "skills/structured-data/SKILL.md"
  modified: []

decisions:
  - id: "15-01-D1"
    decision: "941 lines for Layers 1-2 (above 450-600 target)"
    rationale: "25+ TypeScript interfaces and 14 code patterns require space; content is substantive and non-redundant, no padding"
  - id: "15-01-D2"
    decision: "HowToSchema and WebSiteSchema interfaces created fresh (not in research)"
    rationale: "Research provided all other interfaces; HowTo and WebSite needed to be created following the same pattern for complete coverage"

metrics:
  duration: "7m 04s"
  completed: "2026-02-25"
---

# Phase 15 Plan 01: Structured Data & GEO Layers 1-2 Summary

Domain-tier structured-data skill with typed JSON-LD interfaces for 11 page types, @graph combination pattern, honest deprecation disclosures (HowTo deprecated, FAQ restricted, WebSite no rich result), GEO content patterns with archetype-aware intensity, and schema audit protocol for content-schema consistency.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Create SKILL.md frontmatter + Layer 1 (Decision Guidance) | 6f04b0b | Frontmatter (domain tier, v1.0.0), Schema Status Matrix (9 types), per-page recipe table (11 types), decision tree (8 branches), GEO decision guidance, pipeline connection |
| 2 | Write Layer 2 (Code Patterns for Structured Data + GEO) | 4bf65da | SDATA-01 through SDATA-06 (interfaces, JsonLd component, @graph, FAQ, HowTo, Article, Organization, audit), GEO-01 through GEO-04 (BLUF, question headings, quotable stats, FAQ-first, AI crawler guidance) |

## What Was Built

**Layer 1 (Decision Guidance):**
- When to Use / When NOT to Use with clear skill boundaries (seo-meta for meta tags, search-visibility for indexing)
- Schema Status Matrix: 9 schema types with honest Google rich result status (Active/Restricted/Deprecated) and AI engine value rating
- Per-Page-Type Recipe Table: 11 page types with specific schema combinations and caveats
- Decision Tree: 8 branching decisions covering @graph, FAQ, HowTo, Product, LocalBusiness, blog vs news, GEO intensity
- GEO Decision Guidance: 4 archetype intensity tiers with page-type benefit mapping
- Pipeline Connection: section-planner, section-builder, content-specialist, quality-reviewer integration points

**Layer 2 (Code Patterns):**

SDATA-01 (Typed JSON-LD):
- 13 supporting type interfaces (PersonSchema, ImageObjectSchema, PostalAddressSchema, ContactPointSchema, OfferSchema, AggregateRatingSchema, ReviewSchema, BrandSchema, PlaceSchema, VirtualLocationSchema, GeoCoordinatesSchema, OpeningHoursSchema, SchemaBase/SchemaGraph)
- 12 page-type interfaces (FAQPageSchema, QuestionSchema, AnswerSchema, ArticleSchema, OrganizationSchema, WebSiteSchema, BreadcrumbListSchema, ListItemSchema, ProductSchema, LocalBusinessSchema, EventSchema, HowToSchema, HowToStepSchema)
- JsonLd component for React/Next.js and Astro
- @graph combination pattern with conditional FAQPage inclusion and @id cross-references

SDATA-02 (FAQ Schema): Single data source pattern with prominent "restricted to gov/health" warning

SDATA-03 (HowTo Schema): HowTo alongside Article in @graph with prominent "deprecated rich results" warning

SDATA-04 (Article Schema): Article/BlogPosting/NewsArticle with subtype selection guidance and image requirements (16:9, 4:3, 1:1)

SDATA-05 (Organization Schema): Full schema with logo as ImageObject, contactPoint array, sameAs social profiles, @id referencing

SDATA-06 (Schema Audit): 14-item content-schema consistency checklist, structural validation (4 items), external validation guidance (4 items), auto-fix protocol (4 steps)

GEO-01 (BLUF): Bottom Line Up Front formatting pattern with archetype intensity notes

GEO-02 (Question Headings): Statement-to-question conversion examples with 4-tier archetype intensity

GEO-03 (Quotable Statistics): Citation component with source attribution, Princeton GEO research reference

GEO-04 (FAQ-First + AI Crawlers): Archetype-aware FAQ component, AI crawler content guidance with seo-meta appendix boundary

## Decisions Made

1. **941 lines for Layers 1-2** -- The plan targeted 450-600 lines, but 25+ TypeScript interfaces and 14 distinct code patterns require more space. All content is substantive. Layer 2 alone contains 827 lines of code patterns, each with explanatory context.

2. **HowToSchema and WebSiteSchema created fresh** -- The research document provided verified interfaces for all other schema types. HowTo and WebSite interfaces were created following the same pattern (extends SchemaBase, matching schema.org properties).

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

**Task 1 (Layer 1):**
- Frontmatter: tier "domain", version "1.0.0" -- PASS
- Schema Status Matrix: FAQPage "Restricted", HowTo "Deprecated" -- PASS
- Per-Page-Type Recipe Table: 11 page types (target: 10+) -- PASS
- GEO Decision Guidance subsection present -- PASS
- Decision Tree covers @graph, FAQ, HowTo, GEO branching -- PASS
- No code patterns in Layer 1 -- PASS
- Pipeline Connection: section-planner, section-builder, quality-reviewer -- PASS

**Task 2 (Layer 2):**
- TypeScript interfaces: 25+ (target: 15+) -- PASS
- JsonLd component: React/Next.js + Astro versions -- PASS
- @graph pattern: conditional FAQPage inclusion -- PASS
- FAQ warning: "restricted to gov/health" prominent -- PASS
- HowTo warning: "deprecated rich results" prominent -- PASS
- Article: BlogPosting + NewsArticle subtypes -- PASS
- Organization: logo, contactPoint, sameAs -- PASS
- Schema audit: 14-item consistency + 4 structural + 4 external + auto-fix -- PASS
- GEO patterns: BLUF, question headings, quotable stats, FAQ-first -- PASS
- AI crawler guidance references appendix-ai-bots.md -- PASS
- No schema-dts imports -- PASS
- End marker for Plan 02 -- PASS

**Overall Verification:**
- SDATA-01 (Typed JSON-LD): COVERED
- SDATA-02 (FAQ schema): COVERED
- SDATA-03 (HowTo schema): COVERED
- SDATA-04 (Article schema): COVERED
- SDATA-05 (Organization schema): COVERED
- SDATA-06 (Schema audit): COVERED
- GEO-01 (Content structuring): COVERED
- GEO-02 (BLUF + statistics): COVERED
- GEO-03 (FAQ-first): COVERED
- GEO-04 (AI crawler taxonomy): COVERED

## Next Phase Readiness

**Plan 02 (Layers 3-4)** can proceed:
- SKILL.md ends with clear `<!-- END Layer 2 -->` marker
- Layer 3 will add DNA connection, archetype variants, Emotional Arc beat-to-schema mapping, pipeline stage
- Layer 4 will add anti-patterns and machine-readable constraint table
- All code patterns from Layer 2 are referenced and ready for integration context
