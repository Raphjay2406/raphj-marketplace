---
name: "react-vite-patterns"
description: "React/Vite SPA patterns: client-side routing, Vite setup, no-SSR patterns, DNA integration for single-page applications"
tier: "domain"
triggers: "react, vite, SPA, single page app, client-side routing, react router, tanstack router"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Core Philosophy

React/Vite is a **client-only single-page application**. Every component is client-rendered. There are no server components, no SSR hydration mismatches, no middleware, and no API routes. This simplicity is the strength -- the entire application loads as a client bundle, routes are handled in the browser, and the build tooling is minimal.

Most React patterns are **identical** between React/Vite and Next.js -- components, hooks, state management, and styling work the same way. This skill focuses exclusively on what is DIFFERENT. If a pattern works the same in both, the Next.js patterns skill covers it and this skill does not duplicate it.

### Framework Detection

| Signal | Framework | Confidence |
|--------|-----------|------------|
| `vite.config.ts` + no `next.config.*` + no `astro.config.*` | React/Vite | HIGH |
| `vite.config.ts` + `src-tauri/` | Tauri (React/Vite underneath) | HIGH -- load desktop-patterns alongside |
| `package.json` has `vite` + `react` but no `next` or `astro` | React/Vite | MEDIUM |
| `index.html` in project root (not `app/` dir) | React/Vite | MEDIUM |

Store detected framework in `DESIGN-DNA.md` under `framework: react-vite`.

### When to Use

- SPA projects without SSR requirements -- marketing microsites, internal tools, dashboards, prototypes
- Projects with a separate backend API -- React/Vite handles UI only, API is external
- Desktop apps using Tauri or Electron -- React/Vite is the typical web layer (load desktop-patterns skill alongside)
- Rapid prototypes where SSR complexity is unnecessary

### When NOT to Use

- Content-heavy sites needing SEO -- use Next.js (SSR/SSG) or Astro (static-first)
- Sites with dynamic server-side rendering needs -- use Next.js patterns skill
- Astro projects -- use Astro patterns skill even if React components are used as islands

### Key Differences from Next.js

This is the critical reference table. Every difference that could lead to incorrect code generation:

| Feature | Next.js | React/Vite | Impact |
|---------|---------|------------|--------|
| Rendering | Server + Client components | Client-only (all components) | No `'use client'` directive needed |
| Routing | File-based (app/ directory) | Library-based (React Router / TanStack) | Must install and configure router |
| Image optimization | `next/image` with automatic optimization | Standard `<img>` with `loading="lazy"` | No automatic WebP/AVIF conversion |
| Font loading | `next/font` with automatic optimization | CSS `@font-face` or Fontsource packages | Must handle preloading manually |
| Link component | `next/link` with prefetching | Router-specific `<Link>` component | No automatic prefetching |
| API routes | `app/api/` directory | None (external API or separate server) | Backend is always separate |
| Metadata/SEO | `export const metadata` or `generateMetadata()` | Manual `<Helmet>` or react-helmet-async | Must manage `<head>` manually |
| Dark mode FOUC | Complex (SSR hydration mismatch risk) | Simple (inline script in `index.html`) | Easier dark mode implementation |
| CSS setup | `@tailwindcss/postcss` in `postcss.config.mjs` | `@tailwindcss/vite` plugin in `vite.config.ts` | Different Tailwind integration |
| Code splitting | Automatic per-route | Manual `React.lazy()` + `Suspense` | Must configure splitting explicitly |
| Environment variables | `NEXT_PUBLIC_*` prefix | `VITE_*` prefix | Different naming convention |

### Decision Tree: Routing

- **React Router v7** (most common) -- Standard choice for SPAs. Familiar API, large ecosystem, `createBrowserRouter` for data loading.
- **TanStack Router** (type-safe) -- Full TypeScript inference for route params and search params. Better DX for complex routing.
- **Simple app with 2-3 views** -- React Router with basic `<Routes>` and `<Route>` components.
- **Complex app with nested layouts, data loading** -- React Router v7 with `createBrowserRouter` + loaders, or TanStack Router.

### Decision Tree: Font Loading

- **Self-hosted fonts (recommended)** -- CSS `@font-face` in `index.css`, font files in `public/fonts/`. Preload in `index.html`.
- **Fontsource packages** -- `npm install @fontsource-variable/inter`. Import in `main.tsx`. Good for variable fonts.
- **Google Fonts CDN** -- Only as fallback. Adds external dependency and potential FOUT. Preconnect if used.

### Pipeline Connection

