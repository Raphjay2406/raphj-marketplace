---
name: cursor-ecosystem
description: "Custom cursor state machine with contextual morphing: text cursor on paragraphs, expand on media, magnetic pull on buttons, distortion on images. Per-archetype cursor personalities. GSAP and motion/react implementations."
tier: domain
triggers: "custom cursor, cursor, cursor follower, magnetic cursor, cursor effect, cursor morph, cursor state"
version: "2.3.0"
---

## Layer 1: Decision Guidance

Custom cursors are the single most visible signal of an award-winning website. Not a novelty -- a communication tool. The cursor tells users what they can do before they do it: "this is draggable," "this opens media," "this text is selectable." Every state change must answer: "What affordance am I communicating?"

### When to Use

- **Portfolio / agency sites** -- cursor is the primary interaction signature, expected by judges and visitors
- **Luxury / fashion / editorial** -- cursor becomes part of the brand identity, reinforcing DNA tokens
- **Creative showcases** -- cursor personality differentiates the experience from template sites
- **Product landing pages** -- magnetic buttons and media-expand cursors increase perceived polish by 2-3 Awwwards points
- **Any project targeting Awwwards SOTD** -- custom cursor is table stakes for 8.0+ Design scores

### When NOT to Use

- **Data-dense dashboards** -- precision matters more than personality; use `dashboard-patterns` instead
- **Accessibility-critical apps** -- screen readers ignore custom cursors; ensure native cursor remains functional
- **E-commerce checkout flows** -- users need familiar affordances; cursor tricks create friction
- **Mobile-only projects** -- no cursor on touch devices; invest in `cinematic-motion` instead

### Decision Tree

- If project has desktop traffic > 30%, implement full cursor ecosystem
- If archetype is Japanese Minimal or Swiss, use minimal cursor (dot only, no ring)
- If archetype is Brutalist, use raw coordinate display or crosshair -- no custom element
- If project requires WCAG AAA, keep native cursor visible alongside custom overlay
- If page has draggable elements (carousel, slider), implement drag cursor state
- If page has media grid, implement media-expand cursor with contextual label

### Pipeline Connection

- **Referenced by:** Creative Director during archetype selection (cursor personality)
- **Referenced by:** Builder during Wave 1 (shared UI -- cursor is global)
- **Consumed at:** `/gen:build` Wave 1 step (cursor provider wraps entire app)
- **Audited at:** `/gen:audit` under Creative Courage and UX Intelligence categories

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Cursor State Machine (React Context + motion/react)

```tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorState = "default" | "text" | "media-expand" | "link-magnetic" | "drag" | "loading" | "hidden";

interface CursorContextType {
  state: CursorState;
  label: string;
  setState: (state: CursorState, label?: string) => void;
  resetState: () => void;
}

const CursorContext = createContext<CursorContextType | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be inside CursorProvider");
  return ctx;
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot follows exactly
  const dotX = useSpring(mouseX, { damping: 50, stiffness: 500 });
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 500 });

  // Ring follows with trailing delay
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 180 });
  const ringY = useSpring(mouseX, { damping: 25, stiffness: 180 });
  const ringXPos = useSpring(mouseX, { damping: 25, stiffness: 180 });
  const ringYPos = useSpring(mouseY, { damping: 25, stiffness: 180 });

  const setState = useCallback((s: CursorState, l?: string) => {
    setStateRaw(s);
    setLabel(l ?? "");
  }, []);

  const resetState = useCallback(() => {
    setStateRaw("default");
    setLabel("");
  }, []);

  // Touch detection -- hide custom cursor on touch devices
  useEffect(() => {
    const onTouch = () => setIsTouch(true);
    const onMouse = (e: MouseEvent) => {
      if (e.sourceCapabilities?.firesTouchEvents) return;
      setIsTouch(false);
    };
    window.addEventListener("touchstart", onTouch, { once: true });
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // RAF-driven mouse tracking
  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch, mouseX, mouseY]);

  // Compute visual properties from state
  const dotSize = state === "text" ? 2 : state === "hidden" ? 0 : 8;
  const ringSize =
    state === "media-expand" ? 80
    : state === "link-magnetic" ? 56
    : state === "drag" ? 56
    : state === "text" ? 0
    : state === "hidden" ? 0
    : 40;

  if (isTouch) {
    return (
      <CursorContext.Provider value={{ state, label, setState, resetState }}>
        {children}
      </CursorContext.Provider>
    );
  }

  return (
    <CursorContext.Provider value={{ state, label, setState, resetState }}>
      <style>{`* { cursor: none !important; }`}</style>
      {children}

      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-text mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          width: dotSize,
          height: dotSize,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />

      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-text/40 mix-blend-difference flex items-center justify-center"
        style={{
          x: ringXPos,
          y: ringYPos,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: state === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        {/* Contextual label inside ring */}
        {state === "media-expand" && (
          <motion.span
            className="text-xs font-medium text-text select-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {label || "View"}
          </motion.span>
        )}
        {state === "drag" && (
          <motion.span
            className="text-xs font-medium text-text select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Drag
          </motion.span>
        )}
      </motion.div>
    </CursorContext.Provider>
  );
}
```

