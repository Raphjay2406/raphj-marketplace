---
name: cross-project-kb
description: L6 of Context Fabric — Obsidian vault enrichment with lessons extracted at project completion. Per-archetype patterns, technique discoveries, conversion wins, failure modes. Session-end prompts extract 3 lessons per ship; cross-project retrieval on /gen:start-project.
tier: core
triggers: cross-project-kb, context-fabric-l6, obsidian, lessons, patterns, session-end
version: 0.1.0-provisional
---

# Cross-Project Knowledge Base (L6)

Lessons from Project A reach Project B. The Obsidian vault at `vault_path` (config key in `.claude/genorah.local.md`) becomes long-term memory — not ephemeral per-project state, but accumulated design + technique wisdom.

## Layer 1 — When to use

- `session-end.mjs` on project completion: prompts user to extract 3 lessons.
- `/gen:start-project`: pulls lessons matching chosen archetype as prior-art briefing.
- `/gen:postship` (v3.5.3 Stage 14): routes user feedback into KB.
- `/gen:research query`: surfaces patterns across projects.

## Layer 2 — Lesson schema

Obsidian note `lessons/<project-id>-<lesson-id>.md`:

```yaml
---
project_id: client-alpha
archetype: editorial
beat: PEAK
technique: drop-cap-scroll-scrub
outcome: design-193-ux-92-shipped-unmodified
severity: high-value
tags: [typography, scroll-animation, editorial]
evidence_ledger_ref: sections/hero/trajectory.json#ix2
permit_cross_project: true
captured_at: 2026-04-12
---

# Editorial PEAK — drop-cap with scroll-scrubbed reveal

## What worked

Using GSAP ScrollTrigger to drive `::first-letter` animation tied to scroll progress in the first paragraph. Drop-cap grew from 0.8× to 2.2× as user scrolled 0-300px. Felt editorial, not gimmicky.

## Why

Archetype demands serif display + long-form prose respect. Drop-cap signals "reading territory." Scroll-scrub made it signature without being loud.

## Reproducing

- Use Playfair Display or Canela for drop-cap
- Prose column must be prose-wide (~60-65ch)
- Scrub distance = 1 viewport height
- `font-feature-settings: 'swsh'` for stylistic swash on certain letters

## Don't

- Don't animate drop-cap with keyframes — can't tie to scroll
- Don't use on beats other than PEAK first-read — dilutes signature
```

## Layer 3 — Extraction (session-end)

`session-end.mjs` on project completion:

```
If project shipped and user approved capture:
  Prompt user: "Extract 3 lessons from this project:
    1. What worked (technique discovery)
    2. What failed (anti-pattern confirmed)
    3. Novel observation (archetype insight, audience signal, etc.)"
  Accept structured input; write 3 .md files to vault/lessons/
  Ledger: { kind: "lesson-captured", subject: lesson_id, payload: {...} }
```

Default `permit_cross_project: false` for client work; toggle via `.claude/genorah.local.md` `allow_cross_project_learnings: true`.

## Layer 4 — Retrieval

### /gen:start-project briefing

When archetype chosen:

```
1. Query vault/lessons/ for notes with archetype matching (or cross-archetype tagged).
2. Filter: permit_cross_project == true.
3. Surface top 3 as "prior art from your previous work:"
4. User can dismiss or deep-read before proceeding.
```

### Ad-hoc search

`/gen:research query` supports vault search:

```
/gen:research query --source kb "what works for Editorial PEAK?"
```

## Layer 5 — Privacy

- Lessons marked `permit_cross_project: false` are project-local only; never surface to other projects.
- Client identifying info (company names, specific features) in lessons gets auto-redacted to generic markers (`<client>`, `<feature>`) before surfacing.
- Session-end capture is opt-in, prompted not forced.

## Layer 6 — Integration

### Ledger ref

Every lesson references an evidence ledger ref so future readers can verify the claim against original data.

### Decay

Lessons recorded > 18 months ago get "age-flagged" on surface — "recorded 2024; tech has moved; verify relevance."

### Contradiction detection

When writing a new lesson that contradicts an older one (same archetype+beat, opposing technique), surface the conflict: "you previously noted X worked; now noting Y. Which is correct?" User resolves, one is marked `superseded_by`.

## Layer 7 — Anti-patterns

- ❌ Auto-capturing every session — dilutes signal; only prompt on ship.
- ❌ Forcing cross-project permission — user trust violation.
- ❌ Lessons without evidence_ledger_ref — unverifiable claims compound as project history grows.
- ❌ Indexing client-private lessons globally — privacy leak.
- ❌ Treating KB as template library — it's wisdom, not reusable components.
