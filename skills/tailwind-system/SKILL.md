---
name: "tailwind-system"
description: "Tailwind CSS v4 CSS-first configuration, DNA token mapping, container queries, dark mode, and animation presets"
tier: "core"
triggers: "tailwind, css, tokens, theme, dark mode setup, container queries, styling system"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a Tailwind CSS v4 configuration architect. Every Genorah project uses Tailwind v4 as its styling system. This skill defines the CSS-first patterns that replace ALL legacy JavaScript-based configuration. Any builder referencing Tailwind patterns MUST follow the v4 standards documented here -- v3 patterns are categorically wrong.

### When to Use

- **Every project.** Tailwind v4 is the universal styling system for all Genorah output
- **Wave 0 scaffold:** Generating the initial `globals.css` with `@theme` block from DNA
- **Every section builder:** Consuming DNA tokens via Tailwind utilities
- **Dark mode setup:** Declaring the variant and both palettes
- **Responsive components:** Container queries and breakpoint decisions
- **Animation presets:** Defining keyframes and timing tokens in the theme
- **Framework setup:** Installing Tailwind v4 for Next.js, Astro, React/Vite, Tauri, Electron

### When NOT to Use

- For choosing color VALUES -- use `design-dna` skill (this skill maps DNA to Tailwind)
- For motion choreography details -- use `cinematic-motion` skill (this skill provides timing tokens)
- For responsive layout decisions -- use `responsive-design` skill (this skill provides the container query syntax)
- For full dark mode design strategy -- use `dark-light-mode` skill (this skill provides the CSS implementation)

### Decision Tree

1. **Token configuration**: Always use `@theme { }` CSS blocks. Never use `tailwind.config.ts` for colors, fonts, spacing, or animation
2. **Importing Tailwind**: Always `@import "tailwindcss"`. Never use `@tailwind base; @tailwind components; @tailwind utilities;`
3. **Dark mode declaration**: Always `@custom-variant dark (&:where(.dark, .dark *))` in CSS. Never use `darkMode: 'class'` in a JS config
4. **Container queries**: Built-in `@container`, `@sm:`, `@md:`, `@lg:` classes. Never install `@tailwindcss/container-queries` plugin
5. **Custom variants**: Use `@custom-variant` for any project-specific variants (dark mode, print, high-contrast)
6. **Animation presets**: Define `@keyframes` inside `@theme { }` block alongside timing tokens
7. **PostCSS/Autoprefixer**: Built into Tailwind v4 -- no separate config needed
8. **Color resets**: Always include `--color-*: initial` in `@theme` to reset Tailwind defaults -- DNA owns the full palette

### v3 to v4 Migration Reference

**This table is the single source of truth.** If you see ANY v3 pattern in generated code, it is wrong.

| v3 Pattern (NEVER use) | v4 Pattern (ALWAYS use) | Why Changed |
|---|---|---|
| `tailwind.config.ts` for colors/fonts/spacing | `@theme { --color-*: value }` in CSS | CSS-first: no JS config for design tokens |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss"` | Single import replaces three directives |
| `darkMode: 'class'` in JS config | `@custom-variant dark (&:where(.dark, .dark *))` in CSS | Dark mode declared in CSS, not JS |
| `@tailwindcss/container-queries` plugin | Built-in `@container` classes | Container queries are native in v4 |
| `theme.extend.colors` in JS config | `--color-*: value` in `@theme` block | Tokens live in CSS, not JavaScript |
| `theme.extend.fontFamily` in JS config | `--font-*: value` in `@theme` block | Font stacks defined in CSS |
| `theme.extend.spacing` in JS config | `--spacing-*: value` in `@theme` block | Spacing scale in CSS |
| `theme.extend.keyframes` in JS config | `@keyframes` inside `@theme { }` | Animations are theme-level CSS |
| `theme.extend.animation` in JS config | CSS custom properties + `@keyframes` | Animation shorthand via tokens |
| Separate PostCSS + Autoprefixer config | Built into Tailwind v4 | Zero-config vendor prefixing |
| `@layer base { }` for token resets | `@theme { }` for design tokens | `@theme` is the token layer |
| `tailwind.config.ts` + `postcss.config.js` | CSS file only (+ framework plugin) | Two files become one |

