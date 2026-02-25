# Modulo Skill Directory

> Authoritative registry of all Modulo skills. Agents reference this document to discover available skills, understand their loading behavior, and check which v6.1.0 skills were culled and why.

## Skill Architecture Overview

Modulo organizes skills into a **3-tier loading system** that controls context window consumption:

| Tier | Loading | When | Context Budget | Skills |
|------|---------|------|----------------|--------|
| **Core** | Always loaded | Every Modulo session | ~10,000 lines total | 22 skills |
| **Domain** | Per-project | Agent decides based on project type, archetype, and current task | Only relevant subset | 26 skills |
| **Utility** | On-demand | Explicit reference when specific need arises | Only when needed | 2 skills |

**Why tiers matter:** Loading all 50 skills into every session wastes thousands of lines of context on skills that may never apply. Tier-based loading keeps Core skills available for every decision while deferring Domain and Utility skills until they are actually needed.

### 4-Layer Format Standard

Every skill follows the 4-layer format defined in `skills/_skill-template/SKILL.md`:

| Layer | Purpose | Content |
|-------|---------|---------|
| **Layer 1: Decision Guidance** | When and why to use this skill | Triggers, decision trees, pipeline connections |
| **Layer 2: Award-Winning Examples** | HOW (code) and WHY (references) | Copy-paste TSX patterns + annotated award-winning sites |
| **Layer 3: Integration Context** | System connections | DNA token mappings, archetype variants, related skills |
| **Layer 4: Anti-Patterns** | Common mistakes | 3-5 named mistakes with wrong/right approach |

**Frontmatter requirements:** Every SKILL.md includes YAML frontmatter with `name`, `description`, `tier`, `triggers`, and `version` fields.

**Target length:** 300-600 lines per skill. Core skills may exceed for completeness (Phase 1-5 foundational skills range from 397-1417 lines because they define systems with many archetype variants).

**Machine-readable constraints:** Skills with enforceable parameters include a constraint table with columns: Parameter | Min | Max | Unit | Enforcement (HARD/SOFT).

---

## Core Skills

Core skills are loaded in **every** Modulo session. They define the identity, quality, motion, and infrastructure systems that every builder, reviewer, and planner must reference.

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `design-dna` | COMPLETE | 1 | 477 | Machine-enforceable visual identity: 12 color tokens, 8-level type scale, 5-level spacing, signature element, 8 motion tokens, full DESIGN-DNA.md template |
| `design-archetypes` | COMPLETE | 1 | 1184 | 19 archetype personality systems with locked palettes, required fonts, mandatory techniques, forbidden patterns, named-pattern signatures, and 3 tension zones each |
| `anti-slop-gate` | COMPLETE | 1 | 397 | 35-point weighted quality scoring across 7 categories, penalty system, named quality tiers (Pass/Strong/SOTD-Ready/Honoree-Level), remediation protocol |
| `emotional-arc` | COMPLETE | 1 | 680 | 10 beat types with hard parameter constraints, archetype overrides, sequence validation, 6 transition techniques, default arc templates |
| `quality-gate-protocol` | COMPLETE | 4 | 464 | 4-layer progressive quality enforcement: reference targets, anti-slop gate, Awwwards 4-axis scoring, findings merge protocol |
| `compositional-diversity` | COMPLETE | 4 | 350 | 18-pattern layout taxonomy in 6 visual groups (A-F) with adjacency rules, background alternation, archetype pattern preferences |
| `polish-pass` | COMPLETE | 4 | 695 | End-of-build polish protocol: 19 archetype addenda, 8 universal micro-detail categories, 10 enforcement parameters |
| `reference-benchmarking` | COMPLETE | 4 | 568 | Per-section quality targets from award-winning sites: 6 quality attributes, key-beat reference targets, top-5 archetype curated sets |
| `cinematic-motion` | COMPLETE | 5 | 705 | Unified motion design system (subsumes css-animations, framer-motion, gsap): 19 archetype motion profiles, 10 constraint parameters |
| `creative-tension` | COMPLETE | 5 | 998 | 5 tension types with per-archetype implementations, 10-level boldness calibration, 10 enforcement parameters |
| `wow-moments` | COMPLETE | 5 | 1417 | 35 signature interaction patterns in 3 tiers, auto-suggestion matrix, 19 archetype intensity profiles |
| `design-system-scaffold` | COMPLETE | 5 | 768 | Wave 0 scaffold generator: Tailwind v4 @theme, typed utilities, DNA-to-code pipeline, 6 scaffold templates |
| `performance-animation` | COMPLETE | 5 | 537 | Performance-aware animation: CWV compliance, will-change budget (10 active), font loading, 80 KB JS budget, code-splitting patterns |
| `design-brainstorm` | COMPLETE | 6 | 615 | Research-first creative direction engine: 12 industry verticals, 7-phase protocol, full teardown framework |
| `creative-direction-format` | COMPLETE | 6 | 589 | Creative direction concept board format: 12 ASCII symbols, 5 canonical templates, 7-step mixing protocol |
| `tailwind-system` | COMPLETE | 8 | 877 | Tailwind CSS v4 CSS-first configuration: @theme syntax, v3-to-v4 migration, container query breakpoints, DNA token mapping |
| `responsive-design` | COMPLETE | 8 | 687 | Mobile-first responsive design: 375px floor, fluid scaling, container queries, archetype recomposition styles |
| `accessibility` | COMPLETE | 8 | 929 | WCAG 2.1 AA compliance: 19 archetype focus mappings, 6 ARIA components, reduced-motion per archetype, inert-based focus traps |
| `progress-reporting` | COMPLETE | 9 | 539 | Multi-level progress reporting: 4-tier (task/section/wave/milestone), STATE.md budget, wave review hard gates |
| `error-recovery` | COMPLETE | 9 | 594 | Structured error diagnosis: 3-severity classification, checkpoint resume, FAILURE-LOG.md, pre-wave checkpoints |
| `live-testing` | COMPLETE | 9 | 526 | Automated browser testing via Playwright MCP: visual QA overlay diff (pixelmatch), 3-tier verdict system |
| `seo-meta` | COMPLETE | 14 | 928 | Core SEO patterns: meta tags, canonical URLs, sitemaps, robots.txt, hreflang, Open Graph, Twitter Cards, Core Web Vitals -- framework-native for Next.js 16, Astro 5, React 19 |

