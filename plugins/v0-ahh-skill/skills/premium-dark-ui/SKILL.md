---
name: premium-dark-ui
description: "Premium dark UI design with depth, glass morphism, surface hierarchy, neon accents, and sophisticated dark mode patterns."
---

Use this skill when the user mentions dark mode, dark UI, dark theme, dark design, dark dashboard, night mode, or premium dark interface.

You are an expert at crafting premium dark interfaces that feel sophisticated, not just "white inverted to black."

## Dark Color System

### Surface Hierarchy (NOT just one shade of dark)
```tsx
// Layer 0 - Base/Background (deepest)
className="bg-[#09090b]"  // Near-black with slight warmth
// or
className="bg-[#0a0a0f]"  // Near-black with blue undertone

// Layer 1 - Card/Panel (elevated)
className="bg-[#111113]"  // Subtle lift from base

// Layer 2 - Popover/Modal (floating)
className="bg-[#18181b]"  // Clearly elevated

// Layer 3 - Input/Interactive (interactive surface)
className="bg-[#1f1f23]"  // Distinguishable

// Layer 4 - Hover state
className="bg-[#27272a]"  // Hover lift
```

### Border Strategy
```tsx
// Subtle borders (barely visible, creates definition)
className="border border-white/[0.06]"

// Medium borders (for cards, inputs)
className="border border-white/[0.08]"

// Prominent borders (for active/focus states)
className="border border-white/[0.15]"

// Gradient border
<div className="rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent p-[1px]">
  <div className="rounded-xl bg-[#111113] p-6">{children}</div>
</div>
```

### Text Hierarchy in Dark Mode
```tsx
// Primary text (headings, important content)
className="text-[#fafafa]"  // Almost white, not pure #fff

// Secondary text (body, descriptions)
className="text-[#a1a1aa]"  // Zinc-400 equivalent

// Tertiary text (labels, metadata)
className="text-[#71717a]"  // Zinc-500 equivalent

// Disabled/muted
className="text-[#3f3f46]"  // Zinc-700 equivalent

// Gradient text for headlines
className="bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent"
```

## Glass Morphism (Done Right)

```tsx
// Frosted glass card
<div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
  {children}
</div>

// Glass navigation bar
<nav className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
  {/* nav content */}
</nav>

// Glass input
<input className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 backdrop-blur-sm" />
```

## Glow & Light Effects

### Accent Glow
```tsx
// Button with glow
<button className="relative rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow">
  Get Started
</button>

// Card with accent glow on hover
<div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-6 transition-all hover:border-[#6366f1]/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
  {children}
</div>
```

### Ambient Background Glow
```tsx
<div className="relative overflow-hidden">
  {/* Gradient orbs */}
  <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#6366f1]/20 blur-[120px]" />
  <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#ec4899]/15 blur-[120px]" />
  <div className="absolute top-[30%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#06b6d4]/10 blur-[100px]" />

  {/* Content on top */}
  <div className="relative z-10">{children}</div>
</div>
```

### Spotlight Effect
```tsx
// CSS: follow mouse position with JS, set --x and --y CSS vars
<div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113]">
  <div
    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
    style={{
      background: `radial-gradient(600px circle at var(--x) var(--y), rgba(99,102,241,0.1), transparent 40%)`,
    }}
  />
  {children}
</div>
```

## Premium Dark Cards

```tsx
// Stat card with colored accent
<div className="rounded-xl border border-white/[0.06] bg-[#111113] p-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10">
      <TrendingUp className="h-5 w-5 text-[#818cf8]" />
    </div>
    <span className="text-sm text-[#a1a1aa]">Total Revenue</span>
  </div>
  <p className="text-3xl font-semibold tracking-tight text-white">$48,352</p>
  <p className="mt-1 text-sm text-[#22c55e]">+12.5% from last month</p>
</div>

// Feature card with gradient top border
<div className="group relative rounded-2xl bg-[#111113] p-8 overflow-hidden">
  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent" />
  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#6366f1]/5 to-transparent" />
  <div className="relative">
    <Zap className="h-8 w-8 text-[#818cf8] mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
    <p className="text-sm text-[#a1a1aa] leading-relaxed">Built for performance with edge-first architecture.</p>
  </div>
</div>
```

## Dark Mode Patterns

### Separator with Glow
```tsx
<div className="relative py-1">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-white/[0.06]" />
  </div>
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#6366f1]/30 to-transparent" />
  </div>
</div>
```

### Dark Scrollbar
```css
.dark-scroll::-webkit-scrollbar { width: 6px; }
.dark-scroll::-webkit-scrollbar-track { background: transparent; }
.dark-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
.dark-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
```

## Best Practices

1. **Never use pure black (#000)** - use near-blacks like #09090b, #0a0a0f
2. **Never use pure white (#fff) for text** - use #fafafa or #f4f4f5
3. **Build surface hierarchy** - minimum 4 levels of surface elevation
4. **Use colored shadows** matching your accent colors, not black shadows
5. **Borders should be white with 5-15% opacity** not gray hex values
6. **Add ambient glow** with blurred gradient orbs behind content
7. **Glass morphism needs real blur** - backdrop-blur-xl minimum
8. **Gradient text** should fade from bright to dim, top to bottom
9. **Every hover state** should reveal a glow or border shift
10. **Test on real screens** - dark UIs look different on every display