### Pipeline Connection

- **Referenced by:** Every agent and builder that writes CSS or Tailwind classes
- **Consumed at:** Wave 0 scaffold generation, every section build, every quality review
- **Input from:** `design-dna` skill provides token values; `design-archetypes` determines palette personality
- **Output to:** All section builders consume the `@theme` block; `dark-light-mode` skill overlays dark palette

---

## Layer 2: Award-Winning Examples

### Pattern 1: Complete DNA-to-Tailwind Token Mapping

The `@theme` block is the heart of every Genorah project. It maps ALL Design DNA tokens to Tailwind utilities. This block is generated during Wave 0 by the scaffold skill and consumed by every section builder.

```css
@import "tailwindcss";

@theme {
  /* ============================================
     RESET: Clear all Tailwind default colors.
     DNA owns the full palette -- no defaults leak through.
     ============================================ */
  --color-*: initial;

  /* ============================================
     SEMANTIC CORE (8 tokens from DNA)
     These generate: bg-bg, bg-surface, text-text,
     border-border, bg-primary, text-primary, etc.
     ============================================ */
  --color-bg: #0a0a0f;
  --color-surface: #111115;
  --color-text: #f0ece6;
  --color-border: rgba(255, 255, 255, 0.06);
  --color-primary: #ff6f3c;
  --color-secondary: #00e5a0;
  --color-accent: #c084fc;
  --color-muted: #5c5952;

  /* ============================================
     EXPRESSIVE TOKENS (4 tokens from DNA)
     Creative intent beyond functional roles.
     ============================================ */
  --color-glow: rgba(255, 111, 60, 0.3);
  --color-tension: #ff0044;
  --color-highlight: #ffd700;
  --color-signature: #00ff88;

  /* ============================================
     FONT FAMILIES (3 stacks from DNA)
     Generates: font-display, font-body, font-mono
     ============================================ */
  --font-display: "Clash Display", system-ui, sans-serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* ============================================
     TYPE SCALE (8 levels from DNA)
     Generates: text-hero, text-h1, text-h2, etc.
     Display sizes use stepped breakpoints (see below).
     Body sizes use clamp() for fluid scaling.
     ============================================ */
  --text-hero: clamp(3rem, 8vw, 6rem);
  --text-h1: clamp(2.25rem, 5vw, 3.75rem);
  --text-h2: clamp(1.5rem, 3vw, 2.25rem);
  --text-h3: clamp(1.25rem, 2vw, 1.5rem);
  --text-h4: clamp(1.125rem, 1.5vw, 1.25rem);
  --text-body-large: clamp(1.125rem, 1.2vw, 1.25rem);
  --text-body: 1rem;
  --text-small: 0.875rem;

  /* ============================================
     SPACING SCALE (5 levels from DNA)
     Generates: p-xs, p-sm, p-md, p-lg, p-xl, etc.
     ============================================ */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --spacing-xl: 8rem;

  /* ============================================
     BORDER RADIUS (from DNA / archetype)
     Generates: rounded-inner, rounded-outer
     ============================================ */
  --radius-inner: 0.5rem;
  --radius-outer: 1rem;

  /* ============================================
     SHADOW SYSTEM (light mode defaults)
     Dark mode overrides these in .dark selector.
     ============================================ */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-float: 0 8px 30px rgba(0, 0, 0, 0.08);

  /* ============================================
     ANIMATION KEYFRAMES
     Defined inside @theme for Tailwind utility generation.
     Usage: animate-rise, animate-fade-in, etc.
     ============================================ */
  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slide-left {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-right {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ============================================
     ANIMATION TIMING TOKENS
     Consumed by builders via Tailwind utilities
     and by motion libraries via getComputedStyle.
     ============================================ */
  --duration-fast: 150ms;
  --duration-default: 300ms;
  --duration-slow: 600ms;
  --duration-dramatic: 1200ms;

  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-dramatic: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  /* ============================================
     ANIMATION SHORTHAND PRESETS
     Usage: animate-rise, animate-fade-in, etc.
     All default to --duration-default and --ease-default.
     ============================================ */
  --animate-rise: rise var(--duration-default) var(--ease-dramatic) both;
  --animate-fade-in: fade-in var(--duration-default) var(--ease-default) both;
  --animate-scale-in: scale-in var(--duration-default) var(--ease-default) both;
  --animate-slide-left: slide-left var(--duration-default) var(--ease-dramatic) both;
  --animate-slide-right: slide-right var(--duration-default) var(--ease-dramatic) both;
  --animate-slide-down: slide-down var(--duration-default) var(--ease-dramatic) both;
}
```

