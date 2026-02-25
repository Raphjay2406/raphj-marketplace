---
phase: 14-core-seo-foundation
plan: 01
subsystem: seo-meta-skill
tags: [seo, metadata, next.js, astro, react, canonical, sitemap, robots.txt, hreflang, core-web-vitals]

dependency-graph:
  requires: []
  provides:
    - "seo-meta SKILL.md Layers 1-2 (Decision Guidance + Code Patterns)"
    - "Framework capability matrix for SEO decision-making"
    - "Next.js 16 async metadata patterns (generateMetadata, generateSitemaps)"
    - "AI crawler taxonomy in robots.txt patterns"
  affects:
    - "14-02 (will append Layers 3-4 and constraint table)"
    - "15 (structured-data skill references seo-meta for JSON-LD boundary)"
    - "16 (search-visibility skill references seo-meta for IndexNow boundary)"

tech-stack:
  added: []
  patterns:
    - "Framework-native SEO (no third-party deps for Next.js/React)"
    - "Explain-then-recipe pattern for skill content"
    - "AI bot taxonomy: search bots (allow) vs training bots (block)"

key-files:
  created: []
  modified:
    - "skills/seo-meta/SKILL.md"

decisions:
  - id: "14-01-D1"
    decision: "React 19 native hoisting as primary SPA pattern (not react-helmet fork)"
    rationale: "React 19 native works for simple cases and requires no deps; complex SPA routing should use Next.js/Astro instead of fighting SPA limitations"
  - id: "14-01-D2"
    decision: "Shared metadata pattern documented for OG image inheritance"
    rationale: "Next.js metadata merging is shallow (replaces, not deep-merges); shared pattern prevents accidental OG image loss"
  - id: "14-01-D3"
    decision: "Framework capability matrix integrated directly into Layer 1 (not appendix)"
    rationale: "Matrix is compact enough (11 rows) to fit in SKILL.md and is the primary decision tool agents need immediately"

metrics:
  duration: "4m 10s"
  completed: "2026-02-25"
---

# Phase 14 Plan 01: seo-meta Layers 1-2 Summary

Complete rewrite of seo-meta SKILL.md Layers 1-2 with framework-native SEO patterns for Next.js 16, Astro 5, and React 19. Core-tier promotion with framework capability matrix, AI bot taxonomy, and honest SPA limitation disclosures.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Write frontmatter + Layer 1 (Decision Guidance) | 21d0ca4 | Frontmatter (tier: core, v3.0.0), framework matrix, decision tree, CWV guidance, pipeline connection |
| 2 | Write Layer 2 (Code Patterns) | a5b7d03 | 20 code blocks across 5 sections (meta tags, canonicals, sitemaps, robots.txt, hreflang), 5 reference sites |

## What Was Built

**Layer 1 (Decision Guidance):**
- When to Use / When NOT to Use with redirects to structured-data (Phase 15) and search-visibility (Phase 16)
- Framework Capability Matrix: 11 capabilities across Next.js 16, Astro 5, React/Vite SPA, Tauri/Electron
- Decision Tree: 5 branching decisions (framework selection, static vs dynamic, large sites, i18n, AI bots)
- Core Web Vitals and SEO: 3-metric table, honest tiebreaker framing, framework comparison
- Pipeline Connection: section-builder, build-orchestrator, quality-reviewer

**Layer 2 (Code Patterns):**
- A. Meta Tags (SEO-01, SEO-02): Next.js 16 root layout + generateMetadata, Astro SEOHead, React 19 SEOMeta
- B. Canonical URLs (SEO-03): metadataBase + relative canonical, Astro.url.href, pagination, cross-domain
- C. Sitemaps (SEO-04, SEO-05): basic sitemap.ts, generateSitemaps with async id, @astrojs/sitemap, validation checklist
- D. robots.txt (SEO-06): Next.js robots.ts, Astro/React static file -- all with AI bot taxonomy
- E. hreflang (SEO-08): metadata.alternates with x-default, sitemap alternates, Astro head, i18n config
- F. Reference Sites: Vercel, Stripe, Next.js Docs, Linear, Astro Docs

## Decisions Made

1. **React 19 native hoisting as primary SPA pattern** -- No react-helmet fork recommendation. React 19 native works for simple cases; for complex SEO needs, agents should recommend Next.js/Astro instead of fighting SPA limitations.

2. **Shared metadata pattern for OG inheritance** -- Documented the `sharedOGImage` pattern explicitly because Next.js metadata merging is shallow (replaces `openGraph` entirely, does not deep-merge). Without this pattern, child pages lose inherited OG images.

3. **Framework capability matrix in Layer 1 (not appendix)** -- The matrix is 11 rows and fits cleanly in SKILL.md. Keeping it in Layer 1 means agents see it immediately during decision guidance, rather than having to navigate to a separate file.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- Frontmatter: tier "core", version "3.0.0" -- PASS
- Framework capability matrix with 4 framework columns -- PASS
- "If SEO is a primary project goal" honest guidance present -- PASS
- Core Web Vitals subsection with LCP/INP/CLS thresholds -- PASS
- Decision Tree with framework selection branching -- PASS
- No react-helmet-async, next-seo, next-sitemap, or next/head recommendations -- PASS
- No JSON-LD code patterns (deferred to Phase 15) -- PASS
- All Next.js patterns use v16 async params/id syntax -- PASS
- React 19 patterns include SPA limitation warnings -- PASS
- robots.txt distinguishes search bots from training bots -- PASS
- hreflang patterns include x-default -- PASS
- Pagination note states rel="prev"/"next" deprecated -- PASS
- 20 code blocks (target was 15+) -- PASS
- 798 lines (target was 500-700, slightly over due to comprehensive hreflang coverage) -- ACCEPTABLE

## Next Phase Readiness

Plan 02 will append:
- Layer 3 (Integration Context): DNA connection, archetype variants, related skills
- Layer 4 (Anti-Patterns): 5-8 common mistakes with corrections
- Machine-readable constraint table (title length, description length, OG dimensions)
- `appendix-ai-bots.md` with complete per-bot taxonomy and rationale

The file ends with an HTML comment marker for clean appending: `<!-- END LAYER 2 -->`.
