# Phase 18: Dynamic OG Images & Pipeline Wiring - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Every Genorah project gets branded social preview images generated from Design DNA tokens, and all v1.5 skills are wired into the agent pipeline so they activate automatically during builds. OG image generation covers Next.js (`next/og` ImageResponse) and Astro (Satori + sharp/resvg). Pipeline wiring updates agents to reference SEO, structured data, GEO, and search visibility skills at the correct pipeline stages.

</domain>

<decisions>
## Implementation Decisions

### OG template design
- Visual style is **archetype-influenced** -- OG image layout and composition should reflect the active archetype (e.g., Brutalist = raw centered type, Ethereal = soft gradient, Editorial = asymmetric split)
- Content is **title + branding only** -- page title in display font, site name/logo, DNA colors. No contextual metadata (author, price, etc.)
- Canvas layout is **archetype-driven** -- Claude decides layout per archetype rather than one fixed layout for all
- Text handling is **fixed size, always truncate** -- title at one consistent size, truncate after N characters. No auto-scaling

### DNA token mapping
- Color palette uses **semantic subset only** -- bg + primary + text drive the OG image. Accent/glow/secondary reserved for special cases, not default templates
- Signature element **always included** -- the DNA signature element (diagonal slash, gradient orb, etc.) appears on every OG image for brand consistency
- Fonts use **DNA display font** -- the project's actual display font loaded into Satori/ImageResponse, system font for small text (site name)
- Skill provides **full font loading patterns** -- complete code patterns for loading .woff2 fonts into Satori/ImageResponse with fetch + ArrayBuffer, since this is a common pain point

### Template variety & selection
- **3 template types**: article, landing page, product -- matches success criteria
- Selection uses **convention-based auto-detection with explicit override** -- infer from route structure (/blog/* = article, /products/* = product, else = landing), allow override via metadata/frontmatter field
- **Both frameworks covered** -- full patterns for Next.js (next/og ImageResponse) and Astro (Satori + sharp/resvg)

### Pipeline skill activation
- Section-planner assigns structured data schemas **during plan generation** -- schemas planned alongside layout in PLAN.md, not added post-build
- Quality-reviewer SEO checklist is **advisory with severity** -- critical items (missing meta, broken canonical) flagged as errors, minor items (suboptimal description length) flagged as warnings. Errors must fix, warnings recommended
- SEO scaffolding **added to existing Wave 0** -- sitemap.ts, robots.ts, metadata base, OG route added alongside design tokens in the existing scaffold wave
- Researcher agent **gets Context7 MCP tools** integrated directly -- live API documentation lookup during research phase to reduce stale data risk
- Skill discovery uses **existing tier auto-loading** -- Core skills load always, Domain/Utility skills auto-discovered from skill directory. No new mechanism needed
- SKILL-DIRECTORY.md updates handled **at milestone close**, not per-phase -- avoids partial updates

### Claude's Discretion
- Template customization level -- whether to allow minor overrides (custom background, tagline) beyond DNA tokens or keep templates fully locked
- GEO pattern activation logic in content-specialist -- whether always-on or conditional on project type
- Pipeline wiring backward compatibility -- whether additive-only or clean break from v1
- Per-archetype OG layout compositions -- specific layout decisions for each of the 19 archetypes
- Text truncation character limit
- Exact placement of signature element per template type

</decisions>

<specifics>
## Specific Ideas

- Archetype should deeply influence OG composition, not just color swap -- a Brutalist OG image should look fundamentally different from an Ethereal one
- Font loading is a known pain point with Satori -- skill should include complete, copy-paste patterns for .woff2 loading
- Convention-based template selection should "just work" with zero config, but allow explicit override when the developer knows better

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 18-dynamic-og-images-pipeline-wiring*
*Context gathered: 2026-02-25*