**Generated Tailwind utilities from the above `@theme` block:**

| Token Category | Example Utilities |
|---|---|
| Colors | `bg-bg`, `bg-surface`, `bg-primary`, `text-text`, `text-muted`, `border-border`, `text-signature` |
| Fonts | `font-display`, `font-body`, `font-mono` |
| Type scale | `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small` |
| Spacing | `p-xs`, `p-sm`, `p-md`, `p-lg`, `p-xl`, `gap-sm`, `gap-md`, `m-lg` |
| Radius | `rounded-inner`, `rounded-outer` |
| Shadows | `shadow-subtle`, `shadow-elevated`, `shadow-float` |
| Animations | `animate-rise`, `animate-fade-in`, `animate-scale-in`, `animate-slide-left` |

---

### Pattern 2: Container Query Patterns

Tailwind v4 has built-in container query support. No plugins needed.

```html
<!-- Basic: Mark parent as container, children respond to container width -->
<div class="@container">
  <div class="flex flex-col @sm:flex-row @md:grid @md:grid-cols-2 @lg:grid-cols-3 gap-md">
    <!-- Layout adapts to container width, not viewport -->
    <div class="p-sm @md:p-md">Card content</div>
    <div class="p-sm @md:p-md">Card content</div>
    <div class="p-sm @md:p-md">Card content</div>
  </div>
</div>

<!-- Named containers: Scope queries to specific ancestors -->
<div class="@container/card">
  <div class="flex flex-col @sm/card:flex-row gap-sm">
    <img class="w-full @sm/card:w-1/3 rounded-inner" src="..." alt="..." />
    <div class="flex-1">
      <h3 class="text-h3 font-display text-text">Title</h3>
      <p class="text-body text-muted">Description</p>
    </div>
  </div>
</div>

<!-- Nested containers: Different scopes at different levels -->
<div class="@container/section">
  <div class="grid grid-cols-1 @md/section:grid-cols-2 @lg/section:grid-cols-3 gap-md">
    <div class="@container/card">
      <div class="@sm/card:flex-row flex flex-col gap-sm">
        <!-- Card adapts to card container, grid adapts to section container -->
      </div>
    </div>
  </div>
</div>
```

**Container query decision tree:**

| Scenario | Use | Why |
|---|---|---|
| Reusable component (card, widget, feature block) | `@container` | Component adapts to where it is placed |
| Page-level layout (columns, sidebar, full-width) | Media queries (`sm:`, `md:`, `lg:`) | Layout depends on viewport, not parent |
| Navigation structure | Media queries | Nav breakpoints are viewport-dependent |
| Component within a component (nested layout) | Named `@container/name` | Scoped queries prevent ancestor interference |
| Component used in sidebar AND main content | `@container` | Same component, different container widths |

**Built-in container query breakpoints:**

