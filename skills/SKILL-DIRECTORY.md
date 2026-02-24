# Modulo Skill Directory

> Authoritative registry of all Modulo skills. Agents reference this document to discover available skills, understand their loading behavior, and check which v6.1.0 skills were culled and why.

## Skill Architecture Overview

Modulo organizes skills into a **3-tier loading system** that controls context window consumption:

| Tier | Loading | When | Context Budget | Skills |
|------|---------|------|----------------|--------|
| **Core** | Always loaded | Every Modulo session | ~2,400 lines total | ~6 skills |
| **Domain** | Per-project | Agent decides based on project type, archetype, and current task | Only relevant subset | ~15-20 skills |
| **Utility** | On-demand | Explicit reference when specific need arises | Only when needed | ~20-30 skills |

**Why tiers matter:** Loading all 50+ skills into every session wastes 15,000+ lines of context on skills that may never apply. Tier-based loading keeps Core skills available for every decision while deferring Domain and Utility skills until they are actually needed.

### 4-Layer Format Standard

Every skill follows the 4-layer format defined in `skills/_skill-template/SKILL.md`:

| Layer | Purpose | Content |
|-------|---------|---------|
| **Layer 1: Decision Guidance** | When and why to use this skill | Triggers, decision trees, pipeline connections |
| **Layer 2: Award-Winning Examples** | HOW (code) and WHY (references) | Copy-paste TSX patterns + annotated award-winning sites |
| **Layer 3: Integration Context** | System connections | DNA token mappings, archetype variants, related skills |
| **Layer 4: Anti-Patterns** | Common mistakes | 3-5 named mistakes with wrong/right approach |

**Frontmatter requirements:** Every SKILL.md includes YAML frontmatter with `name`, `description`, `tier`, `triggers`, and `version` fields.

**Target length:** 300-600 lines per skill. Core skills may exceed for completeness (the 4 Phase 1 exemplars range from 397-1184 lines because they define foundational systems).

**Machine-readable constraints:** Skills with enforceable parameters include a constraint table with columns: Parameter | Min | Max | Unit | Enforcement (HARD/SOFT).

---

## Core Skills

Core skills are loaded in **every** Modulo session. They define the identity systems that every builder, reviewer, and planner must reference.

| Skill | Status | Phase | Lines | Description |
|-------|--------|-------|-------|-------------|
| `design-dna` | COMPLETE | 1 | 477 | Machine-enforceable visual identity: 12 color tokens, 8-level type scale, 5-level spacing, signature element, 8 motion tokens, full DESIGN-DNA.md template |
| `design-archetypes` | COMPLETE | 1 | 1184 | 19 archetype personality systems with locked palettes, required fonts, mandatory techniques, forbidden patterns, named-pattern signatures, and 3 tension zones each |
| `anti-slop-gate` | COMPLETE | 1 | 397 | 35-point weighted quality scoring across 7 categories, penalty system, named quality tiers (Pass/Strong/SOTD-Ready/Honoree-Level), remediation protocol |
| `emotional-arc` | COMPLETE | 1 | 680 | 10 beat types with hard parameter constraints, archetype overrides, sequence validation, 6 transition techniques, default arc templates |
| `typography` | PLANNED | 5/8 | -- | Premium typography patterns: type scale application, font pairing, responsive sizing, archetype-specific typographic treatments |
| `color-system` | PLANNED | 5/8 | -- | Color theory and application: palette generation, contrast enforcement, DNA token usage patterns, archetype color behavior |

**Exemplars:** The 4 completed Core skills (design-dna, design-archetypes, anti-slop-gate, emotional-arc) serve as reference implementations of the 4-layer format. Read them before writing any new skill.

---

## Domain Skills

Domain skills are loaded **per project** based on the project's archetype, technology stack, and current build phase. Agents decide which Domain skills to load.

### Motion and Animation

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `cinematic-motion` | PLANNED (rewrite) | 5 | Motion language: entrance/exit/hover/scroll animation patterns, archetype motion families |
| `creative-tension` | PLANNED (rewrite) | 5 | 5 tension types: Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock |
| `wow-moments` | PLANNED (rewrite) | 5 | Designated high-impact interactions per page, beat-aligned wow moment patterns |
| `page-transitions` | PLANNED | 5 | Cross-page transition techniques, route-based animation, scroll-driven page shifts |

