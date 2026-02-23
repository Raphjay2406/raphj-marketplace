# Phase 2: Pipeline Architecture - Research

**Researched:** 2026-02-23
**Domain:** Claude Code plugin agent architecture (markdown-only pipeline of specialized agents)
**Confidence:** HIGH

## Summary

Phase 2 defines the agent pipeline model for Modulo 2.0 -- a set of markdown agent definitions that describe how seven specialized agents (researcher, creative-director, section-planner, build-orchestrator, section-builder, quality-reviewer, polisher) plus three domain specialists collaborate through defined input/output contracts. The pipeline replaces v6.1.0's hub-and-spoke model where a single design-lead agent reads everything and coordinates everything, creating a context window bottleneck that degrades over extended sessions.

Research confirms that Claude Code's plugin system (as of v2.1.50, February 2026) fully supports the architecture needed for Modulo 2.0. Subagent markdown files with YAML frontmatter define tools, model, permissions, hooks, preloaded skills, and persistent memory. The orchestrator spawns builders via the Task tool with context-injected spawn prompts. Critical new capabilities since v6.1.0's design include: the `skills` frontmatter field (preload skill content into subagent context at startup), `memory` field (persistent cross-session learning per agent), `isolation: worktree` (git worktree isolation for parallel builders), `hooks` in frontmatter (per-agent lifecycle hooks), and `maxTurns` (budget control). Agent Teams (experimental) offer an alternative coordination model but are not recommended for Modulo 2.0 due to instability.

The v6.1.0 codebase provides a proven foundation. The design-lead agent's "Complete Build Context" spawn prompt pattern is effective and should be preserved. The section-builder's stateless model (reads exactly 1 file, everything else in spawn prompt) is correct and matches the <200 line budget requirement. The key changes are: splitting design-lead into build-orchestrator + creative-director, adding a dedicated researcher agent, adding a polisher agent, structuring CONTEXT.md with split ownership, and hardening context rot prevention from advisory to structural.

**Primary recommendation:** Define each pipeline agent as a markdown file under `agents/pipeline/` with explicit frontmatter (name, description, tools, model, skills, maxTurns) and an exhaustive system prompt that embeds all rules the agent needs every run. Use the Task tool for builder spawning with pre-extracted context. Use file-based artifacts (CONTEXT.md, STATE.md, PLAN.md, SUMMARY.md) as the inter-agent communication mechanism. Do NOT use Agent Teams.

## Standard Stack

This phase produces markdown files, not application code. The "stack" is the Claude Code plugin system itself.

### Core Platform
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Claude Code Plugin System | v2.1.50 | Agent hosting, tool routing, hook execution | Only platform; all agents run here |
| YAML Frontmatter | -- | Agent metadata (name, description, tools, model, skills, hooks, memory, maxTurns) | Official format per Claude Code docs |
| Markdown System Prompts | -- | Agent behavior definitions | Official format; body of .md file becomes system prompt |
| Task Tool | Built-in | Spawning subagents with context injection | Official mechanism for parallel agent execution |
| File-based Artifacts | -- | Inter-agent communication via .planning/modulo/ files | Proven in v6.1.0; file system is the shared state |

### Supporting
| Component | Purpose | When to Use |
|-----------|---------|-------------|
| PreToolUse Hooks | DNA compliance checking on git commits | L0 quality gate (shell script, zero context cost) |
| PostToolUse Hooks | Post-build verification triggers | L1 quality gate after wave completion |
| SubagentStart/Stop Hooks | Logging, cleanup, canary trigger points | Session lifecycle management |
| `skills` frontmatter field | Preload skill content into agent context | Agents that need specific domain knowledge every run |
| `memory` frontmatter field | Persistent cross-session agent learning | Quality reviewer accumulating patterns |
| `maxTurns` frontmatter field | Budget control per agent | Section builders (prevent runaway builds) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Task tool (subagents) | Agent Teams | Agent Teams enable inter-agent messaging but are experimental, have no session resumption, and add coordination overhead. Subagents are stable and proven. |
| File-based artifacts | Direct agent messaging | File system is durable, inspectable, and works across sessions. Messages are ephemeral. |
| Embedded rules in agents | Skill references at runtime | Embedding costs zero context (already in prompt). Skill references cost 200-500 tokens per read. Embed rules needed every run; reference skills for occasional decisions. |
| `memory` field | Manual MEMORY.md management | Built-in memory system handles directory creation, 200-line curation, and cross-session persistence automatically. |

## Architecture Patterns

