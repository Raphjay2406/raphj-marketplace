---
name: "error-recovery"
description: "Structured error diagnosis, severity classification, fix option presentation, checkpoint resume, and failure pattern tracking"
tier: "core"
triggers: "error, failure, crash, resume, recovery, diagnosis, fix, retry, checkpoint, FAILURE-LOG"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Build task fails** -- Classify severity, diagnose root cause, present fix options
- **Section builder crashes or times out** -- Detect interrupted state from SUMMARY.md, present resume options
- **Session interrupted** -- Detect completed vs. interrupted vs. not-started builders, present recovery plan
- **Same error type repeats 3+ times** -- Trigger systemic diagnosis and escalation
- **Context rot detected** -- Canary check failures are CRITICAL, recommend new session
- **Wave cannot compile** -- CRITICAL severity, stop wave and diagnose

### When NOT to Use

- **TypeScript warnings only (no errors)** -- Log as note, do not classify as failure
- **Intentional `@ts-expect-error` or `@ts-ignore` annotations** -- Not a failure, skip
- **Test failure in a non-test context** -- May be expected during development
- **ESLint/Prettier formatting warnings** -- Style issues, not build failures
- **Deprecation warnings** -- Log for future reference, do not trigger diagnosis

### Severity Classification (Decision Tree)

This is the most critical decision in error recovery. Every failure gets classified into exactly one of three severity levels:

| Severity | Definition | Examples | Action | Who Decides |
|----------|-----------|----------|--------|-------------|
| MINOR | Single task fails, no cascade risk | Missing import, type mismatch on non-shared type, unused variable error, single CSS property unsupported | Auto-isolate and fix. Log to FAILURE-LOG.md. Report in section completion summary. | Claude auto-classifies, auto-fixes |
| MAJOR | Task fails with cascade potential OR 2nd failure in same section | Component won't render, API call fails, shared dependency missing, wrong prop types on shared component | PAUSE wave. Present structured diagnosis with 2-3 fix options. Wait for user choice. | Claude diagnoses, user picks fix |
| CRITICAL | Wave-level failure OR 3+ failures in same wave OR context rot OR session interrupt | Build won't compile at all, multiple sections failing same way, canary check 3+ failures, session crash | STOP the entire wave. Full diagnosis. User decides: fix + continue, restart wave, or start new session. | Claude diagnoses, user picks recovery path |

### Escalation Rules

Failures escalate based on frequency and pattern:

1. **1st failure in a section** -- Classify per the table above based on the error itself
2. **2nd failure in the same section** -- Escalate to MAJOR minimum (even if the error itself is minor)
3. **3rd failure in the same section** -- Escalate to CRITICAL
4. **3+ failures of the same TYPE across different sections** -- Systemic diagnosis (see Pattern 5 in Layer 2)
5. **Canary check 2+ wrong answers** -- Immediately CRITICAL -- context rot detected
6. **Any failure involving DNA tokens or shared components** -- MAJOR minimum (cascade risk to all sections)

### Auto-Fix vs. User Decision

This distinction is critical. "Auto-fix" is NOT the same as "auto-retry":

- **Auto-fix (MINOR only):** Claude identifies the root cause and applies a targeted fix (e.g., adds a missing import, fixes a type annotation). The fix is logged but does not pause the build. This is a single, targeted correction -- not a blind retry.
- **User decision (MAJOR/CRITICAL):** Claude diagnoses the issue, presents 2-3 fix options with trade-offs, and WAITS for the user to choose. No fix is applied until the user responds.

This aligns with the Phase 2 design decision: "Build failures bubble to user (no auto-retry)." Auto-fix for MINOR is permitted because it is a diagnosis + targeted correction, not a retry of the same failed approach.

### Pipeline Connection

- **Referenced by:** `design-lead` agent for wave-level error handling and crash recovery
- **Referenced by:** `build-orchestrator` agent (via design-lead) for detecting builder failures
- **Referenced by:** `section-builder` agent for task-level error handling and SUMMARY.md failure format
- **Consumed at:** Any point during `/modulo:execute` when an error occurs
- **Output to:** FAILURE-LOG.md (detailed), STATE.md (compact summary), CONTEXT.md (session continuity)

---

## Layer 2: Award-Winning Examples

### Pattern 1: Structured Diagnosis Template

