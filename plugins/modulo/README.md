# modulo

Premium design workflow system for Claude Code. 26 skills, 7 slash commands, and 4 agents for creating 90k-quality websites with wave-based parallel execution and goal-backward verification.

## Installation

Via marketplace:
```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
claude plugin install modulo@raphj-marketplace
```

## Commands

| Command | Description |
|---------|-------------|
| `/modulo:start-design` | Start a new project: discovery, parallel research, brainstorming |
| `/modulo:plan-sections` | Create section plans with wave assignments and GSD execution format |
| `/modulo:execute` | Execute the design wave by wave with parallel section builders |
| `/modulo:verify` | Three-level goal-backward verification + 10-category visual audit |
| `/modulo:iterate` | Iterate on existing design using gap-fix plans or manual feedback |
| `/modulo:change-plan` | Modify plans with automatic wave recalculation |
| `/modulo:bugfix` | Fix visual bugs with scientific hypothesis-test-fix cycle |

## Workflow

```
start-design → plan-sections → execute → verify → iterate (if needed)
```

1. **Start Design** — Discovery questioning, parallel research (4 tracks), brainstorm 2-3 directions
2. **Plan Sections** — Break into sections with wave assignments, GSD frontmatter, user approval per section
3. **Execute** — Wave-based parallel implementation (max 4 builders per wave), checkpoint support
4. **Verify** — Three-level verification (Existence → Substantive → Wired) + visual audit
5. **Iterate** — Targeted fixes from verification gaps or user feedback

## Agents

| Agent | Role | Description |
|-------|------|-------------|
| `design-lead` | Orchestrator | Wave-based execution, spawns parallel builders, manages STATE.md |
| `section-builder` | Builder | Executes PLAN.md tasks sequentially, pauses at checkpoints, writes SUMMARY.md |
| `quality-reviewer` | Verifier | Three-level goal-backward verification, creates GAP-FIX.md plans |
| `design-researcher` | Researcher | Parallel research agent for one track (trends, references, components, animations) |

## Wave System

Sections are assigned to waves based on dependencies:

| Wave | Purpose | Example |
|------|---------|---------|
| 0 | Scaffold & tokens | Tailwind config, CSS variables, shared utilities |
| 1 | Shared UI | Navigation, footer, theme provider |
| 2+ | Independent sections | Hero, features, pricing (parallel, max 4 per wave) |
| Higher | Dependent sections | Sections that depend on other sections |

## Skills (26)

### Core Framework
| Skill | Description |
|-------|-------------|
| `v0-ahh` | Core frontend design and UI implementation guidance |
| `shadcn-components` | All shadcn/ui components, variants, and composition patterns |
| `tailwind-patterns` | Advanced Tailwind CSS patterns, animations, gradients, glass effects |
| `nextjs-app-router` | App Router conventions, layouts, server/client components, metadata |

### UI Patterns
| Skill | Description |
|-------|-------------|
| `form-builder` | react-hook-form + zod + shadcn forms with all field types |
| `responsive-layout` | Layout systems, grid patterns, bento grids, container queries |
| `data-table` | TanStack Table + shadcn with sorting, filtering, pagination |
| `auth-ui` | Login, signup, OTP, forgot password, social auth flows |
| `dashboard-patterns` | Dashboard shells, stat cards, charts, command palette |
| `landing-page` | Hero sections, pricing tables, testimonials, CTAs, footers |

### Animation
| Skill | Description |
|-------|-------------|
| `framer-motion` | Variants, stagger, scroll animations, layout animations, gestures |
| `gsap-animations` | GSAP + ScrollTrigger, timelines, text animations, horizontal scroll |
| `css-animations` | Pure CSS keyframes, scroll-driven animations, micro-interactions |

### Design Philosophy
| Skill | Description |
|-------|-------------|
| `anti-slop-design` | Eliminate generic AI aesthetics, create distinctive premium design |
| `premium-dark-ui` | Surface hierarchy, glass morphism, glow effects, depth systems |
| `premium-typography` | Distinctive font pairings, type scale, gradient text, fluid type |
| `creative-sections` | Bento grids, 3D perspective heroes, interactive showcases |
| `glow-neon-effects` | Neon glow, luminous borders, spotlight effects, ambient lighting |
| `geometry-shapes` | SVG/CSS shapes, clip-path, blobs, section dividers, 3D transforms |

### Mobile
| Skill | Description |
|-------|-------------|
| `mobile-patterns` | Bottom sheets, touch targets, safe areas, swipeable cards |
| `mobile-navigation` | Tab bars, drawer menus, segmented controls, action sheets |

### Quality & Workflow
| Skill | Description |
|-------|-------------|
| `visual-auditor` | Catches spacing, alignment, color, responsive, and accessibility bugs |
| `design-brainstorm` | Mood boards, creative directions, color palettes, typography pairings |
| `quality-standards` | 90k quality bar, quality tiers, three-level verification, gap closure |
| `design-workflow` | Command flow, wave system, STATE.md format, agent coordination |
| `plan-format` | PLAN.md format reference: frontmatter, task types, SUMMARY.md format |

## License

MIT
