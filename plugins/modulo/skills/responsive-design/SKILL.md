---
name: "responsive-design"
description: "Mobile-first responsive design with 375px floor, hybrid typography, container queries, and dramatic breakpoint recomposition"
tier: "core"
triggers: "responsive, mobile, breakpoint, container query, clamp, fluid typography, touch target, viewport"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Core Philosophy

375px is the design target. Every component is built mobile-first at 375px, then recomposed upward through breakpoints. Fluid scaling via `clamp()` and `vw` units gracefully handles screens down to ~320px without horizontal scroll. Below 320px is not a design target -- graceful degradation only.

Responsive design is not a review concern or a post-build check. It is a build constraint -- every component produced by any builder agent is responsive by default, from the first line of code.

### When to Use

- Always. Responsive design is active on every build, every component, every section.
- There is no "non-responsive" mode in Modulo.

### When NOT to Use

- Never. This skill cannot be skipped or deferred.

### Breakpoint System

Tailwind v4 default breakpoints, used for page-level layout and display typography:

| Breakpoint | Width | Target Devices | Role |
|------------|-------|----------------|------|
| Default | 375px+ | Phones (portrait) | Design floor -- primary mobile target |
| `sm` | 640px | Large phones (landscape), small tablets | Minor adjustments only |
| `md` | 768px | Tablets (portrait) | First major recomposition |
| `lg` | 1024px | Small laptops, tablets (landscape) | Second major recomposition |
| `xl` | 1280px | Desktops | Full desktop layout |
| `2xl` | 1536px | Large screens | Max-width containment, generous whitespace |

Recomposition happens at `md`, `lg`, and `xl`. The `sm` breakpoint handles minor tweaks (horizontal padding, column count). Do NOT treat every breakpoint as a full redesign -- reserve dramatic layout changes for `md` and `lg`.

### Typography Decision Tree

The hybrid typography system splits text into two categories with different scaling strategies:

**Fluid text (body, captions, UI labels):**
- Scales smoothly between min and max using `clamp(rem, rem + vw, rem)`
- The `rem + vw` formula ensures text responds to both viewport width AND browser zoom
- NEVER use pure `vw` -- it violates WCAG 1.4.4 Resize Text (ignores browser zoom)

**Stepped text (display, headings):**
- Jumps dramatically at breakpoints using Tailwind responsive prefixes
- Each breakpoint gets a deliberately chosen size that matches the layout recomposition
- Body text scaling smoothly makes reading comfortable. Display text jumping dramatically matches layout recomposition -- when the layout fundamentally changes at `md:`, the heading size should also jump to match the new visual hierarchy

Decision tree:
- Body / paragraph text -> `clamp(rem, rem + vw, rem)` for fluid scaling
- Caption / small text -> `clamp()` with smaller range
- Display / hero text -> Breakpoint steps (`text-4xl md:text-6xl lg:text-8xl`)
- Heading 1 -> Breakpoint steps (`text-3xl md:text-4xl lg:text-5xl`)
- Heading 2 -> Breakpoint steps (`text-xl md:text-2xl lg:text-3xl`)
- UI labels / buttons -> Fixed `rem` sizes (no scaling needed)

### Layout Responsiveness Decision Tree

- Reusable component layout (card, widget, feature block) -> Container queries (`@container`)
- Page-level layout (columns, sidebar, hero structure) -> Media queries (`sm:`, `md:`, `lg:`)
- Navigation structure -> Media queries (fundamental structure change between mobile/desktop)
- Within a component, nested layout changes -> Container queries (`@container`)
- Grid of items with variable count -> `auto-fit` + `minmax()` (intrinsically responsive)

### Touch and Interaction Constraints

- Touch targets: 44x44px minimum on all interactive elements at all viewport sizes
- Touch target gap: 8px minimum between adjacent interactive elements
- Images: `srcset` with responsive sizes, `loading="lazy"`, explicit `width`/`height` for CLS prevention
- Scroll containers: `overscroll-contain` to prevent scroll chaining on mobile
- Fixed elements: Account for safe area insets (`env(safe-area-inset-*)`)

