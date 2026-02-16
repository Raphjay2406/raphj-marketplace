# modulo

Premium frontend design system for Claude Code. 87 skills, 13 slash commands, and 17 agents for creating Awwwards SOTD-competitive websites with Full Quality Pipeline (visual reference capture, hyper-specific blueprints, content planning, discussion-first protocol, section coherence, live visual feedback, wow factor enforcement), 6-layer Context Rot Prevention (pre-commit hooks, CONTEXT.md anchoring, pre-extracted spawn prompts, canary checks, session boundaries, baked-in rules), Design DNA identity system, 16 opinionated archetypes, creative tension system, emotional arc storytelling, cinematic motion choreography, 35-point anti-slop quality gate, Awwwards 4-axis scoring, UX intelligence patterns, wow moment library, and section layout diversity enforcement. Works with **Next.js** and **Astro**.

## Installation

Via marketplace:
```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
claude plugin install modulo@raphj-marketplace
```

## What's New in v6.1 — Context Rot Prevention

**The problem:** AI agents lose design fidelity during long build sessions. By wave 4+, fonts drift, colors shift, spacing becomes inconsistent, and sections feel like different designers made them. Previous mitigations (80% rule, `.continue-here.md`) were reactive and advisory.

**The solution:** A 6-layer context rot prevention system with zero context window cost for most layers:

| Layer | Mechanism | Context Cost |
|-------|-----------|-------------|
| **L0** | Pre-commit DNA compliance hook — greps staged files for anti-slop violations | Zero (shell script) |
| **L1** | CONTEXT.md — single source of truth rewritten after every wave | Low (~50 lines) |
| **L2** | Pre-extracted spawn prompts — builders get Complete Build Context, read only PLAN.md | Amortized |
| **L3** | Canary checks — 5 self-test questions from memory after each wave | Minimal |
| **L4** | 2-wave session boundaries — proactive session rotation | Zero (policy) |
| **L5** | Baked-in rules — beat params, performance rules, anti-slop checks embedded in agent files | Zero |

**Result:** Builders read 1 file instead of 6+. Sessions stay sharp through wave 5+. Quality drift is detected automatically.

## What Made v6.0 Different

The Full Quality Pipeline — 8 systems on top of the existing 7:

1. **Visual Reference System** — Browser-assisted screenshot capture of reference sites, pattern extraction, and quality bar comparison throughout the pipeline
2. **Hyper-Specific Blueprints** — PLAN.md files with ASCII layout diagrams, exact Tailwind classes per element, exact copy, exact animation sequences, and inline wow moment code
3. **Content Planning** — Dedicated content phase with all copy written and user-approved before any section building
4. **Discussion-First Protocol** — Mandatory user approval before ANY code change. No autonomous modifications. Every change presented with exact diff preview.
5. **Section Coherence System** — Page context snapshots, cross-section visual rules, background progression planning, and coherence checkpoints between waves
6. **Live Visual Feedback** — Post-build screenshots, wave scroll-through GIFs, and before/after comparisons for iterate/bugfix
7. **Wow Factor Enforcement** — Full TSX code embedded in plans (not just references), wow moment minimums (3-5 per page), and boldness verification
8. **Anti-Context-Rot** — Task-level DNA checkpoints, plan mutation protocol, file-based context architecture

Plus the core 7 systems: Design DNA, 16 Archetypes, Creative Tension, Emotional Arc, Cinematic Motion, Anti-Slop Gate, Awwwards Scoring.

## Commands (13)

| Command | Description |
|---------|-------------|
| `/modulo:start-design` | Start a new project: discovery, parallel research, archetype selection, Design DNA generation |
| `/modulo:plan-sections` | Create section plans with wave assignments and GSD execution format |
| `/modulo:execute` | Execute the design wave by wave with parallel section builders + CONTEXT.md session management |
| `/modulo:verify` | Three-level verification + mandatory anti-slop gate + Design DNA compliance check |
| `/modulo:visual-audit` | Live browser visual audit with GIF recording of scroll, hover, and animations |
| `/modulo:iterate` | Iterate on existing design using gap-fix plans or manual feedback |
| `/modulo:change-plan` | Modify plans with automatic wave recalculation |
| `/modulo:bugfix` | Fix visual bugs with scientific hypothesis-test-fix cycle |
| `/modulo:audit` | Comprehensive site audit (performance, SEO, accessibility, quality) |
| `/modulo:responsive-check` | Systematic responsive verification at all breakpoints |
| `/modulo:generate-tests` | Generate comprehensive test suites (Vitest + RTL + Playwright E2E) |
| `/modulo:lighthouse` | Lighthouse performance audit with build analysis and Core Web Vitals |
| `/modulo:update` | Show changelog, what's new, and migration notes for the current version |

