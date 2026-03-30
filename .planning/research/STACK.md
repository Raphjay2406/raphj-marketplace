# Technology Stack

**Project:** Genorah 2.0 -- Premium Frontend Design Plugin
**Researched:** 2026-02-23
**Research Mode:** Ecosystem (Stack dimension)
**Overall Confidence:** HIGH (versions verified via npm registry; capabilities cross-referenced with existing v6.1.0 skill files)

---

## Executive Summary

This document maps the complete technology stack for producing Awwwards SOTD-caliber (8.0+) websites across five target frameworks: Next.js, Astro, React/Vite, Tauri, and Electron. Each recommendation is prescriptive -- not just "what exists" but "what to use and why."

The premium frontend design stack in 2025-2026 centers on three pillars:
1. **Animation layering** -- GSAP for scroll-driven choreography, Motion (Framer Motion) for React component animation, native CSS for micro-interactions
2. **Component ecosystem** -- shadcn/ui as the accessible foundation, supplemented by premium effect libraries (Aceternity UI, Magic UI) for wow moments
3. **Modern CSS** -- Tailwind CSS v4 with CSS-first configuration, native scroll-driven animations, container queries, and variable fonts

---

## 1. Animation Libraries

### Primary: GSAP 3.14

| Property | Value |
|----------|-------|
| **Package** | `gsap` |
| **Current Version** | 3.14.2 |
| **Confidence** | HIGH (npm registry verified) |
| **License** | Standard license free for most uses; Business license for SaaS tools |

**Why GSAP is the primary animation engine:**
- ScrollTrigger is the gold standard for scroll-driven animations -- no competitor matches its precision (pin, scrub, snap, batch)
- Timeline orchestration enables the frame-by-frame choreography Genorah's cinematic motion system requires
- SplitText plugin (Club GreenSock) enables word/character-level text reveals that define award-winning typography
- DrawSVG and MorphSVG enable SVG line-draw and shape-morph animations
- MotionPathPlugin for motion along bezier curves
- Performance is unmatched -- GSAP's internal ticker is more efficient than requestAnimationFrame wrappers
- Works across all 5 target frameworks (vanilla JS core, no React dependency)

**Key capabilities for Awwwards-caliber output:**
- `ScrollTrigger` -- pin sections, scrub animations, batch stagger, toggleActions
- `gsap.timeline()` -- multi-element orchestration with precise overlap control (`"-=0.3"`)
- `gsap.context()` -- React-safe cleanup pattern (critical for Next.js/React)
- `ScrollTrigger.batch()` -- staggered grid reveals on scroll
- `gsap.matchMedia()` -- responsive animation breakpoints
- Easing library -- `power3.out`, `elastic.out`, `back.out`, `expo.out` etc.

**GSAP Club plugins (paid, but essential for SOTD):**
- `SplitText` -- character/word/line splitting for text choreography
- `DrawSVGPlugin` -- animate SVG stroke dashoffset
- `MorphSVGPlugin` -- morph between SVG shapes
- `ScrollSmoother` -- smooth scrolling container (alternative to Lenis)
- `Flip` -- layout animation helper

**Installation:**
```bash
npm install gsap
# Club plugins are self-hosted, not on npm
```

### Secondary: Motion (Framer Motion) 12.x

| Property | Value |
|----------|-------|
| **Package** | `motion` (also available as `framer-motion`, same package) |
| **Current Version** | 12.34.3 |
| **Confidence** | HIGH (npm registry verified) |
| **Note** | The library was rebranded from "Framer Motion" to "Motion" with a framework-agnostic core. Both `framer-motion` and `motion` npm packages resolve to the same code. |

**Why Motion is the secondary (React-specific) animation engine:**
- Declarative animation API (`initial`, `animate`, `exit`, `whileInView`) maps perfectly to React component patterns
- `AnimatePresence` enables exit animations that GSAP cannot do declaratively in React
- `layoutId` enables shared element transitions (critical for card-to-modal, list-to-detail patterns)
- `layout` prop enables automatic layout animations when DOM changes
- Spring physics system is more intuitive than CSS or GSAP springs for interactive elements
- `useScroll`, `useTransform`, `useVelocity` -- composable scroll-linked value transforms
- `whileHover`, `whileTap`, `whileDrag` -- gesture-driven animation states

**When to use Motion vs GSAP:**

