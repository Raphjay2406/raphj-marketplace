---
phase: 15-structured-data-geo
verified: 2026-02-25T14:30:00Z
status: passed
score: 5/5 must-haves verified
must_haves:
  truths:
    - "The structured-data skill provides typed JSON-LD patterns for all major page types with @graph combination"
    - "GEO content structuring patterns are documented with archetype-aware guidance preventing over-optimization"
    - "SEO-Emotional Arc integration maps each beat type to specific SEO/GEO guidance"
    - "Post-iteration schema audit protocol ensures JSON-LD matches visible content"
    - "AI crawler guidance distinguishes training bots from search bots"
  artifacts:
    - path: "skills/structured-data/SKILL.md"
      status: verified
      lines: 1091
  key_links:
    - from: "skills/structured-data/SKILL.md"
      to: "skills/seo-meta/SKILL.md"
      status: verified
    - from: "skills/structured-data/SKILL.md"
      to: "skills/seo-meta/appendix-ai-bots.md"
      status: verified
    - from: "skills/structured-data/SKILL.md"
      to: "skills/emotional-arc/SKILL.md"
      status: verified
    - from: "skills/seo-meta/SKILL.md"
      to: "skills/structured-data/SKILL.md"
      status: verified
    - from: "skills/search-visibility/SKILL.md"
      to: "skills/structured-data/SKILL.md"
      status: verified
---
# Phase 15: Structured Data & GEO Verification Report

