---
name: background-jobs
description: Background job patterns — Vercel Queues + Cron, Upstash QStash, Inngest for complex workflows, webhook processors, long-running AI jobs. Delivery guarantees + retry.
tier: domain
triggers: background-jobs, queues, cron, qstash, inngest, webhooks, long-running
version: 0.1.0
---

# Background Jobs

Patterns for anything that shouldn't block request path.

## Layer 1 — When to use

- Email send (after user action; doesn't block submit)
- AI generation (Remotion render, image gen)
- Webhook processor (Stripe/Shopify/HubSpot events)
- Scheduled tasks (digest emails, data sync)
- Post-ship analytics aggregation

## Layer 2 — Provider matrix

| Provider | Delivery | Best for |
|---|---|---|
| Vercel Queues (public beta) | At-least-once | Simple, Vercel-native |
| Vercel Cron | Scheduled | Daily/hourly tasks |
| Upstash QStash | At-least-once | Cross-platform serverless |
| Inngest | Exactly-once, durable | Complex multi-step workflows |
| Supabase Edge Functions + pg_cron | At-least-once | Supabase projects |

## Layer 3 — Patterns

### Vercel Queues (simple async)

```ts
// app/api/send-email/route.ts
import { queue } from '@vercel/functions';

export async function POST(req: Request) {
  const { to, template } = await req.json();
  await queue('email-send').enqueue({ to, template });
  return Response.json({ queued: true });
}

// app/api/worker/email/route.ts  (configured as queue worker)
export async function POST(req: Request) {
  const { to, template } = await req.json();
  await sendEmail(to, template);
  return Response.json({ sent: true });
}
```

### Vercel Cron (scheduled)

```ts
// vercel.ts
export const config = {
  crons: [
    { path: '/api/cron/daily-digest', schedule: '0 9 * * *' },
    { path: '/api/cron/cleanup', schedule: '0 0 * * 0' },
  ],
};
```

### Inngest (durable workflow)

```ts
export const processOrder = inngest.createFunction(
  { id: 'process-order' },
  { event: 'order/created' },
  async ({ event, step }) => {
    const charged = await step.run('charge', () => stripe.charge(event.data));
    await step.sleep('wait-settlement', '2h');
    const fulfilled = await step.run('fulfill', () => ship(event.data));
    await step.run('notify', () => email.send(event.data.user, { charged, fulfilled }));
  }
);
```

### n8n (external workflow engine)

See `skills/n8n-workflows/SKILL.md` (v3.15) — generates importable workflow JSON.

## Layer 4 — Retry + idempotency

Every worker is idempotent:
- Deduplicate on incoming message ID
- Use DB transaction for state changes
- Webhook signature verification before processing

Retry policy per queue:
- Transient (5xx, network) → exponential backoff, 5 retries
- Permanent (validation fail) → no retry, DLQ

Dead-letter queue monitored; alerts on size > threshold.

## Layer 5 — Observability

- Structured logs per job (job_id, type, duration, outcome)
- Dashboard background-jobs tab: queue depth, error rate per queue
- Alerts on DLQ growth

## Layer 6 — Integration

- `/gen:jobs scaffold <type>` — scaffolds queue/cron/workflow
- Env vars added: `QSTASH_TOKEN`, `INNGEST_EVENT_KEY`, etc.
- Deploy-preview: cron jobs only run in production (suppressed in preview envs)

## Layer 7 — Anti-patterns

- ❌ Synchronous email in request handler — 30s timeout kills slow sends
- ❌ No idempotency — duplicate jobs fire duplicate outcomes
- ❌ Missing DLQ — lost jobs invisible
- ❌ Cron in preview env — burns compute on preview deploys; gate on env
