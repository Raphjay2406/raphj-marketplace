---
name: quality-gate-protocol
category: core
description: "Defines the 4-layer progressive quality enforcement system: when each gate fires, severity classification (CRITICAL/WARNING/INFO), running tally management, and user checkpoint trigger logic."
triggers: ["quality gate", "enforcement", "severity", "tally", "checkpoint", "quality pipeline"]
used_by: ["build-orchestrator", "quality-reviewer", "creative-director"]
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Why Progressive Enforcement

Problems caught early cost nothing to fix. Problems caught late cost everything.

The 4-layer system catches issues at the cheapest fix point:

| Layer | When | Cost to Fix | Catches |
|-------|------|-------------|---------|
| 1. Build-Time | During section build | Free (embedded in builder) | DNA violations, missing artifacts, broken wiring |
| 2. Post-Wave | After wave completes | One review cycle | Anti-slop failures, creative drift, cross-section inconsistency |
| 3. End-of-Build | After all waves + polish | Full browser testing | Performance, accessibility, FPS, visual regression |
| 4. User Checkpoint | After Layer 3 | Human time | Subjective quality, business judgment, ship/iterate decision |

A DNA violation caught at Layer 1 (builder self-check) is a 30-second fix. The same violation caught at Layer 3 (live testing) requires a polisher pass, re-review, and re-test. Progressive enforcement prevents this waste.

### Why Tiered Severity

Not all findings are equal. Treating everything as critical causes two failure modes:

1. **Alert fatigue** -- when everything is critical, nothing is. Teams ignore quality reports.
2. **Pipeline paralysis** -- blocking on minor spacing issues kills velocity without improving quality.

The 3-tier system (CRITICAL / WARNING / INFO) provides proportionate response:
- **CRITICAL** blocks the pipeline immediately. These represent broken functionality or fundamental violations.
- **WARNING** accumulates in a running tally. These are genuine concerns that accumulate signal.
- **INFO** is logged for reference. These are observations, not problems.

### Why Conditional User Checkpoints

Clean builds should flow fast. The user's time is the most expensive resource in the pipeline.

- **Clean build (no warnings, no criticals):** Auto-proceed. Log result. No blocking.
- **Build with warnings:** Mandatory checkpoint. Present evidence. User decides: ship, iterate, or fix.

This respects the user's time while ensuring they see genuine concerns.

### Why CD + QR in Parallel

Creative quality (CD) and technical quality (QR) are orthogonal concerns. The CD checks archetype personality, creative boldness, emotional arc accuracy. The QR checks anti-slop scoring, DNA compliance, code quality. They share no dependencies.

Running them sequentially doubles Layer 2 latency with zero quality benefit. Running them in parallel with merged findings is faster and equally thorough.

### Locked Decisions

- **Build failures escalate to user** (Phase 2 decision). No auto-retry, no autonomous fix attempts. The system reports and waits.
- **Max 2 remediation cycles** (Phase 1 decision). If a section fails the gate twice after polisher fixes, escalate to user.
- **Gate runs before Awwwards scoring** (Phase 1 decision). If the anti-slop gate FAILs, Awwwards 4-axis scoring is skipped entirely.

### Pipeline Connection

- **Primary consumer:** build-orchestrator -- implements enforcement timing, manages running tally, triggers checkpoints
- **Severity classifier:** quality-reviewer -- classifies findings per this protocol when writing GAP-FIX.md and reports
- **Creative classifier:** creative-director -- uses severity tiers for creative findings (below-bar = WARNING, forbidden pattern = CRITICAL)
- **Fix executor:** polisher -- invoked between waves for gap fixes and at end-of-build for full polish pass

---

## Layer 2: Award-Winning Examples

### The 4-Layer Progressive Enforcement System

Each layer defines: WHEN it fires, WHO runs it, WHAT it checks, HOW findings are handled.

