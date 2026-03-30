---
name: glow-neon-effects
description: "Neon glow effects, light bleeding, luminous borders, gradient glow, spotlight effects, and ambient lighting for dark UI."
---

Use this skill when the user mentions glow, neon, light effect, luminous, glowing border, spotlight, light bleeding, ambient light, or radiant design.

You are an expert at creating sophisticated light and glow effects that elevate dark interfaces to premium quality.

## Glow Buttons

### Soft Glow
```tsx
<button className="rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-300">
  Get Started
</button>
```

### Intense Neon
```tsx
<button className="rounded-lg bg-[#00ff88] px-6 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(0,255,136,0.4),0_0_45px_rgba(0,255,136,0.2),0_0_80px_rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5),0_0_60px_rgba(0,255,136,0.3),0_0_100px_rgba(0,255,136,0.15)] transition-all duration-300">
  Launch
</button>
```

### Animated Pulse Glow
```tsx
<button className="relative rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-semibold text-white">
  <span className="absolute inset-0 rounded-xl bg-[#6366f1] animate-ping opacity-20" />
  <span className="relative">Live Now</span>
</button>
```

## Glowing Borders

### Static Gradient Border
```tsx
<div className="rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#ec4899] to-[#f59e0b] p-[1px]">
  <div className="rounded-2xl bg-[#0a0a0f] p-6">
    {children}
  </div>
</div>
```

### Animated Rotating Border
```tsx
<div className="relative rounded-2xl overflow-hidden p-[1px]">
  <div className="absolute inset-0 bg-[conic-gradient(from_var(--angle),#6366f1,#ec4899,#f59e0b,#6366f1)] animate-[spin_4s_linear_infinite]" />
  <div className="relative rounded-2xl bg-[#0a0a0f] p-6">
    {children}
  </div>
</div>
```

### Glow on Hover Border
```tsx
<div className="group relative rounded-2xl border border-white/[0.06] bg-[#111113] p-6 transition-all hover:border-[#6366f1]/40">
  {/* Glow behind the card */}
  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#6366f1]/0 via-[#6366f1]/20 to-[#6366f1]/0 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
  {children}
</div>
```

## Ambient Glow / Light Orbs

### Background Orbs
```tsx
function AmbientGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-15%] left-[10%] h-[500px] w-[500px] rounded-full bg-[#6366f1]/20 blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[15%] h-[400px] w-[400px] rounded-full bg-[#ec4899]/15 blur-[130px]" />
      <div className="absolute top-[40%] right-[30%] h-[300px] w-[300px] rounded-full bg-[#06b6d4]/10 blur-[100px]" />
    </div>
  )
}
```

### Animated Breathing Orbs
```tsx
<div className="absolute top-[-15%] left-[10%] h-[500px] w-[500px] rounded-full bg-[#6366f1]/15 blur-[150px] animate-[breathe_8s_ease-in-out_infinite]" />
// @keyframes breathe { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.1); } }
```

## Spotlight / Mouse Follow

### Card Spotlight
```tsx
'use client'
import { useRef, useState } from 'react'

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-white/[0.06] bg-[#111113] p-6 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.12), transparent 40%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
```

## Text Glow

### Glowing Headline
```tsx
<h1 className="text-6xl font-bold text-white [text-shadow:0_0_40px_rgba(99,102,241,0.4),0_0_80px_rgba(99,102,241,0.2)]">
  Radiant
</h1>
```

### Neon Text
```tsx
<h1 className="text-6xl font-bold text-[#00ff88] [text-shadow:0_0_10px_rgba(0,255,136,0.6),0_0_40px_rgba(0,255,136,0.3),0_0_80px_rgba(0,255,136,0.15)]">
  NEON
</h1>
```

## Glowing Separators

### Gradient Line
```tsx
<div className="h-[1px] bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent" />
```

### Glowing Dot Divider
```tsx
<div className="flex items-center justify-center gap-1 py-8">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="h-1 w-1 rounded-full bg-[#6366f1] shadow-[0_0_6px_rgba(99,102,241,0.6)]" style={{ opacity: 1 - Math.abs(i - 2) * 0.3 }} />
  ))}
</div>
```

## Icon Glow

```tsx
// Glowing icon container
<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366f1]/10 shadow-[inset_0_0_12px_rgba(99,102,241,0.15)]">
  <Zap className="h-6 w-6 text-[#818cf8] drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
</div>
```

## Color Palettes for Glow

```tsx
// Indigo/Purple glow
shadow: "rgba(99,102,241,0.4)"   text: "#818cf8"   bg: "#6366f1"

// Cyan/Teal glow
shadow: "rgba(6,182,212,0.4)"    text: "#22d3ee"   bg: "#06b6d4"

// Pink/Magenta glow
shadow: "rgba(236,72,153,0.4)"   text: "#f472b6"   bg: "#ec4899"

// Green/Emerald glow
shadow: "rgba(34,197,94,0.4)"    text: "#4ade80"   bg: "#22c55e"

// Amber/Orange glow
shadow: "rgba(245,158,11,0.4)"   text: "#fbbf24"   bg: "#f59e0b"

// Red glow
shadow: "rgba(239,68,68,0.4)"    text: "#f87171"   bg: "#ef4444"
```

## Best Practices

1. **Layer multiple shadow values** for realistic glow (near + mid + far)
2. **Glow colors should match the element color** not generic white
3. **Use blur-[100px]+ for ambient orbs** - small blur looks cheap
4. **Glow intensity:** subtle (0.1-0.2 opacity) for ambient, medium (0.3-0.4) for accents, intense (0.5+) for neon
5. **Animate glow on hover** not on load - let it be discovered
6. **Max 2-3 glow colors per page** - too many looks like a rave
7. **Text shadow for glow text** not box-shadow
8. **Always combine glow with dark backgrounds** - glow on light bg looks wrong
9. **Breathing/pulsing** should be slow (6-10s) and subtle

