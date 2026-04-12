---
name: "nextjs-patterns"
description: "Next.js 16 patterns for App Router and Pages Router: proxy.ts, async APIs, Cache Components, RSC, font loading, DNA integration"
tier: "domain"
triggers: "next.js, nextjs, app router, pages router, server components, RSC, proxy, cache components, next/font, next/image"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a Next.js 16 architecture specialist. This skill covers BOTH App Router and Pages Router -- some production apps still use Pages Router and it remains fully supported in Next.js 16. Every pattern uses current APIs: `proxy.ts` replaces `middleware.ts`, params/cookies/headers are async, Turbopack is the default bundler, and Cache Components replace experimental PPR.

### When to Use

- **New web project:** Next.js is the default framework for dynamic React applications
- **App Router project:** Modern Next.js with React Server Components, streaming, Cache Components
- **Pages Router project:** Stable Next.js with `getStaticProps` / `getServerSideProps`, simpler mental model
- **Hybrid project:** Both `app/` and `pages/` directories present -- use App Router for new routes, Pages Router for existing routes
- **Framework detection matched Next.js:** `next.config.ts` or `next.config.js` found, or `next` in `package.json` dependencies

### When NOT to Use

- Project uses Astro -- use `astro-patterns` skill instead
- Project is a pure SPA/client-side app -- use `react-vite-patterns` skill instead
- Project is a desktop app -- use `desktop-patterns` skill instead (may still use Next.js under the hood)
- For styling system details -- use `tailwind-system` skill (this skill shows framework integration only)
- For responsive layout patterns -- use `responsive-design` skill
- For dark mode strategy -- use `dark-light-mode` skill (this skill shows `next-themes` integration)

### Framework Detection

| Signal | Detection | Confidence |
|--------|-----------|------------|
| `next.config.ts` or `next.config.js` | Next.js | HIGH |
| `package.json` has `next` dependency | Next.js | MEDIUM |
| Only `package.json` dependency, no config | Ask user | LOW |

**Router sub-detection:**

| Signal | Router | Confidence |
|--------|--------|------------|
| `app/` directory with `layout.tsx` | App Router | HIGH |
| `pages/` directory with `_app.tsx` | Pages Router | HIGH |
| Both `app/` and `pages/` directories | Hybrid (both routers) | HIGH |
| Only `package.json` next dependency | Ask user | LOW |

Result stored in `DESIGN-DNA.md` during `/gen:start-project`.

### Router Choice Decision Tree

- **New project (2026+):** App Router -- React 19.2 features, RSC, streaming, Cache Components
- **Existing Pages Router project:** Pages Router patterns -- still fully supported in Next.js 16, no forced migration
- **Both routers present:** Document both, prefer App Router for new routes
- **Uncertain:** Ask user during discovery -- never assume migration is desired

### Critical Breaking Changes (v14/15 to v16)

**This table is the single source of truth.** If you see ANY v14/15 pattern in generated code, it is WRONG.

| Old Pattern (NEVER use) | New Pattern (ALWAYS use) | Why Changed |
|---|---|---|
| `middleware.ts` with `export function middleware()` | `proxy.ts` with `export default function proxy()` | Renamed and restructured in v16 |
| `params.slug` (sync access) | `const { slug } = await params` (async) | Params are now a Promise in v16 |
| `cookies()` (sync call) | `const cookieStore = await cookies()` (async) | Cookies are async in v16 |
| `headers()` (sync call) | `const headersList = await headers()` (async) | Headers are async in v16 |
| `experimental: { ppr: true }` | `cacheComponents: true` in next.config | PPR graduated to Cache Components |
| Webpack as default bundler | Turbopack as default (opt-out: `--webpack`) | Turbopack is default in v16 |
| Implicit `default.js` in parallel routes | Explicit `default.js` required for ALL slots | No more implicit fallbacks |
| `import from 'framer-motion'` | `import from 'motion/react'` | Package rebranded to motion |
| `tailwind.config.ts` for tokens | `@theme { }` in `globals.css` | Tailwind v4 is CSS-first |

### Pipeline Connection

- **Referenced by:** planner, builder during build waves
- **Consumed at:** `/gen:start-project` (framework detection), `/gen:execute` (project structure, all builder output)
- **Depends on:** `design-dna` (token values), `tailwind-system` (CSS configuration), `dark-light-mode` (theme integration)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: App Router Project Structure