- **Referenced by:** builder, orchestrator during `/gen:execute`
- **Consumed at:** plan (framework-specific planning), execute (code generation)
- **Loaded when:** Framework detection identifies React/Vite project

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Vite Project Structure

```
project-root/
  index.html               # Entry HTML -- FOUC prevention script, font preloads
  vite.config.ts            # Vite config with @tailwindcss/vite
  src/
    main.tsx                # React root render + router mount
    App.tsx                 # Root component with providers (theme, router)
    index.css               # @import "tailwindcss", @theme block, DNA tokens
    routes/
      Home.tsx              # Landing page
      About.tsx             # About page
      Blog.tsx              # Blog listing
      BlogPost.tsx          # Blog detail (dynamic route)
      NotFound.tsx          # 404 catch-all
    components/
      Navigation.tsx        # Shared nav component
      Footer.tsx            # Shared footer
      ThemeToggle.tsx       # Dark/light mode toggle
      PageTransition.tsx    # Route transition wrapper
    lib/
      theme.ts              # Theme context, hook, and localStorage logic
      router.tsx            # Router configuration (centralized)
    hooks/
      useMediaQuery.ts      # Responsive hook
      useReducedMotion.ts   # Accessibility motion preference
  public/
    fonts/                  # Self-hosted font files
    favicon.svg             # Favicon
```

#### Pattern 2: Vite Config with Tailwind v4

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Handles all CSS processing -- no postcss.config needed
  ],
  build: {
    rollupOptions: {
      output: {
        // Code-split vendor chunks for better caching
        manualChunks: {
          'motion': ['motion/react'],
          'router': ['react-router'],
        },
      },
    },
  },
})
```

No `postcss.config.mjs` or `postcss.config.js` needed. The `@tailwindcss/vite` plugin handles everything that PostCSS would.

#### Pattern 3: Entry CSS with DNA Tokens

```css
/* src/index.css */
@import "tailwindcss";

/* Class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Reset Tailwind defaults -- project owns full palette */
  --color-*: initial;

  /* DNA light palette (default) */
  --color-bg: #faf9f6;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-border: rgba(0,0,0,0.06);
  --color-primary: #ff6f3c;
  --color-secondary: #00c9a0;
  --color-accent: #6366f1;
  --color-muted: #71717a;
  --color-glow: rgba(255,111,60,0.15);
  --color-tension: #ff0044;
  --color-highlight: #ffd700;
  --color-signature: #ff6f3c;

  /* Typography from DNA */
  --font-display: "Cabinet Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;

  /* Spacing, border radius, shadows from DNA */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-outer: 1rem;
}

/* Dark palette overrides -- independently designed */
.dark {
  --color-bg: #0a0a0f;
  --color-surface: #111115;
  --color-text: #f0ece6;
  --color-border: rgba(255,255,255,0.06);
  --color-primary: #ff8a5c;
  --color-secondary: #00e5b0;
  --color-accent: #818cf8;
  --color-muted: #a1a1aa;
  --color-glow: rgba(255,138,92,0.3);
  --color-tension: #ff3366;
  --color-highlight: #ffd700;
  --color-signature: #ff8a5c;
}
```

#### Pattern 4: Client-Side Routing with React Router v7

```tsx
// src/lib/router.tsx
import { createBrowserRouter } from 'react-router'
import { lazy, Suspense } from 'react'
import App from '../App'

// Route-based code splitting with React.lazy
const Home = lazy(() => import('../routes/Home'))
const About = lazy(() => import('../routes/About'))
const Blog = lazy(() => import('../routes/Blog'))
const BlogPost = lazy(() => import('../routes/BlogPost'))
const NotFound = lazy(() => import('../routes/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<RouteLoading />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<RouteLoading />}>
            <Blog />
          </Suspense>
        ),
      },
      {
        path: 'blog/:slug',
        element: (
          <Suspense fallback={<RouteLoading />}>
            <BlogPost />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<RouteLoading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
])

function RouteLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}
```

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './lib/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

```tsx
// src/App.tsx
import { Outlet } from 'react-router'
import { ThemeProvider } from './lib/theme'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-bg text-text">
        <Navigation />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