| Scenario | Use |
|----------|-----|
| Scroll-pinned sections, horizontal scroll-jacks | GSAP ScrollTrigger |
| Complex multi-element choreography | GSAP Timeline |
| Text splitting and reveals | GSAP SplitText |
| React component entrance/exit | Motion |
| Shared element transitions | Motion layoutId |
| Interactive hover/tap/drag states | Motion |
| Layout animations (accordion, expand) | Motion layout |
| Parallax (simple) | Motion useScroll + useTransform |
| Parallax (complex, pinned) | GSAP ScrollTrigger |
| Page transitions | Motion AnimatePresence |
| Scroll velocity effects (skew, distort) | Motion useVelocity |

**Key insight:** These two libraries are complementary, not competing. GSAP orchestrates the macro (scroll-driven, timeline-based), Motion handles the micro (component-level, gesture-driven). Using both is the standard for premium sites.

### Tertiary: Native CSS Animations

| Property | Value |
|----------|-------|
| **Technology** | CSS Animations, Transitions, Scroll-Driven Animations |
| **Current Support** | Scroll-driven animations: Chrome 115+, Safari 18+, Firefox 128+ |
| **Confidence** | HIGH (platform feature, no dependency) |

**When to use native CSS over JS libraries:**
- Micro-interactions (hover states, button presses, toggle switches) -- CSS transitions are lighter
- Repeating ambient animations (floating, pulsing, gradient shifts) -- pure CSS, zero JS cost
- Shimmer/skeleton loading effects
- Simple scroll-linked progress bars (`animation-timeline: scroll()`)
- View-triggered reveals (`animation-timeline: view()`)
- Gradient text shifts, rotating borders, typewriter effects

**Native CSS scroll-driven animations are production-ready:**
```css
/* Zero-JS scroll progress bar */
.scroll-progress {
  animation: grow linear;
  animation-timeline: scroll();
}

/* Zero-JS fade-in on scroll */
.reveal {
  animation: fadeUp linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

**Recommendation:** Use native CSS for everything that does not need JS control (gesture response, dynamic values, timeline orchestration). This reduces bundle size and improves performance.

### Remotion 4.x (Specialized)

| Property | Value |
|----------|-------|
| **Package** | `remotion` |
| **Current Version** | 4.0.427 |
| **Confidence** | MEDIUM (version verified; API knowledge from training data, not verified against current docs) |

**What Remotion adds:**
- Programmatic video generation using React components
- Export to MP4/WebM from React code
- Frame-by-frame control over animations
- Useful for: hero background videos, product showcases, social media assets, OG images

**When to use Remotion:**
- Client needs video content (product demos, hero animations exported as video)
- Social media asset generation
- Animated OG images
- NOT for in-page web animations (use GSAP/Motion instead)

**Recommendation:** Include as an optional skill, not a core dependency. Most Awwwards sites use in-page animation, not embedded video. Remotion is powerful but niche for this use case.

### Smooth Scrolling: Lenis

| Property | Value |
|----------|-------|
| **Package** | `lenis` |
| **Current Version** | 1.3.17 |
| **Confidence** | HIGH (npm verified, widely used on Awwwards winners) |

**Why Lenis:**
- The standard smooth scrolling library for premium sites (used by most Awwwards SOTD winners)
- Replaces native scroll with smooth, momentum-based scrolling
- Integrates cleanly with GSAP ScrollTrigger
- Lightweight (~3KB gzipped)
- Alternative to GSAP ScrollSmoother (which requires Club license)

**Installation:**
```bash
npm install lenis
```

**Critical note:** Lenis must be configured to work WITH ScrollTrigger, not against it. The integration pattern is well-documented but easy to get wrong.

---

## 2. Component Ecosystems

### Foundation: shadcn/ui

| Property | Value |
|----------|-------|
| **Source** | ui.shadcn.com |
| **Current State** | Actively maintained, component collection growing |
| **Confidence** | HIGH (verified via existing skill + npm registry) |

**Why shadcn/ui is the foundation:**
- Not a library -- copy-paste components you own and customize
- Built on Radix UI primitives (accessible, headless, composable)
- Tailwind CSS styling (matches our styling approach)
- Full keyboard navigation, screen reader support, focus management
- Components are starting points, not endpoints -- they get customized per-project via Design DNA
- Used by: Vercel, most major Next.js projects, the entire React ecosystem

**Core components used in Awwwards builds:**
- Dialog, Sheet, Drawer (overlays)
- NavigationMenu, Sidebar, Command (navigation)
- Card, Tabs, Accordion (content)
- Button, Input, Select, Form (interaction)
- Toast/Sonner (feedback)
- Table, Badge, Avatar (data display)
- Carousel (via Embla)

**Key dependencies of shadcn/ui:**
```bash
# Core utilities
npm install clsx tailwind-merge class-variance-authority
npm install lucide-react  # Icon library