| Class Prefix | Container Width |
|---|---|
| `@xs:` | 320px (`@min-xs:`) |
| `@sm:` | 384px |
| `@md:` | 448px |
| `@lg:` | 512px |
| `@xl:` | 576px |
| `@2xl:` | 672px |
| `@3xl:` | 768px |
| `@4xl:` | 896px |
| `@5xl:` | 1024px |

---

### Pattern 3: Dark Mode Architecture

Complete CSS-first dark mode using Tailwind v4's `@custom-variant` pattern.

**Step 1: Declare the dark mode variant**

```css
@import "tailwindcss";

/* Class-based dark mode: toggles via .dark on <html> */
@custom-variant dark (&:where(.dark, .dark *));
```

**Step 2: Define light palette in `@theme` (default)**

```css
@theme {
  --color-*: initial;

  /* Light palette -- designed independently, not derived from dark */
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

  /* Light shadow system: subtle opacity-based */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-float: 0 8px 30px rgba(0, 0, 0, 0.08);
}
```

**Step 3: Override with dark palette in `.dark` selector**

```css
/* Dark palette -- separately designed, NOT inverted from light */
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

  /* Dark shadow system: deeper + colored glow accents */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-float: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--color-glow);
}
```

**Step 4: FOUC prevention (inline in `<head>`)**

This script MUST run before any rendering to prevent a flash of the wrong theme.

```html
<script>
  (function () {
    var theme = localStorage.getItem("theme");
    var prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  })();
</script>
```

**Usage in components -- identical for both modes:**

```tsx
// Components use DNA tokens. Dark/light switching is automatic.
<section className="bg-bg text-text border-b border-border">
  <div className="bg-surface shadow-elevated rounded-outer p-md">
    <h2 className="text-h2 font-display text-text">Section Title</h2>
    <p className="text-body text-muted">Description text</p>
    <button className="bg-primary text-bg px-md py-sm rounded-inner
                       hover:bg-primary/90 transition-colors duration-default">
      Call to Action
    </button>
  </div>
</section>

// Dark-mode-specific overrides (rare -- only when modes need different layout/behavior):
<div className="hidden dark:block">Dark-only content</div>
<div className="block dark:hidden">Light-only content</div>
```

**Design principles for both palettes:**
- Both palettes are independently designed by the creative director -- neither is derived from the other
- Light mode: subtle opacity-based shadows, higher-contrast text, softer accent colors
- Dark mode: deeper shadows with colored glow, slightly lightened accents for readability, glow effects more visible
- Signature element may shift hue/intensity between modes to maintain visual impact
- Both modes MUST pass WCAG 2.1 AA contrast ratios independently (4.5:1 body text, 3:1 large text)

---

### Pattern 4: Animation Presets via @theme

All animation keyframes and timing tokens are defined inside the `@theme` block. This makes them available as Tailwind utilities and as CSS custom properties for JS animation libraries.

```css
@theme {
  /* Timing tokens -- consumed by Tailwind utilities and JS libraries */
  --duration-fast: 150ms;
  --duration-default: 300ms;
  --duration-slow: 600ms;
  --duration-dramatic: 1200ms;

  /* Easing tokens -- DNA may override these per archetype */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-dramatic: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  /* Keyframes -- entrance animations for section builders */
  @keyframes rise {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  /* Animation shorthand presets */
  --animate-rise: rise var(--duration-default) var(--ease-dramatic) both;
  --animate-fade-in: fade-in var(--duration-default) var(--ease-default) both;
  --animate-scale-in: scale-in var(--duration-default) var(--ease-default) both;
}
```

**Usage with motion-safe/motion-reduce prefixes:**

