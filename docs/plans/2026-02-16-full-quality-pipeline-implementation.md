# Full Quality Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul Modulo's planning-to-execution pipeline across 10 files to produce award-winning frontend output by eliminating AI agent limitations (visual blindness, vague specs, context rot, autonomous changes, weak copy, missing wow factor).

**Architecture:** This is a markdown-only Claude Code plugin. Every change is to `.md` files (commands, agents, skills) or `plugin.json`. No application code, no tests, no build system. Changes cascade: the discussion-protocol agent is referenced by commands; the hyper-specific PLAN.md format is produced by plan-sections and consumed by section-builder; the content plan flows from start-design through to verify.

**Tech Stack:** Markdown files, YAML frontmatter, JSON (plugin.json)

---

## Task 1: Create Discussion-First Protocol Agent

**Priority:** Highest (most impactful for user trust)

**Files:**
- Create: `agents/discussion-protocol.md`

**Step 1: Create the discussion protocol agent file**

Write `agents/discussion-protocol.md` with the following content:

```markdown
---
name: discussion-protocol
description: Universal discussion-before-action protocol. ALL agents and commands that modify code MUST follow this protocol. No autonomous changes.
---

## Discussion-Before-Action Protocol

**This protocol is MANDATORY. No exceptions. No autonomous changes.**

Every agent or command that modifies code in the target project MUST follow these steps before making ANY change:

### Step 1: Present the Plan

Before modifying ANY file, state:

1. **WHAT** you plan to change
   - Specific files (exact paths)
   - Specific elements within those files
   - Scope: how many lines/components affected

2. **WHY** you're making this change
   - Reference the gap, bug, user request, or plan that motivates it
   - If from GAP-FIX.md, cite the specific gap

3. **HOW** you'll implement it
   - Exact approach (what CSS/JSX/Tailwind changes)
   - Exact values (colors, spacing, classes)
   - Diff preview when possible:
     ```
     File: src/components/sections/hero.tsx
     Line 24: Change `gap-4` → `gap-6 md:gap-8`
     Line 31: Change `text-gray-500` → `text-[var(--color-text-secondary)]`
     Reason: DNA spacing scale compliance
     ```

4. **Present as a numbered plan** — not prose, not vague descriptions

### Step 2: Wait for Approval

- Present the plan to the user via checkpoint
- Wait for explicit approval: "go ahead", "approved", "yes", etc.
- If user requests modifications to the plan → revise and re-present
- If user denies → ask what they'd prefer instead
- **NEVER proceed without explicit approval**

### Step 3: Execute

- Apply exactly what was approved — no additional changes
- No "while I'm here" improvements
- No refactoring adjacent code
- Stick to the approved scope

### Step 4: Show Results

- After changes are applied, show what was done:
  - Files modified with brief summary
  - If browser tools available: take before/after screenshots
  - If no browser tools: describe the change and ask user to preview

### Emergency Override

The user can grant temporary autonomy:
- "Auto-approve changes under 5 lines" — small changes proceed without checkpoint
- "Auto-approve this wave" — all section builds in the current wave proceed
- "Auto-approve this session" — all changes this session proceed (rare, user must explicitly say this)

**Default is ALWAYS discussion-first.** Override must be explicitly granted per scope.

### Where This Protocol Applies

| Command/Agent | Applies? | Notes |
|--------------|----------|-------|
| `/modulo:execute` | YES | Present wave summary before spawning builders |
| `/modulo:iterate` | YES | Show exact diff preview before any change |
| `/modulo:bugfix` | YES | Show bug diagnosis + fix plan before applying |
| `/modulo:change-plan` | YES | Show plan diff before saving |
| `section-builder` | Partial | Auto tasks proceed per plan, but deviations require discussion |
| `design-lead` | YES | Present wave plan before spawning |
| `/modulo:start-design` | NO | Discovery/research is exploratory, not code-modifying |
| `/modulo:plan-sections` | Partial | Each section plan already requires user approval |
| `/modulo:verify` | NO | Verification is read-only |
```

**Step 2: Commit**

```bash
git add agents/discussion-protocol.md
git commit -m "feat: add discussion-first protocol agent for mandatory user approval before code changes"
```

---

## Task 2: Add Discussion Protocol References to Execute, Iterate, Bugfix, Change-Plan

**Priority:** Highest (completes Section 4)

**Files:**
- Modify: `commands/execute.md`
- Modify: `commands/iterate.md`
- Modify: `commands/bugfix.md`
- Modify: `commands/change-plan.md`

**Step 1: Add discussion protocol to execute.md**

Insert after the `## Prerequisites` section (after line 18), before `## Session Resumption`:

```markdown
## MANDATORY: Discussion-First Protocol

Before modifying ANY file in the target project, you MUST follow the Discussion-Before-Action protocol defined in `agents/discussion-protocol.md`. This means:

- **Before spawning any wave:** Present a summary of all sections in the wave (name, beat type, key visual element, files to create) and wait for user approval.
- **After each section completes:** Present the section's SUMMARY.md and screenshots (if browser tools available) before marking it complete.
- **Before advancing to next wave:** Confirm with user that the current wave output is acceptable.
- **No autonomous wave advancement.** Every wave transition requires user awareness.
```

Also update Step 2 (Execute Current Wave) to include the pre-wave discussion. After "3. **Update STATE.md** — mark current wave sections as `IN_PROGRESS`", add:

```markdown
4. **Present Wave Plan to User:**
   ```
   ## Wave [N] — Ready to Build

   | Section | Beat | Key Visual | Files |
   |---------|------|-----------|-------|
   | [name] | [beat] | [1-line description] | [file paths] |

   Proceed with Wave [N]?
   ```
   Wait for user approval before spawning builders.
```

