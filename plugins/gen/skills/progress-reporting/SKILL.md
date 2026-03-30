---
name: "progress-reporting"
description: "Multi-level progress reporting protocol: per-task tracking, wave summaries, screenshots, review gates, STATE.md extensions"
tier: "core"
triggers: "progress, status, wave summary, review gate, build status, milestone, STATE.md updates"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

This skill is **always active** during every build execution. It defines the multi-level reporting protocol that the orchestrator and builder agents follow to keep users informed and maintain machine-readable state.

Progress reporting fires at four tiers. Each tier has a different format, location, and trigger condition:

| Event | Tier | Format | Location | Who Reports |
|-------|------|--------|----------|-------------|
| Task completes | Tier 1 (task) | 1-line table row | STATE.md task table | builder |
| Task fails | Tier 1 (task) | 1-line table row + link | STATE.md + FAILURE-LOG.md | builder |
| Section complete | Tier 2 (section) | Compact inline highlight | Conversation | orchestrator |
| Section fails | Tier 2 (section) | Inline alert + link | Conversation | orchestrator |
| Wave complete | Tier 3 (wave) | Detailed summary block | Conversation + STATE.md | orchestrator |
| Build complete | Tier 4 (milestone) | Full report with scores | Conversation + STATE.md | orchestrator |
| User requests status | Any | Current STATE.md task table | Conversation | orchestrator |

**Decision tree for tier selection:**

- Task just finished? -> Tier 1. Update STATE.md task table row. No conversation output.
- All tasks in a section finished? -> Tier 2. One-liner in conversation.
- All sections in a wave finished? -> Tier 3. Detailed wave summary with scores and review gate.
- All waves finished? -> Tier 4. Full milestone report.
- User asked "what's the status?" -> Show current STATE.md task table in conversation.

### When NOT to Use

Never -- reporting is always on during builds. There is no scenario where progress reporting is skipped or deferred.

If a task **starts** but has not yet completed, do NOT report it in conversation. Task start events are batched -- the task table shows IN_PROGRESS status but no conversation noise.

### Pipeline Connection

- **Referenced by:** `orchestrator` agent during wave orchestration -- consumes Tier 2/3/4 templates
- **Referenced by:** `orchestrator` agent during build execution -- manages STATE.md updates
- **Consumed by:** `builder` agents -- contribute task-level status via SUMMARY.md frontmatter
- **Consumed at:** Every task completion, section completion, wave completion, build completion
- **Triggers review gate:** After every wave completion -- builds pause until user approves

### Reporting Principles

1. **Machine-readable first.** STATE.md is the source of truth. Conversation output is the human-friendly summary.
2. **Compact by default.** Per-task is STATE.md only (no conversation). Per-section is one line. Verbosity only at wave and milestone tiers.
3. **Budget-aware.** STATE.md must stay under 100 lines total. Progress data is trimmed to current wave only.
4. **Review gates are hard gates.** Builds NEVER auto-proceed past a wave boundary without user approval.
5. **Screenshots are expensive.** Automatic only after the final wave. Mid-build only on explicit user request.

---

## Layer 2: Award-Winning Examples

### Pattern 1: STATE.md Task Progress Table (Tier 1)

The task progress table is the core Tier 1 reporting mechanism. It goes into STATE.md during active builds and is **removed** when the build completes (to stay under 100 lines).

```markdown
## Task Progress (Wave 2 Active)

| Section | Task | Status | Started | Duration | Notes |
|---------|------|--------|---------|----------|-------|
| 03-hero | 1: Component shell | COMPLETE | 14:32 | 2m | - |
| 03-hero | 2: Typography | COMPLETE | 14:34 | 3m | - |
| 03-hero | 3: Animations | IN_PROGRESS | 14:37 | - | Scroll-driven parallax |
| 04-features | 1: Grid layout | COMPLETE | 14:33 | 4m | - |
| 04-features | 2: Cards | IN_PROGRESS | 14:37 | - | - |
| 05-proof | 1: Testimonials | PENDING | - | - | - |
```

**Rules for the task progress table:**

1. **Update at task COMPLETION only** (not task start). This reduces file I/O and avoids reporting churn.
2. **Batch multiple task completions** in a single STATE.md write when possible. If 3 tasks completed since last write, update all 3 rows at once.
3. **Maximum 20 rows visible.** Show current wave tasks only. Previous wave tasks are cleared when the new wave starts.
4. **Status values** (exactly these, machine-parseable):
   - `PENDING` -- Not started yet
   - `IN_PROGRESS` -- Builder is working on this task
   - `COMPLETE` -- Task finished successfully
   - `FAILED` -- Task encountered an error (see FAILURE-LOG.md)
   - `SKIPPED` -- Task was skipped (with documented reason)
