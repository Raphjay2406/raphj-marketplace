# Phase 10: Wire Quality Enforcement into Build Pipeline - Research

**Researched:** 2026-02-25
**Domain:** Markdown-based plugin architecture (agent protocol wiring)
**Confidence:** HIGH

## Summary

This phase closes GAP-1 (CRITICAL) from the v1 milestone audit: the build-orchestrator's 12-step wave protocol has no steps for spawning the creative-director (CD) or quality-reviewer (QR) after each wave, meaning the entire Phase 4 quality enforcement system is dead during `/execute`. Additionally, the findings merge protocol, running tally management, GAP-FIX-to-polisher loop, and wave review gate are all specified in the `quality-gate-protocol` skill but never implemented in the build-orchestrator's protocol.

The fix is entirely markdown editing -- no code, no tests, no dependencies to install. The changes are confined to one primary file (`agents/pipeline/build-orchestrator.md`) with a minor update to `commands/execute.md`. The specifications for what CD/QR do are already complete (Phase 2, Phase 4). What is missing is the orchestrator-side wiring: when to spawn them, how to merge their findings, what blocks the next wave, and how GAP-FIX flows to the polisher.

**Primary recommendation:** Add Steps 5.5 (Pre-Build CD Review), 6.5 (Post-Wave CD+QR Parallel Review), 6.6 (Findings Merge + Severity Classification), 6.7 (GAP-FIX-to-Polisher Loop), and 6.8 (Wave Review Gate) to the build-orchestrator protocol. Update the `tools:` frontmatter to include `creative-director`, `quality-reviewer`, and `polisher`. Add running tally management to STATE.md updates.

## Standard Stack

This is a markdown-only phase. No libraries, no code, no build tools.

### Core Files to Modify

| File | Purpose | Change Type |
|------|---------|-------------|
| `agents/pipeline/build-orchestrator.md` | Wave protocol, tools frontmatter | PRIMARY -- add 5 new steps, update frontmatter, add running tally protocol |
| `commands/execute.md` | Dispatch description | MINOR -- verify CD/QR references in dispatch section match new protocol |

### Files to Reference (read-only, do not modify)

| File | Purpose | What to Extract |
|------|---------|-----------------|
| `agents/pipeline/creative-director.md` | CD input/output contract | Two-checkpoint protocol (pre-build light, post-build thorough), GAP-FIX.md format, creative direction notes protocol |
| `agents/pipeline/quality-reviewer.md` | QR input/output contract | 3-level verification, anti-slop scoring, GAP-FIX.md format, lessons learned aggregation |
| `agents/pipeline/polisher.md` | Polisher input contract | Reads exactly 3 things (GAP-FIX.md + code + DNA), one GAP-FIX per invocation, scope discipline |
| `skills/quality-gate-protocol/SKILL.md` | Enforcement specification | 4-layer system, severity classification, running tally format, findings merge protocol, user checkpoint triggers, remediation protocol, 8 anti-patterns |

## Architecture Patterns

### Current Build-Orchestrator Protocol (12 Steps -- the gap)

```
Step 1:  Read State (CONTEXT.md, MASTER-PLAN.md, DESIGN-SYSTEM.md)
Step 2:  Verify Dependencies
Step 3:  Read Current Wave PLANs
Step 4:  Construct Spawn Prompts
Step 5:  Spawn Parallel Builders (max 4)
Step 6:  Collect Results (read SUMMARY.md files)
                              <-- GAP: No CD pre-build review
                              <-- GAP: No CD/QR post-build review
                              <-- GAP: No findings merge
                              <-- GAP: No GAP-FIX -> polisher loop
                              <-- GAP: No wave review gate
Step 7:  Post-Wave Coherence Checkpoint
Step 8:  Aggregate Design System
Step 9:  Canary Check
Step 10: Rewrite CONTEXT.md
Step 11: Update STATE.md
Step 12: Session Boundary Check
```

### Target Build-Orchestrator Protocol (with new steps)

The quality-gate-protocol skill defines a "Complete Wave Execution Timeline" (Layer 3, Integration Context section) that specifies exactly where CD and QR fire. The new steps must match this specification.

