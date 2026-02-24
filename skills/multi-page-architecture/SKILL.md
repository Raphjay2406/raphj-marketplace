---
name: "multi-page-architecture"
description: "Site-level DNA extensions, page-type templates with per-page emotional arcs, shared components, cross-page design cohesion"
tier: "domain"
triggers: "multi-page, site architecture, page templates, shared components, site navigation, cross-page, page types, landing page, about page, pricing page, blog, docs, contact"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Core Philosophy

A multi-page site is NOT N independent pages sharing a navbar. It is a single design system with page-type-specific content structures. Each page has its own emotional arc appropriate to its purpose, but every page shares the same DNA, the same component library, and the same motion language.

The distinction matters: a single-page landing site can be a linear story (HOOK -> BUILD -> PEAK -> CLOSE). A multi-page site is a constellation of stories -- each page with its own narrative structure, linked by consistent navigation, shared identity, and cross-page wayfinding. The challenge is maintaining visual cohesion without flattening every page into the same arc.

### When to Use

- Any project with 2+ distinct pages -- this skill defines the architecture
- During `/modulo:start-project` when multi-page is detected -- generates Site Architecture section in DESIGN-DNA.md
- During `/modulo:plan-dev` -- section planner assigns page-specific arcs per template
- During `/modulo:execute` -- build-orchestrator ensures shared components build in Wave 1 before page-specific sections
- During `/modulo:verify` -- quality reviewer checks cross-page consistency

### When NOT to Use

- Single-page projects (standard Modulo workflow, no multi-page skill needed)
- Single-page apps where "pages" are client-side views within one page -- use framework-specific routing patterns instead
- For emotional arc beat definitions -- use `emotional-arc` skill (this skill references beats but does not redefine them)

### Decision Tree: Site Type

Determine the page-type mix based on project type:

| Project Type | Pages Needed | Template Mix |
|---|---|---|
| Marketing site | 3-6 pages | Landing + About + Pricing + Contact |
| Blog / content site | Variable | Landing + Blog Index + Article + About |
| Documentation site | Variable | Landing + Docs + API Reference |
| SaaS product site | 5-10 pages | Landing + Features + Pricing + Blog + Docs + About + Contact |
| Portfolio / agency | 3-8 pages | Landing + Work Index + Case Study + About + Contact |
| E-commerce storefront | 5-12 pages | Landing + Category + Product + Cart + About + Contact |
| Mixed (marketing + blog + docs) | 8-15 pages | Full template set, consistent chrome across all |

### Decision Tree: Architecture Scope

- If 2-3 pages -> Minimal site DNA: shared nav + footer, per-page arcs, no sidebar
- If 4-6 pages -> Standard site DNA: shared nav + footer + breadcrumbs, page transitions, per-page arcs
- If 7+ pages -> Full site DNA: shared nav + footer + sidebar (docs) + breadcrumbs + search + page transitions + taxonomy pages
- If mixed content types (marketing + blog + docs) -> Maximum site DNA: all shared components, navigation hierarchy, content-type-specific chrome

### Pipeline Connection

- **Referenced by:** `section-planner` during `/modulo:plan-dev` (creates per-page arcs in MASTER-PLAN.md)
- **Consumed at:** `build-orchestrator` Wave 1 (shared components), Wave 2+ (page-specific sections)
- **Verified by:** `quality-reviewer` during `/modulo:verify` (cross-page consistency check)

---

## Layer 2: Award-Winning Examples

### Pattern 1: Site-Level DNA Extensions

Multi-page projects extend the standard DESIGN-DNA.md with a Site Architecture section. This is generated during `/modulo:start-project` when the discovery phase identifies multi-page scope.