Standard Next.js 16 App Router structure for a Genorah-generated multi-page site:

```
app/
  layout.tsx              # Root layout: fonts, ThemeProvider, DNA tokens
  page.tsx                # Home page (landing)
  about/page.tsx          # About page
  pricing/page.tsx        # Pricing page
  blog/
    page.tsx              # Blog index
    [slug]/page.tsx       # Blog post (async params)
  contact/page.tsx        # Contact page
  globals.css             # @import "tailwindcss", @theme, @custom-variant dark
  proxy.ts                # Replaces middleware.ts -- auth, redirects, rewrites
public/
  fonts/                  # Self-hosted fonts (if not using next/font/google)
  og/                     # Open Graph images
next.config.ts            # cacheComponents, images, i18n
```

File conventions within each route segment:

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Route UI | Yes (for route to exist) |
| `layout.tsx` | Shared wrapper (persists across child navigation) | Root only |
| `loading.tsx` | Streaming loading UI (Suspense boundary) | Recommended |
| `error.tsx` | Error boundary (`'use client'`) | Recommended |
| `not-found.tsx` | 404 page | Optional |
| `default.tsx` | Parallel route fallback | Required for ALL parallel route slots |

#### Pattern 2: Root Layout with DNA Integration

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const displayFont = Geist({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
})

const bodyFont = Geist({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const monoFont = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: { default: 'Site Title', template: '%s | Site Title' },
  description: 'Site description for SEO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} bg-bg text-text font-body antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-bg focus:rounded-md"
          >
            Skip to content
          </a>
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Key details:
- `suppressHydrationWarning` on `<html>` -- required by `next-themes` to avoid hydration mismatch from the injected class
- Font variables (`--font-display`, `--font-body`, `--font-mono`) mapped to Tailwind via `@theme { --font-family-display: var(--font-display); }` in `globals.css`
- `antialiased` for font smoothing on all text
- Skip link uses DNA tokens (`bg-primary`, `text-bg`) and is `sr-only` until focused
- `ThemeProvider` handles dark mode with FOUC prevention (injects blocking script in `<head>`)

#### Pattern 3: Async Params and Dynamic Routes (Next.js 16)

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params // MUST await -- params is a Promise in v16
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <article className="max-w-prose mx-auto px-spacing-md py-spacing-xl">
      <h1 className="font-display text-display leading-tight tracking-tight">
        {post.title}
      </h1>
      <time className="mt-spacing-sm block text-sm text-muted" dateTime={post.date}>
        {new Date(post.date).toLocaleDateString()}
      </time>
      <div className="mt-spacing-lg prose prose-lg text-text">
        {post.content}
      </div>
    </article>
  )
}

// Async metadata -- params must be awaited here too
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  }
}

// Static generation for known slugs
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

#### Pattern 4: proxy.ts (Replaces middleware.ts)

```tsx
// proxy.ts -- top-level file, NOT inside app/
import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth check for protected routes
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Locale detection and redirect
  if (pathname === '/') {
    const locale = request.headers.get('accept-language')?.split(',')[0]?.slice(0, 2)
    if (locale === 'de') {
      return NextResponse.redirect(new URL('/de', request.url))
    }
  }

  return NextResponse.next()
}

// Optionally limit routes proxy runs on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

#### Pattern 5: Font Loading with DNA Integration

```tsx
// app/layout.tsx -- Font loading section
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'

// Display font -- dramatic type for headings
const displayFont = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
})

// Body font -- readable type for content
const bodyFont = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

// Mono font -- code and data
const monoFont = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})
```

```css
/* globals.css -- Map font variables to Tailwind theme */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Font family mapping -- next/font sets the CSS variables */
  --font-family-display: var(--font-display);
  --font-family-body: var(--font-body);
  --font-family-mono: var(--font-mono);

  /* DNA color tokens, spacing, etc. */
  --color-bg: #faf9f6;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #ff6f3c;
  /* ... remaining DNA tokens */
}
```

Usage: `font-display` for headings, `font-body` (or just default body), `font-mono` for code. `next/font` handles subset optimization, preloading, and FOIT/FOUT prevention automatically.

#### Pattern 6: Image Optimization

```tsx
import Image from 'next/image'

