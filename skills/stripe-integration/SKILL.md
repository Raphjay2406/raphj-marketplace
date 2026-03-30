---
name: "stripe-integration"
description: "Stripe payment integration patterns for Next.js and Astro. Checkout Sessions, Payment Intents, Subscriptions, Stripe Link, webhooks, Connect, and DNA-styled payment forms."
tier: "domain"
triggers: "stripe, payment, checkout, subscription, billing, e-commerce payment"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **E-commerce project with payments** -- Stripe's unified API and prebuilt UI components
- **Subscription/SaaS billing** -- Recurring billing with plan tiers, trials, customer self-service portals
- **Marketplace or platform** -- Multi-party payments split between platform and sellers (Stripe Connect)
- **One-click checkout** -- Stripe Link saves payment methods for returning customers

### When NOT to Use

- **Static sites with no server** -- Stripe requires server-side secret key operations; use Stripe Payment Links instead
- **Crypto / non-fiat payments** -- Use specialized providers; Stripe does not handle crypto
- **Simple PayPal-only flow** -- Integrate PayPal SDK directly

### Decision Tree

- If **fastest integration, no custom UI** -> **Checkout Sessions** (Pattern 1). Stripe-hosted page, zero PCI scope.
- If **custom form matching Design DNA** -> **Payment Intents + Elements** (Pattern 2). DNA-themed via Appearance API.
- If **recurring billing with plan management** -> **Subscriptions** (Pattern 3). `mode: 'subscription'` + Customer Portal.
- If **one-click returning-customer checkout** -> **Stripe Link** (Pattern 4). LinkAuthenticationElement in any Elements form.
- If **post-payment fulfillment or async events** -> **Webhooks** (Pattern 5). Required for production.
- If **multi-seller marketplace** -> **Connect** (Pattern 6). Onboard connected accounts, split payments.

### Authentication Model

| Key | Variable | Exposure | Purpose |
|-----|----------|----------|---------|
| Secret (`sk_*`) | `STRIPE_SECRET_KEY` | Server-only, NEVER client | Create sessions, intents, subscriptions |
| Publishable (`pk_*`) | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-safe | Initialize Stripe.js, confirm payments |
| Webhook (`whsec_*`) | `STRIPE_WEBHOOK_SECRET` | Server-only | Verify webhook event signatures |

### Pipeline Connection

- **Referenced by:** researcher agent during `/modulo:start-project` -- auto-detected when payments mentioned
- **Consumed at:** `/modulo:start-project` step 3 (discovery: "Stripe Checkout, Billing, or Connect?")
- **Builder enforcement:** webhook Route Handler + `STRIPE_WEBHOOK_SECRET` required before wave completion
- **Quality gate:** token exposure check (sk_* in client code = instant fail), webhook verification check

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Checkout Sessions (Redirect Flow)

Server-side Route Handler creates a Checkout Session; customer redirects to Stripe-hosted page.

```ts
// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId, quantity = 1 } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
    payment_method_types: ["card", "link"],
  });
  return NextResponse.json({ url: session.url });
}
```

```tsx
// components/CheckoutButton.tsx -- redirects to Stripe-hosted checkout
"use client";
import { useState } from "react";

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };
  return (
    <button onClick={handleCheckout} disabled={loading}
      className="bg-primary text-bg px-6 py-3 rounded-lg font-body hover:opacity-90 transition-opacity disabled:opacity-50">
      {loading ? "Redirecting..." : "Checkout"}
    </button>
  );
}
```

#### Pattern 2: Payment Intents (Custom DNA-Styled Form)

Embedded payment form using Stripe Elements with the Appearance API mapped to Design DNA tokens.

```ts
// app/api/payment-intent/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount, currency = "usd", metadata = {} } = await req.json();
  const paymentIntent = await stripe.paymentIntents.create({
    amount, currency, metadata,
    automatic_payment_methods: { enabled: true },
  }, { idempotencyKey: metadata.orderId ?? undefined });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
```

```tsx
// components/PaymentForm.tsx -- DNA-themed Elements form with Link
"use client";
import { useState, useEffect } from "react";
import { Elements, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// DNA-mapped Appearance object -- themed to project identity
const dnaAppearance = {
  theme: "flat" as const,
  variables: {
    colorPrimary: "var(--color-primary)", colorBackground: "var(--color-surface)",
    colorText: "var(--color-text)", colorDanger: "var(--color-tension)",
    fontFamily: "var(--font-body)", borderRadius: "8px",
  },
  rules: {
    ".Input": { border: "1px solid var(--color-border)", boxShadow: "none" },
    ".Input:focus": { border: "1px solid var(--color-primary)" },
    ".Label": { color: "var(--color-text)", fontWeight: "500" },
    ".Error": { color: "var(--color-tension)" },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setStatus("processing");
    const { error } = await stripe.confirmPayment({
      elements, confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    });
    if (error) { setStatus("error"); setErrorMsg(error.message ?? "Payment failed."); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <LinkAuthenticationElement />
      <PaymentElement options={{ layout: "accordion" }} />
      <button type="submit" disabled={!stripe || status === "processing"}
        className="w-full bg-primary text-bg py-3 rounded-lg font-body font-semibold disabled:opacity-50">
        {status === "processing" ? "Processing..." : "Pay now"}
      </button>
      {status === "error" && <p className="text-tension text-sm" role="alert">{errorMsg}</p>}
    </form>
  );
}

export function PaymentForm({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    fetch("/api/payment-intent", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then(r => r.json()).then(({ clientSecret }) => setClientSecret(clientSecret));
  }, [amount]);

  if (!clientSecret) return <div className="animate-pulse space-y-4 max-w-md"><div className="h-12 bg-surface rounded-lg" /><div className="h-12 bg-surface rounded-lg" /></div>;
  return <Elements stripe={stripePromise} options={{ clientSecret, appearance: dnaAppearance }}><CheckoutForm /></Elements>;
}
```

