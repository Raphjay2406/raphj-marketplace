---
status: complete
phase: 19-ssr-dynamic-content-patterns
source: 19-01-SUMMARY.md, 19-02-SUMMARY.md, 19-03-SUMMARY.md
started: 2026-02-25T05:00:00Z
updated: 2026-02-25T05:05:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Skill Structure & Frontmatter
expected: Open `skills/ssr-dynamic-content/SKILL.md`. The file should have YAML frontmatter with `tier: domain`, appropriate triggers (mentions of SSR, ISR, caching, revalidation, streaming, CMS, auth-gated), and a version number. The file should contain all 4 layers clearly marked: Layer 1 (Decision Guidance), Layer 2 (Award-Winning Examples), Layer 3 (Integration Context), Layer 4 (Anti-Patterns), plus a Machine-Readable Constraints table at the end.
result: pass

### 2. Rendering Strategy Decision Matrix
expected: Layer 1 should contain a decision matrix with 4 dimensions (data freshness, personalization, build frequency, runtime requirements). Each combination should map to a clear rendering strategy (SSG, Cache Components, Server Islands, SSR, or streaming). The matrix should be scannable -- an agent reading it should know which strategy to pick for a given project scenario.
result: pass

### 3. Scenario Recipes Are Actionable
expected: Pick any 2 of the 10 named scenario recipes (e.g., "Blog/CMS" and "Dashboard"). Each should specify: which rendering strategy to use, a Next.js 16 recommendation, an Astro 5/6 recommendation, and key configuration notes. The recipes should be specific enough that an agent could implement the pattern without guessing.
result: pass

### 4. Cache Components Pattern Uses Next.js 16 Syntax
expected: The Cache Components code pattern should use `'use cache'` directive (not PPR experimental config), `cacheLife()` for TTL profiles, and `cacheTag()` for targeted invalidation. There should be NO reference to `experimental: { ppr: true }` as a recommended pattern (only as an anti-pattern to avoid).
result: pass

### 5. CMS Webhook Handlers Have Real HMAC Verification
expected: Pick any CMS webhook handler (Sanity, Contentful, Strapi, or Hygraph -- NOT Payload which uses hooks). The handler should include cryptographic signature verification using `timingSafeEqual` or a platform-specific library (e.g., `@sanity/webhook`). It should NOT use plain string comparison for signatures. The handler should call revalidation functions after verification.
result: pass

### 6. Auth Patterns Warn About getSession Insecurity
expected: The auth-gated content section should explicitly warn that Supabase `getSession()` is insecure (doesn't validate JWT) and recommend `getClaims()` instead. The section should also recommend `proxy.ts` for route protection (not `middleware.ts`). At least 3 of the 4 auth libraries (Auth.js v5, Clerk, Supabase, Better Auth) should have code examples.
result: pass

### 7. Anti-Patterns Cover Critical SSR Mistakes
expected: Layer 4 should include anti-patterns for at least these critical mistakes: (a) using `experimental: { ppr: true }` in Next.js 16, (b) using `middleware.ts` instead of `proxy.ts`, (c) using `getSession()` instead of `getClaims()` for Supabase, (d) using `unstable_cache` instead of Cache Components. Each anti-pattern should show both the wrong code and the correct alternative.
result: pass

### 8. Machine-Readable Constraints Are Parseable
expected: The constraints table at the end should have columns for Parameter, Min/Max or Expected Value, Unit, and Enforcement level (HARD or SOFT). There should be at least 10 HARD constraints and at least 3 SOFT constraints. The format should be consistent enough that a quality-reviewer agent could parse it programmatically.
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
