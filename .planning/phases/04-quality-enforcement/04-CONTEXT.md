# Phase 4: Quality Enforcement - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Progressive quality enforcement through 4 layers (build-time, post-wave, end-of-phase, user checkpoint) so problems are caught where they're cheapest to fix. Covers reference benchmarking, severity classification, polish pass protocol, layout diversity enforcement, live browser testing, and Creative Director review integration.

Does NOT include: the quality reviewer agent itself (Phase 2), anti-slop gate scoring system (Phase 1), or Awwwards scoring criteria (Phase 1). This phase defines how and when those systems are invoked and what happens when they produce findings.

</domain>

<decisions>
## Implementation Decisions

### Reference Benchmarking
- Hybrid approach: curated library of references per archetype as baseline, supplemented with per-project research for key sections during brainstorming/planning
- Reference format: exact section screenshots from award-winning sites — concrete visual bar, not just a URL
- Scope: key beats only (Hero, Peak, Close, high-tension sections) get explicit reference targets. Supporting sections (Build, Breathe) rely on DNA + archetype constraints
- Location: reference targets embedded in each section's PLAN.md so builders see them before building

### Failure Severity & Consequences
- Tiered response system:
  - **Critical (blocks pipeline):** anti-slop score < 25, archetype forbidden patterns, Lighthouse < 80, critical accessibility violations, FPS < 30 on any animation
  - **Warning (running tally):** minor spacing issues, non-critical accessibility suggestions, close-to-threshold scores
- Critical failures escalate to user always — no auto-retry, no autonomous fix attempts (consistent with Phase 2 decision: build failures bubble to user)
- Warnings shown as running tally in real-time status output (e.g., "Wave 2 complete — 3 warnings pending")
- Warnings carry forward and accumulate through the build
- User checkpoint mandatory only when warnings exist. Clean builds auto-proceed

### Polish Pass Scope
- Universal base checklist + archetype-specific extras: core polish items (noise textures, gradient borders, hover micro-interactions, custom selection color, cursor effects) apply to all projects; each archetype adds 3-5 specific polish items
- Timing: single polish pass at end of build — polisher sees the full page and adds cohesive micro-details
- Creative freedom: full creative license — polisher can restyle hover states, add unexpected micro-interactions, push visual refinement further. Only constrained by DNA. Not limited to checklist items
- Layout diversity: enforced at both layers — pre-assignment in MASTER-PLAN.md during planning (primary), plus review catches drift from plan (safety net)

### Live Testing Boundaries
- All automated checks block at their thresholds:
  - Lighthouse performance score < 80 = hard fail
  - Critical accessibility violations (axe-core) = hard fail
  - Animation FPS < 30 = hard fail
  - Visual regression from plan expectations = hard fail
- Timing: comprehensive live testing runs at end of build (after polish pass) — tests the final polished output
- 4-breakpoint screenshots (375, 768, 1024, 1440px) auto-compared against section PLAN.md expectations by quality reviewer. Screenshots saved for user review
- Creative Director review and automated testing run in parallel — both produce findings merged into a single quality report

### Claude's Discretion
- Specific items in the universal polish checklist (beyond the named examples)
- How the curated reference library per archetype is organized
- Exact format of the running tally in status output
- How "auto-compare to plan" works technically (the mechanism for comparing screenshots to plan expectations)
- FPS monitoring implementation details

</decisions>

<specifics>
## Specific Ideas

- The tiered system should feel like CI/CD quality gates — critical = red/block, warning = yellow/tally, clean = green/proceed
- Polish pass having full creative license is important — the polisher should be the "finishing touch artist," not a checkbox operator
- The parallel CD review + automated testing pattern avoids sequential bottlenecks while catching both creative and technical issues simultaneously

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-quality-enforcement*
*Context gathered: 2026-02-23*
