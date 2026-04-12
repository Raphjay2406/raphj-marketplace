---
name: "vercel-botid"
description: "Vercel BotID (GA 2025-06) — bot detection and verification. Protects AI endpoints, forms, and signup from scripted abuse without disrupting real users."
tier: "domain"
triggers: "botid, bot detection, vercel botid, anti bot, bot protection"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- AI endpoints exposed publicly (cost risk from scripted abuse).
- Signup, newsletter, contact forms — spam reduction.
- Any rate-sensitive endpoint where CAPTCHA would hurt UX.

### When NOT to Use

- Fully internal / authenticated endpoints.
- Paid-only API with keys already gating access.

## Layer 2: Example

```ts
import { checkBotId } from 'botid/server';

export async function POST(req: Request) {
  const verdict = await checkBotId();
  if (verdict.isBot && !verdict.isVerifiedBot) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... continue
}
```

Client instrumentation (Next.js middleware):
```ts
import { botid } from 'botid/next/server';
export const middleware = botid({ protect: ['/api/agent', '/api/newsletter'] });
```

## Layer 3: Integration Context

- Pair with `api-key-rotation` playbooks for authenticated endpoints.
- Verified bots (Googlebot, ClaudeBot) allowed per `geo-optimization` skill policy.
- Log bot verdicts as OpenTelemetry spans for burn-rate correlation.
- CSP and SRI (`csp-generator` skill) complete the hardening trio.

## Layer 4: Anti-Patterns

- Blocking all bots — kills LLM-driven search visibility (GEO).
- Using on latency-critical endpoint without caching verdict — adds ~50ms per request.
- Hard-fail UX — offer fallback (email confirm) if legit user misclassified.