### Design System

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `design-system-scaffold` | PLANNED (rewrite) | 5 | Wave 0 scaffold generation: tokens, utilities, typed helpers, DNA-to-code pipeline |
| `color-modes` | PLANNED (merger) | 8 | Dark/light mode with archetype-aware transitions (merges premium-dark-ui + light-mode-patterns) |

### Content

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `copy-intelligence` | PLANNED (merger) | 6 | Conversion-focused copy patterns, micro-copy quality, CTA craft (merges micro-copy + conversion-patterns) |
| `creative-direction` | PLANNED | 6 | Creative brainstorming, mood boards, archetype selection guidance (absorbs design-brainstorm) |

### Asset Specialists

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `shape-generation` | PLANNED (rename) | 7 | SVG shape systems, geometric patterns, organic forms, beat-aware shape intensity (replaces geometry-shapes) |
| `three-js-webgl` | PLANNED (rewrite) | 7 | 3D scenes with R3F v9, three-tier responsive (full/reduced/static), WebGPU-ready |
| `remotion` | PLANNED | 7 | Programmatic video generation, motion graphics, animated content |
| `spline-integration` | PLANNED | 7 | Spline 3D scenes, interactive models, embed patterns |
| `image-prompts` | PLANNED | 7 | Tool-agnostic AI image generation prompts with DNA translation and DNA-derived negative prompts |
| `component-marketplace` | PLANNED | 7 | Curated component recommendations, category-level guidance (~30% cap on visual elements) |

### Interaction Patterns

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `interaction-patterns` | PLANNED (merger) | 8 | Drag-and-drop, context menus, modals, dialogs (merges drag-and-drop + context-menu + modal-dialog-patterns) |
| `navigation-patterns` | PLANNED (rewrite) | 8 | Nav layouts, mobile navigation, responsive menu patterns |

### Industry Verticals

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `ecommerce-ui` | PLANNED (rewrite) | 8 | Product pages, carts, checkout flows, storefront patterns |
| `dashboard-patterns` | PLANNED (rewrite) | 8 | Dashboard layouts, data display, widget systems (absorbs chart-data-viz) |
| `landing-page` | PLANNED (rewrite) | 8 | Landing page patterns, conversion funnels, above-fold hooks |
| `portfolio-patterns` | PLANNED (rewrite) | 8 | Portfolio layouts, project showcases, case study patterns |
| `blog-patterns` | PLANNED (rewrite) | 8 | Blog layouts, article typography, reading experience |

---

## Utility Skills

Utility skills are loaded **on-demand** when a specific technical need arises. They cover frameworks, tools, and cross-cutting concerns.

### Frameworks

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `nextjs-app-router` | PLANNED (rewrite) | 8 | Next.js 16 App Router + Pages Router patterns, proxy.ts, async params |
| `astro-patterns` | PLANNED (rewrite) | 8 | Astro 5/6 patterns, ClientRouter, Content Layer API |
| `tailwind-patterns` | PLANNED (rewrite) | 8 | Tailwind v4: @theme syntax, CSS-first config, @property, DNA token mapping |
| `shadcn-components` | PLANNED (rewrite) | 8 | shadcn/ui integration, DNA-aware theming, component customization |

### Animation Libraries

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `framer-motion` | PLANNED (rewrite) | 8 | motion/react patterns (rebranded from framer-motion), layout animations, gestures |
| `gsap-animations` | PLANNED (rewrite) | 8 | GSAP (fully free): ScrollTrigger, MorphSVG, DrawSVG, SplitText |
| `css-animations` | PLANNED (rewrite) | 8 | CSS scroll-driven animations, @supports progressive enhancement, keyframes |

### Cross-Cutting Concerns

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `responsive-design` | PLANNED (merger) | 8 | Fluid layouts, 375px target, container queries, clamp() typography (merges responsive-layout + mobile-patterns + mobile-navigation) |
| `accessibility-patterns` | PLANNED (rewrite) | 8 | WCAG compliance, ARIA patterns, keyboard navigation, screen reader support |
| `seo-meta` | PLANNED (rewrite) | 8 | Meta tags, structured data, Open Graph, performance SEO |
| `performance-patterns` | PLANNED (rewrite) | 8 | Core Web Vitals, image optimization, lazy loading, bundle analysis |
| `testing-patterns` | PLANNED (rewrite) | 8 | Visual regression, component testing, E2E patterns |
| `i18n-rtl` | PLANNED (rewrite) | 8 | Internationalization, RTL layout, locale-aware formatting |

### Integration

