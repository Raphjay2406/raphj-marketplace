# Phase 17: API Integration Patterns - Research

**Researched:** 2026-02-25
**Domain:** Server-side API integration patterns, CRM form submissions, webhook handling, typed API clients, env management
**Confidence:** HIGH (most findings verified with official documentation)

## Summary

This research covers the complete domain of the `api-patterns` skill: server-side proxy patterns for Next.js 16 and Astro 5/6, CRM form integration (HubSpot, Salesforce), email sending (Resend, SendGrid), spam protection (Cloudflare Turnstile), webhook signature verification (Stripe, GitHub, generic HMAC), typed API client patterns with retry logic, environment variable management, and Context7 MCP integration for agent workflows.

The standard approach is server-side-only API calls with typed wrappers that progress from thin fetch wrappers to full typed clients with retry and rate limiting. All secrets remain unprefixed environment variables, accessed exclusively in server-side code (Next.js Server Actions / Route Handlers, Astro API endpoints). The skill must provide hardcoded baseline patterns for each integration (not relying solely on Context7), with Context7 serving as a freshness upgrade tool for agents.

Key finding: All targeted API providers have stable, well-documented endpoints. HubSpot Forms API uses the v3 submission endpoint, Salesforce Web-to-Lead is a simple POST with no JSON response, Resend has a modern TypeScript-first SDK (v6.9.x), and Stripe/GitHub both use HMAC-based signature verification with well-documented patterns. Cloudflare Turnstile's siteverify endpoint is a simple POST returning JSON with success/error fields.

**Primary recommendation:** Build the skill with hardcoded, version-pinned code examples for all integrations, organized as a progression from thin wrappers to typed clients. Context7 MCP integration is an agent-level enhancement, not a runtime dependency.

## Standard Stack

The api-patterns skill is a knowledge skill (SKILL.md), not an installable library. It documents patterns that USE these libraries/services.

### Core (Patterns Documented in Skill)

| Library/Service | Version | Purpose | Why Standard |
|---|---|---|---|
| `resend` | 6.9.x | Email sending (primary) | TypeScript-first, modern API, JSX email support, 2 req/s rate limit |
| `@sendgrid/mail` | 8.1.x | Email sending (alternative) | Industry standard, high volume, Twilio-backed |
| `stripe` | Latest | Webhook signature verification | `stripe.webhooks.constructEvent` is the canonical pattern |
| `@marsidev/react-turnstile` | Latest | Client-side Turnstile widget | Officially recommended by Cloudflare for React |
| `zod` | 4.x | Request/response validation | Already in Genorah stack via form-builder skill |

### Supporting (Used in Patterns)

| Library/Service | Purpose | When to Use |
|---|---|---|
| `@octokit/webhooks` | GitHub webhook verification | When receiving GitHub webhooks (has `verify()` method) |
| `jose` or `jsonwebtoken` | JWT for Salesforce OAuth | When using Salesforce REST API (JWT bearer flow) |
| `exponential-backoff` | Retry utility | When using the library-based approach (vs. hand-rolled) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Resend | SendGrid | SendGrid has poor TypeScript typing, older API feel, but higher volume limits |
| `@marsidev/react-turnstile` | `react-turnstile` | `react-turnstile` is simpler but less maintained; Cloudflare recommends @marsidev |
| `exponential-backoff` lib | Hand-rolled retry | Hand-rolled is simpler for the 3-retry pattern needed; lib adds a dependency |
| `@octokit/webhooks` | Manual crypto.timingSafeEqual | Manual approach is dependency-free but more error-prone |

### No Installation Required

This skill produces SKILL.md patterns. The patterns themselves reference these libraries, which are installed in target projects only when used. The skill itself has zero dependencies.

## Architecture Patterns

### Recommended Skill Structure

The api-patterns skill should follow the 4-layer SKILL.md format:

```
skills/
  api-patterns/
    SKILL.md          # 4-layer format, Domain tier
```

### Pattern 1: Server-Side Proxy (Core Pattern)

**What:** All external API calls go through server-side code. No API keys in client bundles.
**When to use:** Every external API integration.

**Next.js 16 Server Action pattern:**
```typescript
// app/actions/contact.ts
'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function submitContact(prevState: any, formData: FormData) {
  const validated = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  // Server-side only: env vars without NEXT_PUBLIC_ prefix
  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validated.data),
  })

  if (!response.ok) {
    return { error: 'Submission failed. Please try again.' }
  }

  return { success: true }
}
```
**Source:** Next.js 16.1.6 official docs (forms guide, fetched 2026-02-25)

**Next.js 16 Route Handler pattern:**
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()  // Raw body for signature verification
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      // Process completed checkout
      break
  }

  return Response.json({ received: true })
}
```
**Source:** Stripe official docs + Next.js Route Handlers docs (fetched 2026-02-25)

**Astro API endpoint pattern:**
```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro'