5. **Duration format:** Compact minutes only (2m, 5m, 12m). No seconds, no hours.
6. **Notes column:** Maximum 30 characters. Key detail only. Dash (-) if nothing notable.
7. **Started column:** Time in HH:MM format (24-hour, local timezone). Dash (-) if not started.

**How builders contribute to Tier 1:**

Section builders do NOT write to STATE.md directly. Instead, they include task status in their SUMMARY.md frontmatter:

```yaml
---
section: 03-hero
status: complete
tasks_completed: 5
tasks_total: 5
duration: 8m
auto_fixes: 0
---
```

The orchestrator reads each builder's SUMMARY.md and batches the updates into STATE.md.

### Pattern 2: Section Completion Highlight (Tier 2)

When a section completes (all tasks done + SUMMARY.md written), the orchestrator reports a **compact one-liner** in conversation. This is the only per-section conversation output.

**Standard completion format:**

```
Section 03-hero complete (5/5 tasks, 8m) -- HOOK beat, full-bleed split layout
```

Format: `Section {id} complete ({tasks_done}/{tasks_total}, {duration}) -- {beat} beat, {layout_pattern} layout`

**With auto-fixed errors:**

```
Section 04-features complete (5/5 tasks, 12m, 1 auto-fix) -- BUILD beat, asymmetric grid layout
```

Format: `Section {id} complete ({tasks_done}/{tasks_total}, {duration}, {N} auto-fix) -- {beat} beat, {layout_pattern} layout`

**Failed section:**

```
Section 05-proof FAILED at task 3/5 -- see error diagnosis below
```

Format: `Section {id} FAILED at task {failed_at}/{tasks_total} -- see error diagnosis below`

**Partial completion (some tasks skipped):**

```
Section 06-cta complete (4/5 tasks, 1 skipped, 7m) -- PIVOT beat, centered stack layout
```

**Rules for Tier 2:**

- One line per section. Never multi-paragraph.
- Always include beat type and layout pattern (cross-references the Layout Diversity Tracker in STATE.md).
- If the section failed, the error diagnosis follows immediately after (handled by the error-recovery skill).
- No screenshots. No code snippets. Just the one-liner.

### Pattern 3: Wave Summary Template (Tier 3)

After **all sections** in a wave complete, the orchestrator produces a detailed wave summary. This is the user's **review gate** -- builds pause here until the user approves.

```markdown
### Wave 2 Complete

**Sections Built:** 03-hero, 04-features, 05-social-proof
**Duration:** 12 minutes
**Tasks:** 14/15 complete (1 auto-fixed minor error)

| Section | Tasks | Status | Layout Pattern | Beat |
|---------|-------|--------|---------------|------|
| 03-hero | 5/5 | COMPLETE | Full-bleed split | HOOK |
| 04-features | 5/5 | COMPLETE | Asymmetric grid | BUILD |
| 05-social-proof | 4/5 | COMPLETE (1 auto-fix) | Horizontal scroll | PROOF |

**Quality Checks:**
- Anti-Slop Score: 28/35 (Strong)
- DNA Compliance: PASSED (all tokens match)
- Layout Diversity: PASSED (3 distinct patterns, no adjacent duplicates)

**Canary Check:** 5/5 correct (context healthy)

**Next:** Wave 3 -- sections 06-cta, 07-footer
**Review Gate:** Awaiting user approval to proceed to Wave 3.
```

**Rules for the wave summary:**

1. **Always include quality checks:** Anti-slop score, DNA compliance, layout diversity. These three are mandatory on every wave summary.
2. **Always include canary check results.** The canary check is performed by the orchestrator before writing the wave summary (see orchestrator agent protocol).
3. **Always show next wave preview.** Users need to know what comes next before approving.
4. **Always end with "Awaiting user approval".** This is a HARD gate. The orchestrator does NOT proceed to the next wave until the user explicitly approves.
5. **Anti-slop score tier labels:** Pass (25+), Strong (28+), SOTD-Ready (30+), Honoree-Level (33+). Use the tier label in parentheses after the score.
6. **If any section failed:** Include a failure summary section before the quality checks. Link to FAILURE-LOG.md for details.
7. **If canary check degraded (3-4/5):** Add `Canary: DEGRADING -- recommend new session after this wave` warning.
8. **If canary check failed (0-2/5):** Add `Canary: ROT_DETECTED -- session boundary required` and trigger session save.