```
Step 1:    Read State
Step 2:    Verify Dependencies
Step 3:    Read Current Wave PLANs
Step 4:    Construct Spawn Prompts
Step 4.5:  [NEW] Pre-Build CD Review (light, blocking)
               CD reviews wave's PLAN.md files for creative ambition
               CD returns APPROVED or revision notes
               If revision notes: update spawn prompts, then proceed
Step 5:    Spawn Parallel Builders (max 4)
Step 6:    Collect Results
Step 6.5:  [NEW] Post-Wave CD+QR Review (parallel)
               Spawn CD (post-build thorough review) and QR (3-level
               verification + anti-slop scoring) in PARALLEL via Task tool
               Both produce findings independently
Step 6.6:  [NEW] Findings Merge + Severity Classification
               Merge CD and QR findings
               Deduplicate (same section, same issue -> keep more specific)
               Classify each finding: CRITICAL / WARNING / INFO
               Create GAP-FIX.md for sections with CRITICAL/WARNING needing fixes
Step 6.7:  [NEW] GAP-FIX-to-Polisher Loop
               For each section with GAP-FIX.md:
                 Spawn polisher (one per section, parallel)
                 Polisher applies fixes atomically
               After polisher completes:
                 QR re-scores FULL gate (not partial)
                 If still failing after 2 cycles: escalate to user
Step 6.8:  [NEW] Wave Review Gate
               CRITICAL findings -> BLOCK pipeline, escalate to user
               WARNING findings -> Add to running tally, continue
               INFO findings -> Log in report only
               Update running tally in STATE.md
Step 7:    Post-Wave Coherence Checkpoint (existing)
Step 8:    Aggregate Design System (existing)
Step 9:    Canary Check (existing)
Step 10:   Rewrite CONTEXT.md (existing -- add CD creative notes)
Step 11:   Update STATE.md (existing -- add running tally update)
Step 12:   Session Boundary Check (existing)
```

### Pattern 1: Parallel CD+QR Spawning

**What:** CD and QR check orthogonal concerns (creative vs. technical). They share no dependencies and can run simultaneously.

**Why this matters:** Running them sequentially is explicitly called out as Anti-Pattern 6 in quality-gate-protocol. The build-orchestrator must spawn both via the Task tool in parallel.

**Implementation pattern in orchestrator markdown:**
```
### Step 6.5: Post-Wave Quality Review (Parallel)

Spawn BOTH agents via Task tool simultaneously:

**Task 1: Creative Director Post-Build Review**
- Agent: creative-director
- Input: Current wave section names, paths to built code files
- CD reads: DESIGN-DNA.md, BRAINSTORM.md, wave PLAN.md files, built code, CONTEXT.md
- CD outputs: Per-section verdict (ACCEPT/FLAG), GAP-FIX.md for flagged sections, creative direction notes

**Task 2: Quality Reviewer Post-Wave Verification**
- Agent: quality-reviewer
- Input: Current wave section names
- QR reads: DESIGN-DNA.md, PLAN.md files (must_haves), SUMMARY.md files, CONTENT.md, REFERENCES.md, CONTEXT.md, built code
- QR outputs: Verification report (3-level per section), anti-slop scores, GAP-FIX.md for failing sections, lessons learned
```

### Pattern 2: Findings Merge Protocol

**What:** After CD and QR complete, the build-orchestrator merges findings into a single quality report.

**Source:** quality-gate-protocol SKILL.md, "Findings Merge Protocol" section.

**Steps:**
1. Collect all findings from QR verification report and CD creative assessment
2. Deduplicate -- if both flag the same section for the same issue, keep the more specific finding
3. Classify each finding by severity (CRITICAL/WARNING/INFO) using the severity tables
4. Create GAP-FIX.md for any section with CRITICAL or WARNING findings that require code changes
5. Update running tally with new WARNING entries
6. Block on CRITICAL -- if any CRITICAL finding exists, stop the pipeline and escalate to user

**CD severity mapping:**
- Archetype forbidden pattern detected -> CRITICAL
- Section "below creative bar" / not screenshot-worthy -> WARNING
- "Could be bolder" / improvement opportunity -> WARNING
- Positive observations, strengths noted -> INFO

