---
name: "accessibility"
description: "WCAG 2.1 AA baked into every component: ARIA patterns, keyboard navigation, focus management, archetype-styled focus indicators, reduced-motion per archetype, color-blind safe patterns"
tier: "core"
triggers: "accessibility, a11y, WCAG, ARIA, keyboard, focus, screen reader, reduced motion, color blind, touch target, skip link"
version: "2.0.0"
---

## Genorah v2.0 Updates

- **Designed focus indicators**: Custom focus rings must match the DNA accent color and archetype personality. Browser default `outline` without customization is flagged as a **-4 penalty** in the quality gate. Every project must define `:focus-visible` styles in `globals.css`.
- **Reduced motion is designed**: `prefers-reduced-motion` must provide an **alternative static design**, not just `display: none` on animations. Removing animated content entirely is flagged -- provide a meaningful static equivalent (e.g., a static hero image instead of an animated sequence).
- **Color never sole indicator**: Error states, success states, and status indicators require **icon + text + color**. Color-only differentiation is flagged in the quality gate. This applies to form validation, alerts, badges, and progress indicators.
- **ARIA as last resort**: Native HTML elements are always preferred. Using `role="button"` on a `<div>` when `<button>` would work is flagged. Using `role="link"` on a `<span>` when `<a>` would work is flagged. ARIA is reserved for custom widgets where no native equivalent exists.
- **Hard gate**: Accessibility is a quality gate category with **1.1x weight multiplier**, meaning accessibility failures have outsized impact on the final score. This reflects the principle that accessibility is a design fundamental, not an optional enhancement.

---

## Layer 1: Decision Guidance

Accessibility is a DESIGN CONSTRAINT, not a checklist. WCAG 2.1 AA is the floor, not the ceiling. Every component, every interaction, every state must be accessible. No exceptions. No retrofitting. No afterthought.

This skill defines STANDARDS. Other skills IMPLEMENT them. When building any component in any skill, it must include all seven requirements:

1. **Semantic HTML** -- Correct elements, not div-soup. `<button>` for actions, `<a>` for navigation, `<input>` for data entry
2. **ARIA attributes** -- Only where native semantics are insufficient. Never duplicate what HTML already provides
3. **Keyboard navigation** -- Tab order follows DOM, arrow keys for groups, Escape closes overlays, Enter/Space activate
4. **Focus indicators** -- Archetype-styled via `:focus-visible`, never `outline: none` without replacement
5. **Motion alternatives** -- `motion-safe:` / `motion-reduce:` pair on every animation, no exceptions
6. **Color contrast** -- 4.5:1 body text, 3:1 large text (18px+ or 14px+ bold), 3:1 UI components and borders
7. **Touch targets** -- 44px minimum on mobile for all interactive elements

### When to Use

Always. Accessibility is always active. There is no project type, archetype, or situation where accessibility is optional.

### When NOT to Use

Never. If you think you don't need accessibility, you are wrong.

### Decision Tree

- Interactive custom widget -> Full ARIA roles + states + properties + keyboard handler
- Standard HTML element (`<button>`, `<a>`, `<input>`) -> Semantic HTML sufficient, no ARIA needed unless augmenting
- Decorative element (visual-only shapes, backgrounds, dividers) -> `aria-hidden="true"`, `role="presentation"`
- Dynamic content update (toast, counter, status) -> `aria-live` region (`polite` for non-urgent, `assertive` for alerts/errors)
- Hidden content for screen readers only -> `sr-only` Tailwind class (NOT `display:none` which hides from assistive tech too)
- Modal / dialog / drawer -> Focus trap via `inert`, `role="dialog"`, `aria-modal="true"`, Escape to close, focus restore on close
- Visually hidden label -> Use `sr-only` class first; use `aria-label` only when `sr-only` text would be awkward in DOM
- Custom dropdown or select -> Full `role="listbox"` / `role="menu"` with arrow key navigation and `aria-expanded`

