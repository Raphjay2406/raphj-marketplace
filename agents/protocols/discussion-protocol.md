# Discussion Protocol (v2.0)

Human-in-the-loop enforcement for critical decision points in the Modulo pipeline. This protocol ensures users maintain control over creative and structural decisions while allowing automated work to proceed uninterrupted within approved plans.

**Principle:** Discussion-first is the default. Automation proceeds only within explicitly approved scope.

---

## Who Follows This Protocol

| Agent | When |
|-------|------|
| Build-orchestrator | Before starting each wave (present wave plan + sections) |
| Creative Director | When flagging a section as below creative bar (present issues + required improvements) |
| Section-planner | When presenting master plan (layout assignments, beat sequence, wave structure) |
| Any agent | When deviating from an approved plan for any reason |

**Builders do NOT follow this protocol.** They execute approved PLAN.md tasks autonomously. Their scope was approved when the wave plan was approved. Deviations discovered during build are reported in SUMMARY.md for the orchestrator to surface.

---

## Decision Gates (When to Invoke)

### Gate 1: Master Plan Approval
**Trigger:** Section-planner has produced the master plan
**What to present:** Full wave map, layout assignments per section, beat sequence, section dependencies
**Who presents:** Section-planner (via orchestrator)
**User decides:** Approve, modify sections/layout/beats, or re-plan

### Gate 2: Wave Start
**Trigger:** Orchestrator is about to start a wave
**What to present:** Which sections build in this wave, which builder agents, any concerns from previous waves, lessons learned summary
**Who presents:** Build-orchestrator
**User decides:** Proceed, modify wave composition, or pause

### Gate 3: CD Section Flag
**Trigger:** Creative Director flags a section as below creative bar during post-wave review
**What to present:** Which section, specific issues (drift from archetype, missing creative tension, weak emotional beat), proposed improvements
**Who presents:** Creative Director (via orchestrator)
**User decides:** Accept CD's improvements, override and accept section as-is, or provide different direction

### Gate 4: Build Failure
**Trigger:** A section builder fails (error, timeout, incomplete output)
**What to present:** Which section failed, failure reason, impact on wave
**Who presents:** Build-orchestrator
**User decides:** Retry the section, skip and continue wave, or abort wave

### Gate 5: Canary Rot Detection
**Trigger:** Canary check scores ROT_DETECTED (0-2/5) per canary-check.md protocol
**What to present:** Canary score, specific questions that failed, evidence of drift
**Who presents:** Build-orchestrator
**User decides:** Start new session (recommended), continue with forced CONTEXT.md rewrite, or ignore

### Gate 6: Plan Deviation
**Trigger:** Any agent needs to deviate from an approved plan (unexpected dependency, missing content, scope change)
**What to present:** What was planned, what changed, why deviation is needed, proposed alternative
**Who presents:** The deviating agent (via orchestrator)
**User decides:** Approve deviation, reject and find alternative, or pause for discussion

---

## Protocol Steps

Every decision gate follows these 5 steps in order:

### Step 1: Present
State what you are about to do. Be clear, specific, and actionable.

### Step 2: Context
Explain why. Reference the plan, Design DNA, creative vision, or specific evidence that led to this decision point.

### Step 3: Options
Present available choices. Most gates have at minimum:
- **Proceed** -- what happens if they approve
- **Modify** -- what they can change
- **Skip/Abort** -- what happens if they decline (when applicable)

### Step 4: Wait
Stop and wait for user response before proceeding. No timeout. No default action. The user controls the pace.

### Step 5: Log
Record the decision:
- Wave-level decisions: logged in CONTEXT.md "Next Wave Instructions" section
- Plan-level decisions: logged in STATE.md
- Creative decisions: logged by CD in CONTEXT.md "Creative Direction Notes"

---

## Presentation Format

When presenting to the user, use this structured format:

```markdown
## [Agent Name]: [Action Type]

### What
[1-2 sentences: what will happen next]

### Why
[1-2 sentences: why this is the plan, referencing DNA/archetype/creative vision]

### Details
[Specifics: sections, files, dependencies, scores, evidence]

### Options
1. **Proceed** -- [what happens if approved]
2. **Modify** -- [what can be changed, with prompts]
3. **Skip** -- [consequences of skipping, if applicable]

Waiting for your input...
```

**Format rules:**
- Keep "What" to 1-2 sentences (not a paragraph)
- "Details" is the only section that can be long (tables, lists, evidence)
- Always end with "Waiting for your input..." to make the pause explicit
- Never present more than 3 options unless the situation genuinely requires it

---

## When NOT to Invoke

These operations proceed automatically without user discussion:

| Operation | Why Automatic |
|-----------|---------------|
| Builder executing PLAN.md tasks | Scope was approved at wave start (Gate 2) |
| CONTEXT.md rewrite after wave | Automated maintenance, no user decisions involved |
| Canary checks (HEALTHY/DEGRADING results) | Only ROT_DETECTED triggers discussion (Gate 5) |
| SUMMARY.md writing | Automated reporting, no user decisions involved |
| Design system collection | Orchestrator aggregates from SUMMARY.md files automatically |
| Quality reviewer scoring | Automated assessment; only CD flags trigger discussion (Gate 3) |
| Polisher applying GAP-FIX.md items | Fix scope was defined by reviewer; execution is mechanical |
| Spawn prompt generation | Orchestrator assembles from templates and current state |

**Guideline:** If the operation was already approved as part of a larger scope (wave approval, plan approval), it does not need re-approval at execution time.

---

## Emergency Override

The user can grant temporary autonomy to reduce discussion overhead:

| Override Scope | Grants | Typical Use |
|----------------|--------|-------------|
| "Auto-approve changes under N lines" | Small changes skip discussion | Minor iteration fixes |
| "Auto-approve this wave" | All section builds in current wave proceed without per-section checkpoints | User is confident in the plan |
| "Auto-approve this session" | All changes this session proceed | Rare; user has high trust and wants speed |

**Override rules:**
- Default is ALWAYS discussion-first. Override must be explicitly granted
- Override scope is stated by the user, not suggested by the agent
- Override expires at the stated boundary (wave end, session end)
- Critical gates (build failure, rot detection) are NEVER auto-approved regardless of override

---

## Protocol Violations

If an agent that should invoke this protocol proceeds without waiting for user input:

1. **Quality reviewer flags it** during post-wave review as a protocol violation
2. **Orchestrator logs it** in CONTEXT.md feedback loop as an AVOID item
3. **Next wave builders see it** in their "Lessons Learned" as a pattern to avoid
4. **User is informed** at the next decision gate that a previous step skipped discussion

A protocol violation does not invalidate the work done, but it erodes trust. The quality reviewer should note whether the autonomous action produced correct results (violation of process) or incorrect results (violation of process AND quality).

---

## Applicability Map (v2.0)

| Command/Agent | Applies? | Notes |
|---------------|----------|-------|
| `/modulo:start-project` | NO | Discovery and research are exploratory, not code-modifying |
| `/modulo:lets-discuss` | NO | This IS the discussion -- user is already engaged |
| `/modulo:plan-dev` | Partial | Master plan requires approval (Gate 1); individual plan generation is automated |
| `/modulo:execute` | YES | Wave start (Gate 2); CD flags (Gate 3); failures (Gate 4) |
| `/modulo:iterate` | YES | Show exact diff preview before any change |
| `/modulo:bug-fix` | YES | Show diagnosis + fix plan before applying |
| Build-orchestrator | YES | Gates 2, 4, 5, 6 |
| Creative Director | YES | Gate 3 (section flags) |
| Section-planner | YES | Gate 1 (master plan) |
| Section-builder | NO | Executes approved plan autonomously; deviations in SUMMARY.md |
| Quality Reviewer | NO | Assessment is read-only; flags go through CD (Gate 3) |
| Polisher | NO | Executes reviewer prescriptions mechanically |
| Researcher | NO | Research is read-only information gathering |
