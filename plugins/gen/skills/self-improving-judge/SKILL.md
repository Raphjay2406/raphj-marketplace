---
name: self-improving-judge
description: Quarterly recalibration via delta log — judge weights drift toward empirical SOTD correlations
tier: domain
triggers: [self-improving judge, recalibration, judge calibration, delta log, weight drift, calibration store, quarterly recal]
version: 4.0.0
---

## Layer 1: Decision Guidance

### When to Use

- When `/gen:recalibrate` runs quarterly or after N=10 completed projects
- When `judge-calibration/` delta log accumulates enough samples for statistical significance
- When the quality gate scores diverge from real Awwwards outcomes by >5 points
- When adding a new quality category that needs baseline weight assignment

### When NOT to Use

- Single-project ad-hoc score tweaks — use `/gen:recalibrate --manual` with explicit rationale instead
- Emergency hotfixes to broken gate logic — fix the gate code, not the weights
- Projects with fewer than 5 completed sections in the delta log — insufficient sample size

### Decision Tree

- If delta log has ≥10 samples → run full Bayesian weight update
- If delta log has 5–9 samples → run conservative partial update (max ±0.05 per category)
- If delta log has <5 samples → skip update, log `insufficient_data` event
- If any weight moves >0.15 → trigger human-review gate before applying

### Pipeline Connection

- **Referenced by:** `/gen:recalibrate` command, `judge-calibration/` scripts, `calibration-store.mjs`
- **Consumed at:** Quality gate scoring (weights loaded from `calibration-store` at audit time)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Append a delta log entry after project completion

```typescript
import { appendDeltaLog } from "@/scripts/judge-calibration/delta-log.mjs";

await appendDeltaLog({
  projectSlug: "acme-redesign",
  gateScore: 218,
  awwwardsOutcome: "SOTD",
  categoryScores: {
    colorSystem: 28,
    typography: 22,
    creativeCourage: 19,
  },
  timestamp: new Date().toISOString(),
});
```

#### Pattern: Run recalibration and apply new weights

```typescript
import { recalibrate } from "@/scripts/judge-calibration/recalibrate.mjs";
import { CalibrationStore } from "@/scripts/calibration-store.mjs";

const { newWeights, drift, sampleCount } = await recalibrate({
  deltaLogPath: ".planning/genorah/judge-delta.ndjson",
  minSamples: 10,
  maxWeightShift: 0.15,
});

if (drift.some(d => d.abs > 0.15)) {
  throw new Error("Weight shift exceeds safe threshold — human review required");
}

await CalibrationStore.applyWeights(newWeights);
console.log(`Recalibrated with ${sampleCount} samples. Max drift: ${Math.max(...drift.map(d => d.abs)).toFixed(3)}`);
```

#### Pattern: Read current weights in quality-gate audit

```typescript
import { CalibrationStore } from "@/scripts/calibration-store.mjs";

const weights = await CalibrationStore.getWeights();
const weightedScore = rawScore * (weights.colorSystem ?? 1.2);
```

### Reference Sites

- **Elo rating system** (en.wikipedia.org/wiki/Elo_rating_system) — iterative weight convergence model
- **Bayesian A/B testing** (statisticsbyjim.com) — posterior update with small samples

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--accent` | Calibration dashboard positive drift indicator |
| `--tension` | Negative drift / regression warning color |
| `--muted` | Stable (no drift) category label |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| AI-Native | Surface calibration drift as real-time dashboard widget |
| Minimal | Suppress dashboard; emit calibration summary to SESSION-LOG.md only |

### Pipeline Stage

- **Input from:** Completed project delta log entries (post-ship outcome data)
- **Output to:** `calibration-store.mjs` weights; quality-gate scoring pipeline

### Related Skills

- `quality-gate-v3` — consumes the weights produced by this skill
- `sqlite-vec-memory-graph` — stores historical calibration snapshots as graph nodes
- `quality-learning` — broader learning system of which recalibration is one component

## Layer 4: Anti-Patterns

### Anti-Pattern: Recalibrating after every project

**What goes wrong:** High-variance single-project outcomes cause weights to oscillate; the gate becomes unstable.
**Instead:** Accumulate at least 10 projects before recalibrating. Use the `minSamples` guard in `recalibrate()`.

### Anti-Pattern: Applying weights without drift check

**What goes wrong:** A bad outlier project (e.g., SOTD due to viral marketing, not design quality) skews a category weight by 0.3+, breaking the gate for all future projects.
**Instead:** Always enforce `maxWeightShift: 0.15` and require human approval for any shift above that threshold.

### Anti-Pattern: Using gate scores as ground truth without Awwwards outcomes

**What goes wrong:** The judge recalibrates against itself (self-referential loop), amplifying existing biases rather than correcting them.
**Instead:** Only include delta log entries that have a real external outcome (`awwwardsOutcome` field). Entries without external validation are excluded from weight updates.