#### Pattern: Magnetic Button Pull

```tsx
"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useCursor } from "./cursor-provider";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  pullStrength?: number; // 0-1, default 0.4
  proximityRadius?: number; // px, default 80
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  pullStrength = 0.4,
  proximityRadius = 80,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { setState, resetState } = useCursor();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150 });
  const springY = useSpring(y, { damping: 15, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < proximityRadius) {
      x.set(distX * pullStrength);
      y.set(distY * pullStrength);
      setState("link-magnetic");
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    resetState();
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
```

#### Pattern: Cursor Zone Components (Text, Media, Drag)

```tsx
"use client";

import { useCursor } from "./cursor-provider";

/** Wrap paragraphs -- cursor becomes thin text caret */
export function CursorTextZone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { setState, resetState } = useCursor();
  return (
    <div
      className={className}
      onMouseEnter={() => setState("text")}
      onMouseLeave={resetState}
    >
      {children}
    </div>
  );
}

/** Wrap images/videos -- cursor expands with label */
export function CursorMediaZone({
  children,
  label = "View",
  className = "",
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  const { setState, resetState } = useCursor();
  return (
    <div
      className={className}
      onMouseEnter={() => setState("media-expand", label)}
      onMouseLeave={resetState}
    >
      {children}
    </div>
  );
}

/** Wrap carousels/sliders -- cursor shows drag affordance */
export function CursorDragZone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { setState, resetState } = useCursor();
  return (
    <div
      className={className}
      onMouseEnter={() => setState("drag")}
      onMouseLeave={resetState}
    >
      {children}
    </div>
  );
}
```

#### Pattern: Reduced Motion Support

```tsx
"use client";

import { useReducedMotion } from "motion/react";

/**
 * Hook to determine cursor behavior under reduced motion.
 * Returns spring configs that disable trailing when prefers-reduced-motion is active.
 */
export function useCursorMotionConfig() {
  const prefersReduced = useReducedMotion();

  return {
    dotSpring: prefersReduced
      ? { damping: 100, stiffness: 1000 } // instant follow, no trailing
      : { damping: 50, stiffness: 500 },
    ringSpring: prefersReduced
      ? { damping: 100, stiffness: 1000 } // no trailing delay
      : { damping: 25, stiffness: 180 },
    enableScale: !prefersReduced, // disable scale animations
    enableLabel: true, // labels always visible -- they communicate affordance
  };
}
```

### Reference Sites

