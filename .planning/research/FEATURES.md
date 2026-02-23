# Feature Landscape: Modulo 2.0 Premium Frontend Design Plugin

**Domain:** AI-powered premium frontend design (Claude Code plugin)
**Researched:** 2026-02-23
**Mode:** Ecosystem + gap analysis from v6.1.0
**Overall Confidence:** HIGH (primary source is the codebase itself + domain expertise)

---

## Table Stakes

Features users expect. Missing = plugin feels incomplete compared to v6.1.0 or competitors.

### TS-1: Design Identity System (Design DNA)

| Aspect | Detail |
|--------|--------|
| **What** | Per-project visual identity generation: palette (12+ tokens), typography (display/body/mono), spacing scale, border radii, shadow layers, signature element, motion language |
| **Why Expected** | Core differentiator from v6.1.0. Without this, output reverts to generic AI slop. Every Awwwards winner has a cohesive visual language. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS but fragile. Design DNA drifts during long sessions. Builders sometimes ignore it. |
| **2.0 Requirement** | DNA must be machine-enforced, not advisory. Every color, font, and spacing value the builder emits must trace back to DNA tokens. Violations should be compile-time errors, not review-time catches. |
| **Dependencies** | None (foundational) |

### TS-2: Design Archetypes

| Aspect | Detail |
|--------|--------|
| **What** | 16 opinionated personality systems (Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future, Luxury, Playful, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir, Warm Artisan, Swiss, Vaporwave) plus custom builder |
| **Why Expected** | Prevents the "all sites look the same" trap. Each archetype locks in colors, fonts, mandatory techniques, forbidden patterns, and tension zones. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS and comprehensive. 16 archetypes with locked palettes, required fonts, mandatory techniques, forbidden patterns, and aggressive tension zones. |
| **2.0 Requirement** | Keep all 16 but make archetype constraints machine-enforced. Add validation that emitted code respects forbidden patterns. Consider adding 2-3 new archetypes for emerging aesthetics (Neubrutalism, AI-Native, Dark Academia). |
| **Dependencies** | TS-1 (Design DNA) |

### TS-3: Anti-Slop Quality Gate

| Aspect | Detail |
|--------|--------|
| **What** | 35-point / 7-category scoring system (Colors, Typography, Layout, Depth & Polish, Motion, Creative Courage, UX Intelligence) with hard fail threshold at 25/35 |
| **Why Expected** | The defining feature of Modulo vs. competitors. Without it, output is indistinguishable from v0 or Cursor. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS but enforcement is advisory. Builders can ignore low scores. Penalties exist (-3 for missing signature element, -5 for forbidden patterns, -5 for no creative tension) but are checked post-hoc. |
| **2.0 Requirement** | Shift from post-hoc review to inline enforcement. Each builder should self-check against slop criteria BEFORE emitting code. The gate should be structural, not just a checklist someone runs at the end. |
| **Dependencies** | TS-1, TS-2 |

### TS-4: Emotional Arc / Page Storytelling

| Aspect | Detail |
|--------|--------|
| **What** | 10 beat types (Hook, Tease, Reveal, Build, Peak, Breathe, Tension, Proof, Pivot, Close) with measurable parameters per beat. Archetype-specific arc templates and 6 transition techniques. Invalid sequences auto-rejected. |
| **Why Expected** | Transforms pages from "feature lists" into journeys. Every Awwwards SOTD winner has emotional pacing -- sections that build tension, peak moments, breathing room. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS and well-defined. Beat types have parameter tables (section height, element density, animation intensity, whitespace ratio, type scale). Archetype-specific templates exist. Forbidden sequences enforced. |
| **2.0 Requirement** | The system is strong in theory but weak in practice. Builders need to actually USE the beat parameters. The 2.0 version should make beat parameters into constraints that section builders cannot violate (e.g., a BREATHE section must have 70-80% whitespace ratio -- enforce it). |
| **Dependencies** | TS-1 |

### TS-5: Cinematic Motion System

| Aspect | Detail |
|--------|--------|
| **What** | 10-direction motion vocabulary (Reveal, Enter-Stage, Rise, Drop, Expand, Unfold, Cascade, Swarm, Scatter, Freeze), frame-by-frame choreography per beat, multi-layer hover choreography, 9 scroll patterns, per-archetype motion personalities |
| **Why Expected** | Award-winning sites choreograph motion like film scenes. Generic "fade in" animations are the motion equivalent of using Inter for headlines. |
| **Complexity** | High |
| **v6.1.0 Status** | EXISTS and very detailed. Full code examples for each pattern. Per-archetype motion tables with easing, duration, stagger, and character. |
| **2.0 Requirement** | The motion system is comprehensive but builders often default to "Rise" for everything. 2.0 needs: (a) motion presets generated from DNA that builders import, not hand-code; (b) motion diversity enforcement -- if 3 consecutive sections use the same direction, flag it; (c) CSS scroll-driven animations as the preferred path (zero JS, best performance). |
| **Dependencies** | TS-1, TS-4 |

### TS-6: Section Builder Architecture (Wave System)

