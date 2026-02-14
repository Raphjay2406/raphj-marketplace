---
name: accessibility-patterns
description: "Deep accessibility patterns: focus management, keyboard navigation, screen reader announcements, ARIA patterns, skip links, accessible drag-and-drop, color-blind safe palettes, and axe-core testing."
---

Use this skill when the user mentions accessibility, a11y, keyboard navigation, screen reader, ARIA, focus management, skip link, reduced motion, color blind, WCAG, or accessible components. Triggers on: accessibility, a11y, keyboard, screen reader, ARIA, focus, skip link, WCAG, color blind, reduced motion.

You are an accessibility expert who implements beyond-checklist patterns that make UIs genuinely usable for everyone.

## Focus Management

### Focus Trap (Modals, Dialogs)
```tsx
import { useEffect, useRef } from 'react'

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const container = containerRef.current
    const focusables = container.querySelectorAll<HTMLElement>(focusableSelector)
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    // Focus first element
    first?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [active])

  return containerRef
}
```

### Roving Tabindex (Arrow Key Navigation)
```tsx
// For lists, toolbars, radio groups — arrow keys move focus, Tab moves out
export function useRovingTabindex(items: HTMLElement[]) {
  const [focusIndex, setFocusIndex] = useState(0)

  useEffect(() => {
    items.forEach((item, i) => {
      item.tabIndex = i === focusIndex ? 0 : -1
    })
    items[focusIndex]?.focus()
  }, [focusIndex, items])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': case 'ArrowRight':
        e.preventDefault()
        setFocusIndex((i) => (i + 1) % items.length)
        break
      case 'ArrowUp': case 'ArrowLeft':
        e.preventDefault()
        setFocusIndex((i) => (i - 1 + items.length) % items.length)
        break
      case 'Home':
        e.preventDefault()
        setFocusIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusIndex(items.length - 1)
        break
    }
  }

  return { handleKeyDown, focusIndex }
}
```

### Focus Restore
```tsx
// Restore focus to the trigger element when dialog closes
export function useFocusRestore() {
  const triggerRef = useRef<HTMLElement | null>(null)

  const saveFocus = () => {
    triggerRef.current = document.activeElement as HTMLElement
  }

  const restoreFocus = () => {
    triggerRef.current?.focus()
    triggerRef.current = null
  }

  return { saveFocus, restoreFocus }
}
```

## Skip Links

```tsx
// Place as first element in <body>
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-4 focus-within:left-4 focus-within:z-[100]">
      <a
        href="#main-content"
        className="inline-block rounded-md bg-background px-4 py-2 text-sm font-medium shadow-lg ring-2 ring-primary focus:outline-none"
      >
        Skip to main content
      </a>
      <a
        href="#main-nav"
        className="inline-block rounded-md bg-background px-4 py-2 text-sm font-medium shadow-lg ring-2 ring-primary focus:outline-none ml-2"
      >
        Skip to navigation
      </a>
    </div>
  )
}

// Target elements
<nav id="main-nav">...</nav>
<main id="main-content">...</main>
```

## Live Regions (Screen Reader Announcements)

```tsx
// Announce dynamic content changes to screen readers
export function LiveRegion({ message, priority = 'polite' }: { message: string; priority?: 'polite' | 'assertive' }) {
  return (
    <div aria-live={priority} aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}

// Usage: announce form submission results
function SearchResults({ count }: { count: number }) {
  return (
    <>
      <LiveRegion message={`${count} results found`} />
      <p className="text-sm text-muted-foreground">{count} results</p>
    </>
  )
}
```

## Keyboard Shortcuts
```tsx
export function useKeyboardShortcut(key: string, callback: () => void, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (modifiers.ctrl && !(e.metaKey || e.ctrlKey)) return
      if (modifiers.shift && !e.shiftKey) return
      if (modifiers.alt && !e.altKey) return
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        callback()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, callback, modifiers])
}
```

## ARIA Patterns

### Accessible Icon Button
```tsx
<Button variant="ghost" size="icon" aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>
```

### Accessible Loading State
```tsx
<Button disabled aria-busy="true">
  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
  <span>Saving...</span>
</Button>
```

### Accessible Toggle
```tsx
<button
  aria-pressed={isActive}
  aria-label={`${isActive ? 'Disable' : 'Enable'} notifications`}
  onClick={() => setIsActive(!isActive)}
>
  <Bell className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
</button>
```

### Accessible Tabs
```tsx
<div role="tablist" aria-label="Account settings">
  {tabs.map((tab, i) => (
    <button
      key={tab.id}
      role="tab"
      id={`tab-${tab.id}`}
      aria-selected={activeTab === i}
      aria-controls={`panel-${tab.id}`}
      tabIndex={activeTab === i ? 0 : -1}
    >
      {tab.label}
    </button>
  ))}
</div>
<div role="tabpanel" id={`panel-${tabs[activeTab].id}`} aria-labelledby={`tab-${tabs[activeTab].id}`}>
  {tabs[activeTab].content}
</div>
```

## Color-Blind Safe Palettes

```css
/* Avoid red/green only — always add a secondary indicator */
/* Status indicators: use shape + color */
.status-success { color: #22c55e; } /* Plus: checkmark icon */
.status-error { color: #ef4444; }   /* Plus: X icon */
.status-warning { color: #f59e0b; } /* Plus: triangle icon */

/* Chart-safe palette (distinguishable by all color vision types) */
--chart-1: #2563eb; /* Blue */
--chart-2: #f59e0b; /* Amber */
--chart-3: #10b981; /* Emerald */
--chart-4: #8b5cf6; /* Violet */
--chart-5: #ec4899; /* Pink */
--chart-6: #06b6d4; /* Cyan */
```

**Rule:** Never use color as the ONLY indicator. Always pair with: icon, pattern, text label, or position.

## Reduced Motion

```tsx
// Tailwind: use motion-safe / motion-reduce
<div className="motion-safe:animate-fadeIn motion-reduce:opacity-100">
  Content that fades in on capable devices
</div>

// Framer Motion: respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
/>
```

## Semantic Landmarks
```html
<body>
  <a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>
  <header role="banner">
    <nav role="navigation" aria-label="Main">...</nav>
  </header>
  <main id="main" role="main">
    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>
    </section>
  </main>
  <aside role="complementary">...</aside>
  <footer role="contentinfo">...</footer>
</body>
```

## Best Practices

1. **Focus visible on everything interactive**: Never `outline: none` without replacement
2. **Escape closes**: All overlays, modals, menus close on Escape
3. **Announce changes**: Use `aria-live` for dynamic content (search results, toasts, form errors)
4. **Heading hierarchy**: Never skip levels (h1 → h2 → h3, not h1 → h3)
5. **Form labels**: Every input needs a `<label>` or `aria-label` — no exceptions
6. **Color + shape**: Never rely on color alone for meaning
7. **Touch targets**: 44x44px minimum, 48x48px recommended
8. **Test with keyboard only**: Tab through the entire page — can you reach everything?