```
LAYER 1: BUILD-TIME (cheapest to fix)
|-- When: During each section build, as part of builder's final tasks
|-- Who: Section-builder agent (self-check)
|-- What:
|   |-- must_haves.artifacts: All files exist and non-empty
|   |-- must_haves.truths: All assertions hold (responsive, animations, states)
|   |-- DNA compliance: No hardcoded colors, fonts, spacing
|   |-- Layout pattern: Built section matches assigned pattern from PLAN.md
|   |-- Light polish: Basic hover states, focus management, reduced-motion
|-- Failure action:
|   |-- Builder retries the failing task (within same build, max 2 retries)
|   |-- If still failing after retries: mark section as INCOMPLETE in SUMMARY.md
|-- Cost: Free (embedded in builder's execution)
|-- Outputs: Section SUMMARY.md with self-check results

LAYER 2: POST-WAVE (catch before next wave starts)
|-- When: After ALL sections in a wave complete
|-- Who: Quality-reviewer + Creative-director (in PARALLEL)
|-- What (Quality Reviewer):
|   |-- 3-level goal-backward verification (Existence, Substantive, Wired)
|   |-- Anti-slop 35-point scoring per section
|   |-- Cross-section consistency check (DNA token usage, spacing rhythm)
|   |-- Layout diversity validation (does built output match MASTER-PLAN.md assignment?)
|-- What (Creative Director):
|   |-- Archetype personality check (does section feel like the archetype?)
|   |-- Creative tension assessment (bold enough? PEAK sections must have tension)
|   |-- Emotional arc accuracy (does section hit its assigned beat?)
|   |-- Color journey assessment (colors evolve across sections, not static)
|   |-- Screenshot-worthy? (would this section be shared?)
|-- Findings merge:
|   |-- Both agents write findings independently
|   |-- Build-orchestrator merges into single quality report
|   |-- Each finding classified by severity (CRITICAL / WARNING / INFO)
|-- Failure action:
|   |-- CRITICAL: Pipeline blocks immediately. Escalate to user with evidence
|   |-- WARNING: Add to running tally. Continue to next wave
|   |-- INFO: Log in report, no action needed
|-- Gap fixes: QR/CD create GAP-FIX.md files. Polisher processes them before next wave
|-- Cost: One review cycle per wave (both agents run in parallel, so ~1 cycle, not 2)
|-- Outputs: Quality report, GAP-FIX.md files (if issues), updated running tally

LAYER 3: END-OF-BUILD (comprehensive final check)
|-- When: After all waves complete AND polish pass complete
|-- Who: Quality-reviewer with MCP tools (live-testing skill)
|-- What:
|   |-- 4-breakpoint responsive screenshots (375, 768, 1024, 1440px)
|   |-- Lighthouse performance audit (hard fail < 80)
|   |-- axe-core accessibility audit (hard fail on critical violations)
|   |-- Animation FPS monitoring (hard fail < 30fps sustained)
|   |-- Full-page anti-slop scoring (holistic, not per-section)
|   |-- Awwwards 4-axis scoring (Design, Usability, Creativity, Content -- each /10)
|   |-- Screenshot comparison against PLAN.md reference targets
|-- Failure action:
|   |-- Lighthouse < 80: CRITICAL -- escalate with specific bottlenecks
|   |-- Critical a11y violation: CRITICAL -- escalate with violation details
|   |-- FPS < 30 sustained: CRITICAL -- escalate with section/animation identified
|   |-- Visual regression: WARNING -- flag with screenshot comparison
|   |-- Low Awwwards prediction: WARNING -- log with dimension breakdown
|-- Cost: Full browser testing cycle (most expensive layer)
|-- Outputs: Live Testing Report, updated running tally, Awwwards prediction

LAYER 4: USER CHECKPOINT (human judgment)
|-- When: After Layer 3 completes
|-- Who: Build-orchestrator presents, user decides
|-- What: User reviews:
|   |-- 4-breakpoint screenshots
|   |-- Quality report (anti-slop score, Awwwards prediction)
|   |-- CD creative assessment
|   |-- Warning tally summary
|   |-- Critical issues (if any -- should have been caught at earlier layers)
|-- Trigger logic:
|   |-- Warnings accumulated -> MANDATORY checkpoint
|   |   "Build complete with [N] warnings. Review required before shipping."
|   |   Present: screenshot gallery, warning list, quality scores, CD assessment
|   |   User options: "ship" / "iterate on [specific issues]" / "fix warnings"
|   |-- Clean build (no warnings, no criticals) -> AUTO-PROCEED
|   |   "Clean build verified. Awwwards prediction: [X.X]. Ready to ship."
|   |   Log result, continue without blocking
|-- Cost: Human time (minimized by conditional triggering)
|-- Outputs: User decision (ship / iterate / fix)
```