---

## Domain Skills

Domain skills are loaded **per project** based on the project's archetype, technology stack, and current build phase. Agents decide which Domain skills to load.

### Motion and Animation

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `page-transitions` | COMPLETE | 5 | 690 | Page transition system: View Transitions API, shared element animations, 13 archetype mappings, hierarchy-aware directional logic |

### Content and Strategy

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `copy-intelligence` | COMPLETE | 6 | 629 | Brand voice generation engine: 19 archetype voice profiles, 18 banned phrases, voice extraction protocol, content bank formulas |
| `cross-pollination` | COMPLETE | 6 | 485 | Industry-specific convention borrowing: 12 vertical pairings, principle-level cross-pollination, double coherence guardrail |

### Asset Specialists

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `shape-asset-generation` | COMPLETE | 7 | 1304 | Procedural shape generation: 25 SVG/CSS patterns, 19-archetype palette, isometric/pseudo-3D, GSAP MorphSVG + DrawSVG |
| `three-d-webgl-effects` | COMPLETE | 7 | 1138 | 3D and WebGL with React Three Fiber v9: simplex noise GLSL, 5 scroll-driven patterns, 12 archetype post-processing variants |
| `remotion-video` | COMPLETE | 7 | 765 | Programmatic video with Remotion: 3 composition templates, DNA tokens as JS module, archetype spring mapping |
| `spline-integration` | COMPLETE | 7 | 422 | Spline 3D scene embedding: 7 code patterns, scene creation guidance, performance optimization |
| `component-marketplace` | COMPLETE | 7 | 362 | When-to-use guidance for Aceternity/Magic UI/21st.dev: 8 machine-readable constraints, ~30% visual element cap |
| `image-prompt-generation` | COMPLETE | 7 | 453 | DNA-matched AI image prompts: tool-agnostic templates, 14 automatic negative prompt rules, volatile tool appendix |