#### Pattern 3: Subscriptions (Billing + Customer Portal)

Checkout Session with `mode: 'subscription'`, DNA-styled pricing table, and Customer Portal for self-service.

```ts
// app/api/subscribe/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  });
  return NextResponse.json({ url: session.url });
}
```

```ts
// app/api/customer-portal/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { customerId } = await req.json();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  });
  return NextResponse.json({ url: session.url });
}
```

```tsx
// components/PricingTable.tsx -- DNA-styled plan cards
"use client";
import { useState } from "react";

interface Plan { name: string; priceId: string; price: string; interval: "month" | "year"; features: string[]; highlighted?: boolean; }

export function PricingTable({ plans }: { plans: Plan[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const subscribe = async (priceId: string) => {
    setLoading(priceId);
    const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priceId }) });
    window.location.href = (await res.json()).url;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.priceId} className={`rounded-2xl p-8 border transition-all ${plan.highlighted ? "border-primary bg-surface shadow-lg scale-105" : "border-border bg-bg hover:border-primary/50"}`}>
          <h3 className="text-xl font-display text-text">{plan.name}</h3>
          <p className="mt-2"><span className="text-4xl font-display">{plan.price}</span><span className="text-muted font-body">/{plan.interval}</span></p>
          <ul className="mt-6 space-y-3">{plan.features.map(f => <li key={f} className="flex items-center gap-2 text-text font-body"><span className="text-primary">&#10003;</span>{f}</li>)}</ul>
          <button onClick={() => subscribe(plan.priceId)} disabled={loading === plan.priceId}
            className={`mt-8 w-full py-3 rounded-lg font-body font-semibold disabled:opacity-50 ${plan.highlighted ? "bg-primary text-bg" : "bg-surface text-text border border-border hover:border-primary"}`}>
            {loading === plan.priceId ? "Redirecting..." : "Subscribe"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Pattern 4: Stripe Link (One-Click Checkout)

Stripe Link saves payment details for returning customers. Add `LinkAuthenticationElement` before `PaymentElement` in any Elements form (already included in Pattern 2).

```tsx
// Pre-fill email from authenticated user session
<LinkAuthenticationElement options={{ defaultValues: { email: user?.email ?? "" } }}
  onChange={(e) => setEmail(e.value.email)} />