### Pipeline Connection

- **Referenced by:** Section builders during every build (responsive is not optional)
- **Consumed at:** `/modulo:execute` -- all builders produce responsive code by default
- **Checked by:** Quality reviewer during post-build review (responsive failures are CRITICAL, not WARNING)

---

## Layer 2: Award-Winning Examples

### Pattern 1: Hybrid Typography System

Complete CSS custom properties for the dual-strategy typography system. Body text uses `clamp()` for smooth fluid scaling; display text uses breakpoint steps for dramatic jumps that match layout recomposition.

```css
/* ==============================================
   HYBRID TYPOGRAPHY SYSTEM
   Body: fluid via clamp (smooth scaling)
   Display: stepped via breakpoints (dramatic jumps)
   ============================================== */

/* --- Fluid body text (clamp with rem + vw for zoom compliance) --- */
:root {
  --text-body: clamp(1rem, 0.875rem + 0.5vw, 1.125rem);
  /* 16px at 375px -> 18px at 1440px, smooth */

  --text-body-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  /* 18px at 375px -> 20px at 1440px */

  --text-caption: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  /* 12px at 375px -> 14px at 1440px */

  --text-body-line-height: 1.6;
  --text-caption-line-height: 1.4;
}

/* --- Stepped display text (dramatic jumps at breakpoints) --- */
:root {
  --text-display: 2.5rem;      /* 40px -- Mobile */
  --text-h1: 2rem;             /* 32px */
  --text-h2: 1.5rem;           /* 24px */
  --text-h3: 1.25rem;          /* 20px */

  --display-line-height: 0.9;
  --heading-line-height: 1.1;
  --display-letter-spacing: -0.03em;
  --heading-letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  :root {
    --text-display: 4.5rem;    /* 72px -- Tablet: dramatic jump */
    --text-h1: 3rem;           /* 48px */
    --text-h2: 2rem;           /* 32px */
    --text-h3: 1.5rem;         /* 24px */
  }
}

@media (min-width: 1024px) {
  :root {
    --text-display: 6rem;      /* 96px -- Desktop: another jump */
    --text-h1: 4rem;           /* 64px */
    --text-h2: 2.5rem;         /* 40px */
    --text-h3: 1.75rem;        /* 28px */
  }
}

@media (min-width: 1440px) {
  :root {
    --text-display: 8rem;      /* 128px -- Large screens */
    --text-h1: 5rem;           /* 80px */
    --text-h2: 3rem;           /* 48px */
    --text-h3: 2rem;           /* 32px */
  }
}
```

Usage in Tailwind v4 with `@theme`:

```css
@import "tailwindcss";

@theme {
  --font-size-body: var(--text-body);
  --font-size-body-lg: var(--text-body-lg);
  --font-size-caption: var(--text-caption);
  --font-size-display: var(--text-display);
  --font-size-h1: var(--text-h1);
  --font-size-h2: var(--text-h2);
  --font-size-h3: var(--text-h3);
}
```

```tsx
// Usage in components
<h1 className="text-display leading-[0.9] tracking-[-0.03em] font-display">
  Award-winning headline
</h1>
<p className="text-body leading-relaxed font-body">
  Body text that scales smoothly across all viewport sizes.
</p>
```

CRITICAL: The `clamp()` formula MUST use `rem + vw` (e.g., `0.875rem + 0.5vw`). Never use pure `vw` units for font sizing -- pure `vw` ignores browser zoom, violating WCAG 1.4.4 Resize Text. Users who zoom to 200% would see no text size change with pure `vw`.

### Pattern 2: Dramatic Layout Recomposition

A hero section that fundamentally changes composition between breakpoints. This is NOT column stacking -- each breakpoint is a different design.

