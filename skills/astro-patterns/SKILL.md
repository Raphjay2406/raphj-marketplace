---
name: "astro-patterns"
description: "Astro 5/6 patterns: Islands architecture, Content Layer API, ClientRouter View Transitions, Server Islands, DNA integration"
tier: "domain"
triggers: "astro, islands, content collections, view transitions, static site, SSG, SSR, astro components"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are an Astro 5/6 architecture specialist. Astro is a static-first framework with Islands of interactivity -- most Modulo output is pre-rendered HTML with targeted interactive components (scroll animations, theme toggles, mobile navigation). Every pattern in this skill is forward-compatible: it works in Astro 5 and will continue working in Astro 6 (which removes several deprecated APIs).

### When to Use

- **Content-heavy websites:** Marketing pages, portfolios, blogs, documentation -- Astro excels at content-first sites
- **Performance-critical sites:** Astro ships zero JS by default, adding interactivity only where explicitly needed
- **Multi-page static sites:** Astro's file-based routing with `.astro` pages produces optimized static HTML per route
- **Hybrid static/dynamic sites:** Most pages pre-rendered, a few pages server-rendered on request
- **Framework detection matched Astro:** `astro.config.mjs` or `astro.config.ts` found, or `astro` in `package.json` dependencies

### When NOT to Use

- Project is a highly interactive web app (dashboards, real-time collaboration) -- use `nextjs-patterns` or `react-vite-patterns` instead
- Project uses Next.js -- use `nextjs-patterns` skill instead
- Project is a desktop app -- use `desktop-patterns` skill instead
- For styling system details -- use `tailwind-system` skill (this skill shows framework integration only)
- For responsive layout patterns -- use `responsive-design` skill
- For dark mode strategy -- use `dark-light-mode` skill (this skill shows Astro-specific FOUC prevention)

### Framework Detection

| Signal | Detection | Confidence |
|--------|-----------|------------|
| `astro.config.mjs` or `astro.config.ts` | Astro | HIGH |
| `package.json` has `astro` dependency | Astro | MEDIUM |

Result stored in `DESIGN-DNA.md` during `/modulo:start-project`.

### Astro's Key Differentiator

Astro generates static HTML by default. JavaScript is only shipped for explicitly hydrated components (Islands). This makes it ideal for content sites where most of the page is non-interactive. Interactive elements (theme toggles, scroll animations, mobile menus, carousels) are added as React/Preact islands with precise hydration directives.

### Forward-Compatibility Rules

These patterns work in BOTH Astro 5 (current stable) and Astro 6 (imminent stable):

| Astro 5 (works) | Astro 6 (breaking change) | Forward-Compatible Pattern |
|---|---|---|
| `<ViewTransitions />` still works | **Removed** | Use `<ClientRouter />` (works in both 5 and 6) |
| `Astro.glob()` still works | **Removed** | Use `getCollection()` from Content Layer API |
| Legacy content collections (`type: 'content'`) | **Removed** | Use Content Layer API with `loader:` property |
| `src/content/config.ts` path | Works but deprecated | Use `src/content.config.ts` (Astro 6 canonical path) |
| Node 18+ | Node 22+ **required** | Target Node 22+ in all projects |
| Zod 3 schemas | Zod 4 **required** | Use Zod 4 schema syntax (mostly compatible) |

### Decision Tree

1. **Static or dynamic?** Default to static (`output: 'static'`). Use `output: 'hybrid'` only if some pages need per-request rendering (auth-gated dashboards, search results)
2. **Interactive component?** If it needs user interaction (clicks, state, animations), make it a React/Preact island. If it is pure content display, use an Astro component (zero JS)
3. **Hydration timing?** `client:load` for above-fold interactive (theme toggle). `client:visible` for below-fold (scroll animations, carousels). `client:idle` for non-critical (newsletter forms)
4. **Content management?** Always use Content Layer API with `loader:` and `getCollection()`. Never use `Astro.glob()` or legacy content collections
5. **Page transitions?** Use `<ClientRouter />` for SPA-like navigation. Add `transition:persist` to elements that should maintain state (nav, audio player)

### Pipeline Connection

- **Referenced by:** section-planner, section-builder during build waves
- **Consumed at:** `/modulo:start-project` (framework detection), `/modulo:execute` (project structure, all builder output)
- **Depends on:** `design-dna` (token values), `tailwind-system` (CSS configuration), `dark-light-mode` (theme integration)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Astro Project Structure