| Aspect | Detail |
|--------|--------|
| **What** | Wave-based parallel execution: Wave 0 (scaffold + tokens), Wave 1 (shared UI), Wave 2+ (independent sections, max 4 per wave). Section builders read Design DNA, execute PLAN.md tasks, write SUMMARY.md. |
| **Why Expected** | Enables parallelism and prevents context rot. Without it, building a 10-section page serially causes quality degradation. |
| **Complexity** | High |
| **v6.1.0 Status** | EXISTS but context rot still occurs. The 2-wave session boundary helps but is a workaround, not a solution. |
| **2.0 Requirement** | Each builder must be truly stateless -- all context pre-extracted into spawn prompts. No builder should ever need to read STATE.md or cross-reference other builders' output. The PLAN.md must be fully self-contained. |
| **Dependencies** | TS-1, TS-4 |

### TS-7: Creative Tension System

| Aspect | Detail |
|--------|--------|
| **What** | 5 tension levels (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock). Per-archetype aggressive techniques. 1-3 tensions per page, spaced apart. |
| **Why Expected** | The difference between "well-designed" and "award-winning." Following archetype rules perfectly produces predictable output. Creative tension is the controlled rule-break that creates stop-scrolling moments. |
| **Complexity** | High |
| **v6.1.0 Status** | EXISTS and well-defined. Each archetype has 3 specific tension techniques with code examples. Rules for which rules to break and which to keep. |
| **2.0 Requirement** | Tension is well-defined but rarely bold enough in practice. Builders play it safe. 2.0 needs: (a) concrete, copy-paste tension implementations per archetype (not just descriptions); (b) boldness calibration -- the system should push builders to go further, not hold them back; (c) mandatory tension placement in the arc (at least one PEAK section must have a tension moment). |
| **Dependencies** | TS-1, TS-2, TS-4 |

### TS-8: Responsive Design

| Aspect | Detail |
|--------|--------|
| **What** | Mobile-first design, breakpoint strategies (375px, 768px, 1024px, 1440px), container queries, responsive navigation patterns, touch target compliance (44px min) |
| **Why Expected** | Every professional site must work on mobile. Awwwards heavily penalizes broken mobile experiences. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS with layout patterns, grid systems, mobile nav. But responsive is the most common failure mode -- hero text overflows, touch targets too small, animations break on mobile. |
| **2.0 Requirement** | Responsive must be built-in, not bolted on. Every component template must include mobile variants. Key changes: (a) test at 375px width as a hard constraint; (b) typography that scales properly (clamp() instead of fixed breakpoints); (c) animation budget that respects mobile GPU limits; (d) container queries for component-level responsiveness. |
| **Dependencies** | TS-1, TS-5 |

### TS-9: Performance-Aware Animation

| Aspect | Detail |
|--------|--------|
| **What** | Core Web Vitals compliance alongside heavy animation. Performance budgets: LCP < 2.0s, CLS < 0.05, TBT < 200ms. GPU-friendly properties only (transform, opacity). Animation budgets per page. |
| **Why Expected** | A site that scores 30/35 on anti-slop but 50 on Lighthouse is a failure. Premium agencies ship sites that BOTH look incredible and load fast. |
| **Complexity** | High |
| **v6.1.0 Status** | EXISTS via performance-guardian and performance-patterns skills. Comprehensive rules for font loading, code splitting, animation budgets, CSS containment. |
| **2.0 Requirement** | Performance rules are well-documented but not enforced. 2.0 needs: (a) mandatory Lighthouse audit as part of verify; (b) automatic code-splitting of GSAP/Three.js; (c) CSS scroll-driven animations as default (zero JS overhead); (d) font loading strategy baked into scaffold, not left to builder discretion. |
| **Dependencies** | TS-5, TS-6 |

### TS-10: Accessibility Compliance

| Aspect | Detail |
|--------|--------|
| **What** | WCAG AA compliance: 4.5:1 contrast ratios, keyboard navigation, ARIA labels, focus management, reduced-motion fallbacks, semantic heading hierarchy, skip-to-content link |
| **Why Expected** | Awwwards Usability axis scores heavily on accessibility. Legal requirements in many jurisdictions. Reduced motion is both an accessibility and performance win. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS via accessibility-patterns skill and visual-auditor checks. Reduced motion fallbacks documented for all wow moments. |
| **2.0 Requirement** | Accessibility must be structural, not advisory. Every component template must include ARIA attributes. Every animation must include `motion-safe:` / `motion-reduce:` variants. Automated axe-core audit should be part of verify. |
| **Dependencies** | TS-3, TS-5 |

---

## Differentiators

Features that set Modulo 2.0 apart from v0, Cursor, Figma AI, and other AI design tools. Not expected, but create competitive advantage.

### D-1: Wow Moment Library with Archetype Matching

