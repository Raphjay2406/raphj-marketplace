---
name: "api-patterns"
description: "Server-side API integration patterns: CRM forms, webhooks, typed clients, email sending, env management, Context7 MCP -- for Next.js 16, Astro 5, and React/Vite"
tier: "domain"
triggers: "API integration, CRM, HubSpot, Salesforce, webhook, server action, route handler, API endpoint, email, Resend, SendGrid, Turnstile, CAPTCHA, typed client, retry, rate limit, env vars, environment variables, Context7, MCP, server-side proxy, form submission, HMAC, signature verification"
version: "1.0.0"
---

## Layer 1: Decision Guidance

### When to Use

This skill applies to any Modulo project that connects to external services. Load it when the project includes any of these:

- **Contact or lead forms submitting to a CRM** -- HubSpot Forms API, Salesforce Web-to-Lead, or Salesforce REST API submissions
- **Incoming webhooks from external services** -- Stripe payment events, GitHub repository events, or any provider that pushes data to your application via HTTP POST
- **External API calls requiring authentication** -- Any server-side fetch to a third-party API that needs API keys, OAuth tokens, or other secrets
- **Transactional email sending** -- Confirmation emails, notification emails, or any programmatic email via Resend or SendGrid
- **Form spam protection** -- Cloudflare Turnstile validation for any user-facing form
- **Agent needs current API documentation during build** -- Context7 MCP lookup for live SDK documentation when skill baseline may be outdated

### When NOT to Use

Redirect to other skills when this one is the wrong choice:

- **GraphQL APIs** -- Deferred to v2 (API-V2-01). This skill covers REST/HTTP APIs only. Do not adapt these patterns for GraphQL queries or mutations
- **Real-time WebSocket or SSE connections** -- Deferred to v2 (API-V2-02). This skill covers request/response patterns, not persistent connections
- **Client-side caching (SWR, TanStack Query)** -- Deferred to v2 (API-V2-03). This skill covers server-side patterns only. Client-side data fetching and caching are a separate concern
- **CMS content fetching** -- Use `cms-integration` skill. This skill covers API endpoints for form submissions and webhooks, not CMS data retrieval
- **Authentication flows (login, signup, sessions)** -- Use `auth-ui` skill. This skill covers server-side API proxying, not authentication UX or session management
- **SSR/ISR/streaming rendering decisions** -- Use the upcoming `ssr-dynamic-content` skill (Phase 19). This skill covers API call patterns, not rendering strategy

### Integration Type Decision Tree

Use this tree to select the correct pattern from Layer 2.

**Form collects leads or contacts?**
- Yes, using HubSpot -> **HubSpot Forms API v3 pattern** (Pattern 5)
- Yes, using Salesforce for simple marketing sites -> **Web-to-Lead pattern** (Pattern 6)
- Yes, using Salesforce for programmatic/complex use cases -> **REST API with JWT OAuth pattern** (Pattern 7)
- Yes, generic CRM or service accepting webhook payloads -> **Generic webhook POST pattern** (Pattern 8)
- No CRM needed, just email notification -> **Resend pattern** (Pattern 9) or **SendGrid pattern** (Pattern 10)

**Receiving external events?**
- From Stripe -> **Stripe webhook pattern** (Pattern 13) -- uses SDK-based verification
- From GitHub -> **GitHub webhook pattern** (Pattern 14) -- uses HMAC-SHA256 with `timingSafeEqual`
- From another provider using HMAC signatures -> **Generic HMAC-SHA256 verifier** (Pattern 16)

**Calling external API from server?**
- Simple, one-off call -> **Thin fetch wrapper** (Pattern 18)
- Multiple calls, production use -> **Typed API client with retry and rate limiting** (Pattern 19)

**Need spam protection on forms?**
- Yes -> Add **Cloudflare Turnstile** (Patterns 11-12) -- privacy-friendly, no visual puzzle, free tier

**Need current API docs during build?**
- Yes -> Use **Context7 MCP with fallback chain** (Pattern 22)

### Server-Side Proxy Principle

All external API calls in Modulo projects go through server-side code. Secrets never reach the client bundle. This is not optional -- it is a security requirement enforced by the framework's environment variable system. Server-side code (Server Actions, Route Handlers, API endpoints) accesses secrets via unprefixed environment variables that the bundler excludes from client output. Client components can only access values with the framework's public prefix, which is reserved for truly public values like widget site keys.

