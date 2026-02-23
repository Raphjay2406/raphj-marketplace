# Architecture Patterns: Modulo 2.0 Premium Frontend Design Plugin

**Domain:** Claude Code plugin for premium frontend design (markdown-only, no application code)
**Researched:** 2026-02-23
**Confidence:** HIGH (based on deep analysis of v6.1 codebase + Claude Code plugin format knowledge)

---

## Recommended Architecture

### High-Level Overview

Modulo 2.0 is a **pipeline-orchestrated, markdown-only plugin** that produces award-caliber frontend designs through staged agent collaboration. The architecture has five layers:

```
                    USER
                      |
              [6 Slash Commands]        <-- Entry points
                      |
              [Pipeline Router]         <-- Determines which pipeline stage(s) to activate
                      |
    +---------+-------+--------+-----------+
    |         |       |        |           |
[Research] [Design] [Build] [Review] [Polish]   <-- Pipeline stages (agents)
    |         |       |        |           |
    +----+----+-------+--------+-----------+
         |
   [Skill Library]                      <-- Knowledge bases (tiered loading)
         |
   [Quality Gates]                      <-- Multi-layer enforcement
         |
   [Artifact Store]                     <-- .planning/modulo/ in target project
```

### Architecture Principle: Pipeline, Not Hub-and-Spoke

**v6.1 problem:** The design-lead agent acts as a hub -- it reads everything, spawns builders, and coordinates quality. This creates a single-point context bottleneck: design-lead must hold the full project context in its window, and it degrades over long sessions.

**v2.0 solution:** A **pipeline architecture** where work flows through specialized stages. Each stage receives a defined input contract, does its work, and produces a defined output contract. No single agent needs the full picture.

```
v6.1 (Hub-and-Spoke):          v2.0 (Pipeline):

    design-lead                  Research → Design → Build → Review → Polish
   /    |    \                      ↓         ↓        ↓        ↓         ↓
builder builder builder          artifacts  artifacts  code   report    fixes
```

---

## Component Boundaries

### Layer 1: Commands (User Interface)

6 commands replace 13. Each command maps to one or more pipeline stages.

| Command | Pipeline Stages Activated | Input | Output |
|---------|--------------------------|-------|--------|
| `/modulo:start-project` | Research + Design | User description/requirements | PROJECT.md, DESIGN-DNA.md, BRAINSTORM.md, CONTENT.md |
| `/modulo:lets-discuss` | Design (interactive) | Phase context + user conversation | Updated plans, creative decisions |
| `/modulo:plan-dev` | Research (phase-scoped) + Design | Phase sector, DNA | MASTER-PLAN.md, PLAN.md files |
| `/modulo:execute` | Build (orchestrated) | PLAN.md files, DNA | Built components, STATE.md |
| `/modulo:iterate` | Design + Build + Review | User feedback / GAP-FIX.md | Updated components |
| `/modulo:bug-fix` | Review + Build | Bug description / screenshot | Fixed components |

**Boundary rule:** Commands parse user intent and dispatch to pipeline stages. Commands contain NO domain logic -- they are routing and state-checking only.

**Recommended command file structure:**
```
commands/
  start-project.md     -- Discovery → Research → Archetype → DNA → Content
  lets-discuss.md      -- Interactive creative deep-dive per phase
  plan-dev.md          -- Phase-scoped research + section planning
  execute.md           -- Wave-based parallel build execution
  iterate.md           -- Design changes with verification
  bug-fix.md           -- Diagnosis → fix → verify cycle
```

### Layer 2: Agents (Pipeline Stages)

Each agent has a single, well-defined responsibility. Agents are organized by pipeline function, not by domain.

#### Core Pipeline Agents

| Agent | Role | Reads | Produces | Context Budget |
|-------|------|-------|----------|----------------|
| **researcher** | Gathers design intelligence | PROJECT.md, reference URLs | Research reports per track | LOW (parallel, disposable) |
| **creative-director** | Owns creative vision, proposes bold directions | PROJECT.md, research, BRAINSTORM.md | BRAINSTORM.md, DESIGN-DNA.md, CONTENT.md | MEDIUM (needs project context) |
| **section-planner** | Creates detailed build specifications | DNA, research, content | PLAN.md per section, MASTER-PLAN.md | MEDIUM (needs DNA + content) |
| **build-orchestrator** | Manages wave execution, spawns builders | STATE.md, CONTEXT.md, MASTER-PLAN.md | Updated STATE.md, spawned builders | LOW (coordinator only) |
| **section-builder** | Builds a single section from PLAN.md | PLAN.md + spawn prompt context | Built code + SUMMARY.md | LOW (pre-extracted context) |
| **quality-reviewer** | Goal-backward verification + scoring | All artifacts + built code | Verification report, GAP-FIX.md | HIGH (needs everything) |
| **polisher** | Applies targeted fixes from review | GAP-FIX.md + specific code | Fixed code | LOW (scoped fixes) |

