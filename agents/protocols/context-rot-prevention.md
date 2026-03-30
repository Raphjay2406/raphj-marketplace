# Context Rot Prevention Protocol

> Protocol document for the Genorah 2.0 build pipeline. Referenced by the build-orchestrator and all pipeline agents. Defines the 9-layer structural defense system against LLM attention degradation over extended build sessions.

## The Problem

Context rot is the single biggest threat to output quality in multi-wave builds. As conversation length grows, transformer attention on early instructions degrades -- the LLM "forgets" DNA tokens, defaults to generic patterns (Inter, blue-500, rounded-lg), and produces output indistinguishable from a template. This is a fundamental property of transformer attention, not a fixable bug.

**v6.1.0 approach:** Advisory measures ("remember to check DNA"). Result: by wave 3-4, output drifts to generic.

**v2.0 approach:** Structural prevention. 9 layers (3 hook-based + 6 runtime), each with real consequences, each with measured context cost. Prevention is enforced, not suggested.

---

## 9-Layer Defense System

### Layer 0a: SessionStart Hook Injection (Zero-Cost Context Refresh)

| Property | Value |
|----------|-------|
| **Mechanism** | SessionStart hook fires when a new Claude Code session begins, injecting project context automatically |
| **Context cost** | ZERO at decision time -- hook runs before the agent's first turn |
| **Consequence** | Agent starts every session with fresh orientation, eliminating "cold start" context rot |

**How it works:**
1. SessionStart hook detects project type (presence of `.planning/genorah/` directory)
2. Hook reads CONTEXT.md and injects a compact summary into the system prompt
3. Agent receives DNA anchor tokens, current build state, and next wave instructions before its first turn
4. No file reads required by the agent -- context is pre-loaded by the hook

**Why this is Layer 0a:** It fires before any agent action, making it the earliest possible defense. The agent cannot "forget" to read CONTEXT.md because the hook does it automatically.

---

### Layer 0b: PreToolUse Skill Injection (Smart Skill Matching)

| Property | Value |
|----------|-------|
| **Mechanism** | PreToolUse hook intercepts tool calls and injects relevant skill knowledge based on pattern matching |
| **Context cost** | MINIMAL -- only matched skills are injected, not all skills |
| **Consequence** | Agents receive domain knowledge exactly when they need it, without reading skill files |

**How it works:**
1. PreToolUse hook intercepts Write/Edit tool calls
2. Pattern matcher analyzes the file being written/edited (file name, content patterns, imports)
3. Matching skills are injected into the agent's context for that specific tool call
4. Agent receives relevant domain rules (e.g., animation best practices when writing animation code) without explicitly loading the skill

**Why this is Layer 0b:** It provides just-in-time skill knowledge during the build, preventing the scenario where a builder "should have read the animation skill" but did not. The hook system makes skill loading automatic.

---

### Layer 0c: UserPromptSubmit Routing (Stale Command Prevention)

| Property | Value |
|----------|-------|
| **Mechanism** | UserPromptSubmit hook validates and routes user commands, preventing execution of stale or invalid commands |
| **Context cost** | ZERO -- routing logic runs outside the agent's context window |
| **Consequence** | Users cannot accidentally invoke commands that contradict current build state |

**How it works:**
1. UserPromptSubmit hook intercepts slash commands (e.g., `/modulo:execute`, `/modulo:iterate`)
2. Hook validates command against current build state (read from STATE.md or CONTEXT.md)
3. If command is inappropriate for current state (e.g., `/modulo:execute` when no plan exists), hook injects a redirect suggestion
4. Prevents the agent from attempting to execute a command with stale or missing prerequisites

**Why this is Layer 0c:** It prevents context rot at the input level -- before the agent even begins processing a user request, the hook ensures the request is valid for the current project state.

---

### Layer 0: Pre-Commit DNA Compliance Hook