# Underlying primitives
# Installed per-component via `npx shadcn-ui@latest add [component]`
# Each installs its Radix UI primitive
```

| Package | Version | Purpose |
|---------|---------|---------|
| `clsx` | 2.1.1 | Conditional class composition |
| `tailwind-merge` | 3.5.0 | Tailwind class deduplication |
| `class-variance-authority` | 0.7.1 | Component variant definition |
| `lucide-react` | 0.575.0 | Icon library (consistent style) |
| `@radix-ui/react-*` | Various | Accessible headless primitives |
| `embla-carousel-react` | 8.6.0 | Carousel engine |
| `sonner` | 2.0.7 | Toast notifications |
| `cmdk` | 1.1.1 | Command palette |

### Premium Effects: Aceternity UI

| Property | Value |
|----------|-------|
| **Source** | ui.aceternity.com |
| **Type** | Copy-paste animated component library |
| **Confidence** | MEDIUM (known from training, versions not independently verified) |

**What Aceternity UI offers:**
- High-impact animated components designed for landing pages
- Spotlight effect, card hover effects, text reveal animations, particle backgrounds
- Built with Framer Motion + Tailwind
- Copy-paste model (like shadcn/ui but for visual effects)

**Best components for Awwwards builds:**
- `SpotlightCard` -- cursor-following gradient reveal on cards
- `TextGenerateEffect` -- character-by-character text reveal
- `BackgroundBeams` -- animated beam lines background
- `HeroParallax` -- parallax product showcase
- `LampEffect` -- dramatic spotlight reveal
- `InfiniteMovingCards` -- testimonial/logo marquee
- `3D Card Effect` -- perspective tilt on hover
- `Sparkles` -- particle sparkle effect
- `GlowingStarsCard` -- ambient star animation

**How to use:** Treat as an inspiration library and recipe source. Copy the effect pattern, adapt it to Design DNA tokens. Do NOT use raw Aceternity components without customization -- they will look generic.

### Premium Effects: Magic UI

| Property | Value |
|----------|-------|
| **Source** | magicui.design |
| **Type** | Copy-paste animated component collection |
| **Confidence** | MEDIUM (known from training) |

**What Magic UI offers:**
- Similar to Aceternity but with different effect vocabulary
- Animated borders, gradient text, orbit animations, dock-style navigation
- Built with Framer Motion + Tailwind
- Focuses on "magical" micro-interactions

**Best components for Awwwards builds:**
- `AnimatedBeam` -- connecting beam between elements (great for architecture diagrams)
- `MagicCard` -- gradient follow card
- `ShimmerButton` -- shimmer sweep CTA
- `NumberTicker` -- animated counter
- `Marquee` -- infinite scroll marquee
- `DotPattern` / `GridPattern` -- ambient backgrounds
- `Dock` -- macOS-style dock navigation
- `Globe` -- 3D globe (via Three.js/Cobe)
- `RetroGrid` -- retro grid background

### Component Marketplace: 21st.dev

| Property | Value |
|----------|-------|
| **Source** | 21st.dev |
| **Type** | Community component marketplace |
| **Confidence** | LOW (known from training, not independently verified for current state) |

**What 21st.dev offers:**
- Community-contributed React components
- Searchable marketplace format
- Variable quality -- some components are award-worthy, others are mediocre
- Can source specific components when a project needs something unique

**Recommendation:** Use 21st.dev as a research source during the brainstorming phase, not as a dependency. Source inspiration and patterns, then implement with proper Design DNA integration.

### Component Ecosystem Strategy

```
Layer 1 (Foundation):  shadcn/ui + Radix primitives
                       - Every project uses these
                       - Accessibility guaranteed
                       - Customized via Design DNA

Layer 2 (Effects):     Aceternity UI + Magic UI patterns
                       - Copy effect patterns, adapt to DNA
                       - Used for wow moments and PEAK beats
                       - NOT imported as dependencies