export const prerender = false  // Required for SSR endpoints

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()

  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.API_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
```
**Source:** Astro official endpoint docs (fetched 2026-02-25)

### Pattern 2: Three-State Form UI with useActionState

**What:** Form with loading, success, and error states using React 19's `useActionState`.
**When to use:** Every form that submits to a server action.

```typescript
// Client component
'use client'
import { useActionState } from 'react'
import { submitContact } from '@/app/actions/contact'

const initialState = { success: false, error: null, errors: null }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.success) {
    return <div role="status">Thank you! We will be in touch.</div>
  }

  return (
    <form action={formAction}>
      <input name="name" required disabled={pending} />
      {state.errors?.name && <p role="alert">{state.errors.name[0]}</p>}

      <input name="email" type="email" required disabled={pending} />
      {state.errors?.email && <p role="alert">{state.errors.email[0]}</p>}

      <textarea name="message" required disabled={pending} />
      {state.errors?.message && <p role="alert">{state.errors.message[0]}</p>}

      {state.error && <p role="alert">{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```
**Source:** Next.js 16.1.6 forms guide (fetched 2026-02-25), React 19 useActionState docs

### Pattern 3: Typed API Client Progression

**What:** Evolution from thin wrapper to production-ready typed client.
**When to use:** Teach the progression; use typed client for production.

**Step 1: Thin Fetch Wrapper**
```typescript
// lib/api/hubspot.ts
export async function submitToHubSpot(portalId: string, formGuid: string, fields: Record<string, string>) {
  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: Object.entries(fields).map(([name, value]) => ({
          objectTypeId: '0-1',  // Contact object type
          name,
          value,
        })),
      }),
    }
  )
  if (!response.ok) throw new Error('HubSpot submission failed')
  return response.json()
}
```

**Step 2: Typed Client with Retry and Rate Limiting**
```typescript
// lib/api/client.ts
type ApiClientConfig = {
  baseUrl: string
  headers?: Record<string, string>
  timeout?: number      // ms, default 10000
  retries?: number      // default 3
  retryDelayMs?: number // base delay, default 1000
}

type ApiResult<T> = { data: T; error: null } | { data: null; error: ApiError }

type ApiError = {
  code: 'NETWORK' | 'TIMEOUT' | 'RATE_LIMITED' | 'VALIDATION' | 'SERVER' | 'UNKNOWN'
  message: string
  status?: number
  retryable: boolean
}

