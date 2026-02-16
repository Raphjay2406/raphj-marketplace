# Context Rot Prevention — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a 6-layer context rot prevention system that keeps Modulo builds at award-winning quality through wave 5+ by preventing DNA drift, eliminating redundant reads, and enforcing session boundaries.

**Architecture:** Hooks for zero-cost static enforcement, a single CONTEXT.md for identity anchoring, pre-extracted spawn prompts to eliminate builder file reads, canary checks for fidelity monitoring, 2-wave session boundaries, and baked-in quality rules in agent files.

**Tech Stack:** Bash (hooks), Markdown (all agents/commands/skills)

**Design doc:** `docs/plans/2026-02-16-context-rot-prevention-design.md`

---

### Task 1: Create DNA Compliance Hook Script

**Files:**
- Create: `.claude-plugin/hooks/dna-compliance-check.sh`

**Step 1: Create the hook script**

```bash
#!/usr/bin/env bash
# DNA Compliance Check — runs before git commit
# Checks staged files for common anti-slop violations
# Zero context window cost — pure static enforcement

set -euo pipefail

VIOLATIONS=""
VIOLATION_COUNT=0

# Get staged files (only .tsx, .jsx, .ts, .css files)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '\.(tsx?|jsx?|css)$' || true)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

check_pattern() {
  local pattern="$1"
  local message="$2"
  local matches

  matches=$(echo "$STAGED_FILES" | xargs grep -Hn "$pattern" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    VIOLATIONS="${VIOLATIONS}\n[VIOLATION] ${message}\n${matches}\n"
    VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  fi
}

# --- Generic Anti-Slop Patterns (always active) ---

# Default shadow classes (should use DNA shadow system)
check_pattern 'shadow-md\b' "Using shadow-md — use DNA shadow tokens instead"
check_pattern 'shadow-lg\b' "Using shadow-lg — use DNA shadow tokens instead"
check_pattern 'shadow-xl\b' "Using shadow-xl — use DNA shadow tokens instead"

# Default rounded classes without DNA variable
check_pattern 'rounded-lg\b' "Using rounded-lg — use DNA radius tokens instead"

# Default gray text (should use DNA text tokens)
check_pattern 'text-gray-[0-9]' "Using text-gray-XXX — use DNA text color tokens instead"

# Default font-sans without DNA variable
check_pattern 'font-sans\b' "Using font-sans — use DNA font variable instead"

# AI-slop default colors
check_pattern 'bg-blue-500\b' "Using bg-blue-500 — use DNA color tokens instead"
check_pattern 'bg-indigo-500\b' "Using bg-indigo-500 — use DNA color tokens instead"
check_pattern 'bg-violet-500\b' "Using bg-violet-500 — use DNA color tokens instead"
check_pattern 'text-blue-500\b' "Using text-blue-500 — use DNA color tokens instead"
check_pattern 'text-indigo-500\b' "Using text-indigo-500 — use DNA color tokens instead"

# Forbidden button text
check_pattern '"Submit"' "Button text 'Submit' found — use outcome-driven copy"
check_pattern '"Learn More"' "Button text 'Learn More' found — use specific action copy"
check_pattern '"Click Here"' "Button text 'Click Here' found — use descriptive action copy"

# Layout-triggering animations
check_pattern 'animate-\[.*width' "Animating width — use transform instead"
check_pattern 'animate-\[.*height' "Animating height — use transform instead"

# --- Project-Specific DNA Patterns (if DNA exists) ---

DNA_FILE=".planning/modulo/DESIGN-DNA.md"
if [ -f "$DNA_FILE" ]; then
  # Check for Inter/Roboto as display font (unless DNA explicitly allows)
  if ! grep -q "Inter\|Roboto" "$DNA_FILE" 2>/dev/null; then
    check_pattern "'Inter'" "Using Inter font — DNA specifies a different display font"
    check_pattern "'Roboto'" "Using Roboto font — DNA specifies a different display font"
  fi
fi

# --- Report ---

if [ $VIOLATION_COUNT -gt 0 ]; then
  echo ""
  echo "=========================================="
  echo " DNA COMPLIANCE CHECK — ${VIOLATION_COUNT} violation(s) found"
  echo "=========================================="
  echo -e "$VIOLATIONS"
  echo ""
  echo "Fix these violations before committing."
  echo "Reference: .planning/modulo/DESIGN-DNA.md"
  echo "=========================================="
  echo ""
  echo "BLOCKED: Commit blocked by DNA compliance hook."
  echo "To bypass (not recommended): git commit --no-verify"
  exit 1
fi

exit 0
```