Layer 3 (Bespoke):     Custom implementations
                       - Unique interactions per-project
                       - Wow moments from skills (cinematic-motion, wow-moments)
                       - What makes a site SOTD-worthy
```

---

## 3. Framework-Specific Patterns

### Next.js (Primary Target)

| Property | Value |
|----------|-------|
| **Package** | `next` |
| **Current Version** | 16.1.6 |
| **Node Requirement** | >= 20.9.0 |
| **Confidence** | HIGH (npm verified) |

**Key architectural patterns for Awwwards builds:**
- **App Router** is the standard (Pages Router is legacy)
- **React Server Components** by default -- push `'use client'` to leaf components
- **Dynamic imports** with `ssr: false` for GSAP, Three.js, and heavy animation components
- **Metadata API** for SEO (static + dynamic `generateMetadata`)
- **`next/image`** for automatic image optimization (WebP/AVIF, lazy loading, blur placeholder)
- **`next/font`** for zero-CLS font loading (local fonts preferred for premium typography)
- **Route groups** `(marketing)` for organizing pages without URL impact
- **`template.tsx`** (not `layout.tsx`) for page transition animations
- **Parallel routes** `@modal` for intercepting routes with modal overlays

**Next.js 16 notable features (MEDIUM confidence -- version verified but features from training):**
- Turbopack as default bundler (significantly faster builds)
- Server Actions for form handling
- Partial prerendering (PPR) for hybrid static/dynamic pages
- Improved Image component with `sizes` auto-detection

**Critical Next.js patterns for animations:**
```tsx
// GSAP/Three.js components MUST disable SSR
const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

// Framer Motion page transitions use template.tsx, not layout.tsx
// layout.tsx persists across navigation; template.tsx remounts
```

### Astro (Secondary Target)

| Property | Value |
|----------|-------|
| **Package** | `astro` |
| **Current Version** | 5.17.3 |
| **Confidence** | HIGH (npm verified) |

**Why Astro for premium sites:**
- Zero JS by default -- ship only what's interactive
- Islands architecture -- surgical hydration of interactive components
- View Transitions API -- native page transitions with `transition:name` morphing
- Content Collections -- type-safe Markdown/MDX content
- Hybrid rendering -- static by default, opt-in SSR per page
- Astro Actions -- type-safe server functions with Zod validation
- Framework-agnostic -- React, Svelte, Vue, Solid islands in same page

**Astro 5 notable features:**
- Content Layer API (replaces older content collections)
- Server Islands (deferred rendering of specific components)
- `astro:env` module for type-safe environment variables
- Improved View Transitions with `transition:persist`

**Islands strategy for Awwwards builds:**
```
Static (zero JS):     Headers, footers, text sections, images
client:load:          Navigation menus, auth UI, theme toggles
client:visible:       Charts, carousels, animation sections, 3D scenes
client:idle:          Analytics, newsletter forms, non-critical widgets
client:only="react":  Three.js scenes (cannot SSR)
```

### React/Vite (Tertiary Target)

| Property | Value |
|----------|-------|
| **Current Approach** | React 19 + Vite 6 |
| **Confidence** | HIGH (standard ecosystem) |

**When to use React/Vite over Next.js:**
- Single-page applications (SPAs)
- Client-side only apps (no SSR needed)
- Prototyping and experimentation
- When the app runs entirely in a desktop shell (Tauri/Electron)

**Key differences from Next.js for skills:**
- No server components (everything is client)
- No `next/image` -- use `<img>` with manual optimization or vite-imagetools
- No `next/font` -- manual font loading with preload links
- No file-system routing -- use react-router or tanstack-router
- Vite's HMR is faster than Turbopack for development

### Tauri (Desktop Target)

| Property | Value |
|----------|-------|
| **Package** | `@tauri-apps/api` |
| **Current Version** | 2.10.1 |
| **Confidence** | MEDIUM (version verified, desktop-specific patterns from training) |

**Desktop-specific design patterns:**
- Custom title bar (draggable, integrated with app UI)
- System tray integration
- Window management (multi-window, minimize to tray)
- Native file dialogs and file system access
- Native notifications
- Deep links and protocol handlers
- Smaller binary than Electron (~10MB vs ~100MB+)

**Design considerations:**
- No browser chrome -- the app IS the window
- System-native look-and-feel vs custom branded experience
- Keyboard shortcuts are more important (power users)
- Window resizing behavior must be smooth
- Dark/light mode should follow system preference

### Electron (Desktop Target)

| Property | Value |
|----------|-------|
| **Current State** | Electron 34+ |
| **Confidence** | MEDIUM (mature platform, specific version from training) |

**When Electron over Tauri:**
- Need full Node.js runtime (heavy backend processing)
- Existing Electron ecosystem tooling required
- Cross-platform consistency is more important than binary size

**Design patterns overlap with Tauri:**
- Same custom title bar patterns
- Same window management patterns
- Same keyboard-first interaction design
- Main difference is implementation (Rust IPC vs Node IPC)

---

## 4. CSS & Styling

### Tailwind CSS v4

| Property | Value |
|----------|-------|
| **Package** | `tailwindcss` |
| **Current Version** | 4.2.0 |
| **Confidence** | HIGH (npm verified) |

**Tailwind v4 is a major rewrite. Key changes from v3:**

| Change | v3 | v4 |
|--------|----|----|
| Configuration | `tailwind.config.ts` | CSS-first with `@theme` directive |
| Import | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Color system | Config-based | CSS custom properties native |
| Container queries | Plugin required | Built-in `@container` utilities |
| Nesting | PostCSS plugin | Native CSS nesting |
| Performance | JIT compiler | Oxide engine (10x faster) |
| Custom values | `[]` arbitrary values | Same, plus `@theme` inline |

**CRITICAL for Genorah skills:** Skills must teach Tailwind v4 patterns, not v3. The configuration model changed fundamentally:

```css
/* Tailwind v4: CSS-first configuration */
@import "tailwindcss";