## Workflow

```
start-design → plan-sections → execute → verify → visual-audit → iterate (if needed)
                                  ↕ CONTEXT.md        ↘ audit / responsive-check
                            (session resume)           ↘ generate-tests / lighthouse
```

1. **Start Design** — Discovery, parallel research, **visual reference capture**, archetype selection, Design DNA, **content planning**
2. **Plan Sections** — Break into sections with wave assignments, emotional beat assignment, wow moment assignment, creative tension placement, transition techniques, GSD frontmatter, user approval per section
3. **Execute** — Wave-based parallel implementation (max 4 builders per wave), DNA enforcement, beat compliance, choreography compliance, performance compliance, layout diversity tracking
4. **Verify** — Three-level verification (Existence → Substantive → Wired) + 35-point anti-slop gate + DNA compliance + UX pattern check + Awwwards 4-axis scoring + performance audit + live browser testing
5. **Visual Audit** — Live browser GIF recording of scroll, hover, and animations with visual scoring
6. **Iterate** — Targeted fixes from verification gaps or user feedback

## Agents (17)

| Agent | Role | Description |
|-------|------|-------------|
| `discussion-protocol` | Protocol | Mandatory discussion-before-action rules for all code-modifying commands |
| `design-lead` | Orchestrator | Wave-based execution, spawns parallel builders with pre-extracted context, manages STATE.md + CONTEXT.md, canary checks, 2-wave session boundaries |
| `section-builder` | Builder | Executes PLAN.md tasks (reads only PLAN.md — all context pre-extracted in spawn prompt), pauses at checkpoints, embedded beat/performance/anti-slop rules |
| `quality-reviewer` | Verifier | Three-level verification + mandatory anti-slop gate + DNA compliance check |
| `design-researcher` | Researcher | Parallel research agent for one track (trends, references, components, animations) |
| `visual-auditor-live` | Auditor | Live browser visual audit with Chrome MCP — GIF recording of scroll, hover, animations |
| `performance-auditor` | Auditor | Core Web Vitals, bundle size, image/font optimization, caching analysis |
| `seo-optimizer` | Auditor | Meta tags, structured data, sitemaps, robots.txt, Open Graph compliance |
| `accessibility-auditor` | Auditor | WCAG 2.1 AA compliance, keyboard nav, ARIA, color contrast, screen readers |
| `responsive-tester` | Tester | Layout verification at 375/768/1024/1440px breakpoints |
| `figma-translator` | Translator | Figma-to-code with pixel-perfect accuracy using shadcn/ui + Tailwind |
| `component-documenter` | Documenter | Auto-generates Storybook stories, prop tables, usage examples |
| `migration-assistant` | Migration | Pages→App Router, Next.js upgrades, Next.js→Astro conversion |
| `design-system-auditor` | Auditor | Token usage, component consistency, pattern duplication, adoption score |
| `security-auditor` | Auditor | Frontend security audit: XSS, auth/session, data exposure, deps, headers |
| `typescript-auditor` | Auditor | Type safety audit: any usage, assertions, config, patterns, API types |
| `interaction-reviewer` | Reviewer | UI interaction quality: hover states, focus, transitions, micro-interactions |

## Design DNA System

Every project gets a unique `DESIGN-DNA.md` generated from the chosen archetype:

