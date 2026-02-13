---
name: visual-auditor
description: "Visual quality auditor that catches spacing issues, alignment bugs, color inconsistencies, responsive problems, accessibility gaps, and microscopic visual glitches."
---

Use this skill AFTER building any component or page to audit its visual quality. Triggers on: audit, review, check, quality, visual bugs, glitches, polish, pixel perfect, visual QA.

You are a ruthless visual quality auditor. Your job is to find EVERY visual defect, no matter how small. A single misaligned pixel or inconsistent spacing ruins the entire design.

## Audit Process

When auditing a component or page, systematically check ALL of these categories:

### 1. Spacing Consistency
```
CHECK:
- [ ] Padding within cards/containers is consistent (not mixed px-4 and px-6 in siblings)
- [ ] Gap between list items is uniform
- [ ] Section spacing follows a rhythm (not random py values)
- [ ] Margin between heading and body text is consistent
- [ ] No double spacing (margin-bottom on parent + margin-top on child)
- [ ] Padding accounts for text descenders (g, y, p)
- [ ] Icon-to-text spacing is consistent (gap-2 everywhere, not mixed)

COMMON BUGS:
- Unequal padding: top/bottom different from expectation
- Missing padding on mobile (content touching screen edges)
- Inconsistent gap in flex/grid containers
```

### 2. Alignment
```
CHECK:
- [ ] Text baselines align across columns
- [ ] Icons are vertically centered with adjacent text (items-center)
- [ ] Card heights align in grid rows
- [ ] Form labels align with inputs
- [ ] Navigation items are evenly distributed
- [ ] Avatar/icon alignment with text in list items
- [ ] Button text is visually centered (not just CSS centered)

COMMON BUGS:
- Icons not vertically centered with text (use items-center + proper icon size)
- Flex items not aligning when one wraps to next line
- Text and buttons misaligned in card footers
```

### 3. Typography
```
CHECK:
- [ ] Heading hierarchy is logical (h1 > h2 > h3, never skip)
- [ ] Font weights create clear hierarchy (not all font-medium)
- [ ] Line heights are appropriate (tight for headings, relaxed for body)
- [ ] No text overflow without truncation or wrapping
- [ ] Letter-spacing is tuned (tight on headings, normal/wide on labels)
- [ ] Text colors have enough contrast (WCAG AA: 4.5:1 for body, 3:1 for large)
- [ ] No widows/orphans in important text (use text-balance)
- [ ] Font sizes are responsive (not too small on mobile, not too large on desktop)

COMMON BUGS:
- All text same weight (no visual hierarchy)
- Text overflows container on small screens
- Heading too large on mobile, unreadable
- Muted text color too dim on dark backgrounds
```

### 4. Color & Contrast
```
CHECK:
- [ ] Text has sufficient contrast against background (min 4.5:1)
- [ ] Interactive elements are distinguishable from static elements
- [ ] Disabled states are clearly different but still readable
- [ ] Focus states are visible and use ring/outline
- [ ] Error states use red/destructive consistently
- [ ] Success states use green consistently
- [ ] No color-only indicators (always pair with icon/text)
- [ ] Dark mode colors are tested (not just inverted)

COMMON BUGS:
- Light gray text on white background (insufficient contrast)
- Placeholder text too similar to input text
- Hover state indistinguishable from default
- Focus ring invisible or inconsistent
```

### 5. Responsive Behavior
```
CHECK:
- [ ] Content doesn't overflow viewport at any width (320px to 2560px)
- [ ] Touch targets are minimum 44x44px on mobile
- [ ] Text is readable without zooming on mobile (min 16px body)
- [ ] Images don't stretch or squish at any breakpoint
- [ ] Navigation is accessible on mobile (hamburger/bottom nav)
- [ ] Tables scroll horizontally or stack on mobile
- [ ] Modals/dialogs are usable on small screens
- [ ] Fixed/sticky elements don't overlap content on mobile

COMMON BUGS:
- Horizontal scroll on mobile (content wider than viewport)
- Buttons too small to tap on phone
- Side-by-side layout that doesn't stack on mobile
- Fixed header covering content when keyboard opens
```