| Skill | Status | Phase | Description |
|-------|--------|-------|-------------|
| `figma-integration` | PLANNED | 9 | Figma Dev Mode, token sync, design-to-code pipeline |
| `design-system-export` | PLANNED | 9 | Design system documentation export, Storybook integration |

---

## Skill Count Summary

| Category | Count | Status |
|----------|-------|--------|
| Core | 6 | 4 complete, 2 planned |
| Domain | ~20 | 0 complete, all planned (Phases 5-8) |
| Utility | ~15 | 0 complete, all planned (Phases 8-9) |
| **Total** | **~41** | **4 complete, ~37 planned** |

Final count depends on Phase 5-8 implementation decisions. Target remains **50-60 skills** (down from 87 in v6.1.0). Additional skills may emerge during domain phases; the cull eliminated bloat, not capability.

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
| `color-modes` | premium-dark-ui, light-mode-patterns | Both cover theme mode implementation |
| `interaction-patterns` | drag-and-drop, context-menu, modal-dialog-patterns | UI interaction patterns that share infrastructure |
| `copy-intelligence` | micro-copy, conversion-patterns | Copy quality and conversion overlap substantially |
| `design-system-scaffold` | design-system-scaffold, design-tokens-sync, component-library-setup | Token sync and component library are scaffold sub-tasks |
| `shape-generation` | geometry-shapes (renamed and expanded) | Broader scope than just geometry |

### Absorbed Skills (5)

Thin skills (<100-180 lines) folded into larger parent skills.

| v6.1.0 Skill | Lines | Absorbed Into | Rationale |
|---------------|-------|---------------|-----------|
| `v0-ahh` | 92 | REMOVED (meta-skill) | Self-referential plugin skill, no design value |
| `design-brainstorm` | 141 | `creative-direction` | Too thin as standalone; brainstorming is part of creative direction |
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

### Surviving v6.1.0 Skills (awaiting rewrite)

The following v6.1.0 skills survive but require Phase 5-8 rewrites into the 4-layer format. They remain in the `skills/` directory as reference material until rewritten:

accessibility-patterns, astro-patterns, auth-ui, awwwards-scoring, blog-patterns, chart-data-viz, cinematic-motion, context-menu, conversion-patterns, creative-sections, creative-tension, css-animations, dashboard-patterns, data-table, design-system-scaffold, drag-and-drop, ecommerce-ui, email-notification-ui, error-states-ui, file-upload-media, form-builder, framer-motion, geometry-shapes, glow-neon-effects, gsap-animations, i18n-rtl, image-asset-pipeline, landing-page, light-mode-patterns, map-location, markdown-mdx, micro-copy, mobile-navigation, mobile-patterns, modal-dialog-patterns, navigation-patterns, nextjs-app-router, notification-center, onboarding-tours, performance-guardian, performance-patterns, portfolio-patterns, premium-dark-ui, premium-typography, print-pdf, rating-review, responsive-layout, search-ui, seo-meta, shadcn-components, skeleton-loading, social-features, tailwind-patterns, testing-patterns, three-js-webgl, ux-patterns, wow-moments

---

## 4-Layer Format Reference

All new and rewritten skills MUST follow the 4-layer format. See:

- **Template:** `skills/_skill-template/SKILL.md` -- Copy and fill in each section
- **Exemplar (identity):** `skills/design-dna/SKILL.md` -- 477 lines, DNA token system
- **Exemplar (catalog):** `skills/design-archetypes/SKILL.md` -- 1184 lines, 19 archetype definitions
- **Exemplar (enforcement):** `skills/anti-slop-gate/SKILL.md` -- 397 lines, scoring system
- **Exemplar (constraints):** `skills/emotional-arc/SKILL.md` -- 680 lines, beat parameter tables

**Key format rules:**

1. YAML frontmatter with `name`, `description`, `tier`, `triggers`, `version` fields
2. Layer 1 (Decision Guidance) answers: when to use, when NOT to use, decision tree, pipeline connection
3. Layer 2 (Award-Winning Examples) provides BOTH copy-paste TSX code AND annotated reference sites
4. Layer 3 (Integration Context) maps DNA tokens, archetype variants, pipeline position, related skills
5. Layer 4 (Anti-Patterns) names 3-5 common mistakes with wrong/right approach
6. Machine-readable constraint tables (optional) use: Parameter | Min | Max | Unit | Enforcement (HARD/SOFT)
7. Target 300-600 lines; Core skills may exceed when content is substantive

---

*Registry version: 2.0.0*
*Last updated: Phase 1, Plan 6*
*Total skills: ~41 (4 complete, ~37 planned)*
