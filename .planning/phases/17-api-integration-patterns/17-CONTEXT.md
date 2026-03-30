# Phase 17: API Integration Patterns - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

New `api-patterns` skill (Domain tier) providing server-side API integration patterns for Genorah projects. Covers CRM form submissions, webhook receivers, typed API clients, env secret management, and Context7 MCP workflow integration. All patterns are server-side -- secrets never exposed to client. Framework coverage: Next.js (Server Actions + Route Handlers) and Astro (API endpoints).

</domain>

<decisions>
## Implementation Decisions

### CRM & Form Integration Scope
- **Providers:** HubSpot Forms API (full pattern), Salesforce Web-to-Lead + REST API with OAuth (full pattern), generic webhook POST (universal fallback)
- **Depth:** Full pipeline -- submission, field mapping to CRM properties, and client-side validation mirroring CRM required fields
- **Multi-step flow:** Form submit -> server action -> CRM API -> email confirmation -> success redirect. Complete real-world pipeline
- **Email sending:** Full patterns for Resend (primary) and SendGrid. Not just hook points -- complete integration recipes
- **Spam protection:** Cloudflare Turnstile pattern included as the recommended approach (privacy-friendly, no visual puzzle)
- **Webhook direction:** Both outgoing submissions AND incoming webhook receivers with signature verification
- **Webhook examples:** Stripe + GitHub with provider-specific signature verification, plus generic HMAC-SHA256 pattern for anything else

### Server-side Proxy Design
- **Pattern progression:** Show thin fetch wrapper first, then evolve into typed client. Teaches the progression from simple to production-ready
- **Env secret convention:** Genorah convention enforced -- all secrets use unprefixed names (never NEXT_PUBLIC_, PUBLIC_, VITE_). Skill validates this in patterns
- **Auto-generated .env.example:** When a project uses API patterns, agents auto-generate .env.example with all required vars (commented, no real values)
- **Next.js approach:** Equal coverage of Server Actions and Route Handlers for each use case. Developer picks based on preference. Neither is "default"

### Context7 MCP Integration
- **Workflow scope:** Available to both researcher agents AND specialist agents (builders, etc.) mid-build when hitting unfamiliar APIs
- **Lookup triggers:** Explicit triggers defined -- use Context7 when encountering version-specific API, unfamiliar SDK, or deprecated pattern. Not left to judgment
- **Curated library list:** Maintain recommended API client libraries per use case. Context7 checks these first for latest docs (e.g., Resend, Stripe SDK, HubSpot client, @hubspot/api-client)

### Error Handling & UX Patterns
- **Retry logic:** Built-in by default in every typed API client. Exponential backoff (3 retries, 1s/2s/4s). Opt-out via config
- **Rate limiting:** Active throttling with request queue that respects rate limits proactively. Not just awareness -- actual throttle utility
- **Timeouts:** Per-category defaults -- 5s for form submissions, 10s for CRM API calls, 30s for file uploads. Configurable but opinionated

### Claude's Discretion
- Three-state UI (loading/success/error) depth -- balance between full component patterns vs state machine guidance, considering this is an API-focused skill
- Error response pattern -- discriminated unions vs typed error classes, pick what fits the typed client pattern best
- Context7 result caching strategy -- save to research output vs inline-only, based on context window and efficiency trade-offs

</decisions>

<specifics>
## Specific Ideas

- Pattern progression approach: thin wrapper -> typed client teaches developers the "why" behind each layer
- Turnstile over reCAPTCHA -- privacy-first choice aligns with Genorah's quality standards
- Resend as primary email provider -- modern API, good DX, aligns with the TypeScript-first ecosystem
- Salesforce gets two levels: Web-to-Lead for simple marketing sites, REST API for programmatic use cases with OAuth

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 17-api-integration-patterns*
*Context gathered: 2026-02-25*
