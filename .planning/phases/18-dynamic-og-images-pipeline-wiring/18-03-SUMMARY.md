---
phase: 18-dynamic-og-images-pipeline-wiring
plan: 03
title: "Pipeline Wiring for v1.5 SEO Skills"
subsystem: agent-pipeline
tags: [pipeline-wiring, seo, structured-data, og-images, context7, geo, agents]

dependency_graph:
  requires:
    - "Phase 14 (seo-meta skill)"
    - "Phase 15 (structured-data skill)"
    - "Phase 16 (search-visibility skill)"
    - "Phase 18 Plans 01-02 (og-images skill)"
  provides:
    - "Section-planner assigns schema_type and og_template in PLAN.md"
    - "Quality-reviewer SEO verification checklist (6 CRITICAL + 5 WARNING)"
    - "Build-orchestrator Wave 0 SEO scaffold and spawn prompt SEO context"
    - "Researcher Context7 MCP tool integration"
    - "Content-specialist GEO content patterns"
    - "Design-system-scaffold Wave 0 SEO file items"
  affects:
    - "Phase 18 Plan 04 (SKILL-DIRECTORY.md update)"
    - "Phase 19 (SSR patterns may reference these pipeline connections)"

tech_stack:
  added: []
  patterns:
    - "Additive-only agent markdown edits"
    - "Context7 MCP tool integration (resolve-library-id, query-docs)"
    - "Schema assignment in PLAN.md frontmatter"
    - "SEO verification checklist with severity classification"

key_files:
  modified:
    - agents/pipeline/section-planner.md
    - agents/pipeline/quality-reviewer.md
    - agents/pipeline/build-orchestrator.md
    - agents/pipeline/researcher.md
    - agents/specialists/content-specialist.md
    - skills/design-system-scaffold/SKILL.md
  created: []

decisions:
  - "All changes strictly additive -- no existing behavior removed or restructured"
  - "SEO checklist is ADVISORY -- does not block anti-slop gate"
  - "Context7 fallback chain: Context7 -> WebFetch -> WebSearch"
  - "GEO patterns conditional on content-heavy sections with schema_type set"
  - "Astro variant documented alongside Next.js for scaffold SEO files"

metrics:
  duration: "3m 25s"
  completed: "2026-02-25"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 18 Plan 03: Pipeline Wiring for v1.5 SEO Skills Summary

**One-liner:** Wire seo-meta, structured-data, search-visibility, and og-images skills into 5 pipeline agents and 1 scaffold skill via targeted additive markdown insertions.

## What Was Done

### Task 1: Wire section-planner, quality-reviewer, and build-orchestrator

**section-planner.md (4 additions):**
1. Added `structured-data` skill reference alongside existing `copy-intelligence` reference for schema assignment during PLAN.md generation
2. Added `schema_type` and `og_template` fields to the Per-Section PLAN.md frontmatter template
3. Added SEO fields explanation note describing how to select schema types and when to override og_template
4. Added sub-steps 3 and 4 to Planning Process Step 6 for schema and OG assignment

**quality-reviewer.md (1 addition):**
1. Inserted SEO Verification Checklist section between Level 3 (Wired) verification and Anti-Slop 35-Point Scoring, containing 6 CRITICAL items (title tag, canonical URL, og:image, JSON-LD syntax, no duplicate titles, robots.txt) and 5 WARNING items (description length, og:image alt, schema match, heading hierarchy, image alt text), with usage guidance and skill references

**build-orchestrator.md (2 additions):**
1. Added Wave 0 SEO scaffold note after Step 3 with 4 items: sitemap.ts, robots.ts, metadata base, OG route (with Astro equivalents)
2. Added SEO Context block to the Complete Build Context spawn prompt template for passing schema_type and og_template to builders

### Task 2: Wire researcher, content-specialist, and design-system-scaffold

**researcher.md (3 additions):**
1. Updated tools frontmatter to include `mcp__context7__resolve-library-id` and `mcp__context7__query-docs`
2. Added Context7 MCP Integration section in Step 2 with 3-step usage pattern (resolve library, query docs, fallback chain) and 4 use cases
3. Added "Context7 first for libraries" rule in Rules section

**content-specialist.md (1 addition):**
1. Added GEO Content Patterns section before Brand Voice Enforcement with 3 trigger conditions, 4 patterns (BLUF, question-based headings, quotable statistics, FAQ-first content), archetype-aware note, and skill reference

**design-system-scaffold/SKILL.md (3 additions):**
1. Added 4 SEO scaffold tasks to Wave 0 task list (sitemap.ts, robots.ts, metadataBase, opengraph-image.tsx) plus Astro variant note
2. Added 3 SEO rows to the file manifest table in Layer 1
3. Added seo-meta, og-images, and structured-data to Related Skills in Layer 3

## Agent Wiring Coverage

| Agent | Skills Referenced | Mechanism |
|-------|------------------|-----------|
| section-planner | structured-data, og-images | Schema assignment + OG template in PLAN.md frontmatter |
| quality-reviewer | seo-meta, structured-data | SEO verification checklist with severity levels |
| build-orchestrator | seo-meta, og-images | Wave 0 scaffold items + spawn prompt SEO context |
| researcher | Context7 MCP | Tool integration with fallback chain |
| content-specialist | structured-data (GEO) | GEO content patterns for search-visible content |
| design-system-scaffold | seo-meta, og-images, structured-data | Wave 0 SEO file manifest + Related Skills |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| All changes strictly additive | Plan requirement -- no existing behavior removed |
| SEO checklist advisory only | Avoids blocking premium design pipeline for SEO items |
| Context7 fallback chain ordering | Most current (Context7) -> most authoritative (official docs) -> broadest (web search) |
| GEO patterns conditional on triggers | Prevents SEO patterns from activating on non-content sections |

## Verification

All 6 files verified:
- section-planner: structured-data ref + schema_type/og_template in frontmatter + SEO note + Step 6 sub-steps
- quality-reviewer: SEO checklist with 6 CRITICAL + 5 WARNING between Level 3 and anti-slop
- build-orchestrator: Wave 0 SEO scaffold (4 items) + SEO Context in spawn prompt
- researcher: Context7 tools in frontmatter + 3-step usage + fallback chain + rule
- content-specialist: GEO patterns (BLUF, question headings, quotable stats, FAQ-first) + archetype-aware
- design-system-scaffold: 4 SEO tasks in Wave 0 + Astro variant + 3 manifest rows + 3 Related Skills

All changes additive. No circular references introduced. All markdown syntactically valid.

## Next Phase Readiness

Phase 18 Plan 03 complete. Plan 04 (SKILL-DIRECTORY.md update) can proceed -- it needs the knowledge that all v1.5 skills are now wired into agents.
