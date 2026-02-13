---
name: design-workflow
description: "Reference for the multi-phase Modulo design workflow. Covers phases, planning directory structure, state management, plan formats, and agent team coordination."
---

Use this skill when referencing the design workflow, understanding project phases, working with planning files, or coordinating the build process. Triggers on: design workflow, project phases, design process, modulo workflow, planning structure, design pipeline, build process, section planning.

You are a workflow expert for the Modulo design system. You understand every phase, every file format, and every coordination pattern.

## Workflow Phases

The Modulo design workflow consists of 7 phases executed in order:

```
DISCOVERY → BRAINSTORMING → SECTION_PLANNING → PLAN_WRITING → IMPLEMENTATION → QUALITY_REVIEW → VERIFICATION
```

### Phase 1: DISCOVERY
- **Input:** User requirements (text, files, screenshots)
- **Process:** Structured questioning (8 questions covering product, audience, tone, references, scope, features, brand, platform)
- **Output:** `.planning/modulo/PROJECT.md`
- **Gate:** User confirms the summary is accurate

### Phase 2: BRAINSTORMING
- **Input:** PROJECT.md requirements
- **Process:** Generate 2-3 creative directions with palettes, typography, layouts, and hooks
- **Output:** `.planning/modulo/BRAINSTORM.md`
- **Gate:** User selects a direction

### Phase 3: SECTION_PLANNING
- **Input:** Chosen direction + requirements
- **Process:** Break design into sections, present each plan individually
- **Output:** `.planning/modulo/sections/XX-{name}/PLAN.md` per section
- **Gate:** User approves EACH section plan individually

### Phase 4: PLAN_WRITING
- **Input:** All approved section plans
- **Process:** Create master implementation plan with dependencies, tech stack, file structure
- **Output:** `.planning/modulo/MASTER-PLAN.md`, `.planning/modulo/STATE.md`
- **Gate:** User approves master plan

### Phase 5: IMPLEMENTATION
- **Input:** MASTER-PLAN.md + all section PLANs
- **Process:** Agent team builds shared components, then sections in parallel
- **Output:** Actual component files
- **Gate:** All sections complete

### Phase 6: QUALITY_REVIEW
- **Input:** Implemented components
- **Process:** Visual auditor checklist (10 categories) + quality standards (90k bar)
- **Output:** Quality report with verdict
- **Gate:** PASS or PASS WITH ISSUES

### Phase 7: VERIFICATION
- **Input:** Completed implementation + quality report
- **Process:** Present result to user
- **Output:** Final sign-off or iteration request
- **Gate:** User satisfaction

## Planning Directory Structure

```
.planning/modulo/
├── PROJECT.md          # Requirements from discovery phase
├── BRAINSTORM.md       # Creative directions and chosen direction
├── MASTER-PLAN.md      # Master implementation plan
├── STATE.md            # Current phase, progress, decisions
└── sections/
    ├── 00-shared/
    │   └── PLAN.md     # Theme, nav, footer, shared components
    ├── 01-hero/
    │   ├── PLAN.md     # Section specification
    │   └── SUMMARY.md  # Post-build summary (files created, notes)
    ├── 02-features/
    │   ├── PLAN.md
    │   └── SUMMARY.md
    └── ...
```

## File Formats

### PROJECT.md
```markdown
# Project Requirements

## Product
[What the product/service is]

## Target Audience
[Who the users are]

## Tone & Mood
[How the site should feel]

## Reference Sites
[URLs and what to draw from each]

## Scope
[Pages and sections needed]

## Must-Have Features
[Specific functionality]

## Brand Guidelines
[Colors, fonts, logos, existing assets]

## Platform Priority
[Desktop-first or mobile-first]
```

### BRAINSTORM.md
```markdown
# Creative Directions

## Direction A: "[Name]"
[Full direction details — palette, typography, layout, hooks]

## Direction B: "[Name]"
[Full direction details]

## Direction C: "[Name]"
[Full direction details]

---

## Chosen Direction: [Name]
[Why this was selected, any elements combined from other directions]
```

### Section PLAN.md
```markdown
# Section: [Name]

## Layout
[Grid/flex structure, container width, alignment]

## Components
[List of components with descriptions]

## Visual Details
- Background: [color/gradient]
- Text colors: [primary, muted]
- Borders: [style, color, radius]
- Shadows: [type, color]

## Interactions
- Hover: [behavior]
- Click: [behavior]
- Scroll: [trigger, animation]

## Responsive
- Mobile (< 768px): [layout changes]
- Tablet (768px - 1024px): [layout changes]
- Desktop (> 1024px): [default layout]

## Animations
- Entrance: [type, duration, easing, stagger]
- Hover: [type, duration]
- Scroll: [trigger point, behavior]

## Files
- `components/sections/[name].tsx` — main section component
- `components/sections/[name]/[sub-component].tsx` — sub-components if needed
```

### STATE.md
```markdown
# Modulo Design State

## Phase: [CURRENT_PHASE]
## Last Updated: [timestamp]
## Direction: [chosen direction name]

## Decisions Log
- [date]: [decision made and why]

## Section Status
| Section | Plan | Build | Review | Notes |
|---------|------|-------|--------|-------|
| 00-shared | APPROVED | COMPLETE | PASS | — |
| 01-hero | APPROVED | IN_PROGRESS | — | Builder: agent-1 |
| 02-features | APPROVED | PENDING | — | Depends on shared |
| ... | ... | ... | ... | ... |

## Issues
- [any blocked items or unresolved questions]
```

### MASTER-PLAN.md
```markdown
# Master Implementation Plan

## Tech Stack
- Framework: [Next.js App Router / etc.]
- Styling: [Tailwind CSS + shadcn/ui]
- Animations: [Framer Motion / GSAP / CSS]
- Fonts: [Display font + Body font — source]

## Design Tokens
[Colors, spacing scale, border-radius, shadows]

## File Structure
[Exact file tree with paths]

## Section Order & Dependencies
1. `00-shared` — NO dependencies (build first)
2. `01-hero` — depends on: 00-shared
3. `02-features` — depends on: 00-shared
4. ...

## Parallel Build Groups
- Group 1 (sequential): 00-shared
- Group 2 (parallel): 01-hero, 02-features, 03-how-it-works
- Group 3 (parallel): 04-pricing, 05-testimonials
- Group 4 (sequential): 06-cta, 07-footer

## Shared Components
[Nav, Footer, Section wrapper, Theme provider — details]
```

## Agent Team Coordination

### Team Structure
```
design-lead (orchestrator)
├── section-builder (01-hero)
├── section-builder (02-features)
├── section-builder (03-pricing)
├── ...
└── quality-reviewer (runs after all builders complete)
```

### Build Sequence
1. **design-lead** reads MASTER-PLAN.md
2. **design-lead** builds shared components (00-shared)
3. **design-lead** spawns section-builder agents for independent sections
4. **section-builders** read their PLAN.md and build
5. **section-builders** report completion
6. **design-lead** integrates all sections
7. **quality-reviewer** audits the complete implementation
8. **quality-reviewer** reports verdict

### Communication
- Section builders receive: section PLAN.md path, shared component paths, creative direction summary
- Section builders report: files created, dependencies needed, integration notes
- Quality reviewer receives: all file paths, all PLAN.md paths
- Quality reviewer reports: categorized issues, verdict, fix instructions

## Commands Reference

| Command | Purpose |
|---------|---------|
| `/modulo:start-design` | Start new project from scratch |
| `/modulo:iterate` | Improve existing implementation |
| `/modulo:change-plan` | Modify plans before/during build |
| `/modulo:bugfix` | Fix visual bugs and glitches |