@theme {
  --color-bg-primary: #0a0a0a;
  --color-accent-1: #8b5cf6;
  --font-display: "Clash Display", system-ui;
  --font-body: "DM Sans", system-ui;
  /* All tokens defined in CSS, not JS config */
}
```

**Tailwind v4 features critical for premium design:**
- `@container` queries -- responsive components based on parent, not viewport
- `@starting-style` support -- animate from display:none
- Native CSS nesting -- cleaner component styles
- `color-mix()` support -- dynamic color operations
- `text-wrap: balance` / `text-wrap: pretty` utilities
- `dvh` / `svh` / `lvh` viewport units
- `subgrid` support

**Tailwind v4 compatibility note:** Tailwind v4 still supports a `tailwind.config.ts` file for JavaScript-based configuration, but the CSS-first `@theme` approach is now preferred. Genorah's Design DNA token system maps cleanly to `@theme` directives.

### CSS Custom Properties Strategy

Design DNA tokens should map directly to CSS custom properties:

```
Design DNA Token     -->  CSS Variable              -->  Tailwind Class
color.bgPrimary      -->  --color-bg-primary         -->  bg-bg-primary
color.accent1        -->  --color-accent-1           -->  text-accent-1
font.display         -->  --font-display             -->  font-display
spacing.section      -->  --space-section            -->  py-[var(--space-section)]
motion.easeDefault   -->  --ease-default             -->  ease-default
```

### Modern CSS Features to Leverage

| Feature | Support | Use Case |
|---------|---------|----------|
| Container queries | All modern browsers | Component-responsive layouts |
| Scroll-driven animations | Chrome 115+, Safari 18+, Firefox 128+ | Zero-JS scroll effects |
| View Transition API | Chrome 111+, Safari 18+ | Page transitions (Astro native) |
| `text-wrap: balance` | All modern browsers | Headline typography |
| `color-mix()` | All modern browsers | Dynamic color operations |
| CSS nesting | All modern browsers | Component scoping |
| Subgrid | All modern browsers | Precise grid alignment |
| `@starting-style` | Chrome 117+, Safari 17.5+ | Entry animations from display:none |
| `anchor()` positioning | Chrome 125+ | Popover/tooltip positioning |

---

## 5. Typography

### Variable Fonts Strategy

**Recommendation:** Use variable fonts for all premium typography. A single variable font file replaces multiple weight/style files, reduces HTTP requests, and enables smooth weight/width animations.

**Premium font sources (ranked by quality):**

| Source | Quality | Cost | Best For |
|--------|---------|------|----------|
| **Fontshare** (by Indian Type Foundry) | Excellent | Free | Display fonts: Clash Display, Cabinet Grotesk, Satoshi, General Sans |
| **Google Fonts** | Good-Excellent | Free | Body fonts: DM Sans, Inter, Plus Jakarta Sans, Outfit |
| **Font Squirrel** | Variable | Free | Curated free fonts |
| **Adobe Fonts** (Typekit) | Excellent | Subscription | Premium display: Acumin, Neue Haas Grotesk |
| **Pangram Pangram** | Excellent | Paid | Premium display: Monument Extended, Neue Montreal |
| **Commercial Type** | World-class | Paid | Editorial: Graphik, Druk, Atlas Grotesk |
| **Grilli Type** | World-class | Paid | Swiss: GT America, GT Walsheim, GT Super |

**Recommended distinctive pairings for Awwwards builds:**

```
1. Clash Display (display) + DM Sans (body)      -- Bold geometric + clean
2. Cabinet Grotesk (display) + Inter (body)       -- Characterful + precise
3. Satoshi (display) + Plus Jakarta Sans (body)   -- Contemporary + friendly
4. General Sans (display) + Outfit (body)         -- Modern + balanced
5. Instrument Serif (display) + Geist (body)      -- Elegant serif + tech sans
```

**Font loading strategy:**
- Next.js: Use `next/font/local` for variable fonts (self-hosted, zero CLS)
- Astro: Preload with `<link rel="preload">`, `@font-face` with `font-display: swap`
- All: Self-host fonts in WOFF2 format (never rely on Google Fonts CDN for premium builds)
- Subset fonts to Latin + extended Latin to reduce file size

**Variable font animation technique:**
```css
/* Weight animation on hover -- only possible with variable fonts */
@font-face {
  font-family: 'Clash Display';
  src: url('/fonts/ClashDisplay-Variable.woff2') format('woff2');
  font-weight: 200 700;
  font-display: swap;
}