```tsx
// ALWAYS gate animations behind motion-safe:
<div className="motion-safe:animate-rise motion-reduce:opacity-100">
  Content that animates in on scroll
</div>

// Hover animations: motion-safe only
<button className="motion-safe:hover:-translate-y-1 motion-safe:transition-transform
                   motion-reduce:hover:shadow-elevated duration-default">
  Hover me
</button>

// Staggered entrance: combine with delay utilities
<div className="motion-safe:animate-rise motion-safe:delay-0">Item 1</div>
<div className="motion-safe:animate-rise motion-safe:delay-100">Item 2</div>
<div className="motion-safe:animate-rise motion-safe:delay-200">Item 3</div>
```

**Accessing timing tokens from JavaScript (for GSAP, motion/react):**

```typescript
// Read DNA timing tokens from CSS custom properties
const style = getComputedStyle(document.documentElement);
const duration = parseFloat(style.getPropertyValue('--duration-default')); // 300
const easing = style.getPropertyValue('--ease-dramatic').trim();

// Use in GSAP
gsap.to(element, {
  y: 0,
  opacity: 1,
  duration: duration / 1000,
  ease: "power3.out", // GSAP equivalent of --ease-dramatic
});
```

**Reduced-motion baseline (always include in globals.css):**

```css
/* Universal reduced-motion safety net */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### Pattern 5: Framework-Specific Setup

Tailwind v4 installation varies by framework. No `tailwind.config.ts` is needed for ANY framework.

**Next.js (App Router or Pages Router):**

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```css
/* app/globals.css (App Router) or styles/globals.css (Pages Router) */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* DNA tokens here */
}
```

```bash
# Install
npm install tailwindcss @tailwindcss/postcss
```

**Astro:**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* DNA tokens here */
}
```

```bash
# Install
npm install tailwindcss @tailwindcss/vite
```

**React + Vite (SPA):**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* DNA tokens here */
}
```

```bash
# Install
npm install tailwindcss @tailwindcss/vite
```

**Tauri + Electron:**

Both use the same Vite-based setup as React + Vite (since Tauri and Electron render web content). Use `@tailwindcss/vite` in the Vite config. The only difference is accounting for desktop-specific CSS like titlebar drag regions (see `desktop-patterns` skill).

**Key rules across all frameworks:**
- NO `tailwind.config.ts` file needed -- all configuration lives in CSS `@theme`
- NO separate Autoprefixer or PostCSS config needed (built into Tailwind v4)
- The CSS file with `@import "tailwindcss"` and `@theme` IS the configuration
- Framework integration is ONE plugin (`@tailwindcss/postcss` for Next.js, `@tailwindcss/vite` for everything else)

---

### Pattern 6: Tailwind v4 Utility Quick Reference

Common utility patterns using DNA tokens for section builders.

**Color utilities from DNA tokens:**

```tsx
// Backgrounds
className="bg-bg"           // Main page background
className="bg-surface"      // Card/panel surfaces
className="bg-primary"      // Primary accent backgrounds
className="bg-primary/10"   // Primary at 10% opacity (overlay)
className="bg-accent/20"    // Accent at 20% opacity

// Text
className="text-text"       // Primary text
className="text-muted"      // Secondary/caption text
className="text-primary"    // Accent text (links, highlights)
className="text-signature"  // Signature element color

// Borders
className="border-border"   // Default borders
className="border-primary/30" // Subtle primary border (hover states)

// Shadows (defined in @theme)
className="shadow-subtle"   // Minimal shadow
className="shadow-elevated" // Card elevation
className="shadow-float"    // Floating/modal elements
```

**Typography using DNA scale:**

```tsx
// Headings: font-display + DNA scale
className="font-display text-hero tracking-tighter leading-none"
className="font-display text-h1 tracking-tight leading-tight"
className="font-display text-h2 tracking-tight"
className="font-display text-h3"

// Body: font-body + DNA scale
className="font-body text-body leading-relaxed"
className="font-body text-body-large leading-relaxed"
className="font-body text-small text-muted"