async function fetchWithRetry<T>(
  url: string,
  init: RequestInit,
  config: Required<ApiClientConfig>
): Promise<ApiResult<T>> {
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    if (attempt > 0) {
      const delay = config.retryDelayMs * Math.pow(2, attempt - 1)
      const jitter = delay * 0.1 * Math.random()
      await new Promise(r => setTimeout(r, delay + jitter))
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      const response = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after')
        if (retryAfter) {
          await new Promise(r => setTimeout(r, parseInt(retryAfter) * 1000))
        }
        lastError = { code: 'RATE_LIMITED', message: 'Rate limited', status: 429, retryable: true }
        continue
      }

      if (!response.ok) {
        const isRetryable = response.status >= 500
        lastError = {
          code: response.status >= 500 ? 'SERVER' : 'VALIDATION',
          message: `HTTP ${response.status}`,
          status: response.status,
          retryable: isRetryable,
        }
        if (!isRetryable) break // Don't retry 4xx
        continue
      }

      const data = await response.json() as T
      return { data, error: null }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        lastError = { code: 'TIMEOUT', message: 'Request timed out', retryable: true }
      } else {
        lastError = { code: 'NETWORK', message: 'Network error', retryable: true }
      }
    }
  }

  return { data: null, error: lastError! }
}
```

### Anti-Patterns to Avoid

- **Client-side API keys:** NEVER put secret keys in `NEXT_PUBLIC_*`, `PUBLIC_*`, or `VITE_*` env vars. All secrets are unprefixed and server-only.
- **JSON-parsing webhook bodies before verification:** Stripe and GitHub signature verification require the raw body string. Always use `request.text()` before any JSON parsing.
- **String comparison for signatures:** NEVER use `===` to compare HMAC signatures. Use `crypto.timingSafeEqual()` to prevent timing attacks.
- **Unbounded retries:** Always cap retry attempts (3 max) with exponential backoff. Never retry 4xx errors (except 429).
- **Ignoring rate limit headers:** Read `retry-after`, `ratelimit-remaining`, and `ratelimit-reset` headers to throttle proactively.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| HMAC signature verification | Manual hex comparison | `crypto.timingSafeEqual` / `@octokit/webhooks` | Timing attack vulnerability, encoding edge cases |
| Email sending | Raw SMTP/fetch to provider | `resend` SDK / `@sendgrid/mail` | Retry logic, batch sending, template support, deliverability headers |
| Stripe event parsing | Manual JSON parse + type cast | `stripe.webhooks.constructEvent` | Handles signature verification, timestamp tolerance, event typing |
| CAPTCHA validation | Custom challenge system | Cloudflare Turnstile | Privacy-compliant, invisible mode, no user friction, free tier |
| JWT for Salesforce | Manual JWT construction | `jose` library | Token expiry, signature algorithms, key format handling |
| Form validation | Manual field checking | `zod` schemas | Type inference, nested validation, custom error messages, already in Genorah stack |

**Key insight:** Each API provider has specific quirks (HubSpot's objectTypeId requirement, Salesforce's redirect-based response, Stripe's raw body requirement) that are easy to get wrong. The skill must document these quirks with verified code, not leave them for builders to discover.

## Common Pitfalls

### Pitfall 1: Client-Side Secret Exposure

**What goes wrong:** Developer puts API keys in `NEXT_PUBLIC_*` or `PUBLIC_*` env vars, exposing them in client-side JavaScript bundles.
**Why it happens:** Developer wants to call API from a client component and does not realize env prefix rules.
**How to avoid:** Genorah convention: ALL secrets use unprefixed env var names. Skill includes a validation rule: if any env var with `NEXT_PUBLIC_`, `PUBLIC_`, or `VITE_` prefix contains "KEY", "SECRET", "TOKEN", or "PASSWORD", it is a critical error.
**Warning signs:** `fetch()` calls in files without `'use server'` directive, env vars with public prefix containing sensitive words.

### Pitfall 2: Parsing Webhook Body Before Signature Verification

**What goes wrong:** Framework auto-parses JSON body, then signature verification fails because the raw string no longer matches.
**Why it happens:** Next.js Route Handlers use `request.json()` by default. Express uses `express.json()` middleware.
**How to avoid:** Always use `request.text()` in Route Handlers. For Express, use `express.raw({ type: 'application/json' })` on webhook routes.
**Warning signs:** "Webhook signature verification failed" errors in production. Works in local testing but fails with real payloads.

### Pitfall 3: HubSpot objectTypeId Missing

**What goes wrong:** HubSpot form submissions fail with validation errors because `objectTypeId` is not included in field objects.
**Why it happens:** The v3 API requires `objectTypeId` for each field (typically `"0-1"` for Contact properties), but many tutorials and older examples omit it.
**How to avoid:** Always include `objectTypeId: "0-1"` for contact properties in the fields array. The skill pattern hardcodes this.
**Warning signs:** 400 errors from HubSpot with validation messages about missing objectTypeId.

### Pitfall 4: Salesforce Web-to-Lead Response Handling

**What goes wrong:** Developer expects a JSON response from Salesforce Web-to-Lead and tries to parse it, getting an error.
**Why it happens:** Salesforce Web-to-Lead is redirect-based (returns HTML or redirects), not a JSON API.
**How to avoid:** When using server-side proxy for Web-to-Lead, set `redirect: 'manual'` in fetch options and check for 302 status. Do NOT try to parse the response as JSON. Confirm success by checking for a 200 or 302 response status.
**Warning signs:** JSON parse errors after Salesforce submission, unexpected HTML in response.

### Pitfall 5: Turnstile Token Single-Use Violation

**What goes wrong:** Client sends Turnstile token, server validates it, but a retry or double-submission sends the same token again and fails.
**Why it happens:** Turnstile tokens are single-use (consumed on first validation) and expire after 5 minutes.
**How to avoid:** After successful validation, do NOT re-validate the same token. If the form needs to be resubmitted, reset the Turnstile widget to generate a new token. Use the `@marsidev/react-turnstile` ref methods to call `.reset()`.
**Warning signs:** `timeout-or-duplicate` error code from Turnstile siteverify endpoint.

### Pitfall 6: Context7 Over-Reliance Without Fallback

**What goes wrong:** Skill relies exclusively on Context7 for API documentation, but Context7 may not have the library, may have outdated versions, or the MCP server may be unavailable.
**Why it happens:** Treating Context7 as guaranteed rather than as a tool.
**How to avoid:** Skill includes hardcoded baseline patterns (version-pinned). Context7 is a freshness upgrade, not the primary source. Fallback chain: (1) Try Context7, (2) Use skill baseline, (3) Use official docs URL.
**Warning signs:** Skill has no hardcoded examples and says "use Context7 to look up the API."

## Code Examples

### HubSpot Forms API v3 Submission (Server-Side)

```typescript
// lib/crm/hubspot.ts
// Source: HubSpot Forms API v3 docs (https://developers.hubspot.com/docs/api-reference/legacy/forms-v3-legacy)

type HubSpotField = {
  objectTypeId: string  // "0-1" for Contact
  name: string
  value: string
}

type HubSpotSubmission = {
  fields: HubSpotField[]
  context?: {
    pageUri?: string
    pageName?: string
    ipAddress?: string
  }
}

type HubSpotResponse = {
  redirectUri?: string
  inlineMessage?: string
}

