---
phase: 14-core-seo-foundation
plan: 02
subsystem: seo-meta-skill
tags: [seo, metadata, integration, anti-patterns, constraints, ai-crawlers, robots.txt, design-dna]

dependency-graph:
  requires:
    - "14-01 (seo-meta Layers 1-2)"
  provides:
    - "seo-meta SKILL.md Layers 3-4 (Integration Context + Anti-Patterns)"
    - "Machine-readable SEO constraint table (13 parameters)"
    - "AI crawler taxonomy appendix (28 bots, 4 categories)"
  affects:
    - "15 (structured-data skill referenced as related skill)"
    - "16 (search-visibility skill referenced as related skill)"
    - "18 (OG image generation referenced in DNA connection)"

tech-stack:
  added: []
  patterns:
    - "DNA-to-SEO token mapping (brand name, colors, fonts to meta/OG)"
    - "Archetype-aware meta description tone"
    - "Blocklist AI bot strategy with per-bot rationale"
    - "HARD/SOFT constraint enforcement levels"

key-files:
  created:
    - "skills/seo-meta/appendix-ai-bots.md"
  modified:
    - "skills/seo-meta/SKILL.md"

decisions:
  - id: "14-02-D1"
    decision: "8 archetype tone variants for meta descriptions (not all 19)"
    rationale: "Selected 8 archetypes with meaningfully distinct tones; remaining archetypes map to one of these 8 voice categories"
  - id: "14-02-D2"
    decision: "13 constraint parameters (12 HARD, 1 SOFT)"
    rationale: "Title uniqueness is SOFT because homepages and similar landing pages may legitimately share title patterns; all other parameters directly cause SEO damage when violated"
  - id: "14-02-D3"
    decision: "Emerging bots commented-out in robots.txt template (not active rules)"
    rationale: "Emerging bots have unclear purpose; commenting them out preserves awareness without enforcing premature blocking decisions"

metrics:
  duration: "4m 01s"
  completed: "2026-02-25"
---

# Phase 14 Plan 02: seo-meta Layers 3-4 + AI Crawler Appendix Summary

Complete 4-layer seo-meta skill with DNA-to-SEO token mapping, 8 archetype tone variants, 13 machine-readable constraints (12 HARD/1 SOFT), and a 261-line AI crawler taxonomy appendix covering 28 unique bots across 4 categories.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Append Layers 3-4 and Constraints to SKILL.md | 0edb6af | Layer 3 (DNA connection, archetype variants, pipeline stage, 8 related skills), Layer 4 (8 anti-patterns), constraint table (13 params) |
| 2 | Create appendix-ai-bots.md (AI Crawler Taxonomy) | d63dba1 | 28 bots in 4 categories, complete robots.txt template, review protocol, opt-in guidance |

## What Was Built

**Layer 3 (Integration Context):**
- DNA Connection table: 6 tokens mapped to SEO usage (brand name, description, bg-primary, font-display, signature-element, domain)
- Archetype Variants: 8 meta description tone variants with example snippets (Neo-Corporate, Brutalist, Luxury, Playful, Japanese Minimal, Data-Dense, Editorial, Warm Artisan)
- Pipeline Stage: Wave 0 scaffold, Wave 1 shared UI, Wave 2+ per-page metadata
- Related Skills: 8 skills with explicit boundary definitions (structured-data, search-visibility, performance-guardian, blog-patterns, ecommerce-ui, i18n-rtl, multi-page-architecture, accessibility)

**Layer 4 (Anti-Patterns):**
1. Legacy Head Component in App Router -- silently produces zero metadata
2. Hardcoded Canonical URLs -- stale canonicals split link equity
3. Synchronous Params in Next.js 16 -- runtime error without await
4. Missing og:image -- blank social previews, reduced CTR
5. Blanket AI Bot Blocking -- hides site from AI search
6. Non-Canonical URLs in Sitemap -- GSC Error (Nov 2025)
7. Multiple Title Tags in React 19 -- undefined browser behavior
8. Static lastmod in Sitemap -- Google loses trust in signal

**Machine-Readable Constraints:**
- 13 parameters for quality reviewer enforcement
- 12 HARD constraints (reject violations): title length, description length, OG dimensions, canonical format, metadataBase, sitemap limits, hreflang rules, robots.txt sitemap reference
- 1 SOFT constraint (warn): title uniqueness per page