- **Color System** — 12 tokens (bg-primary through accent-2, gradient, glow)
- **Typography** — Display + body + mono fonts with 8-level type scale
- **Spacing** — 5-level scale (xs through 2xl)
- **Shadows** — 5-level depth system (subtle through dramatic)
- **Signature Element** — One unique visual hook that makes the site memorable
- **Motion Language** — Easing library, enter/exit/hover/scroll defaults
- **Texture & Effects** — Grain, glow, glass, noise, gradients
- **Tension Plan** — 2-3 creative tensions from archetype's aggressive zones, assigned to specific sections
- **Emotional Arc Template** — Archetype-specific default beat sequence and transition pattern
- **Choreography Defaults** — Per-beat motion choreography (direction, easing, duration, stagger)
- **Scaffold Specification** — Wave 0 code generation templates (globals.css, tailwind.config, motion presets)

Section builders read DNA before writing any code. The verify command checks every section against it.

## Design Archetypes (16 + Custom)

| Archetype | Personality | Example References |
|-----------|-------------|-------------------|
| Brutalist | Raw, aggressive, intentionally ugly-beautiful | Balenciaga, Bloomberg Businessweek |
| Ethereal | Dreamlike, soft, floating, translucent | Apple Vision Pro, Cosmos |
| Kinetic | Motion-first, dynamic, energetic | Stripe, Lottie |
| Editorial | Magazine-inspired, typography-driven | NYT, Bloomberg |
| Neo-Corporate | Linear/Vercel aesthetic, precision engineering | Linear, Vercel, Raycast |
| Organic | Natural, flowing, hand-crafted feeling | Patagonia, Aesop |
| Retro-Future | Nostalgic + futuristic, CRT + holographic | Teenage Engineering |
| Luxury/Fashion | High-end, editorial, dramatic photography | Gucci, Bottega Veneta |
| Playful/Startup | Bouncy, colorful, approachable | Notion, Figma |
| Data-Dense | Information-rich, dashboard-optimized | Bloomberg Terminal, Grafana |
| Japanese Minimal | Ma (negative space), wabi-sabi, restrained | Muji, Aesop Japan |
| Glassmorphism | Frosted glass, translucent layers, depth | Apple, Windows 11 |
| Neon Noir | Dark + neon, cyberpunk, high contrast | Huly, Cyberpunk 2077 |
| Warm Artisan | Handcrafted, warm tones, natural textures | Mailchimp, Notion |
| Swiss/International | Grid-perfect, Helvetica heritage, systematic | Swisscom, Dieter Rams |
| Vaporwave | Retrowave, pink/purple/cyan, glitch aesthetic | Poolsuite, A E S T H E T I C |

Each archetype includes locked palette, required fonts, mandatory techniques, forbidden patterns, and 3 aggressive tension zones for creative risk-taking. Custom archetypes can be built using the archetype builder template.

## Anti-Slop Gate

35-point mandatory quality checklist across 7 categories scored during `/modulo:verify`:

| Category | Items |
|----------|-------|
| Colors (/5) | Primary not default, unexpected accent, purposeful gradients, background depth, hand-tuned dark mode |
| Typography (/5) | Distinctive display font, 3+ weights, tuned letter-spacing, varied line-heights, typographic surprise |
| Layout (/5) | Grid broken, spacing varied, 3+ hierarchy levels, intentional negative space, unexpected positioning |
| Depth & Polish (/5) | Layered shadows, subtle borders, glass/blur, varied border-radius, micro-details |
| Motion (/5) | Staggered timing, distinct hovers, scroll-triggered, appropriate easing, directional motion |
| Creative Courage (/5) | Impossible moment, stop-scrolling moment, bold implementation, originality, screenshot-worthy |
| UX Intelligence (/5) | Nav current indicator, interactive feedback <100ms, CTA hierarchy, outcome-driven micro-copy, logical content flow |

**Score 25+ = PASS. Score 30+ = SOTD-Ready. Score < 25 = AUTOMATIC FAIL.** Additional penalties: missing signature element (-3), archetype forbidden pattern (-5), no creative tension (-5), "Submit"/"Learn More" copy (-2), Inter/Roboto as display font (-5).

## Wave System

Sections are assigned to waves based on dependencies:

| Wave | Purpose | Example |
|------|---------|---------|
| 0 | Scaffold & tokens | Tailwind config, CSS variables, shared utilities (generated from Design DNA via design-system-scaffold) |
| 1 | Shared UI | Navigation, footer, theme provider |
| 2+ | Independent sections | Hero, features, pricing (parallel, max 4 per wave) |
| Higher | Dependent sections | Sections that depend on other sections |