- **Locomotive.ca** (locomotive.ca) -- Gold standard cursor: dot+ring with contextual states, magnetic CTA pulls, drag cursor on project carousel, smooth GSAP spring physics
- **Obys Agency** (obys.agency) -- Cursor as design element: large expanding ring on project hover with project color tint, text cursor on editorial sections
- **Aristide Benoist** (aristidebenoist.com) -- Minimal luxury cursor: thin ring that scales on hover, brand-colored dot, no labels (pure visual), reduced motion handled gracefully
- **Lusion** (lusion.co) -- 3D-aware cursor that responds to WebGL scenes, ring distorts near interactive 3D objects, dot changes color per scene
- **Studio Freight** (studiofreight.com) -- Magnetic buttons with aggressive pull physics, cursor trail particles on creative sections, drag cursor on horizontal scroll

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Cursor Ecosystem |
|-----------|---------------------------|
| `text` | Dot color (via `bg-text`), label text color -- ensures cursor visibility on any background |
| `primary` | Magnetic button ring highlight color on active pull state |
| `accent` | Media-expand ring border color when cursor carries a label |
| `glow` | Neon Noir / Ethereal cursor glow effect color |
| `signature` | Luxury archetype ring color (gold, brand-specific) |
| `--motion-ease` | Spring config maps to DNA motion ease for consistent feel |
| `--motion-duration-base` | Ring expansion/contraction timing derived from DNA |
| `bg` | Ring fill on media-expand state (semi-transparent `bg/20`) |

### Archetype Variants

| Archetype | Cursor Personality |
|-----------|-------------------|
| **Brutalist** | No custom cursor element. Set `cursor: crosshair` globally OR display raw `x,y` coordinates as monospace text near pointer. No ring, no dot, no spring physics. |
| **Ethereal** | Large soft glow circle (60px) with `blur(20px)`, very slow trailing (`damping: 10, stiffness: 60`). No dot -- glow IS the cursor. Color: `glow` token at 30% opacity. |
| **Kinetic** | Fast snappy dot (6px), spring ring with overshoot (`damping: 8, stiffness: 400`). Ring bounces past target. Dot uses `mix-blend-difference`. |
| **Editorial** | Thin vertical line dot (2x20px) like a text caret. No ring. Cursor communicates "reading" as default state. Minimal, confident. |
| **Neo-Corporate** | Standard dot+ring but with subtle scale pulse on idle (breathing animation). Professional, not playful. Ring: 1px solid. |
| **Neon Noir** | Glowing neon ring with `box-shadow` light bleed (3 layers: `0 0 10px`, `0 0 20px`, `0 0 40px` using `glow` token). Ring pulses subtly. Dot: bright white 4px. |
| **Japanese Minimal** | Tiny precise dot (4px), no ring at all. No trailing, instant follow (`damping: 50, stiffness: 800`). On hover: dot grows to 6px. Nothing more. |
| **Luxury / Fashion** | Thin ring (1px solid) in `signature` token color (gold, champagne). Dot: 4px same color. Ring expands to 64px on media hover. Slow, deliberate spring (`damping: 30, stiffness: 120`). |
| **Playful / Startup** | Bouncy cursor (`damping: 8, stiffness: 200`) with emoji swap: default emoji, hover emoji changes per section. Ring: dashed border, wobble rotation on move. |
| **Glassmorphism** | Ring with `backdrop-blur(8px)` and glass fill (`bg/10`). Acts as magnifying lens. Dot: frosted white. |
| **Vaporwave** | Gradient ring cycling through DNA palette. Dot leaves brief afterimage trail (3 ghost dots, decreasing opacity). |
| **Dark Academia** | Minimal ink-colored dot, no ring. On link hover: small underline extends from dot. Scholarly, restrained. |
| **AI-Native** | Ring pulses with "thinking" animation during loading state. Dot: neural network node style (small with radiating connection lines on hover). |

### Pipeline Stage

- **Input from:** Design DNA (color tokens, motion tokens), archetype selection (cursor personality)
- **Output to:** Wave 1 shared UI layer (CursorProvider wraps `<body>`), all subsequent sections inherit cursor states via zone components
- **Wave placement:** Wave 1 always -- cursor is global infrastructure, must exist before any section builds

### Related Skills

- `cinematic-motion` -- cursor spring physics must align with global motion language; share DNA motion tokens
- `wow-moments` -- magnetic buttons and media-expand are wow moment candidates; cursor is a wow delivery mechanism
- `creative-tension` -- cursor can BE a tension element (e.g., cursor disappears in a Brutalist tension zone)
- `performance-animation` -- cursor runs on every frame; must use `will-change: transform`, compositor-only properties
- `design-archetypes` -- each archetype dictates cursor personality; archetype file is the source of truth
- `emotional-arc` -- cursor intensity can vary per beat (subtle in Breathe, aggressive in Peak)

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Cursor Covers Content