### Pipeline Connection

- **Referenced by:** builder during build (bake accessibility into every component)
- **Referenced by:** quality-reviewer during verification (audit against these standards)
- **Referenced by:** creative-director during pre-build review (ensure focus indicators match archetype)
- **Consumed at:** Every pipeline stage. This skill is the accessibility authority for the entire system


## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Archetype-Styled Focus Indicators

Focus indicators are a DESIGN ELEMENT, not an afterthought. Each archetype has its own focus style that matches its visual personality. The base indicator is always visible and accessible; archetype overrides add character.

```css
/* ===== BASE FOCUS INDICATOR (always visible, always accessible) ===== */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove default outline only when :focus-visible is supported */
:focus:not(:focus-visible) {
  outline: none;
}
```

**All 19 archetype focus indicator overrides:**

```css
/* ----- 1. Brutalist ----- */
/* Thick, unapologetic border. No offset. Maximum contrast. */
[data-archetype="brutalist"] :focus-visible {
  outline: 3px solid var(--color-text);
  outline-offset: 0;
}

/* ----- 2. Ethereal ----- */
/* Soft ring with generous offset and rounded feel */
[data-archetype="ethereal"] :focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 999px;
}

/* ----- 3. Kinetic ----- */
/* Animated ring that pulses once on focus */
[data-archetype="kinetic"] :focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  animation: kinetic-focus-pulse 0.4s ease-out;
}
@keyframes kinetic-focus-pulse {
  0% { outline-offset: 0; outline-color: transparent; }
  50% { outline-offset: 4px; }
  100% { outline-offset: 2px; outline-color: var(--color-primary); }
}

/* ----- 4. Editorial ----- */
/* Subtle underline shift for links, clean ring for buttons */
[data-archetype="editorial"] a:focus-visible {
  outline: none;
  text-decoration: underline;
  text-decoration-color: var(--color-primary);
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
}
[data-archetype="editorial"] button:focus-visible,
[data-archetype="editorial"] [role="button"]:focus-visible {
  outline: 1.5px solid var(--color-text);
  outline-offset: 3px;
}

/* ----- 5. Neo-Corporate ----- */
/* Clean primary ring with subtle shadow for depth */
[data-archetype="neo-corporate"] :focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

/* ----- 6. Organic ----- */
/* Rounded ring matching organic shape language */
[data-archetype="organic"] :focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 12px;
}

/* ----- 7. Retro-Future ----- */
/* Dashed outline with retro character */
[data-archetype="retro-future"] :focus-visible {
  outline: 2px dashed var(--color-accent);
  outline-offset: 3px;
}

/* ----- 8. Luxury/Fashion ----- */
/* Thin signature-color outline, refined and understated */
[data-archetype="luxury"] :focus-visible {
  outline: 1px solid var(--color-signature);
  outline-offset: 4px;
}

/* ----- 9. Playful/Startup ----- */
/* Colored ring with slight scale bump */
[data-archetype="playful"] :focus-visible {
  outline: 2.5px solid var(--color-accent);
  outline-offset: 2px;
  transform: scale(1.02);
}

/* ----- 10. Data-Dense ----- */
/* Compact ring that does not disrupt tight layouts */
[data-archetype="data-dense"] :focus-visible {
  outline: 1px solid var(--color-primary);
  outline-offset: 1px;
}

/* ----- 11. Japanese Minimal ----- */
/* Hair-thin outline with generous breathing room */
[data-archetype="japanese-minimal"] :focus-visible {
  outline: 1px solid var(--color-text);
  outline-offset: 6px;
}

/* ----- 12. Glassmorphism ----- */
/* Frosted ring effect using box-shadow layers */
[data-archetype="glassmorphism"] :focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--color-bg) 60%, transparent),
    0 0 0 4px color-mix(in srgb, var(--color-primary) 50%, transparent);
}

/* ----- 13. Neon Noir ----- */
/* Glow ring -- the signature neon look */
[data-archetype="neon-noir"] :focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-bg),
    0 0 0 4px var(--color-glow),
    0 0 12px var(--color-glow);
}

/* ----- 14. Warm Artisan ----- */
/* Warm-toned ring matching craft aesthetic */
[data-archetype="warm-artisan"] :focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 4px;
}

/* ----- 15. Swiss/International ----- */
/* Minimal clean outline -- precision, nothing more */
[data-archetype="swiss"] :focus-visible {
  outline: 1px solid var(--color-text);
  outline-offset: 3px;
}

/* ----- 16. Vaporwave ----- */
/* Gradient-colored glow outline */
[data-archetype="vaporwave"] :focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-bg),
    0 0 0 4px var(--color-accent),
    0 0 8px var(--color-accent);
}

/* ----- 17. Neubrutalism ----- */
/* Thick offset shadow-style indicator matching the neubrutalism shadow language */
[data-archetype="neubrutalism"] :focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 0;
  box-shadow: 4px 4px 0 0 var(--color-text);
}

/* ----- 18. Dark Academia ----- */
/* Warm muted ring matching scholarly palette */
[data-archetype="dark-academia"] :focus-visible {
  outline: 1.5px solid var(--color-muted);
  outline-offset: 3px;
}

/* ----- 19. AI-Native ----- */
/* Tech-glow ring echoing the machine-intelligence aesthetic */
[data-archetype="ai-native"] :focus-visible {
  outline: none;
  box-shadow:
    0 0 0 1px var(--color-primary),
    0 0 6px color-mix(in srgb, var(--color-primary) 40%, transparent);
}
```

