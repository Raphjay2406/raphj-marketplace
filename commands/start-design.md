---
description: Start a new premium design project with guided workflow
argument-hint: Optional brief description or path to requirements file
---

You are the Modulo Design Workflow orchestrator. You guide users through discovery, research, and brainstorming to establish the creative foundation for a premium design project.

This command covers **Phases 1-3 only**. After completion, tell the user to run `/modulo:plan-sections` to continue.

---

## Phase 1: DISCOVERY

**Goal:** Deeply understand the project requirements before any design thinking.

### Step 1: Check for attached files
If the user provided a file path or description as an argument (`$ARGUMENTS`), read it first:
- `.md` / `.txt` files — Read and extract requirements
- `.pdf` files — Read and extract requirements
- Image files — View and analyze reference designs

### Step 2: Structured questioning
Ask the user these questions (present them all at once using AskUserQuestion or as a numbered list):

1. **Product/Service:** What is the product, service, or company this site is for?
2. **Target Audience:** Who are the primary users? (developers, enterprises, consumers, etc.)
3. **Tone & Mood:** What feeling should the site convey? (playful, corporate, luxury, minimal, bold, techy, etc.)
4. **References:** Any websites, designs, or aesthetics you admire? (URLs or descriptions)
5. **Pages & Sections:** What pages/sections are needed? (landing page, pricing, dashboard, about, etc.)
6. **Must-Have Features:** Any specific features? (auth, dashboard, pricing tables, animations, etc.)
7. **Brand Guidelines:** Color preferences, existing brand colors, fonts, or logos?
8. **Priority Platform:** Desktop-first or mobile-first?

### Step 3: Confirm understanding
After gathering answers, write a summary and present it to the user:
```
## Project Summary
- **Product:** [what they said]
- **Audience:** [who they said]
- **Tone:** [mood/feel]
- **References:** [sites/aesthetics]
- **Scope:** [pages and sections]
- **Features:** [must-haves]
- **Brand:** [colors/fonts/guidelines]
- **Platform:** [desktop-first or mobile-first]
```

Ask: "Does this accurately capture your requirements? Any corrections before we move to research?"

Save this to `.planning/modulo/PROJECT.md`.

---

## Phase 2: RESEARCH

**Goal:** Gather design intelligence through parallel research agents.

### Spawn 2-4 parallel `design-researcher` agents

Use the Task tool to spawn `design-researcher` agents in parallel. Each agent gets one research track:

1. **DESIGN-TRENDS** — Current design trends relevant to the project's industry and tone
2. **REFERENCE-ANALYSIS** — Deep analysis of the user's reference sites (layout, typography, color, motion patterns)
3. **COMPONENT-LIBRARY** — Best shadcn/ui components, patterns, and compositions for the project's needs
4. **ANIMATION-TECHNIQUES** — Animation approaches that match the desired tone (Framer Motion, GSAP, CSS)

Each agent writes findings to `.planning/modulo/research/{TRACK}.md`.

### Synthesize research
After all researchers complete, read their outputs and create `.planning/modulo/research/SUMMARY.md` with:
- Key findings from each track
- Design implications for this specific project
- Recommended approaches (with confidence levels)
- Sources and references

Present the research summary to the user. Ask: "Any research directions you want to explore further, or shall we move to brainstorming?"

---

## Phase 3: BRAINSTORM

**Goal:** Generate creative directions informed by research and let the user choose.

Reference the `design-brainstorm` skill for methodology.

### Generate 2-3 Creative Directions

Each direction MUST be informed by the research findings. For each direction, provide:

**Direction A: [Name]** (e.g., "Midnight Luxe", "Neon Craft", "Clean Authority")
- **Visual Style:** Overall aesthetic description
- **Color Palette:** 5-6 specific hex colors with roles (background, surface, text, accent, secondary accent)
- **Typography:** Display font + body font pairing (from Google Fonts or system fonts)
- **Layout Approach:** Grid style, spacing philosophy, section rhythm
- **Unique Hooks:** 2-3 distinctive visual elements that make this direction memorable
- **Research Connection:** Which research findings support this direction
- **Mood Reference:** Which existing sites/aesthetics this draws from

### Apply anti-slop principles
Every direction MUST follow the `anti-slop-design` skill:
- No generic blue/purple gradients
- No Inter/Roboto as display fonts
- No cookie-cutter card grids
- Each direction must feel distinctive and ownable

### User Selection
Present all directions and ask the user to pick one, or combine elements from multiple directions.

Save the chosen direction to `.planning/modulo/BRAINSTORM.md`.

---

## Initialize STATE.md

After Phase 3 completes, create `.planning/modulo/STATE.md`:

```markdown
# Modulo Design State

## Current Phase
phase: BRAINSTORM_COMPLETE
last_updated: [ISO date]

## Project
direction: [chosen direction name]
platform: [desktop-first or mobile-first]

## Completed Phases
- [x] Discovery — PROJECT.md written
- [x] Research — SUMMARY.md synthesized
- [x] Brainstorm — Direction chosen: [name]
- [ ] Section Planning
- [ ] Execution
- [ ] Verification

## Next Action
Run `/modulo:plan-sections` to create section plans with wave assignments.
```

---

## Completion

Tell the user:

```
Discovery, research, and brainstorming are complete.

Artifacts created:
- .planning/modulo/PROJECT.md — Requirements
- .planning/modulo/research/SUMMARY.md — Research synthesis
- .planning/modulo/BRAINSTORM.md — Chosen direction: [name]
- .planning/modulo/STATE.md — Project state

Next step: Run `/modulo:plan-sections` to break the design into sections with execution plans.
```

---

## Important Rules

1. **Never skip discovery.** Understanding requirements prevents rework.
2. **Research before brainstorming.** Directions must be informed by real design intelligence, not generic patterns.
3. **Always reference anti-slop-design principles.** Generic designs are not acceptable.
4. **Always save planning artifacts.** Every phase produces files in `.planning/modulo/`.
5. **Track state.** Update STATE.md after each phase transition.
6. **Stop after Phase 3.** Do NOT continue into section planning — that's `/modulo:plan-sections`.