#### Specialist Agents (Extend Pipeline)

| Agent | Specialization | When Activated | Integration Point |
|-------|---------------|----------------|-------------------|
| **3d-specialist** | Three.js, Spline, WebGL | PLAN.md specifies 3D content | Spawned by build-orchestrator for 3D sections |
| **animation-specialist** | GSAP, Framer Motion, scroll | PLAN.md specifies complex animation | Spawned by build-orchestrator for animation-heavy sections |
| **layout-specialist** | Grid systems, responsive, bento | Default for all section builds | Core section-builder role |
| **content-specialist** | Brand voice, copy, micro-copy | Content generation/review | Spawned by creative-director |

**Boundary rule:** Specialists are sub-types of section-builder. They share the same input/output contract (PLAN.md in, built code + SUMMARY.md out) but have domain-specific knowledge embedded.

#### Protocol Agents (Cross-Cutting)

| Agent | Role | When Active |
|-------|------|-------------|
| **discussion-protocol** | Enforces human-in-the-loop for code changes | All code-modifying commands |
| **visual-auditor-live** | Browser-based visual testing | When Chrome/Playwright available |

**Recommended agent file structure:**
```
agents/
  pipeline/
    researcher.md              -- Parallel research tracks
    creative-director.md       -- Creative vision owner
    section-planner.md         -- Build spec generation
    build-orchestrator.md      -- Wave execution coordinator
    section-builder.md         -- Single section builder
    quality-reviewer.md        -- Goal-backward verification
    polisher.md                -- Targeted gap fixes
  specialists/
    3d-specialist.md           -- Three.js / Spline / WebGL
    animation-specialist.md    -- GSAP / Framer Motion / scroll
    content-specialist.md      -- Brand voice / copy
  protocols/
    discussion-protocol.md     -- Human-in-the-loop enforcement
    visual-auditor-live.md     -- Live browser testing
    canary-check.md            -- Context rot detection
```

### Layer 3: Skills (Knowledge Library)

Skills are passive knowledge documents. They are NOT invoked -- agents reference them when needed. The critical design change for v2.0 is **tiered loading** and a **4-layer skill structure**.

#### Tiered Organization

**Tier 1: Core (Always loaded via CLAUDE.md reference)**
Skills whose knowledge is needed in virtually every session. Embedded as rules in agent files or CLAUDE.md.

| Skill | Why Core | Integration Method |
|-------|----------|-------------------|
| anti-slop-design | Foundational quality bar | Rules embedded in builder + reviewer agents |
| design-dna | Identity system format | Format embedded in creative-director agent |
| design-archetypes | Archetype definitions | Referenced by creative-director only |
| quality-standards | Quality tiers and indicators | Rules embedded in reviewer agent |
| plan-format | PLAN.md/SUMMARY.md format | Format embedded in planner + builder agents |

**Tier 2: Domain (Loaded per project type)**
Skills activated based on the project's archetype, framework, and features.

| Skill | Activation Trigger |
|-------|-------------------|
| emotional-arc | Always (page narrative) |
| creative-tension | Always (anti-boring) |
| cinematic-motion | Always (motion language) |
| wow-moments | Always (signature interactions) |
| design-system-scaffold | Wave 0 only |
| nextjs-app-router | Next.js projects |
| astro-patterns | Astro projects |
| framer-motion | When DNA motion uses Framer |
| gsap-animations | When DNA motion uses GSAP |
| three-js-webgl | When sections have 3D content |
| shadcn-components | When using shadcn/ui |

**Tier 3: Utility (On-demand reference)**
Skills loaded only when a specific task requires them.

| Skill | When Referenced |
|-------|---------------|
| accessibility-patterns | A11y review |
| responsive-layout | Responsive issues |
| conversion-patterns | CTA/conversion sections |
| micro-copy | Copy review/generation |
| performance-patterns | Performance optimization |
| seo-meta | SEO audit |
| form-builder | Form sections |
| chart-data-viz | Dashboard sections |
| navigation-patterns | Nav implementation |

**Tier 4: Cull (Remove from v2.0)**
Skills that are not frontend design or are too niche.

| Skill | Reason for Removal |
|-------|-------------------|
| admin-panel | Backend UI, not design |
| database-crud-ui | Backend concern |
| webhook-api-patterns | Not design |
| state-management | App logic, not design |
| data-fetching | App logic, not design |
| multi-tenant-ui | Niche concern |
| real-time-ui | Niche concern |
| collaboration-realtime | Niche concern |

