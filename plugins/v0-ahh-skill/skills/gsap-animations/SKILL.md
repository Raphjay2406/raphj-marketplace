---
name: gsap-animations
description: "GSAP animations including ScrollTrigger, timelines, tweens, text animations, and scroll-driven effects for React/Next.js."
---

Use this skill when the user mentions GSAP, GreenSock, ScrollTrigger, timeline animation, tween, scroll-driven animation with GSAP, or cinematic animations.

You are an expert at creating high-performance animations with GSAP in React/Next.js.

## Setup

```bash
npm install gsap
```

```tsx
'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

## Basic Tweens

```tsx
export default function Component() {
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // From tween (animate FROM these values to current state)
      gsap.from(boxRef.current, { opacity: 0, y: 50, duration: 1, ease: "power3.out" })

      // To tween (animate TO these values)
      gsap.to(".box", { x: 100, rotation: 360, duration: 2, ease: "elastic.out(1, 0.3)" })

      // FromTo tween
      gsap.fromTo(".element", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 })
    })

    return () => ctx.revert() // Cleanup
  }, [])

  return <div ref={boxRef}>Animated</div>
}
```

## Timelines

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } })

    tl.from(".hero-title", { opacity: 0, y: 30 })
      .from(".hero-subtitle", { opacity: 0, y: 20 }, "-=0.3")    // Overlap by 0.3s
      .from(".hero-cta", { opacity: 0, y: 20 }, "-=0.2")
      .from(".hero-image", { opacity: 0, scale: 0.95 }, "-=0.4")
  })

  return () => ctx.revert()
}, [])
```

## ScrollTrigger

### Basic Scroll Animation
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(".fade-section", {
      scrollTrigger: {
        trigger: ".fade-section",
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      duration: 1,
    })
  })

  return () => ctx.revert()
}, [])
```

### Pinning
```tsx
gsap.to(".horizontal-scroll", {
  xPercent: -100 * (panels.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    end: () => "+=" + document.querySelector(".horizontal-scroll")!.scrollWidth,
  },
})
```

### Scrub (Scroll-linked)
```tsx
gsap.to(".progress-bar", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
})
```

### Batch Stagger (Multiple Elements)
```tsx
ScrollTrigger.batch(".card", {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    })
  },
  start: "top 85%",
})
```

## Text Animations

### Split Text Reveal (using SplitText plugin or manual spans)
```tsx
// Wrap each word in a span in JSX - avoid innerHTML for safety
function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="split-word inline-block">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

// Then animate
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(".split-word", {
      y: "100%",
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
      scrollTrigger: { trigger: ".split-text", start: "top 80%" },
    })
  })
  return () => ctx.revert()
}, [])
```

### Counter Animation
```tsx
// Use a ref to safely update text content
const counterRef = useRef<HTMLSpanElement>(null)

useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to({ val: 0 }, {
      val: 1000,
      duration: 2,
      ease: "power1.inOut",
      snap: { val: 1 },
      onUpdate: function () {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(this.targets()[0].val))
        }
      },
      scrollTrigger: { trigger: counterRef.current, start: "top 80%" },
    })
  })
  return () => ctx.revert()
}, [])

<span ref={counterRef}>0</span>
```

## Easing Reference

```tsx
// Common eases
"power1.out"      // Subtle deceleration
"power2.out"      // Medium deceleration
"power3.out"      // Strong deceleration (most versatile)
"power4.out"      // Very strong deceleration
"back.out(1.7)"   // Overshoot then settle
"elastic.out(1, 0.3)" // Elastic bounce
"bounce.out"      // Bouncing ball
"expo.out"        // Exponential deceleration
"circ.out"        // Circular easing
"none"            // Linear (for scrub)

// .in = accelerate, .out = decelerate, .inOut = both
```

## Horizontal Scroll Section

```tsx
export default function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".h-panel")

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + scrollRef.current!.offsetWidth,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={scrollRef} className="flex w-[400vw]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-panel w-screen h-screen flex items-center justify-center">
            Section {i}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## React Cleanup Pattern

```tsx
// ALWAYS use gsap.context() for cleanup in React
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations here
  }, containerRef) // Scope to a ref for selector safety

  return () => ctx.revert() // Kills all animations + ScrollTriggers
}, [])
```

## Best Practices

1. **Always use `gsap.context()`** with cleanup via `ctx.revert()` in `useEffect`
2. **Scope animations** to a container ref to avoid conflicts
3. Use `ScrollTrigger.batch()` for staggered grid reveals
4. Use `scrub: true` or `scrub: 1` for scroll-linked animations
5. Default to `"power3.out"` ease - it works for almost everything
6. Use `toggleActions` to control replay behavior on scroll
7. Add `'use client'` directive - GSAP requires client-side rendering
8. Prefer `gsap.from()` for entrance animations (animate FROM hidden state)
9. Use `stagger` for sequential element reveals
10. Respect `prefers-reduced-motion`: check `window.matchMedia` and skip animations
11. Avoid using innerHTML for text splitting - use React JSX spans instead
