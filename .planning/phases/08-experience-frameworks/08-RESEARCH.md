# Phase 8: Experience & Frameworks - Research

**Researched:** 2026-02-24
**Domain:** Responsive design, accessibility (WCAG 2.1 AA), multi-page architecture, dark/light mode, framework support (Next.js 16, Astro 5/6, React/Vite, Tauri v2, Electron), Tailwind v4 rewrite, and full 4-layer skill rewrites
**Confidence:** HIGH (most topics verified via official docs and release notes)

## Summary

Phase 8 produces 8 plans covering responsive design, accessibility, multi-page architecture, dark/light mode, five framework skills, a Tailwind v4 rewrite, and remaining skill rewrites to the 4-layer format with current library versions. These are all SKILL.md markdown knowledge bases for the Claude Code plugin, not application code.

The technology landscape has shifted significantly since the v6.1.0 skills were written. Next.js 16 replaces middleware.ts with proxy.ts, bundles React 19.2 (with View Transitions, Activity component, useEffectEvent), makes Turbopack the default bundler, and introduces Cache Components with the "use cache" directive. Astro 5 introduced the Content Layer API and Server Islands, while Astro 6 (in beta, stable release imminent) drops legacy content collections, removes the deprecated `<ViewTransitions />` component (replaced by `ClientRouter`), requires Node 22+, and adds live content collections. Tailwind CSS v4 is CSS-first with `@theme` directives, built-in container queries (no plugin needed), and `@custom-variant` for dark mode configuration instead of `tailwind.config.js`. The CSS `light-dark()` function is now available in all modern browsers for simplified theme value declaration. Tauri v2 and Electron both have well-documented CSS patterns for desktop-aware design (custom titlebars, drag regions, window chrome integration).

The responsive design skill must enforce the hybrid typography approach (clamp for body, breakpoint steps for display), mandate container queries for component-level responsiveness (Tailwind v4 `@container` is built-in), and require dramatic layout recomposition between breakpoints. The accessibility skill must bake WCAG 2.1 AA into every pattern with archetype-aware reduced-motion alternatives and styled focus indicators. The dark/light mode skill must produce both palettes from DNA upfront, use Tailwind v4's `@custom-variant dark` pattern, and define signature transition animations per archetype.

**Primary recommendation:** Build each skill in the 4-layer format with framework-specific code examples verified against current APIs (Next.js 16, Astro 5/6, Tailwind v4), using the 12-token DNA color system for both light and dark palettes. Container queries are the default for component responsiveness; media queries for page-level layout. The Tailwind v4 skill rewrite is foundational and should be completed before other skills reference Tailwind patterns.

## Standard Stack

This phase produces markdown skill files. The "stack" is the technologies these skills will document and recommend.

### Core Technologies (Skills Will Reference)
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Tailwind CSS | v4.x | CSS-first design tokens, container queries, dark mode | `@theme` directive, built-in `@container`, `@custom-variant dark` |
| Next.js | 16.x | React framework (App Router + Pages Router) | Current stable. React 19.2, Turbopack default, proxy.ts, Cache Components |
| Astro | 5.x (6.x imminent) | Static-first framework with Islands | Content Layer API, Server Islands, View Transitions (stable) |
| React + Vite | React 19.x + Vite 6.x | SPA/client-side framework | `@tailwindcss/vite` plugin, fast HMR, TypeScript-first |
| Tauri | v2.x | Desktop app framework (Rust + web) | Custom titlebar via `data-tauri-drag-region`, lightweight |
| Electron | Latest | Desktop app framework (Node + Chromium) | `titleBarOverlay`, `app-region: drag` CSS, mature ecosystem |
| Motion | 12.x (`motion/react`) | React animation library | Standard for component/page transitions, dark mode transitions |
| GSAP | 3.14.x | Complex animation | All plugins free, SplitText for text reveal |
| axe-core | 4.x | Accessibility testing engine | Industry standard, 57%+ automated WCAG detection |

### Supporting Technologies
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| CSS `light-dark()` | Native (Baseline 2024) | Inline light/dark value | Simplifies CSS custom property declarations for themes |
| CSS `prefers-color-scheme` | Native | System preference detection | Default dark mode trigger |
| CSS Container Queries | Native (Baseline 2023) | Component-level responsive | All component patterns, Tailwind v4 `@container` built-in |
| CSS `clamp()` | Native | Fluid typography | Body text scaling (not display text) |
| eslint-plugin-jsx-a11y | Latest | JSX accessibility linting | Development-time a11y feedback |
| next-themes | Latest | Next.js theme management | Dark/light toggle with flash prevention |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 `@custom-variant dark` | CSS `light-dark()` function | light-dark() is cleaner CSS but only handles colors, not layout/spacing changes |
| next-themes | Custom React Context | next-themes handles FOUC prevention, localStorage, system preference -- not worth reimplementing |
| axe-core | Pa11y | axe-core has better React integration and fewer false positives |
| CSS Container Queries | Media Queries | Media queries for page layout; container queries for reusable components |

## Architecture Patterns

### Recommended Skill Structure for Phase 8

Each skill follows the 4-layer format established in Phase 1:

```
skills/
  responsive-design/SKILL.md        # 08-01: Mobile-first, 375px, clamp(), container queries
  accessibility/SKILL.md             # 08-02: WCAG AA, ARIA, keyboard, focus, motion-safe
  multi-page-architecture/SKILL.md   # 08-03: Site DNA, page templates, shared components
  dark-light-mode/SKILL.md           # 08-04: Archetype-aware themes, transitions
  nextjs-patterns/SKILL.md           # 08-05: App Router + Pages Router (replaces nextjs-app-router)
  astro-patterns/SKILL.md            # 08-05: Islands, View Transitions (replaces existing)
  react-vite-patterns/SKILL.md       # 08-06: SPA patterns (new)
  desktop-patterns/SKILL.md          # 08-06: Tauri + Electron (new)
  tailwind-system/SKILL.md           # 08-07: Tailwind v4 @theme, DNA mapping (replaces tailwind-patterns)
```

Estimated sizes:
| Skill | Target Lines | Content |
|-------|-------------|---------|
| responsive-design | 400-500 | Breakpoint system, clamp() formulas, container queries, recomposition patterns |
| accessibility | 500-600 | WCAG AA checklist, ARIA patterns, keyboard, focus, reduced-motion per archetype |
| multi-page-architecture | 400-500 | Site DNA, 6 page templates, shared components, per-page emotional arcs |
| dark-light-mode | 500-600 | Dual palettes, token mapping, transition animations, archetype-specific |
| nextjs-patterns | 500-600 | App Router + Pages Router, proxy.ts, RSC patterns, font loading |
| astro-patterns | 400-500 | Islands strategy, Content Layer, View Transitions, SSR/SSG hybrid |
| react-vite-patterns | 300-400 | Vite plugin setup, client-side patterns, routing |
| desktop-patterns | 400-500 | Tauri titlebar, Electron chrome, drag regions, multi-window, system tray |
| tailwind-system | 500-600 | @theme DNA mapping, @custom-variant dark, @container, animation presets |

### Pattern 1: Responsive Design -- Hybrid Typography System

**What:** Body text uses `clamp()` for smooth fluid scaling; display/heading text uses breakpoint steps for dramatic size changes that match layout recomposition.
**When to use:** Responsive Design skill, every framework skill when showing typography.
**Why:** User decision in CONTEXT.md: "body text uses clamp() for smooth fluid scaling, display/heading type uses breakpoint steps for dramatic size changes matching layout recomposition."

```css
/* Body text: fluid via clamp -- scales smoothly */
/* Formula: clamp(min, preferred, max) where preferred = rem + vw */
body {
  font-size: clamp(1rem, 0.875rem + 0.5vw, 1.125rem);
  /* 16px at 375px -> 18px at 1440px, smooth */
}

/* Display text: stepped via breakpoints -- dramatic jumps */
.heading-display {
  font-size: 2.5rem;      /* Mobile: 40px */
  line-height: 0.9;
  letter-spacing: -0.03em;
}
@media (min-width: 768px) {
  .heading-display {
    font-size: 4.5rem;    /* Tablet: 72px -- dramatic jump */
  }
}
@media (min-width: 1024px) {
  .heading-display {
    font-size: 6rem;      /* Desktop: 96px -- another jump */
  }
}
@media (min-width: 1440px) {
  .heading-display {
    font-size: 8rem;      /* Large: 128px */
  }
}
```

**Accessibility note:** clamp() uses `rem + vw` combination (not `vw` alone) so text responds to browser zoom. Pure `vw` units violate WCAG 1.4.4 Resize Text.

**Confidence: HIGH** -- Based on web.dev fluid typography guide, WCAG requirements, and user decision.

### Pattern 2: Container Queries as Default for Components

**What:** All reusable components use container queries (`@container`) for responsive behavior. Page-level layout uses media queries.
**When to use:** Responsive Design skill, all component patterns.
**Why:** Tailwind v4 has built-in container query support (no plugin needed). Container queries make components truly portable across different layout contexts.

```html
<!-- Parent: mark as query container -->
<div class="@container">
  <!-- Child: responds to container width, not viewport -->
  <div class="flex flex-col @md:flex-row @lg:grid @lg:grid-cols-3 gap-4">
    <!-- Component layout adapts to where it's placed -->
  </div>
</div>

<!-- Named containers for nested scenarios -->
<div class="@container/card">
  <div class="@sm/card:flex-row flex flex-col">
    <!-- Responds to card container specifically -->
  </div>
</div>
```

**Browser support:** Chrome 105+, Firefox 110+, Safari 16+ (Baseline 2023, 91%+ global support).

**Decision tree:**
- Reusable component (card, widget, section content) -> `@container`
- Page-level layout (columns, sidebar, full-width sections) -> Media queries
- Navigation (changes structure at breakpoints) -> Media queries
- Within a component, nested layout changes -> `@container`

**Confidence: HIGH** -- Tailwind v4 official docs confirm built-in `@container` support. Browser support verified via Can I Use.

### Pattern 3: Tailwind v4 Dark Mode Architecture

**What:** DNA generates both light and dark palettes upfront. Tailwind v4 uses `@custom-variant dark` with a class-based selector. Both themes are independently designed, not derived from each other.
**When to use:** Dark/Light Mode skill, Design System Scaffold skill.
**Why:** User decision: "Equal parity -- both modes independently award-worthy, neither derived from the other."

```css
@import "tailwindcss";

/* Class-based dark mode (toggled by .dark class on <html>) */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Light mode tokens (default) */
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
}

/* Dark mode overrides -- separately designed, not inverted */
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

Usage in HTML remains the same:
```html
<div class="bg-bg text-text border-border">
  <!-- Automatically switches based on .dark class -->