Every MAJOR or CRITICAL failure produces this structured diagnosis. This is the primary user-facing output of the error recovery system.

```markdown
## Failure Report: [Section ID] / [Task Name]

**Type:** [build-error | type-error | runtime-error | dependency-error | timeout | context-rot | style-drift]
**Severity:** [MINOR | MAJOR | CRITICAL]
**Location:** [file:line or agent context]
**Wave:** [N] | **Section:** [XX-name] | **Task:** [N of M]

### What Happened
[1-2 sentences describing the exact error with code context. Include the actual error
message and the line of code that triggered it.]

### Root Cause
[Analysis of WHY this happened, not just WHAT happened. Trace the cause chain:
what triggered -> what failed -> why the underlying assumption was wrong.]

### Fix Options
1. **[Quick fix name]** -- [description of what this fix does]
   - Trade-off: [what you give up or risk]
   - Risk: [LOW | MEDIUM | HIGH]
   - Time: [estimate in minutes]
   - Affected files: [list]

2. **[Proper fix name]** -- [description of the thorough approach]
   - Trade-off: [what you give up or risk]
   - Risk: [LOW | MEDIUM | HIGH]
   - Time: [estimate in minutes]
   - Affected files: [list]

3. **[Alternative approach]** -- [fundamentally different solution]
   - Trade-off: [what you give up or risk]
   - Risk: [LOW | MEDIUM | HIGH]
   - Time: [estimate in minutes]
   - Affected files: [list]

### Recommendation
Option [N] because [clear reasoning tied to project context, timeline, and quality goals].

### Awaiting User Decision
Reply with option number (1, 2, or 3) to proceed.
```

**Concrete Example: TypeScript Strict Mode Rejects CSS Property**

```markdown
## Failure Report: 03-hero / Task 3: Add scroll-driven parallax

**Type:** type-error
**Severity:** MAJOR
**Location:** src/components/sections/Hero.tsx:45
**Wave:** 2 | **Section:** 03-hero | **Task:** 3 of 5

### What Happened
TypeScript strict mode rejects the `animation-timeline` CSS property in the inline
style object:
`Property 'animationTimeline' does not exist on type 'CSSProperties'.`
This blocks the scroll-driven parallax effect specified in the PLAN.md.

### Root Cause
TypeScript's `CSSProperties` type (from `@types/react`) does not include the
`animation-timeline` property because it is a relatively new CSS feature
(Baseline 2024). The type definitions lag behind browser support. This is a
type system limitation, not a CSS support issue -- the property works in all
modern browsers.

### Fix Options
1. **Type assertion on style object** -- Cast the style to `React.CSSProperties & Record<string, string>`
   - Trade-off: Loses type safety on that specific style object
   - Risk: LOW (only affects one style declaration)
   - Time: 1 minute
   - Affected files: src/components/sections/Hero.tsx

2. **Global CSS type declaration** -- Add `animation-timeline` to the project's CSS type definitions
   - Trade-off: Adds a type declaration file (src/types/css.d.ts)
   - Risk: LOW (proper TypeScript solution, no type safety loss)
   - Time: 3 minutes
   - Affected files: src/types/css.d.ts, tsconfig.json (include path)

3. **Switch to Motion useScroll** -- Replace CSS scroll-driven animation with Motion's useScroll hook
   - Trade-off: Adds JS scroll listener overhead; different animation approach than planned
   - Risk: LOW (well-tested approach, but deviates from CSS-first principle)
   - Time: 8 minutes
   - Affected files: src/components/sections/Hero.tsx

### Recommendation
Option 2 because it properly extends the type system, preserves type safety,
and enables CSS scroll-driven animations across all sections (prevents this
same error from recurring in sections 04-features and 06-cta which also use
scroll-driven animations).

### Awaiting User Decision
Reply with option number (1, 2, or 3) to proceed.
```

### Pattern 2: SUMMARY.md Failure Format (Section Builder Output)

When a section builder encounters a failure, its SUMMARY.md MUST include failure details and checkpoint state. This is how the design-lead detects and handles builder failures.

