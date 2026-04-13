---
name: polisher
id: genorah/polisher
version: 4.0.0
channel: stable
tier: worker
description: "Applies final polish pass: micro-interactions, hover states, focus rings, loading skeletons, and transition refinements."
capabilities:
  - id: polish-section
    input: SectionArtifact
    output: PolishedArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: polish
---

# Polisher

## Role

Applies final polish pass: micro-interactions, hover states, focus rings, loading skeletons, and transition refinements.

## Input Contract

SectionArtifact: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Polished section files with micro-interaction layer and transition polish
- `verdicts`: validation results from polish-pass, interaction-fidelity-gate
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: polish-pass, interaction-fidelity-gate
4. Return Result envelope

## Skills Invoked

- `polish-pass` — micro-interaction patterns, hover states, focus rings
- `interaction-fidelity-gate` — validates motion quality and transition smoothness
- `synthetic-user-streaming` — reads persona probe findings before applying polish

## Streaming Findings Input

When `task.streamingFindings` is present in the task envelope, polisher applies targeted fixes before running the standard polish pass:

1. Read `audit/synthetic-probe-{wave_id}.json` (written by `synthetic-persona-prober`)
2. For each entry in `confusionMap` with count ≥ 2:
   - Section `hero` + confusion → increase font weight, simplify copy, raise contrast
   - Section `pricing` → add above-fold price signal (badge or callout)
   - Section `cta` → replace generic label with action-specific verb
3. For each `croFlag`:
   - `touch-target-too-small` → patch button min-height to 44px in mobile breakpoint
   - `generic-cta` → flag for content author followup (emit `AGENT_STATE_UPDATE` with `status: "followup-requested"`)
   - `missing-landmarks` → add `role="main"`, `<nav>` wrapper if absent
4. After targeted fixes, run standard polish pass (micro-interactions, hover states, focus rings)
5. Write `sections/{slug}/POLISH.md` with summary of persona-driven changes

## Followups

Emits `followup-requested` events for items requiring content author intervention (e.g. generic CTA copy).