**Step 2: Add discussion protocol to iterate.md**

Insert after line 6 (after the role description), before `## Process`:

```markdown
## MANDATORY: Discussion-First Protocol

Before modifying ANY file, you MUST follow the Discussion-Before-Action protocol defined in `agents/discussion-protocol.md`. This means:

- **Before every change:** Show the exact diff preview (file, line, old value -> new value, reason)
- **Wait for approval** before applying any change
- **After applying:** Show before/after screenshots (if browser tools available) or describe the change
- **No autonomous fixes.** Even if a fix seems obvious, present it first.
```

Also update Step 4 (Execute Fixes) to wrap each change in a discussion checkpoint. Replace the current Step 4 content with:

```markdown
### Step 4: Present Fix Plan & Execute

For each affected section:
1. **Present the exact changes** following the discussion protocol:
   ```
   ## Iteration Plan: [Section Name]

   Change 1:
   - File: [path]
   - Line [N]: `[old code]` → `[new code]`
   - Reason: [why]

   Change 2:
   - File: [path]
   - Line [N]: `[old code]` → `[new code]`
   - Reason: [why]

   Apply these [N] changes?
   ```
2. Wait for user approval
3. Apply approved changes
4. Show results (screenshots if available, or description)
5. Atomic commit: `refactor(section-XX): description of improvement`
```

**Step 3: Add discussion protocol to bugfix.md**

Insert after line 6 (after the role description), before `## Process`:

```markdown
## MANDATORY: Discussion-First Protocol

Before modifying ANY file, you MUST follow the Discussion-Before-Action protocol defined in `agents/discussion-protocol.md`. This means:

- **After diagnosis:** Present the bug, root cause, and fix plan with exact diff preview
- **Include risk assessment:** Which adjacent sections might be affected
- **Wait for approval** before applying any fix
- **After fixing:** Show before/after screenshots (if available) and verify no regression
- **No autonomous fixes.** Present the fix plan even for "obvious" bugs.
```

Also update Step 5 (Create Bugfix Plan) to include the discussion checkpoint. After the bugfix plan YAML, add:

```markdown
**Present the bugfix plan to the user:**
```
## Bugfix Plan

**Bug:** [description]
**Root Cause:** [specific cause in specific file:line]

**Fix:**
- File: [path]
- Line [N]: `[old code]` → `[new code]`
- Reason: [why this fixes the root cause]

**Risk:** [adjacent sections that might be affected, or "None"]

Apply this fix?
```

Wait for user approval before proceeding to Step 6.
```

**Step 4: Add discussion protocol to change-plan.md**

Insert after line 6 (after the role description), before `## Process`:

```markdown
## MANDATORY: Discussion-First Protocol

Before saving ANY plan changes, you MUST follow the Discussion-Before-Action protocol defined in `agents/discussion-protocol.md`. The existing Step 5 (Show Diff & Wave Impact) already does this, but is now reinforced as mandatory.
```

**Step 5: Commit**

```bash
git add commands/execute.md commands/iterate.md commands/bugfix.md commands/change-plan.md
git commit -m "feat: add mandatory discussion-first protocol to execute, iterate, bugfix, change-plan commands"
```

---

## Task 3: Rewrite plan-sections.md with Hyper-Specific PLAN.md Format

**Priority:** High (most impactful for build quality)

**Files:**
- Modify: `commands/plan-sections.md`

**Step 1: Update Step 3 (Create Section PLAN.md Files)**

Replace the current PLAN.md format template (lines 87-156) with the new hyper-specific format. The new format replaces `<context>` with `<visual-specification>` and `<component-structure>`, and adds `<wow-moment>` and `<creative-tension>` blocks.

The new PLAN.md body structure should be:

```markdown
<objective>
Build the [section name] section following the [archetype] creative direction.
This section adapts the [PATTERN] from [REFERENCE SITE] (see REFERENCES.md).
</objective>

<visual-specification>
## Reference Basis
Pattern source: [reference site and pattern name] (see screenshots/[file].png)
Adaptation: [how we adapt the reference pattern to our DNA]

## ASCII Layout Diagram (Desktop 1440px)
[Exact ASCII art showing element positions, sizes, relationships]

## Exact Tailwind Classes Per Element
| Element | Classes |
|---------|---------|
| Section container | [exact classes using DNA tokens] |
| [element name] | [exact classes] |
| ... | ... |

## Responsive Adaptations
### Mobile (375px)
[ASCII diagram + class overrides]

### Tablet (768px)
[ASCII diagram + class overrides]

## Exact Copy (from CONTENT.md)
- Overline: "[exact text]"
- Headline: "[exact text]"
- Body: "[exact text]"
- Primary CTA: "[exact text]"
- Secondary CTA: "[exact text]"
- Friction reducer: "[exact text]"

## Exact Animation Sequence
1. [element]: [animation] — duration [Xms], ease [curve], delay [Xms]
2. [element]: [animation] — duration [Xms], ease [curve], delay [Xms]
...

## Background Treatment
[Exact specification: gradient orbs, grid, grain, colors, positions, blur values]
</visual-specification>

<component-structure>
## JSX Blueprint
[Pseudo-JSX showing the exact component tree]

## Props Interface
[TypeScript interface]

## Imports Required
[Exact imports: shared components, motion presets, utilities]
</component-structure>

<wow-moment>
## Pattern: [name from wow-moments skill]
## Beat: [beat type]
## Integration Point: [where in component tree]

## Full Implementation Code
[Complete TSX code adapted with DNA tokens — NOT a reference, the ACTUAL code]

## Reduced Motion Fallback
[Fallback implementation]

## Verification Criteria
- [ ] [specific check]
- [ ] [specific check]
</wow-moment>

<creative-tension>
## Type: [tension type from creative-tension skill]
## Section: [which section]

## Exact Specification
[Exact sizes, classes, approach — specific enough to build without interpretation]

## Verification Criteria
- [ ] [specific check]
</creative-tension>

<tasks>
- [auto] Set up component file with imports and props interface from <component-structure>
- [auto] Build layout structure matching <visual-specification> ASCII diagram
- [auto] Apply exact Tailwind classes from specification table
- [auto] Implement responsive adaptations for 375px and 768px
- [auto] Add background treatment per specification
- [auto] Implement animation sequence with exact timing values
- [auto] Integrate wow moment code from <wow-moment> block
- [auto] Implement creative tension from <creative-tension> block
- [auto] Add all pre-approved copy text from <visual-specification>
- [checkpoint:human-verify] Review section screenshot and interaction quality
</tasks>

<verification>
- Layout matches ASCII diagram at 1440px
- Responsive layout matches mobile/tablet diagrams
- All Tailwind classes match the specification table exactly
- All animations match the specified timing/easing/delay
- Copy text matches the pre-approved text exactly
- Wow moment is implemented and functional
- Creative tension is bold enough to surprise
- No horizontal overflow at any viewport (320-2560px)
- Touch targets 44x44px minimum on mobile
- All DNA tokens used — no raw hex, no default Tailwind
</verification>

<success_criteria>
- Section matches the visual-specification blueprint
- Builder used ONLY DNA tokens (colors, fonts, spacing, shadows, radii)
- Responsive at all target breakpoints
- All interactive elements have hover/focus/active states
- Animations respect prefers-reduced-motion
- Code is complete — no TODOs or placeholders
- All copy matches CONTENT.md exactly
</success_criteria>
```

**Step 2: Add wow moment minimum rules**

After Step 2.5 (Assign Emotional Beats and Creative Elements), add:

```markdown
#### Wow Moment Minimums (Per Page)
Every page MUST have:
- At least 1 cursor-responsive wow moment (interactive engagement)
- At least 1 scroll-responsive wow moment (scroll engagement)
- At least 1 ambient element (atmosphere/mood)
- Total: 3-5 wow moments per page (more than 5 = circus)
- Concentrated at HOOK, PEAK, and CLOSE beats

When assigning wow moments, embed the FULL TSX implementation code (adapted with DNA tokens) in the PLAN.md, not just a reference to the skill. The builder should be able to copy-paste the code.
```

**Step 3: Add reference basis instruction**

At the top of Step 3, add:

```markdown
Before writing each PLAN.md, read `.planning/modulo/REFERENCES.md` and `.planning/modulo/CONTENT.md`. Each section plan MUST:
- Reference which pattern from which reference site it adapts (in `<visual-specification>`)
- Use pre-approved copy from CONTENT.md (in the "Exact Copy" subsection)
- Compute exact Tailwind classes from DESIGN-DNA.md tokens (not generic Tailwind defaults)
```

**Step 4: Commit**

```bash
git add commands/plan-sections.md
git commit -m "feat: hyper-specific PLAN.md format with visual-specification, component-structure, wow-moment, creative-tension blocks"
```

---

## Task 4: Add Content Planning Phase + Visual Reference System to start-design.md

**Priority:** High (fixes weak copy + no real references)

**Files:**
- Modify: `commands/start-design.md`

**Step 1: Enhance Phase 2 (Research) with Visual Reference Capture**

After the "### Spawn 2-4 parallel `design-researcher` agents" section (after line 66), add a new subsection:

```markdown
### Visual Reference Capture (NEW)

Before synthesizing research, capture visual references from the user's reference URLs (from discovery Step 2, question 4).

**Tool priority order:**
1. Playwright MCP (`browser_navigate`, `browser_take_screenshot`, `browser_resize`) — preferred
2. Chrome DevTools MCP (`navigate_page`, `take_screenshot`, `resize_page`) — fallback
3. Claude in Chrome (`navigate`, `upload_image`, `resize_window`) — fallback
4. WebFetch + manual screenshots — last resort

**For each reference URL (max 5 sites):**
1. Navigate to the URL, wait for page load
2. Resize to 1440px width
3. Take full-page screenshot → `.planning/modulo/research/screenshots/{site}-desktop-full.png`
4. Take above-fold screenshot → `.planning/modulo/research/screenshots/{site}-desktop-fold.png`
5. Resize to 375px width
6. Take above-fold screenshot → `.planning/modulo/research/screenshots/{site}-mobile-fold.png`
7. Scroll to ~50% and screenshot → `.planning/modulo/research/screenshots/{site}-desktop-mid.png`
8. Scroll to bottom and screenshot → `.planning/modulo/research/screenshots/{site}-desktop-footer.png`

**That's 5 screenshots per site, covering:** full structure, first impression, mobile, mid-page quality, and footer/CTA.

**For each reference site, analyze the screenshots and document in `.planning/modulo/research/REFERENCES.md`:**

```markdown
## Reference Analysis: [Site Name]
URL: [url]
Screenshots: [list of screenshot file paths]

### 1. Color Analysis
- Background: [exact observed color]
- Text primary: [color + warmth]
- Text secondary: [color]
- Accent 1: [color + usage]
- Accent 2: [color + usage]
- Gradient usage: [description]
- Color temperature: [warm/cool/neutral]
- Unique color moment: [what stands out]

