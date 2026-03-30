# Context Rot Prevention & Quality Enforcement System

**Date:** 2026-02-16
**Status:** Approved
**Approach:** Context Budget Architecture + 2-Wave Session Sharding Hybrid

## Problem Statement

Context rot hits at wave 3-4 during Genorah design builds, causing:
1. **DNA drift** — Agent falls back to Tailwind defaults (shadow-md, rounded-lg, gap-4), forgets font pairing and color tokens
2. **Plan amnesia** — Agent forgets section plan details, wave order, emotional beat assignments
3. **Skill overload** — Too many skills loaded at once consume context window, accelerating rot
4. **Repetition loops** — Agent re-reads the same files multiple times, wasting context on redundant exploration

Current mitigations (80% rule in design-lead, .continue-here.md) are advisory and reactive.

## Solution Architecture

Six-layer defense system where each layer operates at a different cost level:

| Layer | Mechanism | Context Cost | What It Catches |
|-------|-----------|-------------|-----------------|
| **L0: Static enforcement** | Hooks (pre-commit, post-write) | **Zero** | DNA token violations, forbidden patterns |
| **L1: Identity anchoring** | CONTEXT.md (single file, rewritten per wave) | **Low** (~50 lines) | Full context recovery in 1 read |
| **L2: Build context** | Pre-extracted context in spawn prompts | **Amortized** | Eliminates redundant reads across N builders |
| **L3: Fidelity monitoring** | Canary checks after each wave | **Minimal** (5 questions) | Detects actual context degradation |
| **L4: Session management** | 2-wave suggestion + canary-triggered boundaries | **Zero** (policy) | Prevents late-session quality collapse |
| **L5: Quality gate** | Baked-in rules in agent files | **Zero** (already in prompt) | Eliminates external skill reads during builds |

## Layer 0: Static Enforcement via Hooks

### Pre-Commit Hook

A shell script in the plugin hooks configuration that runs before every git commit. Greps staged files for common anti-slop violations:

**Patterns to detect:**
- `shadow-md`, `shadow-lg`, `shadow-xl` (should use DNA shadow system)
- `rounded-lg`, `rounded-xl`, `rounded-2xl` without DNA variable (should use DNA radius)
- `text-gray-XXX` (should use DNA text tokens)
- `font-sans` without DNA variable (should use DNA fonts)
- `bg-blue-500`, `bg-indigo-500`, `bg-violet-500` (default AI-slop colors)
- `duration-300` without DNA variable (should use DNA timing)
- `gap-4` or `gap-6` used more than 3 times (uniform spacing = slop)
- Hardcoded hex values not in the DNA palette

**Behavior:**
- If violations found: block commit, output violation list with file:line references
- The hook reads forbidden patterns from `.planning/genorah/DESIGN-DNA.md` if it exists (project-specific enforcement)
- Falls back to generic anti-slop patterns if no DNA exists

### Post-Write Validation

After any file write to `src/components/` or similar source directories:
- Quick grep for forbidden Tailwind defaults
- Warning output (non-blocking) if violations detected
- Agent sees the warning and can self-correct before committing

### Implementation

Add to `.claude-plugin/plugin.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": { "tool_name": "Bash", "command_pattern": "git commit" },
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

Create `.claude-plugin/hooks/dna-compliance-check.sh` with the grep patterns.

## Layer 1: CONTEXT.md — Single Source of Truth

### Purpose

Replace the current multi-file context recovery (STATE.md + .continue-here.md + .session-transfer.md) with a single document that contains everything an agent needs to orient itself.

### Format

```markdown
# Genorah Context (auto-rewritten after each wave)
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
Beat sequence: [HOOK -> TEASE -> ... -> CLOSE with completed beats marked *]
Tensions: [section XX - Level N: technique name]
Wow moments: [section XX - moment type]
Current position: Wave [N], beat [type]

## Build State
| Section | Wave | Status | Layout Pattern | Beat | Background | Transition |
|---------|------|--------|---------------|------|-----------|------------|
| 00-shared | 0 | COMPLETE | -- | -- | -- | -- |
| 01-nav | 1 | COMPLETE | sticky-shrink | -- | transparent | -- |
| 02-hero | 2 | COMPLETE | split-hero-3d | HOOK | gradient-mesh | scroll-fade |
| 03-features | 2 | IN_PROGRESS | -- | BUILD | -- | acceleration |
| ... |

