---
name: supabase-edge-functions
description: Supabase Edge Functions — Deno runtime, scheduled functions via pg_cron, HTTP functions, webhook handlers. Runs at edge locations worldwide.
tier: domain
triggers: supabase-edge, edge-functions, deno-runtime, pg-cron
version: 0.1.0
---

# Supabase Edge Functions

Deno runtime at Supabase's edge. Use for: webhooks, scheduled jobs, HTTP APIs that need Supabase auth context.

## Layer 1 — Create function

```bash
supabase functions new send-welcome
```

Creates `supabase/functions/send-welcome/index.ts`:

```ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { email } = await req.json();
  // send email via Resend or similar
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'hello@brand.com', to: email, subject: 'Welcome', html: '...' }),
  });

  return new Response(JSON.stringify({ sent: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Layer 2 — Deploy

```bash
supabase functions deploy send-welcome
```

Invoke from client:

```ts
const { data } = await supabase.functions.invoke('send-welcome', {
  body: { email: user.email },
});
```

## Layer 3 — Scheduled via pg_cron

```sql
-- Enable pg_cron extension (one-time)
CREATE EXTENSION pg_cron;

-- Schedule daily call
SELECT cron.schedule(
  'daily-digest',
  '0 9 * * *',
  $$
    SELECT net.http_post(
      url := 'https://<project>.supabase.co/functions/v1/daily-digest',
      headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key')),
      body := '{}'::jsonb
    );
  $$
);
```

## Layer 4 — Webhook handler pattern

```ts
// supabase/functions/stripe-webhook/index.ts
import Stripe from 'https://esm.sh/stripe@15';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

serve(async (req) => {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook signature failed: ${err.message}`, { status: 400 });
  }

  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      // ...
      break;
  }

  return new Response(JSON.stringify({ received: true }));
});
```

## Layer 5 — Env + secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets list
```

Edge functions access via `Deno.env.get(...)`.

## Layer 6 — Integration

- `/gen:supabase function new <name>` scaffolds
- Chains with `skills/api-routes/SKILL.md` webhook templates
- Cost: Supabase Free tier = 500K invocations/month

## Layer 7 — Anti-patterns

- ❌ Accessing SERVICE_ROLE_KEY unnecessarily — bypass RLS is dangerous; use user's JWT
- ❌ Long-running functions (>30s) — use Vercel Queues or Inngest instead
- ❌ Missing webhook signature verification — spoof surface
- ❌ No error tracking — failures invisible; integrate Sentry
- ❌ Synchronous Deno import of huge modules — slow cold start
