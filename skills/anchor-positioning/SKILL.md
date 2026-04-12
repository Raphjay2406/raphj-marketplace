---
name: anchor-positioning
tier: domain
description: "CSS Anchor Positioning — native tooltip/popover/dropdown positioning without JS. Chrome/Edge 125+; Safari/FF need @oddbird/css-anchor-positioning polyfill. Replaces Floating UI where virtual anchors + React-state positioning aren't required. Includes @position-try collision fallback."
triggers: ["anchor positioning", "css anchor", "position-anchor", "anchor-name", "floating ui alternative", "native tooltip", "popover positioning"]
used_by: ["context-menu", "navigation-patterns", "search-ui", "form-builder"]
version: "3.2.0"
metadata:
  pathPatterns:
    - "**/*.css"
    - "**/*.tsx"
    - "**/*.jsx"
---

## Layer 1: Decision Guidance

### Why

Tooltips, popovers, dropdowns, menus — all require positioning relative to a trigger element with viewport-collision fallback. Pre-2025 standard: Floating UI (~8KB runtime + React integration). CSS Anchor Positioning does it in native CSS, zero runtime.

### When to Use

- Any static trigger → static popover relationship (hover card, tooltip, menu, dropdown).
- Accessibility-critical popovers (works with native `<dialog>` + Popover API).
- Replace Floating UI for 80% of use cases.

### When NOT to Use

- Virtual anchors (positioning relative to cursor, computed coordinates, touch events) — Floating UI still wins.
- React-state-driven positioning (open/close animations tied to Motion layoutId) — Floating UI's autoUpdate integrates cleaner.
- Heavy collision logic with >3 fallback directions — @position-try works but can get unwieldy.

### Decision Tree

```
Positioning need?
├─ Static trigger → static popover → Use CSS Anchor Positioning
├─ Follows cursor                → Floating UI
├─ Tied to React state animation → Floating UI
└─ Hover card / tooltip / menu    → CSS Anchor Positioning (with polyfill)
```

## Layer 2: Technical Spec

### Basic anchor + popover

```css
.trigger {
  anchor-name: --tooltip-anchor;
}

.tooltip {
  position: absolute;
  position-anchor: --tooltip-anchor;
  /* Place BELOW the trigger, aligned to its start edge */
  top: anchor(bottom);
  left: anchor(start);
  margin-top: 8px;
}
```

Or use `position-area` (higher level):

```css
.tooltip {
  position: absolute;
  position-anchor: --tooltip-anchor;
  position-area: bottom span-all;  /* below, full-width span */
}
```

Position area grid values: `top|bottom|left|right|start|end|center` × `span-all|span-left|span-right|...`.

### Collision fallback with @position-try

```css
@position-try --flip-to-top {
  top: auto;
  bottom: anchor(top);
  margin-top: 0;
  margin-bottom: 8px;
}

@position-try --flip-to-start {
  left: anchor(end);
}

.tooltip {
  position: absolute;
  position-anchor: --tooltip-anchor;
  top: anchor(bottom);
  left: anchor(start);
  position-try-fallbacks: --flip-to-top, --flip-to-start;
}
```

Browser tries default position; if viewport-collision, walks the `position-try-fallbacks` list.

### Working with Popover API (dialog-free dropdowns)

```html
<button popovertarget="menu" style="anchor-name: --menu-anchor">
  Open menu
</button>
<div popover id="menu" style="position-anchor: --menu-anchor; top: anchor(bottom);">
  ...
</div>
```

Combines Popover API (top-layer rendering, light-dismiss) with anchor positioning. No JS.

### Polyfill for Safari / Firefox (2026-04 still unshipped)

```bash
npm i @oddbird/css-anchor-positioning
```

```js
// Entry point
if (!CSS.supports('anchor-name: --x')) {
  import('@oddbird/css-anchor-positioning/polyfill');
}
```

Polyfill adds ~10KB gzipped when active. Native path costs zero.

### React usage pattern

```tsx
export function Tooltip({ children, content }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [anchorId] = useState(() => `--t-${crypto.randomUUID().slice(0, 8)}`);

  return (
    <>
      <button
        ref={triggerRef}
        style={{ anchorName: anchorId }}
        aria-describedby="tooltip"
      >
        {children}
      </button>
      <div
        role="tooltip"
        id="tooltip"
        style={{ positionAnchor: anchorId, top: 'anchor(bottom)' }}
      >
        {content}
      </div>
    </>
  );
}
```

Note: anchor names must be globally unique; use per-instance UUIDs.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| max_position_try_fallbacks | 1 | 4 | count | SOFT (readability) |
| polyfill_size_budget | — | 12 | KB gzipped | SOFT |
| anchor_name_uniqueness | required | — | — | HARD — global scope |
| prefer_position_area_over_anchor_fn | true | — | — | SOFT (higher-level API) |

## Layer 3: Integration Context

- **context-menu skill** — default to CSS Anchor Positioning for right-click menus; Floating UI only for cursor-following.
- **navigation-patterns** — dropdowns + mega menus default to anchor positioning.
- **search-ui** — autocomplete dropdown below search input.
- **form-builder** — validation tooltips anchored to form fields.
- **Polyfill inclusion** — design-system-scaffold conditionally imports when Safari/FF detected or always-on for cross-browser projects (~10KB cost vs. Floating UI ~8KB — roughly wash, but native path when supported).

## Layer 4: Anti-Patterns

- ❌ **Using for cursor-following elements** — anchor positioning is static-trigger only. Use Floating UI for cursor anchors.
- ❌ **Duplicate anchor-name values in same document** — broken. Each name must be globally unique.
- ❌ **Skipping the polyfill for cross-browser projects** — Safari/FF users get broken positioning (popover renders at 0,0).
- ❌ **Over-nesting @position-try** — >3 fallbacks becomes unreadable. Refactor with position-area.
- ❌ **Forgetting Popover API integration** — anchor-positioning + popover = the full-native dropdown pattern. Using anchor-positioning alone means you still need z-index / top-layer logic.
