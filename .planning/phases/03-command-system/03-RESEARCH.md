# Phase 3: Command System - Research

**Researched:** 2026-02-23
**Domain:** Claude Code plugin command architecture (markdown-only, no application code)
**Confidence:** HIGH

## Summary

Phase 3 creates 6 user-facing commands that replace the existing 13 v6.1.0 commands. These commands are markdown files in the `commands/` directory that define workflows Claude Code executes when users invoke `/modulo:command-name`. This phase depends on Phase 2 (Pipeline Architecture) which defines the agents these commands dispatch to, and Phase 1 (Foundation) which defines the skills and identity system they reference.

The research covered: (1) the exact Claude Code plugin command format and registration mechanism, (2) the existing v6.1.0 command patterns with detailed structural analysis, (3) the pipeline architecture from Phase 2 that commands must route to, (4) state management and guided flow patterns, and (5) the CONTEXT.md discussion decisions that constrain implementation.

**Primary recommendation:** Each command should be a focused routing-and-state-checking markdown file that dispatches to pipeline agents. Commands should contain orchestration logic (what steps to run, in what order, with what state checks) but NOT domain knowledge (which belongs in skills) or implementation details (which belong in agent definitions). The guided flow system should be embedded in every command as a standardized "State Check + Next Step" header pattern, not a separate system.

---

## Standard Stack

### Core: Command File Format

Commands in a Claude Code plugin are markdown files placed at `commands/{name}.md` at the plugin root. They become slash commands namespaced as `/modulo:{name}`.

| Component | Location | Purpose | Registration |
|-----------|----------|---------|--------------|
| Command file | `commands/{name}.md` | Workflow definition | Auto-discovered by filename |
| Plugin manifest | `.claude-plugin/plugin.json` | Plugin identity + hooks | `name` field = namespace prefix |
| Agent files | `agents/{name}.md` | Worker definitions spawned by commands | Referenced in Task tool calls |
| Skill files | `skills/{name}/SKILL.md` | Knowledge bases referenced by agents | Auto-discovered, tiered loading |

**Confidence:** HIGH -- verified against official Claude Code documentation (code.claude.com/docs/en/plugins, code.claude.com/docs/en/slash-commands).

### Command File Anatomy (Verified Format)

```markdown
---
description: What this command does (shown in autocomplete)
argument-hint: Optional hint for expected arguments
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

[Markdown body: workflow instructions Claude executes when invoked]

$ARGUMENTS -- captures all arguments after the command name
$ARGUMENTS[0] or $0 -- first argument
$ARGUMENTS[1] or $1 -- second argument

!`shell-command` -- runs shell command and injects output (preprocessing)
```

**Frontmatter fields available:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name (defaults to filename) |
| `description` | Recommended | What the command does, shown in autocomplete |
| `argument-hint` | No | Hint for expected arguments, e.g., `[wave-number]` |
| `disable-model-invocation` | No | Set `true` to prevent Claude auto-invoking |
| `user-invocable` | No | Set `false` to hide from `/` menu |
| `allowed-tools` | No | Tools Claude can use without asking |
| `model` | No | Override model for this command |
| `context` | No | Set `fork` to run in isolated subagent |
| `agent` | No | Which subagent type when `context: fork` |

**Confidence:** HIGH -- extracted from official documentation at code.claude.com.

### Dynamic Features

Commands support:
- **String substitution:** `$ARGUMENTS`, `$0`, `$1`, `${CLAUDE_SESSION_ID}`
- **Shell preprocessing:** `` !`git status` `` runs before Claude sees the content
- **Subagent execution:** `context: fork` + `agent: AgentName` runs in isolated context
- **Tool restrictions:** `allowed-tools` limits what Claude can use during the command

**Confidence:** HIGH -- verified against official documentation.

### Naming Convention

Plugin commands are namespaced: `commands/start-project.md` becomes `/modulo:start-project`.

Current v6.1.0 naming uses `commands/{name}.md` with names like `start-design`, `plan-sections`, `execute`, etc.

**For v2.0, the 6 core commands:**

| v2.0 Command | Filename | Invocation |
|-------------|----------|------------|
| Start-Project | `commands/start-project.md` | `/modulo:start-project` |
| Lets-Discuss | `commands/lets-discuss.md` | `/modulo:lets-discuss` |
| Plan-Dev | `commands/plan-dev.md` | `/modulo:plan-dev` |
| Execute | `commands/execute.md` | `/modulo:execute` |
| Iterate | `commands/iterate.md` | `/modulo:iterate` |
| Bug-Fix | `commands/bug-fix.md` | `/modulo:bug-fix` |