export async function submitHubSpotForm(
  portalId: string,
  formGuid: string,
  fields: Record<string, string>,
  context?: { pageUri?: string; pageName?: string; ipAddress?: string }
): Promise<HubSpotResponse> {
  const submission: HubSpotSubmission = {
    fields: Object.entries(fields).map(([name, value]) => ({
      objectTypeId: '0-1',  // Contact properties
      name,
      value,
    })),
    ...(context && { context }),
  }

  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    }
  )

  if (response.status === 429) {
    throw new Error('HubSpot rate limit exceeded. Max 50 requests per 10 seconds.')
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`HubSpot submission failed: ${JSON.stringify(error)}`)
  }

  return response.json()
}
```

**HubSpot Rate Limits:**
- Unauthenticated endpoint: 50 requests per 10 seconds
- Authenticated endpoint (with API key): 200 requests per 10 seconds
- 10 consecutive 429 responses in 1 second triggers a 1-minute block

### Salesforce Web-to-Lead (Server-Side Proxy)

```typescript
// lib/crm/salesforce-web-to-lead.ts
// Source: Salesforce Web-to-Lead docs

type WebToLeadFields = {
  first_name: string
  last_name: string
  email: string
  company?: string
  phone?: string
  [key: string]: string | undefined  // Custom fields
}

export async function submitWebToLead(
  oid: string,  // 15-char Salesforce Organization ID
  fields: WebToLeadFields
): Promise<{ success: boolean }> {
  const formData = new URLSearchParams()
  formData.append('oid', oid)
  formData.append('retURL', 'https://example.com/thank-you')  // Required but ignored server-side

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      formData.append(key, value)
    }
  }

  // IMPORTANT: Web-to-Lead is redirect-based, NOT JSON API
  const response = await fetch(
    'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'manual',  // Prevent following the redirect
    }
  )

  // 200 or 302 = success (Salesforce does not return JSON)
  return { success: response.status === 200 || response.status === 302 }
}
```

**Salesforce Web-to-Lead Limits:**
- 500 leads per 24-hour period (queued after limit)
- OID is 15-character Salesforce Organization ID
- No JSON response -- redirect-based confirmation only

### Salesforce REST API with JWT Bearer OAuth

```typescript
// lib/crm/salesforce-rest.ts
// Source: Salesforce REST API v66.0 Spring '26 docs

import * as jose from 'jose'

type SalesforceAuth = {
  access_token: string
  instance_url: string
  token_type: string
}

export async function getSalesforceAccessToken(): Promise<SalesforceAuth> {
  const privateKey = await jose.importPKCS8(process.env.SF_PRIVATE_KEY!, 'RS256')

  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(process.env.SF_CONSUMER_KEY!)     // Connected App consumer key
    .setSubject(process.env.SF_USERNAME!)          // Salesforce username
    .setAudience('https://login.salesforce.com')   // Or test.salesforce.com for sandbox
    .setExpirationTime('5m')
    .sign(privateKey)

  const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  })

  if (!response.ok) {
    throw new Error(`Salesforce auth failed: ${response.status}`)
  }

  return response.json()
}

// Example: Create a lead via REST API
export async function createSalesforceLead(
  auth: SalesforceAuth,
  lead: { FirstName: string; LastName: string; Email: string; Company: string }
) {
  const response = await fetch(
    `${auth.instance_url}/services/data/v66.0/sobjects/Lead/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Lead creation failed: ${JSON.stringify(error)}`)
  }

  return response.json()
}
```

### Resend Email Sending

```typescript
// lib/email/resend.ts
// Source: Resend official docs (resend.com/docs, fetched 2026-02-25)

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type EmailParams = {
  to: string | string[]
  subject: string
  html?: string
  react?: React.ReactElement  // JSX email template support
  from?: string
}

export async function sendEmail(params: EmailParams) {
  const { data, error } = await resend.emails.send({
    from: params.from ?? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: Array.isArray(params.to) ? params.to : [params.to],
    subject: params.subject,
    ...(params.html ? { html: params.html } : {}),
    ...(params.react ? { react: params.react } : {}),
  })

  if (error) {
    throw new Error(`Email send failed: ${error.message}`)
  }

  return data
}
```

**Resend Rate Limits:**
- 2 requests per second per team (across all API keys)
- Response headers: `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, `retry-after`
- 429 status on limit exceeded

**Resend Env Vars:**
- `RESEND_API_KEY` -- API key (server-only, no prefix)

### SendGrid Email Sending

```typescript
// lib/email/sendgrid.ts
// Source: SendGrid v3 API docs, @sendgrid/mail 8.1.x

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

type EmailParams = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail(params: EmailParams) {
  const msg = {
    to: params.to,
    from: params.from ?? process.env.EMAIL_FROM_ADDRESS!,
    subject: params.subject,
    html: params.html,
    ...(params.text ? { text: params.text } : {}),
  }

  try {
    const [response] = await sgMail.send(msg)
    return { statusCode: response.statusCode }
  } catch (error: any) {
    throw new Error(`SendGrid send failed: ${error.message}`)
  }
}
```

