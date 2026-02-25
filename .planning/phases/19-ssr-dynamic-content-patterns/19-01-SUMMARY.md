---
phase: 19-ssr-dynamic-content-patterns
plan: 01
subsystem: rendering-strategy
tags: [ssr, isr, cache-components, server-islands, streaming, draft-mode, connection-pooling, next16, astro5]
depends_on:
  requires: []
  provides:
    - "ssr-dynamic-content SKILL.md Layers 1-2A (decision guidance + core rendering patterns)"
    - "4-dimension rendering strategy decision matrix"
    - "10 named scenario recipes for Next.js 16 and Astro 5/6"
    - "Next.js 16 4-layer cache system breakdown"
    - "15 copy-paste-ready code patterns"
  affects:
    - "19-02 (CMS revalidation, auth-gated content, reference sites -- Layer 2B)"
    - "19-03 (Layers 3-4 integration context, anti-patterns, constraints)"
tech-stack:
  added: []
  patterns:
    - "Cache Components (use cache + cacheLife + cacheTag)"
    - "Server Islands (server:defer)"
    - "Streaming SSR with Suspense boundaries"
    - "Draft Mode (async draftMode in Next.js 16)"
    - "Cookie-based preview (Astro)"
    - "Connection pooling for serverless (Neon + Prisma dual URLs)"
key-files:
  created:
    - "skills/ssr-dynamic-content/SKILL.md"
  modified: []
decisions:
  - "19-01: SKILL.md Layer 1 + Layer 2A at 978 lines -- 15 patterns across 6 categories justify length above 500-800 target"
  - "19-01: Cache Components presented as PPR replacement (not alongside it) -- Next.js 16 graduated PPR to Cache Components"
  - "19-01: Better Auth noted as Lucia replacement but not given full code patterns (deferred to Plan 02 auth section)"
  - "19-01: Draft-aware component uses post.contentHtml property instead of raw HTML injection for CMS content rendering"
  - "19-01: 10 named scenarios (full range used) -- covers blog, PDP, dashboard, marketing, profile, feed, pricing, docs, marketplace, event"
metrics:
  duration: "7m 55s"
  completed: "2026-02-25"
---

# Phase 19 Plan 01: SSR Dynamic Content SKILL.md Layers 1-2A Summary

Domain-tier skill providing 4-dimension rendering strategy decision matrix, 10 named scenario recipes, Next.js 16 Cache Components patterns (use cache + cacheLife + cacheTag), Astro Server Islands (server:defer), streaming SSR with Suspense, Draft Mode for both frameworks, connection pooling for serverless, and Cache-Control header reference.

## What Was Built

### Layer 1: Decision Guidance (289 lines)

- **Rendering Strategy Decision Matrix** -- 4 dimensions (data freshness, personalization, build frequency, runtime) mapping to SSG, Cache Components, Server Islands, SSR, and streaming strategies
- **10 Named Scenario Recipes** -- Blog/CMS, E-commerce PDP, Dashboard, Marketing Landing, User Profile, API Feed, SaaS Pricing, Documentation, Marketplace, Event/Conference -- each with Next.js 16 and Astro 5/6 recommendations
- **Next.js 16 4-Layer Cache Breakdown** -- Request Memoization, Data Cache, Full Route Cache, Router Cache with ASCII flow diagram and invalidation API summary
- **Edge vs Node.js Runtime Constraints** -- 13-row capability matrix with decision rule
- **Streaming SSR Concept** -- 7-sentence explanation of Suspense boundary placement strategy
- **cacheLife Preset Profiles** -- 7 built-in profiles with stale/revalidate/expire values and custom profile syntax
- **Pipeline Connection** -- section-builder and specialist agent integration points

### Layer 2A: Core Rendering Patterns (689 lines, 15 patterns)

| # | Pattern | Framework | Key Feature |
|---|---------|-----------|-------------|
| 1 | next.config.ts setup | Next.js 16 | `cacheComponents: true` + custom profiles |
| 2 | Cache Components hybrid page | Next.js 16 | 3-zone rendering: static + cached + streamed |
| 3 | On-demand invalidation | Next.js 16 | `updateTag` (immediate) vs `revalidateTag...'max'` (SWR) |
| 4 | Server Island component | Astro 5/6 | `server:defer` per-request component |
| 5 | Static page with Server Islands | Astro 5/6 | Static shell + deferred islands |
| 6 | ISR-equivalent via headers | Astro 5/6 | `Cache-Control: s-maxage + stale-while-revalidate` |
| 7 | Streaming SSR with Suspense | Next.js 16 | 3 boundaries: fast, slow, medium data |
| 8 | Draft Mode enable | Next.js 16 | Async `await draftMode()` with secret validation |
| 9 | Draft Mode disable | Next.js 16 | Simple exit route |
| 10 | Draft-aware Server Component | Next.js 16 | Conditional draft/published fetch with banner |
| 11 | Astro draft preview | Astro 5/6 | Cookie-based: enable, disable, draft-aware page |
| 12 | Neon serverless connection | Database | HTTP-based with Drizzle ORM |
| 13 | Prisma dual URLs | Database | Pooled runtime + direct migrations |
| 14 | Connection pooling rule | Decision | Serverless = always pool |
| 15 | Cache-Control headers | HTTP | 6-row reference table by page type |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Avoided raw HTML injection in draft-aware component**

- **Found during:** Task 2 (Pattern 10)
- **Issue:** Pre-commit hook flagged raw HTML rendering as potential XSS vector in the draft-aware blog component
- **Fix:** Changed to `post.contentHtml` property rendering via JSX instead of raw HTML injection. CMS content rendering should use the CMS SDK's safe rendering method where possible.
- **Files modified:** skills/ssr-dynamic-content/SKILL.md
- **Commit:** dfe5ea9

## Decisions Made

1. **978 lines for Layers 1-2A** -- Above 500-800 target. 15 patterns across 6 categories (Cache Components, Server Islands, streaming SSR, Draft Mode, connection pooling, Cache-Control) require this space. Each pattern is self-contained with complete TypeScript types.

2. **Cache Components as PPR replacement** -- Next.js 16 graduated PPR to Cache Components. The skill never references PPR as a separate feature. Only one anti-pattern warning mentions the old `experimental: { ppr: true }` config.

3. **10 named scenarios (full range)** -- Used the maximum of the 8-10 range to cover the full spectrum from static marketing to real-time dashboards. Each scenario maps cleanly to the 4-dimension matrix.

4. **Better Auth mentioned but not patterned** -- Research confirmed Lucia deprecated March 2025 and Better Auth is the replacement. Auth library-specific patterns deferred to Plan 02 (auth-gated content section).

5. **Astro draft preview via cookies** -- Astro has no built-in Draft Mode, so a cookie-based mechanism was implemented with enable/disable API routes and draft-aware page pattern.

## Next Phase Readiness

Plan 02 will append:
- **Layer 2B:** CMS revalidation webhooks (5 platforms: Sanity, Contentful, Strapi, Payload, Hygraph), auth-gated content patterns (Auth.js v5, Clerk, Supabase, Better Auth), and reference sites
- The `<!-- END OF LAYER 2A -->` marker indicates the exact insertion point

Plan 03 will add:
- **Layer 3:** Integration context (DNA connection, archetype variants, pipeline stage, related skills)
- **Layer 4:** Anti-patterns and machine-readable constraints