### Framework Support

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `nextjs-patterns` | COMPLETE | 8 | 619 | Next.js 16 patterns: App Router + Pages Router, React 19.2 features, proxy.ts, async params |
| `react-vite-patterns` | COMPLETE | 8 | 617 | React/Vite SPA patterns: 8 code patterns covering SPA differences from Next.js, client-side routing |
| `astro-patterns` | COMPLETE | 8 | 570 | Astro 5/6 patterns: Content Layer API, Server Islands, ClientRouter, hybrid rendering |
| `desktop-patterns` | COMPLETE | 8 | 771 | Tauri v2 and Electron desktop design: window chrome, drag regions, 10 archetype titlebar variants, 800px minimum |

### Design Systems

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `dark-light-mode` | COMPLETE | 8 | 743 | Archetype-aware dark/light mode: 19 archetype transitions, dual depth model, View Transitions API toggle, accessible component |
| `multi-page-architecture` | COMPLETE | 8 | 637 | Site-level DNA extensions: 7 page-type templates with arc tables, 3 shared component patterns, wave structure for multi-page |

### Industry Verticals

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `ecommerce-ui` | COMPLETE | 8 | 396 | E-commerce UI patterns: product pages, carts, checkout flows, storefront patterns |
| `dashboard-patterns` | COMPLETE | 8 | 424 | Dashboard UI patterns: data display, widget systems, chart integration |
| `portfolio-patterns` | COMPLETE | 8 | 448 | Portfolio UI patterns: project showcases, case study layouts, creative presentation |
| `blog-patterns` | COMPLETE | 8 | 381 | Blog and article UI patterns: reading experience, article typography, blog index layouts |

### Integration

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `figma-integration` | COMPLETE | 9 | 785 | Figma design import via MCP tools: 13 tools (7 primary + 6 secondary), pixelmatch visual QA, token resolution protocol |
| `design-system-export` | COMPLETE | 9 | 881 | Storybook 10 CSF Factories + W3C DTCG design tokens: Style Dictionary 5, 3 export platforms (CSS/JSON/Figma) |

### SEO & Visibility

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `structured-data` | COMPLETE | 15 | 1091 | Typed JSON-LD schemas for rich results: FAQPage, Article, Product, LocalBusiness, Organization, WebSite, BreadcrumbList, HowTo, Event -- per-page recipes, @graph combinations, GEO content patterns, schema audit protocol |
| `search-visibility` | COMPLETE | 16 | 579 | IndexNow instant indexing, AI-aware robots.txt presets, llms.txt generation, unified indexing strategy, webmaster tools submission workflows for Next.js 16 and Astro 5 |
| `og-images` | COMPLETE | 18 | 1252 | Dynamic OG image generation from Design DNA tokens: branded 1200x630 social previews using next/og ImageResponse (Next.js) and Satori + sharp (Astro), 3 archetype-influenced template types |
| `api-patterns` | COMPLETE | 17 | 1601 | Server-side API integration: Context7 MCP for live docs, server-side proxies with env secret protection, CRM form patterns (HubSpot, Salesforce), typed API clients with discriminated unions, webhook receivers with signature verification, Cloudflare Turnstile spam protection |
| `ssr-dynamic-content` | COMPLETE | 19 | 1842 | SSR/ISR/streaming decision guidance: 4-dimension rendering matrix, Cache Components (Next.js 16), Server Islands (Astro 5), CMS webhook revalidation for 5 platforms, auth-gated rendering for 4 libraries, cache invalidation strategies, loading state patterns |

---

## Utility Skills

Utility skills are loaded **on-demand** when a specific technical need arises. They cover specialized cross-cutting concerns.

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `form-builder` | COMPLETE | 8 | 437 | Form UI patterns: react-hook-form, zod validation, accessible form components |
| `i18n-rtl` | COMPLETE | 8 | 305 | Internationalization and RTL layout: locale-aware formatting, bidirectional text patterns |

---

## Legacy Skills

27 v6.1.0 skills remain in the `skills/` directory. These have NOT been rewritten to the v2.0 4-layer format.

### Superseded by v2.0 Skills (Removed)

12 superseded skills were removed in Phase 13 (accessibility-patterns, conversion-patterns, creative-sections, light-mode-patterns, micro-copy, mobile-navigation, mobile-patterns, modal-dialog-patterns, nextjs-app-router, premium-dark-ui, premium-typography, responsive-layout). One superseded skill remains:

| Legacy Skill | Superseded By | Notes |
|-------------|--------------|-------|
| `chart-data-viz` | `dashboard-patterns` | Absorbed into dashboard-patterns |