**Framework prefix rules:**

| Framework | Public Prefix | Secret Access | Example Public Var |
|-----------|--------------|---------------|-------------------|
| Next.js | `NEXT_PUBLIC_` | `process.env.SECRET_NAME` | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |
| Astro | `PUBLIC_` | `import.meta.env.SECRET_NAME` | `PUBLIC_TURNSTILE_SITE_KEY` |
| Vite/React | `VITE_` | `process.env.SECRET_NAME` (server only) | `VITE_TURNSTILE_SITE_KEY` |

**Modulo convention:** ALL secrets use unprefixed env var names (`RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `SF_PRIVATE_KEY`). Only truly public values (like Turnstile site key) use the framework public prefix. If a value contains KEY, SECRET, TOKEN, or PASSWORD in its name, it MUST NOT use a public prefix.

### Context7 MCP Integration

Context7 is an MCP server that provides live API documentation lookup via two tools. It serves as a freshness upgrade for agents -- the skill contains hardcoded, version-pinned baseline patterns that work without Context7. Context7 is NOT a runtime dependency.

**MCP Tools:**

| Tool | Input | Output |
|------|-------|--------|
| `mcp__context7__resolve-library-id` | Library name string (e.g., `"resend"`) | Context7 library ID for use in queries |
| `mcp__context7__query-docs` | Library ID + query string | Current documentation excerpt |

**Agent Access:**

| Agent | Access | Rationale |
|-------|--------|-----------|
| **design-researcher** | YES (primary) | Track 3 Component Library research, any library-specific research |
| **specialist agents** | YES | For complex or niche library APIs where training data may be stale |
| **quality-reviewer** | YES | For verifying that generated code uses current API patterns |
| **section-builder** | NO | Too much latency for fast builds; relies on pre-researched patterns in skills |

**Explicit Triggers for Lookup:**

Agents should invoke Context7 when any of these conditions are met:

1. **Version-specific API question** -- "What is the current syntax for X in library Y?"
2. **Unfamiliar SDK encountered** -- Project uses a library not covered by Modulo skills
3. **Deprecated pattern detected** -- Agent recognizes a pattern that may be outdated
4. **Rate limit or constraint question** -- "What are the current limits for API X?"

**Curated Library List:**

| Library Name | Recommended Query Topics |
|-------------|------------------------|
| `resend` | Email sending, batch, SDK methods, rate limits |
| `stripe` | Webhook construction, event types, SDK methods |
| `@sendgrid/mail` | Send method, template support, batch sending |
| `next` | Server Actions, Route Handlers, env vars |
| `astro` | API endpoints, SSR, env vars |
| `@hubspot/api-client` | Forms API, contacts API, rate limits |
| `zod` | Schema validation, error formatting |

**Fallback Chain:**

1. **Context7 MCP** -> Available? Use current docs (confidence: HIGH)
2. **Hardcoded skill baseline** -> Version-pinned patterns in this SKILL.md (confidence: MEDIUM -- may be slightly outdated)
3. **Official documentation URLs** -> HubSpot (developers.hubspot.com), Stripe (docs.stripe.com), Resend (resend.com/docs), Cloudflare (developers.cloudflare.com/turnstile), Salesforce (developer.salesforce.com) (confidence: MEDIUM -- requires WebFetch)
4. **Flag to user** -> "Could not verify current API patterns. Please provide documentation URL." (confidence: LOW)

### Pipeline Connection

- **Referenced by:** section-builder (when generating forms and API integrations), specialist agents (when integrating external services mid-build)
- **Context7 access:** design-researcher (Track 3 Component Library), specialist agents, quality-reviewer
- **Consumed at:** `/modulo:execute` Wave 2+ for form sections and API integration sections
- **Input from:** `/modulo:start-project` (project requirements identify needed integrations), `/modulo:plan-dev` (sections flagged for API integration)
- **Output to:** Server actions, API route handlers, API endpoints, utility libraries, `.env.example`

### Timeout Defaults

Opinionated timeout defaults for API integration categories. These are starting values -- adjust per project requirements.

| Category | Timeout | Retries | Rationale |
|----------|---------|---------|-----------|
| Form submissions | 5,000ms | 3 (1s/2s/4s) | User is waiting; fast fail preferred |
| CRM API calls | 10,000ms | 3 (1s/2s/4s) | CRM APIs can be slow; reasonable patience |
| File uploads | 30,000ms | 1 (no retry) | Large payloads; retry is wasteful |
| Webhook receiving | No timeout | 0 (no retry) | Providers retry on their own; respond quickly |

## Layer 2: Award-Winning Examples

### A. Server-Side Proxy Foundations

#### Pattern 1: Next.js 16 Server Action with Zod Validation

The foundational server-side pattern for form handling. Server Actions run exclusively on the server -- environment variables without the `NEXT_PUBLIC_` prefix are inaccessible to the client bundle. Zod validates incoming FormData before any external API call. The function signature `(prevState: any, formData: FormData)` matches the `useActionState` contract from React 19.

```typescript
// app/actions/contact.ts
'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactState = {
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
}