**Status values for SUMMARY.md:**
- `COMPLETE` -- All tasks finished successfully
- `FAILED` -- Builder encountered an unrecoverable error (for this builder's scope)
- `PARTIAL` -- Some tasks done, builder stopped cleanly (e.g., at a checkpoint or after auto-fixing)

```yaml
---
section: 03-hero
status: FAILED
wave: 2
completed_tasks: 2
total_tasks: 5
failed_at: "Task 3: Add scroll-driven parallax"
failure_type: type-error
---
```

```markdown
## Section: 03-hero
**Status:** FAILED
**Wave:** 2
**Completed Tasks:** 2/5
**Failed At:** Task 3: Add scroll-driven parallax

### Failure Details
- **Type:** type-error
- **File:** src/components/sections/Hero.tsx:45
- **Error:** `Property 'animationTimeline' does not exist on type 'CSSProperties'`
- **Context:** TypeScript strict mode rejects CSS scroll-driven animation property

### Checkpoint State
- Task 1: COMPLETE (Hero component shell with gradient mesh background)
- Task 2: COMPLETE (Typography and content placed per CONTENT.md)
- Task 3: FAILED (scroll-driven parallax -- type error on animationTimeline)
- Task 4: NOT_STARTED (responsive adaptations)
- Task 5: NOT_STARTED (interaction states and hover effects)

### Files Modified (Safe to Keep)
- src/components/sections/Hero.tsx (partial -- tasks 1-2 complete, task 3 incomplete)
- src/styles/sections/hero.css (complete -- tasks 1-2 styles only)

### Suggested Recovery
1. Type assertion on style object (quick, task 3 only)
2. Global CSS type declaration (proper, prevents recurrence)
3. Switch to Motion useScroll approach (alternative animation method)
```

**Design-lead/build-orchestrator detection protocol after each builder:**

| SUMMARY.md State | Builder State | Action |
|-----------------|---------------|--------|
| Exists + status: COMPLETE | Success | Mark section COMPLETE in STATE.md |
| Exists + status: FAILED | Failed with diagnosis | Trigger diagnosis flow, present fix options to user |
| Exists + status: PARTIAL | Stopped at checkpoint | Read checkpoint state, resume from last completed task |
| Missing + files modified in section dir | INTERRUPTED (crash/timeout) | Assess files, classify as MAJOR minimum |
| Missing + no files changed | NOT_STARTED (builder never ran) | Restart builder from scratch |

### Pattern 3: FAILURE-LOG.md Format

Detailed failure history goes to `.planning/modulo/FAILURE-LOG.md`. This is a separate file from STATE.md to protect the 100-line STATE.md budget.

**FAILURE-LOG.md is append-only and grows unbounded.** Each entry captures the full context needed for post-build analysis and pattern detection.

```markdown
# Failure Log

## Entry 5 -- 2026-02-24T14:42:00Z

**Section:** 06-cta | **Task:** Task 2: CTA button interaction states
**Type:** runtime-error | **Severity:** MAJOR
**Error:** `Cannot read properties of undefined (reading 'getBoundingClientRect')`
**Root Cause:** Button ref not attached before useEffect runs -- missing null check on ref.current
**Resolution:** Option 1 -- Added optional chaining on ref.current?.getBoundingClientRect()
**Duration:** 4 minutes
**Affected Files:** src/components/sections/CTA.tsx

---

## Entry 4 -- 2026-02-24T14:35:00Z

**Section:** 03-hero | **Task:** Task 3: Add scroll-driven parallax
**Type:** type-error | **Severity:** MAJOR
**Error:** `Property 'animationTimeline' does not exist on type 'CSSProperties'`
**Root Cause:** TypeScript CSSProperties type lacks animation-timeline property
**Resolution:** Option 2 -- Global CSS type declaration (src/types/css.d.ts)
**Duration:** 3 minutes
**Affected Files:** src/types/css.d.ts, tsconfig.json

---

## Entry 3 -- 2026-02-24T14:28:00Z

**Section:** 02-nav | **Task:** Task 4: Mobile hamburger menu
**Type:** build-error | **Severity:** MINOR
**Error:** `Module not found: Can't resolve '@/components/ui/Sheet'`
**Root Cause:** Sheet component not yet installed from shadcn/ui
**Resolution:** Auto-fixed -- ran `npx shadcn@latest add sheet`
**Duration:** 1 minute
**Affected Files:** components/ui/sheet.tsx (added)

---
```

**STATE.md gets only the compact summary (max 5 most recent failures):**

```markdown
## Recent Failures (Last 5)
| Time | Section | Type | Severity | Resolution |
|------|---------|------|----------|------------|
| 14:42 | 06-cta | Runtime error | MAJOR | User chose option 1: optional chaining |
| 14:35 | 03-hero | Type error | MAJOR | User chose option 2: global CSS type decl |
| 14:28 | 02-nav | Build error | MINOR | Auto-fixed: installed Sheet component |
```

When more than 5 failures exist, the oldest entries are removed from STATE.md (they remain in FAILURE-LOG.md permanently). This keeps STATE.md within its 100-line budget.

### Pattern 4: Checkpoint Resume Protocol

For resuming after session interruption or crash. This protocol is used by the design-lead agent when `/modulo:execute resume` is invoked.

**Step 1: Pre-wave checkpoint (design-lead writes BEFORE spawning builders):**

The design-lead MUST write this checkpoint to STATE.md before spawning any builder in a wave. This enables crash recovery.

```markdown
## Active Wave Checkpoint
**Wave:** 3
**Sections:** 06-cta, 07-testimonials, 08-faq
**Builders Spawned:** 3
**Started:** 2026-02-24T15:10:00Z
**Status:** IN_PROGRESS
```

If the session crashes after this checkpoint is written, the resume flow knows exactly which sections were being built.

**Step 2: Detection after interruption (design-lead runs on resume):**

For each section in the interrupted wave, check in this order:

```
For section in wave_sections:
  1. Check `.planning/modulo/sections/{section}/SUMMARY.md`
     - EXISTS + status: COMPLETE  -> Section finished, skip it
     - EXISTS + status: FAILED    -> Section failed, present failure options
     - EXISTS + status: PARTIAL   -> Section partially done, resume from checkpoint
  2. No SUMMARY.md:
     - Check if section directory has modified files (git status or file timestamps)
       - YES -> INTERRUPTED (builder crashed mid-task), assess state
       - NO  -> NOT_STARTED (builder never ran), build from scratch
```

**Step 3: Present resume options to user:**

```markdown
### Session Resume: Wave 3 was interrupted

| Section | State | Details | Recovery |
|---------|-------|---------|----------|
| 06-cta | COMPLETE | 5/5 tasks done | Keep (no rebuild needed) |
| 07-testimonials | INTERRUPTED at task 3 | Files modified, no SUMMARY.md | Resume from task 3 or restart section |
| 08-faq | NOT_STARTED | No files created | Will build from scratch |

**Options:**
1. **Continue** -- Keep completed sections, resume interrupted ones from checkpoint, build unstarted ones
   - Estimated time saved: ~8 minutes (06-cta already complete)
2. **Restart wave** -- Discard all Wave 3 progress, rebuild all 3 sections from scratch
   - Use if completed work may have quality issues
3. **New session** -- Save full state to CONTEXT.md, recommend starting fresh
   - Use if context feels stale or many errors occurred before crash

**Recommendation:** Option 1 (continue) -- 06-cta is verified complete, 07-testimonials
has 2 tasks safely committed, only task 3 needs recovery.

Reply with option number (1, 2, or 3).
```

**Step 4: Executing the "continue" option:**

- **COMPLETE sections:** Skip entirely -- do not rebuild, do not re-verify (they already passed)
- **INTERRUPTED sections:** Read partial files, determine last fully committed task, spawn builder with modified spawn prompt that says "Resume from Task N. Tasks 1 through N-1 are already complete. Start at Task N."
- **NOT_STARTED sections:** Build normally with full spawn prompt

**Step 5: After recovery completes:**

Update FAILURE-LOG.md with the session interruption entry and resolution.

### Pattern 5: Systemic Failure Escalation

When 3+ failures share the same error TYPE across different sections, this is no longer an isolated issue -- it is a systemic problem that needs a project-level fix.

**Detection:**

After every failure classification, check the FAILURE-LOG.md for pattern matches:

```
Count failures where:
  - type matches current failure type
  - occurred in the current session (since last resume)
  - not yet marked as part of a systemic diagnosis

If count >= 3:
  Trigger systemic diagnosis
```

**Systemic diagnosis template:**

```markdown
### Systemic Issue Detected

**Pattern:** [N] [type] errors across sections [list]
**Common cause:** [unified root cause analysis -- what do all failures share?]
**This is likely:** [project-level configuration | missing dependency | architectural gap]

**Evidence:**
| Section | Task | Error | Location |
|---------|------|-------|----------|
| 03-hero | Task 3 | animationTimeline not in CSSProperties | Hero.tsx:45 |
| 04-features | Task 2 | animationTimeline not in CSSProperties | Features.tsx:28 |
| 06-cta | Task 4 | animationTimeline not in CSSProperties | CTA.tsx:62 |

**Recommended systemic fix:**
[Specific fix that resolves ALL instances at once]

```typescript
// Example: src/types/css.d.ts
declare module 'csstype' {
  interface Properties {
    animationTimeline?: string;
    animationRange?: string;
  }
}
```

**This will resolve:** All [N] current failures and prevent future occurrences
in remaining sections.

**Alternative:** Fix each section individually (3x the work, same result).

**Awaiting User Decision:** Apply systemic fix? (yes / no / modify)
```

**Escalation threshold:** 3+ failures of the same TYPE (not just the same section). This catches project-wide issues early before they affect every section in the build.

### Pattern 6: Common Failure Types Reference

Quick reference for classifying and diagnosing failures. Design-lead and section-builder agents use this table for initial classification.

| Type | Typical Cause | Default Severity | Typical Fix | Cascade Risk |
|------|---------------|-----------------|-------------|--------------|
| build-error | Missing import, syntax error, unresolved module | MINOR | Add import, fix syntax, install package | Low |
| type-error | TypeScript strict mode, wrong types, missing type defs | MINOR-MAJOR | Type assertion, interface update, declaration file | Medium (shared types cascade) |
| runtime-error | Null reference, missing prop, wrong hook usage | MAJOR | Null check, default prop, fix hook call | Medium |
| dependency-error | Missing package, version conflict, peer dep mismatch | MAJOR | Install package, resolve version, check peer deps | High (affects all consumers) |
| timeout | Builder took too long, infinite loop, infinite re-render | MAJOR | Restart builder, check for loops, optimize | Low (isolated to builder) |
| context-rot | Canary check failures, DNA drift, wrong tokens used | CRITICAL | New session, re-read DNA, full context refresh | Very High (all future work affected) |
| style-drift | Output doesn't match DNA tokens, wrong colors/fonts | MAJOR | Re-read DESIGN-DNA.md, fix tokens, grep for raw values | High (visual inconsistency) |

**Classification priority:**
1. Check if error is actually a warning (not a failure -- skip)
2. Check error type against the table above
3. Check if shared/cascading components are involved (bump to MAJOR minimum)
4. Check failure count in current section (2nd = MAJOR, 3rd = CRITICAL)
5. Check failure count of same type across sections (3+ = systemic)

### Pattern 7: Mid-Wave Failure Handling

When a failure occurs during a wave with multiple parallel builders:

**If one builder fails while others are still running:**
1. Let running builders continue (do not cancel them)
2. Log the failure in FAILURE-LOG.md
3. After ALL builders in the wave complete (success or failure), assess the wave:
   - All succeeded: Normal wave completion
   - One failed (MINOR): If auto-fixed, treat wave as successful
   - One failed (MAJOR): Pause for user decision before next wave
   - Multiple failed: Classify as CRITICAL, assess if systemic

**If ALL builders fail:**
- CRITICAL -- the wave has a systemic issue
- Do NOT restart individual builders
- Diagnose the common cause (likely a Wave 0/1 issue affecting all sections)

**If the wave is blocked by a dependency from a previous wave:**
- This should never happen (design-lead verifies dependencies before spawning)
- If it does: CRITICAL -- indicates a MASTER-PLAN.md dependency error

---

## Layer 3: Integration Context

### DNA Connection

Error recovery is not directly tied to specific DNA tokens, but certain failure types involve DNA compliance:

| Failure Type | DNA Relevance |
|-------------|---------------|
| style-drift | Builder used raw hex values instead of DNA color tokens, wrong fonts, wrong spacing |
| context-rot | Canary check detected DNA knowledge degradation -- design-lead forgot token values |
| build-error (shared) | Wave 0/1 shared component using wrong DNA tokens affects all consumers |

**DNA-related failures are always MAJOR minimum** because they risk cascading quality issues. If a shared component in Wave 0 has wrong tokens, every section consuming it inherits the error.

Style drift detection: After each section build, the quality-reviewer agent (or design-lead during coherence check) greps the output for:
- Raw hex values not in the DNA palette
- Font families not in the DNA spec
- Tailwind default classes (shadow-md, rounded-lg, gap-4) that should be DNA tokens

### Archetype Variants

Error recovery behavior does not change per archetype. The diagnosis template, severity classification, and escalation rules are the same regardless of the project's visual identity.

However, some archetypes have higher failure rates due to complexity:
- **Glassmorphism** -- backdrop-filter issues, z-index stacking, performance (will-change budget)
- **Neon Noir** -- complex gradient/glow effects, contrast issues with dark backgrounds
- **Kinetic** -- animation-heavy sections more likely to hit performance and type errors
- **3D/WebGL sections** -- shader compilation errors, Three.js version conflicts

These archetypes are more likely to produce MAJOR failures, but the diagnosis process is identical.

### Pipeline Stage

- **Input from:** Any pipeline agent that encounters an error during build execution
- **Output to:**
  - User: Structured diagnosis with fix options (for MAJOR/CRITICAL)
  - FAILURE-LOG.md: Full failure details (all severities)
  - STATE.md: Compact 1-line summary (max 5 recent entries)
  - CONTEXT.md: Session state for crash recovery continuity

### Related Skills

- **progress-reporting** -- Failure summaries in STATE.md follow the progress-reporting compact format. Wave summaries include failure counts. The "Recent Failures" table in STATE.md is managed by error-recovery but displayed alongside progress data.
- **quality-gate-protocol** -- Anti-slop gate failures and Awwwards scoring failures are error types that feed into this skill's diagnosis flow. A gate FAIL is classified as MAJOR (quality block, not a build error).
- **live-testing** -- Lighthouse score failures, FPS monitoring failures, and accessibility violations detected during testing are classified using this skill's severity system.

### Section Builder Integration

Builders are the primary source of errors. The integration contract:

1. **Builders write SUMMARY.md** with explicit status: `COMPLETE | FAILED | PARTIAL`
2. **FAILED SUMMARY.md includes:** Checkpoint state (which tasks completed), failure details, files modified (safe to keep vs. partial), and suggested recovery options
3. **Design-lead checks SUMMARY.md** after EVERY builder finishes -- this is mandatory, not optional
4. **Missing SUMMARY.md** after a builder was spawned = treat as potential failure (INTERRUPTED state)
5. **Builder MINOR auto-fixes** are logged in SUMMARY.md notes section and FAILURE-LOG.md but do not pause the build

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Silent Retry

**What goes wrong:** Automatically retrying a failed task without telling the user. The builder encounters a type error, retries the same approach 2-3 times, then either succeeds with a fragile workaround or fails repeatedly -- all without the user knowing.

**Why this is wrong:** User decision from Phase 2: "Build failures bubble to user (no auto-retry)." Silent retries hide problems, waste context budget on repeated attempts, and may produce lower-quality fixes that accumulate technical debt.

**Instead:** MINOR failures can be auto-FIXED (a targeted correction, e.g., adding a missing import -- this is different from retrying the same failed approach). MAJOR and CRITICAL failures ALWAYS present structured diagnosis with options and wait for user approval before applying any fix.

### Anti-Pattern 2: Full Diagnosis in STATE.md

**What goes wrong:** Writing 10-20 line failure reports directly in STATE.md. After 3-4 failures, STATE.md bloats to 150+ lines, exceeding the 100-line budget established in Phase 2. Other agents reading STATE.md waste context on historical failure details instead of current build state.

**Why this is wrong:** STATE.md has a 100-line budget. It is a compact status dashboard, not a diagnostic journal. Detailed failure context belongs in a dedicated file.

**Instead:** STATE.md gets a compact 1-line summary per failure (max 5 recent entries in a table). Full diagnosis, root cause, fix options, and resolution details go to `.planning/modulo/FAILURE-LOG.md`. STATE.md links to FAILURE-LOG.md with: `Details: see FAILURE-LOG.md`.

### Anti-Pattern 3: Ignoring Failed Builders

**What goes wrong:** The design-lead/orchestrator marks a wave as complete without checking every builder's SUMMARY.md status. A builder that crashed silently (no SUMMARY.md) is missed. The build proceeds to the next wave with an incomplete section.

**Why this is wrong:** Silent failures compound. The next wave may depend on the failed section's components. By the time the gap is discovered, multiple waves of work may need to be revisited.

**Instead:** ALWAYS check SUMMARY.md for every section in the wave after all builders return. Missing SUMMARY.md = INTERRUPTED state = investigate immediately. Never mark a wave as complete until every section has a SUMMARY.md with status COMPLETE.

### Anti-Pattern 4: Restarting Everything on Minor Failure

**What goes wrong:** Killing the entire wave because one builder had a minor import error. All parallel builders are stopped, their progress discarded, and the entire wave is restarted from scratch.

**Why this is wrong:** Wastes completed work. A MINOR failure (missing import, simple type fix) should be isolated and corrected without affecting other builders or the wave.

**Instead:** Classify severity correctly. MINOR = auto-fix and continue. MAJOR = pause for user decision (but only the affected section, not the whole wave). Only CRITICAL stops the entire wave.

### Anti-Pattern 5: No Pre-Wave Checkpoint

**What goes wrong:** Spawning builders without writing the pre-wave checkpoint to STATE.md. When the session crashes mid-wave, there is no record of which sections were being built, which builders were spawned, or when the wave started.

**Why this is wrong:** Without the checkpoint, the resume flow cannot determine what was in progress. Recovery becomes guesswork instead of structured detection.

**Instead:** ALWAYS write the Active Wave Checkpoint to STATE.md BEFORE spawning any builders. This takes 5 lines and enables reliable crash recovery.

### Anti-Pattern 6: Treating Warnings as Failures

**What goes wrong:** Classifying TypeScript warnings, ESLint warnings, or deprecation notices as failures. The build pauses for user decision on a non-blocking warning, wasting time and creating false urgency.

**Why this is wrong:** Warnings do not prevent building and do not need recovery. Treating them as failures creates alert fatigue and trains users to ignore the diagnosis flow.

**Instead:** Log warnings as notes in SUMMARY.md (e.g., "Note: 2 TypeScript warnings about deprecated API usage -- non-blocking"). Do NOT trigger the failure protocol. Only actual errors (build fails, render fails, type errors that block compilation) are classified as failures.

### Anti-Pattern 7: Fixing Without Logging

**What goes wrong:** Auto-fixing a MINOR issue without logging it to FAILURE-LOG.md. The fix works, the build continues, but there is no record. When the same issue appears later (different section), it is treated as a new problem instead of a known pattern.

**Why this is wrong:** Without logging, pattern detection (the 3+ systemic threshold) cannot work. Each occurrence is treated in isolation, missing the opportunity for a project-level fix.

**Instead:** Every fix -- even MINOR auto-fixes -- gets an entry in FAILURE-LOG.md. The entry can be brief (3-4 lines) but must include type, section, error, and resolution. This feeds the systemic pattern detector.

---

## Machine-Readable Constraints

| Parameter | Required | Value | Enforcement |
|-----------|----------|-------|-------------|
| MINOR auto-fix allowed | Yes | Fix and continue, log to FAILURE-LOG.md | HARD -- do not pause build for minor issues |
| MAJOR/CRITICAL user approval | Yes | Present 2-3 options, wait for user choice | HARD -- no auto-retry, no auto-fix for MAJOR+ |
| Fix options per diagnosis | Yes | 2-3 options with trade-offs | HARD -- never present only 1 option |
| Systemic escalation threshold | Yes | 3+ same-type failures across sections | HARD -- trigger systemic diagnosis |
| Section escalation: 2nd failure | Yes | Escalate to MAJOR minimum | HARD -- repeated failures indicate deeper issue |
| Section escalation: 3rd failure | Yes | Escalate to CRITICAL | HARD -- three strikes, stop and assess |
| Pre-wave checkpoint write | Yes | Write to STATE.md before spawning builders | HARD -- enables crash recovery |
| SUMMARY.md status check | Yes | Check after every builder completes | HARD -- detect silent failures |
| FAILURE-LOG.md for details | Yes | Full diagnosis in separate file | HARD -- protect STATE.md budget |
| STATE.md failure summary cap | Yes | Max 5 recent failures in table | HARD -- overflow to FAILURE-LOG.md only |
| STATE.md total budget | Yes | 100 lines maximum | HARD -- compact status, not diagnostic journal |
| Canary rot = CRITICAL | Yes | 2+ wrong canary answers | HARD -- context rot is always critical |
| DNA failure = MAJOR minimum | Yes | Any DNA token or shared component error | HARD -- cascade risk |