## Latest Wave Results
Sections built: [names]
Decisions made: [list]
Layout patterns now used: [list]
Patterns forbidden for next adjacent: [list]
DNA compliance: PASSED/ISSUES([details])
Canary check: PASSED/FAILED([which questions])

## Next Wave Instructions
Wave [N+1] sections: [list with beat types and wow/tension assignments]
PLAN.md paths: [list]
First action: Present wave summary to user (discussion-first protocol)
Session recommendation: [continue / new session recommended]
```

### Generation

- **Created during:** `/gen:start-design` (initial version with just DNA identity)
- **Updated during:** `/gen:plan-sections` (adds beat sequence, section table, wave map)
- **Rewritten after:** Every wave completion by the design-lead
- **Path:** `.planning/genorah/CONTEXT.md`

### Relationship to STATE.md

STATE.md continues to exist as the full status record (100 lines max, same as today). CONTEXT.md is the optimized read — it has everything STATE.md has plus DNA anchor plus wave results plus next instructions. Agents read CONTEXT.md for context recovery; STATE.md is the canonical record that CONTEXT.md is derived from.

## Layer 2: Pre-Extracted Build Context in Spawn Prompts

### Purpose

Eliminate redundant file reads by having the design-lead extract all necessary context and embed it directly in each builder's spawn prompt.

### Complete Build Context Template

The design-lead constructs this for each section-builder spawn:

```markdown
## Complete Build Context for [Section XX-name]

### DNA Identity (do NOT re-read any DNA files)
Archetype: [name]
Display: [font] | Body: [font]
Colors: [full token list with hex values]
Spacing: [scale]
Radius: [system]
Shadows: [system]
Motion: [easing, stagger, enter directions for this beat type]
FORBIDDEN: [patterns]

### Your Section Assignment
Beat: [type] | Wave: [N]
Wow moment: [type or "none"] [if assigned, include full implementation spec]
Creative tension: [type or "none"] [if assigned, include full spec]
Transition in: [technique] | Transition out: [technique]

### Beat Parameters (do NOT read emotional-arc skill)
Section height: [value] | Element density: [value]
Animation intensity: [value] | Whitespace ratio: [value]
Type scale: [value] | Layout complexity: [value]

### Adjacent Sections
Above: [section] [beat] [layout] [bg color] [bottom spacing]
Below: [section] [beat] [planned layout]
Visual continuity: Your layout MUST differ from [above pattern]. Your bg MUST contrast with [above bg].

### Layout Patterns Already Used
[list — pick a DIFFERENT one]

### Shared Components Available
[list from Wave 0/1 with import paths]

### Content for This Section (from CONTENT.md)
[exact copy pre-extracted for this section only]

### Quality Rules (do NOT read skill files)
Anti-slop quick: [5 critical checks]
Performance: transform/opacity only | dynamic import GSAP/Three.js | max 3 backdrop-blur | prefers-reduced-motion
Micro-copy: No "Submit", "Learn More", "Click Here" | Outcome-driven CTAs
DNA compliance: ONLY DNA tokens | NO raw hex outside palette | NO font-sans/Inter/Roboto

### YOUR TASK: Read ONLY your PLAN.md at [path], then build.
```

### Builder File Reads Per Section

**Before (current):** ~6-8 file reads per builder
- DESIGN-DNA.md, BRAINSTORM.md, CONTENT.md, REFERENCES.md, shared components, PLAN.md, skill files

**After (optimized):** 1 file read per builder
- PLAN.md only (everything else is in the spawn prompt)

**Context savings:** ~5-7 file reads eliminated per builder x 4 builders per wave = 20-28 fewer file reads per wave.

## Layer 3: Canary Checks — Fidelity Monitoring

### Purpose

Detect actual context degradation by testing whether the design-lead still has accurate knowledge, not by guessing from token counts.

### Protocol

After every wave completion, before spawning the next wave, the design-lead answers 5 questions from memory, then verifies against CONTEXT.md:

1. What is our display font?
2. What is accent-1 hex value?
3. What patterns are forbidden by the archetype?
4. What layout patterns have been used so far?
5. What beat type is assigned to the next section to build?

### Triggers

- **All 5 correct:** Continue. Context is healthy.
- **1-2 wrong:** Re-read CONTEXT.md in full. Continue with caution. Note in CONTEXT.md that fidelity is degrading.
- **3+ wrong:** TRIGGER SESSION BOUNDARY. Context rot is active. Save state, recommend new session.

### Integration

Baked directly into `design-lead.md` as a mandatory step between waves. Not a separate agent or skill read.

## Layer 4: Session Management Policy

### 2-Wave Session Suggestion

After every 2 completed waves, the design-lead recommends a new session:

```
Wave [N] and [N+1] complete. [X] sections built this session.

