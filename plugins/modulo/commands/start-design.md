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

## Phase 3: BRAINSTORM WITH ARCHETYPES

**Goal:** Select a design archetype and generate a creative direction with locked constraints.

Reference the `design-archetypes` skill for all available archetypes.
Reference the `design-brainstorm` skill for methodology.

### Step 1: Present Relevant Archetypes

Based on the project type, present 2-3 relevant archetypes from the `design-archetypes` skill. Use the Archetype Selection Guide to pick the best fits. For each, show:
- Archetype name and personality statement
- Locked color palette preview
- Required fonts
- 2-3 mandatory techniques
- Reference sites

Also offer: "Or describe a custom aesthetic and I'll build a custom archetype."

### Step 2: User Selects Archetype

The user picks one archetype, or requests custom. If custom:
1. Ask for 2-3 reference sites they admire
2. Ask for 4 personality adjectives
3. Ask for 1 thing they absolutely DON'T want
4. Generate a custom archetype using the Custom Archetype Builder template

### Step 3: Generate Creative Direction from Archetype

Using the selected archetype's LOCKED constraints, generate a concrete creative direction:

**Direction: [Archetype Name] — [Project-Specific Variation Name]**
- **Archetype:** [name] (constraints are non-negotiable)
- **Color Palette:** Use the archetype's locked palette, adapted to the project's brand if needed
- **Typography:** Use the archetype's required fonts
- **Layout Approach:** Must include the archetype's mandatory techniques
- **Signature Element:** The archetype's signature element, customized for this project
- **Unique Hooks:** 2-3 project-specific visual elements on top of the archetype
- **Forbidden Patterns:** The archetype's forbidden list (non-negotiable)

Present to user for approval. They can adjust specific values but CANNOT override the archetype's core constraints.

Save the chosen direction to `.planning/modulo/BRAINSTORM.md`.

---

## Phase 3.5: DESIGN DNA GENERATION

**Goal:** Generate the project's unique Design DNA document from the chosen archetype.

Reference the `design-dna` skill for the full DNA format.

### Generate DESIGN-DNA.md

Using the chosen archetype + creative direction, generate `.planning/modulo/DESIGN-DNA.md` with ALL required sections:

1. **Color System** — Populate from archetype palette + project-specific adjustments
2. **Typography System** — Populate from archetype fonts with full type scale
3. **Spacing System** — Generate project-specific spacing scale
4. **Border Radius System** — From archetype rules
5. **Shadow & Depth System** — 5 shadow levels customized to the palette
6. **Signature Element** — Archetype's signature, customized for this project, with implementation notes
7. **Motion Language** — Animation defaults, easing curves, enter directions
8. **Texture & Effects** — Which effects are active (grain, glow, glass, etc.)
9. **Layout Patterns Required** — Minimum 4 distinct patterns, informed by archetype
10. **Diversity Rule** — No two adjacent sections may share the same layout pattern

### User Review

Present the Design DNA summary to the user. They can adjust specific values (e.g., swap a hex color, adjust spacing) but cannot:
- Remove required archetype techniques
- Add forbidden patterns
- Change the display font to Inter/Roboto/system-ui
- Remove the signature element

### Validation

Run the Design DNA Validation Rules from the `design-dna` skill before finalizing:
- All 12 color tokens defined?
- Display font is distinctive?
- Signature element is specific and implementable?
- Motion language has concrete values?

Save to `.planning/modulo/DESIGN-DNA.md`.

**This document is now the single source of truth. All section builders MUST reference it.**

---

## Initialize STATE.md

After Phase 3.5 completes, create `.planning/modulo/STATE.md`:

```markdown
# Modulo Design State

## Current Phase
phase: DNA_COMPLETE
last_updated: [ISO date]

## Project
archetype: [archetype name]
direction: [chosen direction name]
platform: [desktop-first or mobile-first]
signature_element: [brief description]

## Completed Phases
- [x] Discovery — PROJECT.md written
- [x] Research — SUMMARY.md synthesized
- [x] Brainstorm — Archetype selected: [name]
- [x] Design DNA — DESIGN-DNA.md generated
- [ ] Section Planning
- [ ] Execution
- [ ] Verification
- [ ] Visual Audit

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
- .planning/modulo/DESIGN-DNA.md — Unique visual identity (archetype: [name])
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