**SendGrid Env Vars:**
- `SENDGRID_API_KEY` -- API key (server-only, no prefix)

### Stripe Webhook Signature Verification

```typescript
// app/api/webhooks/stripe/route.ts (Next.js 16)
// Source: Stripe official docs (docs.stripe.com/webhooks, fetched 2026-02-25)

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()  // MUST use text(), not json()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!  // Starts with whsec_
    )
  } catch (err: any) {
    console.error('Stripe webhook verification failed:', err.message)
    return new Response('Signature verification failed', { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      // Handle completed checkout
      break
    case 'invoice.paid':
      // Handle paid invoice
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return Response.json({ received: true })
}
```

**Stripe Webhook Env Vars:**
- `STRIPE_SECRET_KEY` -- API secret (server-only)
- `STRIPE_WEBHOOK_SECRET` -- Starts with `whsec_`, unique per endpoint

### GitHub Webhook Signature Verification

```typescript
// app/api/webhooks/github/route.ts (Next.js 16)
// Source: GitHub official docs (docs.github.com/en/webhooks, fetched 2026-02-25)

import { timingSafeEqual, createHmac } from 'crypto'

function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = 'sha256=' + createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // MUST use timingSafeEqual to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  } catch {
    return false  // Buffers of different lengths
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  if (!signature) {
    return new Response('Missing signature', { status: 401 })
  }

  if (!verifyGitHubSignature(body, signature, process.env.GITHUB_WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = request.headers.get('x-github-event')
  const payload = JSON.parse(body)  // Safe to parse AFTER verification

  switch (event) {
    case 'push':
      // Handle push event
      break
    case 'pull_request':
      // Handle PR event
      break
  }

  return Response.json({ received: true })
}
```

**GitHub Webhook Details:**
- Header: `X-Hub-Signature-256` (HMAC-SHA256)
- Signature format: `sha256=<hex_digest>`
- MUST use `crypto.timingSafeEqual` for comparison

### Generic HMAC-SHA256 Webhook Verification

```typescript
// lib/webhooks/verify.ts
// Generic pattern for any provider using HMAC-SHA256

import { timingSafeEqual, createHmac } from 'crypto'

type WebhookVerifyConfig = {
  headerName: string           // e.g., 'x-webhook-signature'
  signaturePrefix?: string     // e.g., 'sha256=' for GitHub
  algorithm?: string           // default 'sha256'
  encoding?: 'hex' | 'base64'  // default 'hex'
}

export function createWebhookVerifier(secret: string, config: WebhookVerifyConfig) {
  return function verify(payload: string, signatureHeader: string): boolean {
    const algorithm = config.algorithm ?? 'sha256'
    const encoding = config.encoding ?? 'hex'
    const prefix = config.signaturePrefix ?? ''

    const expected = prefix + createHmac(algorithm, secret)
      .update(payload)
      .digest(encoding)

    try {
      return timingSafeEqual(
        Buffer.from(signatureHeader),
        Buffer.from(expected)
      )
    } catch {
      return false
    }
  }
}

// Usage:
// const verifyStripe = createWebhookVerifier(secret, { headerName: 'stripe-signature', ... })
// const verifyGitHub = createWebhookVerifier(secret, { headerName: 'x-hub-signature-256', signaturePrefix: 'sha256=' })
```

### Cloudflare Turnstile Validation

```typescript
// lib/security/turnstile.ts
// Source: Cloudflare official docs (developers.cloudflare.com/turnstile, fetched 2026-02-25)

type TurnstileResponse = {
  success: boolean
  'error-codes': string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

export async function validateTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ valid: boolean; errors: string[] }> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(remoteIp && { remoteip: remoteIp }),
      }),
    }
  )

  const result: TurnstileResponse = await response.json()

  return {
    valid: result.success,
    errors: result['error-codes'] ?? [],
  }
}
```

**Turnstile Details:**
- Endpoint: `https://challenges.cloudflare.com/turnstile/v0/siteverify`
- Tokens expire after 300 seconds (5 minutes)
- Tokens are single-use (cannot be validated twice)
- Max token length: 2048 characters
- Error codes: `missing-input-secret`, `invalid-input-secret`, `missing-input-response`, `invalid-input-response`, `timeout-or-duplicate`, `internal-error`
- Client widget: `@marsidev/react-turnstile` (Cloudflare-recommended)

**Turnstile Client Component:**
```tsx
'use client'
import { Turnstile } from '@marsidev/react-turnstile'
import { useRef } from 'react'

export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef(null)

  return (
    <Turnstile
      ref={ref}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onVerify}
      onExpire={() => ref.current?.reset()}
    />
  )
}
```