Recommendation: Start a new session for Wave [N+2] to ensure peak quality.
State saved to CONTEXT.md.

To continue: Run `/gen:execute resume` in a new session.
To override: Say "continue in this session" (canary checks will still monitor fidelity).
```

### Turn-Based Backup

- **Turn 1-20:** Normal operation
- **Turn 21-30:** Yellow zone. Canary checks become mandatory after every wave (not just every 2).
- **Turn 31+:** Complete current wave, then MANDATORY session save. No override.

### Session Boot Protocol (for `/gen:execute resume`)

1. Read `.planning/genorah/CONTEXT.md` (single file, complete context)
2. Read next wave's section `PLAN.md` files
3. Run Canary Check (verify understanding)
4. Present wave summary to user (discussion-first protocol)
5. Begin building

**3-4 file reads total to resume.** No exploration needed.

## Layer 5: Baked-In Quality Rules

### Purpose

Eliminate the need for section builders to read external skill files during build time by embedding the most critical rules directly in the agent markdown files.

### Rules to Bake into `section-builder.md`

**Anti-Slop Quick Check (5 items):**
1. Primary color is NOT default blue/indigo/violet
2. Display font is NOT Inter/Roboto/system-ui
3. Shadows are layered (not just shadow-md)
4. Spacing varies (not uniform gap-4)
5. At least one hover state per interactive element

**Performance Rules:**
- ALLOWED animations: transform, opacity, filter, clip-path
- FORBIDDEN animations: width, height, top, left, margin, padding
- Dynamic import: GSAP, Three.js (never top-level)
- Max 3 backdrop-blur per viewport
- will-change on max 5 elements
- prefers-reduced-motion fallback on ALL animations

**Beat Parameter Table:**
Embed the full 10-beat parameter table (section height, density, animation intensity, whitespace ratio, type scale, layout complexity) directly in section-builder.md so builders never need to read the emotional-arc skill.

**Task-Level DNA Checkpoints:**
Keep the existing 3-question quick check after every task and 7-question expanded check every 3rd task, but make them self-contained (no "reference the X skill" instructions).

### Rules to Bake into `design-lead.md`

**Valid Beat Sequence Rules:**
Embed the REQUIRED and FORBIDDEN beat sequence rules directly (currently references emotional-arc skill).

**Canary Check Protocol:**
The 5-question fidelity test with trigger thresholds.

**Context Budget Thresholds:**
Turn-based zones with specific actions per zone.

**Wave Report Generation:**
Template for rewriting CONTEXT.md after each wave.

## Files to Create

| File | Purpose |
|------|---------|
| `.claude-plugin/hooks/dna-compliance-check.sh` | Pre-commit DNA validation hook |
| `docs/plans/2026-02-16-context-rot-prevention-design.md` | This design document |

## Files to Modify

| File | Changes |
|------|---------|
| `.claude-plugin/plugin.json` | Add hooks configuration |
| `agents/design-lead.md` | Add CONTEXT.md generation, canary checks, context budget, pre-extracted spawn prompts, baked-in beat sequence rules |
| `agents/section-builder.md` | Add baked-in anti-slop/performance/beat rules, change file read protocol to PLAN.md only |
| `commands/execute.md` | Add session boot protocol for resume, 2-wave session suggestion |
| `commands/start-design.md` | Add initial CONTEXT.md generation after DNA creation |
| `commands/plan-sections.md` | Add CONTEXT.md update with beat sequence and section table |
| `commands/verify.md` | Reference CONTEXT.md instead of multiple files for initial read |
| `commands/iterate.md` | Reference CONTEXT.md for state recovery |

## Success Criteria

1. Section builders read exactly 1 file (PLAN.md) to build a section — everything else is in spawn prompt
2. Session resume requires reading exactly 1-2 files (CONTEXT.md + PLAN.md files)
3. Canary checks detect context rot before it affects output quality
4. Pre-commit hooks catch DNA token violations with zero context window cost
5. Quality remains consistent through wave 5+ (currently degrades at wave 3-4)
6. No skill files are read during build time — all critical rules baked into agents

## Out of Scope

- Changes to the quality verification system (verify command) — already comprehensive
- Changes to the skill content itself — only how/when skills are referenced
- New skills — this design improves the existing system
- Multi-page coherence — addressed separately