**Step 2: Make it executable**

Run: `chmod +x .claude-plugin/hooks/dna-compliance-check.sh`

**Step 3: Commit**

```bash
git add .claude-plugin/hooks/dna-compliance-check.sh
git commit -m "feat(hooks): add DNA compliance pre-commit hook for zero-cost static enforcement"
```

---

### Task 2: Update Plugin Manifest with Hooks

**Files:**
- Modify: `.claude-plugin/plugin.json`

**Step 1: Add hooks configuration to plugin.json**

The current plugin.json has only name, description, version, and author. Add a `hooks` key:

```json
{
  "name": "modulo",
  "description": "Premium frontend design system with 87 skills, 12 commands, and 17 agents. Features Full Quality Pipeline: visual reference capture, hyper-specific blueprints, content planning, discussion-first protocol, section coherence system, live visual feedback, wow factor enforcement, and anti-context-rot session management. Plus Design DNA identity system with 16 opinionated archetypes, creative tension system, emotional arc storytelling, cinematic motion choreography, 35-point anti-slop quality gate, and Awwwards 4-axis scoring. Creates Awwwards SOTD-competitive, production-ready websites. Works with Next.js and Astro.",
  "version": "6.1.0",
  "author": {
    "name": "raphj"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": {
          "tool_name": "Bash",
          "command_pattern": "git commit"
        },
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude-plugin/hooks/dna-compliance-check.sh"
          }
        ]
      }
    ]
  }
}
```

Key changes:
- Bump version from `6.0.0` to `6.1.0`
- Add `hooks` with PreToolUse matcher for git commit commands

**Step 2: Commit**

```bash
git add .claude-plugin/plugin.json
git commit -m "feat(plugin): add hooks config for DNA compliance enforcement, bump v6.1.0"
```

---

### Task 3: Bake Critical Rules into Section Builder

**Files:**
- Modify: `agents/section-builder.md`

This is the largest change. We need to:
1. Add the embedded beat parameter table (from emotional-arc skill)
2. Add embedded anti-slop quick check
3. Add embedded performance rules
4. Change file read protocol to PLAN.md only (context comes from spawn prompt)
5. Remove all "reference the X skill" instructions during build time

**Step 1: Add Beat Parameter Table after Step 1 (Read Design DNA)**

Insert after the current Step 1 section (after line ~41, before Step 2). Add:

```markdown
### Embedded Beat Parameters (do NOT read emotional-arc skill)

Your spawn prompt includes your beat assignment. Use this table to verify compliance:

| Beat | Height | Density | Anim Intensity | Whitespace | Type Scale | Layout |
|------|--------|---------|----------------|------------|------------|--------|
| HOOK | 90-100vh | Low (3-5) | High (800ms+) | 60-70% | Hero (7xl-[15vw]) | Simple |
| TEASE | 50-70vh | Low-Med (4-6) | Medium (400-600ms) | 50-60% | H1-H2 | Simple-Med |
| REVEAL | 80-100vh | Medium (5-8) | High (600-1000ms) | 40-50% | H1-H2 | Med-High |
| BUILD | Auto | High (8-12) | Low-Med (300-500ms) | 30-40% | H2-H3 | High |
| PEAK | 80-120vh | Medium (5-8) | Maximum (800-1500ms) | 40-60% | H1-Hero | High |
| BREATHE | 30-50vh | Very Low (1-3) | Minimal (400ms) | 70-80% | Body Lg/H3 | Minimal |
| TENSION | 60-80vh | Medium (5-8) | Medium (500-700ms) | 40-50% | H2-H3 | Medium |
| PROOF | Auto | Med-High (6-10) | Low (200-400ms) | 35-45% | H3-Body Lg | Medium |
| PIVOT | 50-70vh | Low-Med (3-6) | Med-High (500-800ms) | 50-60% | H1-H2 | Simple-Med |
| CLOSE | 50-70vh | Low (3-5) | Medium (400-600ms) | 55-65% | H1-H2 | Simple |

**Beat parameters are HARD CONSTRAINTS.** A BREATHE section with 30% whitespace is WRONG. A BUILD section with 3 elements is WRONG.
```