**Turnstile Env Vars:**
- `TURNSTILE_SECRET_KEY` -- Server-only secret (no prefix)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` -- Client-side site key (public prefix is correct here, this is NOT a secret)

### Exponential Backoff Retry Utility

```typescript
// lib/api/retry.ts
// Hand-rolled retry matching the CONTEXT decisions: 3 retries, 1s/2s/4s base delay

type RetryConfig = {
  maxRetries?: number      // default: 3
  baseDelayMs?: number     // default: 1000
  jitter?: boolean         // default: true
  retryOn?: (status: number) => boolean  // default: retry on 429 and 5xx
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  jitter: true,
  retryOn: (status) => status === 429 || status >= 500,
}

export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  config?: RetryConfig
): Promise<Response> {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  let lastResponse: Response | null = null

  for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = cfg.baseDelayMs * Math.pow(2, attempt - 1) // 1s, 2s, 4s
      const jitterMs = cfg.jitter ? delay * 0.1 * Math.random() : 0
      await new Promise(r => setTimeout(r, delay + jitterMs))
    }

    const response = await fetch(url, init)
    lastResponse = response

    if (response.ok || !cfg.retryOn(response.status)) {
      return response
    }

    // Respect retry-after header
    const retryAfter = response.headers.get('retry-after')
    if (retryAfter && attempt < cfg.maxRetries) {
      await new Promise(r => setTimeout(r, parseInt(retryAfter) * 1000))
    }
  }

  return lastResponse!
}
```

### Environment Variable Management

```typescript
// env.ts -- Auto-generated .env.example pattern

/**
 * Environment variable convention for Genorah projects:
 *
 * SECRETS: Always unprefixed (server-only)
 *   RESEND_API_KEY=re_xxxx
 *   SENDGRID_API_KEY=SG.xxxx
 *   STRIPE_SECRET_KEY=sk_xxxx
 *   STRIPE_WEBHOOK_SECRET=whsec_xxxx
 *   GITHUB_WEBHOOK_SECRET=xxxx
 *   TURNSTILE_SECRET_KEY=0x4xxxx
 *   HUBSPOT_PORTAL_ID=12345678
 *   HUBSPOT_FORM_GUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *   SF_OID=00Dxxxxxxxxxxxxxxx
 *   SF_CONSUMER_KEY=xxxx
 *   SF_USERNAME=user@example.com
 *   SF_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
 *
 * PUBLIC (client-safe):
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4xxxx   (Next.js)
 *   PUBLIC_TURNSTILE_SITE_KEY=0x4xxxx         (Astro)
 *   VITE_TURNSTILE_SITE_KEY=0x4xxxx           (Vite)
 *
 * Framework prefix rules:
 *   Next.js: NEXT_PUBLIC_ prefix exposes to client bundle
 *   Astro:   PUBLIC_ prefix exposes to client
 *   Vite:    VITE_ prefix exposes to client
 *
 * RULE: If the value is a key, secret, or token -- NEVER use a public prefix.
 *       Only site keys (like Turnstile site key) should be publicly prefixed.
 */

// Type-safe env access helper
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| `useFormState` (React) | `useActionState` (React 19) | React 19 / Next.js 15 | New signature: `[state, action, pending]` -- pending is built-in |
| `useFormStatus` primary | `useActionState` primary | React 19 | `useFormStatus` still works but `useActionState` is preferred for complete state |
| HubSpot Forms API v2 | HubSpot Forms API v3 | 2024 | v3 requires `objectTypeId` per field, has higher rate limits for authenticated |
| `middleware.ts` (Next.js) | `proxy.ts` (Next.js 16) | Next.js 16 | Renamed and restructured -- see nextjs-patterns skill |
| Salesforce API v61.0 | Salesforce API v66.0 | Spring '26 | Current version for REST API calls |
| `express.json()` for webhooks | `request.text()` raw body | App Router adoption | Framework no longer auto-parses; use Web API Request |
| reCAPTCHA v3 | Cloudflare Turnstile | 2023+ | Privacy-first, no user data collection, better UX |
| `@sendgrid/mail` as default | Resend as modern alternative | 2024+ | Better TypeScript support, JSX email templates, simpler API |

**Deprecated/outdated:**
- HubSpot Forms API v2 submission endpoint: Still functional but v3 is recommended
- `useFormState` from `react-dom`: Renamed to `useActionState` from `react` in React 19
- reCAPTCHA v2/v3: Still works but Turnstile is the recommended privacy-friendly alternative

## Context7 MCP Integration Patterns

### How Context7 Works (Agent-Level, Not Runtime)

Context7 is an MCP server that provides two tools:

1. **`mcp__context7__resolve-library-id`** -- Takes a library name string, returns a Context7 library ID
2. **`mcp__context7__query-docs`** -- Takes a library ID and a query string, returns current documentation

### Where Context7 Integrates in Genorah Pipeline

Based on existing architecture research (`.planning/research/ARCHITECTURE.md`):

