---
name: "dark-light-mode"
description: "Archetype-aware dark/light mode with independently designed palettes, signature transition animations, FOUC prevention, and dual asset support"
tier: "domain"
triggers: "dark mode, light mode, theme toggle, color scheme, theme transition, FOUC, prefers-color-scheme"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Core Philosophy

Both light and dark modes are **independently designed, award-worthy experiences**. Dark mode is never "invert the light palette." Each mode has its own palette nuances, depth treatment, shadow strategy, and personality. The theme transition itself is a crafted design identity element -- per-archetype, purposeful, memorable.

DNA generates BOTH palettes during `/gen:start-project`:
- User defines the primary mode's palette (usually light)
- Archetype inversion rules derive the alternate mode if user only defines one
- Both palettes stored in DESIGN-DNA.md under `light` and `dark` sub-objects
- Both reviewed independently for contrast compliance and aesthetic quality
- Both undergo anti-slop scoring -- neither mode gets less design attention

### Token Mapping

The same 12 token NAMES map to different VALUES per mode. CSS custom properties switch values; utility classes stay identical.

| Token | Light Purpose | Dark Purpose |
|-------|--------------|-------------|
| `bg` | Warm off-white (#faf9f6) | Deep near-black (#0a0a0f) |
| `surface` | Pure white, elevated | Subtle lift (#111115) |
| `text` | Warm black (#1a1a1a) | Warm white (#f0ece6) |
| `border` | Subtle dark (rgba 0,0,0,0.06) | Subtle light (rgba 255,255,255,0.06) |
| `primary` | Full saturation | Slightly brighter/warmer |
| `secondary` | Full saturation | Slightly brighter |
| `accent` | Full saturation | Slightly lighter tint |
| `muted` | Mid-gray | Mid-gray (inverse direction) |
| `glow` | Subtle tinted glow | Prominent colored glow |
| `tension` | Bold, high-contrast | Neon-shifted |
| `highlight` | Warm highlight | May retain or shift |
| `signature` | Matches archetype | Matches archetype (adjusted) |

### Decision Tree

- **Toggle mechanism** -- Class-based (`.dark` on `<html>`) via Tailwind v4 `@custom-variant dark`
- **Persistence** -- `localStorage` with `prefers-color-scheme` as fallback for first visit
- **FOUC prevention** -- Inline `<script>` in `<head>` before any rendering (see Pattern 2)
- **Framework integration** -- next-themes (Next.js), inline `is:inline` script (Astro), inline in `index.html` (React/Vite)
- **Transition animation** -- Per-archetype signature transition using View Transitions API (see Pattern 3)
- **Asset variants** -- CSS `light-dark()` for simple color swaps, class-based `dark:` for structural changes
- **Shadow system** -- Light mode uses opacity-based shadows, dark mode uses colored glow shadows
- **Depth model** -- Light mode uses elevation (shadow), dark mode uses luminance (surface brightness)

### When NOT to Use

- Only skip dual-mode if project explicitly declares single-mode-only (rare -- document the reason)
- If both modes exist, both MUST pass anti-slop gate independently

### Pipeline Connection

- **Referenced by:** build-orchestrator during scaffold generation (Wave 0), section-builders for component styling
- **Consumed at:** design-system scaffold produces both palette sets from DNA; toggle component built in Wave 1 (navigation)
- **Input from:** DESIGN-DNA.md provides both palettes; design-archetypes provides transition personality
- **Output to:** Every component uses DNA tokens that automatically switch between modes

---

## Layer 2: Award-Winning Examples

### Pattern 1: Complete Tailwind v4 Dark Mode Setup

The full CSS architecture for dual-mode tokens. Light mode values live in `@theme`, dark overrides in `.dark` selector.

```css
@import "tailwindcss";

/* Class-based dark mode (toggled by .dark class on <html>) */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Reset Tailwind defaults -- project owns full palette */
  --color-*: initial;

  /* ---- Light Mode Tokens (default) ---- */
  --color-bg: #faf9f6;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-border: rgba(0, 0, 0, 0.06);
  --color-primary: #ff6f3c;
  --color-secondary: #00c9a0;
  --color-accent: #6366f1;
  --color-muted: #71717a;
  --color-glow: rgba(255, 111, 60, 0.15);
  --color-tension: #ff0044;
  --color-highlight: #ffd700;
  --color-signature: #ff6f3c;

  /* ---- Shadow System (light) ---- */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-float: 0 8px 30px rgba(0, 0, 0, 0.08);
  --shadow-dramatic: 0 20px 50px rgba(0, 0, 0, 0.12);
}

/* ---- Dark Mode Overrides (INDEPENDENTLY DESIGNED) ---- */
.dark {
  --color-bg: #0a0a0f;
  --color-surface: #111115;
  --color-text: #f0ece6;
  --color-border: rgba(255, 255, 255, 0.06);
  --color-primary: #ff8a5c;
  --color-secondary: #00e5b0;
  --color-accent: #818cf8;
  --color-muted: #a1a1aa;
  --color-glow: rgba(255, 138, 92, 0.3);
  --color-tension: #ff3366;
  --color-highlight: #ffd700;
  --color-signature: #ff8a5c;

  /* ---- Shadow System (dark: colored glow) ---- */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-float: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--color-glow);
  --shadow-dramatic: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px var(--color-glow);
}
```

Usage in markup -- identical regardless of mode:
```html
<div class="bg-bg text-text border border-border shadow-elevated">
  <h2 class="text-primary">Heading</h2>
  <p class="text-muted">Body text adapts automatically.</p>
</div>
```

### Pattern 2: FOUC Prevention Per Framework

The inline `<script>` MUST run before any rendering. No external file, no `defer`, no `async`.

**Core Script (framework-agnostic logic):**
```html
<script>
  (function() {
    var d = document.documentElement;
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      d.classList.add('dark');
    } else {
      d.classList.remove('dark');
    }
  })();
</script>
```

**Next.js -- use next-themes (handles FOUC, SSR, persistence, system preference):**
```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// Components use useTheme() for toggle:
'use client'
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Icon changes per mode */}
    </button>
  )
}
```

**Astro -- inline script with `is:inline` (no bundling, runs immediately):**
```astro
---
// BaseLayout.astro
---
<html lang="en">
  <head>
    <script is:inline>
      (function() {
        var d = document.documentElement;
        var t = localStorage.getItem('theme');
        if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          d.classList.add('dark');
        } else {
          d.classList.remove('dark');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**React/Vite -- inline script in index.html `<head>`:**
```html
<!doctype html>
<html lang="en">
  <head>
    <script>
      (function() {
        var d = document.documentElement;
        var t = localStorage.getItem('theme');
        if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          d.classList.add('dark');
        } else {
          d.classList.remove('dark');
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Tauri/Electron -- same inline script in `index.html`** (desktop apps use the React/Vite pattern since they serve local HTML).

### Pattern 3: Archetype Signature Transitions

The theme toggle moment is a **design identity element**. Each archetype defines its signature transition animation. The View Transitions API (Baseline 2024 for same-document) is the primary implementation.

**Base Implementation (View Transitions API with progressive enhancement):**
```tsx
'use client'

function toggleTheme(setTheme: (t: string) => void, current: string) {
  const next = current === 'dark' ? 'light' : 'dark'

  // Progressive enhancement: use View Transitions if available
  if (!document.startViewTransition) {
    setTheme(next)
    return
  }

  document.startViewTransition(() => {
    setTheme(next)
  })
}
```

**Archetype-Specific CSS (applied via `::view-transition-*` pseudo-elements):**

| Archetype | Transition | Duration | CSS Technique |
|-----------|-----------|----------|---------------|
| **Brutalist** | Hard cut | 0ms | No animation -- instant swap matches harsh aesthetic |
| **Ethereal** | Light-bloom fade | 800ms | Radial white flash from center, fading to new theme |
| **Kinetic** | Diagonal wipe | 400ms | clip-path polygon animation, fast and energetic |
| **Neon Noir** | Glow pulse | 500ms | Border glow flash, settles to new palette |
| **Swiss/International** | Clean crossfade | 300ms | Simple opacity crossfade, minimal and precise |
| **Japanese Minimal** | Zen dissolve | 1000ms | Very slow crossfade, meditative pace |
| **Glassmorphism** | Frosted spread | 600ms | Blur effect radiating outward from toggle button |
| **Luxury/Fashion** | Elegant curtain | 600ms | Vertical wipe with sophisticated ease curve |
| **Editorial** | Page turn | 500ms | Slight 3D rotation on Y-axis, like turning a page |
| **Neo-Corporate** | Smooth slide | 350ms | Horizontal slide with subtle blur during transition |
| **Organic** | Growth bloom | 700ms | Circle expand from toggle position, organic easing |
| **Retro-Future** | Scanline sweep | 450ms | Horizontal scanline effect moving top to bottom |
| **Playful/Startup** | Bounce swap | 400ms | Scale bounce with slight overshoot on new theme |
| **Data-Dense** | Segment flip | 300ms | Quick segment-display-style flip, functional |
| **Vaporwave** | Chromatic shift | 550ms | RGB channel split during transition, retro glitch |
| **Neubrutalism** | Block stamp | 250ms | Solid color block appears then reveals new theme |
| **Dark Academia** | Ink wash | 700ms | Dark ink bleeding outward, parchment feel |
| **Warm Artisan** | Warm dissolve | 600ms | Warm-toned crossfade with slight grain |
| **AI-Native** | Data cascade | 400ms | Matrix-style cascade of characters, resolving to new theme |

**Implementation -- Ethereal light-bloom example:**
```css
/* Ethereal: radial bloom transition */
[data-archetype="ethereal"]::view-transition-old(root) {
  animation: ethereal-fade-out 800ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-archetype="ethereal"]::view-transition-new(root) {
  animation: ethereal-bloom-in 800ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes ethereal-fade-out {
  to { opacity: 0; filter: brightness(1.5) blur(4px); }
}
@keyframes ethereal-bloom-in {
  from { opacity: 0; filter: brightness(2) blur(8px); }
  to { opacity: 1; filter: brightness(1) blur(0); }
}
```

**Implementation -- Kinetic diagonal wipe example:**
```css
/* Kinetic: fast diagonal wipe */
[data-archetype="kinetic"]::view-transition-old(root) {
  animation: kinetic-wipe-out 400ms cubic-bezier(0.65, 0, 0.35, 1) both;
}
[data-archetype="kinetic"]::view-transition-new(root) {
  animation: kinetic-wipe-in 400ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

@keyframes kinetic-wipe-out {
  to { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
}
@keyframes kinetic-wipe-in {
  from { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); }
  to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}
```

**Implementation -- Organic circle-expand example:**
```css
/* Organic: circle bloom from toggle button position */
[data-archetype="organic"]::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
[data-archetype="organic"]::view-transition-new(root) {
  animation: organic-bloom 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes organic-bloom {
  from {
    clip-path: circle(0% at var(--toggle-x, 50%) var(--toggle-y, 5%));
  }
  to {
    clip-path: circle(150% at var(--toggle-x, 50%) var(--toggle-y, 5%));
  }
}
```

**Setting toggle position for positional transitions:**
```tsx
function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100
  const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100
  document.documentElement.style.setProperty('--toggle-x', `${x}%`)
  document.documentElement.style.setProperty('--toggle-y', `${y}%`)
  toggleTheme(setTheme, theme)
}
```

**Fallback for browsers without View Transitions API:**
```css
/* CSS-only transition fallback (no View Transitions API) */
html {
  transition: color 300ms ease, background-color 300ms ease;
}
html * {
  transition: color 300ms ease, background-color 300ms ease,
              border-color 300ms ease, box-shadow 300ms ease;
}
/* Disable during initial load to prevent FOUC flash */
html.no-transitions,
html.no-transitions * {
  transition: none !important;
}
```

### Pattern 4: Dual Asset Support

Images, logos, and illustrations need different treatment per mode.

**CSS `light-dark()` for background images (Baseline 2024):**
```css
.logo {
  background-image: light-dark(
    url('/logo-dark.svg'),   /* shown in light mode (dark logo on light bg) */
    url('/logo-light.svg')   /* shown in dark mode (light logo on dark bg) */
  );
}

/* Color-only swaps with light-dark() */
.decorative-border {
  border-color: light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.08));
}
```

**`<picture>` element with media query for responsive images:**
```html
<picture>
  <source srcset="/hero-dark.webp" media="(prefers-color-scheme: dark)" />
  <img src="/hero-light.webp" alt="Hero illustration" />
</picture>
```

**Class-based toggle for structural differences (Tailwind v4):**
```tsx
{/* Logo: show different file per mode */}
<img src="/logo-dark.svg" alt="Logo" className="dark:hidden" />
<img src="/logo-light.svg" alt="Logo" className="hidden dark:block" />

{/* Illustration with mode-specific variants */}
<div className="dark:hidden">
  <LightIllustration />
</div>
<div className="hidden dark:block">
  <DarkIllustration />
</div>
```

**Automatic photo treatment for dark mode:**
```css
/* Photos that are NOT theme-aware get automatic dimming in dark mode */
.dark img:not([data-theme-aware]):not(.logo) {
  filter: brightness(0.85) saturate(0.9);
}

/* Videos get similar treatment */
.dark video:not([data-theme-aware]) {
  filter: brightness(0.9);
}

/* Illustrations with transparent backgrounds may need inversion */
.dark img[data-invertible] {
  filter: invert(1) hue-rotate(180deg) brightness(0.95);
}
```

### Pattern 5: Dark Mode Design Differences (Beyond Color Swaps)

What changes between modes beyond palette values:

**Shadows:**
```css
/* Light: soft, opacity-based (creates depth through absence of light) */
.card-light {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04),
              0 4px 12px rgba(0, 0, 0, 0.06),
              0 8px 30px rgba(0, 0, 0, 0.08);
}

/* Dark: colored glow (creates depth through light emission) */
.dark .card-dark {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4),
              0 0 20px var(--color-glow);
}
```

**Borders:**
```css
/* Light: subtle dark borders for definition */
.border-light { border-color: rgba(0, 0, 0, 0.06); }

/* Dark: subtle light borders for definition */
.dark .border-dark { border-color: rgba(255, 255, 255, 0.06); }

/* Dark: gradient top-border for card personality */
.dark .card::before {
  content: '';
  position: absolute; inset: 0; top: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  opacity: 0.3;
}
```

**Depth Model:**
```
Light Mode Depth:  shadow intensity increases with elevation
  L0 (base)    -> bg (#faf9f6), no shadow
  L1 (card)    -> surface (#ffffff), subtle shadow
  L2 (popover) -> surface (#ffffff), elevated shadow
  L3 (modal)   -> surface (#ffffff), dramatic shadow

Dark Mode Depth:  surface brightness increases with elevation
  L0 (base)    -> bg (#0a0a0f), no shadow
  L1 (card)    -> surface (#111115), subtle glow
  L2 (popover) -> slightly lighter (#18181b), more glow
  L3 (modal)   -> even lighter (#1f1f23), accent glow
```

**Gradients:**
```css
/* Light: subtle warm-to-cool gradients */
.gradient-light {
  background: linear-gradient(180deg, #f5f2ed 0%, #faf9f6 100%);
}

/* Dark: more dramatic, with colored ambient glow */
.dark .gradient-dark {
  background: linear-gradient(180deg, #0a0a0f 0%, #111115 100%);
}
```

**Text weight adjustment:**
```css
/* Body text can appear thinner in dark mode due to halation effect */
.dark body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* Optional: slightly heavier weight for body text in dark mode */
.dark .body-text {
  font-weight: 420; /* Variable font adjustment */
}
```

**Noise/grain texture:**
```css
/* Light mode: lighter grain (2-3% opacity) */
.grain::after {
  opacity: 0.03;
}
/* Dark mode: more visible grain (3-5% opacity) */
.dark .grain::after {
  opacity: 0.05;
}
```

### Pattern 6: Theme Toggle Component

An accessible, archetype-aware toggle button:

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch -- render nothing until mounted
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9 w-9" /> // Placeholder

  const isDark = resolvedTheme === 'dark'

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    // Set toggle position for positional transitions (Organic, Glassmorphism)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100
    document.documentElement.style.setProperty('--toggle-x', `${x}%`)
    document.documentElement.style.setProperty('--toggle-y', `${y}%`)

    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark')
      return
    }
    document.startViewTransition(() => {
      setTheme(isDark ? 'light' : 'dark')
    })
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative h-9 w-9 rounded-lg flex items-center justify-center
                 bg-surface border border-border
                 hover:bg-primary/10 transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Sun icon (shown in dark mode) */}
      <svg
        className={`h-5 w-5 text-text transition-all duration-300
                    ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon icon (shown in light mode) */}
      <svg
        className={`absolute h-5 w-5 text-text transition-all duration-300
                    ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}
```

### Pattern 7: System Preference Sync

Listen for system preference changes and update accordingly:

```tsx
'use client'
import { useEffect } from 'react'

function useSystemThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(e: MediaQueryListEvent) {
      // Only auto-switch if user hasn't set an explicit preference
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])
}
```

**Meta tag for browser chrome matching:**
```html
<!-- Light mode browser chrome -->
<meta name="theme-color" content="#faf9f6" media="(prefers-color-scheme: light)" />
<!-- Dark mode browser chrome -->
<meta name="theme-color" content="#0a0a0f" media="(prefers-color-scheme: dark)" />
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Light Mode Usage | Dark Mode Usage |
|-----------|-----------------|----------------|
| `bg` | Warm off-white base | Deep near-black base |
| `surface` | White for elevated cards | Subtle lift for elevated cards |
| `text` | Warm black for readability | Warm white for readability |
| `border` | Dark at low opacity | Light at low opacity |
| `primary` | Full saturation accent | Slightly brighter variant |
| `glow` | Subtle, low opacity | Prominent, higher opacity |
| `shadow-*` | Opacity-based depth | Glow-based depth |
| `signature` | Archetype signature color | Adjusted for dark background |

DESIGN-DNA.md stores both palettes. The `colors` section has `light` and `dark` sub-objects with all 12 tokens. DNA generation validates both palettes for WCAG contrast compliance (4.5:1 body text, 3:1 large text) independently.

### Archetype Variants

Each archetype defines three dark/light behaviors:

| Archetype | Transition Style | Dark Mode Emphasis | Light Mode Emphasis |
|-----------|-----------------|-------------------|-------------------|
| Brutalist | Instant hard-cut | Raw contrast, no glow | Sharp shadows |
| Ethereal | Light-bloom fade | Soft luminous glow | Airy, light backgrounds |
| Kinetic | Diagonal wipe | Electric glow accents | Bold shadow depth |
| Neon Noir | Glow pulse | Maximum glow, neon borders | Muted -- dark is primary |
| Swiss | Clean crossfade | Precise borders | Clean shadows |
| Japanese Minimal | Zen dissolve | Subtle, restrained | Paper-like warmth |
| Glassmorphism | Frosted spread | Glass + glow | Frosted surfaces |
| Luxury/Fashion | Elegant curtain | Gold/silver accents | Cream elegance |
| Editorial | Page turn | Ink on dark paper | Classic print |
| Neo-Corporate | Smooth slide | Professional glow | Clean, trustworthy |
| Organic | Growth bloom | Earth tones muted | Warm natural tones |
| Retro-Future | Scanline sweep | CRT glow effect | Vintage paper |
| Playful | Bounce swap | Candy neon | Bright pastels |
| Data-Dense | Segment flip | Matrix green glow | Clean data tables |
| Vaporwave | Chromatic shift | Full neon spectrum | Pastel pink/blue |
| Neubrutalism | Block stamp | Bold outlines, high contrast | Thick borders, bright fills |
| Dark Academia | Ink wash | Leather, aged paper | Parchment, warm sepia |
| Warm Artisan | Warm dissolve | Kiln-fired glow | Clay, warm earth |
| AI-Native | Data cascade | Blue-purple matrix | Clean terminal |

### Pipeline Stage

- **Wave 0 (Scaffold):** Design system generates both palette sets from DNA, outputs CSS with `@theme` and `.dark` blocks
- **Wave 1 (Shared UI):** Toggle component built into navigation; FOUC prevention added to layout
- **Wave 2+ (Sections):** Builders use DNA tokens that automatically switch; verify components look correct in both modes
- **Review:** Quality reviewer checks both modes; anti-slop gate scores each independently

### Related Skills

- **tailwind-system** -- CSS architecture for `@theme` and `@custom-variant dark` patterns
- **design-dna** -- Generates both light and dark palettes during discovery
- **accessibility** -- Contrast compliance checked in BOTH modes; reduced-motion respects theme transitions
- **responsive-design** -- Toggle must be accessible at all sizes; mobile may use different toggle placement
- **cinematic-motion** -- Theme transition animations coordinate with archetype motion personality
- **design-archetypes** -- Each archetype defines its signature transition style and dark/light emphasis

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Palette Inversion

**What goes wrong:** Deriving dark mode by inverting or auto-adjusting light mode colors. Produces washed-out, lifeless dark modes with poor contrast and no personality.
**Instead:** Design both palettes independently. Dark mode gets its own color choices -- slightly warmer/brighter primaries, adjusted saturation, intentional surface hierarchy. Both undergo anti-slop scoring.

### Anti-Pattern 2: Flash of Unstyled Content (FOUC)

**What goes wrong:** No inline script in `<head>`. Page renders in light mode, then flashes to dark after JavaScript hydrates. Jarring and unprofessional.
**Instead:** Always include an inline `<script>` in `<head>` that runs before any rendering. Use `next-themes` for Next.js (handles this automatically). For Astro, use `is:inline`. For React/Vite, put the script directly in `index.html`.

### Anti-Pattern 3: Same Shadows in Both Modes

**What goes wrong:** Using identical shadow values in light and dark mode. Dark shadows are invisible against dark backgrounds, making cards appear flat.
**Instead:** Light mode uses opacity-based shadows (rgba black at low opacity). Dark mode uses colored glow shadows (var(--color-glow) based). Different depth models: light = shadow depth, dark = luminance depth.

### Anti-Pattern 4: Tailwind v3 `darkMode: 'class'` Config

**What goes wrong:** Using `darkMode: 'class'` in `tailwind.config.ts` (v3 pattern). This is deprecated in Tailwind v4.
**Instead:** Use CSS-first dark mode: `@custom-variant dark (&:where(.dark, .dark *));` in your CSS file. No JavaScript config needed.

### Anti-Pattern 5: Ignoring Image Treatment

**What goes wrong:** Displaying the same bright photos and illustrations in dark mode. Bright images are jarring against dark backgrounds, breaking visual flow.
**Instead:** Auto-dim photos with `filter: brightness(0.85) saturate(0.9)` in dark mode. Provide dark-variant illustrations and logos. Use `[data-theme-aware]` attribute to exempt images that are already designed for dark backgrounds.

### Anti-Pattern 6: No Transition Animation

**What goes wrong:** Instant toggle with no visual feedback. The theme switch feels utilitarian and misses a design opportunity.
**Instead:** Every archetype defines a signature transition animation. Use the View Transitions API (Baseline 2024) for smooth, animated theme switches. The transition itself is part of the brand identity. Brutalist is the ONLY archetype where instant swap is intentional.

### Anti-Pattern 7: Dark Mode as Afterthought

**What goes wrong:** Building the entire site in light mode, then adding dark mode at the end by picking some dark colors. Results in inconsistent spacing, broken components, and untested interactions.
**Instead:** Both modes are designed from the start. DNA generates both palettes during discovery. Every component is tested in both modes during build. Quality reviewer checks both modes. Neither gets less design attention.

---

## Machine-Readable Constraints

| Parameter | Required | Format | Enforcement |
|-----------|----------|--------|-------------|
| Both palettes in DNA | Yes | `light` + `dark` sub-objects | HARD -- 12 tokens each, independently designed |
| Contrast compliance | Yes | 4.5:1 body, 3:1 large text | HARD -- both modes independently verified |
| FOUC prevention script | Yes | Inline `<script>` in `<head>` | HARD -- must run before first paint |
| Transition animation | Yes | Per archetype from table | HARD -- signature element of design identity |
| Shadow system | Yes | Different strategy per mode | HARD -- opacity (light) vs glow (dark) |
| Asset treatment | Yes | Dark-mode photo dimming | SOFT -- auto-dim unless `[data-theme-aware]` |
| Toggle accessibility | Yes | `aria-label`, keyboard operable | HARD -- WCAG AA required |
| System preference sync | Yes | `prefers-color-scheme` listener | SOFT -- recommended for first-visit experience |
| Meta theme-color | Yes | Dual `<meta>` tags per mode | SOFT -- enhances browser chrome matching |
| Anti-slop gate both modes | Yes | Independent scoring | HARD -- neither mode exempt from quality gate |
