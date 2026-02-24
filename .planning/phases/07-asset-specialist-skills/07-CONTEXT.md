# Phase 7: Asset & Specialist Skills - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate and integrate rich visual assets -- procedural shapes, 3D scenes, marketplace components, video content, Spline embeds, and AI image prompts -- all constrained to project DNA. Each specialist skill provides domain knowledge for builders; this phase does NOT add new commands or pipeline stages.

</domain>

<decisions>
## Implementation Decisions

### Shape & SVG Generation
- Shapes serve both roles equally: atmospheric backgrounds AND foreground visual elements (illustrations, branded graphics)
- Per-archetype shape palettes are guided with flexibility -- recommend primary shape families and forbidden ones, but builders can mix in related shapes if they fit DNA
- Full SVG animation suite: path drawing, morphing, particle systems, procedural generation (noise-based), animated patterns, and scroll-linked SVG sequences
- Hybrid generation approach: core utility functions provided as ready-to-use components (noise, randomization), complex compositions described algorithmically for Claude to assemble per-project
- Taxonomy: purpose-primary, technique-secondary -- top-level by WHERE/WHY shapes are used (dividers, backgrounds, accents, hero illustrations), with technique details nested inside each category
- Beat-aware shape guidance: HOOK beats get bold/large shapes, BREATHE beats get minimal/subtle, PEAK beats get complex/animated. Skill maps shape intensity to beat types

### 3D/WebGL Scope
- 3D is available throughout projects, not just reserved for hero moments -- can appear in backgrounds, product showcases, interactive sections
- Three-tier responsive 3D: full (desktop), reduced (tablet), static fallback (mobile <768px). Progressive enhancement based on device capability detection
- Comprehensive shader coverage: noise/grain, liquid/fluid distortion, holographic/iridescent, glass refraction, particle systems, volumetric fog, custom post-processing, ray marching, displacement mapping
- Building blocks only, not scene presets -- individual techniques (shaders, lighting, camera, controls) that builders compose into custom scenes
- Scroll-driven 3D covers both camera movement (orbit, zoom, pan) AND scene changes (morphing, material changes, lighting shifts, element reveals)
- WebGL is the primary technology (Three.js/R3F), with a brief forward-looking section on WebGPU readiness and when to consider it
- DNA-guided with creative freedom for 3D materials: primary materials use DNA tokens, but shaders/effects can introduce computed colors (holographic rainbow from DNA base, noise-generated gradients)

### Marketplace Component Guidance
- All four marketplaces covered equally: Aceternity UI, Magic UI, 21st.dev, Framer marketplace
- Category recommendations (not specific components): recommend component CATEGORIES per archetype + beat (e.g., "animated card grid" rather than "Aceternity Bento Grid"). More durable as marketplaces evolve
- Full restyling protocol: token mapping (CSS variable swaps) PLUS structural modifications (layout adjustments), animation restyling (match DNA motion language), and archetype-specific customizations
- Hard limit on marketplace usage: no more than ~30% of visual elements from marketplaces. Forces original work for the majority and prevents "assembled from parts" feeling

### Image Prompt Generation
- Tool-agnostic prompts: describe desired output (style, mood, composition, DNA alignment) without tool-specific syntax. Users adapt to their preferred tool
- Full DNA translation: color palette, archetype personality, texture preferences, motion language (for animated stills), and forbidden patterns all feed into prompt construction
- DNA-derived negative prompts: automatically derive what to avoid from DNA forbidden patterns and archetype constraints (e.g., if archetype forbids gradients, include "no gradients" in negatives)
- Include anti-patterns: advise when AI images hurt the design -- certain archetypes may favor real photography or curated stock over AI-generated images
- Category-specific prompt templates: hero backgrounds, product shots, team portraits, abstract textures, illustrations -- each category has DNA-aware modifiers

### Remotion (Video Generation)
- Separate skill from Spline (not combined)
- Full creative suite: hero/background video generation, product demo animations, and social media asset generation (OG images, video previews)

### Spline Integration
- Separate skill from Remotion
- Embedding + creation guidance: embedding patterns (performance, interaction binding, responsive, DNA color mapping) PLUS guidance on creating Spline scenes that match DNA (camera angles, lighting, materials, color tokens)

### Claude's Discretion
- Whether isometric/CSS pseudo-3D illustrations belong in the shape skill or the 3D skill
- 3D performance budgets: whether the 3D skill defines its own hard limits or defers to Phase 5's Performance-Aware Animation skill

</decisions>

<specifics>
## Specific Ideas

- Shape intensity should track emotional arc beats -- creates a visual rhythm that mirrors the page's emotional progression
- Procedural shapes should use DNA color tokens exclusively, but 3D shader effects get creative freedom to compute derived colors
- Marketplace components are capped at ~30% to enforce originality -- the anti-slop gate already catches "template feel," but a hard limit in the skill prevents it earlier in the process
- Image prompts should be tool-agnostic because the AI image tool landscape changes rapidly; describing the desired output is more durable than tool-specific syntax

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 07-asset-specialist-skills*
*Context gathered: 2026-02-24*