export async function submitContact(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
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

#### Pattern 2: Next.js 16 Route Handler

Route Handlers are the webhook-ready server endpoint pattern. Use `request.text()` for raw body access when signature verification is needed (webhooks), or `request.json()` for standard JSON POST endpoints. Route Handlers coexist with Server Actions -- use Route Handlers when you need to expose an HTTP endpoint to external services.

```typescript
// app/api/contact/route.ts
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  const body = await request.json()

  const validated = contactSchema.safeParse(body)
  if (!validated.success) {
    return Response.json(
      { errors: validated.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const response = await fetch('https://api.example.com/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validated.data),
  })

  if (!response.ok) {
    return Response.json({ error: 'Submission failed' }, { status: 502 })
  }

  return Response.json({ success: true })
}
```

#### Pattern 3: Astro 5 API Endpoint

Astro API endpoints use `export const prerender = false` to opt into SSR for that route. Secrets are accessed via `import.meta.env` without the `PUBLIC_` prefix. The `APIRoute` type provides the request object and response helpers.

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
    return new Response(JSON.stringify({ error: 'Failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

#### Pattern 4: Three-State Form UI with useActionState

The canonical form UI pattern for all CRM and email submissions. Uses React 19's `useActionState` which returns `[state, formAction, pending]` -- the `pending` boolean replaces the need for a separate `useFormStatus` call. Success messages use `role="status"` for screen readers; errors use `role="alert"` for immediate announcement. All inputs disable during submission to prevent double-sends.

```tsx
// components/contact-form.tsx
'use client'

import { useActionState } from 'react'
import { submitContact } from '@/app/actions/contact'

const initialState = { success: false, error: undefined, errors: undefined }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.success) {
    return (
      <div role="status" className="text-center py-12">
        <h3 className="text-xl font-semibold">Thank you!</h3>
        <p className="mt-2 text-text/60">We will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          id="name"
          name="name"
          required
          disabled={pending}
          className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2"
        />
        {state.errors?.name && (
          <p role="alert" className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={pending}
          className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2"
        />
        {state.errors?.email && (
          <p role="alert" className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          disabled={pending}
          className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2"
        />
        {state.errors?.message && (
          <p role="alert" className="mt-1 text-sm text-red-600">{state.errors.message[0]}</p>
        )}
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

### B. CRM Form Integration

#### Pattern 5: HubSpot Forms API v3 Submission

HubSpot Forms API v3 requires `objectTypeId` on every field in the submission payload. For contact form submissions, every field must include `objectTypeId: '0-1'` (the Contact object type identifier). Omitting this causes validation errors. The `context` parameter enables page URI tracking in HubSpot analytics.

Rate limits: 50 requests per 10 seconds (unauthenticated), 200 requests per 10 seconds (authenticated). 10 consecutive 429 responses in 1 second triggers a 1-minute block.

```typescript
// lib/crm/hubspot.ts
'use server'

type HubSpotField = {
  objectTypeId: string  // '0-1' for Contact properties
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
      objectTypeId: '0-1',  // REQUIRED: Contact object type
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

**Server Action wrapper** (connects the HubSpot function to a form):

```typescript
// app/actions/hubspot-contact.ts
'use server'

import { z } from 'zod'
import { submitHubSpotForm } from '@/lib/crm/hubspot'

const schema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
})

export async function submitHubSpotContact(prevState: any, formData: FormData) {
  const validated = schema.safeParse(Object.fromEntries(formData))
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  try {
    await submitHubSpotForm(
      process.env.HUBSPOT_PORTAL_ID!,
      process.env.HUBSPOT_FORM_GUID!,
      validated.data as Record<string, string>,
      { pageUri: formData.get('pageUri') as string }
    )
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
```

#### Pattern 6: Salesforce Web-to-Lead

Salesforce Web-to-Lead is a redirect-based submission system, NOT a JSON API. The server-side proxy uses `URLSearchParams` to POST form data and sets `redirect: 'manual'` to prevent following the redirect. Success is indicated by a 200 or 302 status code -- do NOT attempt to parse the response as JSON.

Limit: 500 leads per 24-hour period (additional leads are queued).

```typescript
// lib/crm/salesforce-web-to-lead.ts
'use server'

type WebToLeadFields = {
  first_name: string
  last_name: string
  email: string
  company?: string
  phone?: string
  [key: string]: string | undefined  // Custom Salesforce fields
}

export async function submitWebToLead(
  oid: string,  // 15-character Salesforce Organization ID
  fields: WebToLeadFields
): Promise<{ success: boolean }> {
  const formData = new URLSearchParams()
  formData.append('oid', oid)
  formData.append('retURL', 'https://example.com/thank-you')  // Required by Salesforce but ignored server-side

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      formData.append(key, value)
    }
  }

  // IMPORTANT: Web-to-Lead is redirect-based, NOT a JSON API
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

#### Pattern 7: Salesforce REST API with JWT Bearer OAuth

For programmatic use cases where Web-to-Lead is too limited (custom object creation, complex field mapping, API-driven workflows). Uses the JWT Bearer OAuth flow with `jose` library for token generation. Requires a Connected App in Salesforce with a private key for signing.

```typescript
// lib/crm/salesforce-rest.ts
'use server'

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

**Env vars:** `SF_PRIVATE_KEY` (PEM-format private key), `SF_CONSUMER_KEY` (Connected App consumer key), `SF_USERNAME` (Salesforce username).

#### Pattern 8: Generic Webhook POST

Universal fallback for any CRM or service that accepts webhook payloads. Use this when the target service does not have a specific SDK or documented API pattern. Shown in both Next.js Server Action and Astro API endpoint versions.

**Next.js Server Action:**

```typescript
// app/actions/webhook-submit.ts
'use server'

import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
})

export async function submitToWebhook(prevState: any, formData: FormData) {
  const validated = schema.safeParse(Object.fromEntries(formData))
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const response = await fetch(process.env.WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...validated.data,
      submittedAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    return { error: 'Submission failed. Please try again.' }
  }

  return { success: true }
}
```

**Astro API endpoint:**

```typescript
// src/pages/api/webhook-submit.ts
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()

  const response = await fetch(import.meta.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      submittedAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Submission failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

### C. Email Sending

#### Pattern 9: Resend Email Sending

Resend is the primary recommendation for Modulo projects -- TypeScript-first SDK with modern API design and JSX email template support. The `resend.emails.send()` method accepts both `html` (raw HTML string) and `react` (JSX element from `@react-email/components`) for email content.

Rate limit: 2 requests per second per team (across all API keys). Response headers include `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, and `retry-after`.

```typescript
// lib/email/resend.ts
'use server'

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

**Usage with JSX email template:**

```typescript
// app/actions/send-confirmation.ts
'use server'

import { sendEmail } from '@/lib/email/resend'
import { ConfirmationEmail } from '@/emails/confirmation'

export async function sendConfirmation(name: string, email: string) {
  return sendEmail({
    to: email,
    subject: 'Thank you for reaching out',
    react: ConfirmationEmail({ name }),
  })
}
```

#### Pattern 10: SendGrid Email Sending

SendGrid is the alternative for high-volume or legacy use cases. Uses `@sendgrid/mail` SDK with `sgMail.send()`. Always include a `text` fallback for email clients that do not render HTML.

```typescript
// lib/email/sendgrid.ts
'use server'

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

### D. Spam Protection

#### Pattern 11: Cloudflare Turnstile Server Validation

Turnstile tokens are single-use and expire after 300 seconds (5 minutes). A token can only be validated once -- if the form is resubmitted, the client must generate a new token by resetting the widget. The `timeout-or-duplicate` error code indicates a reused or expired token.

```typescript
// lib/security/turnstile.ts
'use server'

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

**Error codes reference:** `missing-input-secret`, `invalid-input-secret`, `missing-input-response`, `invalid-input-response`, `timeout-or-duplicate` (token reused or expired), `internal-error`.

#### Pattern 12: Turnstile Client Widget

The `@marsidev/react-turnstile` package is Cloudflare-recommended for React integration. The `onExpire` callback resets the widget to generate a fresh token when the current one expires. The site key uses `NEXT_PUBLIC_TURNSTILE_SITE_KEY` -- this is correctly public-prefixed because it is NOT a secret. The site key is meant to be visible in client-side code.

```tsx
// components/turnstile-widget.tsx
'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { useRef } from 'react'

type TurnstileWidgetProps = {
  onVerify: (token: string) => void
}

export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const ref = useRef<{ reset: () => void }>(null)

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

**Integration with form:** Pass the Turnstile token as a hidden field in the form submission, then validate it server-side before processing the form data:

```typescript
// In the server action, validate before processing:
import { validateTurnstileToken } from '@/lib/security/turnstile'

export async function submitWithTurnstile(prevState: any, formData: FormData) {
  const turnstileToken = formData.get('cf-turnstile-response') as string
  if (!turnstileToken) {
    return { error: 'Please complete the verification challenge.' }
  }

  const { valid, errors } = await validateTurnstileToken(turnstileToken)
  if (!valid) {
    return { error: `Verification failed: ${errors.join(', ')}` }
  }

  // Continue with form processing...
}
```

### E. Webhook Receiver Patterns

#### Pattern 13: Stripe Webhook Verification

Stripe's SDK provides `stripe.webhooks.constructEvent()` which handles both signature verification and event parsing in a single call. The critical requirement is using `request.text()` to get the raw body string -- using `request.json()` would parse the body into an object, and the re-serialized string would not match the signature. The webhook secret starts with `whsec_` and is unique per webhook endpoint.

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  // MUST use text(), NOT json() -- raw body required for signature verification
  const body = await request.text()
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
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      // Process completed checkout (e.g., fulfill order, send confirmation)
      break
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      // Process paid invoice (e.g., extend subscription)
      break
    }
    case 'customer.subscription.deleted': {
      // Handle subscription cancellation
      break
    }
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return Response.json({ received: true })
}
```

#### Pattern 14: GitHub Webhook Verification

GitHub webhook signatures use HMAC-SHA256 with the `X-Hub-Signature-256` header in the format `sha256=<hex_digest>`. Verification MUST use `crypto.timingSafeEqual` to prevent timing attacks -- never use `===` for signature comparison. JSON parsing happens ONLY after signature verification succeeds.

```typescript
// app/api/webhooks/github/route.ts
import { timingSafeEqual, createHmac } from 'crypto'

function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = 'sha256=' + createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // MUST use timingSafeEqual -- never use === for signature comparison
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
  // MUST use text() for raw body before signature verification
  const body = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  if (!signature) {
    return new Response('Missing x-hub-signature-256 header', { status: 401 })
  }

  if (!verifyGitHubSignature(body, signature, process.env.GITHUB_WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Safe to parse AFTER verification succeeds
  const event = request.headers.get('x-github-event')
  const payload = JSON.parse(body)

  switch (event) {
    case 'push': {
      const { ref, commits } = payload
      // Handle push event (e.g., trigger deployment)
      break
    }
    case 'pull_request': {
      const { action, pull_request } = payload
      // Handle PR event (e.g., run checks)
      break
    }
    case 'issues': {
      const { action, issue } = payload
      // Handle issue event
      break
    }
  }

  return Response.json({ received: true })
}
```

#### Pattern 15: Astro Webhook Endpoint

The Astro equivalent of the Stripe webhook pattern. Uses `export const prerender = false` to enable SSR and the `APIRoute` type for the handler. The same raw body verification flow applies -- use `request.text()` before any signature check.

```typescript
// src/pages/api/webhooks/stripe.ts
import type { APIRoute } from 'astro'
import Stripe from 'stripe'

export const prerender = false

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY)

export const POST: APIRoute = async ({ request }) => {
  // MUST use text() for raw body before signature verification
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    return new Response('Signature verification failed', { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      // Process completed checkout
      break
    }
    case 'invoice.paid': {
      // Process paid invoice
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

#### Pattern 16: Generic HMAC-SHA256 Webhook Verifier

Reusable factory function for any provider that uses HMAC-based signature verification. Configurable header name, signature prefix, algorithm, and encoding. Creates a verification function scoped to a specific secret and configuration. Uses `timingSafeEqual` for all comparisons.

```typescript
// lib/webhooks/verify.ts
import { timingSafeEqual, createHmac } from 'crypto'

type WebhookVerifyConfig = {
  headerName: string           // e.g., 'x-webhook-signature'
  signaturePrefix?: string     // e.g., 'sha256=' for GitHub-style
  algorithm?: string           // default: 'sha256'
  encoding?: 'hex' | 'base64'  // default: 'hex'
}

export function createWebhookVerifier(secret: string, config: WebhookVerifyConfig) {
  const algorithm = config.algorithm ?? 'sha256'
  const encoding = config.encoding ?? 'hex'
  const prefix = config.signaturePrefix ?? ''

  return function verify(payload: string, signatureHeader: string): boolean {
    const expected = prefix + createHmac(algorithm, secret)
      .update(payload)
      .digest(encoding)

    try {
      return timingSafeEqual(
        Buffer.from(signatureHeader),
        Buffer.from(expected)
      )
    } catch {
      return false  // Buffers of different lengths
    }
  }
}

// Usage examples:
//
// GitHub:
// const verifyGitHub = createWebhookVerifier(
//   process.env.GITHUB_WEBHOOK_SECRET!,
//   { headerName: 'x-hub-signature-256', signaturePrefix: 'sha256=' }
// )
//
// Custom provider:
// const verifyCustom = createWebhookVerifier(
//   process.env.CUSTOM_WEBHOOK_SECRET!,
//   { headerName: 'x-signature', encoding: 'base64' }
// )
//
// In a Route Handler:
// const body = await request.text()  // Always raw body first
// const sig = request.headers.get(config.headerName)!
// if (!verify(body, sig)) return new Response('Invalid', { status: 401 })
```

### F. Typed API Client

#### Pattern 17: Pattern Progression -- Thin Wrapper to Typed Client

The api-patterns skill teaches a deliberate progression: start with a thin fetch wrapper for simple integrations, then evolve to a production-ready typed client when the project needs retry logic, rate limit handling, and structured error types. This progression teaches WHY each layer exists rather than dumping a complex client on every project. Use Pattern 18 for prototypes and single-API integrations. Use Pattern 19 for production applications calling external APIs.

#### Pattern 18: Thin Fetch Wrapper

A simple async function wrapping a single API call. Good for prototypes, single-API integrations, and cases where the full typed client is overkill. Provides basic typing but no retry or rate limiting.

```typescript
// lib/api/hubspot.ts
'use server'

export async function submitToHubSpot(
  portalId: string,
  formGuid: string,
  fields: Record<string, string>
) {
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

  if (!response.ok) {
    throw new Error(`HubSpot submission failed: ${response.status}`)
  }

  return response.json()
}
```

#### Pattern 19: Typed API Client with Retry and Rate Limiting

Full production pattern with discriminated union error types, exponential backoff retry, AbortController timeout, and 429 rate limit handling with `retry-after` header respect. The `ApiResult<T>` type forces callers to check for errors before accessing data -- no unchecked `.data` access.

```typescript
// lib/api/client.ts

type ApiClientConfig = {
  baseUrl: string
  headers?: Record<string, string>
  timeout?: number      // ms, default 10000
  retries?: number      // default 3
  retryDelayMs?: number // base delay, default 1000
}

type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError }

type ApiError = {
  code: 'NETWORK' | 'TIMEOUT' | 'RATE_LIMITED' | 'VALIDATION' | 'SERVER' | 'UNKNOWN'
  message: string
  status?: number
  retryable: boolean
}

const DEFAULT_CONFIG = {
  timeout: 10_000,
  retries: 3,
  retryDelayMs: 1_000,
} as const

async function fetchWithRetry<T>(
  url: string,
  init: RequestInit,
  config: Required<ApiClientConfig>
): Promise<ApiResult<T>> {
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    if (attempt > 0) {
      const delay = config.retryDelayMs * Math.pow(2, attempt - 1)  // 1s, 2s, 4s
      const jitter = delay * 0.1 * Math.random()
      await new Promise(r => setTimeout(r, delay + jitter))
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      const response = await fetch(url, {
        ...init,
        headers: { ...config.headers, ...init.headers },
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      // Handle rate limiting with retry-after header
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
        if (!isRetryable) break  // Don't retry 4xx errors (except 429 handled above)
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

export function createApiClient(config: ApiClientConfig) {
  const fullConfig: Required<ApiClientConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
    headers: config.headers ?? {},
  }

  return {
    async get<T>(path: string): Promise<ApiResult<T>> {
      return fetchWithRetry<T>(`${fullConfig.baseUrl}${path}`, { method: 'GET' }, fullConfig)
    },

    async post<T>(path: string, body: unknown): Promise<ApiResult<T>> {
      return fetchWithRetry<T>(
        `${fullConfig.baseUrl}${path}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        fullConfig
      )
    },

    async put<T>(path: string, body: unknown): Promise<ApiResult<T>> {
      return fetchWithRetry<T>(
        `${fullConfig.baseUrl}${path}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        fullConfig
      )
    },

    async delete<T>(path: string): Promise<ApiResult<T>> {
      return fetchWithRetry<T>(`${fullConfig.baseUrl}${path}`, { method: 'DELETE' }, fullConfig)
    },
  }
}

// Usage:
// const api = createApiClient({
//   baseUrl: 'https://api.example.com',
//   headers: { 'Authorization': `Bearer ${process.env.API_KEY}` },
//   timeout: 5000,
//   retries: 3,
// })
//
// const result = await api.post<{ id: string }>('/leads', { name, email })
// if (result.error) {
//   console.error(result.error.code, result.error.message)
//   if (result.error.retryable) { /* suggest retry */ }
// } else {
//   console.log('Created:', result.data.id)
// }
```

### G. Environment Variable Management

#### Pattern 20: Environment Variable Convention

The Modulo convention for environment variables: all secrets use unprefixed names. Only truly public values (like client-side widget keys) use the framework public prefix. The `requireEnv()` helper provides fail-fast behavior during server startup rather than silent `undefined` at runtime.

**RULE:** If an env var name contains KEY, SECRET, TOKEN, or PASSWORD, it MUST NOT use a public prefix (`NEXT_PUBLIC_`, `PUBLIC_`, `VITE_`).

```typescript
// lib/env.ts
// Type-safe environment variable access with fail-fast behavior

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Add it to .env.local (development) or your deployment environment.`
    )
  }
  return value
}

// Usage in server-side code:
// const apiKey = requireEnv('RESEND_API_KEY')
// const portalId = requireEnv('HUBSPOT_PORTAL_ID')
```

**Complete environment variable reference:**

| Service | Env Var Name | Prefix | Server/Client | Example Value |
|---------|-------------|--------|---------------|---------------|
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
| Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `NEXT_PUBLIC_` | Client | `0x4xxxx` |
| Email From | `EMAIL_FROM_NAME` | None | Server | `Acme Inc` |
| Email From | `EMAIL_FROM_ADDRESS` | None | Server | `hello@acme.com` |

#### Pattern 21: Auto-Generated .env.example

Agents auto-generate this file when a project uses API patterns. All values are placeholders with format hints, grouped by service. This file is committed to the repository -- it contains no real secrets.

```bash
# .env.example
# Auto-generated by Modulo. Copy to .env.local and fill in real values.
# NEVER commit .env.local to version control.

# ──────────────────────────────────────────────
# Email (choose one provider)
# ──────────────────────────────────────────────
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# EMAIL_FROM_NAME=Your Company
# EMAIL_FROM_ADDRESS=hello@yourdomain.com

# ──────────────────────────────────────────────
# CRM: HubSpot
# ──────────────────────────────────────────────
# HUBSPOT_PORTAL_ID=12345678
# HUBSPOT_FORM_GUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# ──────────────────────────────────────────────
# CRM: Salesforce (Web-to-Lead)
# ──────────────────────────────────────────────
# SF_OID=00Dxxxxxxxxxxxxxxx

# ──────────────────────────────────────────────
# CRM: Salesforce (REST API with JWT)
# ──────────────────────────────────────────────
# SF_CONSUMER_KEY=your_connected_app_consumer_key
# SF_USERNAME=your_integration_user@example.com
# SF_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# ──────────────────────────────────────────────
# Payments: Stripe
# ──────────────────────────────────────────────
# STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_KEY_HERE
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# ──────────────────────────────────────────────
# Webhooks: GitHub
# ──────────────────────────────────────────────
# GITHUB_WEBHOOK_SECRET=your_webhook_secret_string

# ──────────────────────────────────────────────
# Spam Protection: Cloudflare Turnstile
# ──────────────────────────────────────────────
# TURNSTILE_SECRET_KEY=0x4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#   Astro: PUBLIC_TURNSTILE_SITE_KEY=0x4xxx...
#   Vite:  VITE_TURNSTILE_SITE_KEY=0x4xxx...

# ──────────────────────────────────────────────
# Generic Webhook
# ──────────────────────────────────────────────
# WEBHOOK_URL=https://hooks.example.com/your-webhook-endpoint
```

### H. Context7 MCP Usage Examples

#### Pattern 22: Context7 Workflow Examples

Context7 is used at the agent level during build, not at runtime. These examples show the MCP tool invocation flow that agents follow when checking API documentation freshness.

**Example 1: Researcher checking current Resend SDK API**

The design-researcher agent is investigating email integration for a project. Before relying on the skill baseline, it checks Context7 for the latest Resend SDK documentation.

```
Agent: design-researcher (Track 3: Component Library)
Trigger: Project requires email sending. Checking current Resend API.

Step 1: Resolve library ID
  Tool: mcp__context7__resolve-library-id
  Input: "resend"
  Output: { libraryId: "resend/resend-node" }

Step 2: Query current docs
  Tool: mcp__context7__query-docs
  Input: { libraryId: "resend/resend-node", query: "send email typescript" }
  Output: [Current SDK documentation with method signatures]

Step 3: Agent compares Context7 result with skill baseline
  - If API matches skill baseline: Use skill pattern as-is (confidence: HIGH)
  - If API differs: Adapt pattern to current API, note deviation in research output
```

**Example 2: Specialist agent verifying HubSpot Forms API syntax mid-build**

A specialist agent is implementing a HubSpot form integration and wants to verify the submission endpoint syntax is current.

```
Agent: specialist agent (mid-build)
Trigger: Unfamiliar with HubSpot Forms API v3 objectTypeId requirement

Step 1: Resolve library ID
  Tool: mcp__context7__resolve-library-id
  Input: "@hubspot/api-client"
  Output: { libraryId: "hubspot/hubspot-api-client" }

Step 2: Query forms submission docs
  Tool: mcp__context7__query-docs
  Input: { libraryId: "hubspot/hubspot-api-client", query: "forms submission v3 objectTypeId" }
  Output: [Current HubSpot Forms API documentation]

Step 3: Agent confirms objectTypeId: '0-1' is still required for Contact submissions
  - Proceeds with skill baseline pattern (confirmed current)
```

**Example 3: Quality reviewer confirming Stripe webhook event types**

The quality-reviewer agent is auditing a webhook handler and wants to verify the event type names are current.

```
Agent: quality-reviewer
Trigger: Reviewing generated Stripe webhook handler; confirming event type names

Step 1: Resolve library ID
  Tool: mcp__context7__resolve-library-id
  Input: "stripe"
  Output: { libraryId: "stripe/stripe-node" }

Step 2: Query webhook event types
  Tool: mcp__context7__query-docs
  Input: { libraryId: "stripe/stripe-node", query: "webhook event types checkout invoice subscription" }
  Output: [Current Stripe event type documentation]

Step 3: Agent confirms event type names match generated code
  - checkout.session.completed, invoice.paid, customer.subscription.deleted
  - All confirmed current; passes review
```

### I. Reference Sites

Reference implementations demonstrating API integration patterns in production. These are not award-winning design sites -- they are engineering references showing correct server-side integration.

- **Vercel** (vercel.com) -- Server Actions for contact and feedback forms, webhook-driven deployment pipelines. Reference for Next.js Server Action patterns with progressive enhancement
- **Stripe** (stripe.com) -- Canonical webhook implementation with SDK-based signature verification. Reference for typed API client design with comprehensive error handling
- **Linear** (linear.app) -- Clean webhook receiver patterns with typed event payloads. Reference for discriminated union error types and typed API design
- **Resend** (resend.com) -- Reference email API integration with TypeScript-first DX. Example of how a simple SDK can wrap a complex API surface
- **Cal.com** (cal.com) -- Open-source Next.js application with comprehensive webhook and CRM integration patterns. Source code available for studying production server-side proxy implementations

<!-- END OF LAYER 2 -- Plan 02 will append Layer 3 (Integration Context) and Layer 4 (Anti-Patterns) below this line -->