**Utility commands (Claude's discretion per CONTEXT.md):**

| Utility Command | Filename | Purpose |
|----------------|----------|---------|
| Status | `commands/status.md` | Full project status display |
| Audit | `commands/audit.md` | Comprehensive site audit |

---

## Architecture Patterns

### Pattern 1: Command as Router (Not Domain Logic Container)

**What:** Commands should be thin routing layers that check state, parse arguments, and dispatch to pipeline agents. Domain knowledge lives in skills; implementation logic lives in agents.

**Why:** The existing v6.1.0 `start-design.md` is 430 lines with embedded domain logic (discovery questions, research tracks, archetype presentation, DNA generation, content planning). This creates maintenance problems and context bloat. When the command IS the workflow, changing any step requires modifying the command. When the command ROUTES to agents, each agent can evolve independently.

**Current v6.1.0 problem (measured):**

| Command | Lines | Domain Logic | Pure Routing |
|---------|-------|-------------|--------------|
| start-design.md | 430 | ~380 (88%) | ~50 (12%) |
| plan-sections.md | 353 | ~300 (85%) | ~53 (15%) |
| execute.md | 209 | ~130 (62%) | ~79 (38%) |
| verify.md | 367 | ~320 (87%) | ~47 (13%) |
| iterate.md | 128 | ~85 (66%) | ~43 (34%) |
| bugfix.md | 162 | ~120 (74%) | ~42 (26%) |

**v2.0 target: Commands should be 80-150 lines.** All domain logic moves to agent definitions. Commands contain:
1. State check (read STATE.md/CONTEXT.md, verify prerequisites)
2. Argument parsing (flags, options)
3. Guided flow header (one-line status)
4. Pipeline dispatch (spawn agents via Task tool)
5. Next-step prompt (tell user what to do next)

**Confidence:** HIGH -- based on deep analysis of v6.1.0 commands and Phase 2 architecture decisions.

### Pattern 2: State Check + Auto-Recovery Gate

**What:** Every command begins with a state check. If prerequisites are missing, auto-recover by running them (per CONTEXT.md decision: "auto-recover -- if prerequisites are missing, run them automatically").

**Implementation:**

```markdown
## State Check

Read `.planning/modulo/STATE.md` and `.planning/modulo/CONTEXT.md`.

### Auto-Recovery Matrix

| Missing Artifact | Auto-Recovery Action |
|-----------------|---------------------|
| No STATE.md at all | Tell user: "Run /modulo:start-project first" |
| STATE.md exists, no DNA | Run start-project DNA generation phase |
| DNA exists, no PLAN.md files | Run plan-dev automatically |
| PLAN.md exists, no built code | This is expected for /modulo:execute |
| Built code exists, no verification | Suggest /modulo:iterate or verify |

Tell the user what is being auto-recovered:
"No section plans found. Running plan-dev first, then execute."
```

**Confidence:** HIGH -- directly from user's CONTEXT.md decision: "auto-recover -- run missing prerequisites automatically. Seamless chaining."

### Pattern 3: Guided Flow Header (Embedded in Every Command)

**What:** Every command starts with a one-line status header showing current state, then provides contextual next-step guidance at completion.

**Per CONTEXT.md decisions:**
- Status display: "brief one-line header at command start + full status via dedicated command"
- Next-step format: "contextual -- depends on state"
- Verbosity: "always the same -- consistent experience"

**Implementation template (embed in every command):**

```markdown
## Guided Flow Header

At the START of every command invocation, display:

```
Phase: [phase] | Wave: [X/Y] | Sections: [built/total] | Next: [suggested action]
```

At the END of every command, display the contextual next step:

```
[Summary of what was accomplished]

Next step: /modulo:[command] [suggested arguments]
[One sentence explaining why this is the logical next step]
```

If warnings exist (missing artifacts, quality issues):
```
[Warning emoji suppressed] Warning: [issue description]
Suggested fix: /modulo:[command] [arguments]
```
```

**Confidence:** HIGH -- directly from CONTEXT.md decisions, no ambiguity.

### Pattern 4: Rich CLI-Style Flag Support

**What:** Commands accept flags like `/modulo:execute --wave 2 --parallel 3 --dry-run`.

**Per CONTEXT.md decision:** "Arguments: rich CLI-style flag support"

**Implementation pattern:**

```markdown
## Argument Parsing

Parse `$ARGUMENTS` for the following flags:

| Flag | Short | Values | Default | Description |
|------|-------|--------|---------|-------------|
| --wave | -w | number | auto | Start from specific wave |
| --parallel | -p | 1-4 | 4 | Max parallel builders |
| --dry-run | -d | flag | false | Show plan without executing |
| --resume | -r | flag | false | Resume from CONTEXT.md |
| --section | -s | name | all | Target specific section |

**Parse logic:**
If $ARGUMENTS contains "--flag value" or "-f value", extract and use.
If $ARGUMENTS contains a bare word (no dashes), treat as primary argument.
Unknown flags: warn and ignore.
```

**Confidence:** HIGH -- directly from CONTEXT.md decisions.

### Pattern 5: Brainstorm-Before-Action Gate

**What:** `/modulo:iterate` always brainstorms 2-3 approaches before implementing. `/modulo:bug-fix` brainstorms the cause (diagnostic), not creative solutions.

**Per CONTEXT.md decisions:**
- "mandatory for /modulo:iterate -- always brainstorm 2-3 approaches"
- "each approach includes ASCII mockup showing the layout change"
- "bug-fix brainstorms the *cause*, not the solution"

**Iterate brainstorm pattern:**
```
## Brainstorm Phase (Mandatory)

Before ANY implementation, generate 2-3 distinct approaches:

### Approach 1: [Name]
**Change:** [What changes]
**ASCII Mockup:**
[ASCII representation of the layout change]
**Pros:** [benefits]
**Cons:** [tradeoffs]
**Blast radius:** [which adjacent sections are affected]

### Approach 2: [Name]
...

### Approach 3: [Name]
...

Present all approaches to user. Wait for selection before proceeding.
```

**Bug-fix diagnostic pattern:**
```
## Diagnostic Brainstorm (Mandatory)

Before fixing, brainstorm the root cause:

"This could be caused by:
A) [hypothesis 1] -- because [evidence]
B) [hypothesis 2] -- because [evidence]
C) [hypothesis 3] -- because [evidence]

Let me investigate..."

Then: test hypotheses systematically, present confirmed root cause + fix.
```

**Confidence:** HIGH -- directly from CONTEXT.md decisions.

### Recommended Command Structure Template

```markdown
---
description: [One-line description]
argument-hint: [Expected arguments hint]
disable-model-invocation: true
---

You are the Modulo [Command Name] orchestrator.

## Guided Flow Header

[Read STATE.md/CONTEXT.md, display one-line status]

## State Check & Auto-Recovery

[Check prerequisites, auto-recover if needed per matrix]

## Argument Parsing

[Parse $ARGUMENTS for flags and primary argument]

## Process

### Step N: [Step Name]
[Step instructions -- dispatch to agents, manage flow]

## Completion & Next Step

[Display what was accomplished]
[Display contextual next step]

## Rules

[Command-specific rules, ~5-8 items]
```

### Recommended Project Structure

```
commands/
  start-project.md          # Discovery + research + DNA + content
  lets-discuss.md            # Creative deep dive per phase
  plan-dev.md                # Phase-scoped planning
  execute.md                 # Wave-based parallel execution
  iterate.md                 # Brainstorm-first design changes
  bug-fix.md                 # Diagnostic brainstorm + fix
  status.md                  # Full project status display
  audit.md                   # Comprehensive site audit
```

### Anti-Patterns to Avoid

- **Command as monolith:** v6.1.0's start-design.md has 430 lines of embedded workflow. Commands should dispatch to agents, not BE the agents.
- **Implicit state expectations:** Every command must explicitly check STATE.md before doing anything. Never assume state.
- **Silent auto-recovery:** When auto-recovering missing prerequisites, ALWAYS tell the user what is being run automatically (per CONTEXT.md: "transparent -- tell the user what's being run automatically, don't silently chain").
- **Skipping brainstorm gate:** Iterate MUST brainstorm approaches. Bug-fix MUST brainstorm causes. No shortcuts.
- **Inconsistent next-step format:** Every command must end with the same next-step format. Consistency is a locked decision.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State management | Custom state tracking in commands | CONTEXT.md + STATE.md artifact system | Already designed in Phase 2 with CONTEXT.md lifecycle, canary checks, session boundaries |
| Agent spawning | Custom parallel execution logic | Claude Code's `Task` tool | Built-in parallel agent spawning with message passing |
| Argument parsing | Custom regex parsing | Simple $ARGUMENTS pattern matching | Commands support `$ARGUMENTS`, `$0`, `$1` natively |
| Dynamic context injection | Manual file reads in command body | `!`shell-command`` preprocessing | Claude Code preprocesses shell commands before sending to model |
| Quality enforcement | Quality checks in commands | Pipeline agents (quality-reviewer, creative-director) | Domain logic belongs in agents, not commands |
| Session management | Custom session logic | CONTEXT.md rewrite protocol from Phase 2 | Build-orchestrator already handles CONTEXT.md lifecycle |

**Key insight:** Commands are thin routing layers. All complex logic lives in Phase 1 skills and Phase 2 agents. Commands just wire them together and manage user interaction flow.

---

## Common Pitfalls

### Pitfall 1: Command Bloat

**What goes wrong:** Commands accumulate domain logic over time. The v6.1.0 `start-design.md` grew to 430 lines because each feature (visual reference capture, content planning, competitive benchmark) was added directly to the command.

**Why it happens:** It's tempting to add "just one more step" to a command rather than creating or updating an agent.

**How to avoid:** Hard rule: if a step involves domain expertise (design knowledge, quality criteria, creative direction), it belongs in an agent definition. Commands only contain: state checks, argument parsing, agent dispatch, user prompts, next-step guidance.

**Warning signs:** Command file exceeds 200 lines. Command references skill files directly. Command contains ASCII art templates or scoring rubrics.

### Pitfall 2: Missing State Checks

**What goes wrong:** Command assumes state is correct and produces confusing errors when prerequisites are missing.

**Why it happens:** Developer tests in the happy path where state is always valid.

**How to avoid:** Every command starts with a State Check section that reads STATE.md/CONTEXT.md and validates prerequisites. The auto-recovery matrix handles every missing-state scenario.

**Warning signs:** Commands that jump directly to "Step 1" without reading any state files.

### Pitfall 3: Inconsistent Guided Flow

**What goes wrong:** Some commands tell the user what to do next, others don't. Some show status, others don't. The "never a 'now what?' moment" requirement fails.

**Why it happens:** Each command is written independently without a shared template.

**How to avoid:** Use the standardized template. Every command has: Guided Flow Header at start, Completion & Next Step at end, consistent format.

**Warning signs:** Command ends without suggesting a next step. Command starts without showing current status.

### Pitfall 4: Lets-Discuss Integration Confusion

**What goes wrong:** Unclear when /modulo:lets-discuss is standalone vs. auto-offered by plan-dev.

**Per CONTEXT.md:** "exists as standalone command AND auto-offered by plan-sections if no discussion has happened yet"

**How to avoid:** Plan-dev command checks if lets-discuss has been run for this phase. If not, offers it: "No creative discussion has happened for this phase. Would you like to run /modulo:lets-discuss first, or proceed directly to planning?"

**Warning signs:** Lets-discuss and plan-dev have overlapping discovery logic. No tracking of whether discussion has occurred.

### Pitfall 5: Start-Project Feeling Like a Form

**What goes wrong:** Adaptive questioning degrades to "answer these 8 questions." Users feel interrogated rather than guided.

**Per CONTEXT.md:** "batch 4-5 essentials first, then conversational follow-ups based on interesting answers" and "should feel like talking to a creative director, not filling out a form"

**How to avoid:** Start-project should batch the essentials (business, audience, vibe, references) then probe interesting answers conversationally. If someone says "luxury fashion brand," follow up on what luxury means to them rather than moving to the next checkbox question.

**Warning signs:** All questions presented as a numbered list. No follow-up based on user answers. Feeling of filling out a form.

### Pitfall 6: Blast Radius Blindness in Iterate

**What goes wrong:** Iterate changes a section without considering effects on adjacent sections.

**Per CONTEXT.md:** "smart adjacency -- changes scoped to requested section, but flag ripple effects on adjacent sections and ask before touching them"

**How to avoid:** Iterate command must read adjacent sections' PLAN.md and SUMMARY.md to identify shared components, transitions, and visual continuity. Flag any potential ripple effects before implementing changes.

**Warning signs:** Iterate only reads the target section. No check for shared components or transitions.

---

## Code Examples

### Example 1: Command State Check Pattern

```markdown
## State Check & Auto-Recovery

Read `.planning/modulo/STATE.md` and `.planning/modulo/CONTEXT.md`.

If neither file exists:
  → Tell user: "No Modulo project found. Run `/modulo:start-project` to begin."
  → STOP.

Display guided flow header:
  `Phase: [STATE.phase] | Wave: [STATE.current_wave]/[STATE.total_waves] | Sections: [complete]/[total]`

### Prerequisites for This Command

Required state: `phase: PLANNING_COMPLETE` or later.

If `phase: DISCOVERY_COMPLETE` or `phase: BRAINSTORM_COMPLETE`:
  → Auto-recover: "Plans not found. Running plan-dev first..."
  → Dispatch to plan-dev workflow, then continue to execute.

If `phase: CONTENT_COMPLETE`:
  → Auto-recover: "Running plan-dev to create section plans..."
  → Dispatch to plan-dev workflow, then continue.
```

**Source:** Pattern derived from v6.1.0 execute.md prerequisites + CONTEXT.md auto-recovery decision.

### Example 2: Command Flag Parsing Pattern

```markdown
## Argument Parsing

Parse `$ARGUMENTS`:

| Flag | Effect |
|------|--------|
| `--wave N` or `-w N` | Start execution from wave N |
| `--resume` or `-r` | Resume from CONTEXT.md state |
| `--dry-run` or `-d` | Show execution plan without building |
| `--parallel N` or `-p N` | Limit parallel builders (default: 4) |
| Bare word "resume" | Same as --resume (backward compatibility) |

If no flags provided, auto-detect:
  - If CONTEXT.md exists with incomplete state → treat as --resume
  - Otherwise → start from first pending wave
```

### Example 3: Guided Flow Completion Pattern

```markdown
## Completion & Next Step

Display completion summary:
```
Start-Project complete.

Artifacts created:
  .planning/modulo/PROJECT.md      -- Requirements
  .planning/modulo/BRAINSTORM.md   -- Creative direction: [archetype]
  .planning/modulo/DESIGN-DNA.md   -- Visual identity
  .planning/modulo/CONTENT.md      -- Approved page copy
  .planning/modulo/CONTEXT.md      -- Context anchor
  .planning/modulo/STATE.md        -- Project state

Next step: /modulo:plan-dev
  Creates detailed build plans for each section with wave assignments.
  Or: /modulo:lets-discuss to deep-dive on specific creative features first.
```
```

### Example 4: Brainstorm-Before-Action Gate (Iterate)

```markdown
## Brainstorm Phase (Mandatory)

Before ANY changes, brainstorm 2-3 approaches.

For each approach, present:

### Approach [N]: [Descriptive Name]

**What changes:**
- [Specific change 1]
- [Specific change 2]

**ASCII Mockup (Desktop 1440px):**
```
+------------------------------------------+
|  [Layout visualization showing change]   |
|  [Element positions, sizes, spacing]     |
+------------------------------------------+
```

**Blast radius:**
- This section: [what changes]
- Adjacent above ([section name]): [impact or "none"]
- Adjacent below ([section name]): [impact or "none"]
- Shared components: [impact or "none"]

**Pros:** [benefits]
**Cons:** [tradeoffs]

---

Present all approaches. Wait for user selection.
If user says "approach 2" or similar, proceed with that approach.
If user suggests a different direction, brainstorm again.
```

### Example 5: Start-Project Adaptive Questioning Pattern

```markdown
## Phase 1: Discovery

### Step 1: Essential Batch (4-5 questions)

Present these essentials conversationally (not as a numbered form):

"Tell me about your project. I need to understand:
- What is the product or service?
- Who is your target audience?
- What feeling should the site convey? (Give me 2-3 adjectives)
- Any reference sites you admire? (URLs help, but descriptions work too)"

### Step 2: Conversational Follow-Up

Based on the answers, ask 2-3 follow-up questions that probe interesting aspects:

- If they mention "luxury" → "What does luxury mean in your space? Subtle elegance or bold statement?"
- If they mention competitors → "What do they get right? What feels wrong about their sites?"
- If they mention specific features → "Tell me more about [feature]. What's the user journey there?"
- If they give minimal answers → "No worries, I'll research your space. Any hard no's — things you definitely don't want?"

Do NOT ask about:
- Technical stack (Modulo decides this)
- Specific components (too early)
- Color hex values (archetype handles this)

### Step 3: Soft Approval

Present a condensed design brief (not a formal summary document):

"Here's what I'm working with: [brief summary]. I'm going to research your space and come back with a creative direction. Sound right, or should I adjust anything?"

Proceed to research unless user pushes back. No formal "approve" button.
```

---

## State of the Art

### v6.1.0 to v2.0 Command Evolution

| v6.1.0 | v2.0 | What Changed | Impact |
|--------|------|--------------|--------|
| 13 commands | 6 core + 2 utility | Consolidation | Less cognitive load, clearer workflow |
| `start-design` (430 lines) | `start-project` (~120 lines) | Domain logic moved to agents | Maintainable, agents evolve independently |
| `plan-sections` | `plan-dev` | Renamed, phase-scoped research added | Better name, re-research capability |
| `execute` (stays) | `execute` (streamlined) | Slimmer, delegates to build-orchestrator | Less context in command, more in agent |
| `verify` (separate command) | Integrated into pipeline gates | Quality is progressive, not end-of-phase | Earlier problem detection |
| `iterate` + `bugfix` (similar) | `iterate` + `bug-fix` (distinct) | Brainstorm gates differentiated | iterate = creative options, bug-fix = diagnostic |
| `change-plan` (separate) | Merged into `iterate` | Plan changes are iterations | Simpler command surface |
| `visual-audit`, `responsive-check`, `lighthouse`, `generate-tests` | Merged into `audit` | Single comprehensive audit | Less fragmentation |
| No guided flow | Every command has guided flow | Systematic next-step prompts | Never lost |
| No auto-recovery | Auto-recovery on missing prerequisites | Seamless chaining | Fault-tolerant UX |
| 8 questions in a list | Adaptive questioning + follow-ups | Conversational discovery | Feels like talking to a creative director |

### Commands Removed/Merged

| v6.1.0 Command | v2.0 Fate | Rationale |
|----------------|-----------|-----------|
| `start-design` | Renamed to `start-project` | Better reflects the expanded scope |
| `plan-sections` | Renamed to `plan-dev` | Phase-scoped, not section-specific |
| `execute` | Kept, streamlined | Core workflow, no change needed |
| `verify` | Absorbed into quality pipeline | Quality is progressive, not a separate step |
| `iterate` | Kept, enhanced with brainstorm gate | Core workflow, brainstorm is new |
| `bugfix` | Kept as `bug-fix`, enhanced with diagnostic brainstorm | Core workflow, diagnostic focus is new |
| `change-plan` | Merged into `iterate` | Plan changes are a type of iteration |
| `visual-audit` | Merged into `audit` | Comprehensive audit replaces fragmented audits |
| `responsive-check` | Merged into `audit` | Part of comprehensive audit |
| `lighthouse` | Merged into `audit` | Part of comprehensive audit |
| `generate-tests` | Potentially kept as utility or deferred | Testing is orthogonal to design |
| `update` | Potentially kept as utility | Version info display |

**Deprecated/removed patterns:**
- **Direct skill references in commands:** v6.1.0 commands say "Reference the `visual-auditor` skill." v2.0 commands dispatch to agents that have skills embedded.
- **Inline domain logic:** v6.1.0 embeds scoring rubrics and audit checklists in commands. v2.0 moves these to agents.
- **Form-style questioning:** v6.1.0 presents 8 questions as a numbered list. v2.0 uses adaptive batching.

---

## Phase 2 Dependencies (What Commands Must Reference)

Phase 3 depends on Phase 2 (Pipeline Architecture). Commands dispatch to these Phase 2 agents:

### Pipeline Agents (from Phase 2)

| Agent | Commands That Use It | How Command Invokes |
|-------|---------------------|---------------------|
| researcher | start-project, plan-dev | Task tool (parallel spawn, one per research track) |
| creative-director | start-project, lets-discuss, iterate | Task tool or direct invocation |
| section-planner | plan-dev | Task tool |
| build-orchestrator | execute | Direct invocation (orchestrator IS the execute flow) |
| section-builder | execute (via build-orchestrator) | Task tool (spawned by orchestrator, not by command) |
| quality-reviewer | execute (post-wave), audit | Task tool |
| polisher | iterate, bug-fix | Task tool |
| content-specialist | start-project | Task tool (spawned by creative-director) |

### Agent Input/Output Contracts (from Phase 2 Architecture)

Commands must respect these contracts:

```
start-project dispatches:
  → researcher agents (parallel) → research/*.md
  → creative-director → BRAINSTORM.md, DESIGN-DNA.md
  → content-specialist → CONTENT.md

plan-dev dispatches:
  → researcher (phase-scoped) → updated research/
  → creative-director (beat/tension/wow assignment) → updated CONTEXT.md
  → section-planner → PLAN.md per section, MASTER-PLAN.md

execute dispatches:
  → build-orchestrator → manages STATE.md, CONTEXT.md, spawns builders

iterate dispatches:
  → creative-director (brainstorm approaches) → approach proposals
  → polisher or section-builder (apply chosen approach) → fixed code

bug-fix dispatches:
  → quality-reviewer (diagnostic brainstorm) → root cause analysis
  → polisher (apply fix) → fixed code
```

### State Artifacts (from Phase 2 Architecture)

| Artifact | Created By | Read By | Lifecycle |
|----------|-----------|---------|-----------|
| STATE.md | Any state-changing command | Every command at start | Updated after each state change |
| CONTEXT.md | start-project, build-orchestrator | Every command at start, session resume | Rewritten per wave |
| PROJECT.md | start-project | researcher, creative-director | Created once |
| DESIGN-DNA.md | start-project (via creative-director) | All agents | Created once, rarely modified |
| BRAINSTORM.md | start-project (via creative-director) | planner, builder agents | Created once |
| CONTENT.md | start-project (via content-specialist) | planner, builder agents | Created once, approved by user |
| MASTER-PLAN.md | plan-dev (via section-planner) | execute, build-orchestrator | Created once, mutations logged |
| PLAN.md (per section) | plan-dev (via section-planner) | section-builder | Created once per section |
| SUMMARY.md (per section) | section-builder | quality-reviewer | Created after build |
| GAP-FIX.md | quality-reviewer | iterate, polisher | Created during review |

---

## Lets-Discuss Command: Special Patterns

`/modulo:lets-discuss` is unique because it is both a standalone command AND auto-offered by plan-dev. It enables per-phase creative deep dive.

### Standalone Mode
User invokes `/modulo:lets-discuss` directly. Command reads current phase from STATE.md, then enters interactive discussion mode.

### Auto-Offered Mode
Plan-dev checks if lets-discuss has run for the current phase. If not, offers:
"No creative discussion for this phase yet. Want to deep-dive on creative features before planning? (/modulo:lets-discuss) Or proceed directly to planning?"

### Discussion Protocol
Per CONTEXT.md requirements (CMND-02):
- Visual feature proposals with user choices
- Brand voice content suggestions
- Auto-organized task output

The command should be a structured creative conversation that produces:
1. **Visual feature decisions** -- ASCII mockups of proposed features, user picks
2. **Content/voice decisions** -- Brand tone refinements, CTA style, copy direction
3. **Organized output** -- Discussion results auto-organized into task-ready format that plan-dev can consume

**Output artifact:** `.planning/modulo/DISCUSSION-{phase}.md` with structured decisions.

---

## Command-Specific Research

### Start-Project (CMND-01)

**Key decisions from CONTEXT.md:**
- Adaptive questioning: batch 4-5 essentials, conversational follow-ups
- Research visibility: live progress streaming ("Found 3 Awwwards references...")
- Output presentation: condensed design brief with ASCII mockups
- Creative directions: 1 strong recommendation with escape hatch
- References: mention once, don't push
- Approval: soft gate

**Pipeline flow:**
1. Discovery (in-command conversational questioning)
2. Research (parallel researcher agents with streaming progress)
3. Archetype selection + DNA generation (creative-director agent)
4. Content planning (content-specialist agent)
5. STATE.md + CONTEXT.md initialization

**v6.1.0 phases mapped to v2.0 agents:**

| v6.1.0 Phase | v2.0 Owner |
|-------------|-----------|
| Phase 1: Discovery | Command itself (conversational) |
| Phase 2: Research | Researcher agents (parallel Task spawns) |
| Phase 2.5: Visual Reference | Researcher agent (reference track) |
| Phase 2.5: Competitive Benchmark | Researcher agent (benchmark track) |
| Phase 3: Brainstorm with Archetypes | Creative-director agent |
| Phase 3.5: DNA Generation | Creative-director agent |
| Phase 3.75: Content Planning | Content-specialist agent |

### Execute (CMND-04)

**Key insight:** The execute command essentially becomes a thin wrapper around the build-orchestrator agent from Phase 2. The command checks state, parses flags (--wave, --resume, --dry-run, --parallel), and dispatches to the orchestrator.

**The build-orchestrator handles:**
- Wave execution ordering
- Parallel builder spawning with Complete Build Context
- Canary checks and session boundaries
- CONTEXT.md rewriting
- Creative Director post-wave review

**Execute command only handles:**
- State check + auto-recovery
- Flag parsing
- Initial dispatch to build-orchestrator
- Session resume boot sequence

### Iterate (CMND-05) and Bug-Fix (CMND-06)

**Critical distinction per CONTEXT.md:**
- **Iterate** = creative brainstorm (2-3 approaches with ASCII mockups)
- **Bug-Fix** = diagnostic brainstorm (investigate root causes, then present fix)

**Shared behavior:**
- Both read CONTEXT.md for orientation
- Both respect discussion-first protocol
- Both check blast radius on adjacent sections
- Both make atomic commits

**Different behavior:**
- Iterate: mandatory creative brainstorm with mockups
- Bug-fix: mandatory diagnostic brainstorm with hypothesis testing
- Iterate: may propose structural changes
- Bug-fix: minimal changes only, preserve structure

---

## Open Questions

1. **Discussion tracking:** How does plan-dev know if lets-discuss has been run for the current phase? Need a tracking mechanism -- possibly a `discussions_completed` field in STATE.md or the existence of `DISCUSSION-{phase}.md`.

2. **Verify command fate:** The ROADMAP and CONTEXT.md list 6 core commands (start-project, lets-discuss, plan-dev, execute, iterate, bug-fix). But verification is critical to the workflow. Is it:
   - Absorbed into execute (post-wave quality gates)?
   - Merged into audit?
   - Kept as a utility command?
   - The answer likely is: quality is progressive (Phase 4), not a separate command. Post-wave audits happen automatically during execute. Full audit is a utility command.

3. **Command length targets:** Research suggests 80-150 lines per command. This needs validation during implementation -- some commands (start-project) may need more due to conversational flow logic.

4. **Research streaming format:** CONTEXT.md says "live progress streaming" during research. How exactly is this formatted in a markdown command definition? Likely: the command spawns parallel researchers and periodically reports on their progress. The exact format is Claude's discretion per CONTEXT.md.

5. **Multi-page support:** Commands currently assume single-page projects. Phase 8 introduces multi-page architecture. Commands may need future extension points, but this is out of scope for Phase 3.

---

## Sources

### Primary (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/slash-commands) -- Verified command format, frontmatter fields, argument substitution, subagent execution
- [Claude Code Plugins Documentation](https://code.claude.com/docs/en/plugins) -- Verified plugin structure, namespacing, manifest format
- [Claude Code SDK Slash Commands](https://platform.claude.com/docs/en/agent-sdk/slash-commands) -- Verified command file format, preprocessing, arguments
- v6.1.0 codebase at `D:/Modulo/Plugins/v0-ahh-skill/` -- All 13 command files, 17 agent files, plugin.json, hook script (directly read and analyzed)

### Secondary (MEDIUM confidence)
- `.planning/phases/02-pipeline-architecture/02-CONTEXT.md` -- Phase 2 decisions informing command dispatch targets
- `.planning/phases/03-command-system/03-CONTEXT.md` -- Phase 3 user decisions constraining implementation
- `.planning/research/ARCHITECTURE.md` -- v2.0 architecture patterns informing command structure

### Tertiary (LOW confidence)
- None -- all findings verified against primary or secondary sources

---

## Metadata

**Confidence breakdown:**
- Command file format: HIGH -- verified against official Claude Code documentation
- Architecture patterns: HIGH -- derived from v6.1.0 analysis + Phase 2 architecture + CONTEXT.md decisions
- Pitfalls: HIGH -- observed directly in v6.1.0 codebase analysis
- Phase 2 dependencies: MEDIUM -- Phase 2 is not yet implemented; agent contracts are from architecture research, not working code
- Lets-discuss patterns: MEDIUM -- most novel command with least v6.1.0 precedent

**Research date:** 2026-02-23
**Valid until:** Indefinite for command format; 30 days for architecture patterns (pending Phase 2 implementation)