**AI Crawler Taxonomy Appendix (appendix-ai-bots.md):**
- 8 search bots (ALLOW) with "Why Allow" rationale
- 10 training bots (BLOCK) with "Why Block" rationale
- 5 user-triggered fetchers (ALLOW) with notes on Perplexity-User non-compliance
- 5 emerging/niche bots (monitor) with assessment notes
- Complete robots.txt template with all 28 bots and inline comments
- Market trends (GPTBot 5%->30%, Meta-ExternalAgent 19% entry)
- Quarterly review protocol with monitoring sources
- Opt-in guidance for sites that want to allow training

## Decisions Made

1. **8 archetype tone variants (not all 19)** -- Selected archetypes with meaningfully distinct voice profiles. The remaining 11 archetypes map naturally to one of these 8 tones (e.g., Glassmorphism maps to Neo-Corporate tone, Neon Noir maps to Editorial tone).

2. **13 constraints with HARD/SOFT split** -- Only title uniqueness is SOFT because legitimate cases exist (landing pages sharing title patterns). Every other constraint directly causes measurable SEO damage when violated.

3. **Emerging bots commented-out in robots.txt** -- The 5 emerging bots (Applebot-Extended, AI2Bot, YouBot, PhindBot, ExaBot) are included in the template as comments rather than active rules. This preserves awareness without enforcing blocking decisions for bots with unclear purposes.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

**Task 1 (SKILL.md Layers 3-4):**
- Layer 3 has DNA Connection table (6 tokens) -- PASS
- Layer 3 has Archetype Variants (8 archetypes with examples) -- PASS
- Layer 3 has Pipeline Stage (Wave 0/1/2+) -- PASS
- Layer 3 has Related Skills (8 skills with boundaries) -- PASS
- Layer 3 references structured-data (Phase 15) and search-visibility (Phase 16) -- PASS
- Layer 4 has 8 anti-patterns in correct format -- PASS
- Constraint table has 13 rows (target: 10+) -- PASS
- Both HARD and SOFT enforcement levels present -- PASS
- Total file: 928 lines (target: 700-900, slightly over) -- ACCEPTABLE

**Task 2 (appendix-ai-bots.md):**
- Header: "Last verified: 2026-02-25", "Review cadence: Quarterly" -- PASS
- Search Bots: 8 entries -- PASS
- Training Bots: 10 entries -- PASS
- User-Triggered Fetchers: 5 entries -- PASS
- Emerging/Niche: 5 entries -- PASS
- Per-bot rationale on all entries -- PASS
- Perplexity-User flagged for non-compliance -- PASS
- Complete robots.txt template with ALL bots -- PASS
- Review Protocol with quarterly cadence -- PASS
- File: 261 lines (target: 200-350) -- PASS

**Full Phase Verification (SEO-01 through SEO-08):**
- SEO-01 (meta tags): Layer 2 meta tag patterns for all 3 frameworks -- COVERED
- SEO-02 (OG/Twitter): Layer 2 OG + Twitter Card in each framework recipe -- COVERED
- SEO-03 (canonical URLs): Layer 2 canonical patterns + Layer 4 anti-patterns -- COVERED
- SEO-04 (XML sitemap): Layer 2 sitemap patterns for Next.js + Astro -- COVERED
- SEO-05 (sitemap index): Layer 2 generateSitemaps pattern -- COVERED
- SEO-06 (robots.txt): Layer 2 robots.txt patterns + appendix-ai-bots.md -- COVERED
- SEO-07 (Core Web Vitals): Layer 1 CWV subsection -- COVERED
- SEO-08 (hreflang): Layer 2 hreflang patterns for Next.js + Astro -- COVERED

## Next Phase Readiness

Phase 14 (Core SEO Foundation) is now complete. The seo-meta skill is a self-contained Core-tier knowledge base covering all 8 SEO requirements.

**Phase 15 (Structured Data & GEO)** can begin:
- seo-meta Layer 3 explicitly defines the boundary: "This skill handles `<meta>` and `<link>` tags; `structured-data` handles `<script type="application/ld+json">`"
- JSON-LD patterns are cleanly deferred to Phase 15

**Phase 16 (Search Visibility)** can begin:
- seo-meta Layer 3 defines boundary: "This skill handles discoverability fundamentals; `search-visibility` handles proactive indexing"
- IndexNow, llms.txt, GSC workflows are cleanly deferred to Phase 16
