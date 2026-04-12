---
name: model-cascade
category: core
description: "Tiered model assignment per beat type and agent role. Haiku for scaffold, Sonnet for hero work, Opus for judging. Advisory-only in v3.0 (Claude Code can't switch models mid-session); emits recommended-model hints + cost telemetry."
triggers: ["model selection", "cost optimization", "cascade", "escalation", "model tier", "recommended model"]
used_by: ["orchestrator", "builder", "all commands"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Cascade

Not every section needs Opus. Wave-0 scaffold is mechanical — Haiku handles it at 1/10 cost. Hero HOOK sections carry the project — Sonnet is the sweet spot. Tournament judging and cross-section consistency audits benefit from Opus's deliberation.

Running everything on Opus wastes budget. Running everything on Haiku drops quality on creative beats. Cascading by role + beat type is the Pareto-optimal point.

### v3.0 Constraint

**Claude Code plugins CANNOT programmatically switch the active model mid-conversation.** The `model` field is set per-session. This skill ships as **advisory** in v3.0:

1. Every command declares `recommended-model:` in frontmatter.
2. `user-prompt.mjs` hook surfaces a nudge when current model doesn't match the recommendation.
3. `post-tool-use.mjs` logs `{section, beat, model_used, recommended, est_cost}` to METRICS.md.
4. Future: when `Task({model})` is exposed by the SDK, subagents auto-select.

### When to Use

- At start of a wave: orchestrator reads cascade table, emits wave-level recommendation.
- Per-command: frontmatter `recommended-model` guides `/model` switching.
- Per-section: builder notes beat type → recommended model → emitted in SUMMARY.md.

### Decision Tree

```
Stage / role?
├─ Wave 0 scaffold           → Haiku 4.5
├─ Simple beat (BREATHE/PROOF/CLOSE/PIVOT) → Haiku 4.5
├─ Hero beat (HOOK/PEAK/REVEAL)            → Sonnet 4.6
├─ 3D / WebGL section                       → Sonnet 4.6 (escalate to Opus on shader failure)
├─ Creative-director review                 → Opus 4.6 (always)
├─ Consistency-auditor                      → Sonnet 4.6 (Opus on >5 conflicts)
├─ Tournament judge                         → Opus 4.6 (always)
├─ Visual-refiner                           → Sonnet 4.6 (surgical edits, not creative)
└─ Polisher                                 → Sonnet 4.6
```

## Layer 2: Technical Spec

### Strategy matrix

| Stage / Beat | Default Model | Escalate To | Trigger |
|--------------|---------------|-------------|---------|
| Wave 0 scaffold | haiku-4-5 | sonnet-4-6 | build error or score <140 |
| BREATHE / PROOF / CLOSE / PIVOT | haiku-4-5 | sonnet-4-6 | quality < tier-target |
| HOOK / PEAK / REVEAL | sonnet-4-6 | opus-4-6 | first retry fails |
| 3D / WebGL sections | sonnet-4-6 | opus-4-6 | shader correctness fail |
| creative-director review | opus-4-6 | — | always |
| consistency-auditor | sonnet-4-6 | opus-4-6 | >5 conflicts detected |
| tournament judge | opus-4-6 | — | always |
| visual-refiner | sonnet-4-6 | — | surgical edits |
| polisher | sonnet-4-6 | — | terminal |

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| max_escalations_per_section | 0 | 2 | int | HARD |
| haiku_token_budget | — | 60K | tokens | SOFT |
| sonnet_token_budget | — | 200K | tokens | SOFT |
| opus_token_budget | — | 500K | tokens | SOFT |
| escalation_score_threshold | 140 | 235 | gate-pts | per tier target |

### Advisory output in METRICS.md

```yaml
wave_model_recommendation:
  wave: 2
  sections:
    - {name: hero, beat: HOOK, recommended: sonnet-4-6, current: sonnet-4-6, ok: true}
    - {name: features, beat: PROOF, recommended: haiku-4-5, current: sonnet-4-6, ok: false, note: "overkill"}
    - {name: pricing, beat: PEAK, recommended: sonnet-4-6, current: sonnet-4-6, ok: true}
  estimated_wave_cost_usd:
    recommended: 1.20
    current: 3.40
    savings: 2.20
```

## Layer 3: Integration Context

- **Every command frontmatter** gets a `recommended-model:` hint.
- **Orchestrator** aggregates per-wave recommendations, writes to METRICS.md.
- **user-prompt.mjs hook** compares current model to wave recommendation, nudges once per wave.
- **post-tool-use.mjs** logs actual-vs-recommended per tool call for audit trail.

## Layer 4: Anti-Patterns

- ❌ **Forcing user to switch models mid-build** — disruptive. Recommendations are advisory.
- ❌ **Auto-escalating without user knowledge** — transparency matters. Escalation triggers logged, user sees cost impact.
- ❌ **Running Opus on every section** — burns budget on mechanical work. Haiku suffices for scaffolding.
- ❌ **Running Haiku on hero HOOK** — under-powers the section that carries the project.
- ❌ **Ignoring per-command recommended-model frontmatter** — that's the interface for switching; without it, users can't tell what to run.
- ❌ **Treating cascade as runtime-automatic in v3.0** — it's not. Advisory only. Revisit when SDK exposes subagent model override.
