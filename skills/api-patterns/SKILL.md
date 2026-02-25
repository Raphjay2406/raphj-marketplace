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