### Pattern 3: Running Tally in STATE.md

**What:** The build-orchestrator maintains a running tally of WARNING-level findings across all waves, stored in STATE.md.

**Source:** quality-gate-protocol SKILL.md, "Running Tally Format" section.

**Format to add to STATE.md updates (Step 11):**
```markdown
## Build Quality Status

### Overall: IN_PROGRESS | Wave [N] of [M]
### Critical Issues: [N] ([blocking / none])
### Warning Tally: [N] accumulated

| # | Wave | Section | Warning | Source | Severity |
|---|------|---------|---------|--------|----------|
| 1 | 1 | 02-logos | Lighthouse performance 83 | QR | warning |

### Anti-Slop Scores by Section
| Section | Score | Rating |
|---------|-------|--------|
| 01-hero | 30/35 | SOTD-READY |

### Health: [GOOD | CONCERNING | CRITICAL]
```

**Health thresholds:**
- GOOD: No critical issues, warnings < 5
- CONCERNING: No critical issues, warnings 5-10
- CRITICAL: Any critical issue present

### Pattern 4: Remediation Loop (max 2 cycles)

**What:** When a section FAILs the gate (anti-slop < 25 or CRITICAL finding), the polisher runs, then QR re-scores. Max 2 cycles before user escalation.

**Source:** quality-gate-protocol SKILL.md, "Remediation Protocol" section.

**Remediation priority order:**
1. Penalty fixes first (highest point impact: -3 to -5 per penalty)
2. Highest-point category failures next
3. Lowest-point category issues last

**Loop:**
```
Cycle 1: QR/CD create GAP-FIX.md -> Polisher executes -> QR re-scores FULL gate
Cycle 2: If still failing -> second GAP-FIX.md -> Polisher -> QR re-scores
Cycle 3: If still failing -> ESCALATE to user with full evidence
```

### Pattern 5: Pre-Build CD Review (Light, Blocking)

**What:** Before builders execute each wave, CD does a quick (~5 min) scan of PLAN.md files for creative ambition.

**Source:** creative-director.md, "Checkpoint 1: Pre-Build Review" section.

**This is blocking but lightweight.** If CD returns revision notes, the orchestrator must incorporate them into spawn prompts before spawning builders. This means Step 4.5 goes BETWEEN prompt construction (Step 4) and builder spawning (Step 5).

**CD output at this checkpoint:**
- "APPROVED" -- proceed to building
- Specific revision notes per section -- orchestrator updates spawn prompts

### Anti-Patterns to Avoid (from quality-gate-protocol Layer 4)

These 8 anti-patterns are already documented in the skill but MUST be respected in the orchestrator protocol:

1. **Running Layer 3 tests per wave** -- Layer 3 (live testing) runs ONCE after all waves, not per-wave
2. **Auto-retrying on critical failures** -- Critical failures escalate to user (Phase 2 locked decision)
3. **Treating all findings as equal severity** -- Use 3-tier system (CRITICAL/WARNING/INFO)
4. **Warning fatigue from INFO items** -- Only CRITICAL and WARNING in tally, never INFO
5. **Skipping Layer 4 because no criticals** -- Checkpoint triggers on accumulated WARNINGS too
6. **Running CD and QR sequentially** -- They run in PARALLEL
7. **Blocking pipeline on warnings** -- Only CRITICALs block; WARNINGs accumulate
8. **User checkpoint on every wave** -- Per-wave: only CRITICALs escalate; full checkpoint at Layer 4

## Don't Hand-Roll

