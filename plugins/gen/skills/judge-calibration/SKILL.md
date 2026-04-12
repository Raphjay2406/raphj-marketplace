---
name: judge-calibration
description: Golden-set anchoring + few-shot prompting + inter-judge agreement κ + drift detection for LLM-as-judge in variant tournament and quality-gate-v3 scoring. Pins judge model version; records calibration history in ~/.claude/genorah/calibration.db.
tier: core
triggers: judge-calibration, golden-set, few-shot, kappa, inter-judge, drift, quality-gate-v3, variant-tournament
version: 0.1.0-provisional
status: PROVISIONAL — thresholds calibrated in research track R1.
---

# Judge Calibration

Removes the single biggest source of variant-tournament unreliability: judge drift. Every judge invocation in Genorah v3.5+ runs through this skill.

## Layer 1 — When to use

Invoked automatically by:
- `/gen:tournament` (variant scoring)
- `quality-reviewer` (Design + UX axis scoring)
- `/gen:calibrate-judge` (standalone drift check)
- `/gen:recalibrate` (quarterly ritual)

## Layer 2 — Protocol

### Pinned model

- Judge model pinned by version ID in `.claude-plugin/config.json` → `judge.model`.
- Upgrades require re-validation against golden set before adoption.
- Current pin (provisional): `claude-opus-4-6[vision]` as of 2026-04.

### Golden set

- 50 reference sections (25 archetypes × 2 beats: HOOK + PEAK).
- Pre-scored by 3-human consensus panel on both axes (Design 234, UX 120).
- Stored at `skills/judge-calibration/golden/<archetype>-<beat>-<id>.md` with frontmatter:
  ```yaml
  archetype: editorial
  beat: HOOK
  consensus_scores:
    design: 187
    ux: 94
  panel:
    - reviewer: designer-a
      design: 189
      ux: 92
    ...
  notes: "..."
  ```
- Scaffolded in v3.5.0; populated across v3.5.0–3.

### Few-shot anchoring

Every judge invocation includes 3-shot few-shot from same (archetype, beat):
- 1 known-failing section (scores < tier-2 of rubric)
- 1 mid-tier section (scores ∈ tier-3)
- 1 known-excellent section (scores ∈ tier-5)

Anchors the judge to the scale. Prevents drift toward "generous" or "stingy."

### Inter-judge agreement

For HOOK / PEAK / CLOSE beats (high stakes):
1. Spawn 2 independent judges with same prompt + different temperature seeds.
2. Compute Cohen's κ between their categorical verdicts (tier assignments).
3. Thresholds:
   - κ ≥ 0.7 → ship with mean score
   - 0.5 ≤ κ < 0.7 → WARN; ship with mean but flag in SUMMARY.md
   - κ < 0.5 → spawn 3rd judge as tiebreaker; ship with median

### Meta-evaluation sampling

5% of live judgments re-scored by higher-tier judge (Opus with more context + golden-set lookup). Drift detection:
- Compute ΔRMSE between live judge and meta-judge over rolling 30-day window
- Drift > 10% → alert at session-start, suggest `/gen:recalibrate`

### Calibration store (L7)

SQLite at `~/.claude/genorah/calibration.db` with tables:
- `goldens` — seed data + panel scores
- `judgments` — every judge call with timestamp, model, prompt_hash, score, subject
- `kappa_history` — per-session κ measurements
- `drift_alerts` — windowed drift detections

## Layer 3 — Integration

### Judge spawn prompt template

```
You are the Genorah Quality Judge.

MODEL PIN: claude-opus-4-6[vision] (2026-04)

RUBRIC (summarized):
{quality-gate-v3 rubric excerpt for scope}

FEW-SHOT ANCHORS (3 from same archetype+beat):
### Anchor 1 (FAILING — ground truth D=142, UX=64)
{summary + screenshot}
...

### Anchor 3 (EXCELLENT — ground truth D=212, UX=108)
{summary + screenshot}

TASK: Score the candidate section below on BOTH axes with per-category breakdown.

CANDIDATE:
{candidate summary + screenshot}

OUTPUT (strict JSON):
{
  "design": { "total": 0, "categories": {...} },
  "ux": { "total": 0, "categories": {...} },
  "notes": "...",
  "confidence": 1-5
}
```

### Ledger writes

Every judge call:
```json
{
  "kind": "variant-scored",
  "subject": "<section/variant>",
  "payload": {
    "judge_model": "claude-opus-4-6",
    "design": 187, "ux": 94,
    "kappa": 0.78,
    "confidence": 4
  }
}
```

### Recalibration

`/gen:recalibrate`:
1. Re-run all pinned judges against full golden set.
2. Compute ΔRMSE vs stored panel scores.
3. If > 10%, surface diff; propose shipping-default updates.
4. Require user approval to write new defaults to `.claude-plugin/config.json`.

## Layer 4 — Anti-patterns

- ❌ Inline judge prompt without anchors — drift catastrophe.
- ❌ Running κ on only 1 judge — no agreement computable; force 2 minimum on high-stakes beats.
- ❌ Accepting κ < 0.5 silently — this is a judgment crisis; always escalate to tiebreaker.
- ❌ Golden-set additions without panel scoring — pollutes anchors; every entry requires consensus scores.
- ❌ Bumping judge model version without re-calibration — every new model is a new tool; calibrate before shipping.
