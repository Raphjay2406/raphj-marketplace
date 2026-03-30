---
phase: 17-api-integration-patterns
plan: 01
subsystem: api-patterns-skill
tags: [api, crm, hubspot, salesforce, webhook, stripe, github, resend, sendgrid, turnstile, typed-client, retry, env-vars, context7, mcp, server-action, route-handler, astro-endpoint]
depends_on:
  requires: []
  provides: ["api-patterns SKILL.md Layers 1-2", "decision tree for integration type selection", "22 copy-paste code patterns", "Context7 MCP workflow guidance"]
  affects: ["17-02 (Layers 3-4 and constraints)"]
tech_stack:
  added: []
  patterns: ["server-side proxy", "discriminated union errors", "exponential backoff retry", "Zod validation", "useActionState three-state form", "HMAC-SHA256 webhook verification", "JWT Bearer OAuth"]
key_files:
  created:
    - skills/api-patterns/SKILL.md
  modified: []
decisions:
  - "1476 lines for Layers 1-2 (above 700-1000 target) -- 22 patterns across 6 requirements with full TypeScript types justify the length"
  - "Resend as primary email recommendation, SendGrid as alternative for high-volume/legacy"
  - "Cloudflare Turnstile as sole spam protection approach (privacy-first, no reCAPTCHA)"
  - "Typed API client uses createApiClient factory with get/post/put/delete methods"
  - "Context7 MCP integration documented with 3 concrete workflow examples (researcher, specialist, reviewer)"
  - "All secrets unprefixed (Genorah convention); only Turnstile site key uses public prefix"
metrics:
  duration: "5m 52s"
  completed: "2026-02-25"
---

# Phase 17 Plan 01: API Patterns SKILL.md Layers 1-2 Summary

**One-liner:** Domain-tier api-patterns skill with decision tree, server-side proxy principle, and 22 copy-paste TypeScript patterns for CRM forms, webhooks, typed clients, email, spam protection, and env management across Next.js 16 and Astro 5.

## What Was Built

Created `skills/api-patterns/SKILL.md` (1476 lines) containing YAML frontmatter, Layer 1 (Decision Guidance), and Layer 2 (Award-Winning Examples). The skill is Domain-tier, loaded per project when external API integration is needed.

### Layer 1: Decision Guidance

- **When to Use / When NOT to Use** -- 6 trigger conditions and 6 redirect-to-other-skill cases
- **Integration Type Decision Tree** -- Branching for CRM type, webhook provider, API client complexity, spam protection, and Context7 usage
- **Server-Side Proxy Principle** -- Framework prefix rules table (Next.js, Astro, Vite) with Genorah unprefixed secrets convention
- **Context7 MCP Integration** -- Agent access table, 4 explicit triggers, curated library list (7 libraries), 4-step fallback chain
- **Pipeline Connection** -- Input from start-project/plan-dev, output to server actions and utility libraries
- **Timeout Defaults** -- 4-category table with opinionated timeouts and retry counts

### Layer 2: Code Patterns (22 patterns across 9 sections)

| Section | Patterns | Coverage |
|---------|----------|----------|
| A. Server-Side Proxy Foundations | 4 | Next.js Server Action, Route Handler, Astro endpoint, useActionState form |
| B. CRM Form Integration | 4 | HubSpot Forms v3, Salesforce Web-to-Lead, SF REST JWT, generic webhook POST |
| C. Email Sending | 2 | Resend (primary), SendGrid (alternative) |
| D. Spam Protection | 2 | Turnstile server validation, Turnstile client widget |
| E. Webhook Receivers | 4 | Stripe, GitHub, Astro webhook, generic HMAC verifier |
| F. Typed API Client | 3 | Progression explanation, thin wrapper, full typed client |
| G. Env Var Management | 2 | Convention + requireEnv(), auto-generated .env.example |
| H. Context7 MCP | 1 | 3 workflow examples (researcher, specialist, reviewer) |
| I. Reference Sites | 5 sites | Vercel, Stripe, Linear, Resend, Cal.com |

### Security Constraints Enforced

- All webhook patterns use `request.text()` for raw body before signature verification
- All signature comparisons use `crypto.timingSafeEqual`, never `===`
- All secrets use unprefixed env var names (Genorah convention)
- Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` uses public prefix (correctly -- it is not a secret)
- HubSpot patterns include `objectTypeId: '0-1'` on every field
- Salesforce Web-to-Lead uses `redirect: 'manual'` with 200/302 success check

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `3e5b43e` | Frontmatter + Layer 1 (Decision Guidance) |
| 2 | `64c4b50` | Layer 2 (22 code patterns across all 6 requirements) |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **1476 lines for Layers 1-2** -- Above the 700-1000 target, but 22 patterns with full TypeScript types, explanation paragraphs, and reference sites require space. No appendix extraction needed at this stage; Plan 02 will add Layers 3-4 (estimated ~150-200 more lines).
2. **createApiClient factory pattern** -- The typed API client exposes a factory function returning get/post/put/delete methods rather than a class. This aligns with the functional TypeScript patterns used elsewhere in Genorah skills.
3. **27 code blocks total** -- Exceeds the 20+ minimum. Several patterns show both Next.js and Astro versions, and the HubSpot pattern includes a Server Action wrapper alongside the core function.

## Next Phase Readiness

Plan 02 can append Layers 3-4 directly below the `<!-- END OF LAYER 2 -->` comment at line 1476. The file structure is clean and ready for integration context (DNA connection, archetype variants, related skills) and anti-patterns.