## Design System Integration

### Theme-Aware Glow Colors
```tsx
// Instead of hardcoded hex colors, use CSS variables for theme-aware glow:

// In globals.css or tailwind config:
// --glow-primary: 99 102 241;    /* indigo RGB */
// --glow-accent: 236 72 153;     /* pink RGB */
// --glow-success: 34 197 94;     /* green RGB */

// Usage with opacity control:
className="shadow-[0_0_20px_rgba(var(--glow-primary),0.35)]"
className="bg-[rgba(var(--glow-primary),0.1)]"
className="text-[rgb(var(--glow-primary))]"

// This lets you swap glow palettes via CSS variable changes,
// e.g., different glow colors per section or per theme.
```

### Glow Intensity Scale
```tsx
// Define consistent glow levels to reuse across components:

// Level 1 — Subtle ambient (backgrounds, section mood)
shadow-[0_0_60px_rgba(var(--glow-primary),0.08)]

// Level 2 — Soft accent (cards, containers on hover)
shadow-[0_0_20px_rgba(var(--glow-primary),0.2)]

// Level 3 — Medium emphasis (buttons, active elements)
shadow-[0_0_20px_rgba(var(--glow-primary),0.35),0_0_60px_rgba(var(--glow-primary),0.15)]

// Level 4 — Strong neon (hero CTAs, featured elements)
shadow-[0_0_15px_rgba(var(--glow-primary),0.4),0_0_45px_rgba(var(--glow-primary),0.2),0_0_80px_rgba(var(--glow-primary),0.1)]

// Level 5 — Intense (sparingly — neon signs, special effects)
shadow-[0_0_10px_rgba(var(--glow-primary),0.6),0_0_40px_rgba(var(--glow-primary),0.4),0_0_80px_rgba(var(--glow-primary),0.2),0_0_120px_rgba(var(--glow-primary),0.1)]
```

### Tailwind Plugin Approach
```js
// tailwind.config.js — define glow utilities once
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'glow-sm': '0 0 20px rgba(var(--glow-primary), 0.2)',
        'glow-md': '0 0 20px rgba(var(--glow-primary), 0.35), 0 0 60px rgba(var(--glow-primary), 0.15)',
        'glow-lg': '0 0 15px rgba(var(--glow-primary), 0.4), 0 0 45px rgba(var(--glow-primary), 0.2), 0 0 80px rgba(var(--glow-primary), 0.1)',
      },
    },
  },
}
// Then use: className="shadow-glow-sm hover:shadow-glow-md transition-shadow"
```

## When to Use Each Effect

| Effect | Best For | Avoid When |
|--------|----------|------------|
| **Soft glow button** | Primary CTAs, important actions | Secondary/tertiary buttons (too much emphasis) |
| **Neon glow button** | Hero CTAs, launch buttons, special actions | Regular UI buttons, form submits |
| **Gradient border** | Featured cards, premium tiers, selected states | Every card (loses meaning) |
| **Animated border** | Hero elements, loading states, special cards | More than 1-2 per page (too distracting) |
| **Hover glow border** | Card grids, interactive lists | Static content, text blocks |
| **Ambient orbs** | Hero backgrounds, section mood, page atmosphere | Small components, tight layouts |
| **Spotlight card** | Feature cards, interactive grids | Mobile (no cursor), simple lists |
| **Text glow** | Hero headlines, key phrases | Body text, paragraphs |
| **Neon text** | Titles, brand names, special emphasis | More than 1-2 words per section |
| **Gradient line** | Section dividers, visual breaks | Between every element (overuse) |
| **Icon glow** | Feature icons, status indicators | Decorative icons, logos |
| **Pulse glow** | Live indicators, active states, notifications | Static elements, many items at once |

## Performance Notes

```
Effect               | GPU Cost | Repaint | Recommendation
---------------------|----------|---------|---------------
box-shadow glow      | Low      | No      | Safe to use freely
text-shadow glow     | Low      | No      | Safe on headings
blur-[100px]+ orbs   | Medium   | No      | Max 3 per viewport
backdrop-blur        | High     | Yes     | Max 1-2 per viewport
animated border spin | Medium   | No      | Max 1 per viewport
cursor spotlight     | Low      | No      | JS mousemove is cheap
animate-ping         | Low      | No      | Keep to 1-2 instances

Tips:
- box-shadow is GPU-composited, so glow buttons/cards are essentially free
- blur on large elements (500px+ orbs) costs more — limit to 2-3 visible
- Animated conic-gradient borders trigger paint — limit to 1 hero element
- Combine multiple shadow layers in ONE property (not stacked divs)
- Use will-change: transform on animated glow elements for GPU compositing
```

## Reduced Motion Fallback

```tsx
// Glow is safe for reduced-motion users (it's a static visual)
// But ANIMATED glow should respect the preference:

// Breathing orbs — disable animation, keep the glow
className="bg-[#6366f1]/15 blur-[150px] motion-safe:animate-[breathe_8s_ease-in-out_infinite]"

// Pulse glow — disable ping, keep the button
<span className="absolute inset-0 rounded-xl bg-[#6366f1] motion-safe:animate-ping opacity-20" />

// Rotating border — stop rotation, keep the gradient border visible
className="motion-safe:animate-[spin_4s_linear_infinite]"

// Hover glow is fine — it's user-initiated, not auto-playing
```
