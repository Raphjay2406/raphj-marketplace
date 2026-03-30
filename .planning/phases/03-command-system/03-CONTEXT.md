# Phase 3: Command System - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

6 user-facing commands that route to pipeline stages, with guided flow so users never get lost. This phase defines the command surface, invocation patterns, argument design, and the user experience between commands. The pipeline agents behind the commands are Phase 2; quality gates are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Start-Project discovery experience
- Adaptive questioning: batch 4-5 essentials first (business, audience, vibe, references), then conversational follow-ups based on interesting answers
- Research visibility: live progress streaming as 4 parallel research agents work ("Found 3 Awwwards references... Analyzing component patterns...")
- Output presentation: visual showcase — condensed "design brief" with ASCII mockups of the chosen direction, key color descriptions, archetype personality summary. Files saved in background.
- Creative directions: 1 strong recommendation with escape hatch. If rejected, show runner-up alternatives from the research. If still not right, ask what to change and regenerate.
- References: mention once that users can share reference URLs/screenshots, but don't push. Research agents work from keywords if none provided.
- Approval: soft gate — present showcase and suggest next step. User can proceed naturally or push back. No formal "approve" button.

### Iterate & Bug-Fix workflow
- Brainstorm gate: mandatory for /gen:iterate — always brainstorm 2-3 approaches before implementing, even for specific requests. Prevents knee-jerk changes.
- Proposal depth: rich — each approach includes ASCII mockup showing the layout change. Slowest but most informed decision.
- Blast radius: smart adjacency — changes scoped to requested section, but flag ripple effects on adjacent sections and ask before touching them.
- Bug-fix distinction: bug-fix brainstorms the *cause*, not the solution. "This could be caused by A, B, or C. Let me check." Then presents root cause and fix. Brainstorm is diagnostic, not creative.

### Guided flow & next-step prompts
- Next-step format: contextual — depends on state. If everything looks good: single suggestion. If warnings: suggest fixes first. Adapts to what just happened.
- Out-of-order handling: auto-recover — if prerequisites are missing, run them automatically. "No plans found. Let me run plan-sections first, then execute." Seamless chaining.
- Status display: brief one-line header at command start ("Phase: Build | Wave: 2/4 | Sections: 3/7") + full status available via dedicated command.
- Verbosity: always the same — consistent experience regardless of user experience level. Predictable output every time.

### Command naming & invocation
- Naming convention: verb-based (current style) — /gen:start-design, /gen:plan-sections, /gen:execute, /gen:verify, /gen:iterate, /gen:bug-fix
- Command count: 6 core workflow commands + utility commands (status, audit, etc.). Utilities don't add workflow complexity.
- Arguments: rich argument support — CLI-style flags like /gen:execute --wave 2 --parallel 3 --dry-run. Full power-user capability.
- /gen:lets-discuss: exists as standalone command AND auto-offered by plan-sections if no discussion has happened yet. Flexible entry points.

### Claude's Discretion
- Exact essential questions in the batch (Claude picks the best 4-5 based on what discovery needs)
- Specific utility commands beyond status/audit
- Flag naming conventions and short/long flag design
- How live progress streaming is formatted
- ASCII mockup style and detail level in proposals

</decisions>

<specifics>
## Specific Ideas

- Start-Project should feel like talking to a creative director, not filling out a form — the hybrid batch-then-conversational flow achieves this
- The escape hatch for creative direction rejection should feel generous, not punishing — "here are alternatives" before "tell me what to change"
- Bug-fix's diagnostic brainstorm differentiates it from iterate: iterate explores creative options, bug-fix investigates root causes
- Auto-recovery for out-of-order commands should be transparent — tell the user what's being run automatically, don't silently chain

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-command-system*
*Context gathered: 2026-02-23*
