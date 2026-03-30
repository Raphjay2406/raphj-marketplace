# Phase 5: Motion & Design Skills - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

The motion vocabulary, creative tension toolkit, wow moment library, page transitions, and design system scaffold that make every Genorah-generated site feel award-winning. Covers: cinematic motion presets, creative tension TSX implementations, 30+ wow moment patterns, page transition choreography, performance-aware animation, and DNA-enforced design system scaffold generation. Does NOT include framework-specific adaptations (Phase 8), live browser testing (Phase 4), or asset generation (Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Motion philosophy & defaults
- Motion intensity is **archetype-driven** — no single global default. Each archetype defines its own motion profile (Kinetic = bold, Japanese Minimal = restrained, etc.)
- Scroll-driven animations are **beat-dependent** — HOOK and PEAK beats get continuous scroll-linked motion (parallax, progress-based transforms). Other beats get entrance-only reveals
- Motion presets use a **hybrid model** — archetype provides the base family (timings, easings, staggers), DNA tweaks the parameters (speed multiplier, easing curve adjustments). Unique per project without reinventing from scratch

### Wow moment curation
- Wow moment count is **archetype-dependent** — Kinetic/Neon Noir may have 5+, Japanese Minimal may have 1
- All categories equally important — cursor/hover effects, scroll-linked reveals, 3D/WebGL touches, and micro-interactions should all have deep coverage in the library
- **Tiered code specificity** — simple effects (magnetic button, custom cursor) are complete copy-paste TSX/CSS. Complex effects (WebGL shader, scroll video) are pattern + guidance for project-specific adaptation
- Auto-suggestion uses **three-factor matching** — archetype + emotional beat type + section content type. Most contextual recommendations possible

### Creative tension calibration
- Tension mandate is **archetype-driven** — some archetypes (Brutalist, Kinetic, Neon Noir) require tension in most sections, others (Swiss, Japanese Minimal) use it sparingly
- Each of the 5 tension levels has a defined **safe range and aggressive range** — archetype picks which range to operate in. Precise calibration, not blanket boldness
- **Full copy-paste TSX per archetype tension technique** — each archetype's 3 tension techniques come with complete working implementations. Builder drops in and adjusts DNA tokens
- **Dual adjacency rules** — different tension types required between tension sections AND at least 1 non-tension section between any two tension sections. Maximum variety and impact

### Design system scaffold strategy
- **Hard enforcement** of DNA tokens — typed utilities that ONLY accept DNA tokens. Arbitrary hex colors or unsanctioned spacing values are structurally impossible
- **Full beat templates** per emotional beat type — each beat (HOOK, PEAK, BREATHE, etc.) gets a starter template with whitespace ratios, element counts, and motion defaults pre-baked
- Wave 0 auto-generates **everything possible** from DNA — globals.css, tailwind config, color utilities, type scale, spacing utilities, motion presets, component base styles, section beat templates. The full kit
- When builders need something not in scaffold, they **extend it** — propose new utility/token that gets added to the design system permanently. Living system that grows with the project

### Claude's Discretion
- Motion tech stack selection per situation (CSS-first, Framer Motion, GSAP — pick best tool per archetype and complexity)
- Reduced-motion handling and accessibility fallbacks
- Exact easing curve mathematics within archetype parameters
- Performance budgets per animation type
- Page transition choreography details

</decisions>

<specifics>
## Specific Ideas

- The hybrid motion preset model should feel like "archetype is the genre, DNA is the artist" — same musical style, different performance
- Wow moment auto-suggestion should consider what's IN the section (a hero with a large image suggests different wow moments than a stats grid)
- Tension adjacency rules (different types + spacing) ensure tension moments feel like deliberate punctuation, not visual noise
- Hard token enforcement is the key insight: making slop structurally impossible beats catching slop in review

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-motion-design-skills*
*Context gathered: 2026-02-24*
