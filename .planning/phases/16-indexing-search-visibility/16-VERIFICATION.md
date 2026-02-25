---
phase: 16-indexing-search-visibility
verified: 2026-02-25T10:45:00Z
status: passed
score: 4/4 must-haves verified
must_haves:
  truths:
    - "The new search-visibility skill (Domain tier) provides complete IndexNow auto-setup patterns with content-hash tracking"
    - "A unified indexing strategy documents the dual approach with honest Google non-support disclosure"
    - "AI-aware robots.txt patterns with three-tier presets extend Phase 14 taxonomy"
    - "GSC and Bing Webmaster Tools submission workflows provide step-by-step verification instructions"
  artifacts:
    - path: "skills/search-visibility/SKILL.md"
      provides: "Complete 4-layer Domain-tier skill with machine-readable constraints"
    - path: "skills/search-visibility/appendix-ai-crawlers.md"
      provides: "AI crawler taxonomy with three unbiased presets and 25+ categorized bots"
    - path: "skills/search-visibility/appendix-llms-txt.md"
      provides: "llms.txt and llms-full.txt templates with Next.js and Astro generation patterns"
    - path: "skills/search-visibility/appendix-submission.md"
      provides: "Step-by-step verification and sitemap submission workflows for GSC, Bing, Yandex, Naver"
  key_links:
    - from: "skills/search-visibility/SKILL.md"
      to: "skills/search-visibility/appendix-ai-crawlers.md"
      via: "7 cross-references in SKILL.md"
    - from: "skills/search-visibility/SKILL.md"
      to: "skills/search-visibility/appendix-llms-txt.md"
      via: "2 cross-references in SKILL.md"
    - from: "skills/search-visibility/SKILL.md"
      to: "skills/search-visibility/appendix-submission.md"
      via: "2 cross-references in SKILL.md"
    - from: "skills/seo-meta/SKILL.md"
      to: "skills/search-visibility/SKILL.md"
      via: "Related skills references (bidirectional)"
    - from: "skills/structured-data/SKILL.md"
      to: "skills/search-visibility/SKILL.md"
      via: "Related skills references (bidirectional)"
---

# Phase 16: Indexing & Search Visibility Verification Report

