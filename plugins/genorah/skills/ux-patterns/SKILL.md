---
name: ux-patterns
description: "UX intelligence patterns for navigation, forms, feedback, and content discovery. Ensures sites are not just beautiful but genuinely usable and conversion-optimized."
---

Use this skill when building navigation, forms, interactive feedback, or optimizing content flow. Triggers on: UX, usability, navigation, form, feedback, user experience, accessibility, interaction, content discovery, user flow.

You are a UX engineer who ensures that beautiful design is also genuinely usable. Design without usability is art, not product. Every interaction must be fast, clear, and satisfying.

## Navigation Intelligence

### Rules
- **5-7 top-level items maximum.** More than 7 = cognitive overload. Use mega-menus for depth.
- **Current page indicator** must be visible (not just a different shade — use underline, background, or weight change).
- **Mobile overlay** (not dropdown) for mobile nav. Full-screen or half-screen drawer.
- **Sticky header** that shrinks on scroll (reduce padding from py-6 to py-3, optionally add backdrop-blur).

### Sticky Shrink Navigation
```tsx
'use client'
import { useState, useEffect } from 'react'

function StickyNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border)]'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="/" className="text-lg font-bold">Logo</a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                item.active
                  ? 'text-[var(--color-text-primary)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {item.label}
              {item.active && (
                <span className="block h-0.5 mt-1 bg-[var(--color-accent-1)] rounded-full" />
              )}
            </a>
          ))}
        </div>
        <button className="rounded-lg bg-[var(--color-accent-1)] px-4 py-2 text-sm font-medium">
          Get Started
        </button>
      </div>
    </nav>
  )
}
```

### Mobile Navigation Overlay
```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="md:hidden p-2" aria-label="Open menu">
        <MenuIcon className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--color-bg-primary)] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <a href="/" className="text-lg font-bold">Logo</a>
              <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-6 gap-6">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl font-bold"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

## Form Intelligence

### Rules
- **Labels ABOVE inputs** (not placeholder-as-label, not floating labels).
- **Inline validation** — errors appear immediately below the field, not at the top of the form.
- **Multi-step progress** for forms with 4+ fields — show step count and progress bar.
- **Autofocus** on the first empty field when the form mounts.
- **Submit button** text must describe the outcome ("Create Account", not "Submit").

### Inline Error Pattern
```tsx
<div className="space-y-1.5">
  <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">
    Email address
  </label>
  <input
    id="email"
    type="email"
    className={`w-full rounded-xl border px-4 py-3 text-sm bg-[var(--color-bg-secondary)] transition-colors ${
      error
        ? 'border-red-500 focus:ring-red-500/20'
        : 'border-[var(--color-border)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/20'
    } focus:outline-none focus:ring-2`}
    aria-describedby={error ? 'email-error' : undefined}
    aria-invalid={!!error}
  />
  {error && (
    <p id="email-error" className="text-sm text-red-500 flex items-center gap-1.5" role="alert">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {error}
    </p>
  )}
</div>
```

### Multi-Step Form Progress
```tsx
function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            i < currentStep
              ? 'bg-[var(--color-accent-1)] text-white'
              : i === currentStep
                ? 'border-2 border-[var(--color-accent-1)] text-[var(--color-accent-1)]'
                : 'border border-[var(--color-border)] text-[var(--color-text-tertiary)]'
          }`}>
            {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`h-0.5 w-8 rounded-full transition-colors ${
              i < currentStep ? 'bg-[var(--color-accent-1)]' : 'bg-[var(--color-border)]'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}
```

## Feedback & Response

### Rules
- **100ms click feedback** — any button/link must visually respond within 100ms (scale, color, or opacity change).
- **Optimistic UI** — show the result immediately, revert on failure. Don't make users wait for the server.
- **Skeleton loading** — show content-shaped placeholders, never a blank screen or spinner for more than 300ms.
- **Error recovery** — every error state must include a clear action to fix it ("Try again", "Go back", "Contact support").

### Interaction Feedback Timing
```tsx
{/* Button with immediate feedback */}
<button className="
  active:scale-[0.97] active:opacity-90
  transition-all duration-100
  hover:shadow-[0_0_20px_var(--color-glow)]
  hover:-translate-y-0.5
  transition-transform duration-200
">
  Click Me
</button>

{/* Toast notification for async actions */}
function showFeedback(action: () => Promise<void>) {
  // Immediately show optimistic result
  toast.loading('Saving...')
  action()
    .then(() => toast.success('Saved!'))
    .catch(() => toast.error('Failed — try again'))
}
```

### Skeleton Loading Pattern
```tsx
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 animate-pulse">
      <div className="h-4 w-2/3 rounded bg-[var(--color-text-tertiary)]/20 mb-4" />
      <div className="h-3 w-full rounded bg-[var(--color-text-tertiary)]/10 mb-2" />
      <div className="h-3 w-4/5 rounded bg-[var(--color-text-tertiary)]/10" />
    </div>
  )
}
```

## Content Discovery

### Rules
- **F-pattern for text-heavy pages** (editorials, blogs). Important content top-left.
- **Z-pattern for landing pages** (eye scans top-left → top-right → bottom-left → bottom-right).
- **Scroll indicator** on hero sections if content continues below the fold (subtle arrow or "scroll" text).
- **Anchor links** for pages with 3+ sections — let users jump to what interests them.

### Scroll Indicator
```tsx
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-text-tertiary)]">
  <span className="text-xs tracking-widest uppercase">Scroll</span>
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
  >
    <ChevronDown className="h-4 w-4" />
  </motion.div>
</div>
```

### Anchor Navigation
```tsx
function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-40">
      {sections.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`h-2 w-2 rounded-full transition-all ${
            active === s.id
              ? 'bg-[var(--color-accent-1)] scale-150'
              : 'bg-[var(--color-text-tertiary)]/30 hover:bg-[var(--color-text-tertiary)]'
          }`}
          aria-label={s.label}
        />
      ))}
    </nav>
  )
}
```

## UX Compliance Checklist

Before marking any section complete, verify:

1. [ ] Navigation: current page indicator visible
2. [ ] Navigation: mobile menu accessible and closes on link click
3. [ ] Navigation: sticky behavior works correctly on scroll
4. [ ] Forms: labels above inputs, not placeholders-as-labels
5. [ ] Forms: inline errors below fields, not at top
6. [ ] Forms: submit button describes outcome
7. [ ] Feedback: buttons respond within 100ms (active state)
8. [ ] Feedback: loading states for async actions (skeleton or spinner)
9. [ ] Feedback: error states include recovery action
10. [ ] Content: scroll indicator on hero if content below fold
11. [ ] Content: visual hierarchy guides the eye (F or Z pattern)
12. [ ] Touch: all interactive targets 44x44px minimum on mobile
