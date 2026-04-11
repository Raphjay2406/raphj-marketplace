---
name: smooth-scroll-setup
description: "Lenis smooth scroll integration for React/Next.js/Astro. The 'expensive feel' foundation that separates award sites from templates. Configuration recipes, GSAP ScrollTrigger integration, per-archetype momentum tuning, accessibility handling."
tier: domain
triggers: "smooth scroll, Lenis, scroll feel, scroll momentum, scroll behavior, scroll hijack, scroll library, locomotive scroll"
version: "2.3.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Award-targeting projects** where scroll feel IS part of the design experience
- **Projects with scroll-driven animations** (GSAP ScrollTrigger, scroll-driven CSS) that need consistent scroll behavior
- **Parallax-heavy layouts** where native scroll jank would be visible
- **Portfolio, agency, luxury** sites where perceived quality matters in every micro-interaction

### When NOT to Use

- **Content-first sites** (blogs, docs, dashboards) -- native scroll is fine, Lenis adds complexity
- **Mobile-only projects** -- Mobile browsers handle scroll natively and smooth-scroll libraries often fight with iOS rubber-banding
- **Accessibility-critical projects** -- Some users rely on native scroll behavior. Always respect `prefers-reduced-motion`
- **Simple sites** with < 5 sections and no scroll-driven animations

### Decision Tree

```
Does the project have scroll-driven animations (GSAP, scroll-driven CSS)?
  YES → Lenis recommended (consistent scroll events, better GSAP integration)
  NO → Is the archetype premium/creative (Luxury, Ethereal, Kinetic, Neon Noir)?
    YES → Lenis adds the "expensive feel" — recommended
    NO → Native scroll is fine. Skip Lenis.
```

---

## Layer 2: Implementation Reference

### Basic Setup (Next.js App Router)

```tsx
// lib/lenis.tsx
'use client';
import { ReactLenis } from 'lenis/react';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{
      lerp: 0.1,          // Smoothness (0.01 = very smooth, 0.1 = snappy)
      duration: 1.2,       // Scroll duration
      smoothWheel: true,   // Smooth mousewheel
      syncTouch: false,    // Don't fight mobile touch scroll
    }}>
      {children}
    </ReactLenis>
  );
}

// app/layout.tsx
import { SmoothScrollProvider } from '@/lib/lenis';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

### Astro Setup

```astro
---
// src/layouts/Layout.astro
---
<html>
  <body>
    <slot />
    <script>
      import Lenis from 'lenis';

      const lenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Respect reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis.destroy();
      }
    </script>
  </body>
</html>
```

### GSAP ScrollTrigger Integration

```tsx
'use client';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPWithLenis() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Connect Lenis scroll to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
    };
  }, [lenis]);
}
```

### Per-Archetype Momentum Tuning

| Archetype | lerp | duration | easing | Feel |
|-----------|------|----------|--------|------|
| Brutalist | 0.15 | 0.8 | `(t) => t` (linear) | Snappy, no luxury |
| Ethereal | 0.05 | 2.0 | `(t) => 1 - Math.pow(1 - t, 4)` | Slow, dreamy float |
| Kinetic | 0.12 | 1.0 | spring-like | Energetic with overshoot feel |
| Editorial | 0.08 | 1.4 | ease-out | Measured, precise |
| Neo-Corporate | 0.1 | 1.2 | default | Professional, balanced |
| Luxury/Fashion | 0.06 | 1.8 | ease-out-quart | Languid, expensive |
| Japanese Minimal | 0.07 | 1.6 | ease-in-out | Deliberate, zen |
| Neon Noir | 0.1 | 1.0 | default | Smooth but not slow |
| Playful/Startup | 0.12 | 0.9 | ease-out-back | Slightly bouncy |
| Data-Dense | 0.15 | 0.8 | default | Fast, functional |

### Scroll-to-Anchor

```tsx
// Smooth scroll to hash anchors
import { useLenis } from 'lenis/react';

function AnchorLink({ href, children }: { href: string; children: React.ReactNode }) {
  const lenis = useLenis();

  return (
    <a href={href} onClick={(e) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target && lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      }
    }}>
      {children}
    </a>
  );
}
```

### Scroll Stop/Start (for Modals, Drawers)

```tsx
import { useLenis } from 'lenis/react';

function useScrollLock() {
  const lenis = useLenis();

  return {
    lock: () => lenis?.stop(),
    unlock: () => lenis?.start(),
  };
}
```

### Reduced Motion Handling

```tsx
'use client';
import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'motion/react';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  // Skip Lenis entirely for reduced motion users
  if (prefersReduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Smooth Scroll Usage |
|-----------|-------------------|
| Archetype personality | Drives `lerp` and `duration` values (see tuning table) |
| `--motion-duration-*` | Can inform scroll duration scale |
| `--motion-easing-*` | Can inform custom easing function |

### Pipeline Stage

- **Input from:** DESIGN-DNA.md (archetype for tuning), PROJECT.md (performance requirements)
- **Output to:** Wave 0 scaffold installs Lenis and configures provider
- **Referenced by:** animation-specialist (GSAP integration), builder (scroll-to-anchor), cinematic-motion (scroll events)

### Related Skills

- **cinematic-motion** -- Scroll-driven animations use Lenis scroll events
- **performance-animation** -- Lenis adds ~12KB gzipped to JS bundle
- **page-transitions** -- Lenis must be paused during page transitions

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Smooth Scroll on Mobile Touch
**What goes wrong:** `syncTouch: true` fights with iOS Safari's native scroll, rubber-banding, and momentum. Results in janky, unresponsive scroll on mobile.
**Instead:** Always set `syncTouch: false`. Let mobile browsers handle touch scroll natively.

### Anti-Pattern: Lenis Without GSAP Connection
**What goes wrong:** Using Lenis for smooth scroll but GSAP ScrollTrigger for animations. The two systems use different scroll positions, causing animation timing mismatches.
**Instead:** Always connect Lenis to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and run Lenis RAF through GSAP ticker.

### Anti-Pattern: Not Respecting Reduced Motion
**What goes wrong:** Users with `prefers-reduced-motion: reduce` get smooth scroll that feels disorienting or causes motion sickness.
**Instead:** Disable Lenis entirely for reduced motion users. Native scroll is the accessible default.

### Anti-Pattern: Lenis on Content-Heavy Pages
**What goes wrong:** Documentation sites, blogs, or dashboards with smooth scroll feel sluggish. Users need to scroll fast through long content.
**Instead:** Only use Lenis on creative/portfolio/luxury sites where scroll IS the experience. Content sites benefit from native scroll speed.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| lerp | 0.03 | 0.2 | ratio | SOFT -- lower = smoother, higher = snappier |
| duration | 0.6 | 2.5 | seconds | SOFT -- never exceed 2.5s (feels broken) |
| JS bundle impact | -- | 15 | KB gzipped | SOFT -- Lenis is ~12KB |
| syncTouch | false | false | boolean | HARD -- never enable on production |
| Reduced motion | -- | -- | -- | HARD -- must skip Lenis entirely |