**What goes wrong:** Custom cursor element is too large (>100px default state) and covers text, buttons, or images. Users cannot see what they are clicking. Awwwards judges penalize usability.
**Instead:** Default ring max 40px. Media-expand max 80px with semi-transparent fill. Always use `pointer-events: none` on cursor elements. Label text must be small (12-14px).

### Anti-Pattern: No Touch Fallback

**What goes wrong:** Custom cursor renders on mobile/tablet, blocking touch targets. No `cursor: none` reset causes double cursor on desktop. Touch users see a frozen dot.
**Instead:** Detect touch with `touchstart` listener (not user-agent sniffing). Hide all custom cursor elements on touch. Restore `cursor: auto` on `<body>`. Use `matchMedia('(pointer: coarse)')` as initial check with `touchstart` override.

### Anti-Pattern: Heavy DOM Cursor

**What goes wrong:** Cursor built with deeply nested DOM (SVG with gradients, multiple blur layers, canvas elements) causing layout thrash on every mousemove. FPS drops below 30.
**Instead:** Max 2 DOM elements (dot + ring). Use `transform: translate()` only -- never `top/left`. Set `will-change: transform`. Use `mix-blend-difference` instead of manual color inversion. For glow effects, use `box-shadow` (compositor-friendly) not `filter: blur()` on the element itself.

### Anti-Pattern: Cursor State Flicker

**What goes wrong:** Cursor flickers between states when hovering element boundaries (e.g., link inside paragraph triggers rapid text->link->text transitions). Users see jarring size oscillations.
**Instead:** Use `onMouseEnter`/`onMouseLeave` with event delegation on zone wrappers, not on individual elements. Add 50ms debounce on state transitions. Nest zones correctly: `<CursorTextZone>` wraps paragraph, `<MagneticButton>` inside it overrides via `stopPropagation` on the enter event.

### Anti-Pattern: Ignoring Reduced Motion

**What goes wrong:** Users with `prefers-reduced-motion` see a trailing cursor that causes motion sickness. The spring delay between dot and ring creates persistent motion across the entire viewport.
**Instead:** Under reduced motion: set both dot and ring to instant follow (high damping, high stiffness). Keep state changes (expand, label) as they communicate affordance. Disable only the trailing/spring delay and scale animations.

### Anti-Pattern: Custom Cursor Without Native Fallback

**What goes wrong:** CSS `cursor: none` applied globally but custom cursor fails to render (JS error, hydration mismatch, browser extension conflict). User has no cursor at all.
**Instead:** Apply `cursor: none` only after custom cursor mounts successfully. Use a `useEffect` to set `document.body.style.cursor = 'none'` and clean up on unmount. If the CursorProvider errors, native cursor remains visible.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Cursor DOM elements | 1 | 2 | count | HARD -- max dot + ring, no additional elements |
| Dot size (default state) | 2 | 12 | px | HARD -- larger dots obstruct content |
| Ring size (default state) | 0 | 48 | px | HARD -- larger rings distract |
| Ring size (expanded state) | 48 | 96 | px | SOFT -- beyond 96px covers too much content |
| Spring damping (dot) | 15 | 100 | - | SOFT -- below 15 feels broken, above 100 is instant |
| Spring stiffness (dot) | 200 | 1000 | - | SOFT -- bounds for responsive-feeling cursor |
| Spring damping (ring) | 8 | 50 | - | SOFT -- ring must visibly trail the dot |
| Magnetic pull radius | 40 | 120 | px | HARD -- beyond 120px pulls from too far, feels broken |
| Magnetic pull strength | 0.1 | 0.6 | ratio | HARD -- beyond 0.6 element moves too far from origin |
| Cursor z-index | 9990 | 9999 | - | HARD -- must be above all content |
| Touch breakpoint | - | 0 | custom cursors | HARD -- zero custom cursor elements on touch devices |
| Reduced motion trailing | - | 0 | ms | HARD -- instant follow under prefers-reduced-motion |