| Aspect | Detail |
|--------|--------|
| **What** | 30+ signature interaction patterns across 4 categories (cursor-responsive, scroll-responsive, interactive, ambient), each tagged with archetype compatibility, beat compatibility, performance impact, and reduced-motion fallback. Builders select from this library rather than inventing from scratch. |
| **Why Differentiator** | No other AI tool has a curated library of award-caliber interactions matched to design personalities. v0 generates basic animations. Cursor generates competent but safe interactions. Modulo should generate IMPRESSIVE ones. |
| **Complexity** | High |
| **v6.1.0 Status** | EXISTS and is one of the strongest features. Magnetic buttons, spotlight grids, text distortion, parallax tilt, cursor morphing, perspective zoom, SVG line draw, sticky stack, expandable cards, terminal demos, gradient mesh, aurora effects -- all with full TSX code. |
| **2.0 Requirement** | Expand the library. Key additions: (a) View Transitions API patterns (cross-page shared element transitions); (b) Scroll-snapped gallery patterns (like Apple product pages); (c) Lottie integration for complex illustration animations; (d) WebGL shader effects (noise displacement, liquid distortion) via R3F; (e) Scroll-linked video playback (Apple AirPods-style). The selection should be automatic -- given an archetype and beat type, the system proposes 2-3 compatible wow moments. |
| **Dependencies** | TS-2, TS-4, TS-5 |

### D-2: Copy Intelligence System (Brand Voice Engine)

| Aspect | Detail |
|--------|--------|
| **What** | AI-generated copy that matches the archetype's tone, uses outcome-driven button labels, generates headline templates per beat type, writes personality-rich micro-copy, creates friction reducers, and writes error messages that are helpful not hostile. Banned word list enforced. |
| **Why Differentiator** | This is where AI tools universally fail. v0, Cursor, and Figma AI all produce placeholder-quality copy. "Learn More" buttons, "Feature 1" headings, generic taglines. Premium agencies obsess over every word. The copy IS the design. |
| **Complexity** | High |
| **v6.1.0 Status** | EXISTS via micro-copy skill with headline templates per beat type, button copy rules, empty state patterns, error message patterns, CTA patterns with social proof, and tone-per-archetype table. But in practice, copy is still the weakest output. |
| **2.0 Requirement** | Major upgrade needed. Current system gives builders templates but doesn't enforce them. 2.0 needs: (a) project-specific voice document generated during brainstorm (tone, vocabulary, forbidden words, sentence length targets); (b) copy validation -- no "Submit", "Learn More", "Click Here" should ever survive the build; (c) headline generator that considers the emotional arc position; (d) micro-copy that varies per archetype (Brutalist copy is blunt, Ethereal copy is gentle, Retro-Future copy is techy); (e) real-world content strategy -- placeholder metrics should at least be plausible, not "10,000+" for every site. |
| **Dependencies** | TS-1, TS-2, TS-4 |

### D-3: Shape & Asset Generation System

| Aspect | Detail |
|--------|--------|
| **What** | Procedural generation of decorative visual assets: SVG blobs, geometric patterns (dot grids, line grids, diagonal stripes), noise/grain textures, section dividers (wave, angle, curve), gradient mesh backgrounds, concentric rings, floating shapes, clip-path shapes, isometric illustrations. All theme-aware using DNA tokens. |
| **Why Differentiator** | Award-winning sites have bespoke visual assets, not stock illustrations. AI tools produce text and layout but not decorative visual elements. A procedural shape system generates unique-per-project assets without requiring external design tools. |
| **Complexity** | Medium-High |
| **v6.1.0 Status** | EXISTS via geometry-shapes skill with CSS clip-paths, SVG blobs, background patterns, floating circles, geometric grids, gradient meshes, generative polygons, concentric rings, 3D transforms, section dividers. |
| **2.0 Requirement** | Good foundation but needs expansion: (a) Generative SVG illustrations -- not just shapes but compositions (abstract scenes, botanical illustrations, isometric elements); (b) ASCII art / dot matrix patterns for Retro-Future archetype; (c) Hand-drawn line effects for Warm Artisan / Organic archetypes (SVG stroke with slight randomness); (d) Animated SVG patterns (paths that draw on scroll, morphing shapes); (e) Per-archetype shape palettes (each archetype gets a curated set of shapes/patterns that match its personality). All shapes must use DNA color tokens. |
| **Dependencies** | TS-1, TS-2 |

### D-4: Component Marketplace Integration

| Aspect | Detail |
|--------|--------|
| **What** | Ability to leverage premium open-source component libraries: Aceternity UI (animated components), Magic UI (motion-rich landing page elements), shadcn/ui (base primitives), and potentially 21st.dev (community components). Rather than reinventing every animation, pull from proven implementations and restyle them to match the project's Design DNA. |
| **Why Differentiator** | Working with existing component ecosystems rather than from scratch. Aceternity UI has ~50+ animated components (text effects, card hovers, background effects, scroll reveals) that would take weeks to build from scratch. Magic UI adds additional landing-page-specific patterns (bento grids, marquees, globe visualizations, dock navigation). The plugin should know HOW to use these libraries and when each component fits. |
| **Complexity** | Medium |
| **v6.1.0 Status** | PARTIAL. shadcn/ui is deeply integrated (comprehensive skill file with all components, composition patterns, custom components). But Aceternity UI, Magic UI, and 21st.dev are not referenced at all. |
| **2.0 Requirement** | Add knowledge of premium component libraries: (a) Aceternity UI component catalog (3D cards, infinite moving cards, text generate effects, spotlight borders, meteors, background beams, aurora backgrounds, SVG mask effects, text reveal, sticky scroll, parallax scroll, direction-aware hover, lens effect); (b) Magic UI component catalog (animated beam, bento grid, blur fade, border beam, dock, globe, marquee, number ticker, orbit, particles, shine border, shimmer button, sparkles text); (c) When-to-use matrix -- given a beat type and archetype, which marketplace component fits; (d) Restyling guidance -- how to apply DNA tokens to marketplace components (override default colors/fonts/spacing). DO NOT vendor these libraries into Modulo. Teach builders how and when to install and use them. |
| **Dependencies** | TS-1, TS-2, TS-5 |