### Unrewritten Legacy Skills

These legacy skills have no direct v2.0 replacement:

| Legacy Skill | Lines | Notes |
|-------------|-------|-------|
| `auth-ui` | 180 | Authentication UI patterns |
| `awwwards-scoring` | 168 | Disposition deferred (keep separate or fold into anti-slop-gate) |
| `context-menu` | 410 | Context menu patterns |
| `data-table` | 190 | Data table patterns |
| `drag-and-drop` | 282 | Drag and drop interaction |
| `email-notification-ui` | 275 | Email and notification UI |
| `error-states-ui` | 273 | Error state display patterns |
| `file-upload-media` | 291 | File upload and media handling |
| `glow-neon-effects` | 307 | Glow and neon visual effects |
| `image-asset-pipeline` | 251 | Image optimization pipeline |
| `landing-page` | 405 | Landing page patterns |
| `map-location` | 210 | Map and location UI |
| `markdown-mdx` | 396 | Markdown and MDX rendering |
| `navigation-patterns` | 273 | Navigation layout patterns |
| `notification-center` | 379 | Notification center UI |
| `onboarding-tours` | 222 | Onboarding tour patterns |
| `performance-guardian` | 140 | Non-animation performance (partially superseded by performance-animation) |
| `performance-patterns` | 331 | Performance optimization patterns |
| `print-pdf` | 230 | Print and PDF generation |
| `rating-review` | 281 | Rating and review UI |
| `search-ui` | 222 | Search interface patterns |
| `shadcn-components` | 484 | shadcn/ui integration patterns |
| `skeleton-loading` | 244 | Skeleton loading states |
| `social-features` | 205 | Social feature UI |
| `testing-patterns` | 325 | Testing pattern guidance |
| `ux-patterns` | 304 | General UX patterns |

### Template

| Directory | Lines | Notes |
|-----------|-------|-------|
| `_skill-template` | 144 | Canonical 4-layer format reference -- not a real skill, used as template for new skill creation |

---

## Skill Count Summary

| Category | Count | Status |
|----------|-------|--------|
| Core | 22 | All COMPLETE |
| Domain | 26 | All COMPLETE |
| Utility | 2 | All COMPLETE |
| Legacy (superseded) | 1 | LEGACY -- v2.0 replacement exists (chart-data-viz) |
| Legacy (unrewritten) | 26 | LEGACY -- evaluation pending |
| Legacy (template) | 1 | Reference template |
| **Total v2.0** | **51** | **50 skills + 1 template** |
| **Total in filesystem** | **78** | **51 v2.0 + 27 legacy** |

---

## v6.1.0 Cull List

The following tables document every skill disposition from the v6.1.0 codebase (87 skills). Every v6.1.0 skill is accounted for: kept, removed, merged, or absorbed.

### Removed Skills (18)

Backend, infrastructure, and app-pattern skills that are not frontend design concerns.

| v6.1.0 Skill | Lines | Reason |
|---------------|-------|--------|
| `admin-panel` | 491 | Backend CRUD patterns, not frontend design |
| `webhook-api-patterns` | 354 | Pure backend integration |
| `database-crud-ui` | 394 | Backend data layer |
| `analytics-tracking` | 227 | Infrastructure, not design |
| `cms-integration` | 257 | Backend integration |
| `payment-ui` | 223 | Backend payment logic |
| `data-fetching` | 280 | State management, not design |
| `state-management` | 207 | Architecture concern, not design |
| `multi-tenant-ui` | 199 | Architecture concern |
| `pwa-patterns` | 236 | Infrastructure, not design |
| `collaboration-realtime` | 356 | Backend integration |
| `advanced-kanban` | 448 | App pattern, not design skill |
| `code-editor-terminal` | 483 | App pattern, not design skill |
| `rich-text-editor` | 259 | App pattern, not design skill |
| `timeline-gantt` | 315 | App pattern, not design skill |
| `virtual-scroll` | 404 | Performance technique, not design |
| `ai-chat-interface` | 378 | App pattern, not design skill |
| `real-time-ui` | 237 | App pattern, not design skill |

### Merged Skills (14 source -> 6 new)

Overlapping skills (>50% shared content) consolidated into single skills.