### Severity Classification System

Every condition that triggers each severity level, organized by enforcement layer.

#### CRITICAL (blocks pipeline, escalates to user immediately)

| Condition | Detection Layer | Evidence Required |
|-----------|----------------|-------------------|
| Anti-slop score < 25/35 | Layer 2, Layer 3 | Full 7-category breakdown with failing items |
| Archetype forbidden pattern in built code | Layer 1, Layer 2 | Pattern name, file path, line number |
| Missing Design DNA signature element entirely | Layer 2 | Grep result showing absence across all sections |
| Lighthouse performance score < 80 | Layer 3 | Lighthouse JSON report with bottleneck metrics (LCP, CLS, TBT) |
| Critical accessibility violation (axe-core impact: "critical") | Layer 3 | Violation ID, affected elements, help URL |
| Animation FPS < 30 sustained (2+ readings) | Layer 3 | FPS readings array with timestamps, section identified |
| Build-time failure (missing artifact, broken import, component won't render) | Layer 1 | Error message, file path, expected vs. actual |
| Section built with wrong layout pattern (doesn't match MASTER-PLAN.md) | Layer 1, Layer 2 | Assigned pattern vs. built pattern, MASTER-PLAN.md reference |

#### WARNING (running tally, accumulates across waves)

| Condition | Detection Layer | Evidence Required |
|-----------|----------------|-------------------|
| Anti-slop score 25-27 (passing but low) | Layer 2, Layer 3 | Score breakdown showing weak categories |
| Minor spacing inconsistencies (inconsistent padding between similar sections) | Layer 2 | Specific values found vs. DNA spacing tokens expected |
| Non-critical accessibility issues (axe-core impact: "serious" or "moderate") | Layer 3 | Violation count, impact level, affected elements |
| Close-to-threshold Lighthouse scores (80-85 performance) | Layer 3 | Score with specific metrics near threshold |
| Average FPS 30-45 (technically passing but concerning) | Layer 3 | FPS readings, section identified |
| CD flags section as "could be bolder" (below creative bar but not failing) | Layer 2 | CD assessment with specific dimension |
| Missing non-critical polish items from universal checklist | Layer 2 | Checklist items missing with file paths |
| Visual regression from PLAN.md expectations (any attribute below target) | Layer 3 | Screenshot with annotated difference |
| Background token not alternating between adjacent sections | Layer 2 | Adjacent sections with same bg token |

#### INFO (logged in report, not tallied)

| Condition | Detection Layer | Purpose |
|-----------|----------------|---------|
| Anti-slop score breakdown per category | Layer 2, Layer 3 | Informational -- shows category-level quality |
| Awwwards 4-axis prediction scores | Layer 3 | Informational -- SOTD readiness indicator |
| Performance metrics above thresholds | Layer 3 | Informational -- confirms healthy performance |
| Screenshot comparison notes (no issues) | Layer 3 | Documentation -- confirms visual match to plan |
| Minor axe-core suggestions (impact: "minor") | Layer 3 | Informational -- improvement opportunities |
| Lessons learned patterns | Layer 2 | Feedback loop -- replicate/avoid patterns for future waves |
| FPS readings above threshold | Layer 3 | Documentation -- confirms smooth animation |

### Running Tally Format

The build-orchestrator maintains this tally in STATE.md and updates it after every wave.

```markdown
## Build Quality Status

### Overall: IN_PROGRESS | Wave [N] of [M]
### Critical Issues: [N] ([blocking / none])
### Warning Tally: [N] accumulated

| # | Wave | Section | Warning | Source | Severity |
|---|------|---------|---------|--------|----------|
| 1 | 1 | 02-logos | Lighthouse performance 83 (threshold: 80) | QR | warning |
| 2 | 2 | 04-product | Missing alt text on 1 image (serious) | QR/axe | warning |
| 3 | 2 | 05-stats | Creative tension could be bolder | CD | warning |
| 4 | 3 | 07-testimonials | Spacing inconsistency in card grid | QR | warning |

### Anti-Slop Scores by Section
| Section | Score | Rating |
|---------|-------|--------|
| 01-hero | 30/35 | SOTD-READY |
| 02-logos | 28/35 | STRONG |
| 03-features | 27/35 | PASS |
| ... | ... | ... |
| Average | 28.4/35 | STRONG |

### Health: [GOOD | CONCERNING | CRITICAL]
```

**Health thresholds:**
- **GOOD:** No critical issues, warnings < 5
- **CONCERNING:** No critical issues, warnings 5-10
- **CRITICAL:** Any critical issue present (should have blocked already)

**Real-time status output** (shown to user during build via build-orchestrator):
```
Wave 2 complete -- 2 warnings pending
  [warn] Section 03-features: Lighthouse performance 82 (threshold: 80)
  [warn] Section 04-product: axe-core serious violation (missing alt text on 1 image)
```

### User Checkpoint Presentation

#### Mandatory Checkpoint (warnings exist)

```markdown
## Quality Checkpoint

**Build Status:** Complete with [N] warnings
**Anti-Slop Average:** [score]/35 ([rating])
**Awwwards Prediction:** [X.X] average ([SOTD likelihood])

### Screenshots
[Links to 4 breakpoint screenshots in .planning/modulo/audit/]

### Warnings Requiring Review
[Warning tally table -- all accumulated warnings]

### Creative Director Assessment
[CD's overall creative quality assessment -- bold enough? On-brand? Screenshot-worthy?]

### Your Options
1. **Ship as-is** -- Accept warnings and deploy
2. **Iterate** -- Address specific warnings (specify which)
3. **Fix all warnings** -- Create fix tasks for each warning
```

#### Auto-Proceed (clean build)

```
Build verified clean. No warnings, no critical issues.
Awwwards prediction: [X.X] average ([SOTD likelihood]).
Anti-slop average: [XX.X]/35 ([rating]).
Ready to ship.
```

### Findings Merge Protocol

When CD and QR complete their parallel reviews, the build-orchestrator merges findings:

1. **Collect** all findings from QR verification report and CD creative assessment
2. **Deduplicate** -- if both flag the same section for the same issue, keep the more specific finding
3. **Classify** each finding by severity using the tables above
4. **Create GAP-FIX.md** for any section with CRITICAL or WARNING findings that require code changes
5. **Update running tally** with new WARNING entries
6. **Block on CRITICAL** -- if any CRITICAL finding exists, stop the pipeline and escalate to user

CD findings map to severity as follows:
- Archetype forbidden pattern detected -> CRITICAL
- Section "below creative bar" / not screenshot-worthy -> WARNING
- "Could be bolder" / improvement opportunity -> WARNING
- Positive observations, strengths noted -> INFO

QR findings map directly via the severity classification tables above.

---

## Layer 3: Integration Context

### Pipeline Position

This skill is the orchestration layer that ties all Phase 4 skills together into a coherent enforcement pipeline. It defines WHEN each skill activates, not WHAT each skill checks.

**Input from:** All Phase 4 skills provide enforcement content. This skill provides enforcement timing.
**Output to:** Build-orchestrator implements the timing and tally. Quality-reviewer and creative-director use severity classification.

### How Phase 4 Skills Map to Enforcement Layers

| Phase 4 Skill | Layer 1 (Build-Time) | Layer 2 (Post-Wave) | Layer 3 (End-of-Build) | Layer 4 (Checkpoint) |
|---------------|---------------------|--------------------|-----------------------|---------------------|
| compositional-diversity | Builder checks assigned pattern | QR validates pattern match + adjacency | -- | User sees layout in screenshots |
| reference-benchmarking | Builder references quality target | QR compares against reference | Screenshot comparison | User reviews quality bar |
| polish-pass | Builder light polish | -- | Polisher full polish (runs before Layer 3) | User sees polished result |
| live-testing | -- | -- | QR runs full browser testing | User reviews screenshots + scores |
| quality-gate-protocol (this) | Defines self-check scope | Defines review scope + severity | Defines testing scope + thresholds | Defines checkpoint trigger logic |

### Complete Wave Execution Timeline

This timeline shows exactly when each enforcement activity fires during the build.

```
PRE-BUILD:
  section-planner -> uses reference-benchmarking + compositional-diversity skills
  MASTER-PLAN.md -> layout assignments with adjacency validation
  CD pre-build review (light, blocking) -> plan-level creative direction

WAVE N:
  [Layer 1] Builders execute with assigned patterns and reference targets
  [Layer 1] Builder self-checks: DNA compliance, pattern match, light polish
  [Layer 1] Builder marks section COMPLETE or INCOMPLETE in SUMMARY.md

POST-WAVE N:
  [Layer 2] QR + CD review in parallel
    QR: 3-level verification + anti-slop scoring + cross-section consistency
    CD: archetype personality + creative tension + emotional arc + color journey
  [Layer 2] Findings merged by build-orchestrator, severity classified
  [Layer 2] GAP-FIX.md created for CRITICAL and WARNING findings needing fixes

  Polisher processes GAP-FIX.md files (if any)
  Running tally updated in STATE.md

  Decision gate:
    If CRITICAL -> Block pipeline, escalate to user
    If clean/WARNING only -> Continue to Wave N+1

AFTER ALL WAVES:
  [Polish Pass] Polisher runs end-of-build full polish (sees complete page)
    Universal checklist + archetype-specific extras
    Full creative license within DNA constraints

  [Layer 3] Quality-reviewer runs live-testing protocol
    4-breakpoint screenshots (375, 768, 1024, 1440px)
    Lighthouse performance audit
    axe-core accessibility audit
    Animation FPS monitoring
    Full-page anti-slop scoring (holistic)
    Awwwards 4-axis scoring (if anti-slop >= 25)
    Screenshot comparison against PLAN.md reference targets
  [Layer 3] Results classified by severity, running tally finalized

  [Layer 4] User checkpoint
    If warnings accumulated -> MANDATORY review with options (ship/iterate/fix)
    If clean build -> AUTO-PROCEED ("Ready to ship")
```

### Agent Responsibilities

| Agent | This Skill Provides |
|-------|-------------------|
| build-orchestrator | Enforcement timing (when to invoke each layer), tally management, checkpoint trigger logic, findings merge protocol |
| quality-reviewer | Severity classification for all QR findings (anti-slop, verification, live testing) |
| creative-director | Severity classification for creative findings (archetype violations, boldness concerns) |
| polisher | Invocation timing (between waves for gap fixes, end-of-build for full polish) |
| section-builder | Layer 1 self-check scope (what to verify before reporting COMPLETE) |

### Related Skills

- **anti-slop-gate** -- Provides the 35-point scoring system. This skill defines when scoring happens (Layer 2 per-section, Layer 3 holistic) and what scores mean (< 25 = CRITICAL, 25-27 = WARNING)
- **compositional-diversity** -- Provides layout pattern taxonomy and adjacency rules. This skill defines when diversity is checked (Layer 1 builder self-check, Layer 2 QR validation)
- **polish-pass** -- Provides the polish checklist. This skill defines when polish runs (light at Layer 1, full between Layer 2 and Layer 3)
- **live-testing** -- Provides the browser testing protocol. This skill defines when live testing runs (Layer 3 only, after polish pass, single comprehensive run)
- **reference-benchmarking** -- Provides quality targets. This skill defines when comparison happens (Layer 2 code review, Layer 3 screenshot comparison)
- **emotional-arc** -- Provides beat parameters. This skill defines when arc compliance is checked (Layer 1 builder self-check, Layer 2 CD review)

### Remediation Protocol

When a section FAILs the gate (anti-slop < 25 or CRITICAL finding):

1. **Cycle 1:** QR/CD create GAP-FIX.md. Polisher executes fixes. QR re-scores the FULL gate (not partial).
2. **Cycle 2:** If still failing, second GAP-FIX.md created. Polisher executes. QR re-scores again.
3. **Cycle 3 (escalation):** If still failing after 2 remediation cycles, escalate to user with full evidence. User decides: manual fix, skip section, or accept as-is.

Remediation priority order:
1. Penalty fixes first (highest point impact: -3 to -5 per penalty)
2. Highest-point category failures next
3. Lowest-point category issues last

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Running Layer 3 Tests Per Wave

**What goes wrong:** Comprehensive browser testing (Lighthouse, axe-core, FPS monitoring, screenshots) runs after every wave instead of once at end of build. Each test cycle adds significant time. A 4-wave build with per-wave testing takes 4x longer than it should.

**Instead:** Layer 3 runs ONCE after all waves complete and the polish pass finishes. It tests the final, polished output. Per-wave quality checks (Layer 2) are code-based only -- the QR reads code and runs anti-slop scoring without launching a browser.

### Anti-Pattern: Auto-Retrying on Critical Failures

**What goes wrong:** The build-orchestrator detects a critical failure and automatically re-spawns the builder or polisher to fix it. This masks underlying problems (bad plan, wrong archetype application, missing content) and burns compute on repeated failures.

**Instead:** Critical failures escalate to user immediately with specific evidence. The user decides: retry, skip, or abort. This is a locked decision from Phase 2 -- build failures bubble to user, no autonomous retry.

### Anti-Pattern: Treating All Findings as Equal Severity

**What goes wrong:** Every finding -- from a missing alt text to a forbidden archetype pattern -- is treated as a pipeline blocker. The quality report becomes a wall of red flags. The user cannot distinguish genuine emergencies from minor polish opportunities.

**Instead:** Use the 3-tier severity system. CRITICAL blocks (anti-slop < 25, Lighthouse < 80, forbidden patterns). WARNING accumulates in the running tally. INFO is logged but not tallied. Each tier has a different pipeline consequence.

### Anti-Pattern: Warning Fatigue from INFO Items in Tally

**What goes wrong:** INFO-level items (score breakdowns, performance metrics above threshold, screenshot documentation) are included in the warning tally. The tally grows to 20+ items per wave, most of which are informational. The user stops reading the tally.

**Instead:** Only CRITICAL and WARNING items appear in the running tally. INFO items are logged in the quality report for reference but are never tallied and never trigger the mandatory user checkpoint.

### Anti-Pattern: Skipping Layer 4 Because No Criticals Exist

**What goes wrong:** The system checks for critical issues, finds none, and auto-proceeds without checking for warnings. Warnings accumulate silently across 4 waves. The user ships with 15 unreviewed warnings.

**Instead:** The user checkpoint at Layer 4 triggers on accumulated WARNINGS, not just criticals. Clean build (no warnings AND no criticals) = auto-proceed. Any warnings = mandatory checkpoint. The trigger condition is explicit.

### Anti-Pattern: Running CD and QR Sequentially

**What goes wrong:** Post-wave review runs the quality-reviewer first, then waits for completion, then runs the creative-director. This doubles the Layer 2 latency. Since CD and QR check orthogonal concerns (creative vs. technical), sequential execution provides zero quality benefit.

**Instead:** CD and QR run in parallel after each wave. Both produce findings independently. Build-orchestrator merges findings, classifies severity, and creates GAP-FIX.md files from the merged set.

### Anti-Pattern: Blocking Pipeline on Warnings

**What goes wrong:** The build-orchestrator treats warnings as blockers, stopping the pipeline and waiting for fixes after every wave. This turns every minor spacing inconsistency into a full remediation cycle, killing build velocity.

**Instead:** Warnings accumulate in the running tally and do NOT block. The pipeline continues to the next wave. Only CRITICALs block. Warnings surface at the Layer 4 user checkpoint where the user decides whether to address them.

### Anti-Pattern: User Checkpoint on Every Wave

**What goes wrong:** The build-orchestrator pauses after every wave for user review. The user reviews 2-3 sections per wave, 4 waves = 8-12 review cycles. This is exhausting and counterproductive.

**Instead:** Per-wave, only CRITICALs escalate to the user (because they block the pipeline). The comprehensive user checkpoint happens ONCE at Layer 4, after all waves complete and Layer 3 testing finishes. One thorough review instead of many shallow ones.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| anti_slop_critical_threshold | -- | 24 | points | HARD -- score below this = CRITICAL, pipeline blocks |
| anti_slop_warning_low | 25 | 27 | points | SOFT -- score in this range = WARNING |
| lighthouse_performance_fail | -- | 79 | score | HARD -- below 80 = CRITICAL |
| lighthouse_performance_warn | 80 | 85 | score | SOFT -- in this range = WARNING |
| a11y_critical_max | 0 | 0 | violations | HARD -- any critical violation = CRITICAL |
| fps_critical_threshold | -- | 29 | fps | HARD -- sustained below 30 = CRITICAL |
| fps_warning_range | 30 | 45 | fps | SOFT -- average in this range = WARNING |
| remediation_max_cycles | -- | 2 | cycles | HARD -- escalate to user after 2 failed remediation cycles |
| warning_health_good | 0 | 4 | warnings | SOFT -- 0-4 warnings = GOOD health |
| warning_health_concerning | 5 | 10 | warnings | SOFT -- 5-10 warnings = CONCERNING health |