.hover-weight {
  font-variation-settings: 'wght' 400;
  transition: font-variation-settings 0.3s ease;
}
.hover-weight:hover {
  font-variation-settings: 'wght' 700;
}
```

---

## 6. 3D & WebGL

### React Three Fiber + Drei (Primary)

| Property | Value |
|----------|-------|
| **Packages** | `three`, `@react-three/fiber`, `@react-three/drei` |
| **Versions** | Three.js 0.183.1, R3F 9.5.0, Drei 10.7.7 |
| **Confidence** | HIGH (npm verified, existing skill confirmed) |

**When to use 3D in premium sites:**
- Hero section ambient backgrounds (particle fields, gradient spheres)
- Product viewers (GLTF model loading, orbit controls)
- Interactive 3D elements (scroll-driven 3D transformations)
- Data visualization in 3D space

**Technology decision matrix:**

| Need | Use | Why |
|------|-----|-----|
| React project, interactive 3D | React Three Fiber + Drei | Declarative, React lifecycle integration |
| Simple 3D embeds, no coding | Spline | Visual editor, embed code, but heavy and less customizable |
| Non-React project (Astro/vanilla) | Three.js directly | No React wrapper needed |
| Custom shaders | Three.js + custom GLSL | R3F shaderMaterial or raw Three.js |
| Heavy 3D scene, cinematic quality | Three.js + postprocessing | @react-three/postprocessing or manual |

**R3F + Drei key capabilities:**
- `<Canvas>` -- React-wrapped WebGL context
- `<Float>` -- ambient floating animation
- `<Environment>` -- HDRI lighting with presets (studio, city, sunset)
- `<OrbitControls>` -- user interaction
- `<ContactShadows>` -- ground plane shadows
- `<useGLTF>` -- GLTF/GLB model loading
- `<Html>` -- HTML content within 3D space
- `<useScroll>` -- scroll-linked 3D animation
- `<shaderMaterial>` -- custom GLSL shaders
- `<Instances>` -- instanced rendering for many identical objects

**Critical patterns:**
```tsx
// Next.js: ALWAYS disable SSR for 3D scenes
const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

// Astro: ALWAYS use client:only
<Scene3D client:only="react" />