Problems that look simple but have existing specifications:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Severity classification | Invent your own severity rules | quality-gate-protocol severity tables | 3 complete tables (CRITICAL/WARNING/INFO) with every condition, detection layer, and evidence requirement already defined |
| Findings merge logic | Create ad-hoc merge process | quality-gate-protocol "Findings Merge Protocol" | 6-step deduplication + classification protocol already specified with CD-to-severity mapping |
| Running tally format | Invent STATE.md format | quality-gate-protocol "Running Tally Format" | Complete markdown template with health thresholds already defined |
| GAP-FIX.md format | Create new gap-fix format | quality-reviewer.md GAP-FIX format AND creative-director.md Flag format | Both agents already define their exact GAP-FIX.md output format |
| Remediation protocol | Design retry logic | quality-gate-protocol "Remediation Protocol" | Max 2 cycles, priority order (penalties first), escalation path all specified |
| User checkpoint format | Design user-facing output | quality-gate-protocol "User Checkpoint Presentation" | Two templates (mandatory checkpoint, auto-proceed) with exact fields |
| CD severity mapping | Guess how CD findings map to severity | quality-gate-protocol findings merge section | Explicit mapping: forbidden pattern=CRITICAL, below-bar=WARNING, could-be-bolder=WARNING, positive=INFO |
| Polisher invocation model | One polisher for all sections | polisher.md scope discipline rule 6 | "One GAP-FIX.md per invocation. If multiple sections have GAP-FIX.md files, the orchestrator spawns separate polisher instances." |

**Key insight:** All the WHAT is already defined in Phase 2 and Phase 4 artifacts. This phase is purely about wiring the WHEN and HOW into the build-orchestrator's protocol. Do not redefine severity levels, scoring thresholds, or review criteria -- just reference the existing specifications.

## Common Pitfalls

### Pitfall 1: Overloading the Build-Orchestrator's Context Window

**What goes wrong:** Adding too many new responsibilities (findings merge, running tally, remediation loops) causes the orchestrator to exceed its effective context window capacity, degrading output quality on later waves.

**Why it happens:** The build-orchestrator already reads 5 file types and maintains a strict context budget. Adding review-related logic expands what it must track.

**How to avoid:** Keep the new steps in the orchestrator as COORDINATION logic only. The orchestrator spawns CD/QR/polisher and reads their OUTPUT. It does NOT replicate their review criteria. The orchestrator's role in the merge step is mechanical (collect, deduplicate, classify using the predefined severity tables), not judgmental.

**Warning signs:** Orchestrator protocol section for CD/QR review exceeds 100 lines. If it does, you are embedding review logic that belongs in the agents, not the orchestrator.

### Pitfall 2: Making CD Pre-Build Review a Heavyweight Step

**What goes wrong:** The pre-build CD review becomes a thorough review that takes as long as the post-build review, doubling pipeline latency per wave.

**Why it happens:** The CD agent has a thorough review checklist (8 creative dimensions). If the orchestrator's prompt for the pre-build review does not emphasize "light, ~5 minutes", the CD will default to its full review protocol.

**How to avoid:** The spawn prompt for Step 4.5 MUST explicitly state "Checkpoint 1 only (pre-build light review). Scan for creative ambition, not deep analysis. ~5 minute time target." Reference creative-director.md Checkpoint 1 specifically.

**Warning signs:** The pre-build review spawn prompt does not mention "light" or "Checkpoint 1" or the time target.

### Pitfall 3: Forgetting the Polisher's One-Per-Section Model

**What goes wrong:** The orchestrator spawns a single polisher to fix all sections' GAP-FIX.md files. The polisher reads too much context and scope discipline breaks down.

**Why it happens:** It seems efficient to batch fixes. But the polisher is intentionally a LOW-context agent that reads exactly 3 things per invocation.

**How to avoid:** polisher.md rule 6 is explicit: "One GAP-FIX.md per invocation. If multiple sections have GAP-FIX.md files, the orchestrator spawns separate polisher instances." The orchestrator must spawn N polisher instances in parallel, one per GAP-FIX.md.

**Warning signs:** The orchestrator protocol says "spawn polisher with all GAP-FIX.md files" or similar batching language.

### Pitfall 4: Not Updating tools: Frontmatter

**What goes wrong:** The new steps reference creative-director, quality-reviewer, and polisher as Task agents, but the `tools:` frontmatter still only lists builders. Claude Code may not be able to spawn these agents.

**Why it happens:** The frontmatter line is easy to overlook since the protocol body is the focus.

**How to avoid:** The FIRST change should be updating the frontmatter:
```yaml
tools: Read, Write, Edit, Bash, Grep, Glob, Task(section-builder, 3d-specialist, animation-specialist, content-specialist, creative-director, quality-reviewer, polisher)
```