```

#### Pattern 5: Font Loading Without next/font

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- FOUC prevention: runs before any rendering -->
  <script>
    (function() {
      var theme = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>

  <!-- Font preloading: critical fonts only -->
  <link rel="preload" href="/fonts/CabinetGrotesk-Variable.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />

  <title>Project Name</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

```css
/* @font-face declarations in index.css (before @import "tailwindcss" or in a separate fonts.css) */
@font-face {
  font-family: "Cabinet Grotesk";
  src: url("/fonts/CabinetGrotesk-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

@font-face {
  font-family: "Inter Variable";
  src: url("/fonts/Inter-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

@font-face {
  font-family: "JetBrains Mono Variable";
  src: url("/fonts/JetBrainsMono-Variable.woff2") format("woff2");
  font-weight: 100 800;
  font-display: swap;
}
```

Alternative: Fontsource packages for variable fonts:

```tsx
// src/main.tsx
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
// Then reference in @theme: --font-body: "Inter Variable", sans-serif;
```

#### Pattern 6: SPA Dark Mode (Simpler Than SSR)

```tsx
// src/lib/theme.ts
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Read from localStorage (already applied by index.html inline script)
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  const resolvedTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')

    if (theme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', theme)
    }
  }, [theme, resolvedTheme])

  // Listen for system preference changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setThemeState('system') // Trigger re-render
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

Key advantage over SSR frameworks: no hydration mismatch risk. The inline `<script>` in `index.html` applies the correct class before React mounts. No need for `suppressHydrationWarning`, no `next-themes` library required.

#### Pattern 7: Image Handling Without next/image

```tsx
// Standard <img> with lazy loading and aspect ratio
function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      // width + height prevent CLS (layout shift)
      // loading="lazy" defers off-screen images
      // decoding="async" prevents blocking main thread
    />
  )
}

// For hero/above-fold images: no lazy loading, add fetchpriority
function HeroImage({ src, alt, width, height, className }: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className={className}
    />
  )
}
```

For responsive images with `srcset`:

```tsx
<img
  src="/images/hero-1440.webp"
  srcSet="/images/hero-640.webp 640w, /images/hero-1024.webp 1024w, /images/hero-1440.webp 1440w"
  sizes="100vw"
  alt="Hero image"
  width={1440}
  height={810}
  loading="eager"
  fetchPriority="high"
/>
```

Note: Unlike Next.js, there is no automatic WebP/AVIF conversion or responsive image generation. Pre-optimize images at build time or serve from an image CDN (Cloudinary, imgix, etc.).

#### Pattern 8: Environment Variables

```typescript
// Vite uses VITE_ prefix (not NEXT_PUBLIC_)
const apiUrl = import.meta.env.VITE_API_URL
const analyticsId = import.meta.env.VITE_ANALYTICS_ID

// Type declarations for environment variables
// src/env.d.ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ANALYTICS_ID: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Reference Sites

- **Linear** (linear.app) -- React/Vite SPA with award-worthy design. Smooth client-side transitions, dark mode with glow effects, custom cursor interactions. Demonstrates that SPAs can match SSR sites in design quality.
- **Raycast** (raycast.com) -- Desktop-first design language applied to web presence. Minimal, fast, beautiful dark mode with signature glow. Shows React SPA design polish.
- **Vercel Dashboard** (vercel.com/dashboard) -- React SPA behind auth. Clean DNA-consistent design, smooth route transitions, real-time data updates. Proves SPAs excel for authenticated app experiences.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in React/Vite |
|-----------|-------------------|
| All 12 color tokens | Identical to Next.js -- defined in `@theme` block in `index.css` |
| Display/body/mono fonts | Loaded via CSS `@font-face` or Fontsource (NOT next/font) |
| Motion tokens | `:root` custom properties, same as all frameworks |
| Spacing/radius tokens | `@theme` block, same as all frameworks |

The DNA token system is framework-agnostic. The only difference is HOW tokens are delivered to CSS:
- Next.js: `@tailwindcss/postcss` in `postcss.config.mjs`
- React/Vite: `@tailwindcss/vite` plugin in `vite.config.ts`
- Output is identical: CSS custom properties consumed by Tailwind utilities

### Archetype Variants

No structural difference from Next.js. The same archetype drives the same visual output regardless of framework. The archetype determines:
- Color palette (DNA tokens are identical)
- Typography choices (font loading differs, output is the same)
- Motion patterns (same libraries, same code)
- Creative tension (same patterns)

The only archetype interaction unique to React/Vite is that FOUC prevention for dark mode is simpler (inline script in `index.html` with no SSR mismatch concern), which may enable slightly more sophisticated initial-render transitions.

### Pipeline Stage

- **Input from:** Design DNA (tokens), planner (plans), orchestrator (spawn prompts)
- **Output to:** Built components, routes, and styles -- same deliverable format as Next.js builds

### Related Skills

- **nextjs-patterns** -- Shared React patterns; this skill documents ONLY what differs for Vite SPAs
- **tailwind-system** -- `@tailwindcss/vite` plugin setup; `@theme` block is identical across frameworks
- **dark-light-mode** -- SPA version is simpler (Pattern 6 above); archetype transitions are the same
- **responsive-design** -- Identical responsive patterns; container queries and media queries work the same
- **accessibility** -- Identical accessibility patterns; ARIA, keyboard, focus are framework-agnostic
- **desktop-patterns** -- Desktop apps (Tauri/Electron) typically use React/Vite as the web layer; load both skills together
- **cinematic-motion** -- Same motion library imports (`motion/react`, GSAP) and patterns
- **page-transitions** -- Route transitions use React Router's `useLocation` + `AnimatePresence` instead of Next.js page transitions

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Using next/image in a Vite Project

**What goes wrong:** Builder generates `import Image from 'next/image'` in a React/Vite project. The import fails at build time because `next/image` does not exist outside Next.js.
**Instead:** Use standard `<img>` with `loading="lazy"`, `decoding="async"`, explicit `width`/`height` attributes, and `srcset` for responsive images. Pre-optimize images or use an image CDN.

### Anti-Pattern 2: Using next/font in a Vite Project

**What goes wrong:** Builder generates `import { Inter } from 'next/font/google'` in a React/Vite project. The import does not exist.
**Instead:** Use CSS `@font-face` declarations with self-hosted woff2 files and `font-display: swap`. Preload critical fonts in `index.html`. Alternatively, use Fontsource packages (`@fontsource-variable/inter`).

### Anti-Pattern 3: Adding 'use client' Directives

**What goes wrong:** Builder adds `'use client'` to components in a Vite project. While harmless (it is ignored), it signals confusion about the rendering model and may lead to incorrect architectural decisions like trying to use server actions.
**Instead:** Never add `'use client'` in React/Vite projects. All components are client components. There is no server component boundary.

### Anti-Pattern 4: Creating PostCSS Config for Tailwind

**What goes wrong:** Builder creates `postcss.config.mjs` with `@tailwindcss/postcss` for a Vite project. This adds unnecessary configuration and may conflict with `@tailwindcss/vite`.
**Instead:** Use `@tailwindcss/vite` in `vite.config.ts`. No PostCSS configuration is needed. The Vite plugin handles all CSS processing.

### Anti-Pattern 5: Server-Side Patterns in Client Code

**What goes wrong:** Builder uses patterns that assume server execution: `cookies()`, `headers()`, server actions with `'use server'`, `generateMetadata()`, API route handlers.
**Instead:** All data fetching uses client-side `fetch()`, `useSWR`, `TanStack Query`, or React Router loaders. Metadata is managed with `react-helmet-async` or manual `document.title` updates. Authentication uses client-side tokens (JWT/session cookies read by the browser).

### Anti-Pattern 6: No Code Splitting

**What goes wrong:** All routes imported eagerly in a single bundle. SPA initial load becomes 500KB+ as the app grows.
**Instead:** Use `React.lazy()` + `Suspense` for every route component. Configure manual chunks in `vite.config.ts` for vendor libraries. This is automatic in Next.js but requires explicit setup in Vite.

### Anti-Pattern 7: NEXT_PUBLIC_ Environment Variables

**What goes wrong:** Builder uses `process.env.NEXT_PUBLIC_API_URL` in Vite code. The variable is undefined because Vite uses a different prefix and access pattern.
**Instead:** Use `import.meta.env.VITE_API_URL`. Prefix all client-exposed variables with `VITE_`. Declare types in `src/env.d.ts` for TypeScript support.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Initial bundle (JS) | - | 200 | KB (gzipped) | SOFT -- SPA bundles larger than SSR but must stay reasonable |
| Route chunk size | - | 80 | KB (gzipped) | SOFT -- lazy-loaded route chunks via React.lazy |
| Code-split routes | all | all | routes | HARD -- every route must use React.lazy + Suspense |
| Font loading strategy | - | - | self-hosted | HARD -- use @font-face or Fontsource, never next/font |
| Font preloads | 1 | 3 | files | SOFT -- preload display font in index.html |
| FOUC prevention script | 1 | 1 | inline script | HARD -- dark mode class must be set before render |
| Environment variable prefix | - | - | VITE_ | HARD -- never use NEXT_PUBLIC_ or process.env in client code |
| Tailwind integration | - | - | @tailwindcss/vite | HARD -- use Vite plugin, never PostCSS config |