#### 4-Layer Skill Structure

Every skill document should follow this structure:

```markdown
# [Skill Name]

## 1. Decision Guidance (When/Why)
When to use this technique, what problems it solves,
how to choose between alternatives.

## 2. Award-Winning Examples
Real-world examples from Awwwards, Dribbble, etc.
What makes them excellent. Specific URLs.

## 3. Integration Context (DNA/Archetype Connection)
How this technique connects to Design DNA tokens.
Which archetypes it pairs with. Which it conflicts with.
Exact Tailwind classes using DNA variables.

## 4. Anti-Patterns
What NOT to do. Common mistakes. What makes it generic.
```

**Context window budget:** Each skill should be under 300 lines. The 4-layer structure ensures agents get actionable guidance, not just code dumps.

**Recommended skill file structure:**
```
skills/
  core/
    anti-slop-design/SKILL.md
    design-dna/SKILL.md
    design-archetypes/SKILL.md
    quality-standards/SKILL.md
    plan-format/SKILL.md
  design/
    emotional-arc/SKILL.md
    creative-tension/SKILL.md
    cinematic-motion/SKILL.md
    wow-moments/SKILL.md
    premium-typography/SKILL.md
    premium-dark-ui/SKILL.md
    light-mode-patterns/SKILL.md
    geometry-shapes/SKILL.md
    glow-neon-effects/SKILL.md
  animation/
    framer-motion/SKILL.md
    gsap-animations/SKILL.md
    css-animations/SKILL.md
    three-js-webgl/SKILL.md
  framework/
    nextjs-app-router/SKILL.md
    astro-patterns/SKILL.md
    tailwind-patterns/SKILL.md
    shadcn-components/SKILL.md
    design-system-scaffold/SKILL.md
  content/
    micro-copy/SKILL.md
    conversion-patterns/SKILL.md
    landing-page/SKILL.md
    portfolio-patterns/SKILL.md
    ecommerce-ui/SKILL.md
    blog-patterns/SKILL.md
  ux/
    ux-patterns/SKILL.md
    accessibility-patterns/SKILL.md
    responsive-layout/SKILL.md
    navigation-patterns/SKILL.md
    mobile-patterns/SKILL.md
    form-builder/SKILL.md
    error-states-ui/SKILL.md
    skeleton-loading/SKILL.md
  utility/
    image-asset-pipeline/SKILL.md
    performance-patterns/SKILL.md
    seo-meta/SKILL.md
    testing-patterns/SKILL.md
    chart-data-viz/SKILL.md
    [remaining utility skills]
```

### Layer 4: Quality Gates (Multi-Layer Enforcement)

Quality enforcement is the most critical architectural component. v6.1's single verify-at-end approach catches problems too late. v2.0 uses 4 progressive gates.

```
Build-Time Gate              Post-Wave Gate              End-of-Phase Gate           User Gate
(L0: Pre-commit hook)   →   (L1: Creative audit)    →   (L2: Full verification) →   (L3: Checkpoints)
     ↓                           ↓                           ↓                          ↓
Hard block on:               Score and flag:              Pass/fail with:            Strategic:
- Wrong colors               - Tension moments            - 35-point anti-slop       - Before each wave
- Wrong fonts                 - Emotional arc             - 4-axis Awwwards          - After each section
- Forbidden patterns          - Wow factor                - Gap-closure plan         - Before advancing
- Generic copy                - DNA compliance drift      - Reference comparison
                              + specific fixes
```

| Gate | When | Severity | Mechanism | Context Cost |
|------|------|----------|-----------|-------------|
| **L0: Build-time** | Pre-commit hook | Critical = block, minor = queue | Shell script (dna-compliance-check.sh) | Zero |
| **L1: Post-wave audit** | After each wave completes | Score + specific fixes | Creative-director agent reviews wave output | Low (scoped to wave) |
| **L2: Full verification** | End of execution phase | Pass/fail + GAP-FIX plans | Quality-reviewer agent | High (reads everything) |
| **L3: User checkpoints** | Strategic points | User judgment | Discussion protocol | Zero (user decides) |

**Severity-based enforcement (new in v2.0):**
```
CRITICAL violations → Hard block. Cannot commit. Must fix immediately.
  - Wrong color hex outside DNA palette
  - Wrong font family
  - Archetype forbidden pattern used
  - Missing prefers-reduced-motion

MAJOR violations → Queued for batch fix. Build continues.
  - Shadow not using DNA system
  - Spacing not following DNA scale
  - Missing hover state

MINOR violations → Logged for polish phase. No interruption.
  - Suboptimal contrast ratio (AA compliant but not AAA)
  - Could use better variable naming
```

### Layer 5: Artifact Store (Project State)

