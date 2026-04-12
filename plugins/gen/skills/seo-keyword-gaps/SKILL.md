---
name: seo-keyword-gaps
tier: domain
description: "Competitive keyword-gap analysis — identify queries competitors rank for that the current site doesn't, map gaps to section beats (PROOF, BUILD) with suggested content. Complements seo-technical/geo-optimization (infrastructure) with content-level SEO."
triggers: ["seo keyword gap", "keyword gap analysis", "competitor ranking", "content seo", "organic competitor", "serp gap"]
used_by: ["seo-geo-specialist", "content-specialist", "start-project", "plan"]
version: "3.2.0"
---

## Layer 1: Decision Guidance

### Why

`seo-technical` handles sitemaps/meta/schema. `geo-optimization` handles AI-crawler directives. Neither answers: **what content should this site actually have to rank?** This skill fills that gap by analyzing competitor SERP coverage and surfacing queries the site is missing.

### When to Use

- After archetype + initial content plan but before `/gen:build`.
- During `/gen:discuss phase=content` for content-specialist input.
- Post-launch audit when organic traffic underperforms.

### When NOT to Use

- Projects with no public SEO target (internal tools, auth-gated apps).
- Brand-new domain with zero ranking history (nothing to gap-analyze against).

## Layer 2: Protocol

### 1. Seed set

From `/gen:start-project` discovery, user provides 3-5 competitor domains + optional existing site URL. If not provided, `brand-voice-extraction` already harvested these — reuse.

### 2. Query extraction

For each competitor:
- Scrape h1/h2/h3 across sitemap-listed pages (Playwright)
- Extract query-like phrases (2-5 words, noun-phrase heavy)
- Extract from `<meta name="description">` + title tags
- De-duplicate + normalize

### 3. Client-site query coverage

Run same extraction on client current site (if exists). Compute the **gap set**: queries in competitor union NOT in client set.

### 4. Rank gaps by intent

Classify each gap query:

| Intent class | Maps to beat | Example |
|---|---|---|
| Informational ("how to", "what is") | BUILD or BREATHE (learn/resource sections) | "how to choose a CMS" |
| Transactional ("buy", "pricing", "free trial") | PEAK or CLOSE | "sanity pricing vs payload" |
| Navigational (brand + feature) | PROOF or REVEAL | "linear keyboard shortcuts" |
| Comparative ("X vs Y", "alternatives") | TENSION or PROOF | "notion alternatives for teams" |

### 5. Output: `.planning/genorah/seo/KEYWORD-GAPS.md`

```markdown
# Keyword Gaps

Analyzed: {timestamp}
Competitors: {list}
Client: {url or "new site"}

## Summary
- Total unique queries across competitors: 142
- Client coverage: 38 (27%)
- Gap: 104 queries

## Top 20 gaps by opportunity (intent × volume × difficulty)

| Rank | Query | Intent | Competitor(s) | Suggested beat | Suggested page |
|---|---|---|---|---|---|
| 1 | "headless cms comparison 2026" | Comparative | Sanity, Contentful | PROOF | /compare |
| 2 | "payload 3 vs strapi" | Comparative | Payload, Strapi | PROOF | /blog/payload-vs-strapi |
| ... |

## Integration into build

Recommended additions to MASTER-PLAN.md:
- New PROOF section: `/compare` — comparison table against top 3 competitors
- Extend hero copy with head term "headless CMS comparison"
- 3 new blog posts targeting top informational gaps
```

### 6. Automated content brief

For each top gap, generate a 1-page content brief (target query, search intent, suggested H1/H2, anchor text ideas, internal link candidates). Content-specialist consumes these.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| max_competitors_analyzed | 3 | 5 | count | HARD |
| max_pages_per_competitor | — | 50 | count | SOFT (crawl budget) |
| min_query_length | 2 | — | words | HARD |
| max_query_length | — | 8 | words | HARD (long-tail cap) |
| rate_limit_per_domain | — | 1 | req/2s | HARD |

## Layer 3: Integration Context

- **seo-geo-specialist agent** — invokes this in audit mode; content-gap findings appear in audit report.
- **content-specialist** — reads KEYWORD-GAPS.md when generating CONTENT.md; addresses top gaps naturally.
- **design-brainstorm** — gap intents inform `/gen:discuss` section proposals (add PROOF/comparative sections).
- **geo-optimization** — content patterns (BLUF, FAQ) already specified; this skill identifies WHICH questions to answer.
- **Competitive-benchmarking** — overlap: benchmarking scores visual quality; this skill scores SEO coverage. Both use same competitor list.

## Layer 4: Anti-Patterns

- ❌ **Chasing every gap query** — top 20 by intent+volume, not 200. Focus converts.
- ❌ **Keyword stuffing to "fill" gaps** — content must address intent naturally. This skill surfaces opportunities, not mandates.
- ❌ **Ignoring client current site coverage** — double-counting queries client already ranks for wastes planning cycles.
- ❌ **Trusting scraped query volumes** — Playwright doesn't give search volume. For volume data, pair with Ahrefs/Semrush API (user-provided keys). This skill's "opportunity" score is a heuristic, not ground truth.
- ❌ **Scraping without rate limit** — respect 1 req/2s per domain. Follow `robots.txt`.