```tsx
// Hero section with dramatic recomposition at each breakpoint
function HeroSection({ title, subtitle, image, cta }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* --- Mobile (375px): Stacked, image-first, full-bleed --- */}
      {/* --- Tablet (768px): Side-by-side, image 40% / text 60% --- */}
      {/* --- Desktop (1024px): Asymmetric grid with overlap --- */}
      {/* --- Large (1440px): Max-width contained, generous margins --- */}

      <div className={[
        // Mobile: stacked, full-width
        "flex flex-col gap-6 px-5 py-12",
        // Tablet: side-by-side grid
        "md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-12 md:px-8 md:py-20",
        // Desktop: asymmetric with visual overlap zone
        "lg:grid-cols-[45fr_55fr] lg:gap-16 lg:px-12 lg:py-28",
        // Large: max-width containment
        "2xl:max-w-[1400px] 2xl:mx-auto 2xl:px-16",
      ].join(" ")}>

        {/* Text block */}
        <div className={[
          "order-2 md:order-1",           // Text below image on mobile, left on tablet+
          "space-y-4 md:space-y-6",
        ].join(" ")}>
          <h1 className="text-display leading-[0.9] tracking-[-0.03em] font-display text-text">
            {title}
          </h1>
          <p className="text-body-lg text-muted max-w-[540px]">
            {subtitle}
          </p>
          <div className="pt-2">
            <a
              href={cta.href}
              className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-primary text-bg rounded-full font-medium text-body hover:opacity-90 transition-opacity"
            >
              {cta.label}
            </a>
          </div>
        </div>

        {/* Visual block */}
        <div className={[
          "order-1 md:order-2",
          // Mobile: full-bleed, negative margins
          "-mx-5 md:mx-0",
          // Desktop: overlapping element breaks the grid
          "lg:relative lg:-mr-12 2xl:-mr-16",
        ].join(" ")}>
          <div className="aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-none md:rounded-2xl">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

Key recomposition details:
- **Mobile**: Image goes full-bleed (negative margins), text stacks below, CTA at bottom
- **Tablet (md)**: Side-by-side grid, image reframes to portrait (3:4), text gets priority (left)
- **Desktop (lg)**: Asymmetric 45/55 split, image overflows grid for visual drama
- **Large (2xl)**: Max-width containment adds generous whitespace margins

### Pattern 3: Container Query Components

Components that adapt to their container width, not the viewport. Essential for reusable components placed in different layout contexts (sidebar vs. main content vs. modal).

```tsx
// Card component using container queries -- adapts to where it's placed
function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <div className="@container">
      <article className={[
        // Narrow container: vertical stack, compact
        "flex flex-col gap-3 p-4",
        // Medium container (280px+): horizontal layout
        "@sm:flex-row @sm:items-start @sm:gap-4 @sm:p-5",
        // Wide container (448px+): full featured grid
        "@md:grid @md:grid-cols-[auto_1fr_auto] @md:items-center @md:gap-6 @md:p-6",
        // Shared styles
        "bg-surface border border-border rounded-xl",
        "transition-shadow duration-200 hover:shadow-elevated",
      ].join(" ")}>

        {/* Icon */}
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
          {icon}
        </div>

        {/* Content */}
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-text text-body truncate">{title}</h3>
          <p className="text-caption text-muted line-clamp-2 @sm:line-clamp-3">{description}</p>
        </div>

        {/* Action -- hidden in narrow, visible in wide */}
        <a
          href={link}
          className="hidden @md:inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-caption font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Learn more
        </a>
      </article>
    </div>
  );
}
```

Named containers for nested scenarios:

```tsx
// Named container -- child queries target specific ancestor
<div className="@container/sidebar">
  <nav className="flex flex-col gap-1 @md/sidebar:flex-row @md/sidebar:gap-4">
    {items.map(item => (
      <a key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 min-h-[44px]">
        {item.icon}
        <span className="@sm/sidebar:inline hidden">{item.label}</span>
      </a>
    ))}
  </nav>