All state lives in `.planning/modulo/` in the target project. The artifact graph has clear ownership and dependencies.

```
.planning/modulo/
  PROJECT.md              ← [start-project: discovery output]
  BRAINSTORM.md           ← [start-project: archetype + creative direction]
  DESIGN-DNA.md           ← [start-project: locked visual identity]
  CONTENT.md              ← [start-project: approved copy]
  REFERENCES.md           ← [start-project: reference site analysis]
  CONTEXT.md              ← [execute: living context anchor, rewritten per wave]
  STATE.md                ← [execute: phase/wave/section status tracker]
  MASTER-PLAN.md          ← [plan-dev: wave map + dependency graph]
  VOICE-GUIDE.md          ← [start-project: brand voice specification] (NEW)
  research/
    DESIGN-TRENDS.md      ← [researcher agent track 1]
    REFERENCE-ANALYSIS.md ← [researcher agent track 2]
    COMPONENT-LIBRARY.md  ← [researcher agent track 3]
    ANIMATION-TECHNIQUES.md ← [researcher agent track 4]
    BENCHMARK.md          ← [researcher: Awwwards competitive analysis]
    SUMMARY.md            ← [synthesized research]
    screenshots/          ← [reference site screenshots]
  sections/
    XX-name/
      PLAN.md             ← [plan-dev: build specification]
      SUMMARY.md          ← [section-builder: completion report]
      GAP-FIX.md          ← [quality-reviewer: fix tasks]
      screenshots/        ← [visual auditor: captured screenshots]
  audit/
    VISUAL-REPORT.md      ← [quality-reviewer]
    PERFORMANCE-REPORT.md ← [performance-auditor]
    AUDIT-REPORT.md       ← [synthesized audit]
    full-scroll.gif       ← [visual-auditor-live]
  progress/
    wave-N-scrollthrough.gif ← [build-orchestrator]
```

**Artifact ownership rule:** Each file has exactly ONE writer agent. Multiple agents may read, but only one writes. This prevents conflicts and makes debugging straightforward.

**Artifact lifecycle:**
```
Created once, read many:     PROJECT.md, BRAINSTORM.md, DESIGN-DNA.md, CONTENT.md, REFERENCES.md
Created once, evolved:       MASTER-PLAN.md (mutations logged)
Rewritten per wave:          CONTEXT.md, STATE.md
Created per section:         PLAN.md, SUMMARY.md, GAP-FIX.md
Created per audit:           *-REPORT.md
```

---

## Data Flow: How Context Moves Through the Pipeline

### Flow 1: Start-Project (Discovery → DNA)

```
User input
    ↓
[start-project command] ── reads user description
    ↓
Phase 1: DISCOVERY
    ↓ writes PROJECT.md
Phase 2: RESEARCH (parallel researchers)
    ↓ writes research/*.md
Phase 3: BRAINSTORM (creative-director)
    ↓ writes BRAINSTORM.md
Phase 3.5: DNA GENERATION (creative-director)
    ↓ writes DESIGN-DNA.md, CONTEXT.md
Phase 3.75: CONTENT (content-specialist)
    ↓ writes CONTENT.md
    ↓ writes STATE.md
DONE → "Run /modulo:plan-dev"
```

**Context passing:** Each phase reads the output of previous phases. No agent needs to hold all phases in memory simultaneously.

### Flow 2: Plan-Dev (Research + Planning)

```
STATE.md (phase check)
    ↓
[plan-dev command]
    ↓
Phase-scoped research (re-research for this sector)
    ↓ updates research/
Beat + tension + wow assignment (creative-director)
    ↓
Per-section PLAN.md generation (section-planner)
    ↓ writes sections/XX/PLAN.md (with user approval each)
MASTER-PLAN.md generation
    ↓ writes MASTER-PLAN.md
    ↓ updates STATE.md, CONTEXT.md
DONE → "Run /modulo:execute"
```

### Flow 3: Execute (Wave-Based Build)

```
CONTEXT.md (or STATE.md + DNA for first wave)
    ↓
[execute command] → build-orchestrator
    ↓
For each wave:
    ↓
    build-orchestrator reads MASTER-PLAN.md
    ↓
    Constructs "Complete Build Context" per section
    (pre-extracts DNA tokens, beat params, adjacent info, content)
    ↓
    Spawns section-builders (max 4 parallel) via Task tool
    Each builder receives:
      - Complete Build Context (in spawn prompt, ~100 lines)
      - Path to PLAN.md (the ONE file they read)
    ↓
    Builders produce code + SUMMARY.md
    ↓
    build-orchestrator runs:
      - Coherence checkpoint (shadow, spacing, bg, typography, layout diversity)
      - Canary check (5-question context fidelity test)
      - Updates STATE.md, rewrites CONTEXT.md
    ↓
    [Post-wave creative audit] ← creative-director reviews (NEW)
    ↓
    Session boundary check (2-wave suggestion, canary, turn count)
    ↓
Next wave or session save
```