**Wave summary with failures:**

```markdown
### Wave 2 Complete (with issues)

**Sections Built:** 03-hero, 04-features, 05-social-proof
**Duration:** 18 minutes
**Tasks:** 12/15 complete (1 failed, 2 skipped)

| Section | Tasks | Status | Layout Pattern | Beat |
|---------|-------|--------|---------------|------|
| 03-hero | 5/5 | COMPLETE | Full-bleed split | HOOK |
| 04-features | 5/5 | COMPLETE | Asymmetric grid | BUILD |
| 05-social-proof | 2/5 | FAILED | Horizontal scroll | PROOF |

**Failure Summary:**
- 05-social-proof: Build error at task 3 (TypeScript type mismatch). See FAILURE-LOG.md for diagnosis and fix options.

**Quality Checks:**
- Anti-Slop Score: 26/35 (Pass) -- note: incomplete section excluded from scoring
- DNA Compliance: PASSED (completed sections only)
- Layout Diversity: PASSED (2 distinct patterns in completed sections)

**Canary Check:** 5/5 correct (context healthy)

**Next:** Fix 05-social-proof failure (user chooses fix option), then Wave 3
**Review Gate:** Awaiting user decision on failure fix + approval to proceed.
```

### Pattern 4: Milestone Report Template (Tier 4)

After the **final wave** completes, produce the full build report. This is the most detailed report tier.

```markdown
### Build Complete

**Total Duration:** 34 minutes across 4 waves
**Sections:** 8/8 complete
**Total Tasks:** 38/40 (2 auto-fixed minor errors)

**Quality Scores:**
- Anti-Slop Gate: 29/35 (SOTD-Ready)
- Awwwards Estimate: Design 8.2 | Usability 8.0 | Creativity 8.5 | Content 7.8 | Avg: 8.1
- DNA Compliance: PASSED (all sections use DNA tokens exclusively)
- Layout Diversity: PASSED (8 distinct patterns across 8 sections)
- Emotional Arc: Valid (HOOK -> BUILD -> PEAK -> BREATHE -> BUILD -> PROOF -> PIVOT -> CLOSE)

**Performance:**
- Lighthouse: 92/100
- FPS: All animations sustained 60fps (no sub-30fps flags)
- Accessibility: axe-core 0 critical violations

**Auto-Fixed Issues:** 2
1. Missing import in 04-features/Task 2 (auto-resolved)
2. Type mismatch in 05-proof/Task 4 (auto-resolved)

**Screenshots:** Captured at 4 breakpoints (375px, 768px, 1024px, 1440px)
Saved to: `.planning/genorah/screenshots/`
Run `/gen:audit` for full visual QA review.

**Files Created:** [total count] files across [N] sections
**Shared Components:** [list of reusable components from Wave 0/1]
```

**Rules for the milestone report:**

1. **All quality scores are mandatory.** Anti-slop gate, Awwwards estimate, DNA compliance, layout diversity, emotional arc validity.
2. **Performance section:** Lighthouse score, FPS check, accessibility violations. If live-testing tools were not available, note "Manual verification recommended" instead of scores.
3. **Auto-fix summary:** List all auto-fixed issues with section/task reference.
4. **Screenshot reference:** Point to the screenshot directory. Do NOT embed images in the conversation.
5. **Emotional arc sequence:** Show the full beat sequence with section names.
6. **If any sections failed and were not recovered:** Include a "Known Issues" section listing unresolved problems.

### Pattern 5: Screenshot Protocol

Screenshots are captured at 4 mandatory breakpoints: **375px, 768px, 1024px, 1440px**.

**After final wave (automatic):**

Playwright MCP (or equivalent browser tool) captures all 4 breakpoints for each section. Screenshots are saved to:

```
.planning/genorah/screenshots/
  01-nav-375px.png
  01-nav-768px.png
  01-nav-1024px.png
  01-nav-1440px.png
  02-hero-375px.png
  02-hero-768px.png
  02-hero-1024px.png
  02-hero-1440px.png
  ...
```

**Naming convention:** `{section-id}-{width}px.png`

**Full-page scrollshots** (in addition to per-section):

```
.planning/genorah/screenshots/
  full-page-375px.png
  full-page-768px.png
  full-page-1024px.png
  full-page-1440px.png
```