### 2. Typography Analysis
- Display font: [observed font]
- Body font: [observed font]
- Headline sizes: [approximate]
- Headline tracking: [approximate]
- Weight variety: [count + weights observed]
- Typographic surprise: [what stands out]

### 3. Layout Analysis
- Hero pattern: [description]
- Grid approach: [description]
- Spacing character: [generous/tight/varied]
- Container width: [approximate]
- Grid-breaking moment: [what breaks the grid]
- Layout variety score: [count of distinct patterns]

### 4. Motion/Animation Analysis
- Entrance animations: [description]
- Scroll behavior: [description]
- Hover effects: [description]
- Transition style: [description]
- Motion intensity: [low/medium/high]
- Wow moment: [what's impressive]

### 5. Depth & Polish Analysis
- Shadow approach: [description]
- Glass/blur: [where and how]
- Border style: [description]
- Texture: [grain/dots/grid]
- Micro-details: [list]

### 6. Content/Copy Quality
- Hero headline: [text or paraphrase]
- CTA text: [text]
- Tone: [description]
- Friction reducers: [list]

### 7. Overall Assessment
- Estimated Awwwards: Design [X]/10, Usability [X]/10, Creativity [X]/10, Content [X]/10
- What makes it special: [1-2 sentences]
- Patterns to adopt: [list]
- Patterns NOT to copy: [list — things that are their brand]
```

**Fallback (no browser tools):**
- Use `WebFetch` to grab page content and analyze HTML/CSS structure
- Ask user: "I can't capture screenshots. Please provide reference screenshots if possible."
- Document that visual analysis was limited in REFERENCES.md

Copy the REFERENCES.md to `.planning/modulo/REFERENCES.md` after synthesis.
```

**Step 2: Add Phase 3.75 (Content Planning)**

After Phase 3.5 (Design DNA Generation) section, before "## Initialize STATE.md", add:

```markdown
---

## Phase 3.75: CONTENT PLANNING (NEW)

**Goal:** Write all page copy before section planning. User approves every piece of text.

### Step 1: Read Context

Read:
- `.planning/modulo/PROJECT.md` — what the product/service is
- `.planning/modulo/BRAINSTORM.md` — archetype and creative direction
- `.planning/modulo/DESIGN-DNA.md` — personality and tone
- Reference the `micro-copy` skill for button/CTA rules
- Reference the `conversion-patterns` skill for persuasion structure

### Step 2: Generate Content Plan

Create `.planning/modulo/CONTENT.md`:

```markdown
# Content Plan: [Project Name]

## Voice & Tone
**Archetype:** [name]
**Voice:** [2-3 sentences describing the voice personality]
**Forbidden phrases:** ["Learn More", "Submit", "Click Here", "Solutions", "Leverage", "Empower", "Unlock", "Seamless"]

## Hero Section
- **Status badge:** "[text]"
- **Headline:** "[text, < 8 words, emotional response]"
- **Subheadline:** "[1-2 sentences, max 30 words]"
- **Primary CTA:** "[outcome-driven verb + benefit]"
- **Secondary CTA:** "[lower commitment action]"
- **Friction reducer:** "[e.g., No credit card · 2-minute setup]"

## Section: [name] ([beat type])
- **Overline:** "[text]"
- **Headline:** "[text]"
- **Body:** "[text]"
- **Element-specific text:**
  - [Card/feature 1]: title "[text]", description "[text]"
  - [Card/feature 2]: title "[text]", description "[text]"
  - ...
- **CTA (if any):** "[text]"

[Repeat for every planned section]

## Testimonials
- "[quote]" — [Full Name], [Title] at [Company]
- "[quote]" — [Full Name], [Title] at [Company]

## Stats/Metrics
- [value]: [label]
- [value]: [label]

## Footer
- **Tagline:** "[text]"
- **Copyright:** "[text]"
- **Link groups:** [list]
```

### Step 3: User Approval

Present all content for approval:
"Here's the complete content plan. Content is as important as visual design — weak copy kills even beautiful designs. Please review and approve, or suggest changes."

**User must approve content before proceeding to section planning.**

Save approved content to `.planning/modulo/CONTENT.md`.
```

**Step 3: Update Initialize STATE.md**

Change `phase: DNA_COMPLETE` to `phase: CONTENT_COMPLETE` and add the content phase to the completed phases checklist:

```markdown
- [x] Content Planning — CONTENT.md written and approved
```

Add `CONTENT.md` and `REFERENCES.md` to the artifacts list in the Completion section.

**Step 4: Update the workflow reference**

In Phase 3.5, after "Save to `.planning/modulo/DESIGN-DNA.md`.", add:

```markdown
**Next:** Proceed to Phase 3.75 (Content Planning) before section planning.
```

**Step 5: Commit**

```bash
git add commands/start-design.md
git commit -m "feat: add visual reference capture (Phase 2) and content planning (Phase 3.75) to start-design"
```

---

## Task 5: Update section-builder.md for Spec Executor Role + Anti-Context-Rot

**Priority:** High (builder quality + context rot prevention)

**Files:**
- Modify: `agents/section-builder.md`

**Step 1: Add discussion protocol reference**

After the frontmatter (after line 8), add:

```markdown
## MANDATORY: Discussion-First Protocol

For `[auto]` tasks, follow the plan exactly — no discussion needed (the plan was already approved).
For ANY deviation from the plan, follow the Discussion-Before-Action protocol in `agents/discussion-protocol.md` before making the change. Document deviations in SUMMARY.md.
```

**Step 2: Update Step 2 (Read Your Assignment) for new PLAN.md format**

Replace the current body description (lines 55-61) with:

```markdown
**Body** (structured sections):
- `<objective>` — what to build and which reference pattern to adapt
- `<visual-specification>` — exact layout (ASCII diagrams), exact Tailwind classes per element, responsive adaptations, exact copy from CONTENT.md, exact animation sequence, background treatment
- `<component-structure>` — JSX blueprint, props interface, required imports
- `<wow-moment>` — full TSX implementation code for wow moment (if assigned)
- `<creative-tension>` — full specification for creative tension (if assigned)
- `<tasks>` — ordered task list with types
- `<verification>` — what to check
- `<success_criteria>` — definition of done

**Your job is to translate the `<visual-specification>` blueprint into working TSX code.** The layout, classes, copy, animations, and wow moments are all pre-decided. You are a spec executor, not a creative decision-maker. Deviations from the plan must be documented and justified in SUMMARY.md.
```

Also add to the "Also read:" list:

```markdown
- `.planning/modulo/CONTENT.md` — approved copy (your section's text must match exactly)
- `.planning/modulo/REFERENCES.md` — reference quality bar (understand what we're matching)
- The Page Context Snapshot (provided by design-lead in the spawn prompt) — adjacent sections and coherence rules
```

**Step 3: Add task-level DNA checkpoints**

After Step 3 (Execute Tasks Sequentially), add a new section:

```markdown
### Step 3.5: Task-Level DNA Checkpoints (Anti-Context-Rot)

To prevent quality drift during the section build:

#### After EVERY Task: Quick DNA Check (3 questions)
1. Did I use ONLY DNA color tokens? (no raw hex values like #xxx outside the DNA palette)
2. Did I use ONLY DNA fonts? (no font-sans, no system-ui, no Inter unless DNA specifies)
3. Did I follow DNA spacing scale? (no gap-4, no p-4 outside DNA spacing tokens)

If ANY answer is "No" → fix BEFORE moving to the next task.

#### Every 3rd Task: Expanded Check (7 questions)
4. All interactive elements in this task have hover + focus + active states?
5. All elements are responsive (md: and lg: variants present)?
6. Animations use DNA easing and timing (no duration-300 outside DNA spec)?
7. No Tailwind defaults crept in (no shadow-md, rounded-lg, text-gray-500 outside DNA)?

If ANY answer is "No" → fix BEFORE moving to the next task.

#### Last Task: Full Quality Gate
Run the complete 7-question self-check from Step 5.5, PLUS:
8. Count all interactive elements → verify EACH has hover/focus/active
9. Count all text elements → verify EACH uses DNA typography scale
10. Count all spacing values → verify EACH follows DNA spacing scale
11. Verify all copy matches CONTENT.md exactly — no builder-generated text
```

**Step 4: Add dead code prevention rules**

After Step 5.5 (Builder Self-Check), add:

```markdown
### Step 5.6: Dead Code Prevention

Before writing SUMMARY.md:
1. **Import-before-create:** Did I create any new utility, component, or function? If yes, verify it doesn't already exist in shared components (Wave 0/1), DNA motion presets, or shadcn/ui.
2. **No unused imports:** Verify every `import` statement is used in the component.
3. **No unused functions:** Verify every function/component defined is called/rendered.
4. **No unused variables:** Verify every variable is referenced.
5. **No orphaned styles:** Verify every Tailwind class is applied to a rendered element.
6. Remove anything unused before proceeding.
```

**Step 5: Update the self-check for wow moments and copy**

In Step 5.5 (7-Question Checklist), add:

```markdown
8. **Copy accuracy:** Does every piece of text match CONTENT.md exactly? No builder-generated headlines or CTA text?
9. **Visual specification compliance:** Do the actual Tailwind classes match the classes in `<visual-specification>`? Any deviations documented?
```

**Step 6: Add live visual feedback**

After Step 6 (Write SUMMARY.md), add:

```markdown
### Step 6.5: Visual Feedback (if browser tools available)

If Playwright, Chrome DevTools, or Claude in Chrome MCP tools are available:
1. Ensure the dev server is running
2. Navigate to the page
3. Take screenshots at 1440px, 768px, and 375px
4. If the section has hover/interactive states, capture those too
5. Save screenshots to `.planning/modulo/sections/XX-{name}/screenshots/`
6. Report screenshot paths in SUMMARY.md

If no browser tools available:
- Describe what was built in detail in SUMMARY.md
- Note that manual visual verification is needed
```

**Step 7: Commit**

```bash
git add agents/section-builder.md
git commit -m "feat: section-builder as spec executor with task-level DNA checks, dead code prevention, and visual feedback"
```

---

## Task 6: Update design-lead.md with Coherence System + Context Management

**Priority:** High (fixes section incoherence + context rot)

**Files:**
- Modify: `agents/design-lead.md`

**Step 1: Add discussion protocol and CONTENT.md/REFERENCES.md to reads**

After the Phase 1 read list (lines 36-38), add:

```markdown
6. Read `.planning/modulo/CONTENT.md` — approved copy for all sections
7. Read `.planning/modulo/REFERENCES.md` — reference quality bar and patterns
```

Add after line 9 (before Core Protocol):

```markdown
## MANDATORY: Discussion-First Protocol

Before spawning any wave, you MUST follow the Discussion-Before-Action protocol in `agents/discussion-protocol.md`. Present the wave plan and wait for user approval.
```

**Step 2: Add Page Context Snapshot protocol**

After Phase 2 "Spawn Parallel Section Builders" section (after line 82), add a new subsection:

```markdown
#### Page Context Snapshot

For each section-builder, construct and pass a Page Context Snapshot:

```markdown
## Page Context Snapshot

### Your Section: [XX-name] (Wave [N], [BEAT] beat)

### Adjacent Sections
**Above you:** [section name] ([beat type], [status])
  - Layout: [pattern used]
  - Background: [background color/treatment]
  - Last element: [what's at the bottom of the section]
  - Bottom spacing: [padding value]
  - Transition TO you: [transition technique]

**Below you:** [section name] ([beat type], [status])
  - Planned layout: [pattern planned]
  - Transition FROM you: [transition technique]

### Visual Continuity Rules
1. Your layout MUST differ from adjacent sections (above uses [X], you must NOT use [X])
2. Your background should contrast with above section's [bg color]
3. Your top spacing accounts for above section's bottom spacing
4. The [transition] technique means: [specific instruction for element timing]

### Layout Patterns Already Used
| Section | Pattern | Beat |
|---------|---------|------|
| [completed sections] |

### Shared Component Inventory
[List of available shared components from Wave 0/1]
```

Each builder receives this snapshot as part of its spawn prompt. This ensures cross-section coherence.
```

**Step 3: Add cross-section visual rules**

After the existing "## Rules" section, add a new section before it:

```markdown
## Cross-Section Coherence Rules

1. **Shadow consistency:** All sections use the DNA shadow system only. No section introduces custom shadow values outside the 5-level DNA system.
2. **Spacing rhythm:** Section padding alternates per DNA scale. No two consecutive sections may have identical top+bottom padding values.
3. **Background progression:** Plan the background color progression across the full page before spawning Wave 2+:
   - e.g., primary → secondary → primary → tertiary → primary → accent-tint → primary
   - No two adjacent sections with the same background color
   - Document the progression in MASTER-PLAN.md
4. **Typography consistency:** All sections use the DNA type scale only. No section introduces custom font sizes, weights, or tracking outside the DNA specification.
5. **Border-radius consistency:** All sections use the DNA border-radius system only.
6. **Animation consistency:** All sections use the DNA motion presets from `lib/motion.ts` only. No custom easing curves or timing values outside the DNA specification.

## Coherence Checkpoint (After Each Wave)

After ALL sections in a wave are COMPLETE, before advancing to the next wave:
1. Read all completed sections' source code
2. Verify shadow values match DNA across all sections
3. Verify spacing follows the planned rhythm (no identical adjacent padding)
4. Verify backgrounds alternate according to the planned progression
5. Verify typography uses DNA type scale only (grep for non-DNA font sizes/weights)
6. Verify no adjacent sections share the same layout pattern
7. If ANY coherence issue is found → fix it before advancing to the next wave

Also: if browser tools are available, record a scroll-through GIF of the full page after each wave:
- Save to `.planning/modulo/progress/wave-[N]-scrollthrough.gif`
- Present to user for holistic flow assessment
```

**Step 4: Add plan mutation protocol**

Add a new section after Coherence Rules:

```markdown
## Plan Mutation Protocol

When the user requests changes to direction, colors, layout, or scope during execution:

### Scope 1: Token Change (color, font, spacing adjustment)
1. Update DESIGN-DNA.md with the new value
2. Update globals.css and tailwind.config.ts in the target project
3. Grep all built sections for the old value → update to new
4. Update CONTENT.md if copy is affected
5. Log the change in STATE.md mutation table
6. No plan re-approval needed (just token swap)

### Scope 2: Section Change (layout, structure, new section)
1. Update the section's PLAN.md (or create new PLAN.md)
2. Update MASTER-PLAN.md wave map if dependencies changed
3. Update CONTENT.md with any new copy
4. Present updated plan for user approval (discussion-first protocol)
5. If already built → mark section as NEEDS_REBUILD in STATE.md
6. Log in STATE.md mutation table

### Scope 3: Direction Change (archetype swap, major rethink)
1. STOP all builds immediately
2. Re-run Phase 3 (brainstorm) and Phase 3.5 (DNA) with new direction
3. Re-generate ALL section PLAN.md files
4. Present new plans for full approval
5. Mark ALL built sections as NEEDS_REBUILD
6. Log in STATE.md mutation table

### Mutation Log (add to STATE.md)
```markdown
## Mutations
| Date | Scope | What Changed | Sections Affected |
|------|-------|-------------|-------------------|
```
```

**Step 5: Add 80% context window management**

Add a new section:

```markdown
## Context Window Management (80% Rule)

Monitor session length. When you sense the session is approaching context limits (approximately 80% capacity — you'll notice responses getting compressed, or you've been working for many turns):

1. **STOP all active builds**
2. **Write session transfer document:** `.planning/modulo/.session-transfer.md`

```markdown
# Session Transfer

## Session Summary
Date: [ISO date]
Waves completed: [list]
Current wave: [N]
Sections completed this session: [list with brief status]
Sections in progress: [list with what's done, what remains]
Sections remaining: [list]

## Critical Context (MUST be read first in next session)

### DNA Anchor
- Archetype: [name]
- Display font: [font name]
- Body font: [font name]
- Colors: bg-primary [hex], accent-1 [hex], accent-2 [hex], accent-3 [hex]
- Signature element: [description]
- Forbidden patterns: [list]

### Reference Quality Bar
- Primary reference: [site name] — [1 sentence on what we're matching]
- Target scores: anti-slop 30+/35, Awwwards 8.0+ average

### Emotional Arc State
[Full beat sequence with current position marked]

### Layout Diversity State
| Section | Pattern | Background |
|---------|---------|-----------|
| [completed sections with their patterns and backgrounds] |

### Active Decisions
[List of user decisions during this session]

### Code State
- Build status: [passing/failing]
- Dev server: [running/stopped]
- Packages installed this session: [list]

## Resume Instructions
1. Read this file FIRST
2. Read STATE.md for full project state
3. Read DESIGN-DNA.md (FULL read — do not skim)
4. Read REFERENCES.md (quality bar)
5. Read CONTENT.md (approved copy)
6. Read MASTER-PLAN.md (wave map)
7. Continue from Wave [N], Section [XX-name]
8. First action: [specific next step]
```

3. **Update STATE.md** with current progress
4. **Tell user:** "Approaching context limit. State saved to `.session-transfer.md`. Start a new session and run `/modulo:execute resume` to continue seamlessly."
```

**Step 6: Commit**

```bash
git add agents/design-lead.md
git commit -m "feat: design-lead with page context snapshots, coherence system, plan mutations, and 80% context management"
```

---

## Task 7: Update quality-reviewer.md with Reference Comparison + Content Verification

**Priority:** Medium

**Files:**
- Modify: `agents/quality-reviewer.md`

**Step 1: Add REFERENCES.md and CONTENT.md to Step 1 reads**

After line 6 (Read all section SUMMARY.md files), add:

```markdown
8. Read `.planning/modulo/REFERENCES.md` — reference quality bar for comparison
9. Read `.planning/modulo/CONTENT.md` — approved copy for content verification
10. Read `.planning/modulo/PAGE-CONSISTENCY.md` — cross-page coherence rules (if multi-page)
```

**Step 2: Add content verification to Step 3 (Visual Audit)**

After the existing Creative Systems Check, add:

```markdown
**Content Verification Check (NEW):**
- All copy matches approved CONTENT.md text exactly (grep for any builder-generated text)
- No "Submit", "Learn More", "Click Here" on any button
- Headlines match approved text word-for-word
- Social proof uses specific names, titles, companies (not placeholders)
- Friction reducers present below primary CTAs
- Status badges match approved text
```

**Step 3: Add reference comparison to Step 5 (Quality Standards)**

After the existing quality standards check, add:

```markdown
### Reference Quality Comparison (NEW)

For each section, compare against the reference pattern it was adapted from (documented in REFERENCES.md and the section's PLAN.md `<visual-specification>` reference basis):

| Aspect | Reference | Built | Match? |
|--------|-----------|-------|--------|
| Color depth | [from REFERENCES.md] | [observed in code] | MATCH / GAP |
| Typography impact | [from REFERENCES.md] | [observed] | MATCH / GAP |
| Layout structure | [from REFERENCES.md] | [observed] | MATCH / GAP |
| Spacing generosity | [from REFERENCES.md] | [observed] | MATCH / GAP |
| Shadow quality | [from REFERENCES.md] | [observed] | MATCH / GAP |
| Animation quality | [from REFERENCES.md] | [observed] | MATCH / GAP |
| Overall impression | [reference assessment] | [honest assessment] | MATCH / GAP |

Any GAP in this comparison generates a GAP-FIX.md item.
```

**Step 4: Add cross-page coherence check**

After the reference comparison section, add:

```markdown
### Cross-Page Coherence Check (for multi-page projects)

If `.planning/modulo/PAGE-CONSISTENCY.md` exists:
- [ ] Navigation is identical across all pages
- [ ] Footer is identical across all pages
- [ ] Font loading is consistent (no FOUT on secondary pages)
- [ ] Color palette is consistent across pages
- [ ] Hero pattern varies between pages (no two pages share same hero)
- [ ] Animation intensity follows the page consistency rules
```

**Step 5: Commit**

```bash
git add agents/quality-reviewer.md
git commit -m "feat: quality-reviewer with reference comparison, content verification, and cross-page coherence"
```

---

## Task 8: Update verify.md with Content + Reference Verification Steps

**Priority:** Medium

**Files:**
- Modify: `commands/verify.md`

**Step 1: Add REFERENCES.md and CONTENT.md to Prerequisites**

After line 15 (All section PLAN.md files), add:

```markdown
- `.planning/modulo/REFERENCES.md` — reference quality bar for comparison (if exists)
- `.planning/modulo/CONTENT.md` — approved copy for content verification (if exists)
- `.planning/modulo/PAGE-CONSISTENCY.md` — cross-page coherence rules (if exists)
```

**Step 2: Add Content Verification section**

After the "## Design DNA Compliance Check" section (after line 202), add:

```markdown
## Content Verification (NEW)

If `.planning/modulo/CONTENT.md` exists, verify all approved copy is faithfully implemented:

- [ ] All hero text matches CONTENT.md exactly (headline, subheadline, CTAs, friction reducer)
- [ ] All section headlines match CONTENT.md
- [ ] All button/CTA text matches CONTENT.md (no builder-generated text)
- [ ] Testimonial quotes match CONTENT.md (specific names, titles, companies)
- [ ] Stats/metrics match CONTENT.md (specific values and labels)
- [ ] No forbidden phrases present ("Learn More", "Submit", "Click Here", "Solutions", "Leverage")

**Any content mismatch = MAJOR gap.** Create GAP-FIX.md with exact text corrections.
```

**Step 3: Add Reference Comparison section**

After the Content Verification section, add:

```markdown
## Reference Quality Comparison (NEW)

If `.planning/modulo/REFERENCES.md` exists, compare each section against its reference pattern:

For each section that references a specific pattern from a reference site (documented in PLAN.md `<visual-specification>`):

1. Read the reference analysis from REFERENCES.md
2. Read the built section's code
3. Compare: color depth, typography impact, layout structure, spacing, shadows, animations
4. Score each aspect as MATCH or GAP
5. Any GAP generates a GAP-FIX.md item with specific instructions to close the quality gap

If browser tools available: take a screenshot of the built section and compare visually against the reference screenshots in `.planning/modulo/research/screenshots/`.
```

**Step 4: Commit**

```bash
git add commands/verify.md
git commit -m "feat: verify command with content verification and reference quality comparison"
```

---

## Task 9: Register Discussion Protocol Agent + Version Bump in plugin.json

**Priority:** Medium

**Files:**
- Modify: `.claude-plugin/plugin.json`

**Step 1: Update plugin.json**

Update the version to `6.0.0` and update the description to mention the new quality pipeline features:

```json
{
  "name": "modulo",
  "description": "Premium frontend design system with 87 skills, 12 commands, and 17 agents. Features Full Quality Pipeline: visual reference capture, hyper-specific blueprints, content planning, discussion-first protocol, section coherence system, live visual feedback, wow factor enforcement, and anti-context-rot session management. Plus Design DNA identity system with 16 opinionated archetypes, creative tension system, emotional arc storytelling, cinematic motion choreography, 35-point anti-slop quality gate, and Awwwards 4-axis scoring. Creates Awwwards SOTD-competitive, production-ready websites. Works with Next.js and Astro.",
  "version": "6.0.0",
  "author": {
    "name": "raphj"
  }
}
```

**Step 2: Commit**

```bash
git add .claude-plugin/plugin.json
git commit -m "feat: bump to v6.0.0 with Full Quality Pipeline"
```

---

## Task 10: Update README.md

**Priority:** Low (last)

**Files:**
- Modify: `README.md`

**Step 1: Update the opening description**

Update the first paragraph to mention the Full Quality Pipeline.

**Step 2: Update "What Makes v6.0 Different"**

Rename the section from "What Makes v5.0 Different" to "What Makes v6.0 Different" and add the 8 new quality systems:

```markdown
## What Makes v6.0 Different

**The problem:** AI agents have fundamental limitations — visual blindness, vague specifications, context rot, autonomous changes, weak copy, and missing wow factor. Even with DNA and archetypes, output quality drifts during long sessions and sections feel like different designers made them.

**The solution:** The Full Quality Pipeline — 8 interlocking systems on top of the existing 7 quality systems:

1. **Visual Reference System** — Browser-assisted screenshot capture of reference sites, pattern extraction, and quality bar comparison throughout the pipeline
2. **Hyper-Specific Blueprints** — PLAN.md files with ASCII layout diagrams, exact Tailwind classes per element, exact copy, exact animation sequences, and inline wow moment code
3. **Content Planning** — Dedicated content phase with all copy written and user-approved before any section building
4. **Discussion-First Protocol** — Mandatory user approval before ANY code change. No autonomous modifications. Every change presented with exact diff preview.
5. **Section Coherence System** — Page context snapshots, cross-section visual rules, background progression planning, and coherence checkpoints between waves
6. **Live Visual Feedback** — Post-build screenshots, wave scroll-through GIFs, and before/after comparisons for iterate/bugfix
7. **Wow Factor Enforcement** — Full TSX code embedded in plans (not just references), wow moment minimums (3-5 per page), and boldness verification
8. **Anti-Context-Rot** — Task-level DNA checkpoints, plan mutation protocol, 80% context rule with session transfer documents, file-based context architecture

Plus the existing 7 systems: Design DNA, 16 Archetypes, Creative Tension, Emotional Arc, Cinematic Motion, Anti-Slop Gate, Awwwards Scoring.
```

**Step 3: Update agent count**

Change "16 agents" to "17 agents" in the heading and table. Add `discussion-protocol` to the agents table:

```markdown
| `discussion-protocol` | Protocol | Mandatory discussion-before-action rules for all code-modifying commands |
```

**Step 4: Update workflow description**

Update the workflow section to include content planning:

```markdown
1. **Start Design** — Discovery, parallel research, **visual reference capture**, archetype selection, Design DNA, **content planning**
```

**Step 5: Update the new artifacts list**

Add a section listing the new planning artifacts:

```markdown
## New Planning Artifacts (v6.0)

| Artifact | Purpose |
|----------|---------|
| `CONTENT.md` | All approved page copy — no builder-generated text |
| `REFERENCES.md` | Reference site analysis with pattern extraction |
| `research/screenshots/` | Reference site screenshots for quality comparison |
| `PAGE-CONSISTENCY.md` | Cross-page coherence rules (multi-page projects) |
| `.session-transfer.md` | Context handoff document for session boundaries |
| `sections/XX/screenshots/` | Built section screenshots for visual feedback |
| `progress/` | Wave scroll-through GIFs |
```

**Step 6: Commit**

```bash
git add README.md
git commit -m "docs: update README for v6.0.0 Full Quality Pipeline"
```

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | `agents/discussion-protocol.md` (NEW) | Discussion-first protocol agent |
| 2 | `commands/execute.md`, `iterate.md`, `bugfix.md`, `change-plan.md` | Add discussion protocol references |
| 3 | `commands/plan-sections.md` | Hyper-specific PLAN.md format |
| 4 | `commands/start-design.md` | Visual reference capture + content planning phase |
| 5 | `agents/section-builder.md` | Spec executor role + DNA checkpoints + dead code prevention |
| 6 | `agents/design-lead.md` | Coherence system + context management + plan mutations |
| 7 | `agents/quality-reviewer.md` | Reference comparison + content verification |
| 8 | `commands/verify.md` | Content + reference verification steps |
| 9 | `.claude-plugin/plugin.json` | Version bump to 6.0.0 |
| 10 | `README.md` | Update for v6.0 features |

**Total: 10 tasks, 11 files (1 new + 10 modified)**
**Estimated commits: 10 atomic commits**
