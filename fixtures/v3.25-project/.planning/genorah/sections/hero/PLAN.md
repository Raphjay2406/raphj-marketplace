---
section: hero
beat: HOOK
wave: 2
status: DONE
reference: "Virgil Abloh Portfolio — typographic brutalism"
---
# Section Plan — hero

## Beat Type
HOOK — maximum impact, archetype-unmistakable entry.

## Layout
Full-viewport, single typographic column.
Raw concrete CSS noise overlay (no image).
Ultra-wide Söhne Breit at 96px desktop / 48px mobile.

## Motion
- [ ] Text reveal: staggered character-by-character, 80ms interval, ease-out
- [ ] Noise overlay: slow drift animation, 8s loop, linear
- [ ] Scroll indicator: pulsing chevron, 1.4s ease-in-out

## Responsive
- 1440px: 96px display, 2-column eyebrow + heading
- 1280px: 80px display, same layout
- 768px: 56px display, single column
- 375px: 36px display, tight padding, chevron centered

## Accessibility
- heading: h1, role="banner"
- noise overlay: aria-hidden="true"
- motion: prefers-reduced-motion respects all animations

## Component Registry
- HeroSection (hero-section)
- NoiseOverlay (noise-overlay)
- ScrollChevron (scroll-chevron)

## Reference Target
Visual spectacle — raw typographic brutalism, high contrast, maximum presence.

## Tasks
- [x] Scaffold component structure
- [x] Implement noise overlay CSS
- [x] Staggered text reveal with framer-motion
- [x] 4-breakpoint responsive testing
- [x] Quality gate: 214/234