// Hero image -- priority loading, responsive sizes
<Image
  src="/hero.jpg"
  alt="Descriptive alt text for accessibility"
  width={1440}
  height={810}
  priority                    // Preload: above-fold LCP image
  sizes="100vw"               // Full-width hero
  className="w-full h-auto object-cover"
  placeholder="blur"          // Blur placeholder while loading
  blurDataURL="data:image/..."
/>

// Card image -- container-responsive sizes
<Image
  src={post.image}
  alt={post.imageAlt}
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="rounded-md object-cover aspect-video"
/>

// Dark mode image treatment via CSS
<Image
  src="/illustration.png"
  alt="Feature illustration"
  width={800}
  height={600}
  className="dark:brightness-90 dark:saturate-90 transition-[filter] duration-300"
/>

// Fill mode for flexible containers
<div className="relative aspect-video overflow-hidden rounded-lg">
  <Image
    src="/background.jpg"
    alt=""                     // Decorative: empty alt
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

Key details:
- `priority` on hero/LCP images only (first visible image above fold)
- `sizes` attribute MUST match actual rendered sizes for optimal loading
- Dark mode uses CSS `brightness` / `saturate` filters -- no duplicate assets needed for photos
- Decorative images get `alt=""` (not omitted, explicitly empty)

#### Pattern 7: Pages Router Patterns

Equal coverage per project decision. Pages Router is simpler and many production apps use it.

```tsx
// pages/_app.tsx -- Root wrapper (equivalent to app/layout.tsx)
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { Inter, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'

const displayFont = Playfair_Display({ variable: '--font-display', subsets: ['latin'] })
const bodyFont = Inter({ variable: '--font-body', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`${displayFont.variable} ${bodyFont.variable} font-body`}>
        <a href="#main" className="sr-only focus:not-sr-only ...">Skip to content</a>
        <Navigation />
        <main id="main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
```

```tsx
// pages/blog/[slug].tsx -- Dynamic route with getStaticProps
import { GetStaticPaths, GetStaticProps } from 'next'

interface BlogPostProps {
  post: Post
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="max-w-prose mx-auto px-4 py-12">
      <h1 className="font-display text-display">{post.title}</h1>
      <div className="prose prose-lg">{post.content}</div>
    </article>
  )
}

// Data fetching -- NOT async params, uses getStaticProps
export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  const slug = params?.slug as string  // Sync access -- Pages Router uses direct access
  const post = await getPost(slug)
  if (!post) return { notFound: true }
  return { props: { post }, revalidate: 60 }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts()
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  }
}
```

```tsx
// pages/api/subscribe.ts -- API route (Pages Router only)
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  await subscribeEmail(email)
  res.status(200).json({ success: true })
}
```

**Key differences from App Router:**

| Aspect | App Router | Pages Router |
|--------|-----------|--------------|
| Data fetching | `async` Server Components, Cache Components | `getStaticProps`, `getServerSideProps` |
| Dynamic params | `await params` (async Promise) | `params.slug` (sync, direct access) |
| Layouts | `layout.tsx` (nested, persistent) | `_app.tsx` (single wrapper) |
| API routes | `app/api/route.ts` with `GET`/`POST` exports | `pages/api/*.ts` with `handler` default export |
| Loading states | `loading.tsx` (automatic Suspense) | Manual `useState` / skeleton patterns |
| Error handling | `error.tsx` (automatic boundary) | `_error.tsx` (global) or manual `try/catch` |
| Server Components | Default (no directive needed) | Not available -- all components are client |
| Proxy/Middleware | `proxy.ts` | `proxy.ts` (shared, applies to both routers) |

#### Pattern 8: React 19.2 Features in Next.js 16

New capabilities available in App Router projects:

```tsx
// Cache Components -- replaces experimental PPR
// next.config.ts: { cacheComponents: true }

// In any Server Component:
async function ProductPrice({ id }: { id: string }) {
  "use cache"  // This component's output is cached
  const price = await fetchPrice(id)
  return <span className="font-mono text-lg">${price}</span>
}

// Static shell renders instantly, cached component streams when ready
export default function ProductPage() {
  return (
    <div>
      <h1>Product Name</h1>               {/* Static -- instant */}
      <ProductPrice id="abc" />            {/* Cached -- streams */}
      <AddToCart />                         {/* Client -- hydrates */}
    </div>
  )
}
```