| Agent | Context7 Access | Trigger |
|---|---|---|
| **design-researcher** | YES -- primary tool for library research | Track 3 (Component Library), any library-specific research |
| **section-builder** | NO -- too much latency for fast builds | Relies on pre-researched patterns in skills |
| **specialist agents** | YES -- for complex/niche library APIs | When using libraries where training data is likely stale |
| **quality-reviewer** | YES -- for verifying current API patterns | When auditing generated code for API currency |

### Explicit Triggers for Context7 Lookup

The skill should document when agents should invoke Context7:

1. **Version-specific API question:** "What is the current syntax for X in library Y?"
2. **Unfamiliar SDK encountered:** Project uses a library not covered by Genorah skills
3. **Deprecated pattern detected:** Agent recognizes a pattern that may be outdated
4. **Rate limit or constraint question:** "What are the current limits for API X?"

### Curated Library List for Context7

Libraries the api-patterns skill recommends checking via Context7:

| Library Name | Context7 Query Topics |
|---|---|
| `resend` | Email sending, batch, SDK methods |
| `stripe` | Webhook construction, event types, SDK methods |
| `@sendgrid/mail` | Send method, template support |
| `next` | Server Actions, Route Handlers, env vars |
| `astro` | API endpoints, SSR, env vars |
| `@hubspot/api-client` | Forms API, contacts API |
| `zod` | Schema validation, error formatting |

### Fallback Chain (When Context7 Unavailable)

```
1. Try Context7 MCP tools
   -> Available? Use current docs. Confidence: HIGH
   -> Unavailable? Continue to step 2.

2. Use hardcoded patterns in api-patterns SKILL.md
   -> Baseline examples are version-pinned and verified
   -> Confidence: MEDIUM (may be slightly outdated)

3. Use official documentation URLs
   -> HubSpot: developers.hubspot.com
   -> Stripe: docs.stripe.com
   -> Resend: resend.com/docs
   -> Cloudflare: developers.cloudflare.com/turnstile
   -> Salesforce: developer.salesforce.com
   -> Confidence: MEDIUM (requires WebFetch)

4. Flag to user
   -> "Could not verify current API patterns. Please provide documentation URL."
   -> Confidence: LOW
```

## Environment Variable Reference Table

| Service | Env Var Name | Prefix | Server/Client | Example Value |
|---|---|---|---|---|
| Resend | `RESEND_API_KEY` | None | Server | `re_xxxx` |
| SendGrid | `SENDGRID_API_KEY` | None | Server | `SG.xxxx` |
| Stripe | `STRIPE_SECRET_KEY` | None | Server | `sk_live_xxxx` |
| Stripe Webhook | `STRIPE_WEBHOOK_SECRET` | None | Server | `whsec_xxxx` |
| GitHub Webhook | `GITHUB_WEBHOOK_SECRET` | None | Server | Random string |
| HubSpot | `HUBSPOT_PORTAL_ID` | None | Server | `12345678` |
| HubSpot | `HUBSPOT_FORM_GUID` | None | Server | UUID format |
| Salesforce | `SF_OID` | None | Server | 15-char org ID |
| Salesforce | `SF_CONSUMER_KEY` | None | Server | Connected App key |
| Salesforce | `SF_USERNAME` | None | Server | `user@org.com` |
| Salesforce | `SF_PRIVATE_KEY` | None | Server | PEM-format key |
| Turnstile | `TURNSTILE_SECRET_KEY` | None | Server | `0x4xxxx` |
| Turnstile | Site key | `NEXT_PUBLIC_` / `PUBLIC_` / `VITE_` | Client | `0x4xxxx` |
| Email From | `EMAIL_FROM_NAME` | None | Server | `Acme Inc` |
| Email From | `EMAIL_FROM_ADDRESS` | None | Server | `hello@acme.com` |

## Timeout Defaults (From CONTEXT Decisions)

| Category | Timeout | Retries | Rationale |
|---|---|---|---|
| Form submissions | 5,000ms | 3 (1s/2s/4s) | User is waiting; fast fail preferred |
| CRM API calls | 10,000ms | 3 (1s/2s/4s) | CRM APIs can be slow; reasonable patience |
| File uploads | 30,000ms | 1 (no retry) | Large payloads; retry is wasteful |
| Webhook receiving | No timeout | 0 (no retry) | Providers retry on their own; respond quickly |

## Open Questions

Things that could not be fully resolved:

1. **HubSpot Forms API v3 vs Legacy v3**
   - What we know: The "new" Forms API v3 (developer preview) focuses on form CRUD operations. The submission endpoint (`api.hsforms.com/submissions/v3/integration/submit/...`) is documented as "legacy" but is the current standard for form submissions.
   - What's unclear: Whether the new v3 will eventually include a replacement submission endpoint.
   - Recommendation: Use the current `submissions/v3/integration/submit` endpoint. It is stable and widely used. Monitor HubSpot changelog for migration notices.