## Skills (87)

### Core Framework
| Skill | Description |
|-------|-------------|
| `v0-ahh` | Core frontend design and UI implementation guidance |
| `shadcn-components` | All shadcn/ui components, variants, composition patterns, multi-select, stepper, timeline, tree view, color picker |
| `tailwind-patterns` | Advanced Tailwind CSS patterns, animations, gradients, glass effects |
| `nextjs-app-router` | App Router conventions, layouts, server/client components, metadata |
| `component-library-setup` | Design system bootstrap, Tailwind config, design tokens, Storybook, theming |
| `astro-patterns` | Islands architecture, View Transitions, Content Collections, hybrid rendering, Actions, middleware |
| `design-tokens-sync` | Style Dictionary pipeline, Figma token sync, multi-theme token sets |

### Design Identity
| Skill | Description |
|-------|-------------|
| `design-dna` | Design DNA format spec — unique per-project visual identity with locked tokens, signature element, motion language, tension plan, emotional arc, choreography defaults |
| `design-archetypes` | 16 opinionated personality archetypes + custom archetype builder, each with locked palette, fonts, mandatory techniques, forbidden patterns, and 3 aggressive tension zones |

### Creative Engine (NEW in v5.0)
| Skill | Description |
|-------|-------------|
| `creative-tension` | 5 tension levels with per-archetype aggressive tensions (3 per archetype), controlled rule-breaking patterns |
| `emotional-arc` | 10 beat types with measurable parameters, archetype-specific arc templates, 6 transition techniques, valid/invalid sequence rules |
| `cinematic-motion` | 10-direction motion vocabulary, frame-by-frame choreography, multi-layer hover patterns, 9 scroll patterns with full code |
| `wow-moments` | 30+ signature interaction patterns: cursor-responsive, scroll-responsive, interactive, ambient — with archetype/beat compatibility |
| `awwwards-scoring` | 4-axis rubric (Design, Usability, Creativity, Content /10), SOTD prediction, competitive benchmark process |
| `light-mode-patterns` | Full-depth light-mode patterns: editorial heroes, magazine grids, product showcase, e-commerce, agency/portfolio |
| `design-system-scaffold` | Wave 0 code generation templates: globals.css, tailwind.config.ts, lib/motion.ts, section-wrapper.tsx from Design DNA |

### UX & Content Intelligence (NEW in v5.0)
| Skill | Description |
|-------|-------------|
| `ux-patterns` | Navigation intelligence, form intelligence, feedback timing, content discovery patterns |
| `micro-copy` | Headline templates per beat, button copy rules (banned words), empty/error state copy, CTA + social proof integration |
| `conversion-patterns` | Social proof placement, CTA hierarchy, friction reduction, cognitive load management, pricing table best practices |
| `performance-guardian` | Performance budgets (LCP, FID, CLS, TBT), font/image/animation rules, code splitting, bundle monitoring |

### UI Patterns
| Skill | Description |
|-------|-------------|
| `form-builder` | react-hook-form + zod + shadcn forms with all field types |
| `responsive-layout` | Layout systems, grid patterns, bento grids, container queries |
| `data-table` | TanStack Table + shadcn with sorting, filtering, pagination |
| `auth-ui` | Login, signup, OTP, forgot password, social auth flows |
| `dashboard-patterns` | Dashboard shells, stat cards, settings pages, onboarding wizard, activity feeds, role-based UI |
| `landing-page` | Hero sections, pricing tables, testimonials, CTAs, SaaS comparison, changelog |
| `email-notification-ui` | Toast notifications (Sonner), alert banners, notification dropdowns, confirmation dialogs |
| `navigation-patterns` | Mega menus, sticky headers with scroll behavior, search autocomplete, multi-level sidebar |
| `modal-dialog-patterns` | Multi-step modals, slide-over panels, confirmation dialogs, responsive dialog/drawer |
| `error-states-ui` | 404/500 pages, error boundaries, empty states, offline indicators, retry patterns |
| `skeleton-loading` | Skeleton primitives, Suspense boundaries, streaming SSR, shimmer animations |
| `search-ui` | Search results, faceted filtering, autocomplete, highlighting, recent searches |
| `rich-text-editor` | TipTap editor with toolbar, slash commands, bubble menu, Astro integration |
| `virtual-scroll` | TanStack Virtual lists/grids, infinite scroll, cursor pagination, Intersection Observer |
| `context-menu` | Right-click context menus, command palette (Cmd+K), keyboard shortcuts hook |
| `notification-center` | Notification bell, feed with tabs, preferences panel, push notification setup |
| `rating-review` | Star ratings, aggregate displays, review cards, review forms |