**Step 2: Add embedded performance rules**

Replace the current "Performance Compliance" section (around line ~165-170) that says "reference the `performance-guardian` skill" with fully embedded rules:

```markdown
**Performance Rules (EMBEDDED — do NOT read performance-guardian skill):**
- **ALLOWED animations:** `transform`, `opacity`, `filter`, `clip-path`
- **FORBIDDEN animations:** `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`, `font-size`, `box-shadow` (use pseudo-element with opacity instead)
- **Dynamic import:** GSAP, Three.js, Lottie — NEVER top-level import. Use `const gsap = await import('gsap')`
- **Max 3 `backdrop-blur`** elements visible simultaneously
- **`will-change`** on max 5 elements. Remove after animation completes.
- **`prefers-reduced-motion`** fallback on ALL animations — no exceptions
- **Images:** Use `next/image` with `priority` for above-fold, `lazy` for below. Always include `sizes` prop.
- **Fonts:** Must be preloaded with `font-display: swap`
- **CSS scroll-driven preferred** over JS scroll listeners when available
```

**Step 3: Add embedded anti-slop quick check**

Replace the current "Design Quality (anti-slop-design)" section that says "reference the anti-slop-design principles" with:

```markdown
**Anti-Slop Quick Check (EMBEDDED — do NOT read anti-slop-design skill):**
After EVERY task, verify these 5 items:
1. Primary color is NOT default blue/indigo/violet (use DNA tokens)
2. Display font is NOT Inter/Roboto/system-ui (use DNA display font)
3. Shadows are layered (not just shadow-md — use DNA shadow levels)
4. Spacing varies (not uniform gap-4 everywhere — use DNA spacing scale)
5. Every interactive element has hover + focus + active states
**If ANY fails → fix before next task.**
```

**Step 4: Change file read protocol**

Replace Step 1 "Read Design DNA FIRST" to reflect the new protocol:

```markdown
### Step 1: Read Your Build Context

Your spawn prompt from the design-lead contains a **Complete Build Context** with:
- DNA Identity (colors, fonts, spacing, shadows, motion, forbidden patterns)
- Beat assignment and parameters
- Adjacent section info and layout diversity rules
- Pre-approved content from CONTENT.md
- Quality rules

**You do NOT need to read:** DESIGN-DNA.md, BRAINSTORM.md, CONTENT.md, REFERENCES.md, or any skill files. Everything you need is in your spawn prompt + your PLAN.md.

**Your ONLY file read:** Your section's PLAN.md at the path specified in your spawn prompt.

**If your spawn prompt is missing Build Context** (legacy invocation), fall back to reading DESIGN-DNA.md first, then PLAN.md.
```

**Step 5: Remove "reference the X skill" language from build-time sections**

Search and replace throughout section-builder.md:
- "Reference the `performance-guardian` skill" → Remove (rules now embedded)
- "Reference the `micro-copy` skill" → Remove (rules now embedded in quality check)
- "Reference the `anti-slop-design` skill" → Remove (rules now embedded)
- Keep references in the self-verification Step 5.5 (post-build check is fine to reference skills since the section is complete)

