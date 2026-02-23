# Phase 2: Pipeline Architecture - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the agent pipeline model (Research -> Design -> Build -> Review -> Polish) with explicit input/output contracts per agent, stateless section builders with pre-extracted context, and structural context rot prevention. This phase produces agent definitions, context passing protocols, and session management rules -- NOT the commands that invoke them (Phase 3) or the quality gate details (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Agent Roles & Boundaries
- Researcher covers BOTH the user's specific industry/competitors AND award-winning design references for the chosen archetype -- broad but grounded
- Section builders are aware of their neighbors: they know which sections come before/after, those sections' beat types, and layout patterns -- enough to avoid repetition and handle transitions
- Two-tier polish system: light auto-polish on every section (micro-interactions, textures, hover states) as a guaranteed stage, plus deep polish triggered only when the quality reviewer identifies gaps
- Build failures bubble directly to the user -- orchestrator does NOT auto-retry. Any failure pauses execution and asks the user how to proceed

### Context Passing Strategy
- Full Design DNA snapshot embedded in every builder's spawn prompt (~100-150 lines). Builders get the complete reference, not a compressed extract
- CONTEXT.md ownership is split: orchestrator writes build state/progress after each wave, Creative Director appends creative direction notes and drift observations. Both contribute to the living context
- Design system growth follows "builder proposes, orchestrator collects" -- builders flag reusable components in their SUMMARY.md, orchestrator aggregates after each wave. No approval gate, but deliberate collection
- Reviewer feedback loop (lessons learned) is visible to builders in subsequent waves via a snippet in their spawn prompt. Builders know both what worked and what to avoid

### Session & Rot Prevention
- Session boundaries at every 2 waves are soft: CONTEXT.md is force-written, user gets a "consider starting a new session" message, but the build can continue if they choose
- Canary checks combine DNA recall questions (primary color, signature element, archetype, forbidden pattern) AND recent context questions (last section built, arc position, next wave plan). Tests both identity drift and state drift
- When rot is detected (canary fails or reviewer sees drift), the system flags the drift with specific evidence (what drifted, how much). User decides: fix in-place, rebuild section, or continue anyway
- Pre-commit DNA compliance hook is a hard block -- commit is rejected if anti-slop violations are found. No override flag

### Creative Director Authority
- CD has real authority: can flag a section as "below creative bar" and require specific improvements before acceptance
- CD reviews at two checkpoints per wave: light plan review before builders execute (does this match creative vision?) and thorough output review after building (is this bold enough?)
- Clear separation: CD owns creative vision (boldness, archetype match, creative tension, emotional arc). Quality Reviewer owns technical quality (anti-slop score, accessibility, performance, code quality)
- DNA is the floor, CD pushes the ceiling: everything must comply with Design DNA as the minimum standard, but CD can push sections beyond DNA if it identifies opportunities to be bolder within the archetype

### Claude's Discretion
- Exact context budget per spawn prompt (how many lines total)
- Format of the "lessons learned" snippet for builders
- Internal structure of CONTEXT.md sections
- How neighbor awareness is formatted in PLAN.md
- Canary check question phrasing and scoring
- Auto-polish checklist specifics

</decisions>

<specifics>
## Specific Ideas

- Builder neighbor awareness should include beat type + layout pattern of adjacent sections -- just enough to avoid clashes
- The "builder proposes, orchestrator collects" pattern for design system growth means SUMMARY.md needs a structured section for reusable component proposals
- Canary checks should be fast (5 questions, mix of DNA and state) with a clear threshold (2+ failures = session save recommended)
- CD's "push the ceiling" mandate means it should specifically look for opportunities to escalate creative tension in PEAK beats

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 02-pipeline-architecture*
*Context gathered: 2026-02-23*