Standard Astro project structure for a Modulo-generated multi-page site:

```
src/
  layouts/
    BaseLayout.astro          # Root: fonts, @theme, dark mode, ClientRouter
    BlogLayout.astro          # Blog post layout (extends BaseLayout)
    DocsLayout.astro          # Documentation layout with sidebar
  pages/
    index.astro               # Landing page
    about.astro               # About page
    pricing.astro             # Pricing page
    contact.astro             # Contact page
    blog/
      index.astro             # Blog listing
      [slug].astro            # Blog post (dynamic route)
  components/
    Navigation.astro          # Static navigation (zero JS)
    Footer.astro              # Static footer (zero JS)
    ThemeToggle.tsx            # Interactive island (React)
    MobileMenu.tsx            # Interactive island (React)
    HeroAnimation.tsx         # Interactive island (React, client:visible)
    ScrollReveal.tsx          # Interactive island (React, client:visible)
  content/
    config.ts                 # Content Layer configuration (Astro 5)
  content.config.ts           # Content Layer configuration (Astro 6 path)
  styles/
    globals.css               # @import "tailwindcss", @theme, @custom-variant dark
public/
  fonts/                      # Self-hosted fonts
  og/                         # Open Graph images
astro.config.mjs              # Integrations, output mode, Tailwind
```

Key architectural decisions:
- `.astro` components for ALL non-interactive content (headings, text, images, layouts, grids)
- `.tsx` components ONLY for interactive islands (theme toggle, mobile menu, animations, carousels)
- Content Layer API for all structured content (blog posts, team members, testimonials)
- `globals.css` contains the full Tailwind v4 `@theme` block with DNA tokens

#### Pattern 2: Base Layout with DNA Integration

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions'
import Navigation from '../components/Navigation.astro'
import Footer from '../components/Footer.astro'

interface Props {
  title: string
  description?: string
  image?: string
}

const { title, description = 'Default description', image = '/og/default.png' } = Astro.props
---

<html lang="en" class="scroll-smooth">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <title>{title}</title>

  <ClientRouter />
  <link rel="stylesheet" href="/styles/globals.css" />

  <!-- FOUC prevention -- runs before ANY rendering -->
  <script is:inline>
    (function() {
      const theme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.classList.add('dark')
      }
    })()
  </script>

  <!-- Preload display font for LCP -->
  <link rel="preload" href="/fonts/display.woff2" as="font" type="font/woff2" crossorigin />
</head>
<body class="bg-bg text-text font-body antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-bg focus:rounded-md">
    Skip to content
  </a>
  <Navigation transition:persist />
  <main id="main" transition:animate="slide">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

Key details:
- `<ClientRouter />` enables SPA-like page transitions (NOT `<ViewTransitions />` which is removed in Astro 6)
- `is:inline` on the dark mode script ensures it runs before rendering -- prevents FOUC
- `transition:persist` on `<Navigation>` preserves interactive state (mobile menu open, scroll position) across page navigations
- `transition:animate="slide"` on `<main>` provides page-level transition animation
- Skip link and semantic HTML for accessibility
- Font preloading for LCP performance

#### Pattern 3: Islands Architecture

The core decision: static Astro component vs. interactive React island.

```astro
---
// src/pages/index.astro -- Landing page with Islands strategy
import BaseLayout from '../layouts/BaseLayout.astro'
import HeroSection from '../components/HeroSection.astro'         // Static
import HeroAnimation from '../components/HeroAnimation.tsx'       // Interactive
import FeaturesGrid from '../components/FeaturesGrid.astro'       // Static
import TestimonialsCarousel from '../components/Testimonials.tsx'  // Interactive
import PricingTable from '../components/PricingTable.astro'       // Static
import ThemeToggle from '../components/ThemeToggle.tsx'            // Interactive
import ScrollReveal from '../components/ScrollReveal.tsx'         // Interactive
import NewsletterForm from '../components/Newsletter.tsx'         // Interactive
import CTASection from '../components/CTASection.astro'           // Static
---

<BaseLayout title="Home">
  <!-- Above fold: load immediately -->
  <ThemeToggle client:load />
  <HeroSection>
    <HeroAnimation client:load />
  </HeroSection>

  <!-- Below fold: load when scrolled into view -->
  <ScrollReveal client:visible>
    <FeaturesGrid />
  </ScrollReveal>

  <TestimonialsCarousel client:visible />

  <PricingTable />

  <!-- Non-critical: load when browser is idle -->
  <NewsletterForm client:idle />

  <CTASection />
</BaseLayout>
```