**Mid-build screenshots (on request only):**

- Triggered only by explicit user request (e.g., "show me what the hero looks like") or via `/gen:audit`
- Not automatic during wave execution -- avoids performance overhead of browser automation during builds
- When requested: capture the specific section or page at all 4 breakpoints

**No-browser fallback:**

If browser automation tools are not available:
- Wave summary notes: "Screenshots unavailable (no browser tools). Run `/gen:audit` with browser tools for visual QA."
- Milestone report notes: "Manual visual verification recommended."

**Screenshot budget:**

- Per section: 4 screenshots (one per breakpoint)
- Full page: 4 screenshots
- Total for an 8-section site: 36 screenshots (32 section + 4 full-page)
- All captured in a single automated pass after the final wave

### Pattern 6: STATE.md Budget Management

STATE.md has a **100-line budget** (established in the orchestrator agent protocol). Progress reporting must stay within this budget by using compact formats and scoped data.

**Line budget allocation during active builds:**

| Section | Lines | Content |
|---------|-------|---------|
| Header + phase info | ~10 | Phase, wave, project name, timestamps |
| Section status table | ~15 | Compact table, all sections (1 row each) |
| Task progress table | ~20 | Current wave tasks only (max 20 rows) |
| Layout diversity tracker | ~10 | Pattern + beat per completed section |
| Failure summary | ~5 | Most recent 5 failures, 1 line each |
| Recent decisions | ~5 | Last 3-5 decisions |
| Mutations log | ~5 | If any mutations occurred |
| **Total** | **~70** | **Leaves ~30 lines buffer** |

**Budget enforcement rules:**

1. **Current wave only** in the task progress table. When a new wave starts, clear all previous wave task rows.
2. **Max 5 failures** in the failure summary. Older failures move to FAILURE-LOG.md.
3. **Max 5 recent decisions.** Older decisions are in CONTEXT.md history.
4. **No full error diagnostics** in STATE.md. One-line summaries only. Details in FAILURE-LOG.md.
5. **If approaching 90 lines:** Trim recent decisions first, then older failure entries.

**When build completes:**

- Remove the task progress table (no longer active)
- Keep section status table (final state reference)
- Keep layout diversity tracker (useful for post-build review)
- Keep failure summary if any (for post-mortem)
- STATE.md drops back to approximately 40 lines

**FAILURE-LOG.md format (overflow destination):**

Full failure details live in `.planning/genorah/FAILURE-LOG.md`:

```markdown
# Failure Log

## Wave 2

### [14:35] 03-hero / Task 3: Scroll-driven parallax
**Type:** Build error
**Severity:** MINOR
**Error:** Property 'animationTimeline' does not exist on type 'CSSProperties'
**Root cause:** TypeScript strict mode rejects CSS animation-timeline property
**Resolution:** Auto-fixed -- used inline style with type assertion
**Duration impact:** +2m

### [14:42] 05-proof / Task 2: Testimonial cards
**Type:** Type error
**Severity:** MINOR
**Error:** Argument of type 'string' is not assignable to parameter of type 'number'
**Root cause:** API response returns string IDs, component expects numbers
**Resolution:** Auto-fixed -- added parseInt() at data boundary
**Duration impact:** +1m
```

**Rules for FAILURE-LOG.md:**

- Organized by wave (most recent wave first)
- Each entry includes timestamp, section/task, type, severity, error, root cause, resolution, duration impact
- No line limit -- this file can grow freely
- Referenced from STATE.md failure summary via "See FAILURE-LOG.md for details"

### Pattern 7: Review Gate Protocol

Review gates pause execution after every wave for user approval. This is a HARD requirement -- the orchestrator never auto-proceeds.

**Review gate flow:**

```
Wave N sections all COMPLETE
    |
    v
Build-orchestrator produces wave summary (Tier 3)
    |
    v
Summary includes: section table, quality scores, canary check, next wave preview
    |
    v
Summary ends with: "Awaiting user approval to proceed to Wave {N+1}."
    |
    v
USER DECISION (one of):
    |
    +-- "approved" / "continue" / "looks good" --> Proceed to Wave N+1
    +-- "fix [issue]" --> Apply fix, re-run affected section, produce updated summary
    +-- "stop" / "pause" --> Save state to CONTEXT.md, end session
    +-- Specific feedback --> Apply changes, re-summarize, ask again
    |
    v
Once approved: orchestrator spawns Wave N+1 builders
```

