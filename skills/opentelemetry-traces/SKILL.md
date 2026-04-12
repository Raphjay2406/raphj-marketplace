---
name: "opentelemetry-traces"
description: "OpenTelemetry SDK in Next.js/Nuxt/SvelteKit/Astro. Spans for route, DB, AI gateway, tool calls. OTLP export to Grafana Cloud, Honeycomb, or Vercel Observability."
tier: "domain"
triggers: "opentelemetry, otel, tracing, distributed tracing, observability traces"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Production traffic > 10k requests/day.
- Multi-service architecture (frontend + API + AI gateway + DB).
- Need p95 latency attribution per endpoint / span.

### When NOT to Use

- Prototype / pre-launch — wait for first real users.
- Fully static site — nothing to trace.

## Layer 2: Example (Next.js instrumentation.ts)

```ts
// instrumentation.ts (Next 16)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({ url: process.env.OTLP_URL }),
      instrumentations: [getNodeAutoInstrumentations()],
    });
    sdk.start();
  }
}
```

Manual spans for AI calls:
```ts
import { trace } from '@opentelemetry/api';
const span = trace.getTracer('ai').startSpan('agent.step');
try { await agentStep(); } finally { span.end(); }
```

## Layer 3: Integration Context

- Exports: OTLP/HTTP → Grafana Cloud / Honeycomb / Vercel Observability.
- Resource attributes: `service.name`, `deployment.environment`, `service.version` → pipeline knows which build.
- Pair with `slo-error-budgets` skill for burn rate alerts.
- Link spans to Vercel AI Gateway cost events via `session.id` attribute.

## Layer 4: Anti-Patterns

- Sampling 100% in production — cost explosion; use head-based 10% + tail-based for errors.
- Leaking PII in span attributes — scrub first.
- Missing propagation across fetch — add `@opentelemetry/instrumentation-fetch`.