| Property | Value |
|----------|-------|
| **Mechanism** | Shell script runs OUTSIDE context window via PreToolUse hook on Bash tool |
| **Location** | `.claude-plugin/hooks/dna-compliance-check.sh` |
| **Context cost** | ZERO -- shell script, not in LLM context |
| **Consequence** | Commit REJECTED. Hard block, no override |

**What it checks (greps committed files for):**

| Violation | Pattern | Why It Matters |
|-----------|---------|----------------|
| Raw hex values not in DNA | `#[0-9a-fA-F]{3,8}` not matching DNA palette | Indicates builder invented a color instead of using DNA tokens |
| Tailwind default classes | `rounded-lg`, `shadow-md`, `text-blue-500`, `gap-4`, `text-gray-*` | Default Tailwind = generic output. DNA defines custom scale |
| System fonts | `Inter`, `Arial`, `Helvetica`, `sans-serif`, `serif` (bare) | DNA specifies exact font stack. System fonts = identity loss |
| Banned micro-copy | `Click here`, `Learn more`, `Submit`, `Read more` | Generic CTAs penalized by anti-slop gate |

**Exclusions:**
- Files in `node_modules/`, `.next/`, `dist/`, `.planning/`
- CSS reset files, config files (tailwind.config.*, postcss.config.*)
- Files matching `.gitignore` patterns

**How it works:**
1. PreToolUse hook intercepts `git commit` commands
2. Shell script extracts staged file list
3. Greps each staged file against violation patterns
4. If ANY violation found: prints specific file + line + violation, returns non-zero exit
5. Commit is blocked. Builder sees the violation and must fix before committing

---

### Layer 1: CONTEXT.md Anchoring

| Property | Value |
|----------|-------|
| **Mechanism** | Single source of truth file, rewritten after every wave |
| **Location** | `.planning/genorah/CONTEXT.md` |
| **Target size** | 80-100 lines |
| **Context cost** | LOW (~500 tokens when read by orchestrator) |
| **Consequence** | Stale CONTEXT.md = stale spawn prompts = drifted output |

**Purpose:** Provides quick orientation for any agent returning to the project, especially the orchestrator after a session break. Contains enough information to construct accurate spawn prompts without reading any other files.

#### CONTEXT.md Format

```markdown
# Genorah Context
Last updated: [ISO date] | Wave: [N] completed | Session: [N]

## DNA Identity
<!-- Orchestrator writes. Static after Phase 1 unless user changes DNA -->
Archetype: [name]
Display: [font] | Body: [font] | Mono: [font]
Colors: bg [hex] | surface [hex] | text [hex] | border [hex] | primary [hex] | secondary [hex] | accent [hex] | muted [hex]
Expressive: glow [hex] | tension [hex] | highlight [hex] | signature [hex]
Spacing: xs=[val] sm=[val] md=[val] lg=[val] xl=[val]
Radius: [system description, 1 line]
Shadows: [system description, 1 line]
Motion: easing=[values] | stagger=[ms] | enter=[directions per beat]
FORBIDDEN: [pattern list, 1 line]
Signature: [element: param=value, 1 line]

## Build State
<!-- Orchestrator writes after each wave -->
| Section | Wave | Status | Beat | Layout | Background |
|---------|------|--------|------|--------|------------|
| [compact row per section -- ALL sections, not just completed] |

Layout patterns used: [list]
Background progression: [sequence]

## Creative Direction Notes
<!-- Creative Director writes after each wave review -->
Overall: [1-line assessment]
Strengths: [what's working]
Drift: [what's drifting from archetype/DNA]
Push: [opportunities to be bolder]
Calibration: [tension/wow adjustments for next wave]

## Emotional Arc Position
<!-- Orchestrator writes -->
Completed: [beat sequence list]
Current: [what's being built now]
Upcoming: [next beats]

## Feedback Loop
<!-- Orchestrator aggregates from quality reviewer -->
REPLICATE: [patterns that scored well in anti-slop gate]
AVOID: [patterns that lost points]
DESIGN-SYSTEM: [shared components added this wave]

## Next Wave Instructions
<!-- Orchestrator writes -->
Wave [N+1]: [section names]
Plans: [PLAN.md paths, comma-separated]
Session: [continue | recommend new session]
Canary: [last score, e.g., HEALTHY 5/5]
First action: [specific next step]
```