**What counts as user approval:**

- Explicit: "approved", "looks good", "continue", "proceed", "next wave", "go ahead"
- Implicit with feedback: "good but fix the hero spacing" -- apply fix, then proceed
- NOT approval: silence, no response, timeout -- the gate remains closed

**Mid-wave review (optional):**

If the user requests a status check mid-wave (before all sections complete), show the current STATE.md task table. This does NOT trigger the review gate -- it is informational only.

---

## Layer 3: Integration Context

### DNA Connection

Progress reporting is DNA-agnostic -- the reporting format is the same regardless of project archetype, color palette, or design direction. However, wave summaries include DNA compliance as a mandatory quality check.

| DNA Element | Reporting Connection |
|-------------|---------------------|
| All color tokens | DNA compliance check verifies built output uses DNA tokens exclusively |
| Forbidden patterns | Wave summary flags any forbidden pattern violations detected |
| Signature element | Milestone report notes whether signature element appears in key sections |
| Motion tokens | Performance check verifies animations follow DNA easing/timing |

### Archetype Variants

Reporting format is identical across all 19 archetypes. No archetype-specific reporting differences exist.

The only archetype-influenced aspect is the **anti-slop score** in wave summaries -- some archetypes naturally score higher or lower on certain categories (e.g., Brutalist may score lower on "Depth & Polish" but higher on "Creative Courage"). The reporting skill does not adjust scoring -- it reports the score as-is from the anti-slop-gate skill.

### Pipeline Stage

**Input from:**
- Section builders -- SUMMARY.md with task status, completion count, duration, auto-fix count
- Quality reviewer -- anti-slop scores, DNA compliance verdict, layout diversity check
- Live testing -- Lighthouse score, FPS measurements, axe-core accessibility violations
- Build-orchestrator canary check -- 5-question memory fidelity score

**Output to:**
- User (conversation) -- Tier 2 one-liners, Tier 3 wave summaries, Tier 4 milestone reports
- STATE.md (machine-readable) -- task progress table, section status, failure summary
- CONTEXT.md (session continuity) -- wave results summary for cross-session resume
- FAILURE-LOG.md (overflow) -- detailed failure diagnostics when STATE.md budget is tight

### Related Skills

- **error-recovery** -- Defines failure classification (MINOR/MAJOR/CRITICAL) and diagnosis templates. Progress reporting consumes the severity and resolution from error-recovery and displays compact summaries.
- **quality-gate-protocol** -- Defines the anti-slop gate scoring, DNA compliance checking, and layout diversity enforcement. Wave summaries report these scores as mandatory fields.
- **testing-patterns** -- Provides Lighthouse, FPS, and accessibility data. Milestone reports consume these performance metrics.
- **anti-slop-gate** -- The 35-point scoring system whose score appears in every wave summary and milestone report. Score tier labels (Pass/Strong/SOTD-Ready/Honoree-Level) come from this skill.
- **emotional-arc** -- Beat sequence validation results appear in milestone reports. Beat type per section appears in wave summary tables.

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Verbose Per-Task Reporting

**What goes wrong:** Multi-paragraph conversation reports for every task completion. "Task 2 of section 03-hero is now complete. Here's what was built: a typography component with DNA font tokens applied..." repeated 40+ times during a build.

**Why it's harmful:** Fills the conversation with noise, consuming tokens that should be available for building. Users don't need task-level detail in real-time -- they need to know if the wave succeeded.

**Instead:** Per-task updates go to STATE.md only (machine-readable table rows). Conversation gets per-section one-liners (Tier 2). Users who want task-level detail can ask for current STATUS and the orchestrator shows the STATE.md task table.

### Anti-Pattern 2: Mid-Build Automatic Screenshots

**What goes wrong:** Automatic Playwright screenshots after every wave or every section completion. An 8-section, 4-wave build generates 32+ screenshots mid-build.

**Why it's harmful:** Browser automation is slow (2-5 seconds per screenshot). At 4 breakpoints per section, each wave adds 16+ screenshots taking 30-60 seconds. Captures incomplete state (later sections not yet built, page layout may shift). Wastes resources on transient states.

**Instead:** Automatic screenshots only after the **final wave** (build complete). Mid-build screenshots available only on explicit user request via `/gen:audit`. Wave summaries are text-only with quality scores -- no visual captures.

### Anti-Pattern 3: Full Diagnosis in STATE.md

**What goes wrong:** Putting complete error diagnosis (10-20 lines per failure including code context, root cause analysis, fix options, and trade-offs) directly in STATE.md.

