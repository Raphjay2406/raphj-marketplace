---
name: rsc-patterns
description: Server component / streaming / cache-components patterns per framework. Next.js 16 PPR + Cache Components, Nuxt 3 Nitro hybrid, SvelteKit 2 streaming, Astro Server Islands. Rendering strategy per section declared in PLAN.md.
tier: domain
triggers: rsc, server-components, streaming, cache-components, ppr, nitro, server-islands, rendering-strategy
version: 0.1.0
---

# Server Components + Streaming Patterns

Framework-aware rendering strategy generator. Every section in PLAN.md declares `rendering_strategy: ssg | ssr | isr | streaming | cache-components | static`.

## Layer 1 — When to use

Every framework-generated section gets a rendering strategy. Builder consults this skill during Wave 0 scaffold + per-section Wave 2+.

## Layer 2 — Patterns per framework

### Next.js 16 — Cache Components (GA)

```tsx
// app/pricing/page.tsx
import { Suspense } from 'react';

export default async function PricingPage() {
  // Static shell
  return (
    <>
      <StaticHero />
      <Suspense fallback={<PricingSkeleton />}>
        <DynamicPricing />
      </Suspense>
    </>
  );
}

// Cache tag for targeted invalidation
async function DynamicPricing() {
  'use cache';
  cacheTag('pricing');
  const tiers = await fetchTiers();
  return <PricingTable tiers={tiers} />;
}

// Revalidate on webhook
import { revalidateTag } from 'next/cache';
revalidateTag('pricing');
```

### Nuxt 3 Nitro hybrid

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { isr: 3600 },
    '/dashboard/**': { ssr: true },
    '/api/**': { cors: true },
  },
});
```

### SvelteKit 2 streaming

```ts
// +page.server.ts
export async function load({ setHeaders }) {
  setHeaders({ 'cache-control': 'max-age=0, s-maxage=3600' });
  return {
    // Streamed data — page renders shell first
    streamed: {
      slow: fetchExpensive(),
    },
    // Await data — blocks render
    meta: await fetchMeta(),
  };
}
```

### Astro Server Islands

```astro
---
// pages/index.astro
import Pricing from '../components/Pricing.astro';
---

<html>
  <Pricing server:defer>
    <PricingSkeleton slot="fallback" />
  </Pricing>
</html>
```

## Layer 3 — Strategy per beat

| Beat | Recommended | Why |
|---|---|---|
| HOOK | SSG or streaming-static-shell | Fast first paint; content rarely changes |
| BREATHE | SSG | Purely aesthetic; cache forever |
| PEAK | Streaming or cache-components | Primary feature data — fresh but cached |
| PROOF | ISR or cache-components | Testimonials/logos update occasionally |
| PROOF with live data | Streaming | Live social proof (user counts, etc.) |
| CLOSE | SSG | Footer/CTA is static |

## Layer 4 — Integration

- PLAN.md per-section `rendering_strategy` field consumed by builder
- `/gen:rendering-review` audits strategy choices vs section characteristics
- Quality-gate cascade: mismatched strategy (streaming a static section) triggers Performance × 0.8 cap

## Layer 5 — Anti-patterns

- ❌ Streaming every section — defeats static-site benefits
- ❌ SSG a personalized section — users see other users' state
- ❌ ISR with too-short revalidate — effectively SSR with extra steps
- ❌ Ignoring framework defaults — Next 16 PPR wins in most cases