#### Ownership Rules

| Section | Owner | When Updated |
|---------|-------|--------------|
| DNA Identity | Orchestrator | Once after Phase 1; only if user changes DNA |
| Build State | Orchestrator | After every wave |
| Creative Direction Notes | Creative Director | After every wave review |
| Emotional Arc Position | Orchestrator | After every wave |
| Feedback Loop | Orchestrator | After every wave (aggregated from QR reports) |
| Next Wave Instructions | Orchestrator | After every wave |

#### Rewrite Protocol

CONTEXT.md is **FULL REWRITTEN** after every wave. Never appended.

- Creative Direction Notes: trimmed to last wave's observations only (older notes are superseded)
- Build State: includes ALL sections in compact format (status changes, not logs)
- Feedback Loop: rolling window of last 2 waves' lessons (older lessons presumably absorbed)
- If file exceeds 100 lines: compress -- abbreviate section statuses to single characters (C=complete, P=in-progress, Q=queued), trim older feedback, summarize rather than list

---

### Layer 2: Pre-Extracted Spawn Prompts

| Property | Value |
|----------|-------|
| **Mechanism** | Orchestrator pre-extracts ALL context into each builder's spawn prompt |
| **Budget** | ~150 lines spawn prompt + ~200 lines PLAN.md = ~350 lines total |
| **Context cost** | AMORTIZED -- extraction cost paid once by orchestrator, each builder starts clean |
| **Consequence** | Builders get fresh context windows with exactly what they need |

**What gets pre-extracted into the spawn prompt:**

| Section | Lines | Content |
|---------|-------|---------|
| Full DNA Identity | ~40 | Archetype, fonts, ALL 12 colors with hex, spacing scale, radius, shadows, motion tokens, FORBIDDEN list, signature element |
| Section Assignment | ~15 | Beat type, wave number, wow moment, creative tension, transition techniques |
| Beat Parameters | ~8 | Height, density, animation intensity, whitespace ratio, type scale, layout complexity (HARD constraints) |
| Adjacent Sections | ~15 | Above: name/beat/layout/background/spacing. Below: name/beat/planned layout. Continuity rules |
| Layout Patterns Used | ~5 | All patterns from completed sections (builder must pick different) |
| Shared Components | ~5 | Available imports from Wave 0/1 with paths |
| Content | ~30 | Headlines, body, CTAs, testimonials, stats for THIS section only |
| Quality Rules | ~15 | Anti-slop quick check (5 items), performance rules, micro-copy rules, DNA compliance checklist |
| Lessons Learned | ~10 | Reviewer feedback from previous waves: replicate/avoid patterns |

**Key insight:** The extraction cost is paid ONCE by the orchestrator reading PLAN.md files and CONTEXT.md. Each builder's context window starts completely clean -- no conversation history, no stale context, no accumulated drift. This is the most powerful layer because it makes context rot in builders structurally impossible.

---

### Layer 3: Canary Checks

| Property | Value |
|----------|-------|
| **Mechanism** | 5 questions answered from memory after every wave, verified against CONTEXT.md |
| **Protocol** | See `agents/protocols/canary-check.md` for full specification |
| **Context cost** | MINIMAL (~50 tokens per check) |
| **Consequence** | Score 0-2 triggers mandatory session boundary |

**Integration point:** Build-orchestrator runs canary check as Step 9 in the wave execution protocol (after coherence checkpoint, before next wave prep).

The canary check is NOT a separate agent -- it is a protocol the orchestrator follows. See `canary-check.md` for the full procedure, questions, scoring, and consequences.

---

### Layer 4: Session Boundaries