</div>
```

**FOUC prevention (inline in `<head>`):**
```html
<script>
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
       window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
</script>
```

**Confidence: HIGH** -- Verified from Tailwind CSS v4 official dark mode docs.

### Pattern 4: Framework Detection and Adaptation

**What:** Auto-detect the target framework from project files, confirm with user, store in DESIGN-DNA.md.
**When to use:** Framework skills, during `/gen:start-design`.
**Why:** User decision: "auto-detect from project files, then confirm with user during discovery."

```markdown
### Framework Detection Rules

| Signal | Framework | Confidence |
|--------|-----------|------------|
| `next.config.ts` or `next.config.js` | Next.js | HIGH |
| `astro.config.mjs` or `astro.config.ts` | Astro | HIGH |
| `tauri.conf.json` or `src-tauri/` | Tauri | HIGH |
| `electron-builder.json` or `main.js` with electron | Electron | HIGH |
| `vite.config.ts` + no framework signal | React/Vite | MEDIUM |
| `package.json` has `next` dependency | Next.js | MEDIUM |
| `package.json` has `astro` dependency | Astro | MEDIUM |

### Next.js Sub-Detection

| Signal | Router | Confidence |
|--------|--------|------------|
| `app/` directory with `layout.tsx` | App Router | HIGH |
| `pages/` directory with `_app.tsx` | Pages Router | HIGH |
| Both `app/` and `pages/` | Hybrid (both) | HIGH |
| Only `package.json` next dependency | Ask user | LOW |
```

**Confidence: HIGH** -- Based on standard framework file conventions.

### Pattern 5: Desktop-Aware Design Patterns

**What:** Desktop apps (Tauri, Electron) need design patterns for window chrome, drag regions, system integration.
**When to use:** Desktop Patterns skill.
**Why:** User decision: "full desktop-aware design skills -- window chrome, system tray, native menus, titlebar areas, drag regions."

**Tauri v2 custom titlebar:**
```html
<div data-tauri-drag-region class="h-8 flex items-center justify-between bg-surface px-3">
  <span class="text-xs font-medium text-muted">App Name</span>
  <div class="flex gap-1">
    <!-- Buttons do NOT need data-tauri-drag-region -->
    <button onclick="window.__TAURI__.window.appWindow.minimize()">
      <MinusIcon class="h-3 w-3" />
    </button>
    <button onclick="window.__TAURI__.window.appWindow.toggleMaximize()">
      <SquareIcon class="h-3 w-3" />
    </button>
    <button onclick="window.__TAURI__.window.appWindow.close()">
      <XIcon class="h-3 w-3" />
    </button>
  </div>
</div>
```

**Electron custom titlebar:**
```css
.titlebar {
  app-region: drag;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}
.titlebar button {
  app-region: no-drag; /* Re-enable clicks */
}
```

**Electron BrowserWindow config:**
```javascript
const win = new BrowserWindow({
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#0a0a0f',       // Matches DNA bg color
    symbolColor: '#f0ece6', // Matches DNA text color
    height: 40,
  },
})
```

**Key desktop design considerations:**
- Account for titlebar height in page layout (add top padding)
- macOS traffic lights position differs from Windows/Linux controls
- System tray integration for background functionality
- Multi-window patterns (settings, preferences, floating panels)
- Drag regions must exclude interactive elements explicitly

**Confidence: HIGH** -- Verified from Tauri v2 and Electron official documentation.

### Pattern 6: Accessibility-First Component Templates

**What:** Every component template includes ARIA attributes, keyboard navigation, focus management, and reduced-motion variants as standard, not as add-ons.
**When to use:** Accessibility skill, referenced by all component-producing skills.
**Why:** User decision: "Strict AA everywhere, no exceptions. Every component, every interaction, every state."

```tsx
// Accessible interactive card with archetype-styled focus
function FeatureCard({ title, description, href, archetype }: Props) {
  return (
    <a
      href={href}
      className={cn(
        "group block rounded-outer p-6 bg-surface border border-border",
        "transition-all duration-default ease-default",
        "hover:border-primary/30 hover:shadow-elevated",
        // Focus: archetype-styled indicators
        "focus-visible:outline-none focus-visible:ring-2",
        focusRingClass[archetype], // e.g., "focus-visible:ring-primary" for Swiss
        "motion-safe:hover:-translate-y-1",
        "motion-reduce:hover:shadow-elevated" // No transform, still has feedback
      )}
      // No tabIndex needed -- <a> with href is naturally focusable
    >
      <h3 className="font-display text-lg font-semibold text-text">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        {description}
      </p>
      <span className="sr-only">Read more about {title}</span>
    </a>
  )
}