```tsx
// Activity component -- hidden UI that preserves state
import { Activity } from 'react'

function TabPanel({ activeTab }: { activeTab: string }) {
  return (
    <>
      <Activity mode={activeTab === 'overview' ? 'visible' : 'hidden'}>
        <OverviewContent />   {/* Keeps state when hidden */}
      </Activity>
      <Activity mode={activeTab === 'details' ? 'visible' : 'hidden'}>
        <DetailsContent />    {/* Scroll position, form data preserved */}
      </Activity>
    </>
  )
}
```

```tsx
// React Compiler -- automatic memoization
// next.config.ts: { reactCompiler: true }
// No more manual useMemo/useCallback for performance.
// The compiler automatically memoizes values and callbacks.
// Write natural React code -- the compiler optimizes it.

function ExpensiveList({ items, filter }: Props) {
  // React Compiler auto-memoizes this filtering
  const filtered = items.filter((item) => item.category === filter)

  return (
    <ul>
      {filtered.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### Reference Sites

- **vercel.com** -- Next.js creator's site. App Router showcase with streaming, edge functions, complex data patterns. Study: loading states, page transitions, dark mode implementation
- **linear.app** -- Desktop-quality web app built on Next.js. Study: keyboard navigation, command palette, performance with complex UI
- **cal.com** -- Open-source scheduling. Hybrid Pages/App Router migration. Study: incremental adoption patterns, API route architecture

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Next.js |
|-----------|-----------------|
| Color tokens (bg, surface, text, etc.) | Applied via `globals.css` `@theme` block, consumed through Tailwind utilities |
| Font tokens (display, body, mono) | Loaded via `next/font`, mapped to Tailwind through CSS variables |
| Spacing tokens | Used in layout components via Tailwind spacing utilities |
| Motion tokens | Defined as `:root` CSS custom properties, consumed by animation libraries |
| Signature element | Implemented in components, enforced by anti-slop gate |

### Archetype Variants

Archetypes do NOT change Next.js structural patterns. They change the VALUES flowing through the structure:

| What Changes | How |
|-------------|-----|
| Font choices | Different `next/font` imports in root layout |
| Color palette | Different values in `@theme` block of `globals.css` |
| Motion timing | Different `:root` custom property values |
| Dark mode transition | Different transition animation in `ThemeProvider` wrapper |
| Image treatment | Different CSS filter values for dark mode photos |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (framework detection result, token values), `MASTER-PLAN.md` (page structure)
- **Output to:** Project scaffold (Wave 0), all subsequent builder output follows these structural patterns
- **Used by:** orchestrator (scaffold generation), builder (component patterns), planner (route structure)

### Related Skills

- **tailwind-system** -- Next.js uses `@tailwindcss/postcss` plugin. `globals.css` contains the `@theme` block. See tailwind-system for the complete CSS configuration
- **dark-light-mode** -- `next-themes` integration for FOUC-free dark mode. Theme transition animations per archetype
- **responsive-design** -- Container queries for components, media queries for page layout. `next/image` `sizes` attribute follows responsive breakpoints
- **accessibility** -- Skip link pattern in root layout, focus management during route changes, `aria-live` for loading states
- **multi-page-architecture** -- Page-type templates (landing, about, pricing, blog) define the route structure. Shared components (nav, footer) are in the root layout
- **cinematic-motion** -- Motion tokens defined as `:root` CSS custom properties, consumed by `motion/react` and GSAP in client components

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Using middleware.ts

**What goes wrong:** Code uses `middleware.ts` with `export function middleware()`. This file is deprecated in Next.js 16 and will not execute.
**Instead:** Create `proxy.ts` at project root with `export default function proxy(request)`. Same capabilities, new name and export signature.

### Anti-Pattern 2: Sync Params Access

**What goes wrong:** Dynamic route component accesses `params.slug` directly without awaiting. TypeScript will error because `params` is now `Promise<{ slug: string }>`.
**Instead:** Always destructure with `const { slug } = await params`. This applies to `params` in page components, `generateMetadata`, and layout components.

### Anti-Pattern 3: Sync Cookies and Headers

**What goes wrong:** Server code calls `cookies()` or `headers()` without `await`. These functions return Promises in Next.js 16.
**Instead:** `const cookieStore = await cookies()` and `const headersList = await headers()`. Both are async in v16.

### Anti-Pattern 4: framer-motion Imports

**What goes wrong:** Code imports from `'framer-motion'`. The package still works but is deprecated and will eventually stop receiving updates.
**Instead:** Import from `'motion/react'`. Same API, new package name. Example: `import { motion, AnimatePresence } from 'motion/react'`.

### Anti-Pattern 5: Tailwind v3 Configuration

**What goes wrong:** Project has `tailwind.config.ts` defining colors, fonts, and spacing in JavaScript. This bypasses Tailwind v4's CSS-first design system.
**Instead:** Use `@theme { }` blocks in `globals.css` for all design tokens. See `tailwind-system` skill for the complete pattern. The only valid `tailwind.config.ts` use is for plugins that genuinely require JS configuration.

### Anti-Pattern 6: Missing default.tsx in Parallel Routes

**What goes wrong:** Parallel routes (e.g., `@modal/`) work without `default.tsx` in development but fail in production. Next.js 16 requires explicit fallbacks for all parallel route slots.
**Instead:** Create `default.tsx` in every parallel route directory. It can return `null` if no fallback UI is needed: `export default function Default() { return null }`.

### Anti-Pattern 7: Ignoring Pages Router Patterns

**What goes wrong:** Builder generates App Router patterns (`async` page components, `await params`) for a project using Pages Router. The code will not work.
**Instead:** Check router type in `DESIGN-DNA.md`. Pages Router uses `getStaticProps` / `getServerSideProps`, synchronous `params` access, `_app.tsx` wrapper, and `pages/api/` for API routes. Never mix router paradigms within the same route.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| next/font display value | - | - | `swap` | HARD -- always use `display: 'swap'` for font loading |
| Hero image priority | - | - | boolean | HARD -- above-fold LCP images must have `priority` |
| Image alt text | 1 | - | chars | HARD -- all non-decorative images require descriptive alt (decorative = `alt=""`) |
| Skip link presence | 1 | 1 | element | HARD -- root layout must include skip-to-content link |
| suppressHydrationWarning | - | - | attribute | HARD -- required on `<html>` when using next-themes |
| default.tsx in parallel routes | 1 | - | file per slot | HARD -- every parallel route slot requires explicit default |
| params access pattern | - | - | `await` | HARD -- all params access must use `await` in App Router |
| cookies/headers access | - | - | `await` | HARD -- all cookies()/headers() calls must use `await` |

## v3.2 Addendum: Next.js 16 Cache Components (GA)

Next.js 16 made `'use cache'` + `cacheLife` + `cacheTag` + `updateTag` stable (no more `unstable_` prefix). Replaces `unstable_cache` and the implicit fetch-caching model.

### Opt in

```ts
// next.config.ts
export default { cacheComponents: true };  // GA flag in Next 16.0+
```

### Cache a component

```tsx
// app/page.tsx
'use cache';
import { cacheLife, cacheTag } from 'next/cache';

export default async function Page() {
  cacheLife('hours');           // or 'minutes', 'days', or { revalidate: 3600, expire: 86400 }
  cacheTag('homepage');
  const data = await getData();
  return <Home data={data} />;
}
```

### Read-your-writes with updateTag

```ts
// app/actions.ts
'use server';
import { updateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  await db.posts.create({ data: ... });
  updateTag('homepage');   // Stable in Next 16.2+
  // Returning client sees fresh data immediately (no revalidation lag)
}
```

### Migration from ISR + unstable_cache

| Old (Next 14-15) | New (Next 16) |
|---|---|
| `export const revalidate = 3600` | `'use cache'` + `cacheLife('hours')` |
| `unstable_cache(fn, [key], { tags })` | `'use cache'` + `cacheTag(key)` |
| `fetch(url, { next: { tags: ['x'] } })` | `'use cache'` wrapping the fetch-calling function |
| `revalidateTag('x')` in Server Action | `updateTag('x')` for read-your-writes, or `revalidateTag('x')` for background |

Genorah builders default to `'use cache'` + `cacheTag` for CMS-backed pages (see cms-sanity, cms-payload skills). ISR mental model only for legacy projects.