| Property | Value |
|----------|-------|
| **Mechanism** | Policy-based session management with three trigger types |
| **Context cost** | ZERO -- policy rules, not runtime computation |
| **Consequence** | Forces CONTEXT.md save and optionally ends session |

#### Three Trigger Types

**Soft Boundary (every 2 waves):**
- Orchestrator force-writes CONTEXT.md with complete state
- Message to user: "Two waves completed. Consider starting a new session for optimal quality. Build can continue if you prefer."
- Build CAN continue if user chooses
- Canary check still runs regardless of user choice

**Hard Boundary (turn 31+):**
- Mandatory session save
- Orchestrator writes CONTEXT.md with explicit resume instructions
- Message to user: "Session boundary reached. Start a new session and run `/gen:execute` to continue."
- Turn count tracked by orchestrator (increment on each tool use cycle)
- No override -- this is a structural limit, not a suggestion

**Canary-Triggered Boundary (score 0-2):**
- If canary check scores 0-2/5: treat as hard boundary regardless of wave count or turn count
- Orchestrator writes CONTEXT.md with resume instructions + canary failure note
- Message to user: "Context rot detected ([score]/5). Strongly recommend starting a new session."
- User CAN override but the warning is explicit and repeated

#### Resume Protocol

When a new session begins (after any boundary type):
1. Read `.planning/genorah/CONTEXT.md` -- full project state in ~80-100 lines
2. Read `.planning/genorah/MASTER-PLAN.md` -- find next wave from Next Wave Instructions
3. Continue from the wave indicated in Next Wave Instructions
4. First action: run a canary check to verify the new session has clean context

---

### Layer 5: Baked-In Rules in Agent Files

| Property | Value |
|----------|-------|
| **Mechanism** | Critical rules embedded directly in agent markdown system prompts |
| **Context cost** | ZERO at runtime -- rules are part of the system prompt, present from first token |
| **Consequence** | Rules are always available, never forgotten, never need file reads |

**What gets baked in (by agent):**

| Agent | Baked-In Rules | Lines |
|-------|---------------|-------|
| section-builder | Beat parameter table (all 10 types), anti-slop quick check (5 items), DNA compliance checklist, micro-copy banned words | ~60 |
| quality-reviewer | Full anti-slop gate scoring (35 items, 7 categories), penalty list, scoring tiers | ~80 |
| creative-director | 8 creative dimension checklist, archetype personality markers, creative tension types | ~40 |
| section-planner | Beat sequence validation rules (10 rules), layout diversity rules, background progression rules | ~50 |
| build-orchestrator | Spawn prompt template, CONTEXT.md template, coherence checkpoint checklist, canary protocol | ~100 |

**Tradeoff:** Agent files are longer (~300-550 lines) but rules are always available. The alternative -- "read skill X at runtime" -- costs 200-500 tokens per skill read AND risks the agent skipping the read under context pressure.

**Principle:** If a rule is needed EVERY time an agent runs, embed it. If a rule is needed OCCASIONALLY, reference the skill file.

---

## Warning Signs of Context Rot

Observable indicators that canary checks, reviewers, or the orchestrator should watch for. Each sign indicates a specific type of drift.

### Identity Drift (DNA forgotten)

| Warning Sign | What It Means | Severity |
|-------------|---------------|----------|
| Stray hex values in code (not from DNA palette) | Builder invented a color | HIGH |
| Tailwind defaults: `shadow-md`, `rounded-lg`, `gap-4`, `text-gray-500` | Builder using Tailwind defaults instead of DNA scale | HIGH |
| System font names: Inter, Arial, Helvetica, sans-serif | Builder forgot DNA font stack | HIGH |
| Signature element missing from sections | Builder forgot the project's signature visual | MEDIUM |
| Archetype forbidden patterns appearing | Builder forgot archetype constraints | HIGH |

### State Drift (context forgotten)