**Step 6: Commit**

```bash
git add agents/section-builder.md
git commit -m "feat(section-builder): embed beat params, performance rules, anti-slop checks; eliminate external skill reads during build"
```

---

### Task 4: Update Design Lead with Context Management System

**Files:**
- Modify: `agents/design-lead.md`

This adds: CONTEXT.md generation/update, canary checks, context budget, pre-extracted spawn prompts, and embedded beat sequence rules.

**Step 1: Add CONTEXT.md Generation Protocol**

Insert after "Phase 4: Wave Completion" section. Add a new section:

```markdown
### CONTEXT.md Management

After EVERY wave completion, rewrite `.planning/modulo/CONTEXT.md` with the current state. This is the single source of truth for context recovery.

**CONTEXT.md Template:**

```markdown
# Modulo Context (auto-rewritten after each wave)
Last updated: [ISO date] | Wave: [N] completed | Session: [N]

## DNA Identity
Archetype: [name]
Display: [font] | Body: [font] | Mono: [font]
Signature: [element description]
Colors: bg-primary [hex], bg-secondary [hex], bg-tertiary [hex], accent-1 [hex], accent-2 [hex], accent-3 [hex]
Text: primary [hex], secondary [hex], tertiary [hex]
Spacing: [5 levels with token names and values]
Radius: [token names and values]
Shadows: [levels with descriptions]
Motion: easing [values], stagger [ms], enter directions per beat
FORBIDDEN: [pattern1, pattern2, ...]

## Emotional Arc & Creative Systems
Beat sequence: [full sequence with completed beats marked *]
Tensions: [section XX - Level N: technique name]
Wow moments: [section XX - moment type]
Current position: Wave [N], next beat [type]

## Build State
| Section | Wave | Status | Layout Pattern | Beat | Background | Transition |
|---------|------|--------|---------------|------|-----------|------------|
[all sections with current status]

## Latest Wave Results
Sections built: [names]
Decisions made: [list]
Layout patterns used: [list]
Patterns forbidden for next adjacent: [list]
DNA compliance: PASSED/ISSUES
Canary check: PASSED/FAILED

## Next Wave Instructions
Wave [N+1] sections: [list with beat types and wow/tension assignments]
PLAN.md paths: [list of file paths]
First action: Present wave summary to user
Session recommendation: [continue / new session recommended]
```

**This replaces `.continue-here.md` and `.session-transfer.md`.** Delete those files if they exist when writing CONTEXT.md.
```

**Step 2: Add Canary Check Protocol**

Insert as a new section after the CONTEXT.md management section:

```markdown
### Canary Check Protocol (Fidelity Monitoring)

After EVERY wave completion, BEFORE spawning the next wave, perform a canary check:

**Answer these 5 questions from memory (do NOT read any files first):**
1. What is our display font?
2. What is accent-1 hex value?
3. What patterns are forbidden by our archetype?
4. What layout patterns have been used so far?
5. What beat type is assigned to the next section to build?

**Then read CONTEXT.md and verify your answers.**

**Triggers:**
- **All 5 correct:** Context healthy. Continue building.
- **1-2 wrong:** Re-read CONTEXT.md carefully. Continue with caution. Add `Canary: DEGRADING` to CONTEXT.md.
- **3+ wrong:** **TRIGGER SESSION BOUNDARY.** Context rot is active. Complete CONTEXT.md write, then tell user:
  "Context fidelity degrading. Saving state and recommending new session. Run `/modulo:execute resume` to continue with fresh context."

**This check is MANDATORY and cannot be skipped.**
```

**Step 3: Add Context Budget & Session Policy**

Replace the existing "Context Window Management (80% Rule)" section with:

```markdown
## Context Budget & Session Management

### Turn-Based Context Zones
- **Turn 1-20:** Green zone. Normal operation.
- **Turn 21-30:** Yellow zone. Canary checks mandatory after EVERY wave (not just every 2).
- **Turn 31+:** Red zone. Complete current wave, then MANDATORY session save. No override possible.

### 2-Wave Session Suggestion
After every 2 completed waves (regardless of turn count), recommend a new session:

```
Wave [N] and [N+1] complete. [X] sections built this session.

Recommendation: Start a new session for Wave [N+2] to ensure peak quality.
State saved to CONTEXT.md.

To continue: Run `/modulo:execute resume` in a new session.
To override: Say "continue in this session" (canary checks will still monitor fidelity).
```

**The user can override** the 2-wave suggestion, but canary checks remain active.
**The user CANNOT override** the 31+ turn hard stop.

### Session Boundary Actions
When triggering a session boundary (by canary failure, 2-wave suggestion, or turn limit):
1. Write/update CONTEXT.md with full current state
2. Update STATE.md with current progress
3. Delete `.continue-here.md` and `.session-transfer.md` if they exist (CONTEXT.md replaces them)
4. Tell user to run `/modulo:execute resume` in a new session
```

**Step 4: Add Pre-Extracted Spawn Prompt Template**

Replace the existing "Spawn Parallel Section Builders" subsection with:

```markdown
#### Spawn Parallel Section Builders (with Complete Build Context)

Use the Task tool to spawn `section-builder` agents. For EACH section in the wave, construct a **Complete Build Context** and include it in the spawn prompt:

```markdown
## Complete Build Context for [Section XX-name]

### DNA Identity (do NOT re-read any DNA files)
Archetype: [name]
Display: [font] | Body: [font]
Colors: bg-primary [hex], bg-secondary [hex], bg-tertiary [hex], accent-1 [hex], accent-2 [hex], accent-3 [hex]
Text: primary [hex], secondary [hex], tertiary [hex]
Spacing: [full DNA spacing scale with token names and values]
Radius: [full DNA radius system]
Shadows: [full DNA shadow levels]
Motion: easing [values], stagger [ms], enter directions for [beat type]
FORBIDDEN: [full forbidden patterns list]
Signature: [element description]

### Your Section Assignment
Beat: [type] | Wave: [N]
Wow moment: [type or "none"]
Creative tension: [type or "none"]
Transition in: [technique from previous section] | Transition out: [technique to next section]

### Beat Parameters
Section height: [value] | Element density: [value]
Animation intensity: [value] | Whitespace ratio: [value]
Type scale: [value] | Layout complexity: [value]

### Adjacent Sections
Above: [section name] ([beat]) — Layout: [pattern], Background: [color], Bottom spacing: [value]
Below: [section name] ([beat]) — Planned layout: [pattern]
Visual continuity: Your layout MUST differ from [above pattern]. Your bg MUST contrast with [above bg].

### Layout Patterns Already Used
[list of all patterns used by completed sections]
You MUST pick a DIFFERENT pattern.

### Shared Components Available
[list from Wave 0/1 with import paths]

### Content for This Section (from CONTENT.md)
[pre-extracted copy for ONLY this section — headlines, body, CTAs, friction reducers, testimonials, stats]

### Quality Rules (do NOT read any skill files)
**Anti-slop:** No blue/indigo/violet defaults | No Inter/Roboto | Layered shadows only | Varied spacing | Hover states on all interactive
**Performance:** transform/opacity ONLY for animations | dynamic import GSAP/Three.js | max 3 backdrop-blur | prefers-reduced-motion on all
**Micro-copy:** No "Submit", "Learn More", "Click Here" | Outcome-driven CTAs | Friction reducer below primary CTA
**DNA compliance:** ONLY DNA tokens | NO raw hex outside palette | NO Tailwind defaults (shadow-md, rounded-lg, gap-4)

### YOUR TASK
Read ONLY your PLAN.md at: `.planning/modulo/sections/XX-name/PLAN.md`
Then build the section following the plan exactly.
```

**Each builder reads exactly 1 file (PLAN.md).** Everything else is in this spawn prompt.

**Max 4 builders per wave.** If a wave has more than 4 sections, split into sub-waves.
```

