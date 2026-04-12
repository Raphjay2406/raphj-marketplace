---
name: compaction-survivor
description: Protocol formalizing what pre-compact.mjs preserves. Packs top-10 ledger entries + open decisions + active critiques + next-action into compaction-summary.md (≤3000 tokens) that session-start reads first on resume.
tier: core
triggers: compaction-survivor, pre-compact, session-resume, context-rot
version: 0.1.0-provisional
---

# Compaction Survivor Protocol

When context compaction happens, most state is lost. This skill defines EXACTLY what survives.

## Layer 1 — When to use

Invoked by `pre-compact.mjs` hook automatically. Also callable standalone via orchestrator at high-context-usage warnings.

## Layer 2 — What to preserve

### Tier A — Identity (always, ~400 tokens)

- Project name + archetype + beat sequence
- DNA tokens (12 colors + fonts + signature element)
- Current pipeline stage
- Active wave + wave membership

### Tier B — Open state (~800 tokens)

- Decisions made but not yet reflected in code (from decision-graph `status=pending`)
- Critiques issued but not yet applied (`sections/*/CRITIQUE-*.md` with recent ts)
- Trajectory entries currently mid-loop (termination not fired yet)
- Sub-gates fired with pending cascade application

### Tier C — Signal events (~1200 tokens)

Top-10 most-referenced ledger entries since last session-end (or last 50, whichever less):
- decisions-made
- sub-gate fires with cap applied
- variants selected
- critic findings with CRITICAL/HIGH
- user feedback events

Ranked by:
```
score = recency_weight * 0.4 + ref_count * 0.4 + severity_weight * 0.2
```

### Tier D — Next action (~200 tokens)

Explicit next step from `pipeline-guidance` at point of compaction:
- "You were in Stage 7 (Build), Wave 2, 2/4 sections shipped."
- "Next: run `/gen:reconcile` at wave boundary."
- Link to exact file/line where work resumes.

### Tier E — Drop (not preserved)

- Routine tool-call results
- Low-severity findings
- Variant scores that didn't win Pareto
- Intermediate trajectory iterations that were superseded

## Layer 3 — Output

`.planning/genorah/compaction-summary.md`:

```markdown
# Compaction Summary — 2026-04-12T10:34:00Z

## Identity
Project: client-alpha (Editorial / PEAK arc)
Archetype: Editorial
Stage: Stage 7 (Build), Wave 2 (2/4 sections complete)

DNA snapshot: primary #1e293b, secondary #f59e0b, display=Fraunces, body=Inter, signature=drop-cap-on-first-p

## Open state
- DECISION PENDING: Swap hero-bg from WebGL waves → typographic composition (ref: decisions.json#d-042)
- CRITIQUE PENDING APPLY: Hero/senior-designer (2 HIGH, 3 MEDIUM) — see sections/hero/CRITIQUE-senior-designer.md

## Recent signals (top 10)
1. 10:30Z  variant-selected hero → v2 (design 193, ux 92)
2. 10:25Z  subgate-fired hero/motion-health FAIL (INP 220ms) → Motion × 0.5 cap
3. 10:22Z  critique-issued hero/senior-designer (2 HIGH)
4. ...

## Next action
Stage 7 Wave 2 continues with sections: pricing, testimonials.
Run `/gen:reconcile` after wave 2 before wave 3 to catch drift.

---
(Context budget: ~2800/3000 tokens)
```

## Layer 4 — Integration

### pre-compact.mjs hook upgrade

```js
import { buildCompactionSummary } from './compaction-survivor.mjs';

export default async function preCompact() {
  const summary = await buildCompactionSummary();
  await writeFile('.planning/genorah/compaction-summary.md', summary);
  await ledgerWrite('hook:pre-compact', 'compaction-run', 'project', { tokens: summary.length / 4 });
}
```

### session-start.mjs reads first

```js
const summary = await tryRead('.planning/genorah/compaction-summary.md');
if (summary) {
  emit('Resuming post-compact. Summary loaded. Last action: ...');
}
```

## Layer 5 — Anti-patterns

- ❌ Preserving > 3000 tokens — defeats compaction; trust Tiers A-D selection.
- ❌ Hard-coding "preserve everything important" — all events seem important mid-session; use scoring.
- ❌ Including code diffs in summary — file system already holds those; reference path instead.
- ❌ Not surfacing summary at session-start — compaction then amnesia, user rediscovery burn.
- ❌ Forcing Tier C to exactly 10 entries regardless of relevance — cap is ceiling, not floor; 5 strong > 10 noisy.