| Warning Sign | What It Means | Severity |
|-------------|---------------|----------|
| Canary check failures (2+ wrong answers) | Orchestrator losing recall | HIGH |
| Beat parameters not matching constraints (e.g., BREATHE with <50% whitespace) | Builder ignoring beat rules | HIGH |
| Adjacent sections with same layout pattern | Spawn prompt missing "patterns used" list | MEDIUM |
| Adjacent sections with same background color | Background progression ignored | MEDIUM |
| All sections using centered layouts | Compositional flatness -- diversity rules forgotten | MEDIUM |

### Creative Drift (quality degrading)

| Warning Sign | What It Means | Severity |
|-------------|---------------|----------|
| Animations all being fade-in-up | Motion monotony -- motion tokens ignored | MEDIUM |
| Generic copy despite CONTENT.md having specific text | Content extraction failed or was ignored | MEDIUM |
| No section makes you want to screenshot it | Creative courage declining | HIGH |
| Creative tension absent from PEAK beats | Builder forgot tension mandate | HIGH |
| All typography at uniform scale | Type drama missing | MEDIUM |

---

## When Rot Is Detected

Upon detecting any warning signs (via canary check, quality review, or CD review):

### Step 1: Flag with Evidence

Document the specific drift:
- **What drifted:** exact element (color, font, layout, beat parameter, etc.)
- **How it drifted:** expected value vs. actual value
- **Where:** file path and line number
- **Which layer failed:** which prevention layer should have caught this

### Step 2: Present Options to User

The orchestrator presents the drift to the user with three options:

| Option | When Appropriate | Action |
|--------|-----------------|--------|
| **Fix in-place** | Minor drift, 1-2 elements | Polisher agent fixes the specific files |
| **Rebuild section** | Significant drift, section is below quality bar | Spawn a new builder with clean context |
| **Continue anyway** | Drift is cosmetic and user accepts the trade-off | Add observation to CONTEXT.md feedback loop |

### Step 3: Record in CONTEXT.md

Regardless of user choice:
- Add drift observation to Feedback Loop AVOID list
- If canary failed: log score in Next Wave Instructions
- If pattern is recurring: escalate severity in next canary check

### Step 4: Evaluate Session State

- If canary score 0-2: recommend session boundary (hard recommend, user can override)
- If 2+ sections show same drift: recommend session boundary
- If user has overridden boundary recommendation twice: flag clearly that quality risk is accumulating

---

## Layer Interaction Summary

The 9 layers work together as defense-in-depth. No single layer is sufficient alone.

```
Layer 0a (SessionStart Hook)  -- injects context AT SESSION START (zero-cost refresh)
  |
Layer 0b (PreToolUse Skills)  -- injects skills AT TOOL CALL TIME (just-in-time knowledge)
  |
Layer 0c (UserPromptSubmit)   -- validates commands AT INPUT TIME (stale command prevention)
  |
Layer 0 (Pre-Commit Hook)     -- catches violations AT COMMIT TIME (hard block)
  |
Layer 1 (CONTEXT.md)          -- provides orientation AT SESSION START (quick reference)
  |
Layer 2 (Spawn Prompts)       -- gives builders FRESH CONTEXT (zero accumulated drift)
  |
Layer 3 (Canary Checks)       -- detects drift AFTER EACH WAVE (measurement)
  |
Layer 4 (Session Boundaries)  -- forces CONTEXT SAVE periodically (durability)
  |
Layer 5 (Baked-In Rules)      -- ensures CONSTANT AVAILABILITY of critical rules (always present)
```

**If Layer 0 catches something:** A builder produced non-compliant code. Fix before commit.
**If Layer 3 catches something:** The orchestrator is drifting. Re-read CONTEXT.md or start new session.
**If Layer 5 is working:** Builders never need to read skill files -- rules are always in their prompt.

The system is designed so that even if one layer fails, others catch the problem. The only scenario all layers fail is if CONTEXT.md itself is wrong -- which is why CONTEXT.md is rewritten from source files, not from memory.
