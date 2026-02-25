# Phase 16: Indexing & Search Visibility - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

New `search-visibility` skill (Domain tier) that gets new and updated pages discovered by search engines and AI engines within minutes. Covers IndexNow auto-setup with framework-specific endpoints, unified indexing strategy across Google/Bing/Yandex/Naver, AI-aware robots.txt extensions (building on Phase 14's foundation), llms.txt for AI discoverability, and webmaster tools submission workflows.

Does NOT include: structured data (Phase 15), meta tags or sitemap generation (Phase 14), or API integration patterns (Phase 17).

</domain>

<decisions>
## Implementation Decisions

### llms.txt and AI Discoverability
- Structured overview depth: site name, description, key pages with one-line summaries, content categories, and update frequency
- Document both approaches: auto-generation from sitemap/routes for speed AND manual template for precision -- let user choose per project
- Include both `llms.txt` (summary) and `llms-full.txt` (detailed content with full page content) variants
- Keep llms.txt section separate from robots.txt AI directives, with clear cross-references between them

### AI Crawler Taxonomy (robots.txt extension)
- Three-tier classification: search bots (allow), AI search bots (allow), AI training bots (configurable)
- Include a living list of known AI crawlers with user-agent strings and last-verified dates, PLUS guidance on how to discover and add new crawlers
- Three robots.txt presets for user choice:
  - **Open** — allow all AI crawlers (maximize AI visibility)
  - **Selective** — allow search bots, block training-only bots
  - **Restrictive** — block all AI bots
- Present all three as equal options -- no opinionated default. User chooses based on their business goals
- Do NOT frame blocking training bots as the "right" answer -- it's a trade-off the user should consciously make

### IndexNow Integration
- Full endpoint patterns: complete Route Handler (Next.js) and endpoint (Astro) code, copy-paste ready
- API key stored in framework config (`next.config.ts` / `astro.config.mjs`) with env variable fallback
- Content-hash tracking included to avoid resubmitting unchanged URLs -- with SSR-focused patterns for sites with frequent updates (not just static/SSG)
- Document both single URL and batch submission (up to 10,000 URLs per call) with guidance: single for typical sites, batch for content-heavy/CMS-driven projects
- Include monitoring patterns: log submission results, track success rates, alert on failures

### Submission Workflows
- Step-by-step numbered checklist format for all workflows
- Cover all four search platforms: Google Search Console, Bing Webmaster Tools, Yandex Webmaster, Naver Search Advisor
- Document all verification methods equally (HTML file, DNS record, meta tag, etc.) -- don't just recommend one
- Full post-verification guidance: submit sitemap URL, check indexing status, set up email alerts, interpret coverage reports
- Skip Google sitemap ping entirely (deprecated 2023) -- just show GSC submission as the Google path

### Indexing Strategy Framing
- Honest upfront disclosure: IndexNow works for Bing/Yandex/Naver, Google uses sitemaps + GSC submission. No sugarcoating
- Include comparison matrix (Engine x Method) for quick reference, followed by detailed prose explaining the strategy
- General unified strategy as the default, PLUS project-type recipes as refinements (e.g., "Static blog: sitemap + IndexNow on deploy", "E-commerce: batch IndexNow on product updates", "SaaS landing page: sitemap only")

### Claude's Discretion
- Exact content-hash implementation approach (in-memory vs file-based vs database)
- IndexNow retry logic and error handling specifics
- llms-full.txt content selection (which pages get full content)
- Monitoring implementation details (logging library, alert mechanism)
- How to organize the four platform workflows within the skill (alphabetical, by importance, by IndexNow support)

</decisions>

<specifics>
## Specific Ideas

- User explicitly wants SSR-focused and frequently-updated site capabilities for IndexNow (not just static site patterns)
- All three AI crawler presets should be presented without editorial bias -- the user's business context determines the right choice
- The skill should be comprehensive enough for international projects (hence all four search platforms)

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 16-indexing-search-visibility*
*Context gathered: 2026-02-25*