```markdown
## Site Architecture (appended to DESIGN-DNA.md)

### Navigation
- Style: [fixed-top | sticky-top | sidebar | minimal-header]
- Behavior: [transparent-to-solid | always-solid | hidden-on-scroll | slide-up-on-scroll-up]
- Mobile: [hamburger-drawer | bottom-sheet | full-screen-overlay | collapsing-header]
- Active indicator: [underline | background-fill | bold-weight | left-border | bottom-border]
- Logo placement: [left | center]
- Max items: [5-7 primary, rest in dropdown/mega-menu]

### Footer
- Style: [mega-footer | minimal-bar | sitemap-grid | stacked-sections]
- Columns: [2 | 3 | 4 | 5] (mega-footer only)
- Content: [nav-links, social-icons, newsletter-form, contact-info, legal-links]
- Required links: privacy, terms [, sitemap if 7+ pages]

### Page Transitions
- Style: [crossfade | slide-directional | morph-shared-elements | instant]
- Duration: [from DNA --motion-duration-default]
- Direction: [hierarchy-aware: up = parent, down = child, lateral = sibling]
- Easing: [from DNA --motion-easing-default]

### Shared Components
- Search: [present | absent] (present if 7+ pages or blog/docs)
- Theme toggle: [present | absent] (present if dark/light mode enabled)
- Breadcrumb: [present | absent] (present if 3+ levels deep)
- Back-to-top: [present | absent] (present if any page exceeds 4 viewports)
- Skip link: always present (accessibility requirement)

### Page Registry
| Page | Type | URL Pattern | Priority |
|------|------|-------------|----------|
| Home | landing | / | P0 |
| About | about | /about | P1 |
| Pricing | pricing | /pricing | P1 |
| Blog | blog-index | /blog | P2 |
| Blog Post | article | /blog/[slug] | P2 |
| Contact | contact | /contact | P1 |
```

### Pattern 2: Page-Type Templates with Emotional Arcs

Each page type has a characteristic emotional arc. The arc defines the beat sequence -- the emotional pacing that matches the page's purpose. Beat types and parameter constraints come from the `emotional-arc` skill. These templates define WHICH beats to use and in WHAT order.

#### Landing Page (Primary Conversion)

**Purpose:** Convert visitors. Maximum emotional range -- grab attention, build desire, prove value, close the deal.

**Arc:** HOOK -> TEASE -> REVEAL -> BUILD -> PEAK -> BREATHE -> PROOF -> TENSION -> CLOSE

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| HOOK | Full-viewport hero | Value proposition headline, brief subtext, primary CTA |
| TEASE | Credibility strip | Logo bar, key metric, or provocative statement |
| REVEAL | Product showcase | Screenshots, demo, interactive preview |
| BUILD | Feature stack | Feature cards, bento grid, capability breakdown |
| PEAK | Wow moment | Creative tension technique, signature animation, demo |
| BREATHE | Rest and reset | Pull quote, single metric, generous whitespace |
| PROOF | Social validation | Testimonials, case studies, trust signals |
| TENSION | Urgency driver | Limited offer, comparison (with vs without), pain point |
| CLOSE | Final conversion | CTA with clear next step, reassurance (guarantee, trial) |

**Archetype influence:** Arc structure stays the same. Visual execution varies. Brutalist landing uses stark type and raw imagery. Ethereal landing uses atmospheric backgrounds and gentle reveals. The beats are the story; the archetype is the visual language.

#### About Page (Trust Building)

**Purpose:** Humanize the brand. Build trust through story, team, and values. Lower emotional intensity than landing.

**Arc:** HOOK -> BUILD -> PROOF -> BREATHE -> BUILD -> CLOSE

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| HOOK | Brand statement hero | Mission headline, atmospheric image (smaller than landing HOOK: 60-80vh) |
| BUILD | Company story | Origin story, mission, values, approach |
| PROOF | Team and achievements | Team grid, timeline, milestones, awards |
| BREATHE | Brand moment | Full-width image, quote from founder, or brand video |
| BUILD | Differentiators | What makes the team/approach unique, culture, methodology |
| CLOSE | Connection CTA | Join us / work with us / contact, lower urgency than landing |

**Note:** About page HOOK uses reduced height (60-80vh) and lower animation intensity compared to landing HOOK. The about page does not compete with the landing page for attention -- it rewards those who want to know more.

#### Pricing Page (Decision Support)

