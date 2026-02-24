---
phase: 02-pipeline-architecture
plan: 05
subsystem: specialist-agents
tags: [3d-specialist, animation-specialist, content-specialist, domain-expert, stateless-agent, progressive-enhancement, scroll-driven-css, brand-voice]

dependency_graph:
  requires: [02-03]
  provides: [3d-specialist-agent, animation-specialist-agent, content-specialist-agent, specialist-routing-via-builder-type]
  affects: [02-06, 02-07, 03-01, 03-02, 03-03]

tech_stack:
  added: []
  patterns: [specialist-as-enhanced-builder, domain-knowledge-embedding, css-scroll-driven-default, progressive-enhancement-fallback-chain, brand-voice-enforcement]

key_files:
  created:
    - agents/specialists/3d-specialist.md
    - agents/specialists/animation-specialist.md
    - agents/specialists/content-specialist.md
  modified: []

decisions:
  - "[Specialist line counts]: 3D (464), animation (579), content (484) -- all above 250-line target due to comprehensive domain knowledge with code examples"
  - "[Animation decision tree]: 10-item decision tree routes to CSS/motion/GSAP -- CSS scroll-driven is always option 1 (default path)"
  - "[Content banned list expanded to 8]: Added Welcome, Lorem ipsum, TBD, Coming Soon to section-builder's 4 banned phrases"
  - "[Brand voice swap test]: Content specialist includes 'swap test' -- if a headline works on a competitor site, it is too generic"
  - "[3D FPS monitoring]: Auto-downgrade to static image if FPS below 30 for 2+ consecutive seconds"
  - "[Parallax intensity per archetype]: Three tiers (subtle 0.2-0.3x, medium 0.4-0.5x, strong 0.6-0.8x) mapped to specific archetypes"

metrics:
  duration: "9 min"
  completed: "2026-02-24"
---

# Phase 2 Plan 5: Specialist Builder Agents Summary

Three domain specialist agents (3D, animation, content) defined as enhanced section-builder variants with identical I/O contracts but embedded domain expertise -- R3F/Spline/WebGL with progressive enhancement, GSAP/motion/CSS-scroll-driven with animation decision tree, and brand voice enforcement with content hierarchy patterns.

## What Was Built

### agents/specialists/3d-specialist.md (464 lines)

Enhanced section-builder for Three.js/Spline/WebGL sections. Same stateless I/O contract (spawn prompt + PLAN.md in, code + SUMMARY.md out), same beat parameter table, same anti-slop quick check, same auto-polish pass.

**Domain-specific knowledge:**
- React Three Fiber integration: Canvas setup, @react-three/drei helpers (Environment, ContactShadows, Float, Text3D, useGLTF, MeshTransmissionMaterial, MeshReflectorMaterial, Sparkles, Stars), useFrame/useThree hooks, camera/lighting per archetype mood, disposal/cleanup
- Spline integration: import pattern, DNA-themed loading states, event handling, responsive containers
- WebGL shaders: noise displacement, liquid distortion, holographic effects, custom ShaderMaterial with uniforms
- Progressive enhancement (critical): static image fallback, capability detection (WebGL + deviceMemory + screen size), mobile downgrade rules (polycount /4, disable post-processing), loading strategy (static-first crossfade), bundle splitting (dynamic import), FPS monitoring with auto-downgrade
- 3D performance rules: 50k triangles hero, 20k inline, 2048 textures, Draco compression, dpr cap at 2, max 1 visible canvas, disposal requirements

### agents/specialists/animation-specialist.md (579 lines)

Enhanced section-builder for complex choreographed animation sections. Longest specialist due to three animation libraries (CSS, GSAP, motion/react) plus choreography patterns.