**Critical context optimization:** Builders read exactly 1 file (PLAN.md). All other context is pre-extracted into their spawn prompt by the orchestrator. This is the key insight from v6.1 that MUST be preserved.

### Flow 4: Iterate (Feedback Loop)

```
User feedback or GAP-FIX.md
    ↓
[iterate command]
    ↓
Reads CONTEXT.md for orientation
    ↓
Determines scope (token / section / direction change)
    ↓
Creates targeted fix plans
    ↓
Discussion-first protocol (show diff, get approval)
    ↓
Applies fixes with atomic commits
    ↓
Runs targeted re-verification
```

### Flow 5: Quality Verification

```
[verify command] OR [post-wave audit]
    ↓
quality-reviewer reads:
  - DESIGN-DNA.md (full, not anchor)
  - All PLAN.md files (must_haves)
  - All built code (actual implementation)
  - CONTENT.md (copy verification)
  - REFERENCES.md (quality bar comparison)
    ↓
Level 1: Existence check (artifacts exist?)
Level 2: Substantive check (truths hold?)
Level 3: Wired check (everything connected?)
    ↓
35-point anti-slop gate scoring
    ↓
4-axis Awwwards scoring
    ↓
Reference quality comparison
    ↓
GAP-FIX.md for each section with gaps
    ↓
Overall verdict: passed / gaps_found / human_needed
```

---

## Context Rot Prevention Architecture

Context rot is the primary architectural challenge. Over extended builds, agents gradually forget project identity, produce generic output, and ignore constraints. v2.0 uses a 6-layer defense.

### Layer Stack

```
L0: Pre-commit hook (shell script)     Cost: ZERO
    - Greps for anti-slop violations before commits
    - Hard blocks critical DNA deviations
    - No context window usage at all

L1: CONTEXT.md anchor                  Cost: ~50 lines
    - Single source of truth for project identity
    - Rewritten after EVERY wave
    - Contains: DNA identity, build state, arc position, next instructions
    - Any agent can orient from this file alone

L2: Pre-extracted spawn prompts        Cost: AMORTIZED
    - Build-orchestrator pre-extracts DNA, beat, content into spawn prompts
    - Builders never read DNA directly -- context is injected
    - Eliminates context duplication across parallel builders

L3: Canary checks                      Cost: MINIMAL (5 questions)
    - After every wave: answer 5 questions from memory, verify against CONTEXT.md
    - Detects context drift before it damages output
    - Triggers session boundary on 3+ wrong answers

L4: Session boundaries                 Cost: ZERO (policy)
    - Suggest new session every 2 waves
    - Mandatory session save at turn 31+
    - User can override 2-wave suggestion, cannot override turn limit

L5: Baked-in rules                     Cost: ZERO (already in prompt)
    - Agent files embed critical rules directly
    - Builders have anti-slop, performance, beat params in their agent definition
    - Eliminates need to read separate skill files during build
```

### Session Resumption Protocol

```
New session starts:
    ↓
Read CONTEXT.md (1 file, ~50 lines)
    ↓
Read next wave's PLAN.md files (from CONTEXT.md paths)
    ↓
Run canary check (verify from memory against CONTEXT.md)
    ↓
Present wave summary to user
    ↓
Resume building

Total reads to resume: 2-4 files. No exploration. No redundant reads.
```

---

## Agent Memory Architecture

3-layer memory system that maintains consistency across agents without requiring any single agent to hold everything.

### Layer 1: Living Context File (CONTEXT.md)

The CONTEXT.md file is the heartbeat of the project. It is rewritten after every wave and serves as the single orientation point for any agent entering the project.

**What it contains:**
- DNA identity compressed (~20 lines: archetype, fonts, colors, spacing, forbidden)
- Build state table (section/wave/status/layout/beat)
- Emotional arc position (current beat, completed beats)
- Latest wave results (decisions, patterns used, compliance)
- Next wave instructions (paths, first action, session recommendation)

**Who writes it:** Build-orchestrator (after every wave) and any command that modifies state.
**Who reads it:** Every agent at session start, every command at invocation.

### Layer 2: Growing Design System (Code Artifacts)

The actual built code serves as persistent memory. Once Wave 0 creates globals.css and tailwind.config.ts with DNA tokens, every subsequent builder inherits those tokens through imports.

```
Wave 0 output:
  globals.css          → CSS variables from DNA
  tailwind.config.ts   → Token references
  lib/motion.ts        → Motion presets from DNA
  lib/fonts.ts         → Font loading from DNA
  components/ui/       → Shared shadcn components

This code IS the design system memory.
Builders import from it, not from DNA docs.
```

