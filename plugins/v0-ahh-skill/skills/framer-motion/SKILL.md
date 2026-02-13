---
name: framer-motion
description: "Framer Motion animations including variants, gestures, layout animations, page transitions, and scroll-triggered effects."
---

Use this skill when the user mentions framer motion, motion, animate, page transitions, layout animations, gesture animations, or animated components.

You are an expert at creating fluid, polished animations with Framer Motion in React/Next.js.

## Setup

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
```

## Basic Animations

### Fade In
```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
  Content
</motion.div>
```

### Fade Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  Content
</motion.div>
```

### Scale In
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Variants (Orchestrated Animations)

### Stagger Children
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((i) => (
    <motion.li key={i} variants={item}>{i}</motion.li>
  ))}
</motion.ul>
```

### Hover / Tap States
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

## Scroll Animations

### Animate on Scroll (whileInView)
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  Appears on scroll
</motion.div>
```

### Scroll Progress
```tsx
import { useScroll, useTransform, motion } from 'framer-motion'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50" style={{ scaleX }} />
}
```

### Parallax
```tsx
function Parallax({ children, offset = 50 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

  return (
    <div ref={ref}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
```

## AnimatePresence (Exit Animations)

```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

## Layout Animations

### Shared Layout
```tsx
<motion.div layout className="p-4 rounded-lg bg-muted">
  <motion.h2 layout="position">Title</motion.h2>
  {isExpanded && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Details</motion.p>}
</motion.div>
```

### Layout ID (Shared Element Transitions)
```tsx
// List item
<motion.div layoutId={`card-${id}`} className="cursor-pointer" onClick={() => setSelected(id)}>
  <motion.img layoutId={`image-${id}`} src={img} />
  <motion.h3 layoutId={`title-${id}`}>{title}</motion.h3>
</motion.div>

// Expanded view
<AnimatePresence>
  {selected && (
    <motion.div layoutId={`card-${selected}`} className="fixed inset-0 z-50 p-8 bg-background">
      <motion.img layoutId={`image-${selected}`} src={img} className="w-full" />
      <motion.h3 layoutId={`title-${selected}`}>{title}</motion.h3>
    </motion.div>
  )}
</AnimatePresence>
```

## Spring Physics

```tsx
// Snappy button
transition={{ type: "spring", stiffness: 400, damping: 17 }}

// Bouncy
transition={{ type: "spring", stiffness: 300, damping: 10 }}

// Smooth/slow
transition={{ type: "spring", stiffness: 100, damping: 20 }}

// Quick settle
transition={{ type: "spring", stiffness: 500, damping: 30 }}
```

## Gesture Animations

### Drag
```tsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
/>
```

### Drag to Dismiss
```tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100) onDismiss()
  }}
/>
```

## Page Transitions (Next.js)

```tsx
// app/template.tsx
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

## Reusable Animation Components

```tsx
function FadeIn({ children, delay = 0, direction = "up" }) {
  const directions = { up: { y: 20 }, down: { y: -20 }, left: { x: 20 }, right: { x: -20 } }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
```

## Best Practices

1. Always add `'use client'` - Framer Motion requires client components
2. Use `viewport={{ once: true }}` for scroll animations to prevent re-triggering
3. Prefer `spring` transitions for interactive elements (buttons, drags)
4. Prefer `easeOut` for entrance animations, `easeIn` for exits
5. Use `AnimatePresence mode="wait"` for sequential page/element transitions
6. Keep animations subtle - 0.2-0.5s for UI, 0.5-1s for decorative
7. Use `layout` prop for smooth size/position changes
8. Respect `prefers-reduced-motion` by checking with `useReducedMotion()`