**Domain-specific knowledge:**
- Scroll-driven CSS animations (DEFAULT path): scroll()/view() timeline types, animation-range with precise trigger points, @supports feature detection, IntersectionObserver fallback, scroll-snap integration
- GSAP ScrollTrigger: dynamic import pattern, timeline with labels, scrub vs toggle vs snap configs per beat type, pin patterns for immersive sections, batch animations, gsap.context() cleanup
- motion/react orchestration: variant chains with staggerChildren, AnimatePresence enter/exit, useScroll + useTransform, useInView, LayoutGroup, whileInView
- Choreography patterns: stagger reveals (50-100ms), parallax layers (3 intensity tiers per archetype), text splitting (character/word/line with aria-label), counter animations, morphing shapes
- Animation decision tree: 10-item flowchart routing to the right tool (CSS first, escalate to JS only when needed)
- Animation performance rules: GPU-composited properties only, will-change cap, stagger < 200ms, entrance < 3s, prefers-reduced-motion protocol

### agents/specialists/content-specialist.md (484 lines)

Enhanced section-builder for content-heavy sections. Unique among specialists for its focus on copy quality rather than technical effects.

**Domain-specific knowledge:**
- Brand voice enforcement: 6-item checklist (distinctive headlines, voiced CTAs, vocabulary match, micro-copy voice, consistency, no drift)
- Content hierarchy patterns: F-pattern (scan-heavy), Z-pattern (conversion), inverted pyramid (information), visual weight distribution, 3-second rule
- Micro-copy quality: expanded 8-item banned list, descriptive form labels, helpful error messages, guided empty states, progress-communicating loading states, action-confirming success messages
- Content-code integration: no fabrication, no omission, truncation handling, dynamic content, responsive adaptation, content accessibility
- Testimonial/social proof: structured interface, attribution rules, star rating ARIA, logo grid patterns
- Pricing table patterns: semantic table markup, recommended plan emphasis (not color-only), billing toggle with savings, per-plan voiced CTAs
- FAQ/accordion: native details/summary or ARIA accordion, keyboard navigation

## Decisions Made

| Decision | Rationale | Confidence |
|----------|-----------|------------|
| Specialist line counts exceed 250-line target | All three are 464-579 lines. Domain knowledge with code examples requires space. Beat table, quality rules, and build process are identical copies from section-builder -- this is intentional (self-contained agents, no cross-file references at runtime) | HIGH |
| Animation decision tree defaults to CSS | Per MOTN-01 requirement and research: CSS scroll-driven is the production default, JS only for complex choreography. 10-item tree makes routing explicit | HIGH |
| Content banned list expanded from 4 to 8 | Added "Welcome", "Lorem ipsum", "TBD", "Coming Soon" -- content specialist handles more text-heavy sections where these patterns are more likely to appear | HIGH |
| Brand voice "swap test" | A headline that works on a competitor's site is too generic. This test catches the most common content quality failure (interchangeable copy) | HIGH |
| 3D FPS monitoring auto-downgrade | 2 consecutive seconds below 30fps triggers fallback to static image. Prevents jank on devices that pass initial capability check but cannot sustain performance | HIGH |
| Parallax intensity tiers per archetype | Three tiers (subtle/medium/strong) mapped to archetype personality. Prevents Ethereal sites with aggressive parallax or Editorial sites with no parallax | MEDIUM |

## Deviations from Plan

None -- plan executed exactly as written.

## Next Phase Readiness

All three specialist agents are complete. The build-orchestrator (02-01) can now route to any specialist via `builder_type` in PLAN.md frontmatter:
- `builder_type: section-builder` (default)
- `builder_type: 3d-specialist` (Three.js/Spline/WebGL sections)
- `builder_type: animation-specialist` (complex choreographed animations)
- `builder_type: content-specialist` (content-heavy sections)

Remaining 02-phase plans:
- **02-06** (context rot): Specialist agents include the same anti-context-rot DNA checks as section-builder
- **02-07** (hooks): Specialist agents follow same lifecycle as section-builder (hooks apply equally)

No blockers identified.