</div>
```

Decision rule: Use `@container` (unnamed) for standalone components. Use `@container/{name}` when components are nested inside other queried containers to avoid ambiguity.

### Pattern 4: Mobile Navigation Patterns

Three navigation approaches with breakpoint-based switching. Each includes keyboard accessibility.

**Pattern 4a: Off-canvas drawer (content-heavy sites)**

```tsx
// Off-canvas navigation with focus trap
function MobileNav({ items, isOpen, onClose }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap: Tab cycles within drawer when open
  useEffect(() => {
    if (!isOpen) return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    focusable[0].focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-text/40 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed top-0 left-0 bottom-0 w-[280px] bg-surface border-r border-border z-50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:hidden",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-body text-text">Menu</span>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-border/50"
            aria-label="Close menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {items.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-body text-text hover:bg-border/50 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
```

**Pattern 4b: Bottom tab bar (app-like experiences)**

```tsx
// Bottom tab bar -- 5 items max, 44px touch targets
function BottomTabBar({ items, activeItem }: TabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex items-center justify-around h-14">
        {items.slice(0, 5).map(item => (
          <a
            key={item.href}
            href={item.href}
            role="tab"
            aria-selected={item.id === activeItem}
            aria-label={item.label}
            className={[
              "flex flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[44px] px-3",
              item.id === activeItem ? "text-primary" : "text-muted",
            ].join(" ")}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

// IMPORTANT: Add bottom padding to main content when using bottom tab bar
// <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
```

**Pattern 4c: Collapsing top navigation**

```tsx
// Desktop: full horizontal links. Mobile: hamburger trigger.
function TopNav({ items }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-5 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        {/* Logo */}
        <a href="/" className="font-display text-h3 text-text">Brand</a>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {items.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-body text-muted hover:text-text transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer -- uses Pattern 4a */}
      <MobileNav items={items} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
```

### Pattern 5: Touch-Optimized Interactive Elements

All interactive elements must meet 44x44px minimum touch target with 8px gap between adjacent targets.

```tsx
// --- Buttons: padding reaches 44px minimum height ---
<button className="min-h-[44px] min-w-[44px] px-6 py-2 bg-primary text-bg rounded-lg font-medium text-body">
  Primary Action
</button>

// --- Icon buttons: padding around icon to reach 44px hit area ---
<button
  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
  aria-label="Close"
>
  <XIcon className="h-5 w-5" />  {/* Icon is 20px, button is 44px */}
</button>

// --- Links in lists: full-width tap target with adequate height ---
<a
  href="/settings"
  className="flex items-center gap-3 px-4 py-3 min-h-[48px] hover:bg-border/30 transition-colors"
>
  <SettingsIcon className="h-5 w-5 text-muted" />
  <span className="text-body text-text">Settings</span>
</a>

// --- Adjacent targets: 8px minimum gap ---
<div className="flex gap-2">  {/* gap-2 = 8px */}
  <button className="min-h-[44px] min-w-[44px] ...">Save</button>
  <button className="min-h-[44px] min-w-[44px] ...">Cancel</button>
</div>

// --- Images as responsive elements ---
<img
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={800}
  loading="lazy"
  decoding="async"
  srcSet="/hero-400.jpg 400w, /hero-800.jpg 800w, /hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1200px"
  className="w-full h-auto object-cover"
/>
```

### Pattern 6: Max-Width Containment and Spacing

Content containment prevents ultra-wide layouts on large screens while maintaining edge-to-edge design on mobile.

```tsx
// Section with responsive containment and spacing
<section className="px-5 md:px-8 lg:px-12 py-16 md:py-24 lg:py-32">
  <div className="max-w-[1200px] mx-auto">
    {/* Content is contained on large screens, full-width on mobile */}
    <h2 className="text-h2 font-display text-text">Section Title</h2>
    <div className="mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Items */}
    </div>
  </div>
</section>

// Full-bleed background with contained content
<section className="bg-primary/5 py-16 md:py-24">
  <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-12">
    {/* Background bleeds, content is contained */}
  </div>
</section>
```

Spacing scale per breakpoint:
| Spacing | Mobile | Tablet (md) | Desktop (lg) |
|---------|--------|-------------|--------------|
| Section padding (x) | `px-5` (20px) | `px-8` (32px) | `px-12` (48px) |
| Section padding (y) | `py-16` (64px) | `py-24` (96px) | `py-32` (128px) |
| Component gap | `gap-6` (24px) | `gap-8` (32px) | `gap-8` (32px) |
| Text stack gap | `space-y-4` | `space-y-6` | `space-y-8` |

### Pattern 7: Responsive Image Handling

```tsx
// Art-directed responsive image with different crops per breakpoint
<picture>
  {/* Desktop: wide crop */}
  <source media="(min-width: 1024px)" srcSet="/hero-wide.jpg" />
  {/* Tablet: square crop */}
  <source media="(min-width: 768px)" srcSet="/hero-square.jpg" />
  {/* Mobile: tall crop */}
  <img
    src="/hero-tall.jpg"
    alt="Descriptive alt text"
    width={375}
    height={500}
    loading="eager"
    className="w-full h-auto object-cover"
  />
</picture>

// Responsive aspect ratio that changes per breakpoint
<div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-xl">
  <img src="/visual.jpg" alt="" className="w-full h-full object-cover" />
</div>
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Responsive Design |
|-----------|---------------------------|
| Type scale (8 levels) | Maps to hybrid system: body sizes use `clamp()`, display sizes use breakpoint steps |
| Spacing scale (5 levels) | Consistent spacing at all breakpoints; larger steps at wider viewports |
| Border radius | Same values across all breakpoints (shape language is consistent) |
| Color tokens (12) | Unchanged across breakpoints -- color identity is viewport-independent |
| Motion tokens | Reduced intensity on mobile for performance; `motion-reduce` for accessibility |
| Signature element | Must be responsive -- adapted but never removed at any viewport size |

DNA breakpoint behavior should be documented in DESIGN-DNA.md under a "Responsive Behavior" section specifying how the type scale and spacing scale adapt across viewports.

### Archetype Variants

All archetypes use the same responsive system. Archetype personality shows through WHAT recomposes and HOW transitions feel, not whether responsive works.

| Archetype | Recomposition Style |
|-----------|-------------------|
| Brutalist | Harsh grid shifts -- columns snap, no smooth transitions between layouts |
| Ethereal | Flowing recomposition -- elements drift into new positions with ease |
| Kinetic | Animated recomposition -- layout changes trigger entrance animations |
| Editorial | Column/margin drama -- narrow columns on mobile widen into generous editorial grids |
| Japanese Minimal | Whitespace expansion -- mobile is compact, desktop adds breathing room proportionally |
| Swiss/International | Grid precision -- breakpoints strictly follow grid mathematics |
| Neo-Corporate | Conservative transitions -- professional, predictable layout shifts |
| Luxury/Fashion | Generous spacing growth -- mobile is tight, desktop is spacious and aspirational |

### Pipeline Stage

- **Input from:** Design DNA (type scale, spacing, signature element), emotional arc (beat viewport height constraints), layout diversity (pattern assignments per section)
- **Output to:** Every section builder produces responsive code by default. Quality reviewer checks responsive compliance as CRITICAL severity.

### Related Skills

- **tailwind-system** -- Container query syntax (`@container`, `@sm:`, `@md:`), breakpoint utilities, Tailwind v4 `@theme` for responsive tokens
- **accessibility** -- Touch targets (44px minimum), zoom compliance (rem + vw for clamp), reduced-motion variants
- **emotional-arc** -- Beat parameters include viewport height constraints (`min-h-[100vh]`, `min-h-[80vh]`) that must be responsive and work on mobile `dvh`
- **cinematic-motion** -- Animation intensity scaled for mobile performance; entrance animations still fire on mobile
- **design-dna** -- Type scale and spacing scale are the source tokens that feed the hybrid typography system
- **performance-animation** -- Mobile performance budgets affect animation complexity at smaller viewports

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Pure vw Font Sizing

**What goes wrong:** Using `font-size: 3vw` or `font-size: clamp(1rem, 3vw, 2rem)` with pure `vw` in the preferred value. Text does not respond to browser zoom -- a user who zooms to 200% sees zero text size change. Violates WCAG 1.4.4 Resize Text.
**Instead:** Always use `rem + vw` in the clamp formula: `clamp(1rem, 0.875rem + 0.5vw, 1.125rem)`. The `rem` component ensures text responds to zoom. The `vw` component adds viewport-based fluid scaling.

### Anti-Pattern 2: Desktop-First with Mobile Afterthought

**What goes wrong:** Designing at 1440px, building the full desktop layout, then "fixing" mobile by stacking columns and shrinking text. The mobile layout feels like a broken version of desktop rather than a designed experience.
**Instead:** Build at 375px first. Mobile IS the primary design. Each wider breakpoint is a deliberate recomposition that takes advantage of additional space, not the "real" design that gets degraded for mobile.

### Anti-Pattern 3: Column-Stacking as Responsive Strategy

**What goes wrong:** The only responsive technique is `grid-cols-3 md:grid-cols-1` -- desktop has columns, mobile stacks them. Every section uses the same stacking approach. The mobile experience is monotonous.
**Instead:** Each breakpoint is a new composition. Elements can reorder (`order-1 md:order-2`), reframe (portrait on mobile, landscape on desktop), relocate (hero image goes from below text on mobile to overlapping on desktop), or restructure entirely (tab bar on mobile, sidebar on desktop).

### Anti-Pattern 4: Tiny Touch Targets

**What goes wrong:** Icon buttons are 24px, links have no padding, adjacent buttons are touching. Users misclick constantly. Fails WCAG 2.5.5 Target Size.
**Instead:** Every interactive element has `min-h-[44px] min-w-[44px]`. Adjacent targets have `gap-2` (8px) minimum. Icon buttons use padding to expand the hit area: a 20px icon in a 44px button.

### Anti-Pattern 5: Viewport-Based Component Responsiveness

**What goes wrong:** A reusable card uses `sm:flex-row` to switch from vertical to horizontal layout. But the card is placed in a narrow sidebar -- the viewport is wide, so the card goes horizontal even though it only has 280px of width. It looks broken.
**Instead:** Use container queries for reusable components. `@container` + `@sm:flex-row` makes the card respond to its actual available width, not the viewport width. Reserve media queries for page-level layout (sidebar visible/hidden, column count).

### Anti-Pattern 6: Fixed Widths on Content

**What goes wrong:** Using `w-[400px]` on a content container. On a 375px screen, the content overflows and creates horizontal scroll.
**Instead:** Use `max-w-[400px] w-full` to set a maximum width while allowing the element to shrink on smaller screens. For responsive containers, prefer Tailwind's `max-w-sm`, `max-w-md`, `max-w-lg` utilities.

### Anti-Pattern 7: Ignoring Safe Areas

**What goes wrong:** Fixed bottom navigation or floating action buttons are hidden behind the home indicator on modern phones (iPhone X+). Users cannot reach bottom-pinned interactive elements.
**Instead:** Add safe area insets to all fixed edge elements: `pb-[env(safe-area-inset-bottom)]` on bottom elements, `pt-[env(safe-area-inset-top)]` on top elements. Use `dvh` instead of `vh` for full-height layouts.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Design floor | 375 | - | px | HARD -- no horizontal scroll at 375px viewport |
| Fluid floor | ~320 | - | px | SOFT -- graceful degradation below 375px, no hard failures |
| Touch target size | 44 | - | px | HARD -- all interactive elements at all viewports |
| Touch target gap | 8 | - | px | HARD -- between adjacent interactive elements |
| Body text clamp | rem + vw | - | formula | HARD -- never pure vw (WCAG 1.4.4 compliance) |
| Display text | breakpoint-stepped | - | - | HARD -- dramatic jumps at md/lg/xl, not fluid |
| Component responsive | @container | - | query type | SOFT -- container queries preferred for reusable components |
| Page layout responsive | media query | - | query type | SOFT -- media queries for page-level layout |
| Image CLS prevention | width + height | - | attributes | HARD -- explicit dimensions on all images |
| Max content width | - | 1400 | px | SOFT -- content should be contained on large screens |
