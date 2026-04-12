---
name: telemetry-rum
description: Real-user monitoring + telemetry integration. Vercel Analytics / Speed Insights / PostHog / Plausible / Fathom per privacy posture. Core Web Vitals + conversion events + user journey.
tier: domain
triggers: telemetry, rum, analytics, web-vitals, posthog, plausible, vercel-analytics
version: 0.1.0
---

# Telemetry + RUM

`/gen:telemetry init <provider>` scaffolds provider. Privacy-first default: cookieless providers.

## Layer 1 — When to use

Every production project gets telemetry unless explicitly opted-out. Default cookieless (Vercel Analytics, Plausible, Fathom).

## Layer 2 — Provider matrix

| Provider | Cookieless | Self-hostable | Best for |
|---|---|---|---|
| Vercel Analytics | Yes | No | Vercel-deployed, zero-config |
| Vercel Speed Insights | Yes | No | CWV monitoring on Vercel |
| PostHog | Yes (configurable) | Yes | Feature flags + session replay + funnel |
| Plausible | Yes | Yes | Privacy-focused basic analytics |
| Fathom | Yes | No | Privacy-focused, lightweight |
| Google Analytics 4 | No | No | Legacy requirement only — avoid by default |

## Layer 3 — Core Web Vitals

Every project tracks:

```ts
// app/web-vitals.ts
import { onCLS, onINP, onLCP, onTTFB, onFCP } from 'web-vitals/attribution';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric);
  if (navigator.sendBeacon) navigator.sendBeacon('/api/vitals', body);
  else fetch('/api/vitals', { body, method: 'POST', keepalive: true });
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
onFCP(sendToAnalytics);
```

## Layer 4 — User journey events

From PROJECT.md primary goals, generate event taxonomy:

```ts
// Events derived from goals
track('page_view', { page });
track('cta_click', { cta, beat, section });
track('form_start', { form });
track('form_submit', { form });
track('trial_start', { plan });
track('conversion', { goal, value });
```

Stored in analytics provider; joinable to funnel.

## Layer 5 — Conversion funnel config

```ts
// .planning/genorah/funnel.json
{
  "funnels": [
    {
      "name": "trial_signup",
      "steps": [
        { "event": "page_view", "filters": { "page": "/" } },
        { "event": "cta_click", "filters": { "cta": "start-trial" } },
        { "event": "form_start", "filters": { "form": "signup" } },
        { "event": "form_submit", "filters": { "form": "signup" } },
        { "event": "trial_start" }
      ]
    }
  ]
}
```

## Layer 6 — Privacy posture

Default:
- Cookieless
- No PII in events
- Respect `Do Not Track`
- No third-party pixels
- Data retention 90 days

Explicit opt-in required for:
- Session replay (PostHog)
- Cross-device user stitching
- IP address storage

## Layer 7 — Integration

- `/gen:telemetry init plausible` scaffolds
- Env vars added: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, etc.
- Dashboard telemetry tab shows live CWV + funnel (for self-hosted / Vercel)
- Post-ship: `/gen:postship` references real-user data for learnings

## Layer 8 — Anti-patterns

- ❌ GA4 without CMP / cookie banner — legal exposure EU/UK
- ❌ Tracking PII in events — jurisdiction risk
- ❌ Session replay default-on — user surprise; opt-in
- ❌ Analytics as heavy bundle — lazy-load non-critical beacons
- ❌ No sampling on high-traffic — costs explode