**Step 5: Embed beat sequence validation rules**

In the existing "Phase 1.5: Validate Emotional Arc Pacing" section, add the full rules inline instead of referencing the emotional-arc skill. The current section already has the rules inline — verify they're complete and add if missing:

Ensure these rules are present (they mostly already are):
- REQUIRED: First beat = HOOK, last = CLOSE
- REQUIRED: At least one BREATHE after PEAK or 3+ dense beats
- REQUIRED: At least one PROOF before CLOSE
- FORBIDDEN: CLOSE before PROOF, PEAK→PEAK, HOOK→CLOSE, BUILD x4 without BREATHE, BREATHE→BREATHE, TENSION x3

**Step 6: Commit**

```bash
git add agents/design-lead.md
git commit -m "feat(design-lead): add CONTEXT.md management, canary checks, context budget, pre-extracted spawn prompts"
```

---

### Task 5: Update Execute Command with Session Boot Protocol

**Files:**
- Modify: `commands/execute.md`

**Step 1: Replace session resumption section**

Replace the current "Session Resumption" section (lines ~30-34) with:

```markdown
## Session Resumption (Boot Protocol)

If `$ARGUMENTS` contains "resume" or `.planning/modulo/CONTEXT.md` exists with a non-COMPLETE phase:

**Structured Session Boot Sequence:**
1. Read `.planning/modulo/CONTEXT.md` — This single file has everything: DNA identity, build state, latest wave results, and next instructions.
2. Read next wave's section PLAN.md files (paths listed in CONTEXT.md "Next Wave Instructions")
3. Run Canary Check — Answer from memory, then verify against CONTEXT.md:
   - Display font? Accent-1 hex? Forbidden patterns? Layouts used? Next beat type?
4. Present wave summary to user (discussion-first protocol)
5. Begin building

**Legacy fallback:** If CONTEXT.md doesn't exist but `.continue-here.md` or `.session-transfer.md` does, read those instead. Then generate CONTEXT.md from their contents + STATE.md for future sessions.

**Total reads to resume: 2-4 files.** No exploration needed. No redundant reads.
```

**Step 2: Add 2-wave session suggestion to wave completion**

In the "Step 5: Advance to Next Wave" section, add after the progress report:

```markdown
### Session Boundary Check (after wave completion)

After completing a wave:

1. **Rewrite CONTEXT.md** with current state (design-lead protocol)
2. **Run Canary Check** (design-lead protocol)
3. **Check 2-wave suggestion:** If this is the 2nd wave completed this session, recommend new session:
   ```
   Wave [N] and [N-1] complete. [X] sections built this session.

   Recommendation: Start a new session for the next wave to maintain peak quality.
   State saved to CONTEXT.md.

   To continue: Run `/modulo:execute resume` in a new session.
   To override: Say "continue" (canary checks remain active).
   ```
4. If user overrides, continue to next wave.
5. If user accepts (or canary check failed), save and end session.
```

**Step 3: Replace session boundary section**

Replace the current "Step 6: Session Boundary" section with:

```markdown
### Step 6: Session Boundary

When a session boundary is triggered (by canary check failure, 2-wave suggestion acceptance, turn limit, or user request):

1. **Write/update CONTEXT.md** — Full state with next instructions
2. **Update STATE.md** — Current section statuses
3. **Delete legacy files** — Remove `.continue-here.md` and `.session-transfer.md` if they exist
4. **Tell user:**
   ```
   Session state saved to CONTEXT.md.
   Run `/modulo:execute resume` in a new session to continue from Wave [N].
   ```
```

**Step 4: Commit**

```bash
git add commands/execute.md
git commit -m "feat(execute): add session boot protocol, 2-wave boundaries, CONTEXT.md integration"
```

---

