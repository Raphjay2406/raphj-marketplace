# Phase 9: Integration & Polish - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

End-to-end workflow completion: Figma design import via MCP tools, design system export (Storybook + tokens) for handoff, transparent multi-level progress reporting, and graceful error recovery from any failure state. This phase connects the existing pipeline to external tools and ensures production-readiness.

</domain>

<decisions>
## Implementation Decisions

### Figma-to-code workflow
- Hybrid DNA relationship: Figma styles used where present, DNA fills gaps (motion, interactions, missing tokens)
- Non-token colors (raw hex) are always flagged for user decision: map to token, add as new token, or keep as-is
- Code Connect mappings used when available — mapped codebase components used directly instead of generating new ones
- Unrecognized Figma components: Claude's discretion (generate new or map to closest, per situation)
- Multi-page Figma files handled page-by-page — user selects which page to import, each becomes a separate build cycle, shared components detected across imports
- Responsive handling: Claude's discretion based on what the Figma file contains (if breakpoints exist, use them; if not, treat as desktop and generate responsive)
- Output mode: Figma import produces PLAN.md files that go through the normal execute pipeline — user reviews plans before code is written
- Visual QA: overlay diff comparison — screenshot the built page, overlay against Figma export, highlight differences as part of the verify step

### Design system export
- Format: Storybook stories + design tokens package
- Curation: Claude's discretion on what to export based on reusability and complexity
- Token formats: multi-format output — CSS custom properties, JSON (for JS consumers), and Figma-compatible format (for syncing back to Figma)
- Story depth: visual documentation + interaction testing (play functions for hover, click, keyboard)

### Progress reporting
- Granularity: per-task updates — every task within a section's PLAN.md shows status, user sees exactly which task each builder is on
- Screenshots: automatic at 4 breakpoints only after the final wave; mid-build screenshots available on request via /gen:verify
- Review gates: after every wave — each wave pauses for user review before the next wave starts
- Format: detailed status in STATE.md (machine-readable), key milestones and scores highlighted inline in conversation

### Error recovery
- Failure scope: Claude's discretion — isolate minor failures and continue, pause on critical ones
- Diagnosis: detailed diagnosis with code context + 2-3 fix options with trade-offs, user picks which fix to apply
- Resume: on crash/interruption, show what completed and what didn't, let user choose: continue from checkpoint or restart the wave
- Failure patterns: track all failures in a log, escalate to user with systemic diagnosis if same type of failure repeats 3+ times

### Claude's Discretion
- Figma component handling (generate new vs map to closest existing)
- Responsive strategy per Figma file (based on available breakpoints)
- Design system export curation (what's worth including)
- Failure severity assessment (isolate vs pause)

</decisions>

<specifics>
## Specific Ideas

- Figma import should feed into the same plan-then-execute pipeline as start-design — consistency matters
- Visual QA overlay diff ties into the existing verify step, not a separate workflow
- Progress reporting uses STATE.md as the source of truth (consistent with existing context rot prevention design)
- Failure escalation after 3 repeated failures catches systemic issues early

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-integration-polish*
*Context gathered: 2026-02-24*