### E-commerce & Payments
| Skill | Description |
|-------|-------------|
| `ecommerce-ui` | Product cards, gallery, cart drawer, quantity selector, size picker |
| `payment-ui` | Stripe Elements, order summary, saved payment methods, subscription management |

### Content & CMS
| Skill | Description |
|-------|-------------|
| `cms-integration` | Sanity, Contentful, Astro Content Collections, draft mode, webhook revalidation |
| `markdown-mdx` | react-markdown, Shiki syntax highlighting, TOC generator, MDX with next-mdx-remote |
| `blog-patterns` | Post listings, blog post layout, reading progress, related posts, RSS feed, tag filter |

### Backend & API
| Skill | Description |
|-------|-------------|
| `webhook-api-patterns` | REST CRUD routes, webhook signature verification, middleware, rate limiting, Server Actions |
| `database-crud-ui` | CRUD tables, Server Actions with Zod, inline edit, bulk actions, Prisma patterns |
| `admin-panel` | Admin layout, user management, audit log, role permissions, permission guard |

### Maps & Location
| Skill | Description |
|-------|-------------|
| `map-location` | Mapbox GL, store locator, address autocomplete, static map images |

### Social Features
| Skill | Description |
|-------|-------------|
| `social-features` | Threaded comments, reactions, share buttons, social proof widgets |

### Data & State
| Skill | Description |
|-------|-------------|
| `data-fetching` | TanStack Query, Server Actions, RSC async data, Astro content collections, optimistic updates |
| `state-management` | Zustand stores, React Context, URL state (nuqs), Astro islands state sharing |
| `chart-data-viz` | Recharts with shadcn styling, area/bar/donut charts, sparklines, accessible charts |

### Interactive
| Skill | Description |
|-------|-------------|
| `drag-and-drop` | dnd-kit: sortable lists, kanban boards, grid reorder, accessible drag-and-drop |
| `file-upload-media` | Drag-drop zones, image crop, multi-file upload, video player, gallery/lightbox |
| `real-time-ui` | WebSocket connections, presence indicators, streaming AI responses, notification badges |
| `ai-chat-interface` | Streaming chat, message bubbles, code highlighting, model selector, typing indicators |
| `collaboration-realtime` | Yjs + TipTap collaborative editing, presence avatars, live cursors, conflict resolution |
| `advanced-kanban` | Swimlane kanban, inline card editor, filter bar, dnd-kit with WIP limits |
| `code-editor-terminal` | Monaco editor, diff viewer, JSON tree viewer, log viewer, multi-tab editor |

### Animation
| Skill | Description |
|-------|-------------|
| `framer-motion` | Variants, stagger, scroll animations, layout animations, gestures |
| `gsap-animations` | GSAP + ScrollTrigger, timelines, text animations, horizontal scroll |
| `css-animations` | Pure CSS keyframes, scroll-driven animations, micro-interactions |

### 3D & WebGL
| Skill | Description |
|-------|-------------|
| `three-js-webgl` | React Three Fiber scenes, particles, product viewer, scroll-driven 3D, custom shaders |