**Phase Goal:** Sites built with Genorah appear in Google rich results and AI engine citations through typed structured data and GEO-optimized content patterns woven into the Emotional Arc
**Verified:** 2026-02-25T14:30:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The structured-data skill provides typed JSON-LD patterns for all major page types with @graph combination | VERIFIED | skills/structured-data/SKILL.md (1091 lines, domain tier) has 27 TypeScript interfaces covering all 9 schema types (FAQPage, HowTo, Article/BlogPosting/NewsArticle, Organization, WebSite, BreadcrumbList, Product, LocalBusiness, Event) plus 13 supporting types. Per-page-type recipe table covers 11 page types. @graph combination pattern at line 392 with conditional schema inclusion. |
| 2 | GEO content structuring patterns documented with archetype-aware guidance preventing over-optimization | VERIFIED | Layer 2 has GEO-01 BLUF (line 737), GEO-02 question headings (line 787), GEO-03 quotable stats (line 807), GEO-04 FAQ-first (line 866). Each pattern includes archetype intensity notes (Full/Moderate/Subtle/Minimal). Layer 3 has full 19-archetype-to-4-tier mapping table (lines 960-965) with per-archetype edge case guidance (lines 969-974). Anti-pattern 7 at line 1058 explicitly prevents over-optimization. |
| 3 | SEO-Emotional Arc integration maps each beat type to specific SEO/GEO guidance | VERIFIED | Layer 3 SEO-Emotional Arc Beat Mapping GEO-05 (lines 976-1002) has 10-beat table: HOOK=H1+keyword, TENSION=FAQ+FAQPage, PROOF=stats+author, CLOSE=CTA+Organization. 6 emotional beats (TEASE, REVEAL, BUILD, PEAK, BREATHE, PIVOT) explicitly marked with no required SEO elements. Hard enforcement statement at line 993. Schema assembly guidance at lines 997-1002 showing @graph construction from beats. |
| 4 | Post-iteration schema audit protocol ensures JSON-LD matches visible content | VERIFIED | Layer 2 SDATA-06 (lines 689-731) has 14-item content-schema consistency checklist, 4-item structural validation, 4-item external validation guidance, and 4-step auto-fix protocol. Line 691 states audit runs after both execute AND iterate. Anti-pattern 1 at line 1022 and anti-pattern 8 at line 1064 reinforce the protocol. Constraint table row at line 1085 has HARD enforcement for schema audit run. |
| 5 | AI crawler guidance distinguishes training bots from search bots | VERIFIED | GEO-04 Extension AI Crawler Content Guidance (lines 925-939) explicitly distinguishes AI search bots (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot) from training bots (GPTBot, ClaudeBot, Google-Extended, CCBot). Clear scope boundary: full taxonomy with robots.txt rules lives in seo-meta appendix-ai-bots.md (verified file exists). Anti-pattern 5 at line 1046 reinforces distinction. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| skills/structured-data/SKILL.md | Domain-tier skill with 4 layers + constraints | VERIFIED | 1091 lines, frontmatter has tier domain, version 1.0.0. All 4 layers present (Layer 1: line 9, Layer 2: line 116, Layer 3: line 941, Layer 4: line 1020). Machine-readable constraints table at line 1070 with 18 rows (16 HARD, 2 SOFT). No stub patterns found. |
| TypeScript interfaces (27+) | Plain TS interfaces for all schema types, no schema-dts | VERIFIED | 27 interface declarations for schema types. schema-dts mentioned only in explicit NO schema-dts context (lines 122, 127). Zero import/dependency references. |
| Schema Status Matrix | Honest deprecation info for FAQ, HowTo, WebSite | VERIFIED | Lines 31-41: FAQPage Restricted (gov/health only since Aug 2023), HowTo Deprecated (mobile Aug 2023, desktop Sep 2023), WebSite Schema valid no rich result. Honesty policy statement at line 43. |
| Per-Page-Type Recipe Table | 10+ page types with schema combinations | VERIFIED | Lines 49-61: 11 page types (Homepage, Blog Post, Article/News, Product, Service, About, Contact, Event, Landing, Tutorial/Guide, Portfolio). |
| GEO Content Patterns | BLUF, question headings, quotable stats, FAQ-first | VERIFIED | GEO-01 BLUF with TSX component (lines 737-785). GEO-02 question headings with conversion table (lines 787-805). GEO-03 quotable stats with TSX component and Princeton citation (lines 807-864). GEO-04 FAQ-first with archetype-aware rendering (lines 866-923). |
| SEO-Emotional Arc Beat Mapping | 10 beats mapped, 4 high-impact with HARD enforcement | VERIFIED | Lines 980-991: 10-beat table. 4 high-impact (HOOK, TENSION, PROOF, CLOSE). 6 emotional beats. Constraint table rows at lines 1086-1089 enforce all 4 at HARD level. |
| Schema Audit Protocol | Content-schema consistency checklist + auto-fix | VERIFIED | 14-item checklist (lines 697-706), 4 structural (lines 710-713), 4 external (lines 717-720), 4-step auto-fix (lines 726-729). |
| Anti-Patterns | 6-8 anti-patterns in Layer 4 format | VERIFIED | 8 anti-patterns (lines 1022-1068) in correct format (Name / What goes wrong / Instead). |
| Machine-Readable Constraints | 15+ rows with HARD/SOFT enforcement | VERIFIED | 18 rows (lines 1074-1091): 16 HARD, 2 SOFT. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| structured-data SKILL.md | seo-meta SKILL.md | Related Skills section + boundary definitions | VERIFIED | Lines 24-25 (When NOT to Use), line 112 (Pipeline Connection), line 1012 (Related Skills). seo-meta reciprocally references structured-data at its lines 26, 112, 808, 849. |
| structured-data SKILL.md | seo-meta appendix-ai-bots.md | AI crawler guidance scope boundary | VERIFIED | Lines 939, 1012, 1050 reference appendix-ai-bots.md. File exists at skills/seo-meta/appendix-ai-bots.md. |
| structured-data SKILL.md | emotional-arc SKILL.md | Beat mapping table (GEO-05) | VERIFIED | Lines 976-1002 map to emotional-arc beat types. emotional-arc skill defines these beat types. Integration is one-directional (structured-data extends emotional-arc), correct for newer skill extending older one. |
| seo-meta SKILL.md | structured-data SKILL.md | Reciprocal reference | VERIFIED | seo-meta references structured-data as complementary skill in When NOT to Use, Pipeline output, DNA Connection, and Related Skills sections. |
| search-visibility SKILL.md | structured-data SKILL.md | Complementary skill reference | VERIFIED | search-visibility references structured-data at line 23 for JSON-LD schema types. |
### Requirements Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| SDATA-01: Typed JSON-LD generation | SATISFIED | 27 TypeScript interfaces (plain, no schema-dts), JsonLd component (React + Astro), @graph combination pattern. Decision to use plain TS instead of schema-dts documented in 15-CONTEXT.md. |
| SDATA-02: FAQ schema with validation | SATISFIED | SDATA-02 pattern (lines 478-539) with single-source data array, prominent restricted to gov/health warning. |
| SDATA-03: HowTo schema | SATISFIED | SDATA-03 pattern (lines 541-597) with HowTo alongside Article in @graph, prominent deprecated rich results warning. |
| SDATA-04: Article schema variants | SATISFIED | SDATA-04 pattern (lines 599-635) covering Article, BlogPosting, NewsArticle with subtype guidance and image requirements. |
| SDATA-05: Organization schema | SATISFIED | SDATA-05 pattern (lines 637-687) with logo as ImageObject, contactPoint array, sameAs social profiles, @id referencing. |
| SDATA-06: Schema audit protocol | SATISFIED | Full audit protocol (lines 689-731) with 14-item checklist, auto-fix protocol, mandate to run on every quality-reviewer pass. |
| GEO-01: Content structuring patterns | SATISFIED | GEO section (lines 733-923) with BLUF, question headings, quotable stats, FAQ-first patterns. |
| GEO-02: BLUF + statistics | SATISFIED | GEO-01 BLUF pattern (lines 737-785), GEO-03 quotable statistics with citations (lines 807-864), Princeton GEO research reference. |
| GEO-03: FAQ-first content | SATISFIED | GEO-04 FAQ-first pattern (lines 866-923) with archetype-aware rendering, single data source, JSON-LD integration. |
| GEO-04: AI crawler taxonomy | SATISFIED | AI Crawler Content Guidance (lines 925-939) distinguishes search bots from training bots, references seo-meta appendix-ai-bots.md for complete taxonomy. |
| GEO-05: SEO-Emotional Arc integration | SATISFIED | Beat mapping table (lines 976-1002) with 4 high-impact beats, hard enforcement, schema assembly guidance. Constraint table rows enforce at HARD level. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| skills/structured-data/SKILL.md | 699 | placeholder in audit checklist | Info | Not a stub -- instructional text telling agents to verify datePublished is not a placeholder. Correct usage. |

