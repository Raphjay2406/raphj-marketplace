# modulo

Premium frontend design system for Claude Code. 74 skills, 11 slash commands, and 15 agents for creating 90k-quality websites with wave-based parallel execution and goal-backward verification. Works with **Next.js** and **Astro**.

## Installation

Via marketplace:
```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
claude plugin install modulo@raphj-marketplace
```

## Commands

| Command | Description |
|---------|-------------|
| `/modulo:start-design` | Start a new project: discovery, parallel research, brainstorming |
| `/modulo:plan-sections` | Create section plans with wave assignments and GSD execution format |
| `/modulo:execute` | Execute the design wave by wave with parallel section builders |
| `/modulo:verify` | Three-level goal-backward verification + 10-category visual audit |
| `/modulo:iterate` | Iterate on existing design using gap-fix plans or manual feedback |
| `/modulo:change-plan` | Modify plans with automatic wave recalculation |
| `/modulo:bugfix` | Fix visual bugs with scientific hypothesis-test-fix cycle |
| `/modulo:audit` | Comprehensive site audit (performance, SEO, accessibility, quality) |
| `/modulo:responsive-check` | Systematic responsive verification at all breakpoints |
| `/modulo:generate-tests` | Generate comprehensive test suites (Vitest + RTL + Playwright E2E) |
| `/modulo:lighthouse` | Lighthouse performance audit with build analysis and Core Web Vitals |

## Workflow

```
start-design → plan-sections → execute → verify → iterate (if needed)
                                                 ↘ audit / responsive-check
                                                 ↘ generate-tests / lighthouse
```

1. **Start Design** — Discovery questioning, parallel research (4 tracks), brainstorm 2-3 directions
2. **Plan Sections** — Break into sections with wave assignments, GSD frontmatter, user approval per section
3. **Execute** — Wave-based parallel implementation (max 4 builders per wave), checkpoint support
4. **Verify** — Three-level verification (Existence → Substantive → Wired) + visual audit
5. **Iterate** — Targeted fixes from verification gaps or user feedback
6. **Audit** — Spawn 4 parallel agents for performance, SEO, accessibility, and quality review
7. **Responsive Check** — Verify layout/typography/touch targets at 375/768/1024/1440px
8. **Generate Tests** — Discover components, generate unit + E2E tests, verify passing
9. **Lighthouse** — Static + build + runtime analysis, Core Web Vitals report

## Agents (15)

| Agent | Role | Description |
|-------|------|-------------|
| `design-lead` | Orchestrator | Wave-based execution, spawns parallel builders, manages STATE.md |
| `section-builder` | Builder | Executes PLAN.md tasks sequentially, pauses at checkpoints, writes SUMMARY.md |
| `quality-reviewer` | Verifier | Three-level goal-backward verification, creates GAP-FIX.md plans |
| `design-researcher` | Researcher | Parallel research agent for one track (trends, references, components, animations) |
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

## Wave System

Sections are assigned to waves based on dependencies:

| Wave | Purpose | Example |
|------|---------|---------|
| 0 | Scaffold & tokens | Tailwind config, CSS variables, shared utilities |
| 1 | Shared UI | Navigation, footer, theme provider |
| 2+ | Independent sections | Hero, features, pricing (parallel, max 4 per wave) |
| Higher | Dependent sections | Sections that depend on other sections |

## Skills (74)

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
| `anti-slop-design` | Eliminate generic AI aesthetics, concrete anti-slop checklist with scoring |
| `premium-dark-ui` | Surface hierarchy, glass morphism, glow effects, depth systems |
| `premium-typography` | Font pairings, type scale systems, gradient text, fluid type, spacing rules |
| `creative-sections` | Bento grids, 3D heroes, scroll-driven storytelling, cursor effects, section recipes |
| `glow-neon-effects` | Neon glow, luminous borders, spotlight effects, design system integration |
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
| `quality-standards` | 90k quality bar, quality tiers, three-level verification, gap closure |
| `design-workflow` | Command flow, wave system, STATE.md format, agent coordination |
| `plan-format` | PLAN.md format reference: frontmatter, task types, SUMMARY.md format |

## Framework Support

All skills include patterns for both frameworks:

| Framework | Features |
|-----------|----------|
| **Next.js** | App Router, Server Components, Server Actions, Metadata API, next/image, next/font, next-intl |
| **Astro** | Islands architecture, Content Collections, View Transitions, hybrid rendering, Actions, middleware |

## License

MIT