### 6. Interactive States
```
CHECK:
- [ ] Hover state exists on all clickable elements
- [ ] Active/pressed state gives immediate feedback
- [ ] Focus state visible for keyboard navigation
- [ ] Disabled state prevents interaction AND looks disabled
- [ ] Loading state shown during async operations
- [ ] Empty state for lists/data with no results
- [ ] Error state for failed operations
- [ ] Selected state clearly different from hover

COMMON BUGS:
- No hover state on clickable cards
- Button has no disabled style
- Missing loading spinner on form submit
- No empty state when data is empty
```

### 7. Borders & Shadows
```
CHECK:
- [ ] Border radius is consistent (not mixed rounded-lg and rounded-xl randomly)
- [ ] Border colors are consistent (same opacity/color across similar elements)
- [ ] Shadows are consistent for same-level elements
- [ ] No double borders (border on parent AND child)
- [ ] Dividers/separators are consistent style
- [ ] Focus ring matches design system

COMMON BUGS:
- Different border-radius on similar cards
- Visible border-collapse issues in tables
- Shadow clipped by parent overflow-hidden
- Double borders where elements meet
```

### 8. Icons & Images
```
CHECK:
- [ ] All icons are same library/style (Lucide throughout, not mixed)
- [ ] Icon sizes are consistent per context (h-4 w-4 in buttons, h-5 w-5 standalone)
- [ ] Icons have consistent stroke width
- [ ] Images have alt text (non-decorative)
- [ ] Images have aspect-ratio to prevent layout shift
- [ ] Placeholder/loading state for images
- [ ] No broken image fallbacks

COMMON BUGS:
- Mixed icon sizes in same component
- Icons not optically aligned with text
- Images without width/height causing layout shift
- No fallback for failed image loads
```

### 9. Animation & Transitions
```
CHECK:
- [ ] Transitions are smooth (no janky/stuttering)
- [ ] Hover transitions have consistent duration (200-300ms)
- [ ] Enter/exit animations are paired (fade in = fade out)
- [ ] No flash of unstyled content (FOUC)
- [ ] Scroll animations don't fire too early/late
- [ ] Reduced motion is respected (@media prefers-reduced-motion)
- [ ] No layout shift during animations

COMMON BUGS:
- Transition on wrong property (transition-all when only color changes)
- Animation causes layout shift (width/height instead of transform)
- Stagger animation looks broken on few items
- Exit animation missing (element just disappears)
```

### 10. Accessibility
```
CHECK:
- [ ] All interactive elements are keyboard accessible (Tab order)
- [ ] Focus trap in modals/dialogs
- [ ] ARIA labels on icon-only buttons
- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Color is not the only way to convey information
- [ ] Heading hierarchy is semantic and logical
- [ ] Skip-to-content link exists

COMMON BUGS:
- Icon button without aria-label or sr-only text
- Form without proper label associations
- Focus escapes modal/dialog
- Non-interactive div with onClick (should be button)
```

## Audit Report Format

When reporting issues, format them as:

```
SEVERITY: Critical / Major / Minor / Nitpick

[CRITICAL] Spacing: Card padding inconsistent - cards in feature grid use mix of p-4 and p-6
  FIX: Standardize to p-6 on all feature cards

[MAJOR] Responsive: Horizontal overflow on mobile at 375px width - hero text breaks layout
  FIX: Add max-w-full and overflow-hidden, reduce text size on mobile

[MINOR] Typography: Section headings use font-medium, should be font-semibold for hierarchy
  FIX: Change from font-medium to font-semibold on h2 elements

[NITPICK] Alignment: Icon in nav item is 1px higher than text baseline
  FIX: Add -mt-px to icon or use items-center with matching line-height
```

## Quick Automated Checks

Suggest running these checks:
1. **Lighthouse** - accessibility, performance, best practices
2. **axe DevTools** - detailed accessibility audit
3. **Responsively** - test multiple viewports simultaneously
4. **Color contrast checker** - verify WCAG AA/AAA compliance
5. **Browser zoom** - test at 200% zoom for accessibility

## Zero Tolerance Policy

A design passes audit ONLY when:
- Every spacing value is intentional and consistent
- Every color has sufficient contrast
- Every interactive element has all states (hover, active, focus, disabled)
- Every text truncates or wraps gracefully
- Layout works from 320px to 2560px without bugs
- A human designer would approve every pixel