// Performance: Limit particles to 1000-3000, dispose materials in cleanup
```

### Spline (Visual 3D, Optional)

| Property | Value |
|----------|-------|
| **Package** | `@splinetool/react-spline` |
| **Current Version** | 4.1.0 |
| **Confidence** | HIGH (npm verified) |

**When to use Spline:**
- Client has Spline scene they want to embed
- Quick 3D prototype without writing shader code
- 3D interactions designed by a non-developer
- When visual editing speed matters more than optimization

**When NOT to use Spline:**
- Performance-critical sites (Spline runtime is heavy, ~200KB+)
- When you need fine-grained control over rendering
- When the 3D element is scroll-driven (better with R3F + GSAP)
- When targeting Core Web Vitals (LCP impact)

**Recommendation:** Support Spline as an option in skills, but default to R3F for custom 3D. Spline is a design tool integration, not a development tool.

---

## 7. Testing & Quality Verification

### Visual Testing: Playwright

| Property | Value |
|----------|-------|
| **Package** | `@playwright/test` |
| **Current Version** | 1.58.2 |
| **Confidence** | HIGH (npm verified) |

**Why Playwright for Awwwards verification:**
- Multi-browser testing (Chromium, Firefox, WebKit)
- Visual snapshot comparison (screenshot diffing)
- Mobile device emulation (iPhone, Android viewports)
- Network throttling for performance testing
- Video recording of test runs
- Built-in Accessibility testing via `page.accessibility.snapshot()`

**Awwwards-specific testing patterns:**
```typescript
// Test at all 4 critical breakpoints
const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'wide', width: 1440, height: 900 },
]

// Visual snapshot at each breakpoint
for (const bp of breakpoints) {
  test(`renders correctly at ${bp.name}`, async ({ page }) => {
    await page.setViewportSize(bp)
    await page.goto('/')
    await expect(page).toHaveScreenshot(`homepage-${bp.name}.png`)
  })
}
```

### Unit Testing: Vitest

| Property | Value |
|----------|-------|
| **Package** | `vitest` |
| **Current Version** | 4.0.18 |
| **Confidence** | HIGH (npm verified) |

**Use for:**
- Component behavior testing (React Testing Library integration)
- Hook testing
- Utility function testing
- NOT for visual quality (use Playwright screenshots)

### Accessibility: axe-core

| Property | Value |
|----------|-------|
| **Package** | `axe-core` |
| **Current Version** | 4.11.1 |
| **Confidence** | HIGH (npm verified) |

**Use for:**
- Automated WCAG 2.1 AA compliance checking
- Color contrast verification
- ARIA attribute validation
- Keyboard navigation testing
- Integration with both Vitest (`vitest-axe`) and Playwright (`@axe-core/playwright`)

### Performance: Lighthouse CI

| Property | Value |
|----------|-------|
| **Package** | `@lhci/cli` |
| **Confidence** | MEDIUM (standard Google tool) |

**Awwwards performance targets:**
- Performance: 90+ (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 8. Supporting Libraries

### Essential Utilities

| Library | Version | Purpose | Required By |
|---------|---------|---------|-------------|
| `clsx` | 2.1.1 | Conditional class composition | shadcn/ui, all components |
| `tailwind-merge` | 3.5.0 | Deduplicates conflicting Tailwind classes | `cn()` utility |
| `class-variance-authority` | 0.7.1 | Type-safe component variants | Button, Badge, etc. |
| `lucide-react` | 0.575.0 | Icon library (600+ consistent icons) | All UI |
| `next-themes` | latest | Dark/light mode toggle | Next.js projects |

### Data & State

| Library | Purpose | When to Use |
|---------|---------|-------------|
| `@tanstack/react-virtual` | List/grid virtualization | 100+ item lists |
| `@tanstack/react-query` | Async state management | Data-fetching heavy projects |
| `zustand` | Lightweight state management | Cross-component state |
| `nuqs` | URL search params state | Filter/sort UIs |

### Content & Media

| Library | Purpose | When to Use |
|---------|---------|-------------|
| `sharp` | Image processing | Build-time optimization |
| `@vercel/og` | OG image generation | Dynamic social sharing images |
| `rehype` / `remark` | MDX processing | Content-heavy sites (blog, docs) |

---

## 9. What NOT to Use

### Deprecated / Avoid

| Technology | Why Avoid | Use Instead |
|------------|-----------|-------------|
| **Tailwind CSS v3** | v4 is current, v3 config model is legacy | Tailwind CSS v4 |
| **jQuery animations** | Dead weight, GSAP does everything better | GSAP |
| **Animate.css** | Generic, zero customization, screams "template" | CSS keyframes or Motion |
| **AOS (Animate on Scroll)** | Basic, limited, performance issues | GSAP ScrollTrigger or Motion whileInView |
| **Swiper.js** | Heavyweight carousel, often overkill | Embla Carousel (lighter, more flexible) |
| **Bootstrap / Material UI** | Heavily opinionated, generic look, fights Design DNA | shadcn/ui + Tailwind |
| **Styled Components** | Runtime CSS-in-JS has performance overhead | Tailwind CSS |
| **Emotion** | Same runtime CSS-in-JS issue | Tailwind CSS |
| **Pages Router (Next.js)** | Legacy pattern, App Router is the standard | App Router |
| **Create React App** | Unmaintained, dead project | Vite |
| **Moment.js** | Massive bundle, deprecated by authors | `date-fns` or native `Intl.DateTimeFormat` |
| **Font Awesome** | Inconsistent quality, heavyweight | Lucide React (consistent, tree-shakeable) |

### Conditional Use (Not Default)

| Technology | When OK | When NOT |
|------------|---------|----------|
| **Storybook** | Design system documentation projects | Marketing/landing pages |
| **Remotion** | Video content generation needed | Standard web animation |
| **Spline** | Client has existing Spline scenes | New 3D from scratch |
| **tRPC** | Full-stack TypeScript projects | Frontend-only builds |
| **Prisma** | Backend integration needed | Genorah is frontend-only |

---

## 10. Version Pinning Recommendations

For skills to remain accurate, pin to major versions and document when minor versions matter:

```json
{
  "core": {
    "next": "^16.0.0",
    "astro": "^5.0.0",
    "react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "animation": {
    "gsap": "^3.12.0",
    "motion": "^12.0.0",
    "lenis": "^1.0.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^9.0.0",
    "@react-three/drei": "^10.0.0"
  },
  "components": {
    "lucide-react": "^0.400.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.0.0",
    "class-variance-authority": "^0.7.0",
    "embla-carousel-react": "^8.0.0",
    "sonner": "^2.0.0",
    "cmdk": "^1.0.0"
  },
  "testing": {
    "@playwright/test": "^1.50.0",
    "vitest": "^4.0.0",
    "axe-core": "^4.10.0"
  },
  "desktop": {
    "@tauri-apps/api": "^2.0.0"
  }
}
```

---

## 11. Stack Interaction Map

How libraries work together for Awwwards output:

```
                    Design DNA (tokens)
                         |
                    Tailwind v4 (@theme)
                    /        \
           shadcn/ui       CSS Variables
          (foundation)    (custom properties)
               |               |
        Radix Primitives   Motion Presets
               |          /           \
          Components   Motion      GSAP
          (interactive) (React)    (scroll)
               |          |          |
               +-----+----+----+-----+
                     |         |
                Page Output   3D Layer
                (HTML/CSS)   (R3F/Three)
                     |
              Playwright Tests
              (visual snapshots)