**Islands hydration directive decision tree:**

| Directive | When to Use | JS Impact |
|-----------|------------|-----------|
| `client:load` | Must be interactive immediately: theme toggle, above-fold animations, auth UI | Loads on page load |
| `client:visible` | Below-fold interactive: scroll animations, carousels, charts, maps | Loads when scrolled into viewport |
| `client:idle` | Non-critical interactive: newsletter forms, analytics widgets, share buttons | Loads when browser is idle |
| `client:media="(max-width: 768px)"` | Mobile-only interactive: mobile hamburger menu (desktop nav is static links) | Loads only at matching breakpoint |
| `client:only="react"` | Client-only (never SSR): components using `window`/`document` at initialization | Skips SSR, renders only on client |
| No directive | Pure content display: text, images, grids, cards, layouts, headers, footers | **Zero JS shipped** |

**Rule of thumb:** If you are unsure whether a component needs interactivity, make it an Astro component first. You can always add a `client:*` directive later. Starting with JS and removing it is harder.

#### Pattern 4: Content Layer API (Forward-Compatible)

```typescript
// src/content.config.ts (Astro 6 canonical path)
// Also works at src/content/config.ts (Astro 5 path)
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string(),
    order: z.number(),
  }),
})

export const collections = { blog, team }
```

```astro
---
// src/pages/blog/index.astro -- Blog listing using Content Layer API
import { getCollection } from 'astro:content'
import BaseLayout from '../../layouts/BaseLayout.astro'

const posts = await getCollection('blog', ({ data }) => {
  return !data.draft && data.pubDate <= new Date()
})

const sorted = posts.sort((a, b) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
)
---

<BaseLayout title="Blog">
  <section class="max-w-5xl mx-auto px-spacing-md py-spacing-xl">
    <h1 class="font-display text-display">Blog</h1>
    <div class="mt-spacing-lg grid gap-spacing-lg @container">
      {sorted.map((post) => (
        <a
          href={`/blog/${post.id}`}
          class="group block p-spacing-md bg-surface border border-border rounded-lg hover:border-primary/30 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          <time datetime={post.data.pubDate.toISOString()} class="text-sm text-muted">
            {post.data.pubDate.toLocaleDateString()}
          </time>
          <h2 class="mt-2 font-display text-xl font-semibold text-text group-hover:text-primary transition-colors">
            {post.data.title}
          </h2>
          <p class="mt-2 text-muted line-clamp-2">{post.data.description}</p>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>
```

```astro
---
// src/pages/blog/[slug].astro -- Blog post using Content Layer API
import { getCollection, render } from 'astro:content'
import BlogLayout from '../../layouts/BlogLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await render(post)
---

<BlogLayout title={post.data.title} description={post.data.description}>
  <article class="max-w-prose mx-auto px-spacing-md py-spacing-xl">
    <h1 class="font-display text-display leading-tight tracking-tight">
      {post.data.title}
    </h1>
    <time datetime={post.data.pubDate.toISOString()} class="mt-spacing-sm block text-sm text-muted">
      {post.data.pubDate.toLocaleDateString()}
    </time>
    <div class="mt-spacing-lg prose prose-lg text-text">
      <Content />
    </div>
  </article>
</BlogLayout>
```

#### Pattern 5: View Transitions (ClientRouter)

```astro
---
// Page-level transitions per archetype
// Applied in BaseLayout.astro via transition:animate on <main>
---

<!-- Standard transition directives -->
<main transition:animate="slide">       <!-- Slide left/right -->
  <slot />
</main>

<!-- Alternative built-in animations -->
<div transition:animate="fade">Fades in/out</div>
<div transition:animate="slide">Slides left/right</div>
<div transition:animate="none">Instant swap (Brutalist, Japanese Minimal)</div>

<!-- Named transitions: morph matching elements across pages -->
<img
  transition:name={`hero-${post.id}`}
  src={post.data.heroImage}
  alt={post.data.heroAlt || ''}
  class="w-full aspect-video object-cover rounded-lg"
/>
<!-- Same transition:name on the target page creates a smooth morph animation -->

<!-- Persist interactive state across navigations -->
<Navigation transition:persist />
<!-- Audio player keeps playing, form data preserved, mobile menu state maintained -->

<!-- Persist with unique ID for multiple instances -->
<AudioPlayer client:load transition:persist="audio-player" />
```

**Archetype transition mapping:**

