# Phase 8: Experience & Frameworks - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Every generated site works correctly across all target frameworks (Next.js, Astro, React/Vite, Tauri, Electron), is responsive from ~320px up with 375px as the design target, meets WCAG 2.1 AA with no exceptions, supports multi-page architecture, has award-worthy dark and light modes with equal parity, and all surviving skills are rewritten to the 4-layer format with current library versions. Framework detection is auto-detected then user-confirmed.

</domain>

<decisions>
## Implementation Decisions

### Responsive Philosophy
- Fluid floor: 375px is the design target, fluid scaling (clamp, vw units) gracefully handles down to ~320px without horizontal scroll
- Container queries vs media queries: Claude's discretion per component type — container queries where composability matters, media queries for page-level layout
- Dramatic recomposition between breakpoints — mobile and desktop can be fundamentally different layouts (stacking, carousels, tab bar nav). Maximum use of screen real estate at every size
- Typography: hybrid scaling — body text uses clamp() for smooth fluid scaling, display/heading type uses breakpoint steps for dramatic size changes matching layout recomposition
- 44x44px minimum touch targets enforced on mobile

### Framework Skill Scope
- Next.js: full coverage of BOTH App Router and Pages Router equally — some projects still use Pages Router
- Astro: Islands architecture with full patterns
- React/Vite: full coverage
- Tauri and Electron: full desktop-aware design skills — window chrome, system tray, native menus, titlebar areas, drag regions, multi-window patterns
- Framework detection: auto-detect from project files (package.json, config, directory structure), then confirm with user during discovery. Stored in DESIGN-DNA.md
- All surviving skills get full rewrite to 4-layer format (Decision Guidance, Award-Winning Examples, Integration Context, Anti-Patterns) with current library versions (Tailwind v4, Motion 12.x, GSAP 3.14)

### Dark/Light Mode Identity
- Equal parity — both modes independently award-worthy, neither derived from the other
- Each has its own palette nuances, depth treatment, and polish
- Signature transition per archetype — Brutalist might hard-cut, Ethereal might light-bloom, Kinetic might wipe. Transition animation is part of design identity
- Dual asset support — dark/light variants for key visuals (logos, illustrations, decorative elements). Photos use automatic treatment (reduced brightness, slight desaturation)
- Token mapping: hybrid — DNA generates both light and dark palettes upfront during /modulo:start-design. If user only defines one, archetype inversion rules derive the other

### Accessibility Depth
- Strict WCAG 2.1 AA everywhere — no exceptions, every component, every interaction, every state
- Motion-reduce: archetype-aware alternatives — each archetype defines its own reduced-motion variant that retains personality (Kinetic uses subtle fades, Ethereal keeps slow drifts)
- Full keyboard operability with archetype-styled focus indicators — every interactive element reachable via keyboard, custom focus management, roving tabindex, arrow key nav within groups. Focus indicators match archetype design (Neon Noir glow rings, Swiss clean outlines, Brutalist thick borders)
- Testing: component-level axe-core patterns in the accessibility skill, page-level audits in Phase 4's live testing skill. Different scopes, no overlap
- Full ARIA patterns for all interactive components — explicit roles, states, properties. Custom live regions for dynamic content. Detailed landmark structure
- Color-blind safe: archetype-specific color-blind adjustments — never rely on color alone, plus each archetype's palette includes tested alternatives for protanopia, deuteranopia, tritanopia
- Touch targets: 44x44px minimum enforced, spacing between targets prevents misclicks

### Claude's Discretion
- Container queries vs media queries decision per component type
- Accessible content hiding technique per use case (sr-only vs aria-label/aria-labelledby)
- Exact reduced-motion animation choices per archetype (within the personality constraint)
- Multi-page architecture details (site DNA, page-type templates, shared components, per-page emotional arcs)

</decisions>

<specifics>
## Specific Ideas

- Typography hybrid approach (clamp for body, stepped for display) is specifically to match the dramatic layout recomposition between breakpoints — type hierarchy should feel intentionally different at each size, not just scaled
- Focus indicators as part of the design system, not an afterthought — they should be as designed as any other UI element
- Dark mode transition as identity element, not utility — the moment of switching themes should feel crafted per archetype
- Desktop framework skills (Tauri/Electron) should address desktop-specific design patterns that web-only skills miss: window chrome integration, system tray, drag regions

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-experience-frameworks*
*Context gathered: 2026-02-24*