### Task 6: Update Start Design to Generate Initial CONTEXT.md

**Files:**
- Modify: `commands/start-design.md`

**Step 1: Add CONTEXT.md initialization after Phase 3.5**

After the "Phase 3.5: DESIGN DNA GENERATION" section (after line ~264 "Save to `.planning/modulo/DESIGN-DNA.md`."), add:

```markdown
### Generate Initial CONTEXT.md

After saving DESIGN-DNA.md, create the initial `.planning/modulo/CONTEXT.md`:

```markdown
# Modulo Context (auto-rewritten after each wave)
Last updated: [ISO date] | Wave: -- | Session: 1

## DNA Identity
Archetype: [selected archetype name]
Display: [display font] | Body: [body font] | Mono: [mono font or "none"]
Signature: [signature element description]
Colors: bg-primary [hex], bg-secondary [hex], bg-tertiary [hex], accent-1 [hex], accent-2 [hex], accent-3 [hex]
Text: primary [hex], secondary [hex], tertiary [hex]
Spacing: [5 levels from DNA]
Radius: [from DNA]
Shadows: [levels from DNA]
Motion: easing [from DNA], stagger [from DNA]
FORBIDDEN: [forbidden patterns from archetype]

## Emotional Arc & Creative Systems
Beat sequence: [archetype default template from DNA]
Tensions: [from DNA tension plan]
Wow moments: [to be assigned in plan-sections]
Current position: Pre-planning

## Build State
[to be populated by plan-sections]

## Next Instructions
Run `/modulo:plan-sections` to create section plans with wave assignments.
```

This initial CONTEXT.md captures DNA identity immediately after generation, ensuring it's available from the very start.
```

**Step 2: Update Completion section**

In the "Completion" section, add CONTEXT.md to the artifacts list:

```
- .planning/modulo/CONTEXT.md — Context anchor (DNA identity + state)
```

**Step 3: Commit**

```bash
git add commands/start-design.md
git commit -m "feat(start-design): generate initial CONTEXT.md after DNA creation"
```

---

### Task 7: Update Plan Sections to Update CONTEXT.md

**Files:**
- Modify: `commands/plan-sections.md`

**Step 1: Add CONTEXT.md update after Step 6**

After "Step 6: Update STATE.md" (around line 305), add:

```markdown
### Step 7: Update CONTEXT.md

Update `.planning/modulo/CONTEXT.md` with the full section table, beat sequence, wow moments, tensions, and wave map:

1. Read the current CONTEXT.md (created by start-design)
2. Update the "Emotional Arc & Creative Systems" section with:
   - Final validated beat sequence (with transition techniques)
   - Tension assignments (section → technique)
   - Wow moment assignments (section → type)
3. Add the full "Build State" table with all sections, waves, beats, and statuses (all PENDING)
4. Update "Next Instructions" to: `Run /modulo:execute to start wave-based implementation.`
5. Write the updated CONTEXT.md
```

**Step 2: Commit**

```bash
git add commands/plan-sections.md
git commit -m "feat(plan-sections): update CONTEXT.md with beat sequence, section table, wave map"
```

---

### Task 8: Update Verify Command to Use CONTEXT.md

**Files:**
- Modify: `commands/verify.md`

**Step 1: Update Prerequisites section**

Replace the current "Prerequisites" file read list with:

```markdown
## Prerequisites

Read these files first:
- `.planning/modulo/CONTEXT.md` — **PRIMARY**: DNA identity, build state, emotional arc, all in one file
- `.planning/modulo/DESIGN-DNA.md` — **FULL READ for verification** (verifier needs complete DNA, not just anchor)
- `.planning/modulo/MASTER-PLAN.md` — what was planned
- `.planning/modulo/BRAINSTORM.md` — chosen creative direction and archetype
- All section PLAN.md files — with `must_haves` in frontmatter
- `.planning/modulo/REFERENCES.md` — reference quality bar for comparison (if exists)
- `.planning/modulo/CONTENT.md` — approved copy for content verification (if exists)
- `.planning/modulo/PAGE-CONSISTENCY.md` — cross-page coherence rules (if exists)

Note: The quality-reviewer agent uses full DESIGN-DNA.md (not CONTEXT.md anchor) because verification requires complete detail, not compressed context. CONTEXT.md provides quick orientation to the project state.
```