| Archetype | Transition Style | Astro Animation |
|-----------|-----------------|-----------------|
| Brutalist, Japanese Minimal | Instant cut | `transition:animate="none"` |
| Swiss/International, Editorial | Clean fade | `transition:animate="fade"` |
| Kinetic, Retro-Future | Directional slide | `transition:animate="slide"` |
| Ethereal, Glassmorphism | Custom slow morph | Custom `transition:animate` with extended duration |
| Neon Noir | Custom wipe | Custom `transition:animate` with clip-path |

#### Pattern 6: Server Islands (Astro 5+)

Dynamic content on otherwise static pages. The page shell renders instantly as static HTML, while server-deferred content loads asynchronously.

```astro
---
// src/components/UserGreeting.astro
// This component runs on the server PER REQUEST
const session = await getSession(Astro.cookies)
---

{session ? (
  <p class="text-sm text-muted">Welcome back, {session.user.name}</p>
) : (
  <a href="/login" class="text-sm text-primary hover:underline">Sign in</a>
)}
```

```astro
---
// Usage in a static page
import UserGreeting from '../components/UserGreeting.astro'
---

<header class="flex items-center justify-between px-6 py-4 border-b border-border">
  <Logo />
  <nav><!-- Static links --></nav>
  <UserGreeting server:defer>
    <p slot="fallback" class="text-sm text-muted animate-pulse">Loading...</p>
  </UserGreeting>
</header>
```

Use cases for Server Islands:
- User-specific UI (greeting, avatar, notifications) on cached pages
- Real-time data (stock prices, availability) on otherwise static product pages
- A/B test variants without making the whole page dynamic

#### Pattern 7: Hybrid Rendering (SSR + SSG)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'hybrid',          // Default static, opt-in SSR per page
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

```astro
---
// src/pages/dashboard.astro -- SSR page (renders per request)
export const prerender = false  // Opt OUT of static generation

import { getSession } from '../lib/auth'
const session = await getSession(Astro.cookies)
if (!session) return Astro.redirect('/login')
---

<BaseLayout title="Dashboard">
  <h1>Welcome, {session.user.name}</h1>
  <!-- Dynamic content based on authenticated user -->
</BaseLayout>
```

```astro
---
// src/pages/about.astro -- Static page (default in hybrid mode)
// No prerender export needed -- static is the default
---

<BaseLayout title="About">
  <h1>About Us</h1>
  <!-- Pre-rendered at build time -->
</BaseLayout>
```

### Reference Sites

- **astro.build** -- Astro's own site built with Astro. Study: View Transitions between pages, content-heavy layout, static-first architecture with islands for interactive documentation
- **starlight.astro.build** -- Astro's documentation framework. Study: Content Layer API usage, search as an island, sidebar navigation persistence
- **netlify.com** -- Marketing site using Astro. Study: Performance-first architecture, minimal JS, content-driven pages with targeted interactivity

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Astro |
|-----------|---------------|
| Color tokens (bg, surface, text, etc.) | Applied via `globals.css` `@theme` block, consumed through Tailwind utilities in `.astro` templates |
| Font tokens (display, body, mono) | Loaded via `@font-face` in `globals.css` or `<link>` preload in BaseLayout, mapped through `@theme` |
| Spacing tokens | Used in Astro component markup via Tailwind spacing utilities |
| Motion tokens | Defined as `:root` CSS custom properties, consumed by React islands using `motion/react` or GSAP |
| Signature element | Implemented in Astro components or React islands depending on interactivity needs |

Astro's static-first nature means most CSS is generated at build time. DNA tokens in `@theme` produce deterministic class names -- no runtime token resolution needed for static content.

### Archetype Variants

Archetypes primarily affect three things in Astro projects:

| What Changes | How |
|-------------|-----|
| Content density | Archetypes like Data-Dense use tighter spacing; Ethereal uses generous whitespace |
| Island choices | Kinetic projects have more animation islands; Japanese Minimal has fewer |
| Page transition style | `transition:animate` value on `<main>` matches archetype personality |
| Static vs. island ratio | Content-heavy archetypes (Editorial, Swiss) skew more static; interaction-heavy archetypes (Kinetic, Neon Noir) use more islands |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (framework detection, token values), `MASTER-PLAN.md` (page structure)
- **Output to:** Project scaffold (Wave 0), all subsequent builder output follows these structural patterns
- **Used by:** build-orchestrator (scaffold generation), section-builder (component and island patterns), section-planner (route and content structure)

### Related Skills

