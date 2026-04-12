---
name: "experimentation-layer"
description: "A/B/n variant serving with GrowthBook, Statsig, or Vercel Edge Config. Quality-gate-aware winner selection — variants must pass UX floor before being eligible to win on CVR alone."
tier: "domain"
triggers: "ab test, experimentation, growthbook, statsig, feature flag, variant test, winner selection"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Product has enough traffic for statistical significance (~1k conversions per variant per week).
- Stakeholders want to validate creative direction empirically, not only via expert review.
- Need gradual rollout beyond Rolling Releases canary.

### When NOT to Use

- <1k conversions/week — A/B noise dominates; use expert review + `/gen:audit`.
- Early-stage before brand is set — testing color variants wastes cycles.

### Decision Tree

- Self-hosted, full control → GrowthBook.
- Product analytics suite → Statsig.
- Simple flags, Vercel-native → Edge Config.

## Layer 2: Example (GrowthBook)

```ts
import { GrowthBook } from '@growthbook/growthbook-react';

export const gb = new GrowthBook({
  apiHost: process.env.GROWTHBOOK_HOST,
  clientKey: process.env.GROWTHBOOK_KEY,
  enableDevMode: process.env.NODE_ENV !== 'production',
  trackingCallback: (exp, result) => {
    track('experiment_viewed', { experiment: exp.key, variant: result.key });
  },
});

// Component
const hero = useFeatureValue('hero-variant', 'control'); // 'control' | 'kinetic' | 'editorial'
```

## Layer 3: Integration Context

- **Quality-gate-aware winner gate**: before declaring a winner, all candidate variants must have passed `/gen:audit` with Design ≥ 200 AND UX ≥ 100. Variants below floor are disqualified regardless of CVR.
- Archetype fidelity: variants may use secondary archetypes from mixing protocol, but must retain primary archetype testable markers.
- Telemetry: experiment IDs join `plugin-telemetry` ledger for plugin-health correlation.
- Long-term: winners roll into DNA archive; losers archived with reason.

## Layer 4: Anti-Patterns

- Shipping the UX-floor-failing variant because CVR won — short-term gain, brand erosion.
- Running >5 concurrent experiments on same page — interaction effects destroy attribution.
- Concluding before significance — false-positive rate spikes.
- Flags left on "experiment" state forever — flag debt accumulates.
