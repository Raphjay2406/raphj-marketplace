---
name: cross-doc-view-transitions
tier: domain
description: "Cross-document View Transitions (MPA) — native smooth page-to-page transitions via @view-transition rule. Chrome 126+, Safari 18.2+ shipped (2026); Firefox still flagged. Zero JS, graceful fallback. Pair with view-transition-name on shared elements for morph effects."
triggers: ["view transitions", "cross-document view transitions", "MPA transitions", "@view-transition", "page transition", "shared element morph"]
used_by: ["page-transitions", "nextjs-patterns", "astro-patterns", "multi-page-architecture"]
version: "3.2.0"
metadata:
  pathPatterns:
    - "**/*.css"
    - "**/*.tsx"
    - "**/*.astro"
---

## Layer 1: Decision Guidance

### Why

Editorial sites, portfolios, and multi-page marketing sites historically felt "jankier" than SPAs because hard navigations flash. Cross-document View Transitions make MPA navigation feel as smooth as SPA — natively, in CSS, with zero JS. Chrome + Safari shipped 2026; Firefox pending.

### When to Use

- MPA archetypes (Editorial, Portfolio, Agency, Publishing-Media).
- Astro sites (MPA-first by default).
- Next.js App Router hard navigations (not `<Link>` soft nav — that's SPA).
- Same-origin navigation only (security boundary).

### When NOT to Use

- SPA-heavy apps (use soft-nav animations instead).
- Cross-origin navigation (blocked by spec).
- Mobile with `prefers-reduced-motion` — opt out via CSS.

## Layer 2: Technical Spec

### Enable cross-document transitions

```css
/* In site-wide CSS */
@view-transition {
  navigation: auto;
}
```

That's it. All same-origin hard navigations now use the view-transition pseudo-element tree during navigation.

### Default: root cross-fade

Browser automatically creates `::view-transition-old(root)` and `::view-transition-new(root)` pseudo-elements. Default animation = cross-fade.

### Customize root transition

```css
::view-transition-old(root) {
  animation: fade-out 300ms ease-out;
}
::view-transition-new(root) {
  animation: fade-in 300ms ease-out;
}

@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
```

### Shared-element morph across pages

Same `view-transition-name` on source (page A) and destination (page B) → morph:

```css
/* On both pages */
.hero-logo {
  view-transition-name: hero-logo;
}
```

Browser measures position, size, opacity on both sides; animates the morph automatically. Used for logo-to-nav transitions, hero-image-to-detail transitions (editorial/commerce).

### Per-name customization

```css
::view-transition-old(hero-logo),
::view-transition-new(hero-logo) {
  animation-duration: 500ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

Mandatory. WCAG 2.3.3.

### Framework integration

**Astro** — works out of the box with `<ClientRouter />` OR with cross-doc rule (use cross-doc for true MPA feel, ClientRouter for SPA-like).

**Next.js App Router** — hard navigation (`router.refresh()`, full page reloads) uses cross-doc. Soft nav via `<Link>` uses React 19.2+ `<ViewTransition>` (separate API).

**SvelteKit / Nuxt** — same-origin MPA navigation picks up automatically with the CSS rule.

### Fallback strategy

No JS required. Browsers without support just do instant navigation (pre-2026 behavior). Zero cost when unsupported.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| same_origin_only | required | — | — | HARD (spec) |
| reduced_motion_fallback | required | — | — | HARD (WCAG) |
| root_transition_duration | 100 | 500 | ms | SOFT (sweet spot 200-400) |
| shared_element_name_uniqueness | required per transition | — | — | HARD |
| animate_only_transform_opacity | prefer | — | — | SOFT (perf) |

## Layer 3: Integration Context

- **page-transitions skill** — this skill is the MPA branch; soft-nav SPA branch stays in page-transitions.
- **multi-page-architecture** — default-enables for Editorial, Portfolio archetypes.
- **astro-patterns** — Astro docs reference; this skill provides Genorah-specific choreography.
- **nextjs-patterns** — cross-doc vs soft-nav decision tree; Genorah defaults by archetype.
- **motion-health** — cross-doc transitions count against motion budget; ~100-400ms is free-budget cost.

## Layer 4: Anti-Patterns

- ❌ **Using cross-doc for SPA apps** — redundant; use `<ViewTransition>` / framework soft-nav.
- ❌ **Same view-transition-name on multiple elements per page** — breaks the transition silently.
- ❌ **Animating non-transform/opacity properties in transitions** — layout thrash on every navigation.
- ❌ **No reduced-motion fallback** — WCAG violation.
- ❌ **Shared-element morph without matching destination element** — turns into a cross-fade awkwardly.
- ❌ **Cross-origin expectations** — spec forbids for security. Same-origin navigation only.