**Phase Goal:** New and updated pages are discoverable within minutes -- IndexNow pushes to Bing/Yandex/Naver instantly, sitemaps handle Google, and forward-looking standards (llms.txt) are in place
**Verified:** 2026-02-25T10:45:00Z
**Status:** PASSED
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The new search-visibility skill (Domain tier) provides complete IndexNow auto-setup patterns: API key generation, verification file placement, and framework-specific submission endpoints with content-hash tracking | VERIFIED | SKILL.md (579 lines) has YAML frontmatter with tier: domain, Layer 2 Part A contains 7 IndexNow patterns: API key setup, key verification file (static + dynamic), Next.js 16 Route Handler with SHA-256 content-hash tracking, Astro SSR endpoint using import.meta.env, Astro SSG with astro-indexnow v2.1.0, content-hash tracking approaches table (4 methods), monitoring with response status reference. All patterns use api.indexnow.org (6 occurrences). |
| 2 | A unified indexing strategy documents the dual approach: IndexNow for Bing/Yandex/Naver + sitemap/GSC for Google -- with honest disclosure that Google does not support IndexNow | VERIFIED | Layer 1 opens with bold statement IndexNow does NOT work for Google (3 occurrences of Google non-support). Engine x Method comparison matrix lists all 8 engines with correct Google row showing No for IndexNow. Dual-Path Strategy section documents both paths. Three project-type recipes provided. Decision tree covers 5 branching dimensions. |
| 3 | AI-aware robots.txt patterns extend Phase 14 taxonomy with separate rule blocks for training bots vs search bots | VERIFIED | appendix-ai-crawlers.md (367 lines): 7 search bots, 9 training bots, 3 user-triggered fetchers, 6 emerging bots (25 total). Three complete robots.txt preset templates with inline comments -- none labeled recommended or default. Next.js robots.ts implementation with AI_ROBOTS_PRESET env var. Perplexity-User flagged for non-compliance. Market context and quarterly review protocol included. |
| 4 | GSC and Bing Webmaster Tools submission workflows provide step-by-step verification instructions | VERIFIED | appendix-submission.md (273 lines): GSC (5 verification methods), Bing WMT (4 methods), Yandex (4 methods), Naver (2 methods). Consistent structure: Add Site, Verify, Submit Sitemap, Monitor. Next.js verification shortcuts for all platforms. Unified code block consolidating all 4. Submission checklist at end. |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| skills/search-visibility/SKILL.md | Complete 4-layer Domain-tier skill | VERIFIED | 579 lines, tier: domain, version: 1.0.0, Layers 1-4 + constraints (12 rows: 8 HARD, 4 SOFT), 7 anti-patterns |
| skills/search-visibility/appendix-ai-crawlers.md | AI crawler taxonomy with three-tier presets | VERIFIED | 367 lines, 25 bots across 4 tiers, 3 complete robots.txt templates, Next.js robots.ts, market context |
| skills/search-visibility/appendix-llms-txt.md | llms.txt templates and generation patterns | VERIFIED | 238 lines, both variants (summary + full), manual + auto-gen (Next.js + Astro), forward-looking framing |
| skills/search-visibility/appendix-submission.md | Webmaster tools submission workflows | VERIFIED | 273 lines, 4 platforms, all verification methods, unified Next.js shortcut, submission checklist |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| SKILL.md | appendix-ai-crawlers.md | Cross-references | WIRED | 7 references in SKILL.md |
| SKILL.md | appendix-llms-txt.md | Cross-references | WIRED | 2 references in SKILL.md |
| SKILL.md | appendix-submission.md | Cross-references | WIRED | 2 references in SKILL.md |
| seo-meta/SKILL.md | search-visibility | Related skills | WIRED | Bidirectional references confirmed |
| structured-data/SKILL.md | search-visibility | Related skills | WIRED | Bidirectional references confirmed |
| SKILL.md Layer 2 | api.indexnow.org | Code patterns | WIRED | 6 occurrences, zero per-engine endpoints |
| SKILL.md Layer 3 | Design DNA | DNA Connection table | WIRED | Brand name, description, site URL mapped |
| SKILL.md Layer 3 | Pipeline stages | Pipeline Stage section | WIRED | Wave 0-1 scaffold + post-deploy documented |

### Requirements Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| IDX-01: IndexNow full auto-setup | SATISFIED | Layer 2A: key setup, verification file, Route Handler, Astro SSR/SSG, content-hash tracking |
| IDX-02: AI-aware robots.txt | SATISFIED | appendix-ai-crawlers.md: 25 bots, 3 presets; Layer 2B: quick-reference |
| IDX-03: llms.txt template generation | SATISFIED | appendix-llms-txt.md: format spec, both variants, manual + auto-gen |
| IDX-04: Unified indexing strategy | SATISFIED | Layer 1: engine matrix (8 engines), dual-path, 3 recipes, decision tree |
| IDX-05: Webmaster tools submission | SATISFIED | appendix-submission.md: 4 platforms, all methods, checklist |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| appendix-submission.md | 246 | placeholder (contextual instruction) | Info | Not a stub -- tells users to replace values |
| appendix-llms-txt.md | 108 | placeholder (contextual instruction) | Info | Not a stub -- tells users to replace content |

No blocker or warning-level anti-patterns found. Zero TODO/FIXME/HACK comments across all 4 files (1,457 total lines).

### Human Verification Required

No items require human verification. This phase produces markdown skill documentation (not UI components or runtime behavior), so all verification is completable programmatically.

### Gaps Summary

No gaps found. All 4 observable truths verified. All 4 artifacts pass three-level verification (exists, substantive, wired). All 5 IDX requirements satisfied. All key links confirmed. Zero stub patterns or blockers.

Notable quality indicators:
- All 4 standard layers plus 12 machine-readable constraints (8 HARD, 4 SOFT)
- 7 anti-patterns covering common indexing mistakes
- 3 robots.txt presets presented without editorial bias (no recommended language)
- llms.txt honestly framed as forward-looking convention
- Google IndexNow non-support disclosed 3 times
- Astro patterns correctly use import.meta.env (not process.env)
- All IndexNow patterns use api.indexnow.org (zero per-engine endpoints)
- Bidirectional cross-references with seo-meta and structured-data confirmed

---

_Verified: 2026-02-25T10:45:00Z_
_Verifier: Claude (gsd-verifier)_