### Recommended Agent Directory Structure
```
agents/
  pipeline/
    researcher.md              # Research tracks (parallel, disposable)
    creative-director.md       # Creative vision owner + active reviewer
    section-planner.md         # Build specification generator
    build-orchestrator.md      # Wave coordinator, spawns builders
    section-builder.md         # Stateless section implementation
    quality-reviewer.md        # Goal-backward verification + scoring
    polisher.md                # Targeted gap fixes (light + deep)
  specialists/
    3d-specialist.md           # Three.js / Spline / WebGL expert
    animation-specialist.md    # GSAP / Framer Motion / scroll expert
    content-specialist.md      # Brand voice / copy / micro-copy expert
  protocols/
    discussion-protocol.md     # Human-in-the-loop enforcement
    canary-check.md            # Context rot detection protocol (embedded rules)
```

### Pattern 1: Pipeline with Artifact Contracts

**What:** Work flows through specialized stages. Each stage reads defined input artifacts and produces defined output artifacts. No stage needs the full project context.

**When to use:** Always. This is the core architecture.

**Contract Table:**

| Pipeline Stage | Agent | Reads (Input) | Produces (Output) | Context Budget |
|---------------|-------|---------------|-------------------|----------------|
| Research | researcher | PROJECT.md, reference URLs | research/*.md per track | LOW (~2,100 tokens per researcher) |
| Creative Direction | creative-director | PROJECT.md, research/*.md, BRAINSTORM.md | DESIGN-DNA.md, BRAINSTORM.md, creative notes in CONTEXT.md | MEDIUM (~5,500 tokens) |
| Section Planning | section-planner | DESIGN-DNA.md, research/*.md, CONTENT.md | PLAN.md per section, MASTER-PLAN.md | MEDIUM (~3,500 + 500/section) |
| Build Orchestration | build-orchestrator | CONTEXT.md (~50 lines), MASTER-PLAN.md | Updated STATE.md, CONTEXT.md, spawned builders | LOW (~2,000 tokens) |
| Section Building | section-builder | Spawn prompt (~150 lines) + PLAN.md (~200 lines) | Built code + SUMMARY.md | LOW (~2,000 tokens per builder) |
| Quality Review | quality-reviewer | DNA, all PLAN.md, all built code, CONTENT.md, REFERENCES.md | Verification report, GAP-FIX.md files | HIGH (~7,000+ tokens) |
| Polish | polisher | GAP-FIX.md + specific code files | Fixed code, updated SUMMARY.md | LOW (scoped fixes) |

**Source:** Analysis of v6.1.0 design-lead.md context consumption patterns + ARCHITECTURE.md estimates.

### Pattern 2: Context Injection via Spawn Prompt

**What:** The build-orchestrator pre-extracts ALL necessary context (DNA identity, beat assignment, adjacent sections, content, quality rules) into the spawn prompt for each section-builder. Builders read exactly one file (PLAN.md).

**When to use:** Every time a builder is spawned.

**Budget breakdown (target: <200 lines total):**
```
Spawn Prompt Structure (~150 lines):
├── DNA Identity (~40 lines)
│   ├── Archetype, display/body fonts
│   ├── All 12 color tokens with hex values
│   ├── Full spacing scale (5 levels with names + values)
│   ├── Full radius system
│   ├── Full shadow levels
│   ├── Motion: easing, stagger, enter directions per beat
│   └── FORBIDDEN patterns list
├── Section Assignment (~15 lines)
│   ├── Beat type, wave number
│   ├── Wow moment assignment
│   ├── Creative tension assignment
│   └── Transition in/out techniques
├── Beat Parameters (~8 lines)
│   ├── Height, density, animation intensity
│   ├── Whitespace ratio, type scale
│   └── Layout complexity
├── Adjacent Sections (~15 lines)
│   ├── Above: name, beat, layout pattern, background, spacing
│   ├── Below: name, beat, planned layout
│   └── Visual continuity rules
├── Layout Patterns Used (~5 lines)
│   └── All patterns from completed sections
├── Shared Components (~5 lines)
│   └── Available imports from Wave 0/1
├── Content for This Section (~30 lines)
│   └── Headlines, body, CTAs, testimonials, stats
├── Quality Rules (~15 lines)
│   ├── Anti-slop quick check (5 items)
│   ├── Performance rules (embedded)
│   ├── Micro-copy rules
│   └── DNA compliance checklist
└── Lessons Learned (~10 lines)
    ├── Reviewer feedback from previous waves
    └── Patterns to replicate / avoid

PLAN.md read by builder (~100-200 lines):
├── Frontmatter (section, wave, dependencies, must_haves)
├── <objective>
├── <visual-specification> (ASCII layouts, exact classes, copy)
├── <component-structure>
├── <wow-moment> (if assigned)
├── <creative-tension> (if assigned)
├── <tasks>
├── <verification>
└── <success_criteria>

Total: ~250-350 lines (spawn prompt + PLAN.md)
```

**Source:** v6.1.0 design-lead.md lines 75-167 (proven Complete Build Context pattern).

### Pattern 3: Agent Frontmatter Configuration

**What:** Each agent's markdown file uses YAML frontmatter to declare all configuration: name, description, tools, model, skills, maxTurns, hooks, memory.

**When to use:** Every agent definition.

**Example (build-orchestrator):**
```yaml
---
name: build-orchestrator
description: Coordinates wave-based design execution. Reads CONTEXT.md for state, spawns parallel section-builders with pre-extracted context, runs coherence checks and canary checks after each wave, manages session boundaries. Use when executing design plans.
tools: Read, Write, Edit, Bash, Grep, Glob, Task(section-builder, 3d-specialist, animation-specialist, content-specialist)
model: inherit
maxTurns: 50
skills:
  - plan-format
---

[System prompt content - the agent's full behavioral instructions]
```

**Key points from official docs:**
- `tools` field is an allowlist. Use `Task(agent-name)` syntax to restrict which subagents can be spawned.
- `skills` field preloads full skill content into agent context at startup (not just description).
- `maxTurns` prevents runaway execution.
- `model: inherit` uses the parent conversation's model.
- Subagents CANNOT spawn other subagents. Only the main thread can use Task. This means builders cannot spawn sub-builders.
- Subagent receives ONLY its system prompt + basic environment details, NOT the full Claude Code system prompt.

**Source:** Official Claude Code docs at code.claude.com/docs/en/sub-agents (February 2026).

### Pattern 4: Split CONTEXT.md Ownership

**What:** CONTEXT.md serves dual purpose -- build state (owned by orchestrator) and creative notes (owned by CD). Both contribute to the living context file.

**When to use:** After every wave completion.

**Structure:**
```markdown
# Modulo Context
Last updated: [ISO date] | Wave: [N] completed | Session: [N]

## DNA Identity (orchestrator writes, static after Phase 1)
[~20 lines: archetype, fonts, colors, spacing, forbidden]

## Build State (orchestrator writes after each wave)
[Section/wave/status/layout/beat table]
[Layout patterns used, background progression]

## Creative Direction Notes (CD writes after each wave review)
[Drift observations, boldness opportunities, tension calibration]
[Which sections exceeded bar, which need pushing]

## Emotional Arc Position (orchestrator writes)
[Current beat, completed beats, upcoming beat types]

## Feedback Loop (orchestrator aggregates from reviewer)
[Lessons learned: patterns that worked, patterns to avoid]
[Reusable component proposals from builder SUMMARYs]

## Next Wave Instructions (orchestrator writes)
[Wave N+1 sections, PLAN.md paths, first action]
[Session recommendation: continue / new session]
```

**Source:** 02-CONTEXT.md decision: "CONTEXT.md ownership is split: orchestrator writes build state/progress after each wave, Creative Director appends creative direction notes and drift observations."

### Pattern 5: Creative Director as Active Reviewer

**What:** The CD agent has real authority -- can flag sections as "below creative bar" and require specific improvements. Reviews at two checkpoints per wave: light plan review before builders execute, thorough output review after building.

**When to use:** Every wave execution cycle.

**Authority model:**
```
Plan Review (light, before building):
  CD reads: PLAN.md files for current wave
  CD checks: Does this match creative vision? Bold enough?
  CD can: Suggest modifications to PLAN.md before execution
  Outcome: Plans proceed or get specific revision notes

Output Review (thorough, after building):
  CD reads: Built code for current wave sections
  CD checks: Archetype match, creative tension, emotional arc, boldness
  CD can: Flag section as "below bar" + require specific improvements
  Outcome: Accept / Require changes (goes to polisher)
```

**Separation from Quality Reviewer:**
- CD owns: Creative vision, boldness, archetype match, creative tension, emotional arc
- QR owns: Technical quality, anti-slop score, accessibility, performance, code quality
- DNA is the floor (QR enforces), CD pushes the ceiling (opportunities to be bolder)

**Source:** 02-CONTEXT.md decisions on CD authority + v6.1.0 quality-reviewer.md analysis.

### Pattern 6: Two-Tier Polish System

**What:** Light auto-polish runs on every section as a guaranteed stage (micro-interactions, textures, hover states). Deep polish triggers only when the quality reviewer or CD identifies gaps.

**When to use:** After every section build (light), after QR/CD review finds issues (deep).

**Light polish (automatic, built into section-builder's last tasks):**
- Verify all hover/focus/active states present
- Add micro-interactions (subtle transforms on interactive elements)
- Check texture application per DNA spec
- Verify smooth scrolling integration
- Validate prefers-reduced-motion on all animations

**Deep polish (triggered by GAP-FIX.md):**
- Polisher agent reads specific GAP-FIX.md
- Applies targeted fixes with minimal context (just the gap + the code)
- Atomic commits per fix
- Reports back via updated SUMMARY.md

**Source:** 02-CONTEXT.md decision: "Two-tier polish system: light auto-polish on every section as a guaranteed stage, plus deep polish triggered only when the quality reviewer identifies gaps."

### Pattern 7: Builder Neighbor Awareness

**What:** Section builders know their adjacent sections' beat types, layout patterns, and backgrounds -- enough to avoid repetition and handle transitions.

**When to use:** Every builder spawn prompt.

**Format in spawn prompt:**
```markdown
### Adjacent Sections
Above: 03-features (BUILD beat) — Layout: bento-grid, Background: bg-secondary, Bottom spacing: space-16
Below: 05-testimonials (PROOF beat) — Planned layout: narrow-centered
Visual continuity: Your layout MUST differ from bento-grid. Your bg MUST contrast with bg-secondary.
```

**Source:** 02-CONTEXT.md decision: "Section builders are aware of their neighbors: they know which sections come before/after, those sections' beat types, and layout patterns -- enough to avoid repetition and handle transitions."

### Anti-Patterns to Avoid

- **Hub Agent (design-lead reads everything):** v6.1.0's design-lead reads 6+ files before each wave (~8,000+ tokens). Build-orchestrator should read CONTEXT.md (~50 lines) + MASTER-PLAN.md only (~2,000 tokens total).

- **Skill-as-Runtime-Reference:** v6.1.0's quality-reviewer says "Reference the visual-auditor skill" and "Reference the ux-patterns, micro-copy, and conversion-patterns skills" -- reading 4 skill files per run. Embed critical rules directly in agent files. Use `skills` frontmatter field for skills needed every run.

- **Subagents spawning subagents:** Official docs confirm: "Subagents cannot spawn other subagents." The build-orchestrator is the ONLY agent that spawns builders. Builders cannot delegate.

- **Implicit context expectations:** Every agent must explicitly list what it reads and what it writes. No agent should expect context to "just be there."

- **Using Agent Teams for build coordination:** Agent Teams are experimental, have no session resumption for in-process teammates, and add coordination overhead. Stick with Task tool subagents.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Agent spawning & context isolation | Custom coordination logic | Task tool with spawn prompts | Built into Claude Code, handles context windows automatically |
| Tool restriction per agent | Manual rule enforcement | `tools` frontmatter field + `Task(agent-name)` restriction | Official mechanism, enforced by platform |
| Cross-session agent learning | Manual file-based memory | `memory` frontmatter field (`user`/`project`/`local` scope) | Auto-creates memory directory, handles 200-line curation, persists across sessions |
| Skill preloading | "Read skill X first" instructions | `skills` frontmatter field | Injects full skill content at startup, no runtime file reads needed |
| Agent turn limits | "Stop after N tasks" instructions | `maxTurns` frontmatter field | Hard platform-level enforcement, cannot be bypassed |
| Pre-commit DNA checking | Manual grep-before-commit instructions | PreToolUse hook on Bash tool | Shell script runs outside context window, zero-cost enforcement |
| Post-wave triggers | Manual "after wave, do X" instructions | PostToolUse hooks, SubagentStop hooks | Platform-level lifecycle events, reliable triggering |
| Agent-specific validation | Post-hoc review of agent actions | `hooks` in agent frontmatter | Per-agent PreToolUse/PostToolUse, runs only while that agent is active |

**Key insight:** Claude Code's plugin system has matured significantly since v6.1.0 was designed. Many patterns that required manual implementation in v6.1.0 are now supported as frontmatter fields. Use platform features instead of reinventing them.

## Common Pitfalls

### Pitfall 1: Context Rot Over Extended Sessions
**What goes wrong:** By wave 3-4, the orchestrator forgets DNA tokens, defaults to Inter/blue-500/rounded-lg, and produces generic output.
**Why it happens:** LLM attention degrades on early instructions as conversation grows. This is a fundamental property of transformer attention, not a fixable bug.
**How to avoid:**
1. Hard session boundaries every 2 waves (auto-save + continue hint, user can override but canary checks remain active)
2. CONTEXT.md rewritten after EVERY wave (~50 lines, includes full DNA identity)
3. Pre-extracted DNA in every builder spawn prompt (builders get fresh context windows)
4. Canary checks with teeth: 5 questions from memory, verify against CONTEXT.md, 2+ wrong = "consider new session"
5. Turn 31+ = mandatory session save, no override
6. Builders as separate Task invocations (each gets own context window)
**Warning signs:** Canary check failures, stray hex values in built code, Tailwind defaults (shadow-md, rounded-lg, gap-4) appearing in output.

### Pitfall 2: Generic Output Despite DNA Compliance
**What goes wrong:** Output uses correct DNA tokens but is compositionally bland -- symmetric layouts, safe animations, predictable arrangements.
**Why it happens:** LLMs default to the statistical mode of "good web design." DNA compliance addresses tokens but not composition.
**How to avoid:**
1. CD reviews output for boldness, not just token compliance
2. Layout diversity enforcement (5+ distinct patterns per page, no adjacent repeats)
3. Creative tension mandated in PEAK beats
4. "Patterns already used" list in every spawn prompt
5. Creative Courage scoring in anti-slop gate
6. Reference-quality benchmarking in PLAN.md
**Warning signs:** All sections use centered layouts, animations are all fade-in-up, no section makes you want to screenshot it.

### Pitfall 3: Orchestrator Overload
**What goes wrong:** Build-orchestrator tries to do too much -- reading DNA, content, brainstorm, references, plans -- and degrades just like v6.1.0's design-lead.
**Why it happens:** Natural tendency to add "just one more file read" to the orchestrator.
**How to avoid:**
1. Orchestrator reads ONLY: CONTEXT.md + MASTER-PLAN.md + current wave PLAN.md files
2. All other context (DNA, content, references) is pre-extracted into builder spawn prompts
3. Creative review is delegated to CD (separate agent with its own context)
4. Quality review is delegated to quality-reviewer (separate agent)
5. Orchestrator is a coordinator, not a decision-maker
**Warning signs:** Orchestrator agent definition exceeds 500 lines, orchestrator reads more than 3 files per wave.

### Pitfall 4: Builder Cross-Contamination
**What goes wrong:** Parallel builders make conflicting decisions -- same layout, same background, inconsistent typography.
**Why it happens:** Each builder has its own context window and cannot see what other builders are doing in real-time.
**How to avoid:**
1. Pre-planned background progression in MASTER-PLAN.md
2. Pre-assigned layout patterns in MASTER-PLAN.md
3. "Patterns already used" list in every spawn prompt
4. Post-wave coherence checkpoint (shadow, spacing, bg, typography, layout diversity)
5. Blocking coherence check -- issues found mean fixes before next wave
**Warning signs:** Two adjacent sections with same background color, same layout pattern, or inconsistent shadow/spacing values.

### Pitfall 5: Feedback Loop Disconnect
**What goes wrong:** Quality reviewer finds issues, GAP-FIX.md is created, but future builders repeat the same mistakes because they never see the feedback.
**Why it happens:** Feedback lives in GAP-FIX.md files that builders never read.
**How to avoid:**
1. Orchestrator aggregates reviewer feedback into "lessons learned" snippets
2. Lessons learned embedded in subsequent builder spawn prompts (~10 lines)
3. Format: "REPLICATE: [patterns that scored well]" and "AVOID: [patterns that lost points]"
4. Growing design system (SUMMARY.md proposals) collected by orchestrator after each wave
**Warning signs:** Same anti-slop violations appearing in multiple waves, similar GAP-FIX.md items across sections.

### Pitfall 6: CD Without Teeth
**What goes wrong:** CD reviews output but cannot enforce changes -- becomes advisory rather than authoritative.
**Why it happens:** If CD's feedback goes into a suggestions file that nobody reads, it has no effect.
**How to avoid:**
1. CD can flag sections as "below creative bar" -- this creates a GAP-FIX.md
2. CD's GAP-FIX.md items are processed by polisher before wave advances
3. CD reviews BOTH plans (light) and output (thorough) per wave
4. CD writes creative direction notes directly into CONTEXT.md
5. Orchestrator reads CD's notes before constructing next wave's spawn prompts
**Warning signs:** CD consistently identifies issues that appear again in subsequent waves.

## Code Examples

Note: Since this phase produces markdown agent definitions, "code examples" are agent definition templates.

### Section Builder Agent Definition Template
```yaml
---
name: section-builder
description: Implements a single design section from its PLAN.md specification. Receives all context via spawn prompt (DNA, beat, content, quality rules). Reads exactly one file (PLAN.md). Writes production-ready TSX code and SUMMARY.md on completion.
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
maxTurns: 30
---

You are a Section Builder for a Modulo design project. You implement a single
section based on its PLAN.md specification.

## Context Source

Your spawn prompt contains your Complete Build Context:
- DNA Identity (colors, fonts, spacing, shadows, motion, forbidden patterns)
- Beat assignment and parameters (HARD CONSTRAINTS)
- Adjacent section info and visual continuity rules
- Pre-approved content from CONTENT.md
- Quality rules (anti-slop, performance, micro-copy)
- Lessons learned from previous waves

**You read exactly ONE file:** Your PLAN.md at the path specified in your spawn prompt.
**You do NOT read:** DESIGN-DNA.md, STATE.md, BRAINSTORM.md, CONTENT.md, or any skill files.

## Embedded Beat Parameters (do NOT read emotional-arc skill)
[Full beat parameter table embedded here]

## Embedded Quality Rules (do NOT read skill files)
[Anti-slop quick check, performance rules, micro-copy rules embedded here]

## Process
1. Read spawn prompt context (already in your prompt)
2. Read your PLAN.md
3. Execute tasks sequentially
4. Self-verify against must_haves
5. Write SUMMARY.md with reusable component proposals

## SUMMARY.md Format
[Format with frontmatter including `reusable_components` field for design system growth]
```

### Build Orchestrator Spawn Prompt Template
```markdown
## Complete Build Context for [Section XX-name]

### DNA Identity (do NOT re-read any DNA files)
Archetype: [name]
Display: [font] | Body: [font] | Mono: [font]
Colors: bg-primary [hex], bg-secondary [hex], bg-tertiary [hex],
        accent-1 [hex], accent-2 [hex], accent-3 [hex]
Text: primary [hex], secondary [hex], tertiary [hex]
Expressive: glow [hex], tension [hex], highlight [hex], signature [hex]
Spacing: xs=[val] sm=[val] md=[val] lg=[val] xl=[val]
Radius: sm=[val] md=[val] lg=[val] full=[val]
Shadows: [5-level system with descriptions]
Motion: easing=[values], stagger=[ms], enter=[directions per beat type]
FORBIDDEN: [pattern1, pattern2, ...]
Signature: [element description with parameters]

### Your Section Assignment
Beat: [type] | Wave: [N]
Wow moment: [type or "none"]
Creative tension: [type or "none"]
Transition in: [technique] | Transition out: [technique]

### Beat Parameters
Height: [value] | Density: [value] | Anim intensity: [value]
Whitespace: [value] | Type scale: [value] | Layout: [value]

### Adjacent Sections
Above: [name] ([beat]) -- Layout: [pattern], Background: [color], Bottom spacing: [value]
Below: [name] ([beat]) -- Planned layout: [pattern]
Visual continuity: Your layout MUST differ from [above pattern]. Your bg MUST contrast with [above bg].

### Layout Patterns Already Used
[list of patterns from all completed sections]
You MUST pick a DIFFERENT pattern.

### Shared Components Available
[list from Wave 0/1 with import paths]

### Content for This Section
[pre-extracted copy for ONLY this section]

### Quality Rules (do NOT read any skill files)
Anti-slop: [5 items] | Performance: [key rules] | Micro-copy: [banned words]
DNA compliance: ONLY DNA tokens | NO raw hex | NO Tailwind defaults

### Lessons Learned (from previous waves)
REPLICATE: [patterns reviewer praised]
AVOID: [patterns that lost anti-slop points]

### YOUR TASK
Read ONLY your PLAN.md at: `.planning/modulo/sections/XX-name/PLAN.md`
Then build the section following the plan exactly.
```

### Canary Check Protocol Template
```markdown
## Canary Check Protocol (After Every Wave)

Answer these 5 questions from memory BEFORE reading any files:

**DNA Recall (identity drift):**
1. What is our display font?
2. What is accent-1 hex value?
3. What patterns are forbidden by our archetype?

**State Recall (context drift):**
4. What layout patterns have been used so far?
5. What beat type is assigned to the next section to build?

**Scoring:**
- 5/5 correct: Context healthy. Continue.
- 3-4 correct: Re-read CONTEXT.md carefully. Add `Canary: DEGRADING` to CONTEXT.md.
- 0-2 correct: TRIGGER SESSION BOUNDARY. Context rot confirmed.
  Save CONTEXT.md, recommend new session to user.

**This check is MANDATORY after every wave and CANNOT be skipped.**
```

### Creative Director Review Protocol Template
```markdown
## CD Review Checkpoints (Per Wave)

### Pre-Build Review (Light)
Read: Current wave's PLAN.md files
Check:
- Does each section's creative vision match the archetype?
- Are tension moments bold enough for the assigned beats?
- Are wow moments genuinely impressive, not timid?
- Does the beat sequence create real emotional movement?
Action: Approve plans OR provide specific revision notes

### Post-Build Review (Thorough)
Read: Built code for current wave sections
Check:
- Archetype personality visible in every section
- Creative tension moments implemented boldly
- Emotional arc hits the right beats (not flat)
- Color usage creates visual journey (not monotone)
- Typography creates real hierarchy (not uniform)
- Would this section win a screenshot contest?
Action: Accept OR flag as "below creative bar" with specific improvements

### Flag Format
SECTION: [XX-name]
STATUS: BELOW_CREATIVE_BAR
ISSUES:
  - [specific issue with evidence]
  - [what's missing and why it matters]
REQUIRED_IMPROVEMENTS:
  - [concrete action item]
  - [specific change to make]
```

## State of the Art

| Old Approach (v6.1.0) | Current Approach (v2.0) | When Changed | Impact |
|----------------------|------------------------|--------------|--------|
| Hub-and-spoke (design-lead reads everything) | Pipeline (specialized stages with artifact contracts) | v2.0 redesign | Eliminates context bottleneck at orchestrator |
| Single design-lead agent | Split: build-orchestrator + creative-director | v2.0 redesign | CD can review independently, orchestrator stays lean |
| No persistent agent memory | `memory` frontmatter field (user/project/local scope) | Claude Code v2.x | Quality reviewer accumulates patterns across sessions |
| Manual skill file reads | `skills` frontmatter field (preloads at startup) | Claude Code v2.x | Zero-cost skill loading, no runtime file reads |
| No turn limits on agents | `maxTurns` frontmatter field | Claude Code v2.x | Prevents runaway builder execution |
| Advisory session boundaries | Structural session boundaries (canary + turn limit) | v2.0 redesign | Context rot prevention is enforced, not suggested |
| Verify-only-at-end | Progressive quality gates (L0/L1/L2/L3) | v2.0 redesign | Problems caught where cheapest to fix |
| builders reading DNA directly | Full DNA pre-extracted in spawn prompt | v6.1.0 (proven) | Builders stay stateless, no file reads for DNA |
| Single reviewer role | CD (creative) + QR (technical) + Polisher (fixes) | v2.0 redesign | Separated concerns, CD has real authority |
| No builder feedback loop | Lessons learned snippets in spawn prompts | v2.0 redesign | Patterns accumulate, mistakes don't repeat |

**New Claude Code capabilities to leverage:**
- `isolation: worktree` -- git worktree isolation for parallel builders (prevents file conflicts)
- `background: true` -- run subagents concurrently while main conversation continues
- `hooks` in agent frontmatter -- per-agent lifecycle hooks (PreToolUse, PostToolUse, Stop)
- Agent persistent `memory` -- cross-session learning without manual file management
- `Task(agent-name)` tool restriction -- explicit allowlist of which agents can be spawned

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal spawn prompt length vs. PLAN.md length**
   - What we know: v6.1.0's Complete Build Context is ~65 lines, PLAN.md ~100-200 lines. Requirement says <200 total.
   - What's unclear: The 02-CONTEXT.md decision says "Full Design DNA snapshot in every builder's spawn prompt (~100-150 lines)" which alone exceeds half the budget. With content, beat params, adjacent info, and quality rules, spawn prompt will be ~150 lines. Plus PLAN.md = ~350 total.
   - Recommendation: The <200 line budget should apply to the spawn prompt only (context injected by orchestrator), not spawn prompt + PLAN.md. PLAN.md is the one file builders read, so it's additional. Clarify this interpretation during planning. Target: spawn prompt ~150 lines, PLAN.md ~200 lines.

2. **CD review timing and execution flow**
   - What we know: CD reviews both plans (light) and output (thorough) per wave. CD has authority to require changes.
   - What's unclear: Does CD's plan review happen before the orchestrator spawns builders (blocking), or in parallel? If blocking, it adds latency to every wave. If parallel, CD's feedback arrives too late for current wave.
   - Recommendation: CD plan review should be blocking but fast (light review, ~5 minutes). CD output review happens after builders complete, before advancing to next wave. This is the v6.1.0 pattern of "coherence checkpoint after wave" extended with creative review.

3. **Specialist agent invocation mechanism**
   - What we know: Specialists (3D, animation, content) are sub-types of section-builder with domain knowledge.
   - What's unclear: How does the orchestrator decide whether to spawn section-builder vs. 3d-specialist vs. animation-specialist? Is this encoded in PLAN.md metadata?
   - Recommendation: PLAN.md frontmatter includes a `builder_type` field (default: `section-builder`). Section planner assigns `3d-specialist` when plan includes Three.js/Spline/WebGL, `animation-specialist` when plan includes complex GSAP/scroll-driven choreography, `content-specialist` for content-heavy sections. Orchestrator reads this field and spawns the appropriate agent.

4. **CONTEXT.md size management**
   - What we know: CONTEXT.md should be ~50 lines for quick orientation. But with full DNA identity, build state table, creative notes, lessons learned, and next instructions, it may grow larger.
   - What's unclear: What happens when CONTEXT.md grows beyond 50 lines over many waves?
   - Recommendation: CONTEXT.md is rewritten (not appended) after every wave. Creative notes are trimmed to last wave's observations only. Build state table shows all sections but in compact format. Target: 80-100 lines max. If larger, the orchestrator must compress.

5. **Design system growth collection mechanism**
   - What we know: "Builder proposes in SUMMARY.md, orchestrator collects." Builders flag reusable components.
   - What's unclear: Where does the orchestrator store the collected design system inventory? How do subsequent builders know what's available?
   - Recommendation: Orchestrator maintains a `DESIGN-SYSTEM.md` file in `.planning/modulo/` that grows after each wave. The "Shared Components Available" section of spawn prompts draws from this file. Format: component name, import path, usage note.

## Sources

### Primary (HIGH confidence)
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents) -- Full frontmatter schema, Task tool behavior, spawn patterns, tool restrictions, memory, hooks, skills preloading
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- Skill format, invocation control, context: fork, agent integration
- [Claude Code Plugin Reference](https://code.claude.com/docs/en/plugins-reference) -- Plugin manifest schema, agent/skill/hook packaging, directory structure
- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams) -- Agent teams architecture, limitations, comparison with subagents (used to confirm: do NOT use Agent Teams)
- Modulo v6.1.0 codebase analysis: design-lead.md (425 lines), section-builder.md (327 lines), quality-reviewer.md (311 lines), design-researcher.md (117 lines) -- Proven patterns for spawn prompts, embedded rules, artifact contracts
- `.planning/research/ARCHITECTURE.md` -- Comprehensive architecture analysis with pipeline model, context rot prevention, agent memory system
- `.planning/research/SUMMARY.md` -- Stack, features, and pitfall analysis

### Secondary (MEDIUM confidence)
- `.planning/phases/02-pipeline-architecture/02-CONTEXT.md` -- User decisions on agent roles, context passing, session management, CD authority
- `.planning/ROADMAP.md` -- Phase 2 success criteria and plan structure
- `.planning/REQUIREMENTS.md` -- AGNT-01 through AGNT-04, BILD-01, BILD-03 requirement definitions
- `.planning/phases/01-foundation/01-CONTEXT.md` -- Phase 1 decisions that Phase 2 builds on

### Tertiary (LOW confidence)
- Agent Teams experimental status -- May stabilize in future Claude Code versions; worth revisiting if inter-agent messaging becomes needed
- `isolation: worktree` for parallel builders -- Documented but untested in plugin context; may have edge cases with shared .planning/ directory

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Claude Code docs verified directly (February 2026 version), v6.1.0 codebase analysis is authoritative
- Architecture patterns: HIGH -- Pipeline model proven in v6.1.0, new frontmatter fields verified in official docs, spawn prompt pattern battle-tested
- Agent contracts: HIGH -- Input/output contracts derived from existing proven artifacts (PLAN.md, SUMMARY.md, CONTEXT.md, STATE.md)
- Context rot prevention: HIGH -- 6-layer defense system proven in v6.1.0, hardened with structural enforcement per user decisions
- CD authority model: MEDIUM -- New agent (no v6.1.0 precedent), based on user decisions and architectural reasoning
- Specialist agents: MEDIUM -- Concept is sound (domain-specific skills + same I/O contract), but invocation mechanism needs validation during planning
- Memory system: MEDIUM -- `memory` frontmatter is new platform capability; integration with Modulo's artifact-based memory needs experimentation

**Research date:** 2026-02-23
**Valid until:** 60 days (stable domain -- Claude Code plugin format is mature, v6.1.0 patterns are proven)