### D-5: 3D & WebGL Effects System

| Aspect | Detail |
|--------|--------|
| **What** | React Three Fiber (R3F) integration for 3D scenes: floating shapes, particle fields, 3D product viewers, scroll-driven 3D animations, custom shaders (gradient spheres, noise displacement, liquid effects). Performance-gated: dynamic import only, ssr: false, mobile particle limits. |
| **Why Differentiator** | 3D elements are the most impressive wow moments on award-winning sites. Apple, Stripe, Linear, and nearly every recent SOTD winner uses at least one 3D element. Most AI tools cannot generate working R3F code. |
| **Complexity** | Very High |
| **v6.1.0 Status** | EXISTS via three-js-webgl skill with R3F setup, particle systems, 3D product viewers, scroll-driven 3D, custom shaders, proper Next.js/Astro integration patterns. |
| **2.0 Requirement** | Strengthen and expand: (a) More shader effects (noise displacement, liquid distortion, holographic materials); (b) Scroll-driven 3D scenes tied to emotional arc (shape transforms as user scrolls through narrative); (c) Lightweight alternatives -- not every 3D effect needs R3F. CSS 3D transforms, SVG 3D illusions, and isometric CSS can achieve 80% of the impact at 10% of the bundle cost; (d) Progressive enhancement -- 3D scenes should have a static image fallback; (e) Mobile detection and downgrade (reduce particles, disable orbit controls, use static render on low-end devices). |
| **Dependencies** | TS-9, TS-5 |

### D-6: Page Transition System

| Aspect | Detail |
|--------|--------|
| **What** | Smooth transitions between pages: View Transitions API (native browser), Framer Motion layout animations, shared element transitions (image morphing between list and detail views), exit animations before navigation. |
| **Why Differentiator** | Page transitions are the single biggest gap between award-winning sites and "good" sites. An instant white flash between pages breaks immersion completely. SPA-quality transitions on MPA architectures (via View Transitions API) are now possible and expected by Awwwards judges. |
| **Complexity** | High |
| **v6.1.0 Status** | MINIMAL. Framer Motion skill mentions page transitions via template.tsx but no View Transitions API knowledge, no shared element transitions, no exit animation orchestration. |
| **2.0 Requirement** | Critical gap to fill. 2.0 needs: (a) View Transitions API integration (the native browser API for cross-page transitions, supported in Chrome/Edge, graceful fallback elsewhere); (b) Framer Motion AnimatePresence with page-level exit animations; (c) Shared element transitions (layoutId patterns for list-to-detail morphs); (d) Navigation-aware loading states (skeleton that matches the target page layout); (e) Transition choreography per archetype (Brutalist: hard cut, Ethereal: slow fade, Kinetic: slide/scale). |
| **Dependencies** | TS-2, TS-5 |

### D-7: Live Browser Testing & Visual Audit

| Aspect | Detail |
|--------|--------|
| **What** | Automated visual quality verification: spawn browser, screenshot at multiple viewports (375px, 768px, 1024px, 1440px), run Lighthouse audit, check for horizontal overflow, verify touch target sizes, test dark/light mode, verify animation performance (FPS monitoring). |
| **Why Differentiator** | No other AI design tool verifies its own output in a real browser. v0 generates code and hopes it works. Modulo should PROVE it works. This closes the gap between "generated code" and "shipped product." |
| **Complexity** | Very High |
| **v6.1.0 Status** | PARTIAL. visual-auditor-live agent exists. Lighthouse command exists. responsive-check command exists. But integration is loose -- these are separate commands the user must invoke, not an automatic pipeline. |
| **2.0 Requirement** | Integrate into the verify pipeline: (a) Automatic browser launch + screenshot at 4 breakpoints; (b) Lighthouse performance audit with hard fail at score < 80; (c) Visual diff between expected layout (from PLAN.md wireframe description) and actual render; (d) Animation FPS monitoring -- flag animations that drop below 30fps; (e) Accessibility audit via axe-core. This is the highest-impact differentiator possible. |
| **Dependencies** | TS-3, TS-8, TS-9, TS-10 |

### D-8: Design System Scaffold with Baked-In Quality