**Purpose:** Help users choose the right plan. Minimize cognitive load. Create urgency without pressure.

**Arc:** HOOK -> BUILD -> TENSION -> BREATHE -> PROOF -> CLOSE

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| HOOK | Value headline | Clear statement of what they get, toggle (monthly/annual) |
| BUILD | Pricing tiers | Feature comparison table/cards, highlighted recommended plan |
| TENSION | Urgency nudge | "Most popular" badge, limited-time offer, usage calculator |
| BREATHE | Breathing room | Single reassurance (money-back guarantee, free trial mention) |
| PROOF | Buyer validation | Testimonials from paying customers, enterprise logos |
| CLOSE | Start now | Primary CTA per tier, contact sales for enterprise |

**Pricing-specific rules:**
- Feature comparison must be scannable -- table or aligned cards, not paragraphs
- "Most popular" / "Recommended" tier must have visual weight (background, border, scale)
- Pricing toggle (monthly/annual) must be accessible: aria-pressed, keyboard operable
- No more than 4 pricing tiers visible at once (more = decision paralysis)

#### Blog Index Page (Content Discovery)

**Purpose:** Help users find interesting content. Showcase editorial quality. Drive clicks to articles.

**Arc:** HOOK -> BUILD -> BUILD -> CLOSE

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| HOOK | Featured article hero | Latest or pinned post with hero image, title, excerpt |
| BUILD | Recent posts grid | Card grid with thumbnail, title, date, category tag |
| BUILD | Category/archive browse | Category filters, search, pagination or infinite scroll |
| CLOSE | Newsletter signup | Subscribe CTA, frequency promise |

**Blog-specific rules:**
- Post cards must show: title, date, category, reading time, thumbnail
- Category filtering must be accessible: aria-label on filter buttons, live region for result count
- Pagination or load-more must preserve scroll position and announce new content

#### Article Page (Content Consumption)

**Purpose:** Deliver the content clearly. Support deep reading. Drive engagement with related content.

**Arc:** HOOK -> BUILD -> BREATHE -> BUILD -> CLOSE

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| HOOK | Article header | Title, author, date, reading time, hero image |
| BUILD | Article body (first half) | Content sections with headings, images, code blocks |
| BREATHE | Visual break | Pull quote, full-width image, or callout box |
| BUILD | Article body (second half) | Continued content |
| CLOSE | Engagement driver | Related articles, newsletter signup, comments |

**Article-specific rules:**
- Typography must optimize for reading: body text at body-large scale (clamp-fluid), max-width 65-75ch
- Heading hierarchy must be sequential (no skipping from h2 to h4)
- Code blocks must have syntax highlighting and copy button
- Images must have alt text and lazy loading

#### Documentation Page (Reference and Learning)

**Purpose:** Deliver reference information clearly. Functional, not emotional. Navigation is the structure.

**Arc:** BUILD -> BREATHE -> BUILD

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| BUILD | Content sections | Explanation, code examples, parameters, API details |
| BREATHE | Visual separator | Divider between major sections, or tip/note callout |
| BUILD | Continued content | More reference material |

**Docs-specific rules:**
- Minimal emotional arc -- docs are calm and functional, no PEAK or TENSION
- Sidebar navigation is the primary structure (persistent, collapsible, tracks scroll position)
- Heading hierarchy creates the table of contents (auto-generated from h2/h3)
- Code examples are the primary content -- copy button, language badge, line highlighting
- Search is critical -- must be prominent, keyboard-accessible (Cmd/Ctrl+K)
- Version switcher if multiple API versions exist

#### Contact Page (Conversion)

**Purpose:** Make it easy to get in touch. Remove friction. Build confidence.

**Arc:** HOOK -> BUILD -> PROOF -> CLOSE

| Beat | Section Purpose | Key Content |
|------|----------------|-------------|
| HOOK | Intent headline | "Let's talk" / "Get in touch" with clear purpose |
| BUILD | Contact methods | Form + alternative methods (email, phone, social, map) |
| PROOF | Trust signals | Response time guarantee, office address, team photo |
| CLOSE | Form submission | Submit button with confirmation, what happens next |