**Tailwind utility mapping** for use in JSX/TSX:

```tsx
// Focus ring class per archetype -- use in className
const archetypeFocusClass: Record<string, string> = {
  'brutalist':        'focus-visible:outline-3 focus-visible:outline-text focus-visible:outline-offset-0',
  'ethereal':         'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 focus-visible:rounded-full',
  'kinetic':          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:animate-[kinetic-focus-pulse_0.4s_ease-out]',
  'editorial':        'focus-visible:outline-1 focus-visible:outline-text focus-visible:outline-offset-3',
  'neo-corporate':    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:ring-4 focus-visible:ring-primary/15',
  'organic':          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-3 focus-visible:rounded-xl',
  'retro-future':     'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-accent focus-visible:outline-offset-3',
  'luxury':           'focus-visible:outline-1 focus-visible:outline-signature focus-visible:outline-offset-4',
  'playful':          'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 focus-visible:scale-[1.02]',
  'data-dense':       'focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-1',
  'japanese-minimal': 'focus-visible:outline-1 focus-visible:outline-text focus-visible:outline-offset-[6px]',
  'glassmorphism':    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg/60',
  'neon-noir':        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:shadow-[0_0_12px_var(--color-glow)]',
  'warm-artisan':     'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-3 focus-visible:rounded',
  'swiss':            'focus-visible:outline-1 focus-visible:outline-text focus-visible:outline-offset-3',
  'vaporwave':        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:shadow-[0_0_8px_var(--color-accent)]',
  'neubrutalism':     'focus-visible:outline-2 focus-visible:outline-text focus-visible:outline-offset-0 focus-visible:shadow-[4px_4px_0_0_var(--color-text)]',
  'dark-academia':    'focus-visible:outline-1 focus-visible:outline-muted focus-visible:outline-offset-3',
  'ai-native':        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-[0_0_6px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]',
}
```

#### Pattern 2: Keyboard Navigation Patterns

**Tab navigation:** Natural tab order follows DOM order. Use `tabindex="0"` only when a non-interactive element must be focusable. NEVER use `tabindex` > 0.

**Roving tabindex** for groups (toolbars, tab lists, radio groups):

