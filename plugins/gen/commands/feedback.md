---
description: Process client or stakeholder feedback into actionable iteration items — screenshots, annotations, text notes, or verbal feedback
argument-hint: "[feedback text or path to screenshot/PDF]"
allowed-tools: Read, Write, Edit, Grep, Glob, TodoWrite, mcp__plugin_playwright_playwright__browser_*, mcp__nano-banana__generate_image
---

# /gen:feedback

Process raw client or stakeholder feedback into structured, priority-ordered iteration items mapped to the correct pipeline actions.

## Accepted Feedback Formats

1. **Text feedback** — inline string: `"The hero feels too dark, pricing is confusing"`
2. **Screenshot path** — read the image, identify visual issues by area
3. **Annotated PDF/image** — read annotations, extract marked regions and comments
4. **Meeting notes** — freeform text: `"Client wants brighter colors, bigger CTA, testimonials moved up"`

If the argument is a file path, use the Read tool to inspect it visually or textually. If it is inline text, parse directly.

## Workflow

### Step 1 — Load Context

1. Read `.planning/genorah/CONTEXT.md` for current DNA tokens, archetype, arc position, and wave state.
2. Read `.planning/genorah/DESIGN-DNA.md` for locked visual identity.
3. Read `.planning/genorah/MASTER-PLAN.md` for section map and dependencies.
4. Read `.planning/genorah/STATE.md` for current phase and section statuses.

### Step 2 — Ingest Feedback

1. If the argument is a file path (screenshot, PDF, image), read it and describe every issue visible — markup, annotations, highlighted regions, handwritten notes.
2. If the argument is text, parse each distinct concern into a separate issue.
3. Preserve the original feedback verbatim for the artifact.

### Step 3 — Parse Into Structured Issues

Build an issue table:

```
Feedback Analysis
=================
Source: [text | screenshot | annotated image | meeting notes]
Date: [YYYY-MM-DD]

| # | Issue | Section | Severity | Category | Actionable? |
|---|-------|---------|----------|----------|-------------|
| 1 | "Hero too dark" | hero | Medium | Color/Contrast | Yes — increase bg lightness |
| 2 | "Pricing confusing" | pricing | High | Layout/UX | Yes — simplify tier structure |
| 3 | "Add testimonials" | -- | Medium | Content | Yes — add PROOF section |
```

**Severity classification:**
- **Critical** — Broken functionality, accessibility failures, brand violations, legal/compliance issues
- **High** — User confusion, conversion blockers, major aesthetic issues, content errors
- **Medium** — Polish, preference changes, "nice to have" improvements
- **Low** — Subjective taste differences, minor tweaks, optional enhancements

### Step 4 — Archetype Conflict Detection

For each issue, check whether the requested change conflicts with the locked archetype:

- If feedback says "add rounded corners" but archetype is Brutalist — flag the conflict.
- If feedback says "make it more playful" but archetype is Swiss/International — flag the conflict.
- For every conflict, suggest an **archetype-compatible alternative** that addresses the underlying concern without breaking design rules.
- If the client insists, note that a tension override can be applied with documented rationale.

### Step 5 — Map Issues to Pipeline Actions

| Category | Pipeline Action | Suggested Command |
|----------|----------------|-------------------|
| Color / Contrast | DNA token adjustment | `/gen:iterate --section [X]` |
| Typography | DNA font/scale revision | `/gen:iterate --section [X]` |
| Layout / UX | PLAN.md revision | `/gen:plan --section [X]` |
| Content changes | CONTENT.md update | Content revision workflow |
| New section request | MASTER-PLAN.md amendment | `/gen:plan` |
| Motion / Animation | Motion token adjustment | `/gen:iterate --section [X]` |
| Subjective preference | Creative Director review | `/gen:discuss` |
| Bug / Broken element | Root cause analysis | `/gen:bugfix` |

### Step 6 — Generate Feedback Artifact

Write `.planning/genorah/FEEDBACK-{YYYY-MM-DD}.md` containing:

1. **Original Feedback** — preserved verbatim, unedited
2. **Parsed Issues Table** — from Step 3
3. **Archetype Conflicts** — from Step 4 (if any)
4. **Recommended Actions** — priority-ordered list with specific commands
5. **Impact Assessment** — which sections are affected, blast radius (does fixing section A require changes in section B?), estimated effort
6. **Dependency Map** — if multiple issues interact, note the order they should be addressed

### Step 7 — Before/After Visualization (if available)

1. If Playwright MCP is available, capture screenshots of each affected section in its current state.
2. Store captures in `.planning/genorah/feedback-captures/before-{date}/`.
3. After iteration is complete, capture the new state for side-by-side comparison.

### Step 8 — Present Summary

Output the parsed issues table, recommended actions, and any archetype conflicts to the user. Ask for approval before proceeding with any changes.

## Completion Format

```
Feedback Processing Complete
=============================
Source: [format]
Issues found: [N]
  Critical: [N]  |  High: [N]  |  Medium: [N]  |  Low: [N]
Archetype conflicts: [N]
Artifact: .planning/genorah/FEEDBACK-{date}.md

Recommended next steps:
1. [highest priority action + command]
2. [second priority action + command]
3. [third priority action + command]

Proceed with recommended actions? [y/n]
```

## Rules

- Never discard or paraphrase original feedback — always preserve verbatim in the artifact.
- Never auto-apply changes without user approval. Present, then wait for confirmation.
- If multiple feedback sources exist for the same date, append a counter: `FEEDBACK-2026-04-11-2.md`.
- Respect the locked Design DNA. Flag conflicts rather than silently overriding tokens.
- Group related issues together when they affect the same section to avoid redundant iteration passes.
- If feedback is ambiguous ("it doesn't feel right"), ask clarifying questions before categorizing.
- Always check whether a feedback item was already addressed in a previous `FEEDBACK-*.md` to avoid duplicate work.
