# modulo

Premium frontend design plugin for Claude Code. Produces award-caliber websites (Awwwards SOTD 8.0+ baseline) through a pipeline of specialized agents, machine-enforceable design identity, and multi-layer quality gates. **Not a template generator** -- every project gets a unique visual identity enforced through Design DNA, 19 Design Archetypes, Emotional Arc storytelling, and a 35-point Anti-Slop Gate.

45+ skills (v2.0), 8 commands, pipeline agent architecture, cinematic motion choreography, creative tension system, and Awwwards 4-axis scoring. Works with **Next.js**, **Astro**, **React/Vite**, **Tauri**, and **Electron**.

**Version:** 2.0.0-dev

## Installation

Via marketplace:
```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
claude plugin install modulo@raphj-marketplace
```

## What Makes Modulo Different

- **Design DNA** -- Every project gets a unique visual identity. 12 color tokens, display/body/mono fonts, 8-level type scale, 5-level spacing, signature element, and 8+ motion tokens. No two projects look alike.
- **19 Design Archetypes** -- Opinionated personality systems (Brutalist to AI-Native) with machine-enforceable constraints: locked palettes, required fonts, mandatory techniques, forbidden patterns, and 3 tension zones per archetype.
- **35-Point Anti-Slop Gate** -- Weighted quality scoring across 7 categories with named tiers (Pass 25+, Strong 28+, SOTD-Ready 30+, Honoree-Level 33+). Penalties for missing signature elements, forbidden patterns, and generic copy.
- **Emotional Arc** -- 10 beat types (Hook, Tease, Reveal, Build, Peak, Breathe, Tension, Proof, Pivot, Close) with hard parameter constraints on whitespace, element count, and viewport height. Invalid sequences auto-rejected.
- **Creative Tension** -- Controlled rule-breaking with 5 tension types (Scale Violence, Material Collision, Temporal Disruption, Dimensional Break, Interaction Shock). 1-3 per page, archetype-specific techniques.
- **Cinematic Motion** -- DNA-generated motion presets with unified motion system. CSS scroll-driven animations as default, GSAP and motion/react for complex sequences. Beat-aware choreography.
- **Pipeline Architecture** -- Stateless builders with pre-extracted context. CONTEXT.md rewritten per wave. Canary checks detect quality drift. Session boundaries prevent context rot.

## Commands (8)

| Command | Description |
|---------|-------------|
| `/modulo:start-project` | Start a new project: discovery, parallel research, archetype selection, Design DNA generation, content planning |
| `/modulo:lets-discuss` | Per-phase creative deep dive with visual feature proposals and brand voice refinement |
| `/modulo:plan-dev` | Create section plans with wave assignments, re-research, and verification questions |
| `/modulo:execute` | Build sections wave by wave with parallel builders and session management |
| `/modulo:iterate` | Brainstorm-first design improvements with user approval before changes |
| `/modulo:bug-fix` | Diagnostic root cause analysis with proposed solutions |
| `/modulo:status` | Show full project status |
| `/modulo:audit` | Comprehensive site audit (visual, performance, accessibility, content) |

## Workflow

```
start-project -> lets-discuss -> plan-dev -> execute -> iterate (if needed)
                                                     -> audit (optional)
                                                     -> bug-fix (as needed)
```

1. **start-project** -- Discovery questions, parallel research agents, competitive benchmarking, archetype selection, Design DNA generation, and content planning.
2. **lets-discuss** -- Per-phase creative deep dive with visual feature proposals, brand voice refinement, and auto-organized task output.
3. **plan-dev** -- Phase-scoped re-research, context-rot-safe PLAN.md generation with verification questions.
4. **execute** -- Wave-based implementation with parallel builders (max 4 per wave), DNA enforcement, beat compliance, and layout diversity tracking.
5. **iterate** -- Brainstorm-first design changes or bug diagnosis with user approval before applying.

`/modulo:status` is available at any point to check project state.

## Pipeline Agents

### Pipeline Agents