```

---

## Sources & Confidence

| Source | What It Verified | Confidence |
|--------|-----------------|------------|
| npm registry (live queries) | All package versions | HIGH |
| Existing Genorah v6.1.0 skills | API patterns, integration approaches | HIGH |
| PROJECT.md | Requirements and framework targets | HIGH |
| Training knowledge (May 2025) | Ecosystem positioning, when-to-use guidance | MEDIUM |
| Training knowledge (May 2025) | Tailwind v4 breaking changes, Next.js 16 features | MEDIUM (major versions confirmed via npm, specific features from training) |
| Training knowledge (May 2025) | Aceternity UI, Magic UI, 21st.dev specifics | LOW-MEDIUM (existence confirmed, specific component lists from training) |

### Verification Gaps

- **Tailwind CSS v4 `@theme` syntax**: Version 4.2.0 confirmed on npm, but the exact CSS-first configuration syntax is from training knowledge. The migration from `tailwind.config.ts` to `@theme` needs validation against current docs before writing skills.
- **Next.js 16 specific features**: Version 16.1.6 confirmed, but specific new features (PPR, Turbopack default) are from training. Should verify against nextjs.org/blog.
- **Astro 5 Content Layer API**: Version 5.17.3 confirmed, but specific API changes need verification against astro.build/docs.
- **Aceternity UI / Magic UI component names**: These may have been renamed or reorganized since training. Verify against their live sites when writing skills.
- **GSAP 3.14 new features**: Version confirmed, but any features added between 3.12 and 3.14 are not known. Check gsap.com/docs.