| Aspect | Detail |
|--------|--------|
| **What** | Wave 0 auto-generates a complete design system from DNA: globals.css with all tokens as CSS custom properties, tailwind.config.ts mapped to variables, lib/motion.ts with reusable Framer Motion presets, section-wrapper component with beat awareness, font preloading, utility components (FadeIn, ScrollReveal, SplitText). |
| **Why Differentiator** | The scaffold IS the quality enforcement mechanism. If every builder imports motion presets from DNA rather than hand-coding easing curves, consistency is structural. If colors are only available as tokens, off-brand colors are impossible. |
| **Complexity** | Medium |
| **v6.1.0 Status** | EXISTS via design-system-scaffold skill. Generates globals.css, tailwind.config.ts, motion presets, section wrapper. |
| **2.0 Requirement** | Expand the scaffold: (a) Pre-built animation components that encode the DNA motion language; (b) Section template components per beat type with enforced parameter constraints; (c) Typography components that enforce the type scale; (d) Color utility that prevents arbitrary hex values; (e) Performance monitoring utilities (FPS counter, CLS observer). The scaffold should make it HARDER to produce slop than to produce quality. |
| **Dependencies** | TS-1, TS-5, TS-9 |

### D-9: Competitive Benchmarking Engine

| Aspect | Detail |
|--------|--------|
| **What** | Before building, analyze the competitive landscape: what do competing sites in this category look like? What's the minimum bar? What patterns are overused (and should be avoided)? What opportunity gaps exist? Generate benchmark report that informs the Design DNA and arc. |
| **Why Differentiator** | Premium agencies always start with competitive research. Studying what EXISTS prevents producing something that ALREADY EXISTS. This is how you get originality -- not by ignoring the landscape but by understanding it and deliberately differentiating. |
| **Complexity** | Medium |
| **v6.1.0 Status** | PARTIAL. design-researcher agent exists. awwwards-scoring skill has competitive benchmark process. But execution depends on the user providing reference URLs. |
| **2.0 Requirement** | Formalize the process: (a) Category-specific baseline knowledge (what SaaS landing pages typically look like, what portfolio sites typically look like, etc.); (b) "Avoid these" lists per category (for SaaS: avoid the symmetric 3-card features grid; for portfolios: avoid the masonry gallery); (c) Opportunity mapping -- what techniques are underused in this category; (d) Target score setting based on competitive analysis. |
| **Dependencies** | TS-3, TS-4 |

### D-10: Context Rot Prevention (Session Resilience)

| Aspect | Detail |
|--------|--------|
| **What** | Multi-layer defense system to maintain quality through extended build sessions: CONTEXT.md as single source of truth, pre-extracted spawn prompts, canary checks after each wave, session boundaries, baked-in rules in agent files, DNA compliance hooks. |
| **Why Differentiator** | The #1 problem with v6.1.0 is quality degradation over time. As Claude's context window fills, it forgets the DNA, ignores the arc, and produces generic output. No other AI design tool even acknowledges this problem, let alone solves it. |
| **Complexity** | Very High |
| **v6.1.0 Status** | EXISTS as a 6-layer system (L0 through L5). CONTEXT.md rewritten after every wave. Canary checks. Session boundaries every 2 waves. DNA compliance hook greps for anti-slop violations. |
| **2.0 Requirement** | This is the hardest problem in the entire system. 2.0 needs: (a) Radical context minimization -- each builder should need to read < 200 lines total; (b) Pre-compiled DNA snapshots (not the full document, but the 20 values that actually matter for this specific section); (c) Automated drift detection -- compare each builder's output against DNA tokens programmatically; (d) Recovery protocol -- if drift is detected, which specific values need to be re-anchored. |
| **Dependencies** | TS-1, TS-6 |

### D-11: Multi-Page Site Architecture

| Aspect | Detail |
|--------|--------|
| **What** | Support for multi-page sites with consistent design language: shared navigation, footer, theme across pages. Inner page templates (about, pricing, blog, documentation). Page-level emotional arcs that differ from the landing page. Cross-page elements (persistent sidebar, breadcrumbs). |
| **Why Differentiator** | v6.1.0 is essentially a single-page tool. Most real projects have 3-10 pages. A plugin that can only build landing pages is fundamentally limited. Premium agencies deliver complete site experiences. |
| **Complexity** | High |
| **v6.1.0 Status** | WEAK. The system is page-focused. No explicit multi-page orchestration, no inner-page templates, no shared component strategy across pages. |
| **2.0 Requirement** | Add multi-page support: (a) Site-level Design DNA that applies across all pages; (b) Page-type templates (landing, about, pricing, blog list, blog post, docs, contact); (c) Shared component extraction (nav, footer, theme toggle used across pages); (d) Per-page emotional arc customization (pricing page has a different arc than landing page); (e) Cross-page navigation design (how does moving between pages feel?). |
| **Dependencies** | TS-1, TS-4, D-6 |

### D-12: Dark/Light Mode with Archetype Awareness

| Aspect | Detail |
|--------|--------|
| **What** | Proper dual-theme support where both light and dark modes are hand-tuned for the archetype. Not just CSS `dark:` inversions but genuinely designed alternate appearances. Some archetypes are light-only (Ethereal, Editorial), some dark-only (Neon Noir), some need both. |
| **Why Differentiator** | Most AI tools generate either dark or light and the alternate mode looks terrible. Premium sites have both modes looking award-worthy. The archetype should determine which mode is primary and how the alternate mode adapts. |
| **Complexity** | Medium |
| **v6.1.0 Status** | PARTIAL. light-mode-patterns and premium-dark-ui skills exist. But they're separate knowledge bases, not an integrated system. The anti-slop gate checks "dark mode is hand-tuned" but doesn't enforce it. |
| **2.0 Requirement** | Integrated theming: (a) DNA defines both light and dark palettes per archetype; (b) Scaffold generates both theme token sets; (c) Each section is built with both modes tested; (d) Theme toggle animation matches the archetype (Kinetic: energetic flip, Ethereal: gentle fade, Brutalist: instant swap). |
| **Dependencies** | TS-1, TS-2, D-8 |