| Agent | Role | Description |
|-------|------|-------------|
| `researcher` | Researcher | Parallel research agent for trends, references, components, animation, and content voice |
| `creative-director` | Creative Director | Active review against DNA and creative vision with APPROVE/FLAG/PUSH authority |
| `section-planner` | Planner | PLAN.md generation with wave assignments, beat allocation, and layout diversity |
| `build-orchestrator` | Orchestrator | Wave-based execution, spawns parallel builders, manages STATE.md and CONTEXT.md |
| `section-builder` | Builder | Stateless section builder -- reads only PLAN.md with all context pre-extracted in spawn prompt |
| `quality-reviewer` | Reviewer | Three-level verification + mandatory anti-slop gate + DNA compliance check |
| `polisher` | Polisher | End-of-build micro-detail polish with strict scope discipline |

### Protocols

| Protocol | Purpose |
|----------|---------|
| `discussion-protocol` | Discussion-before-action rules for all code-modifying commands |
| `context-rot-prevention` | CONTEXT.md lifecycle, canary checks, session boundaries |
| `canary-check` | 5 self-test questions from memory after each wave |
| `agent-memory-system` | 3-layer memory: context file, design system, platform feedback loop |

### Domain Specialists

| Specialist | Domain |
|-----------|--------|
| `3d-specialist` | 3D/WebGL scenes with React Three Fiber |
| `animation-specialist` | Complex animation sequences beyond standard builder capabilities |
| `content-specialist` | Content strategy, brand voice, and copy quality |

## Design DNA System

Every project gets a unique `DESIGN-DNA.md` generated from the chosen archetype:

- **Color System** -- 12 tokens: 8 semantic (bg, surface, text, border, primary, secondary, accent, muted) + 4 expressive (glow, tension, highlight, signature)
- **Typography** -- Display + body + mono fonts with 8-level type scale
- **Spacing** -- 5-level scale (xs through 2xl)
- **Signature Element** -- One unique visual hook per project (machine-parseable format: `name: param=value`)
- **Motion Tokens** -- 8+ tokens as CSS custom properties consumed by GSAP/motion-react
- **Tailwind v4** -- Generates `@theme` CSS directly with `--color-*: initial` to reset defaults

Section builders read DNA before writing any code. The quality reviewer checks every section against it.

## Design Archetypes (19 + Custom)

| Archetype | Personality | Example References |
|-----------|-------------|-------------------|
| Brutalist | Raw, aggressive, intentionally ugly-beautiful | Balenciaga, Bloomberg Businessweek |
| Ethereal | Dreamlike, soft, floating, translucent | Apple Vision Pro, Cosmos |
| Kinetic | Motion-first, dynamic, energetic | Stripe, Lottie |
| Editorial | Magazine-inspired, typography-driven | NYT, Bloomberg |
| Neo-Corporate | Linear/Vercel aesthetic, precision engineering | Linear, Vercel, Raycast |
| Organic | Natural, flowing, hand-crafted feeling | Patagonia, Aesop |
| Retro-Future | Nostalgic + futuristic, CRT + holographic | Teenage Engineering |
| Luxury/Fashion | High-end, editorial, dramatic photography | Gucci, Bottega Veneta |
| Playful/Startup | Bouncy, colorful, approachable | Notion, Figma |
| Data-Dense | Information-rich, dashboard-optimized | Bloomberg Terminal, Grafana |
| Japanese Minimal | Ma (negative space), wabi-sabi, restrained | Muji, Aesop Japan |
| Glassmorphism | Frosted glass, translucent layers, depth | Apple, Windows 11 |
| Neon Noir | Dark + neon, cyberpunk, high contrast | Huly, Cyberpunk 2077 |
| Warm Artisan | Handcrafted, warm tones, natural textures | Mailchimp, Notion |
| Swiss/International | Grid-perfect, Helvetica heritage, systematic | Swisscom, Dieter Rams |
| Vaporwave | Retrowave, pink/purple/cyan, glitch aesthetic | Poolsuite, A E S T H E T I C |
| Neubrutalism | Bold borders, raw backgrounds, offset shadows | Gumroad, Figma Community |
| Dark Academia | Scholarly, muted earth tones, serif typography | Oxford, Penguin Books |
| AI-Native | Machine intelligence made visible, monospace, data viz as decoration | Anthropic, Cursor |

