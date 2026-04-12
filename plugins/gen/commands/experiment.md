---
description: "v3.20 — Set up or evaluate an A/B/n experiment. Quality-gate-aware: variants below UX floor are auto-disqualified from winning."
argument-hint: "<setup|evaluate> <experiment-key> [--provider=growthbook|statsig|edge-config]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:experiment

## Subcommands

**setup `<key>`**
1. Create experiment definition in chosen provider.
2. Wire `useFeatureValue` in target component.
3. Require `/gen:audit` pass on every variant before enrollment opens.
4. Register in `.planning/genorah/experiments/<key>.json`.

**evaluate `<key>`**
1. Pull results from provider API.
2. Check statistical significance (default p < 0.05, 95% CI).
3. Check each variant's latest `/gen:audit` score.
4. Disqualify variants with Design < 200 OR UX < 100.
5. Declare winner only from qualified set.
6. Write `.planning/genorah/experiments/<key>-result.md` with recommendation.

## Integration

- Complements `tournament` (internal, judged) vs `experiment` (external, traffic).
- Winners feed into `post-ship-learning` stage of pipeline.