---

## Anti-Features

Features to explicitly NOT build. These cause bloat, reduce quality, or misalign with the plugin's purpose.

### AF-1: Template Gallery / Pre-built Pages

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Templates are the antithesis of Modulo's mission. The entire plugin exists because templates produce generic output. A template gallery signals "pick a starting point and customize" when the correct approach is "generate a unique identity and build from it." |
| **What to Do Instead** | Archetype system + Design DNA + emotional arc templates. These CONSTRAIN without PRESCRIBING. The output is unique every time because the inputs (archetype + project brief) create unique DNA. |

### AF-2: Drag-and-Drop Visual Builder

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Modulo operates through Claude Code's CLI. Adding visual manipulation would require a fundamentally different architecture (VS Code extension, web app, Electron). It also reduces quality -- manual positioning leads to arbitrary spacing, broken grids, and inconsistent rhythm. |
| **What to Do Instead** | Plan-based building where the AI proposes structure and the user approves/adjusts via conversation. The output is code, not a visual canvas. |

### AF-3: Real-Time Collaboration / Multiplayer

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Scope explosion. The plugin runs in a single Claude Code session. Adding multiplayer editing requires server infrastructure, conflict resolution, state synchronization -- none of which serve the core mission. |
| **What to Do Instead** | Clean handoff points. CONTEXT.md enables session transfer between human team members. The plugin's output (code + state files) is the collaboration medium. |

### AF-4: Backend / Database / Auth Integration

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Modulo is a FRONTEND DESIGN plugin. Skills like auth-ui, database-crud-ui, payment-ui exist in v6.1.0 but dilute the focus. A plugin that tries to do everything does nothing well. These 30+ app-building skills bloat the plugin and confuse the core value proposition. |
| **What to Do Instead** | Focus on design output (HTML, CSS, JS/TSX). Provide component shells (forms, data tables, dashboards) with world-class styling but no backend logic. If users need backend integration, other tools (v0, Cursor) handle that better. Modulo's value is making the FRONTEND beautiful, not making the full stack work. |

### AF-5: Custom Design Tool (Figma/Sketch Clone)

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Building design tools is a multi-year, multi-team effort. Figma exists. The plugin should COMPLEMENT Figma, not replace it. The figma-translator agent (translating Figma designs to code) is valuable; building a Figma competitor is not. |
| **What to Do Instead** | Accept Figma inputs (tokens, screenshots) and produce code outputs. The translation layer (Figma to Design DNA) is valuable and focused. |

### AF-6: CMS Content Management

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | CMS integration (Sanity, Contentful, WordPress) is infrastructure, not design. The plugin should produce beautiful static or dynamic pages, but the content source is the project's concern, not the design plugin's. The cms-integration skill in v6.1.0 adds complexity without improving design quality. |
| **What to Do Instead** | Produce clean data-fetching patterns (placeholder data structures) that any CMS can populate. Focus on how content LOOKS, not where it comes from. |

### AF-7: AI Image Generation

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Generating images requires different AI models (DALL-E, Midjourney, Stable Diffusion). Including image generation would couple the plugin to external services, add latency, and create quality inconsistency. Award-winning sites use professional photography, not AI-generated images. |
| **What to Do Instead** | Generate image TREATMENTS (aspect ratios, rounded corners, shadows, overlays, parallax), not images themselves. Provide placeholder strategies (dynamic placeholder SVGs, blur-up patterns) that look intentional rather than broken. Teach builders how to use unsplash/pexels URLs with proper treatments. |

### AF-8: Excessive Archetype Count

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | More archetypes = more maintenance, more edge cases, thinner quality per archetype. 16 is already a lot. Adding 10 more would spread the system too thin. Each archetype needs: locked palette, required fonts, mandatory techniques, forbidden patterns, tension zones, motion personality, copy tone, arc template -- that's significant per-archetype investment. |
| **What to Do Instead** | Keep 16 core archetypes. Add maximum 2-3 new ones (only if they represent genuinely distinct emerging aesthetics). Invest in making the custom archetype builder robust enough to cover edge cases. Quality per archetype > quantity of archetypes. |

### AF-9: Analytics / Tracking Integration

| Aspect | Detail |
|--------|--------|
| **Why Avoid** | Analytics code (Google Analytics, Plausible, PostHog) is boilerplate, not design. Including it adds zero visual quality and distracts from the core mission. The analytics-tracking skill in v6.1.0 is useful but doesn't belong in a premium design plugin. |
| **What to Do Instead** | Clean `<head>` structure that makes adding analytics trivial. But don't pre-install analytics -- that's the project's choice. |

---

## Feature Dependencies