// Focus ring styles per archetype
const focusRingClass: Record<string, string> = {
  'neon-noir':     'focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  'swiss':         'focus-visible:ring-text focus-visible:ring-1',
  'brutalist':     'focus-visible:ring-4 focus-visible:ring-text',
  'ethereal':      'focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-bg',
  // ... etc for all 19 archetypes
}
```

**Confidence: HIGH** -- WCAG 2.1 patterns are well-established. Archetype-styled focus is the creative extension.

### Anti-Patterns to Avoid

- **Pure `vw` for font size:** Violates WCAG 1.4.4 Resize Text. Always use `clamp(rem, rem + vw, rem)` to allow browser zoom scaling.
- **`dark:` without equal design effort:** "Inverting" a light palette produces washed-out dark modes. Each mode needs independent design.
- **Tailwind v3 `tailwind.config.ts` patterns:** v6.1.0 skills use `tailwind.config.ts` for everything. Tailwind v4 uses `@theme` CSS blocks. Never generate `tailwind.config.ts` for token/color/font definitions.
- **`middleware.ts` in Next.js 16:** Deprecated. Use `proxy.ts` with `export default function proxy()`.
- **`framer-motion` imports:** Use `motion/react`. The `framer-motion` package still works but is deprecated.
- **`<ViewTransitions />` in Astro 6:** Deprecated component removed in Astro 6. Use `<ClientRouter />` instead (Astro 5 already supports this name).
- **`Astro.glob()` in Astro 6:** Removed. Use Content Layer API with `getCollection()`.
- **Desktop-blind web design:** Treating Tauri/Electron like a browser. Must account for titlebar space, drag regions, and native integration.
- **axe-core as the only accessibility test:** Catches ~57% of issues. Must also include manual keyboard testing patterns, screen reader hints, and focus management checks.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode toggle + persistence | Custom localStorage + React state | next-themes (Next.js) / custom `<head>` script | Handles FOUC, system preference, persistence, SSR |
| Container-responsive components | Custom ResizeObserver | CSS `@container` + Tailwind `@container` | Zero JS, built into Tailwind v4, Baseline 2023 |
| Fluid typography scaling | JS-based font scaling | CSS `clamp(rem, rem + vw, rem)` | Pure CSS, respects zoom, no runtime cost |
| Accessibility linting | Manual review | eslint-plugin-jsx-a11y + axe-core | Catches majority of issues during development |
| Focus trap in modals | Custom keyboard listener | Radix Dialog / headless UI with `inert` attribute | `inert` is Baseline 2023, handles edge cases |
| Desktop window controls | Custom absolute positioning | `data-tauri-drag-region` (Tauri) / `app-region: drag` (Electron) | Native integration, platform-aware |
| Skip links | Custom implementation | Standard pattern with `sr-only focus-within:not-sr-only` | Well-established, Tailwind has `sr-only` utility |
| Theme color meta tags | Manual `<meta>` management | Tailwind v4 auto-manages theme-color meta tags | Built into Tailwind dark mode system |

**Key insight:** Tailwind v4 has absorbed many things that previously required plugins or custom code: container queries, dark mode custom variants, theme color meta tags, and CSS-first configuration. The skills must stop recommending v3-era workarounds.

## Common Pitfalls

### Pitfall 1: Tailwind v3 Patterns in Skills
**What goes wrong:** Skills generate `tailwind.config.ts` with JS theme extensions, use `@tailwind base; @tailwind components; @tailwind utilities;` directives, or reference the `tailwindcss-container-queries` plugin.
**Why it happens:** v6.1.0 was built for Tailwind v3. Many developers and tutorials still show v3 patterns.
**How to avoid:** The Tailwind v4 skill rewrite must be completed FIRST and used as the reference for all other skills. Key differences:

| v3 (old) | v4 (current) | Impact |
|----------|-------------|--------|
| `tailwind.config.ts` | `@theme { }` in CSS | No JS config for tokens |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Single import |
| `darkMode: 'class'` in config | `@custom-variant dark (&:where(.dark, .dark *))` in CSS | CSS-first |
| `@tailwindcss/container-queries` plugin | Built-in `@container` | No plugin needed |
| `theme.extend.colors` in JS | `--color-*: value` in `@theme` | CSS variables |
| Separate PostCSS + Autoprefixer | Built into Tailwind v4 | Simpler setup |

**Warning signs:** Any skill referencing `tailwind.config.ts` for colors, fonts, or basic theme configuration.

**Confidence: HIGH** -- Verified from Tailwind CSS v4 official docs and migration guide.

### Pitfall 2: Next.js 16 Breaking Changes
**What goes wrong:** Skills reference deprecated Next.js APIs (middleware.ts, sync params, experimental.ppr).
**Why it happens:** v6.1.0 was written for Next.js 14/15. Next.js 16 has significant breaking changes.
**How to avoid:** The Next.js skill must document:

| Old (Next.js 14/15) | New (Next.js 16) |
|---------------------|------------------|
| `middleware.ts` | `proxy.ts` with `export default function proxy()` |
| `params.slug` (sync) | `const { slug } = await params` (async) |
| `cookies()` (sync) | `const cookieStore = await cookies()` (async) |
| `experimental: { ppr: true }` | `cacheComponents: true` |
| Webpack (default) | Turbopack (default), opt-out with `--webpack` |
| `<ViewTransition>` from React | Still experimental, React 19.2 canary feature |
| Parallel routes implicit default | Explicit `default.js` required for all slots |

**Warning signs:** Any code example using sync `params`, `cookies()`, or `middleware.ts`.

**Confidence: HIGH** -- Verified from Next.js 16 official blog post.

### Pitfall 3: Astro 6 Deprecation Landmines
**What goes wrong:** Skills reference APIs removed in Astro 6 (imminent stable release).
**Why it happens:** Astro 5 is current stable, Astro 6 beta is active. Skills targeting "current" Astro may break within weeks.
**How to avoid:** Write Astro skill to work with BOTH Astro 5 and 6. Key changes:

| Astro 5 | Astro 6 | Action |
|---------|---------|--------|
| `<ViewTransitions />` component | Removed -- use `<ClientRouter />` | Use `<ClientRouter />` (works in both 5 and 6) |
| `Astro.glob()` | Removed | Use `getCollection()` from Content Layer API |
| Legacy content collections | Removed | Use Content Layer API loaders |
| Node 18/20 | Node 22+ minimum | Note version requirement |
| Zod 3 | Zod 4 required | Update schema imports |

**Recommendation:** Write Astro skill patterns that work with Astro 5.x AND are forward-compatible with Astro 6. Use `<ClientRouter />` instead of `<ViewTransitions />`. Use Content Layer API, not legacy collections.

**Confidence: HIGH** -- Verified from Astro 6 Beta blog post.

### Pitfall 4: Accessibility as Afterthought
**What goes wrong:** Skills add a11y patterns as a separate section rather than baking them into every component template.
**Why it happens:** Accessibility is often treated as a checkbox rather than a design constraint.
**How to avoid:** Every component pattern in every skill must include:
1. Semantic HTML (correct elements, not div-soup)
2. ARIA attributes where semantics are insufficient
3. Keyboard navigation (tab order, arrow keys for groups)
4. Focus indicators (archetype-styled, not generic)
5. `motion-safe:` / `motion-reduce:` variants on all animations
6. Color contrast ratios noted (4.5:1 body, 3:1 large text)
7. 44px minimum touch targets on mobile

The accessibility skill defines the STANDARDS. Other skills IMPLEMENT them. This means every other Phase 8 skill must reference the accessibility skill.

**Warning signs:** Component patterns without `aria-*` attributes, keyboard handling, or reduced-motion variants.

**Confidence: HIGH** -- WCAG 2.1 AA requirements are well-established.

### Pitfall 5: Dark Mode FOUC (Flash of Unstyled Content)
**What goes wrong:** Page loads in light mode then flashes to dark mode when JavaScript hydrates.
**Why it happens:** Server-rendered HTML doesn't know the user's preference until client JS runs.
**How to avoid:** Must include an inline `<script>` in `<head>` that runs before any rendering:

```html
<script>
  // Run BEFORE any rendering to prevent flash
  (function() {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

Framework-specific:
- **Next.js:** Use `next-themes` which handles this automatically via a `<script>` injection
- **Astro:** Inline script in base layout `<head>` with `is:inline` directive
- **React/Vite:** Inline script in `index.html` `<head>`

**Confidence: HIGH** -- Well-documented pattern, Tailwind v4 docs cover this.

### Pitfall 6: Desktop App Ignoring Platform Differences
**What goes wrong:** One-size-fits-all titlebar/chrome design that looks wrong on macOS vs Windows.
**Why it happens:** macOS has traffic lights (top-left), Windows has minimize/maximize/close (top-right).
**How to avoid:** The desktop patterns skill must document:

| Platform | Controls Position | Integration |
|----------|------------------|-------------|
| macOS | Top-left (traffic lights) | `titleBarStyle: 'hidden'` preserves native traffic lights |
| Windows | Top-right (min/max/close) | `titleBarOverlay` for native buttons, or custom buttons |
| Linux | Varies (usually top-right) | Follow Windows pattern |

Desktop skill must include platform detection:
```typescript
const isMacOS = navigator.platform.includes('Mac');
// Adjust layout: macOS needs left padding for traffic lights, Windows needs right padding
```

**Confidence: HIGH** -- Verified from Tauri v2 and Electron official docs.

### Pitfall 7: Multi-Page Architecture Without Site-Level DNA
**What goes wrong:** Each page designed independently, losing visual cohesion across the site.
**Why it happens:** v6.1.0 focuses on single-page design. Multi-page architecture needs additional design constraints.
**How to avoid:** The multi-page architecture skill must define:
1. **Site-level DNA extensions** -- consistent nav, footer, theme, transition style across all pages
2. **Page-type templates** -- each page type (landing, about, pricing, blog, docs, contact) has its own emotional arc and beat structure
3. **Shared components** -- nav, footer, sidebar, breadcrumb are designed once, reused everywhere
4. **Per-page emotional arcs** -- landing page has HOOK-BUILD-PEAK-CLOSE; about page has BUILD-PROOF-BREATHE; pricing has TENSION-PROOF-CLOSE

**Confidence: MEDIUM** -- Multi-page architecture for design systems is well-understood, but applying emotional arc theory per page type is Genorah-specific and needs creative judgment.

## Code Examples

Verified patterns from official sources for inclusion in skills.

### Tailwind v4: Complete Dark Mode Setup
```css
/* Source: Tailwind CSS v4 official docs */
@import "tailwindcss";

/* Class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Light palette (from DNA) */
  --color-bg: #faf9f6;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #71717a;
  --color-border: rgba(0,0,0,0.06);
  --color-primary: #ff6f3c;
  --color-secondary: #00c9a0;
  --color-accent: #6366f1;
  --color-muted: #a1a1aa;

  /* Shadow system -- light */
  --shadow-subtle: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-elevated: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-float: 0 8px 30px rgba(0,0,0,0.08);
}

/* Dark palette overrides */
.dark {
  --color-bg: #0a0a0f;
  --color-surface: #111115;
  --color-text: #f0ece6;
  --color-text-secondary: #a1a1aa;
  --color-border: rgba(255,255,255,0.06);
  --color-primary: #ff8a5c;
  --color-secondary: #00e5b0;
  --color-accent: #818cf8;
  --color-muted: #71717a;

  /* Shadow system -- dark (colored glow) */
  --shadow-subtle: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-elevated: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-float: 0 8px 30px rgba(0,0,0,0.5), 0 0 20px var(--color-glow);
}
```

### Tailwind v4: Container Queries
```html
<!-- Source: Tailwind CSS v4 official docs -->
<!-- Parent: containment context -->
<div class="@container">
  <!-- Responds to CONTAINER width, not viewport -->
  <div class="flex flex-col @sm:flex-row @lg:grid @lg:grid-cols-3 gap-4">
    <div class="@sm:w-1/3">Sidebar</div>
    <div class="@sm:flex-1">Content</div>
  </div>
</div>

<!-- Named containers (nested scenarios) -->
<div class="@container/sidebar">
  <nav class="@md/sidebar:flex-row flex flex-col">
    <!-- Items -->
  </nav>
</div>
```

### Responsive Typography: Hybrid Approach
```css
/* Body: fluid with clamp() -- rem + vw for zoom compliance */
:root {
  --text-body: clamp(1rem, 0.875rem + 0.5vw, 1.125rem);
  --text-body-large: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --text-caption: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
}

/* Display: stepped via breakpoints for dramatic recomposition */
:root {
  --text-display: 2.5rem;
  --text-heading-1: 2rem;
  --text-heading-2: 1.5rem;
}
@media (min-width: 768px) {
  :root {
    --text-display: 4.5rem;
    --text-heading-1: 3rem;
    --text-heading-2: 2rem;
  }
}
@media (min-width: 1024px) {
  :root {
    --text-display: 6rem;
    --text-heading-1: 4rem;
    --text-heading-2: 2.5rem;
  }
}
```

### Next.js 16: Updated Patterns
```tsx
// Source: Next.js 16 official blog

// proxy.ts (replaces middleware.ts)
import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  // Auth check, redirects, rewrites
  if (!request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

// Dynamic route with async params (REQUIRED in Next.js 16)
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // Must await
  const post = await getPost(slug)
  return <article>{post.content}</article>
}

// Async cookies/headers
import { cookies, headers } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()  // Must await
  const headersList = await headers()  // Must await
  // ...
}
```

### Astro 5/6: Forward-Compatible Patterns
```astro
---
// Source: Astro 5 docs + Astro 6 beta notes

// Layout with ClientRouter (NOT deprecated ViewTransitions)
import { ClientRouter } from 'astro:transitions';
---

<html lang="en">
<head>
  <ClientRouter />
</head>
<body>
  <nav transition:persist>
    <slot name="nav" />
  </nav>
  <main transition:animate="slide">
    <slot />
  </main>
</body>
</html>
```

```typescript
// Content Layer API (works in both Astro 5 and 6)
// src/content.config.ts (Astro 6) or src/content/config.ts (Astro 5)
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
  }),
})

export const collections = { blog }
```

### WCAG 2.1 AA: Archetype-Styled Focus Indicators
```css
/* Base focus indicator -- always visible, always accessible */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Archetype overrides for focus styling */

/* Neon Noir: glow ring */
[data-archetype="neon-noir"] :focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-glow), 0 0 12px var(--color-glow);
}

/* Swiss/International: minimal clean outline */
[data-archetype="swiss"] :focus-visible {
  outline: 1px solid var(--color-text);
  outline-offset: 3px;
}

/* Brutalist: thick border */
[data-archetype="brutalist"] :focus-visible {
  outline: 3px solid var(--color-text);
  outline-offset: 0;
}

/* Ethereal: soft ring with offset */
[data-archetype="ethereal"] :focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 999px; /* Match ethereal rounded aesthetic */
}
```

### Reduced Motion: Archetype-Aware Alternatives
```tsx
// Source: WCAG 2.1 + Genorah archetype system

// Each archetype defines what "reduced motion" means for its personality
const reducedMotionAlternatives: Record<string, ReducedMotionConfig> = {
  kinetic: {
    // Kinetic: replace fast motion with subtle fades
    entrance: 'opacity-only',  // No translateY, just fade
    duration: 400,             // Slow enough to be comfortable
    scroll: 'none',            // Remove scroll-driven entirely
  },
  ethereal: {
    // Ethereal: keep slow drifts, remove fast transitions
    entrance: 'slow-fade',     // opacity over 800ms
    duration: 800,
    scroll: 'very-slow-fade',  // Gentle opacity change only
  },
  'japanese-minimal': {
    // Already minimal: just remove the few animations that exist
    entrance: 'instant',       // No animation
    duration: 0,
    scroll: 'none',
  },
  brutalist: {
    // Brutalist: hard cuts are already the aesthetic
    entrance: 'instant',       // Matches brutalist instant-feel
    duration: 0,
    scroll: 'none',
  },
}
```

```css
/* CSS implementation */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Tailwind utility usage */
/* motion-safe: only applied when user has no reduced-motion preference */
/* motion-reduce: only applied when user prefers reduced motion */
.element {
  @apply motion-safe:animate-rise motion-reduce:opacity-100;
}
```

### Desktop: Tauri v2 Titlebar Component
```tsx
// Source: Tauri v2 docs + community patterns
'use client'
import { appWindow } from '@tauri-apps/api/window'

function TitleBar() {
  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-3 bg-surface border-b border-border select-none z-50"
    >
      {/* macOS: traffic lights are on left, so put title center/right */}
      <div className="flex-1" />
      <span className="text-xs font-medium text-muted">App Name</span>
      <div className="flex-1 flex justify-end gap-1">
        <button
          onClick={() => appWindow.minimize()}
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-border"
        >
          <MinusIcon className="h-3 w-3 text-text" />
        </button>
        <button
          onClick={() => appWindow.toggleMaximize()}
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-border"
        >
          <SquareIcon className="h-3 w-3 text-text" />
        </button>
        <button
          onClick={() => appWindow.close()}
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-border hover:bg-red-500/20"
        >
          <XIcon className="h-3 w-3 text-text" />
        </button>
      </div>
    </div>
  )
}
```

## State of the Art

### Technology Changes Since v6.1.0

| Old (v6.1.0 era) | Current (2026) | Impact on Skills |
|-------------------|----------------|-----------------|
| `tailwind.config.ts` for everything | `@theme` CSS blocks | ALL scaffold/token code must change |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss"` | Single import statement |
| `darkMode: 'class'` in config | `@custom-variant dark` in CSS | CSS-first dark mode |
| `@tailwindcss/container-queries` plugin | Built-in `@container` | No plugin needed |
| Next.js 14/15 middleware.ts | Next.js 16 proxy.ts | Rename + function signature change |
| sync `params`, `cookies()`, `headers()` | async `await params`, `await cookies()` | ALL Next.js code examples must change |
| `experimental: { ppr: true }` | `cacheComponents: true` | Config key change |
| Webpack default bundler | Turbopack default bundler | No code change, faster builds |
| Astro `<ViewTransitions />` | Astro `<ClientRouter />` | Component name change |
| Astro `Astro.glob()` | `getCollection()` Content Layer | API change |
| Astro Node 18+ | Astro 6 Node 22+ | Version requirement |
| `import from 'framer-motion'` | `import from 'motion/react'` | Import path change (verified Phase 5) |
| GSAP premium plugins | GSAP all free | Remove premium caveats (verified Phase 5) |
| Tailwind v3 container queries plugin | Tailwind v4 built-in `@container` | Remove plugin reference |
| CSS `light-dark()` experimental | CSS `light-dark()` Baseline 2024 | Available for theme value shorthand |

### React 19.2 Features in Next.js 16

| Feature | What It Does | Impact on Skills |
|---------|-------------|-----------------|
| `<ViewTransition>` | Animate elements during transitions | Page transition patterns (experimental) |
| `<Activity>` | Hidden UI with `display: none` that keeps state | Background panels, off-screen content |
| `useEffectEvent()` | Non-reactive Effect logic | Cleaner event handler patterns |
| React Compiler | Automatic memoization | Less manual `useMemo`/`useCallback` |

### Tailwind v4 New Capabilities

| Feature | Syntax | Impact |
|---------|--------|--------|
| Built-in container queries | `@container`, `@sm:`, `@md:` | No plugin needed, skill patterns use these |
| `@custom-variant` | `@custom-variant dark (...)` | Dark mode in CSS, not config |
| `@theme inline` | `@theme inline { --var: var(--other) }` | Reference other CSS vars in theme |
| `--color-*: initial` | Reset all default colors | Clean slate for DNA palettes |
| `@keyframes` in `@theme` | `@theme { @keyframes ... }` | Animation presets as theme vars |
| `3D transforms` | `rotate-x-*`, `rotate-y-*`, `perspective-*` | 3D effects without custom CSS |

### Browser Support Summary (Feb 2026)

| Feature | Chrome | Edge | Firefox | Safari | Status |
|---------|--------|------|---------|--------|--------|
| Container Queries | 105+ | 105+ | 110+ | 16+ | Baseline 2023 |
| `light-dark()` | 123+ | 123+ | 120+ | 17.5+ | Baseline 2024 |
| `clamp()` | 79+ | 79+ | 75+ | 13.1+ | Baseline 2020 |
| CSS Scroll-Driven | 115+ | 115+ | Flag | 26+ | Progressive |
| View Transitions (same-doc) | 111+ | 111+ | 144+ | 18+ | Baseline 2024 |
| `inert` attribute | 102+ | 102+ | 112+ | 15.5+ | Baseline 2023 |
| `:has()` selector | 105+ | 105+ | 121+ | 15.4+ | Baseline 2023 |

## Open Questions

### 1. Astro 5 vs Astro 6 Timing
- **What we know:** Astro 6 beta is active, stable release is "weeks away." Astro 5 is current stable.
- **What's unclear:** Exact Astro 6 stable release date. Writing skills for Astro 5 that break on Astro 6 would be wasteful.
- **Recommendation:** Write Astro skill to be forward-compatible. Use `<ClientRouter />` instead of `<ViewTransitions />`. Use Content Layer API, not legacy collections. Note Node 22+ requirement for Astro 6. Astro 5 supports all these patterns already.

### 2. Next.js Pages Router Relevance
- **What we know:** User decided "full coverage of BOTH App Router and Pages Router equally." Next.js 16 still supports Pages Router.
- **What's unclear:** Whether Pages Router will be maintained long-term (Next.js team is clearly App Router-focused).
- **Recommendation:** Follow user decision. Document both routers. Pages Router patterns are simpler and many production apps still use them. Focus App Router on new features (Cache Components, async params). Focus Pages Router on stable, well-tested patterns.

### 3. Surviving Skill List for Rewrites
- **What we know:** Phase 1 identified 18 skills to remove and 14 to merge. SKIL-04 says "every surviving skill rewritten."
- **What's unclear:** Exact final list after Phases 1-7 have executed their changes. Some skills may have been added/removed/merged during those phases.
- **Recommendation:** Plan 08-08 (remaining skill rewrites) should inventory the actual skill directory at execution time and rewrite everything not yet in 4-layer format. The planner should list the CATEGORIES of skills needing rewrite (domain skills like ecommerce-ui, dashboard-patterns; utility skills like seo-meta, testing-patterns, etc.) rather than exact filenames, since the list may shift.

### 4. CSS `light-dark()` Adoption Level
- **What we know:** `light-dark()` is Baseline 2024, supported in all modern browsers. It only accepts color values, not arbitrary values.
- **What's unclear:** Whether to use it alongside or instead of Tailwind's `dark:` variant for color declarations.
- **Recommendation:** Use `light-dark()` for CSS custom property definitions where both values are known upfront. Use Tailwind's `dark:` variant for utility-class-level changes (especially non-color changes like layout, spacing, shadows). Both approaches are complementary, not competing.

### 5. React/Vite Skill Scope
- **What we know:** React/Vite is a valid target framework (SPA, no SSR). User confirmed full coverage.
- **What's unclear:** How much React/Vite diverges from Next.js patterns (since Next.js IS React).
- **Recommendation:** Focus React/Vite skill on differences: no server components, client-side routing (react-router or TanStack Router), Vite-specific setup (`@tailwindcss/vite` plugin), no `next/image` (use standard `<img>` with lazy loading), no `next/font` (use CSS `@font-face` or Fontsource). The shared React patterns (components, hooks, state) are identical to Next.js.

## Sources

### Primary (HIGH confidence)
- Next.js 16 blog post: https://nextjs.org/blog/next-16 -- proxy.ts, async params, Cache Components, React 19.2, Turbopack default, all breaking changes
- Tailwind CSS v4 dark mode docs: https://tailwindcss.com/docs/dark-mode -- `@custom-variant dark`, class-based, data attribute, FOUC prevention
- Tailwind CSS v4 container queries: https://tailwindcss.com/blog/tailwindcss-v4 -- Built-in `@container`, named containers, no plugin needed
- Astro 5 release: https://astro.build/blog/astro-5/ -- Content Layer API, Server Islands, simplified prerendering
- Astro 6 Beta: https://astro.build/blog/astro-6-beta/ -- Removed APIs (ViewTransitions, Astro.glob, legacy collections), Node 22+, Zod 4
- Tauri v2 window customization: https://v2.tauri.app/learn/window-customization/ -- `data-tauri-drag-region`, custom titlebar, platform differences
- Electron custom title bar: https://www.electronjs.org/docs/latest/tutorial/custom-title-bar -- `app-region: drag`, `titleBarOverlay`, `titleBarStyle`
- MDN light-dark() function: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark -- Browser support, syntax, limitations
- web.dev fluid typography: https://web.dev/articles/baseline-in-action-fluid-type -- `clamp()` best practices, accessibility concerns with `vw` units

### Secondary (MEDIUM confidence)
- Smashing Magazine fluid typography: https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ -- clamp() formula patterns
- SitePoint Tailwind v4 container queries: https://www.sitepoint.com/tailwind-css-v4-container-queries-modern-layouts/ -- Named containers, practical examples
- DoltHub Electron titlebar blog: https://www.dolthub.com/blog/2025-02-11-building-a-custom-title-bar-in-electron/ -- Practical Electron titlebar patterns
- tauri-controls GitHub: https://github.com/agmmnn/tauri-controls -- Native-looking window controls for Tauri v2 with React/Tailwind
- axe-core GitHub: https://github.com/dequelabs/axe-core -- WCAG 2.0/2.1/2.2 coverage, 57% automated detection
- Astro 2025 Year in Review: https://astro.build/blog/year-in-review-2025/ -- Feature timeline, Astro 6 context

### Tertiary (LOW confidence)
- Astro 6 exact stable release date: Described as "weeks away" in beta blog post (Jan 2026). No confirmed date.
- Next.js Pages Router future: Next.js team is App Router-focused but Pages Router still fully supported in v16. No deprecation announced.
- React/Vite specific design patterns: Less documented than Next.js/Astro. Patterns are largely transferable from React general knowledge.
- CSS `light-dark()` with non-color values: Currently color-only. No timeline for expansion to other value types.

## Metadata

**Confidence breakdown:**
- Tailwind v4 patterns (dark mode, container queries, @theme): HIGH -- verified via official docs
- Next.js 16 breaking changes: HIGH -- verified via official blog post
- Astro 5/6 patterns: HIGH -- verified via official release notes and beta blog
- Responsive design (clamp, container queries, breakpoints): HIGH -- established standards
- Accessibility (WCAG 2.1 AA): HIGH -- established standards
- Dark/light mode implementation: HIGH -- Tailwind v4 docs + community patterns
- Desktop patterns (Tauri/Electron): HIGH -- verified via official documentation
- Multi-page architecture: MEDIUM -- well-understood patterns but Genorah-specific emotional arc application needs creative judgment
- Surviving skill rewrite scope: MEDIUM -- depends on Phases 1-7 execution state at time of Phase 8
- Framework detection heuristics: MEDIUM -- standard convention-based but edge cases exist

**Research date:** 2026-02-24
**Valid until:** 45 days (framework versions are fast-moving; Astro 6 will be stable within this window; CSS standards are stable)