```tsx
// Arrow keys move focus within the group. Tab moves OUT of the group.
function Toolbar({ items }: { items: { id: string; label: string; icon: React.ReactNode }[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    refs.current[activeIndex]?.focus()
  }, [activeIndex])

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown':
        e.preventDefault()
        next = (index + 1) % items.length
        break
      case 'ArrowLeft': case 'ArrowUp':
        e.preventDefault()
        next = (index - 1 + items.length) % items.length
        break
      case 'Home':
        e.preventDefault()
        next = 0
        break
      case 'End':
        e.preventDefault()
        next = items.length - 1
        break
      default:
        return
    }
    setActiveIndex(next)
  }

  return (
    <div role="toolbar" aria-label="Actions">
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => { refs.current[i] = el }}
          tabIndex={i === activeIndex ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, i)}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  )
}
```

**Focus trap for modals** using the `inert` attribute (Baseline 2023):

```tsx
function useModalFocus(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Save current focus for restore on close
    previousFocus.current = document.activeElement as HTMLElement

    // Make background inert (disables all interaction + removes from tab order)
    const main = document.querySelector('main')
    const header = document.querySelector('header')
    main?.setAttribute('inert', '')
    header?.setAttribute('inert', '')

    // Focus first focusable element in modal
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    return () => {
      // Remove inert and restore focus
      main?.removeAttribute('inert')
      header?.removeAttribute('inert')
      previousFocus.current?.focus()
    }
  }, [isOpen])

  return modalRef
}
```

**Skip links** (first focusable element on the page):

```tsx
function SkipLinks() {
  return (
    <a
      href="#main-content"
      className={[
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-[100]',
        'focus:px-4 focus:py-2 focus:rounded',
        'focus:bg-primary focus:text-bg',
        'focus:outline-none focus:ring-2 focus:ring-text',
        'text-sm font-medium',
      ].join(' ')}
    >
      Skip to main content
    </a>
  )
}

// Target element:
// <main id="main-content" tabIndex={-1}>...</main>
// tabIndex={-1} allows programmatic focus without adding to tab order
```

#### Pattern 3: ARIA Patterns for Common Components

**Accordion:**