```
Foundation Layer:
  TS-1 (Design DNA) ──────────────────────┐
       │                                   │
       v                                   v
  TS-2 (Archetypes) ──────────> TS-3 (Anti-Slop Gate)
       │                              │
       v                              v
  TS-4 (Emotional Arc) ────> TS-7 (Creative Tension)
       │
       v
  TS-5 (Motion System)
       │
       ├──> TS-8 (Responsive) ──> D-7 (Visual Audit)
       ├──> TS-9 (Performance) ──> D-5 (3D/WebGL)
       └──> D-1 (Wow Moments)

Build Layer:
  TS-6 (Wave System) ──> D-10 (Context Rot Prevention)
  D-8 (Scaffold) ──> All builders

Copy Layer:
  D-2 (Copy Intelligence) ──> TS-4 (Emotional Arc)

Experience Layer:
  D-6 (Page Transitions)
  D-11 (Multi-Page Architecture)
  D-12 (Dark/Light Mode)

Integration Layer:
  D-4 (Component Marketplace)
  D-3 (Shape Generation)
  D-9 (Competitive Benchmarking)
```

---

## MVP Recommendation

For Modulo 2.0 MVP, prioritize features that address the core v6.1.0 failure modes:

### Must Ship (Phase 1-2):

1. **TS-1: Design DNA** -- foundational, everything depends on it
2. **TS-2: Archetypes** -- personality system, keeps output unique
3. **TS-3: Anti-Slop Gate** -- quality enforcement, the brand promise
4. **TS-4: Emotional Arc** -- page storytelling, prevents flat output
5. **TS-5: Motion System** -- choreographed animation, core differentiator
6. **D-8: Scaffold** -- bakes quality into the build foundation
7. **D-10: Context Rot Prevention** -- without this, quality degrades and nothing else matters
8. **D-2: Copy Intelligence** -- currently the weakest output area

### Should Ship (Phase 3-4):

9. **TS-6: Wave System** -- parallelism, but can start with serial
10. **TS-7: Creative Tension** -- boldness, but requires foundation first
11. **D-1: Wow Moments** -- impressive interactions, but foundation must exist
12. **TS-8: Responsive** -- essential but can be enforced via scaffold constraints
13. **TS-9: Performance** -- critical but easier to add once animations exist
14. **D-3: Shape Generation** -- decorative assets, adds visual richness

### Defer to Post-MVP:

15. **D-4: Component Marketplace** -- useful but requires external library knowledge
16. **D-5: 3D/WebGL** -- impressive but high complexity, niche use cases
17. **D-6: Page Transitions** -- needs View Transitions API maturity
18. **D-7: Visual Audit** -- highest differentiator potential but highest complexity
19. **D-9: Competitive Benchmarking** -- valuable but complex to automate
20. **D-11: Multi-Page Architecture** -- important but can start with single-page
21. **D-12: Dark/Light Mode** -- nice to have, archetype-dependent
22. **TS-10: Accessibility** -- must be baked into scaffold from day 1, but dedicated audit can come later

---

## Gap Analysis: v6.1.0 vs. What Award-Winning Agencies Do

### What v6.1.0 Does Well
- **Archetype system** is genuinely innovative. No competitor has this.
- **Emotional arc** concept is sound and well-defined.
- **Wow moment library** is comprehensive with 30+ patterns.
- **Anti-slop gate** criteria are accurate -- the 35 points cover what matters.
- **Motion vocabulary** with 10 directions and per-archetype personalities is excellent.
- **Creative tension** system correctly identifies what makes designs boundary-pushing.

### What v6.1.0 Gets Wrong (Root Cause Analysis)

| Failure Mode | Root Cause | 2.0 Fix |
|--------------|-----------|---------|
| **Output quality degrades over time** | Context window fills up. Builders forget DNA. | Context rot prevention + radical context minimization + pre-compiled DNA snapshots |
| **Animations break** | Builders hand-code animations instead of using presets. No performance testing. | Motion presets auto-generated from DNA. Performance budget enforcement. CSS scroll-driven as default. |
| **Copy is generic** | Copy templates exist but aren't enforced. Builders default to "Learn More". | Copy validation as hard gate. Banned word list enforced at emit time. |
| **Designs play it safe** | Builders gravitate to "Rise" motion, standard layouts, generic hover states. | Diversity enforcement. Motion/layout must vary across sections. Tension moment mandatory in PEAK beat. |
| **Responsive breaks** | Mobile is an afterthought. Builders design for desktop, then patch mobile. | Mobile-first enforced. 375px test as hard constraint. Typography uses clamp(). |
| **Too many skills (87) cause confusion** | Skills cover everything from auth to payment to CMS. Dilutes focus. | Cull to ~30-40 pure design skills. Remove backend/infrastructure skills. |
| **Inconsistent quality across builders** | Each builder interprets DNA differently. No structural enforcement. | Scaffold generates typed utilities. Builders import, not re-implement. |

### What Awwwards SOTD Winners Do That Modulo Does Not (Yet)