### Pitfall 5: Running Tally Not Persisted Across Sessions

**What goes wrong:** The running tally lives only in the orchestrator's context window and is lost on session boundary. Next session starts with a clean tally, and accumulated warnings disappear.

**Why it happens:** STATE.md updates (Step 11) do not include tally updates.

**How to avoid:** The running tally MUST be written to STATE.md at Step 11. The quality-gate-protocol already specifies the format (Build Quality Status section). Step 11 must be updated to include tally persistence.

### Pitfall 6: Forgetting to Include CD Creative Notes in CONTEXT.md Rewrite

**What goes wrong:** CD writes creative direction notes after post-build review, but the orchestrator's CONTEXT.md rewrite (Step 10) does not incorporate them. Next wave's builders miss CD observations.

**Why it happens:** The CONTEXT.md template already has a "Creative Direction Notes (from CD review)" section, but the orchestrator protocol for Step 10 does not mention reading CD's output to populate it.

**How to avoid:** Step 10 (Rewrite CONTEXT.md) must explicitly state: "Read CD's creative direction notes from its output. Include in the 'Creative Direction Notes' section. Read QR's lessons learned from its output. Include in the 'Feedback Loop' section."

### Pitfall 7: CD Revision Notes Not Flowing Back to Spawn Prompts

**What goes wrong:** CD flags plan revisions at pre-build review (Step 4.5), but the orchestrator does not update the already-constructed spawn prompts before spawning builders.

**Why it happens:** Step 4 (Construct Spawn Prompts) runs before Step 4.5 (Pre-Build CD Review). If CD requests revisions, the prompts need updating.

**How to avoid:** Two options:
1. Move CD pre-build review to Step 3.5 (before prompt construction), then incorporate notes at Step 4
2. Keep at Step 4.5 but add explicit "update spawn prompts with CD revision notes" sub-step

Option 1 is cleaner because it avoids prompt reconstruction.

## Code Examples

Since this is a markdown-only phase, "code examples" here are the exact protocol text to add to the build-orchestrator.

### Tools Frontmatter Update

```yaml
---
name: build-orchestrator
description: "Coordinates wave-based design execution. Reads CONTEXT.md for state and DNA identity, MASTER-PLAN.md for wave map, and current wave PLAN.md files to construct spawn prompts. Spawns parallel section-builders (and specialists) with pre-extracted context via Task tool. Runs post-wave quality review (CD + QR in parallel), manages GAP-FIX remediation loop, maintains running tally, coherence checks, canary checks, session boundary management, and maintains DESIGN-SYSTEM.md."
tools: Read, Write, Edit, Bash, Grep, Glob, Task(section-builder, 3d-specialist, animation-specialist, content-specialist, creative-director, quality-reviewer, polisher)
model: inherit
maxTurns: 50
---
```

### New Step Structure (Protocol Text Patterns)

**Step 3.5: Pre-Build Creative Director Review**
```markdown
### Step 3.5: Pre-Build Creative Director Review

Spawn creative-director via Task tool for Checkpoint 1 (pre-build light review):

**Spawn prompt must include:**
- Explicit instruction: "Checkpoint 1 only (pre-build light review). ~5 minute time target."
- Current wave's PLAN.md file paths
- Previous wave creative direction notes (from CONTEXT.md)

**CD returns one of:**
- "APPROVED" -- proceed to Step 4 (Construct Spawn Prompts)
- Revision notes per section -- incorporate into PLAN.md context at Step 4

If revision notes exist: note them for inclusion in spawn prompts at Step 4.
The review is BLOCKING -- do not spawn builders until CD completes.
```

