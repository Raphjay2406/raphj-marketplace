---
name: "slo-error-budgets"
description: "Service Level Objectives and error budgets. SLO config, burn rate alerts (fast + slow), user-facing status pages. For generated projects in production."
tier: "domain"
triggers: "slo, error budget, burn rate, sre, service level, availability target"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Production service with paying users.
- Pairs with `opentelemetry-traces`.
- Stakeholder needs clarity on "when to stop shipping features and fix reliability."

## Layer 2: SLO Config (`slo.yaml`)

```yaml
slos:
  - name: api-availability
    sli: 'ratio(successful_requests / total_requests)'
    target: 99.9
    window: 30d
  - name: api-latency-p95
    sli: 'histogram_quantile(0.95, http_request_duration_seconds_bucket)'
    target: 500ms
    window: 7d

alerts:
  fast_burn: { threshold: 14.4x, window: 1h, page: true }
  slow_burn: { threshold: 3x, window: 6h, page: false }
```

Generate Grafana/Prometheus rules via `scripts/slo-rules-gen.mjs`.

## Layer 3: Integration Context

- Burn rate > fast_burn → PagerDuty page + block further deploys via GitHub check.
- Public status page: `/status` route reads SLO data, shows last 90d uptime.
- Error budget exhausted → automatic feature-flag flip to maintenance mode.
- Ties into `canary-rolling-release`: burn rate spike during canary → auto-rollback.

## Layer 4: Anti-Patterns

- 100% SLOs — leaves no budget for change; impossible to maintain.
- No user journey SLOs — availability of homepage ≠ availability of checkout.
- Paging on slow burn — alert fatigue; slow burn = ticket, not page.
- Ignoring budget → sets wrong incentives; policy must bite.
