# modulo

Premium design workflow system for Claude Code. 25 skills, 4 slash commands, and 3 agents for creating 90k-quality websites with guided multi-phase execution.

## Installation

Via marketplace:
```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
claude plugin install modulo@raphj-marketplace
```

## Commands

| Command | Description |
|---------|-------------|
| `/modulo:start-design` | Start a new premium design project with guided 7-phase workflow |
| `/modulo:iterate` | Iterate on an existing design — improve sections or overall quality |
| `/modulo:change-plan` | Modify the design plan — add, remove, or change sections |
| `/modulo:bugfix` | Fix visual bugs, glitches, or layout issues |

## Agents

| Agent | Role | Description |
|-------|------|-------------|
| `design-lead` | Orchestrator | Coordinates section builders, manages dependencies, ensures consistency |
| `section-builder` | Builder | Implements a single section from its PLAN.md specification |
| `quality-reviewer` | Auditor | Reviews implementation against 90k quality standards |

## Design Workflow

The `/modulo:start-design` command guides you through 7 phases:

1. **Discovery** — Structured questioning to understand requirements
2. **Brainstorming** — 2-3 creative directions with palettes, typography, and hooks
3. **Section Planning** — Individual section plans with user approval on each
4. **Implementation Planning** — Master plan with dependencies and file structure
5. **Implementation** — Agent team builds shared components then sections in parallel
6. **Quality Review** — Visual auditor checklist + 90k quality bar verification
7. **User Verification** — Final sign-off or iteration

## Skills (25)

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
| `quality-standards` | 90k quality bar definition, quality tiers, premium indicators |
| `design-workflow` | Multi-phase workflow reference, planning structure, agent coordination |

## License

MIT