**Contact-specific rules:**
- Form fields: name, email, message minimum. Keep it short
- All form fields must have visible labels (not placeholder-only)
- Form validation must use aria-describedby for error messages
- Submit button must show loading state and success/error feedback
- Alternative contact methods for users who prefer not to use forms

### Pattern 3: Shared Component Design

Shared components are built once in Wave 1 and imported everywhere. They enforce site-level consistency.

#### Navigation Component

```tsx
// Shared navigation -- built in Wave 1, used on every page
// Accessibility: skip link, aria-current, keyboard navigation, mobile menu
function SiteNav({ currentPath, pages }: { currentPath: string; pages: PageLink[] }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      {/* Skip link -- always first focusable element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60]
                   focus:px-4 focus:py-2 focus:bg-primary focus:text-bg focus:rounded-md"
      >
        Skip to main content
      </a>

      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* Logo -- always links to home */}
        <a href="/" className="flex-shrink-0">
          <Logo className="h-8 w-auto" />
        </a>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {pages.map((page) => (
            <li key={page.href}>
              <a
                href={page.href}
                aria-current={currentPath === page.href ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  currentPath === page.href
                    ? "text-primary"            // Active: primary color
                    : "text-muted hover:text-text" // Inactive: muted -> text on hover
                )}
              >
                {page.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Theme toggle + mobile hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <MobileMenuButton className="md:hidden" />
        </div>
      </nav>
    </header>
  );
}
```

Key accessibility requirements for navigation:
- Skip link as FIRST focusable element on every page
- `aria-current="page"` on active page link (not just visual styling)
- `aria-label="Main navigation"` on `<nav>` element
- Keyboard operable: Tab through links, Enter to activate
- Mobile menu: `aria-expanded` on trigger, focus trap when open, Escape to close

#### Footer Component

```tsx
// Shared footer -- consistent across all pages
// Mega-footer for marketing sites, minimal for docs
function SiteFooter({ variant }: { variant: "mega" | "minimal" }) {
  return (
    <footer className="bg-surface border-t border-border" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {variant === "mega" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1">
              <Logo className="h-8 w-auto mb-4" />
              <p className="text-sm text-muted max-w-xs">Brief brand description.</p>
            </div>
            {/* Columns 2-4: Link groups */}
            <FooterLinkGroup title="Product" links={productLinks} />
            <FooterLinkGroup title="Company" links={companyLinks} />
            <FooterLinkGroup title="Resources" links={resourceLinks} />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo className="h-6 w-auto" />
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-6" role="list">
                {minimalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted hover:text-text transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Legal bar -- always present */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} Company. All rights reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex items-center gap-4" role="list">
              <li><a href="/privacy" className="text-xs text-muted hover:text-text">Privacy</a></li>
              <li><a href="/terms" className="text-xs text-muted hover:text-text">Terms</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
```

Footer design rules:
- Mega-footer for marketing/product sites (4-5 columns on desktop, 2 columns on mobile)
- Minimal footer for docs sites (single row: logo + links + legal)
- Legal links (privacy, terms) always present
- `role="contentinfo"` on `<footer>` element
- Footer `<nav>` elements must have distinct `aria-label` (different from main navigation)

#### Breadcrumb Component