// Code: font-mono
className="font-mono text-small bg-surface px-2 py-1 rounded-inner"
```

**Spacing using DNA scale:**

```tsx
// Section padding
className="py-xl px-md"     // 8rem vertical, 2rem horizontal
className="py-lg px-sm"     // 4rem vertical, 1rem horizontal

// Component gaps
className="gap-md"          // 2rem between grid/flex children
className="gap-sm"          // 1rem between items
className="space-y-xs"      // 0.5rem vertical stack

// Max-width containers
className="max-w-7xl mx-auto px-sm md:px-md"
```

**Interactive states (always include focus-visible):**

```tsx
className="hover:bg-primary/90 active:scale-[0.98]
           focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-primary focus-visible:ring-offset-2
           focus-visible:ring-offset-bg
           transition-colors duration-default"
```

---

### Pattern 7: Custom Variants and Extended Configuration

Beyond dark mode, use `@custom-variant` for project-specific states.

```css
/* High contrast mode variant */
@custom-variant high-contrast (&:where(.high-contrast, .high-contrast *));

/* Print variant */
@custom-variant print (@media print);

/* Reduced transparency preference */
@custom-variant reduce-transparency (@media (prefers-reduced-transparency: reduce));
```

**Using `@theme inline` to reference other CSS variables:**

```css
@theme inline {
  /* Reference other theme variables -- use @theme inline for cross-references */
  --color-primary-soft: oklch(from var(--color-primary) l c h / 0.1);
  --color-focus-ring: var(--color-primary);
}
```

**Extending the theme with project-specific tokens:**

```css
@theme {
  /* Standard DNA tokens... */

  /* Project-specific extensions (documented with EXTENDED comment) */
  --color-success: #22c55e;   /* EXTENDED: form validation states */
  --color-warning: #f59e0b;   /* EXTENDED: alert/warning states */
  --color-error: #ef4444;     /* EXTENDED: error states */

  /* Custom breakpoint (rare -- only if DNA specifies a non-standard breakpoint) */
  --breakpoint-content: 1120px; /* EXTENDED: content-width breakpoint */
}
```

---

## Layer 3: Integration Context

### DNA Connection

This skill is the BRIDGE between Design DNA values and Tailwind CSS utilities.

| DNA Token Category | Tailwind Mapping | Generated Utilities |
|---|---|---|
| 8 semantic colors | `--color-{name}` in `@theme` | `bg-{name}`, `text-{name}`, `border-{name}` |
| 4 expressive colors | `--color-{name}` in `@theme` | `bg-glow`, `text-tension`, `text-highlight`, `text-signature` |
| 3 font families | `--font-{role}` in `@theme` | `font-display`, `font-body`, `font-mono` |
| 8 type scale levels | `--text-{level}` in `@theme` | `text-hero`, `text-h1`, ..., `text-small` |
| 5 spacing levels | `--spacing-{level}` in `@theme` | `p-xs`, `p-sm`, `gap-md`, `m-lg`, `p-xl` |
| 2 border radii | `--radius-{type}` in `@theme` | `rounded-inner`, `rounded-outer` |
| 3 shadow levels | `--shadow-{level}` in `@theme` | `shadow-subtle`, `shadow-elevated`, `shadow-float` |
| 4 duration tokens | `--duration-{speed}` in `@theme` | `duration-fast`, `duration-default`, `duration-slow` |
| 4 easing tokens | `--ease-{name}` in `@theme` | CSS custom properties (consumed by JS/CSS animations) |
| 6 animation presets | `@keyframes` + `--animate-*` in `@theme` | `animate-rise`, `animate-fade-in`, `animate-scale-in` |

### Archetype Variants

Archetypes do NOT change Tailwind configuration structure. They change the VALUES within `@theme`. The same `bg-primary` utility exists for every archetype -- the color it resolves to differs.

| Archetype Category | @theme Impact |
|---|---|
| Minimal (Swiss, Japanese Minimal) | Tight spacing scale, subtle shadows, restrained color palette, longer durations |
| Bold (Brutalist, Neubrutalism) | Large spacing, zero border-radius, high-contrast shadows, instant durations |
| Elegant (Luxury, Ethereal) | Generous spacing, subtle shadows with glow, refined easing curves, slow durations |
| Dynamic (Kinetic, AI-Native) | Standard spacing, dramatic shadows, aggressive easing, fast durations |
| Warm (Organic, Warm Artisan) | Organic spacing ratios, warm-toned shadows, gentle easing curves |

### Pipeline Stage

- **Input from:** `design-dna` skill provides all token values. `design-archetypes` skill determines the personality that shapes those values
- **Generated at:** Wave 0 by `design-system-scaffold` skill (which reads this skill for the correct v4 patterns)
- **Consumed by:** Every section builder (Waves 1+). Every quality review. Every polisher pass
- **Verified by:** Anti-slop gate checks that builders use DNA token utilities (not arbitrary hex values)

### Related Skills

- **design-dna** -- Token value source. DNA defines the 12 colors, 3 fonts, 8 type levels, 5 spacing levels, motion language. This skill maps them to Tailwind
- **design-system-scaffold** -- Scaffold generator. Uses this skill's patterns to generate the actual `globals.css` file during Wave 0
- **dark-light-mode** -- Dark palette overlay. Uses the dark mode architecture from this skill (Pattern 3) for the complete dual-theme system
- **responsive-design** -- Container query consumer. Uses the container query patterns from this skill (Pattern 2) for component responsiveness
- **cinematic-motion** -- Motion choreography. Reads the timing tokens defined in this skill's `@theme` block for consistent animation speed
- **performance-animation** -- Performance guardian. Monitors that animation presets from this skill respect frame budget and will-change limits

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Using tailwind.config.ts for Design Tokens

**What goes wrong:** Creating a `tailwind.config.ts` file with `theme.extend.colors`, `theme.extend.fontFamily`, `theme.extend.spacing`, or `theme.extend.keyframes` to define project tokens. This is the v3 approach and is entirely superseded in v4.

**Why it fails:** Tailwind v4 uses CSS-first configuration. The `@theme` block in CSS is the single source of truth for all design tokens. A `tailwind.config.ts` still works for backward compatibility, but using it for tokens creates a split configuration (some in CSS, some in JS) that is harder to maintain and prevents CSS-native features like `@theme inline` cross-references.

**Instead:** Define ALL tokens in `@theme { }` inside your CSS file. The CSS file IS the configuration. A `tailwind.config.ts` is only needed for rare v3-era plugins that have not been updated to v4.

### Anti-Pattern 2: Using v3 @tailwind Directives

**What goes wrong:** Starting the CSS file with `@tailwind base; @tailwind components; @tailwind utilities;` -- the v3 import pattern.

**Why it fails:** Tailwind v4 replaces all three directives with a single `@import "tailwindcss"`. Using the old directives may work due to backward compatibility but produces warnings and prevents access to v4 features.

**Instead:** Use `@import "tailwindcss"` as the single entry point. Remove all `@tailwind` directives.

### Anti-Pattern 3: Installing Container Query Plugin

**What goes wrong:** Running `npm install @tailwindcss/container-queries` and adding it to a plugin configuration. This was required in v3.

**Why it fails:** Container queries are built into Tailwind v4. The `@container` parent class and `@sm:`, `@md:`, `@lg:` responsive prefixes work out of the box. Installing the plugin adds unnecessary dependencies and may conflict with the built-in implementation.

**Instead:** Use `@container` and `@sm:`, `@md:`, `@lg:` directly. No plugin needed.

### Anti-Pattern 4: Arbitrary Hex Values Instead of DNA Tokens

**What goes wrong:** Using `bg-[#ff6f3c]`, `text-[#1a1a1a]`, or `border-[rgba(0,0,0,0.1)]` instead of `bg-primary`, `text-text`, `border-border`.

**Why it fails:** Arbitrary values break the DNA token system. They cannot be themed (dark mode fails), cannot be updated globally (changing primary means finding every hex instance), and are impossible for the quality reviewer to verify. They are the #1 source of "slop" in generated Tailwind code.

**Instead:** ALWAYS use DNA token utilities: `bg-primary`, `text-text`, `border-border`, `shadow-elevated`. If you need a color not in the DNA palette, extend the `@theme` block with an `/* EXTENDED: reason */` comment -- never use inline arbitrary hex.

### Anti-Pattern 5: Using darkMode Config Key

**What goes wrong:** Adding `darkMode: 'class'` or `darkMode: 'media'` to `tailwind.config.ts`. This is the v3 approach to dark mode.

**Why it fails:** Tailwind v4 uses `@custom-variant dark (&:where(.dark, .dark *))` declared in CSS. The JS config key is unnecessary and creates a dependency on a config file that should not exist for token-level configuration.

**Instead:** Add `@custom-variant dark (&:where(.dark, .dark *));` to your CSS file, after `@import "tailwindcss"`. Override CSS custom properties in a `.dark { }` selector.

### Anti-Pattern 6: Mixing v3 and v4 Configuration

**What goes wrong:** Some tokens defined in `@theme` CSS, others in `tailwind.config.ts`. Half the team uses `@theme`, half uses the JS config.

**Why it fails:** Creates a confusing split-brain configuration. Tokens in JS config do not benefit from `@theme inline` cross-references, CSS variable inheritance, or the clean single-file architecture of v4.

**Instead:** ALL configuration lives in CSS. The `@theme` block is the single source of truth. If migrating from v3, move ALL tokens to `@theme` at once -- do not leave a partial migration.

### Anti-Pattern 7: Forgetting motion-safe Prefix

**What goes wrong:** Using `animate-rise` without `motion-safe:` prefix. Animation plays even for users with `prefers-reduced-motion: reduce`.

**Why it fails:** Violates WCAG 2.3.3 (Animation from Interactions). Users who have opted out of motion will see unwanted animations that may cause discomfort.

**Instead:** ALWAYS prefix animation utilities with `motion-safe:` and provide a `motion-reduce:` fallback. Example: `motion-safe:animate-rise motion-reduce:opacity-100`. The reduced-motion CSS baseline (Pattern 4) catches anything missed, but explicit prefixing is the primary defense.

---

## Machine-Readable Constraints

| Parameter | Required | Format | Enforcement |
|---|---|---|---|
| All 12 DNA color tokens in `@theme` | Yes | `--color-{name}: value` for bg, surface, text, border, primary, secondary, accent, muted, glow, tension, highlight, signature | HARD -- reject if any missing |
| `@import "tailwindcss"` | Yes | Single import statement | HARD -- no `@tailwind` directives |
| `@custom-variant dark` | Yes | CSS declaration in stylesheet | HARD -- no JS `darkMode` config |
| `--color-*: initial` in `@theme` | Yes | Reset all default colors | HARD -- DNA owns full palette |
| Animation `@keyframes` inside `@theme` | Yes | At least 3 entrance animations | HARD -- motion presets as theme tokens |
| `motion-safe:` prefix on all animations | Yes | Tailwind utility prefix | HARD -- WCAG compliance |
| Reduced-motion CSS baseline | Yes | `@media (prefers-reduced-motion)` block | HARD -- universal safety net |
| Container queries built-in | Yes | `@container` classes, no plugin | SOFT -- warn if plugin detected |
| Duration tokens in `@theme` | Yes | `--duration-{speed}: value` (at least fast, default, slow) | HARD -- consistent timing system |
| Framework plugin correct | Yes | `@tailwindcss/postcss` (Next.js) or `@tailwindcss/vite` (others) | SOFT -- warn if wrong plugin |
