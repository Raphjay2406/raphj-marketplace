---
name: tailwind-patterns
description: "Advanced Tailwind CSS patterns including animations, custom utilities, responsive strategies, dark mode, and design tokens."
---

Use this skill when the user mentions Tailwind CSS, utility classes, responsive design, dark mode, custom animations, or Tailwind configuration.

You are an expert in advanced Tailwind CSS patterns and techniques.

## Color System with CSS Variables

Always use Tailwind's CSS variable-based theming:

```tsx
// Semantic colors (preferred)
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"
className="bg-muted text-muted-foreground"
className="bg-accent text-accent-foreground"
className="bg-destructive text-destructive-foreground"
className="bg-card text-card-foreground"
className="bg-popover text-popover-foreground"
className="border-border"
className="ring-ring"
```

## Dark Mode

```tsx
// Automatic dark mode variants
className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"

// Using semantic colors (auto-adapts)
className="bg-background text-foreground" // Already handles dark mode
```

## Responsive Patterns

```tsx
// Mobile-first breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Responsive text
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"

// Responsive spacing
className="p-4 sm:p-6 md:p-8 lg:p-12"

// Responsive visibility
className="hidden md:block"    // Hidden on mobile, visible on md+
className="block md:hidden"    // Visible on mobile, hidden on md+

// Container with padding
className="container mx-auto px-4 sm:px-6 lg:px-8"
```

## Animation Utilities

### Built-in Animations
```tsx
className="animate-spin"       // Continuous rotation
className="animate-ping"       // Radar ping effect
className="animate-pulse"      // Gentle opacity pulse
className="animate-bounce"     // Bouncing effect
```

### Custom Keyframe Animations (tailwind.config)
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in-right": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}
```

### Transition Utilities
```tsx
className="transition-all duration-300 ease-in-out"
className="transition-colors duration-200"
className="transition-transform duration-150 hover:scale-105"
className="transition-opacity duration-500"
```

## Layout Patterns

### Flexbox
```tsx
className="flex items-center justify-between gap-4"
className="flex flex-col items-center gap-6"
className="inline-flex items-center gap-2"
```

### Grid
```tsx
className="grid grid-cols-12 gap-6"
className="grid auto-rows-min gap-4"
className="grid place-items-center min-h-screen"

// Subgrid (modern)
className="grid grid-cols-subgrid col-span-3"
```

### Aspect Ratios
```tsx
className="aspect-square"    // 1:1
className="aspect-video"     // 16:9
className="aspect-[4/3]"     // Custom
```

## Typography Patterns

```tsx
// Prose (for rendered markdown/HTML content)
className="prose prose-lg dark:prose-invert max-w-none"

// Truncation
className="truncate"                          // Single line
className="line-clamp-2"                      // Multi-line (2 lines)
className="line-clamp-3"                      // Multi-line (3 lines)

// Text balance
className="text-balance"                      // Balanced line wrapping
className="text-pretty"                       // Pretty line wrapping
```

## Gradient Patterns

```tsx
// Linear gradients
className="bg-gradient-to-r from-purple-500 to-pink-500"
className="bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500"

// Text gradient
className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"

// Gradient border
className="bg-gradient-to-r from-purple-500 to-pink-500 p-[1px] rounded-lg"
// Inner: className="bg-background rounded-lg p-4"
```

## Glass / Blur Effects

```tsx
className="backdrop-blur-md bg-white/30 border border-white/20"
className="backdrop-blur-xl bg-black/10 shadow-xl"
```

## Shadow Patterns

```tsx
className="shadow-sm"
className="shadow-md hover:shadow-lg transition-shadow"
className="shadow-xl shadow-purple-500/20"     // Colored shadow
className="drop-shadow-lg"                      // Drop shadow (for non-rect)
```

## Spacing & Sizing Patterns

```tsx
// Full-height layouts
className="min-h-screen flex flex-col"
className="h-dvh"                               // Dynamic viewport height

// Max-width containers
className="max-w-sm"    // 384px
className="max-w-md"    // 448px
className="max-w-lg"    // 512px
className="max-w-xl"    // 576px
className="max-w-2xl"   // 672px
className="max-w-4xl"   // 896px
className="max-w-7xl"   // 1280px
```

## Interactive States

```tsx
// Hover + Focus + Active
className="hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"

// Group hover
className="group"
// Child: className="group-hover:opacity-100 opacity-0 transition-opacity"

// Peer states (for form validation)
className="peer"
// Sibling: className="peer-invalid:text-destructive"

// Disabled
className="disabled:opacity-50 disabled:pointer-events-none"
```

## Best Practices

1. Use `cn()` from `@/lib/utils` for conditional classes
2. Use CSS variables over hardcoded colors for theming
3. Mobile-first: start with mobile styles, add breakpoint overrides
4. Use `focus-visible` instead of `focus` for keyboard-only focus rings
5. Prefer `gap` over margin for spacing between flex/grid children
6. Use `ring` utilities for focus indicators (accessible)
7. Use arbitrary values `[...]` sparingly - prefer extending the config