### Layer 3: Feedback Loop (GAP-FIX + SUMMARY)

Each builder writes a SUMMARY.md with machine-readable frontmatter. The quality-reviewer reads all summaries and produces GAP-FIX.md files. The polisher reads GAP-FIX.md files and applies fixes. This creates a closed feedback loop:

```
Builder → SUMMARY.md → Reviewer → GAP-FIX.md → Polisher → Fixed code
                                                    ↓
                                              Updated SUMMARY.md
```

---

## Plugin Manifest Architecture

### plugin.json Structure

```json
{
  "name": "modulo",
  "description": "Premium frontend design system...",
  "version": "2.0.0",
  "author": { "name": "raphj" },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/dna-compliance-check.sh"
          }
        ]
      }
    ]
  }
}
```

**Hook architecture:** The PreToolUse hook on the Bash tool intercepts `git commit` commands and runs DNA compliance checks. This is zero-context-cost enforcement -- the shell script runs outside the context window.

**Potential additional hooks for v2.0:**
- PostToolUse hook to log agent actions for debugging
- PreToolUse on Write to validate file paths match PLAN.md expectations

### File Discovery

Skills, agents, and commands are auto-discovered by directory convention:
- `skills/{name}/SKILL.md` -- scanned on plugin load
- `agents/{name}.md` or `agents/{category}/{name}.md` -- referenced in agent spawns
- `commands/{name}.md` -- registered as `/modulo:{name}` slash commands

---

## Patterns to Follow

### Pattern 1: Context Injection via Spawn Prompt

**What:** Pre-extract all necessary context into the spawn prompt for sub-agents, so they only need to read 1 file (their PLAN.md).

**When:** Any time a coordinator spawns parallel workers.

**Why:** Eliminates redundant file reads, prevents context duplication, controls exactly what each builder sees.

**Example (from v6.1 design-lead, proven effective):**
```
Task tool spawn prompt includes:
- DNA Identity (20 lines)
- Beat assignment + parameters (5 lines)
- Adjacent section info (10 lines)
- Layout patterns used (5 lines)
- Shared components available (5 lines)
- Content for this section (10 lines)
- Quality rules (10 lines)

Total: ~65 lines of context + path to PLAN.md

Builder reads: 1 file (PLAN.md, ~100-200 lines)
Total builder context: ~265 lines. Extremely efficient.
```

### Pattern 2: Artifact-as-Contract

**What:** Each pipeline stage defines its output as a markdown artifact with a specific format. The next stage expects that format.

**When:** Always. This is the core pipeline pattern.

**Why:** Decouples agents. Any agent can be replaced or upgraded as long as it honors the contract.

**Contracts:**
```
Research   → SUMMARY.md (findings + recommendations)
Design     → DESIGN-DNA.md (locked tokens) + BRAINSTORM.md (direction)
Plan       → PLAN.md per section (frontmatter + spec + tasks)
Build      → Built code + SUMMARY.md (what was done)
Review     → Verification report + GAP-FIX.md (what to fix)
```

### Pattern 3: Embedded Rules Over Skill References

**What:** Embed critical rules directly in agent files instead of referencing separate skill files.

**When:** Rules that agents need EVERY time they run (anti-slop, performance, beat parameters).

**Why:** Reading skill files costs context tokens. Embedding rules costs zero (they are already in the agent prompt).

**v6.1 already does this well:**
- Section-builder embeds beat parameter table, performance rules, anti-slop quick check
- Quality-reviewer embeds the 35-point scoring rubric
- Design-lead embeds canary check protocol

**v2.0 should extend this:** Every agent should embed the rules it needs EVERY run. Skills are for reference during specific decisions, not for repeated rule checking.

### Pattern 4: Severity-Based Quality Enforcement

**What:** Classify violations by severity (Critical/Major/Minor) and respond proportionally.

**When:** At every quality gate (build-time, post-wave, end-of-phase).

**Why:** v6.1 treats everything as equal -- either it passes or fails. This causes either false-positive noise (minor issues block progress) or false-negative blindness (major issues get lumped with minor ones).

```
CRITICAL → Block immediately. Cannot continue.
  Examples: Wrong font family, archetype forbidden pattern, no reduced-motion

MAJOR → Queue for batch fix. Continue building.
  Examples: Shadow not using DNA system, generic spacing

MINOR → Log for polish phase. No interruption.
  Examples: Could use better variable name, suboptimal but valid contrast
```

### Pattern 5: Discussion-Before-Action Protocol

**What:** Every code-modifying action must be presented to the user for approval before execution.

