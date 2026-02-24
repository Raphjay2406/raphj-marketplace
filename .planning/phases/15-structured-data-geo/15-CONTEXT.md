# Phase 15: Structured Data & GEO - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

New `structured-data` skill (Domain tier) providing typed JSON-LD schemas for all major page types, plus GEO-optimized content patterns integrated into the Emotional Arc system. Sites built with Modulo appear in Google rich results and AI engine citations. Creating new skills or modifying existing agents beyond structured data and GEO is out of scope.

</domain>

<decisions>
## Implementation Decisions

### Schema coverage & page-type mapping
- Rich & comprehensive schema depth — populate every relevant field Google can use for rich results (author, datePublished, aggregateRating, etc.)
- Cover all major page types: FAQPage, HowTo, Article, BlogPosting, NewsArticle, Organization, WebSite, BreadcrumbList, Product, LocalBusiness, Event
- Use single `@graph` array when a page fits multiple schemas — one script tag combining all applicable schemas
- Plain TypeScript interfaces for type safety (no `schema-dts` dependency) — hand-written interfaces matching schema.org, maintained manually

### GEO vs aesthetics balance
- Archetype-aware GEO — GEO pattern intensity adapts per archetype, same signals with different visual expression
- Styled FAQ sections allowed for all archetypes, including subtle ones (Luxury, Japanese Minimal, Ethereal) — FAQ rendered as elegant accordions matching the archetype's visual language
- Quotable statistics only when content naturally warrants them — no forced stat insertion, no maximum per page
- BLUF formatting for content-heavy pages only (blog posts, articles, documentation) — not for landing pages, portfolios, or product pages where Emotional Arc drives the story

### Emotional Arc integration
- Per-beat prescriptive SEO/GEO mapping for high-impact beats only: Hook (H1 + primary keyword), Proof (statistics + schema), Tension (FAQ + FAQPage schema), Close (CTA + Organization schema)
- Purely emotional beats (Breathe, Tease, Build, Peak, Reveal, Pivot) do not carry required SEO elements
- Hard enforcement — quality reviewer fails builds that miss required SEO elements on mapped beats
- Schema assignment per beat — each high-impact beat prescribes which JSON-LD schema to attach, assembled into page-level `@graph`

### Schema audit & validation
- Run schema audit on every quality-reviewer pass (after execute AND iterate)
- Auto-fix mismatches with notification — agent updates JSON-LD to match current visible content, then reports what changed
- Internal + external validation: content-schema consistency checks plus Google Rich Results Test guidance and interpretation instructions

### Claude's Discretion
- AI crawler guidance at schema level (Speakable schema, author markup for E-E-A-T) — Claude determines what's appropriate beyond Phase 14's robots.txt taxonomy
- Specific archetype-to-GEO-intensity mappings per archetype
- Loading skeleton design for schema-related components
- Exact TypeScript interface structure for each schema type

</decisions>

<specifics>
## Specific Ideas

- GEO should feel invisible on premium archetypes — the content is optimized but the visual never looks like an SEO farm
- FAQ sections should match the archetype's personality (elegant accordion for Luxury, minimal Q&A for Japanese Minimal, bold cards for Brutalist)
- "Best practice" framing: archetype-aware GEO is what top agencies do — same SEO signals, different visual expression

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 15-structured-data-geo*
*Context gathered: 2026-02-25*
