# Phase 14: Core SEO Foundation - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite seo-meta as a Core-tier skill with complete per-page metadata patterns for Next.js 16, Astro 5/6, and React 19. Covers meta tags, canonical URLs, sitemaps, robots.txt, AI crawler taxonomy, Core Web Vitals guidance, and a framework capability matrix that honestly discloses SPA limitations. Framework-native only -- no react-helmet, next-seo, next-sitemap.

</domain>

<decisions>
## Implementation Decisions

### Opinionation level
- **Primary + escape hatch** pattern: One recommended approach clearly marked as default per framework, with a noted alternative for edge cases (dynamic routes, i18n, etc.)
- **Hard rules** for canonical URLs, sitemap generation, and metadataBase -- framed as non-negotiable requirements, quality reviewer flags violations
- **Separate recipes per framework** -- Next.js 16, Astro 5/6, and React/Vite each get self-contained sections, no inline conditionals agents must parse
- **Enforceable constraint table** with hard min/max values for SEO elements (title length, description length, OG image dimensions) -- quality reviewer can flag violations automatically

### AI crawler taxonomy
- **Blocklist approach** -- allow by default, explicitly block known training bots. Simpler, less maintenance risk
- **Comprehensive list** of every known AI crawler (30+ entries) with categorization (search, training, unknown)
- **Per-bot rationale** -- each bot gets a one-line comment explaining what it does and why it's allowed/blocked
- **Static + review protocol** -- date stamp on the bot list plus a short section explaining how to check for new crawlers (quarterly review cadence)

### Skill structure & depth
- **Explain then recipe** -- brief explanation of the SEO principle first, then the code pattern. Agents understand what they're generating, not just copy-pasting
- **Main + appendices** -- core patterns in SKILL.md, detailed references (bot taxonomy, framework capability matrix) in separate files in the same skill directory
- **Layer 2 = code patterns + before/after audits** -- complete framework code patterns as primary content, with brief before/after annotations showing what each pattern fixes
- **Framework capability matrix integrated into Layer 1** -- woven into Decision Guidance so agents immediately surface SPA limitations when encountering React/Vite, rather than requiring agents to seek it out

### Claude's Discretion
- Exact organization of appendix files (naming, how many)
- Which specific constraints get hard enforcement vs guidance in the constraint table (based on SEO impact severity)
- Core Web Vitals guidance depth (this phase establishes the hooks, Phase 18 wires deeper)
- Anti-pattern selection for Layer 4

</decisions>

<specifics>
## Specific Ideas

- The existing seo-meta skill was deemed "too shallow" -- the rewrite must be substantially deeper with explain-first approach
- v1.5 decision: replace seo-meta entirely, not patch it
- v1.5 decision: framework-native only -- no react-helmet, no next-seo, no next-sitemap
- Bot taxonomy should be educational enough that a developer reading it understands the AI crawler landscape, not just which directives to copy

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 14-core-seo-foundation*
*Context gathered: 2026-02-25*