No blockers, warnings, or actual stub patterns found.

### Human Verification Required

### 1. Skill Discovery by Plugin System

**Test:** Trigger the plugin system with a query matching structured-data triggers (e.g., add JSON-LD to this page) and verify the structured-data skill is loaded.
**Expected:** Plugin auto-discovers skills/structured-data/SKILL.md and loads it as a domain-tier skill.
**Why human:** Plugin discovery mechanism cannot be verified structurally -- requires runtime testing.

### 2. Schema Audit Protocol Effectiveness

**Test:** After building a page with /gen:execute, modify visible content via /gen:iterate, then run quality reviewer.
**Expected:** Quality reviewer detects schema-content mismatch and auto-fixes JSON-LD to match updated visible content.
**Why human:** Requires end-to-end pipeline execution to verify the audit protocol works in practice.

### 3. Archetype-GEO Intensity Application

**Test:** Build an FAQ section on a Luxury/Fashion archetype project and a Neo-Corporate archetype project.
**Expected:** Luxury gets elegant Q&A with minimal chrome (Subtle tier). Neo-Corporate gets standard accordion with visually prominent GEO (Full tier). Both produce identical JSON-LD.
**Why human:** Visual styling differences per archetype require visual inspection.

### Gaps Summary

No gaps found. All 5 success criteria from ROADMAP.md are fully addressed in the actual codebase:

1. The structured-data skill exists as a Domain-tier skill (1091 lines) with 27 plain TypeScript interfaces covering all 9 required schema types, an 11-page-type recipe table, and the @graph combination pattern with conditional inclusion.

2. GEO content structuring patterns (BLUF, question headings, quotable statistics, FAQ-first) are documented with TSX component patterns and archetype-aware intensity guidance across all 19 archetypes in 4 tiers, with explicit anti-patterns preventing over-optimization.

3. The SEO-Emotional Arc integration maps all 10 beat types: 4 high-impact (HOOK, TENSION, PROOF, CLOSE) with prescriptive SEO elements and HARD enforcement, 6 emotional beats explicitly free from SEO requirements. Schema assembly guidance shows how beats contribute to page-level @graph.

4. The schema audit protocol has a 14-item content-schema consistency checklist, structural validation, external validation guidance, and auto-fix protocol, mandated to run on every quality-reviewer pass (after both execute and iterate). Two dedicated anti-patterns reinforce this.

5. AI crawler guidance distinguishes training bots (block) from search bots (allow) with specific bot names, scope boundary to seo-meta appendix-ai-bots.md for full taxonomy, and a dedicated anti-pattern against blanket blocking.

One notable deviation from the original REQUIREMENTS.md: SDATA-01 originally specified schema-dts library, but this was changed to plain TypeScript interfaces during context gathering (documented in 15-CONTEXT.md). This is a valid design decision -- hand-written interfaces eliminate a runtime/dev dependency while providing equivalent type safety.

---

_Verified: 2026-02-25T14:30:00Z_
_Verifier: Claude (gsd-verifier)_