**Why it's harmful:** STATE.md has a 100-line budget. After 2-3 failures with full diagnostics, the file exceeds budget. Other agents reading STATE.md for quick status checks get buried in error details they don't need.

**Instead:** STATE.md gets a compact 1-line summary per failure (timestamp, section, type, resolution status). Full details go to FAILURE-LOG.md. Maximum 5 failure entries in STATE.md -- older entries overflow to FAILURE-LOG.md automatically.

### Anti-Pattern 4: Skipping Review Gates

**What goes wrong:** Auto-proceeding to the next wave after the current wave completes, without waiting for user approval. "Wave 2 complete, starting Wave 3..." with no pause.

**Why it's harmful:** Removes user oversight at the most important decision point. Users may want to adjust direction, fix issues, or stop after seeing wave results. Auto-proceeding means changes compound across waves before the user can intervene.

**Instead:** Every wave summary ends with "Awaiting user approval to proceed to Wave {N+1}." The orchestrator STOPS and WAITS. No next-wave spawning until explicit user approval. This is a HARD gate -- no configuration option to disable it.

### Anti-Pattern 5: Accumulating Previous Wave Data

**What goes wrong:** Keeping all historical task progress rows in STATE.md. After 4 waves with 10 tasks each, the task progress table has 40 rows.

**Why it's harmful:** STATE.md grows linearly with build progress, quickly exceeding the 100-line budget. Previous wave task data is stale -- those tasks are already complete and their details live in section SUMMARY.md files.

**Instead:** Task progress table shows current wave only. When Wave 3 starts, Wave 2 task rows are removed. Historical task data is preserved in each section's SUMMARY.md (the source of truth for completed work) and in CONTEXT.md (cross-session continuity). STATE.md stays lean.

### Anti-Pattern 6: Reporting Scores Without Context

**What goes wrong:** Wave summary says "Anti-Slop Score: 28/35" with no tier label and no interpretation. User doesn't know if 28 is good or bad.

**Why it's harmful:** Raw numbers without context require users to remember scoring thresholds. Different users interpret numbers differently.

**Instead:** Always include the tier label: "Anti-Slop Score: 28/35 (Strong)". The tier labels are: Pass (25+), Strong (28+), SOTD-Ready (30+), Honoree-Level (33+). For DNA compliance and layout diversity, use PASSED/FAILED with a brief parenthetical: "DNA Compliance: PASSED (all tokens match)" or "Layout Diversity: FAILED (sections 3 and 4 both use asymmetric grid)".

### Anti-Pattern 7: Reporting on Behalf of Builders

**What goes wrong:** The orchestrator monitors builder progress in real-time and reports each builder's intermediate state to the user. "Builder for 03-hero is on task 3 of 5. Builder for 04-features just started task 2..."

**Why it's harmful:** Creates a monitoring overhead loop. The orchestrator should be managing the wave, not live-narrating builder progress. Intermediate states change rapidly and aren't actionable for the user.

**Instead:** Builders work autonomously. The orchestrator only reports when a builder finishes (section-complete one-liner) or fails (failure alert). No intermediate progress narration. Users who want real-time detail can check STATE.md task table (which builders update via SUMMARY.md after completion).

---

## Machine-Readable Constraints

| Parameter | Required | Value | Enforcement |
|-----------|----------|-------|-------------|
| STATE.md total budget | Yes | <= 100 lines | HARD -- trim older data if approaching limit |
| Task table scope | Yes | Current wave only | HARD -- clear previous wave tasks on new wave start |
| Task table max rows | Yes | 20 rows | HARD -- current wave only enforces this naturally |
| Wave review gate | Yes | User approval before next wave | HARD -- never auto-proceed past wave boundary |
| Screenshot breakpoints | Yes | 375, 768, 1024, 1440px | HARD -- all 4 required on every capture |
| Screenshot timing (auto) | Yes | After final wave only | SOFT -- mid-build available on explicit request |
| Failure summary cap | Yes | Max 5 entries in STATE.md | HARD -- overflow to FAILURE-LOG.md |
| Section highlight format | Yes | Single line, max ~80 chars | SOFT -- brief is better but not character-counted |
| Wave summary quality checks | Yes | Anti-slop + DNA + diversity + canary | HARD -- all 4 mandatory in every wave summary |
| Milestone performance data | Yes | Lighthouse + FPS + a11y | SOFT -- "manual verification" if tools unavailable |