**Step 6.5: Post-Wave Quality Review**
```markdown
### Step 6.5: Post-Wave Quality Review (Parallel)

After collecting results (Step 6), spawn BOTH review agents simultaneously via Task tool:

**Task A: Creative Director Post-Build Review**
- Agent: creative-director
- Instruction: "Checkpoint 2 (post-build thorough review) for Wave [N]"
- Input: current wave section names and built file paths
- CD reads its own contracted files (DESIGN-DNA.md, BRAINSTORM.md, PLAN.md files, built code, CONTEXT.md)
- Expected output: per-section verdict (ACCEPT/FLAG), GAP-FIX.md for flagged sections, creative direction notes

**Task B: Quality Reviewer Post-Wave Verification**
- Agent: quality-reviewer
- Instruction: "Post-wave verification for Wave [N]"
- Input: current wave section names
- QR reads its own contracted files (DESIGN-DNA.md, PLAN.md files, SUMMARY.md files, built code, CONTENT.md, REFERENCES.md, CONTEXT.md)
- Expected output: verification report, anti-slop scores, GAP-FIX.md for failing sections, lessons learned

Both agents run in parallel. Wait for BOTH to complete before proceeding to Step 6.6.
```

**Step 6.6: Findings Merge**
```markdown
### Step 6.6: Findings Merge + Severity Classification

After CD and QR complete:

1. **Collect** all findings from QR verification report and CD creative assessment
2. **Deduplicate** -- if both flag the same section for the same issue, keep the more specific finding
3. **Classify** each finding by severity:
   - CRITICAL: anti-slop < 25, archetype forbidden pattern, missing signature element entirely, build failure
   - WARNING: anti-slop 25-27, CD below-creative-bar, spacing inconsistency, could-be-bolder
   - INFO: score breakdowns, positive observations, strengths noted
4. **Log** all findings in a wave quality report
```

**Step 6.7: GAP-FIX Remediation Loop**
```markdown
### Step 6.7: GAP-FIX Remediation Loop

For each section with a GAP-FIX.md file (from CD or QR):

1. Spawn a SEPARATE polisher instance per section via Task tool (parallel, max 4)
2. Each polisher reads: its GAP-FIX.md + listed code files + DESIGN-DNA.md
3. After all polishers complete, spawn QR to re-score the FULL gate for fixed sections
4. If still failing: create second GAP-FIX.md, repeat cycle (max 2 remediation cycles)
5. If still failing after 2 cycles: escalate to user with full evidence

Remediation priority (polisher handles internally, but orchestrator verifies):
- Penalty fixes first (-3 to -5 points each)
- Highest-point category failures next
- Lowest-point issues last

If no GAP-FIX.md files were created: skip this step entirely.
```

**Step 6.8: Wave Review Gate**
```markdown
### Step 6.8: Wave Review Gate

Based on merged findings:

- **Any CRITICAL finding exists:** BLOCK pipeline. Report to user with evidence. Wait for user decision.
- **WARNING findings only:** Add to running tally in STATE.md. Log real-time status:
  ```
  Wave [N] complete -- [X] warnings pending
    [warn] Section XX-name: [warning description]
  ```
  Continue to Step 7.
- **Clean (no CRITICAL, no WARNING):** Continue to Step 7.
```

## State of the Art

| Old Approach (Current) | New Approach (Target) | Impact |
|------------------------|----------------------|--------|
| No CD/QR invocation during /execute | CD+QR parallel after every wave | Quality enforcement fires automatically |
| tools: frontmatter lists only builders | tools: includes CD, QR, polisher | Orchestrator can actually spawn review agents |
| No GAP-FIX.md flow during build | GAP-FIX -> polisher -> re-review loop | Automatic remediation with max 2 cycles |
| No running tally | Warning tally in STATE.md persisted across sessions | Accumulated quality signals surface at user checkpoint |
| No pre-build creative review | CD light review before builder spawning | Creative misalignment caught before code is written |
| No wave review gate | Gate blocks on CRITICAL, continues on WARNING | Proportionate response to quality findings |
| CONTEXT.md has placeholder CD notes section | CD notes populated from actual CD review output | Next wave builders receive real creative feedback |
| Step 11 updates section statuses only | Step 11 also updates Build Quality Status tally | Quality state persists across sessions |

## Open Questions

### 1. Step Numbering Strategy

**What we know:** The current steps are numbered 1-12. We need to insert 5 new steps.

**What's unclear:** Should we renumber all steps (1-17) or use sub-numbering (3.5, 6.5, 6.6, 6.7, 6.8)?