```tsx
// Breadcrumb navigation -- present when pages are 3+ levels deep
// Uses structured data for SEO + aria-label for accessibility
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center gap-2 text-sm text-muted" role="list">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-border">/</span>}
            {item.href && index < items.length - 1 ? (
              <a href={item.href} className="hover:text-text transition-colors">
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-text font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Pattern 4: Cross-Page Consistency Rules

These rules prevent multi-page sites from feeling disjointed. Quality reviewers check these during `/modulo:verify`.

**Mandatory consistency (same on every page):**

| Element | Rule | Enforcement |
|---------|------|-------------|
| DNA tokens | Same 12-color palette, type scale, spacing scale | HARD -- no page-specific overrides |
| Navigation | Same component, same position, same behavior | HARD -- imported from shared component |
| Footer | Same component (variant may differ: mega vs minimal) | HARD -- imported from shared component |
| Motion language | Same easing, timing, entrance patterns | HARD -- from DNA motion tokens |
| Button/form styles | Identical interactive components everywhere | HARD -- from shared component library |
| Typography system | Same font stack, same type scale | HARD -- from DNA typography tokens |

**Permitted variation (changes per page type):**

| Element | Variation Allowed | Constraint |
|---------|------------------|------------|
| Content density | Docs denser than landing | Must use same spacing scale, just more content |
| Emotional intensity | Landing has PEAK; docs have only BUILD | Page-type arc determines intensity |
| Header treatment | Landing may have transparent nav; docs always solid | Behavior differs, component is the same |
| Sidebar | Present on docs/blog, absent on landing/pricing | Conditional rendering, not different designs |
| Background pattern | Page-specific hero backgrounds | Must use DNA color tokens, not custom colors |
| Section count | Landing 7-10 sections; contact 3-4 sections | Each page has its own arc length |

### Pattern 5: Page Transition Design

Page transitions reinforce site cohesion. The transition style is part of the site's personality.

```tsx
// Page transition wrapper -- consistent across all page navigations
// Style chosen based on DNA page transition preference
import { AnimatePresence, motion } from "motion/react";