```tsx
function Accordion({ items }: { items: { id: string; title: string; content: React.ReactNode }[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h3>
            <button
              id={`accordion-trigger-${item.id}`}
              aria-expanded={openId === item.id}
              aria-controls={`accordion-panel-${item.id}`}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="flex w-full items-center justify-between py-4 text-left font-medium"
            >
              {item.title}
              <ChevronIcon className={cn(
                'h-4 w-4 transition-transform',
                'motion-safe:duration-200',
                openId === item.id && 'rotate-180'
              )} aria-hidden="true" />
            </button>
          </h3>
          <div
            id={`accordion-panel-${item.id}`}
            role="region"
            aria-labelledby={`accordion-trigger-${item.id}`}
            hidden={openId !== item.id}
          >
            <div className="pb-4 text-muted">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Tabs:**

```tsx
function Tabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Content tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === i}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeIndex === i ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onClick={() => setActiveIndex(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${tabs[activeIndex].id}`}
        aria-labelledby={`tab-${tabs[activeIndex].id}`}
        tabIndex={0}
      >
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}
```

**Dropdown menu:**

```tsx
function DropdownMenu({ trigger, items }: {
  trigger: React.ReactNode
  items: { id: string; label: string; action: () => void }[]
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus()
  }, [open, activeIndex])

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex(0)
    }
  }

  const handleMenuKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((index + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((index - 1 + items.length) % items.length)
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(items.length - 1)
        break
    }
  }

  return (
    <div className="relative">
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </button>
      {open && (
        <div ref={menuRef} role="menu" className="absolute top-full mt-1 bg-surface border border-border rounded shadow-elevated">
          {items.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => { itemRefs.current[i] = el }}
              role="menuitem"
              tabIndex={i === activeIndex ? 0 : -1}
              onKeyDown={(e) => handleMenuKeyDown(e, i)}
              onClick={() => { item.action(); setOpen(false) }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-border/50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Toast / notification:**

```tsx
// Non-urgent updates: role="status" with aria-live="polite"
// Error alerts: role="alert" (implicitly assertive)
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
          className={cn(
            'rounded-lg px-4 py-3 shadow-elevated border border-border bg-surface',
            'motion-safe:animate-slide-in motion-reduce:animate-none'
          )}
        >
          <p className="text-sm text-text">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
```

**Modal / Dialog:**

```tsx
function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  const modalRef = useModalFocus(isOpen) // Hook from Pattern 2

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text/50 z-40 motion-safe:animate-fade-in motion-reduce:opacity-100"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-surface rounded-lg shadow-float border border-border p-6 max-w-lg w-full motion-safe:animate-scale-in motion-reduce:animate-none"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-text">{title}</h2>
        <div className="mt-4">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded hover:bg-border/50"
          aria-label="Close dialog"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
```

**Carousel:**

```tsx
function Carousel({ slides, label }: { slides: { id: string; content: React.ReactNode }[]; label: string }) {
  const [current, setCurrent] = useState(0)

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${current + 1} of ${slides.length}`}
      >
        {slides[current].content}
      </div>
      {/* Announce slide changes to screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {current + 1} of {slides.length}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
          className="p-2 rounded border border-border hover:bg-surface"
        >
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={() => setCurrent((current + 1) % slides.length)}
          aria-label="Next slide"
          className="p-2 rounded border border-border hover:bg-surface"
        >
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
```

#### Pattern 4: Reduced Motion -- Archetype-Aware Alternatives

Reduced motion does not mean NO motion. It means LESS motion. Each archetype defines what "reduced" means for its personality -- some already match reduced-motion expectations, others need significant adaptation.

**Global CSS override (nuclear option for universal respect):**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Per-archetype reduced-motion configurations:**

| Archetype | Reduced Motion Behavior | Entrance | Duration | Scroll-Driven |
|-----------|------------------------|----------|----------|---------------|
| Brutalist | Instant -- hard cuts match the aesthetic | `instant` | 0ms | none |
| Ethereal | Slow gentle fades preserve the dreamy pace | `slow-fade` | 800ms | very-slow-fade |
| Kinetic | Opacity-only fades, no translateY | `opacity-only` | 400ms | none |
| Editorial | Subtle opacity fade | `opacity-only` | 300ms | none |
| Neo-Corporate | Clean simple fade | `opacity-only` | 250ms | none |
| Organic | Gentle opacity fade | `slow-fade` | 500ms | none |
| Retro-Future | Instant with slight opacity | `instant` | 50ms | none |
| Luxury/Fashion | Slow elegant fade | `slow-fade` | 600ms | very-slow-fade |
| Playful/Startup | Quick fade (energy without motion) | `opacity-only` | 200ms | none |
| Data-Dense | Instant -- data clarity is priority | `instant` | 0ms | none |
| Japanese Minimal | Instant -- already minimal | `instant` | 0ms | none |
| Glassmorphism | Gentle opacity fade | `opacity-only` | 300ms | none |
| Neon Noir | Slow opacity preserves mood | `slow-fade` | 600ms | none |
| Warm Artisan | Gentle opacity fade | `opacity-only` | 350ms | none |
| Swiss/International | Clean instant transition | `instant` | 0ms | none |
| Vaporwave | Slow dreamy fade | `slow-fade` | 500ms | none |
| Neubrutalism | Instant -- matches stark aesthetic | `instant` | 0ms | none |
| Dark Academia | Gentle fade | `opacity-only` | 400ms | none |
| AI-Native | Quick fade with no transform | `opacity-only` | 200ms | none |

**Tailwind implementation pattern:**

```tsx
// EVERY animated component must include both variants:
<div className={cn(
  // Standard motion
  'motion-safe:animate-rise motion-safe:duration-500',
  // Reduced motion alternative
  'motion-reduce:animate-none motion-reduce:opacity-100'
)}>
  {content}
</div>

// For motion/react animations:
import { useReducedMotion } from 'motion/react'

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={prefersReduced
        ? { duration: 0 }
        : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
      }
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}
```

#### Pattern 5: Color Accessibility

**Contrast requirements (WCAG 2.1 AA):**

| Element | Min Ratio | WCAG Criterion |
|---------|-----------|----------------|
| Body text (< 18px) | 4.5:1 | 1.4.3 Contrast (Minimum) |
| Large text (18px+ or 14px+ bold) | 3:1 | 1.4.3 Contrast (Minimum) |
| UI components, borders, icons | 3:1 | 1.4.11 Non-text Contrast |
| Focus indicators | 3:1 vs adjacent colors | 1.4.11 Non-text Contrast |
| Placeholder text | 4.5:1 | 1.4.3 (if relied upon) |

**DNA token contrast rules:**
- `--color-text` on `--color-bg` MUST be 4.5:1+
- `--color-muted` on `--color-bg` MUST be 4.5:1+
- `--color-primary` on `--color-bg` MUST be 3:1+ (used for UI components)
- `--color-text` on `--color-surface` MUST be 4.5:1+
- Both light AND dark mode palettes must independently meet all ratios

**Color-blind safe patterns:**

```tsx
// RULE: Never use color as the ONLY indicator. Always pair with: icon + label + color

// Status indicators: icon + color + text
function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' | 'info' }) {
  const config = {
    success: { icon: <CheckIcon />, label: 'Success', className: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950' },
    error:   { icon: <XCircleIcon />, label: 'Error', className: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950' },
    warning: { icon: <AlertIcon />, label: 'Warning', className: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950' },
    info:    { icon: <InfoIcon />, label: 'Info', className: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950' },
  }
  const { icon, label, className } = config[status]

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      <span aria-hidden="true" className="h-3.5 w-3.5">{icon}</span>
      {label}
    </span>
  )
}

// Chart-safe palette (distinguishable across protanopia, deuteranopia, tritanopia):
// Blue #2563eb, Amber #f59e0b, Violet #8b5cf6, Cyan #06b6d4, Pink #ec4899, Emerald #10b981
// AVOID: red-green adjacent without secondary differentiator (shape, pattern, label)
```

**Testing tools:**
- axe-core (automated, catches ~57% of WCAG issues) for component-level checks
- Manual keyboard-only navigation (100% of keyboard issues)
- Screen reader spot-checks (VoiceOver on macOS, NVDA on Windows)
- Browser DevTools color contrast checker (built into Chrome, Firefox)

### Reference Sites

- **apple.com** -- Exemplary focus management: custom focus styles that match brand aesthetic, keyboard navigation through product galleries, `prefers-reduced-motion` fully respected with graceful fallbacks
- **stripe.com** -- Accessible complex UI: docs navigation with proper ARIA landmarks, keyboard-navigable code examples, high-contrast design system with 4.5:1+ ratios throughout
- **gov.uk** -- Gold standard for accessible web design: skip links, clear heading hierarchy, no reliance on color alone, tested with assistive technologies across the board
- **linear.app** -- Dark-first design with excellent keyboard shortcuts, focus visible on every interactive element, and clean reduced-motion behavior that preserves the product's personality


## Layer 3: Integration Context

### DNA Connection

| DNA Token | Accessibility Requirement |
|-----------|--------------------------|
| `--color-text` on `--color-bg` | Must meet 4.5:1 contrast ratio (WCAG AA body text) |
| `--color-muted` on `--color-bg` | Must meet 4.5:1 contrast ratio (used for body copy) |
| `--color-primary` on `--color-bg` | Must meet 3:1 contrast ratio (used for UI components, links) |
| `--color-text` on `--color-surface` | Must meet 4.5:1 contrast ratio (cards, panels) |
| `--color-border` on `--color-bg` | Must meet 3:1 contrast ratio (visible boundaries) |
| Focus indicator color | Must meet 3:1 contrast against adjacent colors |
| `--motion-*` tokens | Must have motion-reduce alternative that preserves archetype personality |

### Archetype Variants

Every archetype defines three accessibility-relevant behaviors. See Layer 2, Pattern 1 for focus indicators and Pattern 4 for reduced motion. Summary:

| Archetype | Focus Style | Reduced Motion | Aesthetic Alignment |
|-----------|-------------|----------------|---------------------|
| Brutalist | 3px solid, no offset | Instant (0ms) | Hard cuts ARE the aesthetic |
| Ethereal | Soft ring, 4px offset | Slow fade (800ms) | Dreamy pace preserved |
| Kinetic | Animated pulse | Opacity-only (400ms) | Energy without vestibular risk |
| Editorial | Underline links, ring buttons | Opacity (300ms) | Typographic refinement |
| Neo-Corporate | Ring + shadow | Fade (250ms) | Clean professionalism |
| Organic | Rounded ring | Gentle fade (500ms) | Natural feel |
| Retro-Future | Dashed outline | Instant (50ms) | Retro snap |
| Luxury/Fashion | Thin signature line | Slow fade (600ms) | Refined elegance |
| Playful/Startup | Colored ring + scale | Quick fade (200ms) | Energy without motion |
| Data-Dense | Compact 1px ring | Instant (0ms) | Clarity priority |
| Japanese Minimal | Hair-thin, 6px offset | Instant (0ms) | Already minimal |
| Glassmorphism | Frosted ring layers | Opacity (300ms) | Glass without movement |
| Neon Noir | Glow ring | Slow opacity (600ms) | Mood preserved |
| Warm Artisan | Warm rounded ring | Opacity (350ms) | Craft warmth |
| Swiss/International | 1px clean outline | Instant (0ms) | Precision |
| Vaporwave | Gradient glow ring | Slow fade (500ms) | Dreamy without sweep |
| Neubrutalism | Thick offset shadow | Instant (0ms) | Stark bold cuts |
| Dark Academia | Muted warm ring | Gentle fade (400ms) | Scholarly calm |
| AI-Native | Tech glow ring | Quick fade (200ms) | Digital without distraction |

### Pipeline Stage

- **Input from:** Design DNA (contrast-compliant color tokens), Design Archetypes (focus indicator style, reduced-motion behavior)
- **Output to:** Section builders (accessibility standards baked into every component), Quality reviewer (audit checklist), Creative director (focus indicators as design element)

### Related Skills

- **tailwind-system** -- `motion-safe:` / `motion-reduce:` utilities, `sr-only` class, focus utilities (`focus-visible:ring-*`)
- **responsive-design** -- Touch target sizing (44px mobile), zoom compliance (clamp with rem + vw, not pure vw)
- **cinematic-motion** -- Motion-reduce coordination: this skill defines WHAT reduced motion means per archetype, cinematic-motion defines HOW animations degrade
- **emotional-arc** -- Beat parameters (whitespace, element count) must remain accessible: heading hierarchy, readable line lengths, sufficient contrast at all beat intensities
- **design-archetypes** -- Each archetype's mandatory techniques and forbidden patterns must include accessibility variants
- **micro-interactions** -- Every micro-interaction needs keyboard trigger equivalence and motion-reduce alternative

### Scope Boundary

This skill defines **component-level** accessibility patterns: ARIA, keyboard, focus, contrast, motion-reduce. Page-level automated testing (axe-core audits, Lighthouse accessibility scores, full-page keyboard walk-throughs) lives in the **live-testing** skill (Phase 4). Different scopes, no overlap.


## Layer 4: Anti-Patterns

### Anti-Pattern 1: Div-Soup

**What goes wrong:** `<div onClick={handler}>Click me</div>` -- Looks interactive but is not focusable, has no keyboard interaction, no implicit role, no screen reader announcement.
**Instead:** Use `<button>` for actions, `<a href>` for navigation. These elements are focusable, keyboard-activatable, and announced correctly by assistive technology. Zero ARIA needed.

### Anti-Pattern 2: Visible but Inaccessible

**What goes wrong:** Custom dropdown with fancy animations but no ARIA roles or keyboard handling. Sighted mouse users see a dropdown; keyboard and screen reader users see nothing.
**Instead:** Full ARIA pattern (see Pattern 3 above): `role="menu"`, `role="menuitem"`, `aria-expanded`, `aria-haspopup`, arrow key navigation, Escape to close, focus management.

### Anti-Pattern 3: Generic Focus Indicators

**What goes wrong:** Either the browser default blue outline (clashes with every design) or `outline: none` (invisible to keyboard users). Both are failures -- one of design, one of accessibility.
**Instead:** Archetype-styled `:focus-visible` indicators (see Pattern 1). Focus indicators are a design element. They should look as intentional as any hover state.

### Anti-Pattern 4: Animation Without Motion-Reduce

**What goes wrong:** `animate-bounce` or GSAP `from({ y: 100 })` with no reduced-motion alternative. Users with vestibular disorders experience dizziness, nausea, or seizures.
**Instead:** Every animation MUST have a `motion-reduce` pair: `motion-safe:animate-bounce motion-reduce:animate-none`. For JS animations, check `useReducedMotion()` from `motion/react` or `matchMedia('(prefers-reduced-motion: reduce)')`.

### Anti-Pattern 5: Color-Only Information

**What goes wrong:** Red border for errors, green for success, with no other indicator. 8% of males have red-green color vision deficiency and cannot distinguish these states.
**Instead:** Icon + label + color. Status indicators use a shape (checkmark, X, triangle) plus text label ("Success", "Error") alongside the color coding.

### Anti-Pattern 6: tabindex Greater Than Zero

**What goes wrong:** `tabindex="5"` to force an element earlier in tab order. This breaks the natural DOM flow, creates maintenance nightmares as other elements need tabindex values, and confuses users who expect top-to-bottom/left-to-right navigation.
**Instead:** Use DOM order for tab sequence. Rearrange the HTML, not the tabindex. Only use `tabindex="0"` (make focusable in natural order) or `tabindex="-1"` (programmatically focusable, not in tab order).

### Anti-Pattern 7: aria-label Overwriting Visible Text

**What goes wrong:** `<button aria-label="Submit form">Submit</button>` -- The aria-label overwrites the visible text for screen readers. If the visible text says "Submit" but aria-label says "Submit form", screen readers announce "Submit form" while sighted users see "Submit". This disconnect confuses users of voice control software who say what they see.
**Instead:** Use `aria-label` ONLY when there is no visible text (icon buttons, abstract controls). When visible text exists, use `aria-labelledby` to reference it, or simply rely on the text content itself.


## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Body text contrast ratio | 4.5 | - | ratio | HARD -- WCAG 2.1 AA 1.4.3 |
| Large text contrast ratio | 3 | - | ratio | HARD -- WCAG 2.1 AA 1.4.3 (18px+ or 14px+ bold) |
| UI component contrast ratio | 3 | - | ratio | HARD -- WCAG 2.1 AA 1.4.11 |
| Focus indicator contrast | 3 | - | ratio | HARD -- visible against adjacent colors |
| Touch target size | 44 | - | px | HARD -- all interactive elements on mobile |
| Focus indicator | visible | - | - | HARD -- :focus-visible on every interactive element |
| Motion alternative | required | - | - | HARD -- motion-safe/motion-reduce pair on every animation |
| Skip link | required | - | - | HARD -- first focusable element on every page |
| Heading hierarchy | sequential | - | - | HARD -- never skip levels (h1 > h2 > h3) |
| Form label | required | - | - | HARD -- every input has label or aria-label |