1. **Page transitions** -- Nearly every recent SOTD winner has smooth cross-page transitions. Modulo has no page transition system.
2. **Scroll-linked video/animation sequences** -- Apple-style frame sequences, video scrubbing. Modulo mentions this but has no robust implementation.
3. **Custom cursor experiences** -- Beyond basic cursor morphing: cursor trails, cursor-as-spotlight, cursor-as-eraser. Modulo has basic cursor shape morph.
4. **Sound design** -- Subtle audio feedback on interactions. Controversial but used by top winners. NOT recommended for Modulo 2.0 (too niche).
5. **WebGL background effects** -- Noise displacement, liquid simulations, metaball effects as section backgrounds. Modulo has basic R3F but no shader-based backgrounds.
6. **Scroll-snap storytelling** -- Full-page scroll-snap sections with each "page" as a distinct moment. Modulo mentions scroll-snap but doesn't have deep patterns.
7. **Variable font animation** -- Weight/width transitions creating kinetic typography. Modulo has basic variable font support but not systematic use.
8. **Lottie/Rive animations** -- Complex illustration animations. Not mentioned in v6.1.0 at all.
9. **Performance despite complexity** -- Winners achieve 90+ Lighthouse while running GSAP + R3F + video. They use aggressive code splitting, intersection observer-based lazy loading, and progressive enhancement. Modulo knows this but doesn't enforce it.
10. **Content that tells a story** -- Not just feature lists but narrative arcs with real stakes, real problems, real solutions. The emotional arc system is designed for this but execution falls short.

---

## Real-World Pattern Analysis from Award-Winning Sites

**Confidence: MEDIUM** (based on domain expertise and training data through May 2025, not live site analysis)

### Patterns Consistently Seen in SOTD Winners

| Pattern | Frequency | Modulo Support |
|---------|-----------|----------------|
| Custom cursor (at least morphing shape) | ~70% of SOTD | YES (wow-moments) |
| Smooth page transitions | ~80% of SOTD | NO (critical gap) |
| Scroll-triggered text reveals (word-by-word) | ~60% of SOTD | YES (cinematic-motion) |
| Horizontal scroll sections | ~40% of SOTD | YES (gsap, cinematic-motion) |
| 3D elements (R3F or CSS 3D) | ~30% of SOTD | YES (three-js-webgl) |
| Dark mode with neon/glow accents | ~50% of SOTD | YES (archetypes) |
| Bento grid layouts | ~45% of SOTD | YES (creative-sections) |
| Grain/noise texture overlay | ~55% of SOTD | YES (geometry-shapes) |
| Gradient text on headlines | ~65% of SOTD | YES (anti-slop-design) |
| Marquee/infinite scroll elements | ~40% of SOTD | YES (creative-sections) |
| Sticky/stacking card sections | ~35% of SOTD | YES (wow-moments) |
| Magnetic button interaction | ~25% of SOTD | YES (wow-moments) |
| Spotlight/glow following cursor | ~30% of SOTD | YES (wow-moments, creative-sections) |
| Variable font weight animation | ~15% of SOTD | PARTIAL (creative-sections) |
| Lottie/Rive illustrations | ~20% of SOTD | NO (gap) |
| Video scrubbing on scroll | ~15% of SOTD | PARTIAL (cinematic-motion) |
| WebGL shader backgrounds | ~10% of SOTD | PARTIAL (three-js-webgl) |

### Breakpoint Strategies in Award-Winning Sites

Award-winning sites typically use 3-4 breakpoints with fluid typography:

| Approach | Usage | Notes |
|----------|-------|-------|
| **Mobile-first with clamp()** | Most common | `clamp(2rem, 5vw, 5rem)` for headlines. Reduces breakpoint-specific overrides. |
| **3 breakpoints: 640, 1024, 1440** | Common | Tablet gets its own design, not just scaled mobile. |
| **Container queries** | Emerging | Components respond to their container, not viewport. Best for reusable components. |
| **Fluid grid with auto-fit** | Very common | `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` eliminates most breakpoint needs. |

### Performance Strategies in Animation-Heavy Award Sites

| Strategy | Implementation |
|----------|---------------|
| **Lazy GSAP** | Dynamic import, only when section enters viewport |
| **CSS scroll-driven** | Zero JS overhead for scroll reveals. `animation-timeline: view()` |
| **Intersection Observer** | Load 3D scenes only when visible |
| **Progressive enhancement** | Static image first, 3D scene replaces after load |
| **will-change management** | Apply before animation, remove after |
| **CSS containment** | `contain: layout style paint` on independent sections |
| **Reduced motion** | Skip all JS animation for prefers-reduced-motion |
| **Font subsetting** | Latin-only subset, variable font single file |
| **Priority hints** | `fetchpriority="high"` on hero LCP image |

---

## Sources

| Source | Type | Confidence |
|--------|------|-----------|
| v6.1.0 codebase (87 skills, 17 agents, 13 commands) | Primary source | HIGH |
| Domain expertise on Awwwards winners and premium web design | Training data | MEDIUM |
| Aceternity UI component knowledge | Training data | MEDIUM |
| Magic UI component knowledge | Training data | MEDIUM |
| CSS scroll-driven animations API | Training data | MEDIUM |
| View Transitions API | Training data | MEDIUM |
| React Three Fiber documentation | Training data | MEDIUM |
| GSAP ScrollTrigger documentation | Training data | MEDIUM |
| Core Web Vitals metrics and thresholds | Training data | HIGH |

**Note:** WebSearch and WebFetch were unavailable during this research. Findings about current SOTD patterns and component marketplace details are based on training data (through May 2025) and should be verified against current sources before implementation.