// Activation checklist:
// 1. Enable Link in Stripe Dashboard > Settings > Payment methods
// 2. Include LinkAuthenticationElement before PaymentElement
// 3. Use PaymentElement (not CardElement) for full method support
// 4. Link auto-appears for eligible customers with saved details
```

#### Pattern 5: Webhooks (Event Handling)

Production-grade webhook handler with signature verification and structured event routing.

```ts
// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text(); // Raw body required for signature verification
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
      break;
    case "invoice.paid":
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;
    case "payment_intent.succeeded":
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
      break;
  }
  return NextResponse.json({ received: true }); // Always 200 to acknowledge
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) { /* fulfill order, send confirmation */ }
async function handleInvoicePaid(invoice: Stripe.Invoice) { /* extend subscription access */ }
async function handlePaymentSuccess(intent: Stripe.PaymentIntent) { /* confirm payment, trigger fulfillment */ }
async function handleSubscriptionUpdate(sub: Stripe.Subscription) { /* handle plan changes, past_due, canceled */ }
async function handleSubscriptionCancelled(sub: Stripe.Subscription) { /* revoke access, send win-back email */ }
```

#### Pattern 6: Connect (Marketplace Payments)

Multi-party payments for platforms. Connected accounts receive funds via destination charges.

```ts
// app/api/connect/onboard/route.ts -- Create connected account + onboarding link
import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { email } = await req.json();
  const account = await stripe.accounts.create({
    type: "express", email,
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
  });
  const accountLink = await stripe.accountLinks.create({
    account: account.id, type: "account_onboarding",
    refresh_url: `${process.env.NEXT_PUBLIC_URL}/connect/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_URL}/connect/complete`,
  });
  return NextResponse.json({ accountId: account.id, onboardingUrl: accountLink.url });
}
```

```ts
// app/api/connect/payment/route.ts -- Destination charge with platform fee
import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount, connectedAccountId, feePercent = 10 } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency: "usd", product_data: { name: "Marketplace Purchase" }, unit_amount: amount }, quantity: 1 }],
    payment_intent_data: {
      application_fee_amount: Math.round(amount * feePercent / 100),
      transfer_data: { destination: connectedAccountId },
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/order/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/order/cancel`,
  });
  return NextResponse.json({ url: session.url });
}
```

### Reference Sites

- **Stripe.com** (stripe.com) -- Gold standard for payment UI: clear pricing tables, progressive disclosure, trust-building micro-interactions on form fields
- **Vercel** (vercel.com/pricing) -- Clean subscription pricing grid with monthly/yearly toggle, highlighted plan, seamless Checkout redirect
- **Linear** (linear.app) -- Minimal pricing page with consistent styling and subscription flow maintaining brand identity

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Stripe Integration |
|-----------|---------------------------|
| `--color-primary` | Payment button backgrounds, active input borders, plan highlight accent |
| `--color-surface` | Element input backgrounds, pricing card backgrounds |
| `--color-text` | Element labels, pricing text, form field content |
| `--color-border` | Element input borders, pricing card outlines |
| `--color-tension` | Error messages, declined payment states, validation failures |
| `--color-muted` | Secondary text (intervals, disclaimers, helper text) |
| `--font-body` | All Element text via Appearance API fontFamily |
| `--font-display` | Pricing plan names, payment amount display |

### Archetype Variants

| Archetype | Stripe Styling Adaptation |
|-----------|--------------------------|
| Brutalist | Raw inputs, monospace amounts, high-contrast errors, no rounded corners |
| Ethereal | Glass-effect containers, subtle glow on focus, pastel validation |
| Luxury/Fashion | Thin borders, generous whitespace, serif plan names, gold accents |
| Playful/Startup | Rounded pill buttons, bouncy hover, gradient CTA |
| Neon Noir | Dark surface with neon glow borders, cyberpunk amount display |
| Japanese Minimal | Maximum whitespace, single accent, understated pricing |

### Pipeline Stage

- **Input from:** `/modulo:start-project` provides payment model choice, product catalog structure, target customer type
- **Output to:** Builder receives Stripe pattern selection, env var checklist, webhook event list. DESIGN-DNA.md Appearance mapping feeds into Elements theming.

### Related Skills

- **ecommerce-ui** -- Product listing, cart, order management UI feeding into Stripe checkout
- **dashboard-patterns** -- Subscription management dashboards consume billing data
- **accessibility** -- Payment forms require WCAG 2.1 AA: focus management, error announcements, keyboard navigation

## Layer 4: Anti-Patterns

### Anti-Pattern: Secret Key Exposure

**What goes wrong:** `sk_*` value in client-side code or `NEXT_PUBLIC_` env vars. Attackers create charges, refunds, or access customer data.
**Instead:** Secret key exclusively in Route Handlers / Server Actions. Verify: `grep -r "sk_" src/` returns zero client-side matches.
**Penalty:** -15

### Anti-Pattern: Missing Webhook Signature Verification

**What goes wrong:** Webhook endpoint accepts any POST without `constructEvent()`. Attackers forge events for unauthorized access.
**Instead:** Always verify with `STRIPE_WEBHOOK_SECRET`. Return 400 for invalid signatures.
**Penalty:** -10

### Anti-Pattern: No Idempotency Keys

**What goes wrong:** Payment creation retries on network failure create duplicate charges.
**Instead:** Pass `idempotencyKey` using order ID or client-generated UUID.
**Penalty:** -5

### Anti-Pattern: Hardcoded Prices

**What goes wrong:** Dollar amounts in code instead of Stripe Price objects. Prices drift between Dashboard and app.
**Instead:** Reference by `price_*` ID. Fetch prices server-side for display.
**Penalty:** -3

### Anti-Pattern: No Loading/Error States

**What goes wrong:** No feedback during processing; users click multiple times creating duplicates.
**Instead:** Disable button + spinner during processing. Map Stripe error codes to user-friendly messages.
**Penalty:** -3

### Anti-Pattern: Unverified Production Webhooks

**What goes wrong:** HTTP webhook endpoint in production. Stripe only delivers over HTTPS; unencrypted endpoints silently fail.
**Instead:** Deploy behind HTTPS. Test with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
**Penalty:** -5

### Anti-Pattern: Ignoring Subscription Lifecycle

**What goes wrong:** Only handling `checkout.session.completed`. Missing update/delete events leaves stale access.
**Instead:** Handle full lifecycle: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated` (past_due, canceled), `customer.subscription.deleted`.
**Penalty:** -3

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Secret key in client code | 0 | 0 | occurrences | HARD -- reject if any sk_* in client bundle |
| Webhook signature verification | 1 | - | call per handler | HARD -- reject if constructEvent not called |
| Idempotency key on payment create | 1 | - | per request | SOFT -- warn if missing |
| Loading state on payment button | 1 | - | state | SOFT -- warn if missing |
| Error handling on payment form | 1 | - | handler | SOFT -- warn if missing |
| HTTPS on webhook endpoint (prod) | 1 | - | boolean | HARD -- reject HTTP in production |
| Subscription lifecycle handlers | 3 | - | event types | SOFT -- warn if fewer than 3 handled |
