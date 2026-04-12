---
name: canary-rolling-release
description: Rolling release + canary deploys via Vercel Rolling Releases (GA 2025-06). Gradual traffic shift with auto-promote on metrics stability + auto-rollback on regression.
tier: domain
triggers: canary, rolling-release, gradual-deploy, auto-rollback, feature-flag
version: 0.1.0
---

# Canary Rolling Release

v3.6. `/gen:canary [--percent 10|25|50]` for percentage traffic routing.

## Layer 1 — When to use

After ship-check PASS, if production traffic warrants caution. Default 10% canary, 24h watch window.

## Layer 2 — Flow

```
1. Current prod:           v1.0.0 — 100% traffic
2. /gen:canary --percent 10:
   → deploy v1.1.0, shift 10% traffic
   → Start metrics watch (Vercel Analytics + Speed Insights):
     - Error rate delta
     - LCP / INP / CLS delta
     - Conversion delta (if tracked)
3. 24h watch:
   - Metrics stable → auto-promote to 100%
   - Regression detected → auto-rollback to v1.0.0
4. Ledger on every transition
```

## Layer 3 — Metric gates

| Metric | Auto-rollback threshold |
|---|---|
| Error rate | +0.5% absolute |
| LCP p75 | +300ms |
| INP p75 | +50ms |
| CLS | +0.05 |
| Conversion rate | -5% relative |

## Layer 4 — Vercel Rolling Releases config

```ts
// vercel.ts
export const config = {
  rollingRelease: {
    enabled: true,
    defaultPercent: 10,
    autoPromote: {
      after: '24h',
      metrics: ['error-rate', 'lcp', 'inp'],
    },
    autoRollback: {
      errorRate: { threshold: 0.005, window: '1h' },
      lcp: { threshold: 300, window: '1h' },
    },
  },
};
```

## Layer 5 — Feature flags

Lightweight flag support via Vercel Edge Config or GrowthBook:

```ts
import { get } from '@vercel/edge-config';
const isNewPricingEnabled = await get('new-pricing-v2');
```

Flag-gated features can be canaried independently of deploy.

## Layer 6 — Integration

- Requires deploy-preview skill (canary is extension of deploy)
- Telemetry/RUM skill provides metrics source
- Ledger: `{kind: "canary-shifted", payload: {from, to, percent, metrics}}`
- Dashboard canary tab shows live traffic split + metrics delta

## Layer 7 — Anti-patterns

- ❌ Canary without baseline metrics — can't detect regression
- ❌ Auto-promote window < 4h — insufficient data on low-traffic days
- ❌ Rollback on single metric flutter — use rolling window + significance
- ❌ Canary a breaking API change — split traffic means split clients; use deprecation-period instead