Each archetype locks in palette, fonts, mandatory techniques, forbidden patterns, and 3 tension zones. Builders may break ONE rule via tension override with documented rationale. Custom archetypes can be built using the archetype builder template.

## Anti-Slop Gate

35-point mandatory quality scoring across 7 categories:

| Category | Points | Items |
|----------|--------|-------|
| Colors | /5 | Primary not default, unexpected accent, purposeful gradients, background depth, hand-tuned dark mode |
| Typography | /6 | Distinctive display font, 3+ weights, tuned letter-spacing, varied line-heights, typographic surprise, type scale drama |
| Layout | /5 | Grid broken, spacing varied, 3+ hierarchy levels, intentional negative space, unexpected positioning |
| Depth & Polish | /6 | Layered shadows, subtle borders, glass/blur, varied border-radius, micro-details, texture or grain |
| Motion | /5 | Staggered timing, distinct hovers, scroll-triggered, appropriate easing, directional motion |
| Creative Courage | /5 | Impossible moment, stop-scrolling moment, bold implementation, originality, screenshot-worthy |
| UX Intelligence | /3 | Nav current indicator, interactive feedback <100ms, CTA hierarchy |

**Score 25+ = Pass. 28+ = Strong. 30+ = SOTD-Ready. 33+ = Honoree-Level. Below 25 = AUTOMATIC FAIL.**

Penalties: missing signature element (-3), archetype forbidden pattern (-5), no creative tension (-5), "Submit"/"Learn More" copy (-2 each, max 3), Inter/Roboto as display font (-5).

## Wave System

Sections are assigned to waves based on dependencies:

| Wave | Purpose | Example |
|------|---------|---------|
| 0 | Scaffold and design tokens | Tailwind config, CSS variables, shared utilities (generated from Design DNA) |
| 1 | Shared UI | Navigation, footer, theme provider |
| 2+ | Independent sections | Hero, features, pricing (parallel, max 4 per wave) |
| Higher | Dependent sections | Sections that depend on other sections |

## Skills

Modulo uses a 3-tier skill system. All v2.0 skills follow the 4-layer format: Decision Guidance, Award-Winning Examples, Integration Context, and Anti-Patterns.

| Tier | Loading | Count | Examples |
|------|---------|-------|----------|
| **Core** | Always loaded | ~21 | design-dna, design-archetypes, anti-slop-gate, emotional-arc, cinematic-motion, creative-tension, quality-gate-protocol |
| **Domain** | Per project type | ~22 | nextjs-patterns, astro-patterns, desktop-patterns, three-d-webgl-effects, ecommerce-ui, figma-integration |
| **Utility** | On-demand | 3 | form-builder, seo-meta, i18n-rtl |

See `skills/SKILL-DIRECTORY.md` for the complete skill registry with status, tier, phase, and line counts.

## Planning Artifacts

All state lives under `.planning/modulo/` in the target project:

| File | Purpose |
|------|---------|
| `PROJECT.md` | Discovery output and requirements |
| `DESIGN-DNA.md` | Locked visual identity document |
| `BRAINSTORM.md` | Creative directions and chosen archetype |
| `MASTER-PLAN.md` | Wave map with section dependencies and layout assignments |
| `CONTEXT.md` | Single source of truth -- DNA anchor, build state, arc position, next instructions |
| `STATE.md` | Current execution state (phase, wave, section statuses) |
| `sections/*/PLAN.md` | Per-section task list with pre-extracted builder context |
| `sections/*/SUMMARY.md` | Builder completion report with anti-slop self-check |

## Framework Support

| Framework | Features |
|-----------|----------|
| **Next.js** | App Router + Pages Router, Server Components, Server Actions, React 19 |
| **Astro** | Islands architecture, Content Layer API, ClientRouter, hybrid rendering |
| **React/Vite** | SPA patterns, client-side routing, Vite-specific optimizations |
| **Tauri** | Desktop-aware design, custom titlebars, drag regions, window chrome |
| **Electron** | Desktop-aware design, window chrome, system tray, native menus |

## License

MIT