**Recommendation:** Use sub-numbering (3.5, 6.5-6.8) for this initial fix to minimize diff size and preserve existing step references in other documentation. A future cleanup phase could renumber if desired. However, if the planner decides full renumbering is cleaner, that works too -- just be aware that execute.md line 79 and any other references to "12-step protocol" would need updating.

### 2. maxTurns Increase Needed?

**What we know:** The build-orchestrator has `maxTurns: 50`. The new steps add spawning CD, QR, and polisher agents plus findings merge logic per wave.

**What's unclear:** Whether 50 turns is still sufficient for a 4-wave build with quality review per wave.

**Recommendation:** A 4-wave build with review: ~12 turns per wave (spawn builders, collect, spawn CD+QR, collect, merge, possibly spawn polisher, collect, coherence, canary, rewrite) = ~48 turns. This is tight. Consider increasing to 60 or noting this as a potential issue to watch. The session boundary system at turn 31+ provides a safety net.

### 3. Where Exactly Does Pre-Build CD Review Go?

**What we know:** CD pre-build review must happen before builders spawn but needs access to the PLAN.md files.

**What's unclear:** Whether to put it at Step 3.5 (before prompt construction) or Step 4.5 (after prompt construction but before spawning).

**Recommendation:** Step 3.5 is better. The CD reviews the PLAN.md files directly (not the spawn prompts). If CD has revision notes, the orchestrator incorporates them when constructing spawn prompts at Step 4. This avoids the need to reconstruct already-built prompts.

### 4. End-of-Build Polish Pass Triggering

**What we know:** The quality-gate-protocol defines a full polish pass AFTER all waves complete but BEFORE Layer 3 (live testing). The polisher.md and polish-pass SKILL.md describe this as a dedicated finishing pass with full creative license.

**What's unclear:** Should this phase wire the end-of-build polish pass into the orchestrator, or is that a separate concern?

**Recommendation:** The end-of-build polish pass is a Layer 2.5 concern (between all waves completing and Layer 3 live testing). It is closely related to this phase's scope but could be considered part of the "after all waves" flow rather than the "per-wave" flow. Include a brief "After Final Wave" section in the orchestrator that triggers the full polish pass, but keep it minimal -- the per-wave quality loop is the primary deliverable.

## Sources

### Primary (HIGH confidence)
- `agents/pipeline/build-orchestrator.md` -- Read in full. 550 lines. Current 12-step protocol, tools frontmatter, CONTEXT.md rewrite template, coherence checks, canary check, builder routing
- `agents/pipeline/creative-director.md` -- Read in full. 269 lines. Two-checkpoint protocol, 8 creative dimensions, GAP-FIX.md format, creative direction notes protocol
- `agents/pipeline/quality-reviewer.md` -- Read in full. 363 lines. 3-level verification, 35-point anti-slop scoring with full per-check reference, GAP-FIX.md format, severity classification, lessons learned aggregation, remediation protocol
- `agents/pipeline/polisher.md` -- Read in full. 191 lines. Input contract (exactly 3 things), fix protocol (5 steps), scope discipline rules (6 rules), one-per-section model
- `skills/quality-gate-protocol/SKILL.md` -- Read in full. 465 lines. 4-layer enforcement system, severity classification tables, running tally format, findings merge protocol, user checkpoint presentation, remediation protocol, 8 anti-patterns
- `commands/execute.md` -- Read in full. 128 lines. Dispatch to build-orchestrator, mentions CD review but no implementation

### Secondary (HIGH confidence)
- `.planning/v1-MILESTONE-AUDIT.md` -- Read in full. 173 lines. GAP-1 definition, impact analysis, broken flows identification
- `agents/pipeline/section-builder.md` -- Read in full. 441 lines. Builder's self-check protocol (Layer 1), SUMMARY.md format

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all files read directly from codebase, no external dependencies
- Architecture: HIGH -- target protocol is fully specified in quality-gate-protocol SKILL.md Layer 3 "Complete Wave Execution Timeline"
- Pitfalls: HIGH -- derived directly from quality-gate-protocol anti-patterns and agent input/output contracts
- Open questions: MEDIUM -- step numbering and maxTurns are implementation details that need planner judgment

**Research date:** 2026-02-25
**Valid until:** Indefinite (codebase-internal research, no external dependencies to go stale)