**Step 2: Commit**

```bash
git add commands/verify.md
git commit -m "feat(verify): add CONTEXT.md as primary context source for orientation"
```

---

### Task 9: Update Iterate Command to Use CONTEXT.md

**Files:**
- Modify: `commands/iterate.md`

**Step 1: Update the file read list in Step 1**

Replace the current "Read Verification Report & State" file list with:

```markdown
### Step 1: Read Context & Verification Report

Read these files to understand what needs fixing:
- `.planning/modulo/CONTEXT.md` — **PRIMARY**: current state, DNA identity, build progress in one file
- `.planning/modulo/sections/*/GAP-FIX.md` — gap fix plans from `/modulo:verify` (if they exist)
- `.planning/modulo/MASTER-PLAN.md` — wave map and dependencies
- `.planning/modulo/BRAINSTORM.md` — chosen creative direction
- `.planning/modulo/PROJECT.md` — original requirements

If CONTEXT.md doesn't exist, fall back to reading STATE.md + DESIGN-DNA.md separately.
If neither exists, tell the user: "No existing Modulo project found. Run `/modulo:start-design` first."
```

**Step 2: Commit**

```bash
git add commands/iterate.md
git commit -m "feat(iterate): use CONTEXT.md as primary context source"
```

---

### Task 10: Update CLAUDE.md with Context Rot Prevention Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add Context Management section to CLAUDE.md**

After the "Core Workflow" section, add:

```markdown
## Context Rot Prevention (v6.1.0)

Six-layer defense system to maintain award-winning quality through extended build sessions:

| Layer | Mechanism | Context Cost |
|-------|-----------|-------------|
| **L0** | Pre-commit DNA compliance hook | Zero (shell script) |
| **L1** | CONTEXT.md — single source of truth | Low (~50 lines) |
| **L2** | Pre-extracted spawn prompts | Amortized across builders |
| **L3** | Canary checks after each wave | Minimal (5 self-test questions) |
| **L4** | 2-wave session boundaries | Zero (policy) |
| **L5** | Baked-in rules in agent files | Zero (already in prompt) |

**Key files:**
- `.planning/modulo/CONTEXT.md` — Rewritten after every wave. Contains DNA anchor, build state, arc position, next instructions. Replaces `.continue-here.md` and `.session-transfer.md`.
- `.claude-plugin/hooks/dna-compliance-check.sh` — Greps for anti-slop violations before commits.

**Session management:** Design-lead suggests new session every 2 waves. Canary checks detect context rot. Turn 31+ = mandatory session save.

**Builder optimization:** Section builders read exactly 1 file (PLAN.md). All other context is pre-extracted by design-lead into spawn prompts.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE.md): add Context Rot Prevention system documentation"
```

---

## Execution Order & Dependencies

```
Task 1 (hook script) ─┐
                       ├── Task 2 (plugin.json) ── no deps after 1
Task 3 (section-builder) ── independent
Task 4 (design-lead) ── independent
Task 5 (execute.md) ── depends on Task 4 concepts
Task 6 (start-design.md) ── independent
Task 7 (plan-sections.md) ── independent
Task 8 (verify.md) ── independent
Task 9 (iterate.md) ── independent
Task 10 (CLAUDE.md) ── last (documents everything)
```

**Parallelizable groups:**
- Group A: Tasks 1+2 (hooks — sequential)
- Group B: Tasks 3, 4 (agents — parallel)
- Group C: Tasks 5, 6, 7, 8, 9 (commands — parallel, after Group B)
- Group D: Task 10 (docs — after all others)