- **tailwind-system** -- Astro uses `@tailwindcss/vite` plugin (NOT `@tailwindcss/postcss`). `globals.css` contains the same `@theme` block. See tailwind-system for setup details
- **dark-light-mode** -- Astro requires `is:inline` script in `<head>` for FOUC prevention (no `next-themes` equivalent). Theme toggle is a React island with `client:load`
- **responsive-design** -- Same container query and responsive patterns apply. Astro components use Tailwind classes identically to React components
- **accessibility** -- Same skip link, focus management, and ARIA patterns. Astro components output semantic HTML
- **multi-page-architecture** -- Astro excels at multi-page sites. File-based routing maps directly to the page-type templates (landing, about, pricing, blog)
- **cinematic-motion** -- Motion libraries (`motion/react`, GSAP) run inside React islands only. Static Astro components use CSS animations

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Using `<ViewTransitions />`

**What goes wrong:** Code imports `ViewTransitions` from `astro:transitions`. This component is removed in Astro 6. Projects using it will break on upgrade.
**Instead:** Import and use `<ClientRouter />` from `astro:transitions`. It provides identical functionality and works in both Astro 5 and 6.

### Anti-Pattern 2: Using Astro.glob()

**What goes wrong:** Code uses `Astro.glob('./*.md')` to read content files. This API is removed in Astro 6.
**Instead:** Use `getCollection()` from `astro:content` with the Content Layer API. Define collections in `src/content.config.ts` with `loader:` and `schema:`.

### Anti-Pattern 3: Legacy Content Collections

**What goes wrong:** Content collections defined with `type: 'content'` or `type: 'data'` without a `loader:` property. Legacy collection format is removed in Astro 6.
**Instead:** Use Content Layer API with `loader: glob({ pattern: '**/*.md', base: './src/content/blog' })`. The schema definition remains similar but the collection definition uses loaders.

### Anti-Pattern 4: Over-Hydrating Components

**What goes wrong:** Every component is a React island with `client:load`. The page ships hundreds of KB of JavaScript for content that is purely static.
**Instead:** Default to Astro components (`.astro` files) for all non-interactive content. Only use React/Preact islands for components that genuinely need client-side interactivity: state management, event handlers, animations, browser APIs. A landing page might have 3-5 islands out of 15-20 total components.

### Anti-Pattern 5: client:load Everywhere

**What goes wrong:** All interactive islands use `client:load`, loading all JavaScript on initial page load regardless of whether the component is visible.
**Instead:** Use the most appropriate directive per component:
- `client:load` -- ONLY for above-fold interactive elements (theme toggle, hero animation)
- `client:visible` -- for below-fold elements (scroll animations, carousels, testimonials)
- `client:idle` -- for non-critical elements (newsletter forms, analytics, social sharing)
- `client:media` -- for breakpoint-specific elements (mobile menu)

### Anti-Pattern 6: Importing framer-motion

**What goes wrong:** React islands import from `'framer-motion'`. The package is deprecated.
**Instead:** Import from `'motion/react'`. Same API, new package name. Example: `import { motion, AnimatePresence } from 'motion/react'`.

### Anti-Pattern 7: Tailwind v3 Configuration

**What goes wrong:** Project uses `tailwind.config.mjs` for colors, fonts, and spacing, or uses the `@tailwindcss/container-queries` plugin.
**Instead:** Astro uses `@tailwindcss/vite` plugin with CSS-first configuration. All tokens in `@theme { }` blocks in `globals.css`. Container queries are built into Tailwind v4. See `tailwind-system` skill for the complete pattern.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| ClientRouter presence | 1 | 1 | component | HARD -- BaseLayout must include `<ClientRouter />` for page transitions |
| FOUC prevention script | 1 | 1 | `is:inline` script | HARD -- BaseLayout `<head>` must include dark mode script |
| Skip link presence | 1 | 1 | element | HARD -- BaseLayout must include skip-to-content link |
| Island ratio per page | - | 40 | % of components | SOFT -- majority of components should be static Astro |
| client:load usage | - | 3 | islands per page | SOFT -- limit above-fold JS; most islands should be `client:visible` or `client:idle` |
| Font preload | 1 | 2 | `<link>` tags | SOFT -- preload display font and optionally body font |
| Content Layer API | - | - | API | HARD -- never use `Astro.glob()` or legacy content collections |
| ViewTransitions usage | 0 | 0 | imports | HARD -- never import `ViewTransitions`; use `ClientRouter` |