**When:** All agents that write code. Exceptions: `[auto]` tasks in approved PLAN.md files.

**Why:** Premium design requires human judgment. Auto-approval produces average output. The discussion protocol is what makes Modulo a collaboration tool, not a generation tool.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Hub Agent (Single Point of Context Failure)

**What:** One agent that reads everything, decides everything, and coordinates everything.
**Why bad:** Context window exhaustion. The hub agent degrades first and hardest. Every decision point adds context debt.
**v6.1 manifestation:** Design-lead reads STATE.md + DNA + MASTER-PLAN.md + BRAINSTORM.md + CONTENT.md + REFERENCES.md before each wave. That is 6+ files consuming context before any building starts.
**Instead:** Pipeline architecture where each stage has a defined, limited context scope. Build-orchestrator reads CONTEXT.md (~50 lines) + MASTER-PLAN.md, pre-extracts context, and dispatches.

### Anti-Pattern 2: Skill-as-Runtime-Reference

**What:** Agents read skill files during execution for rules they need every time.
**Why bad:** Each skill read costs 200-500 context tokens. Reading 5 skills per section x 8 sections = 8,000-20,000 wasted tokens.
**v6.1 manifestation:** "Reference the `visual-auditor` skill" and "Reference the `ux-patterns`, `micro-copy`, and `conversion-patterns` skills" in the quality-reviewer agent. This means the reviewer reads 4 skill files every run.
**Instead:** Embed the rules from those skills directly in the agent file. The agent definition is already loaded in context -- adding 50 lines of embedded rules is free compared to reading 4 separate files.

### Anti-Pattern 3: Flat Skill Organization

**What:** All 87 skills in a single directory with no hierarchy or loading strategy.
**Why bad:** No signal about which skills matter. New agents/commands must manually discover relevant skills. Irrelevant skills pollute auto-complete and documentation.
**v6.1 manifestation:** `skills/` contains admin-panel, webhook-api-patterns, and database-crud-ui alongside design-dna and anti-slop-design. No distinction between essential and niche.
**Instead:** Tiered hierarchy (core/design/animation/framework/content/ux/utility) with explicit loading rules per tier.

### Anti-Pattern 4: Verify-Only-at-End

**What:** Running quality checks only after all building is complete.
**Why bad:** Late detection = expensive rework. Fixing a color token error in 8 sections is 8x more expensive than catching it in section 1.
**v6.1 manifestation:** `/modulo:verify` runs AFTER all waves complete. By then, context rot may have degraded output quality across many sections.
**Instead:** Progressive quality gates at build-time (L0), post-wave (L1), and end-of-phase (L2).

### Anti-Pattern 5: Implicit Context Expectations

**What:** Agents expecting context without explicitly documenting what they need.
**Why bad:** When context is implicit, it works when the orchestrator remembers, fails when it forgets. Context rot attacks implicit expectations first.
**Instead:** Every agent file should have an explicit "Reads" section listing exactly which artifacts it requires and in what format.

---

## Scalability Considerations

| Concern | Single Page (5-8 sections) | Multi-Page (3-5 pages) | Large Site (10+ pages) |
|---------|---------------------------|------------------------|------------------------|
| **Context budget** | Comfortable. All plans fit. | Tight. Need page-scoped planning. | Critical. Per-page isolation required. |
| **Wave management** | 3-4 waves, 1 session | 8-12 waves, 3-5 sessions | 20+ waves, many sessions |
| **DNA consistency** | CONTEXT.md sufficient | PAGE-CONSISTENCY.md needed | Page-level DNA variants needed |
| **Session boundaries** | 2-wave suggestion works | Must enforce per-page sessions | Page-as-milestone model |
| **Quality review** | Full site review feasible | Per-page review, then cross-page | Per-page mandatory, cross-page sampling |

### Multi-Page Architecture (v2.0 Enhancement)

```
.planning/modulo/
  DESIGN-DNA.md           ← Global DNA (shared across all pages)
  PAGE-CONSISTENCY.md     ← Cross-page coherence rules
  pages/
    landing/
      MASTER-PLAN.md      ← Wave map for this page
      STATE.md            ← Status for this page
      CONTEXT.md          ← Context anchor for this page
      sections/           ← Sections for this page
    about/
      MASTER-PLAN.md
      ...
    pricing/
      ...
```

---

## Suggested Build Order (Dependencies)

### Phase 1: Foundation
Build these first -- everything else depends on them.

1. **plugin.json manifest** -- Plugin identity and hook registration
2. **CLAUDE.md** -- Project-level instructions with core rules embedded
3. **Core skills** (anti-slop-design, design-dna, design-archetypes, quality-standards, plan-format) -- Rewritten to 4-layer structure
4. **Discussion protocol agent** -- Cross-cutting concern needed by all other agents