2. **Salesforce REST API Version Pinning**
   - What we know: Current version is v66.0 (Spring '26). Salesforce releases 3 versions per year.
   - What's unclear: Whether to hardcode v66.0 or use a version-detection pattern.
   - Recommendation: Hardcode the current version in skill examples. Add a comment noting to check via Context7 for the latest version. Salesforce maintains backward compatibility within major versions.

3. **Resend SDK Major Version**
   - What we know: Current version is 6.9.x. This is a fast-moving library.
   - What's unclear: Whether the API surface has changed significantly between major versions.
   - Recommendation: Document the `resend.emails.send()` pattern which has been stable across versions. Use Context7 for version-specific checks.

4. **@marsidev/react-turnstile Version**
   - What we know: It is Cloudflare-recommended. Installation is `npm i @marsidev/react-turnstile`.
   - What's unclear: Exact current version number (npm returned 403 when checked).
   - Recommendation: Use `@marsidev/react-turnstile` without version pinning in skill examples. The API surface (`<Turnstile siteKey=... />`) is stable.

## Sources

### Primary (HIGH confidence)

- Next.js 16.1.6 Forms Guide -- `https://nextjs.org/docs/app/guides/forms` (fetched 2026-02-25, version confirmed in response headers)
- Next.js 16.1.6 Route Handlers -- `https://nextjs.org/docs/app/getting-started/route-handlers` (fetched 2026-02-25)
- Cloudflare Turnstile Server Validation -- `https://developers.cloudflare.com/turnstile/get-started/server-side-validation/` (fetched 2026-02-25)
- Stripe Webhook Signature Docs -- `https://docs.stripe.com/webhooks/signature` (fetched 2026-02-25)
- Stripe Webhook Quickstart (Node.js) -- `https://docs.stripe.com/webhooks/quickstart?lang=node` (fetched 2026-02-25)
- GitHub Webhook Validation -- `https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries` (fetched 2026-02-25)
- Resend Send with Next.js -- `https://resend.com/docs/send-with-nextjs` (fetched 2026-02-25)
- Resend Rate Limits -- `https://resend.com/docs/api-reference/rate-limit` (fetched 2026-02-25)
- HubSpot Forms API v3 Submission -- `https://developers.hubspot.com/docs/api-reference/legacy/forms-v3-legacy` (fetched 2026-02-25)
- Astro Endpoints Docs -- `https://docs.astro.build/en/guides/endpoints/` (fetched 2026-02-25)
- Genorah Architecture Research -- `.planning/research/ARCHITECTURE.md` (local, Question 5: Context7 MCP)

### Secondary (MEDIUM confidence)

- HubSpot Rate Limits -- `https://developers.hubspot.com/changelog/announcing-forms-submission-rate-limits` (WebSearch verified with official changelog)
- Salesforce Web-to-Lead -- Multiple sources agree: 500 leads/24h, `https://webto.salesforce.com/servlet/servlet.WebToLead` endpoint
- Salesforce REST API v66.0 Spring '26 -- `https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/api_rest.pdf` (official PDF)
- SendGrid @sendgrid/mail 8.1.x -- `https://www.npmjs.com/package/@sendgrid/mail` (npm registry)
- Resend 6.9.x -- `https://www.npmjs.com/package/resend` (npm registry, WebSearch)
- @marsidev/react-turnstile -- `https://github.com/marsidev/react-turnstile` (Cloudflare-recommended per official Turnstile docs)

### Tertiary (LOW confidence)

- Salesforce JWT Bearer Flow details -- Training data + multiple blog sources (official Salesforce help page returned JavaScript-only content, no API docs extractable)
- SendGrid TypeScript quality assessment -- Single source comparison article from 2025 (nuntly.com)
- exponential-backoff npm package -- `https://www.npmjs.com/package/exponential-backoff` (WebSearch only, but hand-rolled approach is preferred per CONTEXT decisions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All libraries verified via official docs or npm registry
- Architecture (Next.js patterns): HIGH -- Verified against Next.js 16.1.6 official docs (dated 2026-02-20)
- Architecture (Astro patterns): HIGH -- Verified against Astro official endpoint docs
- CRM integrations: MEDIUM-HIGH -- HubSpot verified via official API reference; Salesforce Web-to-Lead verified via multiple sources; Salesforce REST/JWT is MEDIUM (official docs page was not extractable)
- Webhook verification: HIGH -- Stripe and GitHub patterns verified with official docs
- Email providers: HIGH -- Resend verified via official docs; SendGrid via npm and official quickstart
- Turnstile: HIGH -- Verified via official Cloudflare docs with full response format
- Context7 MCP: HIGH -- Based on existing architecture research in this repository
- Pitfalls: HIGH -- Based on official documentation notes and verified edge cases

**Research date:** 2026-02-25
**Valid until:** 2026-04-25 (60 days -- APIs are stable; check HubSpot and Salesforce changelogs for updates)