function PageTransition({ children, path }: { children: React.ReactNode; path: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={path}
        id="main-content"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.3,        // From DNA: --motion-duration-default
          ease: [0.25, 0.1, 0.25, 1], // From DNA: --motion-easing-default
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
```

Transition style per archetype:

| Archetype | Transition | Duration | Notes |
|-----------|-----------|----------|-------|
| Brutalist | Instant / hard cut | 0ms | No animation -- deliberate rawness |
| Ethereal | Slow crossfade with blur | 600ms | Dreamy, atmospheric |
| Kinetic | Directional slide | 250ms | Fast, energetic, hierarchy-aware direction |
| Editorial | Subtle fade-up | 350ms | Refined, unobtrusive |
| Swiss | Clean fade | 200ms | Precise, minimal |
| Luxury | Morph shared elements | 500ms | Seamless, premium feel |
| Neo-Corporate | Smooth crossfade | 300ms | Professional, polished |
| Japanese Minimal | Opacity only | 400ms | No movement, just presence |
| Neon Noir | Glow pulse on exit, fade in | 400ms | Signature glow integrated into transition |

**Hierarchy-aware direction:** When navigating DOWN the hierarchy (home -> category -> detail), slide LEFT or UP. When navigating UP (detail -> category -> home), slide RIGHT or DOWN. Lateral siblings slide in the navigation direction. This gives users spatial orientation.

### Pattern 6: Multi-Page MASTER-PLAN.md Structure

The master plan for multi-page sites organizes waves differently than single-page projects.

```markdown
## MASTER-PLAN.md (Multi-Page Site)

### Wave 0: Design System Scaffold
- globals.css with DNA @theme tokens
- Tailwind configuration
- Shared type styles, spacing utilities

### Wave 1: Shared Components
- Navigation component (desktop + mobile)
- Footer component (mega + minimal variants)
- Breadcrumb component
- Theme toggle component
- Page transition wrapper
- Layout wrapper (nav + main + footer composition)
- Common UI: buttons, cards, forms, inputs

### Wave 2: Primary Pages (independent, can parallelize)
- Landing page (highest priority)
- About page
- Pricing page
- Contact page

### Wave 3: Content Pages (may depend on Wave 2 for shared patterns)
- Blog index page
- Article page template
- Category/tag pages

### Wave 4: Specialized Pages (if applicable)
- Documentation layout + sidebar
- Docs page template
- API reference template
- Case study template

### Wave 5: Cross-Page Polish
- Page transition animations
- Navigation active states verification
- Cross-page consistency audit
- Mobile navigation flow testing
```

Key wave rules for multi-page:
- Wave 0 and Wave 1 MUST complete before any page-specific work
- Pages within the same wave CAN be built in parallel (max 4 per wave)
- Content template pages (article, docs) depend on their index pages for consistent card/list patterns
- Cross-page polish wave runs AFTER all pages are built

---

## Layer 3: Integration Context

### DNA Connection

| DNA Section | Multi-Page Extension |
|---|---|
| Color system (12 tokens) | Same palette on ALL pages -- no page-specific color overrides |
| Typography (8-level scale) | Same type scale on ALL pages -- page-type density varies within same scale |
| Spacing (5-level) | Same spacing tokens everywhere -- consistency is cohesion |
| Motion tokens | Applied to page transitions + within-page animations identically |
| Signature element | Appears on landing page (PEAK) and optionally on about page |
| **NEW: Site Architecture** | Navigation, footer, page transitions, shared components (multi-page only) |

### Archetype Variants

Archetypes influence navigation style, footer complexity, and page transition animations. The page-type emotional arcs are archetype-independent (a pricing page needs TENSION regardless of archetype), but the visual execution of each beat varies by archetype.

| Archetype | Navigation Style | Footer Style | Transition |
|-----------|-----------------|-------------|------------|
| Brutalist | Stark text links, no hover effects | Minimal, text-only | Hard cut, no animation |
| Ethereal | Floating minimal nav, translucent bg | Minimal, dreamy, faded | Slow crossfade with blur |
| Kinetic | Bold nav with motion on hover | Compact, animated social links | Fast directional slide |
| Editorial | Refined serif nav, subtle underlines | Mega-footer with curated links | Subtle fade-up |
| Swiss | Grid-aligned nav, geometric precision | Structured grid footer | Clean fade |
| Luxury | Minimal nav with letter-spaced type | Elegant, minimal legal bar | Morph shared elements |
| Neo-Corporate | Standard fixed top nav, logo left | Full mega-footer, newsletter | Smooth crossfade |
| Japanese Minimal | Hidden nav (hamburger always) | Near-invisible, minimal | Opacity transition only |
| Neon Noir | Glowing text nav, dark bg | Dark with glow accents | Glow pulse transition |
| Data-Dense | Utility nav with search prominent | Sitemap-style dense footer | Instant (data-first, no delay) |
| Glassmorphism | Frosted glass nav bar | Glass-effect footer | Blur-in / blur-out |
| Playful | Colorful nav with bouncy interactions | Fun, illustrated footer | Bouncy slide |
| Warm Artisan | Textured nav, handcrafted feel | Earthy tones, minimal | Warm fade |

### Pipeline Stage

- **Input from:** Discovery phase (page count, page types), Design DNA (tokens, archetype), `emotional-arc` skill (beat definitions and constraints)
- **Output to:** MASTER-PLAN.md (wave structure with per-page arc), section PLAN.md files (page-specific beat assignments), build-orchestrator (Wave 1 shared component list)

### Related Skills

- **emotional-arc** -- Beat type definitions, parameter constraints, sequence validation rules. This skill defines WHICH beats per page type; emotional-arc defines HOW each beat is constrained
- **responsive-design** -- Navigation responsive patterns (hamburger, drawer, bottom-sheet), touch targets on mobile nav
- **accessibility** -- Skip links, aria-current="page", keyboard navigation for nav/footer, focus management for mobile menu
- **design-dna** -- Site-level DNA extensions (navigation, footer, transitions) are appended to DESIGN-DNA.md for multi-page projects
- **design-system-scaffold** -- Shared components (Wave 1) are part of the design system scaffold
- **compositional-diversity** -- Layout diversity rules apply per page independently (each page needs its own layout variety)
- **dark-light-mode** -- Theme toggle in shared navigation, consistent dark/light across all pages
- **page-transitions** -- Detailed transition choreography references this skill's archetype transition table

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Independent Page Design

**What goes wrong:** Each page designed from scratch with its own color choices, typography, button styles, and navigation. The result feels like 5 different websites stitched together. Users lose trust when visual language changes between pages.

**Instead:** Establish site DNA and shared components in Wave 0-1. Every page imports from the same component library and references the same DNA tokens. Variation comes from content and emotional arc, not from visual identity.

### Anti-Pattern 2: Landing Page Arc on Every Page

**What goes wrong:** Every page uses HOOK -> BUILD -> PEAK -> CLOSE, including the docs page and the contact page. Documentation with a PEAK beat feels absurd. A contact page with TENSION feels manipulative.

**Instead:** Each page type has its own emotional arc appropriate to its purpose. Docs pages use BUILD -> BREATHE -> BUILD (calm, functional). Contact pages use HOOK -> BUILD -> PROOF -> CLOSE (short, trust-focused). Landing pages get the full dramatic arc. See the page-type templates in Layer 2.

### Anti-Pattern 3: Copy-Paste Navigation

**What goes wrong:** Navigation HTML/JSX is duplicated in each page file. Over time, pages drift: one page has an extra link, another has different styling, a third has the old logo. Maintenance becomes a nightmare.

**Instead:** Navigation is a shared component, built once in Wave 1, imported everywhere. Changes to navigation propagate automatically. The component accepts `currentPath` as a prop and handles active state internally.

### Anti-Pattern 4: Page-Specific Color Overrides

**What goes wrong:** The pricing page uses a green accent for the "Best Value" badge. The blog uses a different blue for tags. The about page introduces a warm overlay color. Each makes sense in isolation, but together they fracture the brand.

**Instead:** One palette for the entire site. Use DNA semantic tokens for all color needs: `primary` for CTAs, `accent` for decorative elements, `secondary` for supporting elements. If the palette feels limiting, the problem is the palette itself -- fix it in DNA, not per-page.

### Anti-Pattern 5: Missing Inter-Page Navigation

**What goes wrong:** Pages exist but have no cross-linking. The blog has no link to pricing. The pricing page has no link to the about page for company credibility. Users enter on one page and leave without discovering others.

**Instead:** Cross-page links embedded in content (not just the nav). Blog articles link to relevant product pages. Pricing page links to case studies for social proof. Footer provides comprehensive site map. Breadcrumbs show hierarchy. Related content sections at the end of every page.

### Anti-Pattern 6: Docs-as-Afterthought

**What goes wrong:** Marketing pages are polished (animated, branded, award-worthy), but documentation uses a generic template with no DNA tokens, default fonts, and a different navigation. It feels like a different product.

**Instead:** Documentation pages share the same DNA, the same nav, and the same footer as marketing pages. The content density is higher and the emotional arc is calmer, but the visual language is consistent. The sidebar, code blocks, and typography all use DNA tokens. Documentation IS part of the product experience.

### Anti-Pattern 7: Ignoring Page-Type Content Requirements

**What goes wrong:** A pricing page is built like a landing page section -- one pricing card with a CTA. Or a blog index is built as a simple list with no featured post, no categories, no search. The page exists but does not serve its purpose.

**Instead:** Each page type has specific content requirements documented in the page-type templates. Pricing needs a comparison table, tier highlighting, toggle for billing period. Blog needs featured post, category filters, reading time. These are not optional -- they are what makes each page type functional.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| shared-components-wave | 1 | 1 | wave | HARD -- shared components must build in Wave 1 |
| max-pages-per-wave | 1 | 4 | pages | HARD -- max 4 pages building in parallel per wave |
| nav-max-primary-items | 5 | 7 | items | SOFT -- more items go into dropdown/mega-menu |
| footer-legal-links | 2 | - | links | HARD -- privacy and terms always present |
| pricing-max-tiers | 2 | 4 | tiers | SOFT -- more than 4 causes decision paralysis |
| article-body-max-width | 65 | 75 | ch | SOFT -- optimal reading line length |
| docs-sidebar-present | 1 | 1 | boolean | HARD -- docs pages require sidebar navigation |
| cross-page-color-overrides | 0 | 0 | count | HARD -- no page-specific color tokens |
| skip-link-present | 1 | 1 | boolean | HARD -- every page must have skip link |
| breadcrumb-depth-threshold | 3 | - | levels | SOFT -- breadcrumbs appear at 3+ hierarchy levels |
