---
description: "Post-Ship Learning Capture — accept user feedback after delivery, extract 3 lessons into cross-project KB (L6), route issues into next iteration backlog. Closes the pipeline learning loop."
argument-hint: "[--prompt-structured] [--feedback-file <path>]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: sonnet-4-6
---

# /gen:postship

v3.5.3 pipeline-depth Stage 14. The last stage and the one most often skipped. Skipping it is the biggest cause of "Genorah doesn't learn."

## Workflow

### 1. Read post-ship state

- Check if project shipped (`.planning/genorah/ship-check.md` decision = PASS)
- Read SESSION-LOG.md for session history
- Read any inbound feedback from `/gen:feedback` runs

### 2. Interview (conversational)

Prompt user:

```
Project shipped. Quick post-ship capture:

1. What worked here that you'd want to keep using? (techniques, patterns, agents)
2. What broke or underperformed?
3. Any novel observation — about this archetype, audience, or Genorah itself?
4. Any user-reported issues after ship? (Slack, email, analytics signal)
```

With `--prompt-structured`: accept JSON input instead of freeform.
With `--feedback-file <path>`: read from file (for async capture).

### 3. Extract lessons → L6 KB

For each of questions 1-3, produce one lesson note via `cross-project-kb` schema.

Lessons include:
- Archetype + beat tagging
- Techniques used
- Outcome (shipped? user-modified?)
- Evidence ledger refs
- `permit_cross_project` flag (default per project setting)

Write to `<vault_path>/lessons/<project-id>-<lesson-id>.md`.

### 4. Route issues

Question 4 (user-reported issues) → write to `.planning/genorah/post-ship-backlog.md`:

```markdown
# Post-Ship Backlog — client-alpha

## Reported issues

### 2026-04-15 — Mobile CTA tapped but no feedback
Source: user email
Evidence: http://live.site/hero on iOS Safari
Issue: Primary CTA on hero section — no visible state on tap
Severity: HIGH — affects conversion
Suggested: Add :active state to buttons; probably a missing -webkit-tap-highlight-color override

## Follow-up iterations
- [ ] Mobile CTA feedback state
```

Orchestrator surfaces this on next `/gen:iterate`.

### 5. Session-end ritual

Triggered automatically by `session-end.mjs` on project completion when `/gen:postship` hasn't run yet:

```
Prompt: "Run /gen:postship to capture learnings? [Y/n]"
```

Opt-in but prompted.

### 6. Ledger + L7 updates

```json
{
  "kind": "post-ship-captured",
  "subject": "project",
  "payload": {
    "lessons": 3,
    "backlog_items": 1,
    "cross_project_permitted": false
  }
}
```

If calibration-relevant feedback (judge disagreed with user, UX score didn't predict real-user experience): write to L7 `drift_alerts` for quarterly recalibration review.

## Anti-patterns

- ❌ Skipping post-ship — learning signal lost forever.
- ❌ Auto-capturing without user consent — trust violation.
- ❌ Lessons without evidence_ledger_ref — unverifiable claims.
- ❌ Routing issues into "eventually" without backlog entry — forgotten.
- ❌ Capturing only on "successful" ships — failures teach more than successes.
