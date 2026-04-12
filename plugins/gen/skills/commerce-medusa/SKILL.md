---
name: "commerce-medusa"
description: "Medusa v2 self-hosted commerce — headless backend (Postgres), admin dashboard, Next.js storefront starter. Full checkout customization, regions, currencies, tax, fulfillment."
tier: "domain"
triggers: "medusa, medusa v2, self hosted commerce, headless commerce, open source commerce"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Self-hosted open-source commerce required.
- Need custom checkout flow not possible on Shopify.
- Multi-region / multi-currency / complex tax.

### When NOT to Use

- Small catalog (<50 SKUs) — overkill; use Stripe + custom UI.
- No ops team to maintain Postgres + Redis.

## Layer 2: Example (Storefront)

```ts
import Medusa from '@medusajs/js-sdk';

export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_URL!,
  publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY!,
});

// Add to cart
await sdk.store.cart.createLineItem(cartId, { variant_id, quantity: 1 });
```

## Layer 3: Integration Context

- Deploy: Medusa backend on Railway/Render, storefront on Vercel.
- Admin: `@medusajs/admin` mounted at `/app`.
- Checkout: fully custom; integrate Stripe/PayPal via Medusa plugins.
- Search: MeiliSearch or Algolia plugin.
- Inventory: multi-location via Stock Location module.

## Layer 4: Anti-Patterns

- Running single Node process for backend + admin + storefront in production.
- No Redis → cart operations degrade at scale.
- Ignoring `publishable API key` scoping — leaks B2B catalogs.