### Design Philosophy
| Skill | Description |
|-------|-------------|
| `anti-slop-design` | 35-point / 7-category anti-slop gate with Creative Courage and UX Intelligence categories, SOTD-ready threshold at 30+, automatic penalties |
| `premium-dark-ui` | Surface hierarchy, glass morphism, glow effects, depth systems |
| `premium-typography` | Font pairings, type scale systems, gradient text, fluid type, spacing rules |
| `creative-sections` | Bento grids, 3D heroes, scroll-driven storytelling, cursor effects, section recipes, light-mode variants, per-archetype recommendations, beat-type compatibility tags |
| `glow-neon-effects` | Neon glow effects, luminous borders, spotlight effects, design system integration, performance notes |
| `geometry-shapes` | SVG/CSS shapes, clip-path, blobs, section dividers, performance guide |

### Portfolio & Showcase
| Skill | Description |
|-------|-------------|
| `portfolio-patterns` | Project showcase grid, case study layout, skills visualization, experience timeline |
| `timeline-gantt` | Timeline views, Gantt charts with groups, milestone tracker |

### Accessibility & i18n
| Skill | Description |
|-------|-------------|
| `accessibility-patterns` | Focus management, keyboard navigation, screen reader, ARIA, skip links |
| `i18n-rtl` | next-intl, Astro i18n, RTL logical properties, language switcher |

### SEO & Performance
| Skill | Description |
|-------|-------------|
| `seo-meta` | Sitemaps, robots.txt, JSON-LD, Open Graph, IndexNow, GEO |
| `performance-patterns` | Core Web Vitals, image optimization, font loading, code splitting |
| `image-asset-pipeline` | OG image generation, favicon sets, SVG optimization, blur placeholders |

### Testing
| Skill | Description |
|-------|-------------|
| `testing-patterns` | Vitest, React Testing Library, a11y testing, MSW mocking, Playwright E2E |

### Mobile
| Skill | Description |
|-------|-------------|
| `mobile-patterns` | Bottom sheets, touch targets, safe areas, swipeable cards |
| `mobile-navigation` | Tab bars, drawer menus, segmented controls, action sheets |

### PWA & Offline
| Skill | Description |
|-------|-------------|
| `pwa-patterns` | Service workers, install prompts, offline caching, push notifications |

### Multi-tenant & SaaS
| Skill | Description |
|-------|-------------|
| `multi-tenant-ui` | Organization switcher, tenant context, team management, feature gating |

### Onboarding
| Skill | Description |
|-------|-------------|
| `onboarding-tours` | Product tours, hotspot indicators, onboarding checklists |

### Analytics
| Skill | Description |
|-------|-------------|
| `analytics-tracking` | GA4, PostHog, Plausible, GDPR consent banners, conversion tracking |

### Print & PDF
| Skill | Description |
|-------|-------------|
| `print-pdf` | Print stylesheets, react-pdf invoice templates, PDF generation |

### Quality & Workflow
| Skill | Description |
|-------|-------------|
| `visual-auditor` | Catches spacing, alignment, color, responsive, and accessibility bugs |
| `design-brainstorm` | Mood boards, creative directions, color palettes, typography pairings |
| `quality-standards` | 90k quality bar, quality tiers, three-level verification, gap closure, 4 interlocking quality systems |
| `design-workflow` | Command flow, wave system, STATE.md format, agent coordination, Design DNA, archetypes |
| `plan-format` | PLAN.md format reference: frontmatter, task types, SUMMARY.md format |

## Planning Artifacts

| Artifact | Purpose |
|----------|---------|
| `CONTEXT.md` | **NEW v6.1** — Single source of truth for context recovery. DNA anchor, build state, arc position, next instructions. Rewritten after every wave. Replaces `.continue-here.md` and `.session-transfer.md`. |
| `CONTENT.md` | All approved page copy — no builder-generated text |
| `REFERENCES.md` | Reference site analysis with pattern extraction |
| `research/screenshots/` | Reference site screenshots for quality comparison |
| `PAGE-CONSISTENCY.md` | Cross-page coherence rules (multi-page projects) |
| `sections/XX/screenshots/` | Built section screenshots for visual feedback |
| `progress/` | Wave scroll-through GIFs |

## Framework Support

All skills include patterns for both frameworks:

| Framework | Features |
|-----------|----------|
| **Next.js** | App Router, Server Components, Server Actions, Metadata API, next/image, next/font, next-intl |
| **Astro** | Islands architecture, Content Collections, View Transitions, hybrid rendering, Actions, middleware |

## License

MIT