### Phase 2: Pipeline Core
Build the pipeline stages in execution order.

5. **researcher agent** -- First pipeline stage
6. **creative-director agent** -- Second stage (includes content-specialist role initially)
7. **section-planner agent** -- Third stage
8. **build-orchestrator agent** -- Fourth stage (orchestration only, no building)
9. **section-builder agent** -- Worker spawned by orchestrator
10. **quality-reviewer agent** -- Fifth stage

### Phase 3: Commands
Wire the pipeline to user-facing commands.

11. **start-project command** -- Discovery → Research → DNA
12. **plan-dev command** -- Phase-scoped planning
13. **execute command** -- Wave-based build
14. **lets-discuss command** -- Interactive design discussion
15. **iterate command** -- Feedback-driven fixes
16. **bug-fix command** -- Diagnosis and repair

### Phase 4: Quality System
Build the multi-layer quality enforcement.

17. **dna-compliance-check.sh hook** (updated for severity levels)
18. **Post-wave creative audit** (creative-director reviewing wave output)
19. **Polisher agent** -- Targeted gap fixes
20. **Visual auditor integration** -- Browser-based testing

### Phase 5: Specialists
Add domain-specific agents for premium output.

21. **animation-specialist agent** -- GSAP/Framer Motion expertise
22. **3d-specialist agent** -- Three.js/Spline/WebGL expertise
23. **content-specialist agent** -- Brand voice, copy generation

### Phase 6: Design Skills
Rewrite design skills to 4-layer structure.

24. **emotional-arc** -- Rewrite with integration context
25. **creative-tension** -- Rewrite with archetype mapping
26. **cinematic-motion** -- Rewrite with DNA motion language connection
27. **wow-moments** -- Rewrite with beat/archetype compatibility
28. **Remaining domain skills** -- Per category

### Phase 7: Framework + Utility Skills
Rewrite remaining skills.

29. **Framework skills** (nextjs, astro, tailwind, shadcn)
30. **UX skills** (responsive, a11y, navigation, forms)
31. **Utility skills** (performance, SEO, testing)

### Phase 8: Polish
System-level polish and context rot hardening.

32. **Canary check refinement** -- Tune the 5 questions
33. **Session boundary UX** -- Improve resume experience
34. **Multi-page support** -- PAGE-CONSISTENCY.md and per-page artifacts

---

## Context Window Budget Analysis

Estimated context consumption per pipeline stage:

| Stage | Agent Definition | Artifacts Read | Artifacts Written | Total Tokens (est.) |
|-------|-----------------|---------------|-------------------|---------------------|
| **Research** | ~800 | PROJECT.md (~300) | ~1000/track | ~2,100 per researcher |
| **Creative Direction** | ~2,000 | PROJECT.md + research (~1,500) | DNA + BRAINSTORM (~2,000) | ~5,500 |
| **Section Planning** | ~1,500 | DNA + content + research (~2,000) | PLAN.md x N (~500 each) | ~3,500 + 500/section |
| **Build Orchestration** | ~1,500 | CONTEXT.md (~200) + MASTER-PLAN (~300) | STATE.md, CONTEXT.md | ~2,000 |
| **Section Building** | ~1,200 | Spawn prompt (~300) + PLAN.md (~500) | Code + SUMMARY.md | ~2,000 per builder |
| **Quality Review** | ~1,500 | DNA + all PLAN.md + all code (~5,000+) | Report + GAP-FIX | ~7,000+ |

**Key insight:** Section builders are the most context-efficient stage (~2,000 tokens each). Quality review is the most context-expensive (~7,000+ tokens). This is correct -- builders should be cheap and parallelizable; review should be thorough.

**v6.1 design-lead for comparison:** Reads STATE.md + DNA + MASTER-PLAN + BRAINSTORM + CONTENT + REFERENCES + all PLAN.md files before each wave = ~8,000+ tokens before any building starts. v2.0's build-orchestrator reduces this to ~2,000 tokens by reading only CONTEXT.md + MASTER-PLAN.

---

## Sources

- **PRIMARY:** Deep analysis of Modulo v6.1.0 codebase at `D:/Modulo/Plugins/v0-ahh-skill/` (all 17 agents, 13 commands, representative skills)
- **PROJECT.md:** `D:/Modulo/Plugins/v0-ahh-skill/.planning/PROJECT.md` (Modulo 2.0 requirements)
- **Confidence:** HIGH -- based on comprehensive codebase analysis and deep understanding of Claude Code plugin architecture patterns
- **Limitations:** WebSearch was unavailable; external validation of emerging multi-agent patterns could not be performed. Architecture recommendations are based on v6.1 experience and known Claude Code capabilities.