| New Skill | Source Skills | Rationale |
|-----------|--------------|-----------|
| `responsive-design` | responsive-layout, mobile-patterns, mobile-navigation | All three address responsive/mobile concerns with significant overlap |
| `dark-light-mode` | premium-dark-ui, light-mode-patterns | Both cover theme mode implementation |
| `copy-intelligence` | micro-copy, conversion-patterns | Copy quality and conversion overlap substantially |
| `design-system-scaffold` | design-system-scaffold, design-tokens-sync, component-library-setup | Token sync and component library are scaffold sub-tasks |
| `shape-asset-generation` | geometry-shapes (renamed and expanded) | Broader scope than just geometry |

### Absorbed Skills (5)

Thin skills (<100-180 lines) folded into larger parent skills.

| v6.1.0 Skill | Lines | Absorbed Into | Rationale |
|---------------|-------|---------------|-----------|
| `v0-ahh` | 92 | REMOVED (meta-skill) | Self-referential plugin skill, no design value |
| `design-brainstorm` | 141 | `creative-direction-format` | Too thin as standalone; brainstorming is part of creative direction (NOTE: `design-brainstorm` was later created as its own v2.0 skill in Phase 6) |
| `responsive-layout` | 164 | `responsive-design` | Part of responsive merge |
| `awwwards-scoring` | 168 | Deferred (keep separate or fold into anti-slop-gate) | Decision deferred to Phase 4/8 |
| `chart-data-viz` | 179 | `dashboard-patterns` | Data visualization is dashboard-specific |

### Also Removed (5 internal/process skills)

| v6.1.0 Skill | Reason |
|---------------|--------|
| `plan-format` | Internal build process, not a design skill |
| `quality-standards` | Absorbed into `anti-slop-gate` (enforcement system) |
| `design-workflow` | Replaced by agent pipeline (Phase 2 agents handle workflow) |
| `visual-auditor` | Replaced by `quality-reviewer` agent (Phase 2) |
| `design-tokens-sync` | Merged into `design-system-scaffold` |

### Disposition Summary

| Category | Count | Total Lines Removed |
|----------|-------|---------------------|
| Removed (non-design) | 18 | 5,489 |
| Merged (14 -> 6) | 8 net reduction | ~1,200 consolidated |
| Absorbed into parents | 5 | 744 |
| Also removed (internal) | 5 | ~600 |
| **Total culled** | **~36 skills** | **~8,000 lines** |

---

## 4-Layer Format Reference

All new and rewritten skills MUST follow the 4-layer format. See:

- **Template:** `skills/_skill-template/SKILL.md` -- Copy and fill in each section
- **Exemplar (identity):** `skills/design-dna/SKILL.md` -- 477 lines, DNA token system
- **Exemplar (catalog):** `skills/design-archetypes/SKILL.md` -- 1184 lines, 19 archetype definitions
- **Exemplar (enforcement):** `skills/anti-slop-gate/SKILL.md` -- 397 lines, scoring system
- **Exemplar (constraints):** `skills/emotional-arc/SKILL.md` -- 680 lines, beat parameter tables
- **Exemplar (quality protocol):** `skills/quality-gate-protocol/SKILL.md` -- 464 lines, 4-layer progressive enforcement
- **Exemplar (unified system):** `skills/cinematic-motion/SKILL.md` -- 705 lines, unified motion (subsumes 3 v6.1.0 skills)

**Key format rules:**

1. YAML frontmatter with `name`, `description`, `tier`, `triggers`, and `version` fields
2. Layer 1 (Decision Guidance) answers: when to use, when NOT to use, decision tree, pipeline connection
3. Layer 2 (Award-Winning Examples) provides BOTH copy-paste TSX code AND annotated reference sites
4. Layer 3 (Integration Context) maps DNA tokens, archetype variants, pipeline position, related skills
5. Layer 4 (Anti-Patterns) names 3-5 common mistakes with wrong/right approach
6. Machine-readable constraint tables (optional) use: Parameter | Min | Max | Unit | Enforcement (HARD/SOFT)
7. Target 300-600 lines; Core skills may exceed when content is substantive

---

*Registry version: 2.2.0*
*Last updated: Phase 20, Plan 1 -- v1.5 gap closure (api-patterns + ssr-dynamic-content registration)*
*Total v2.0 skills: 51 (22 core, 26 domain, 2 utility + 1 template)*
