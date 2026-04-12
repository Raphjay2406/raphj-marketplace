---
name: "commerce-hydrogen"
description: "Shopify Hydrogen + Oxygen — headless commerce on Remix. Storefront API, cart persistence, customer accounts, checkout handoff. DNA-themed product UI, B2B Catalog support."
tier: "domain"
triggers: "shopify hydrogen, oxygen, storefront api, shopify headless, hydrogen commerce"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Shopify-backed commerce with custom storefront and full design control.
- B2B with Catalog-based pricing or account-gated products.

### When NOT to Use

- Standard Shopify theme sufficient — Liquid theme faster to ship.
- Non-Shopify backend — see `commerce-medusa` for self-hosted.

## Layer 2: Example

```tsx
// Remix route — product detail
import { useLoaderData } from '@remix-run/react';
import { getProductByHandle, addToCart } from '~/lib/shopify';

export async function loader({ params, context }) {
  return getProductByHandle(context.storefront, params.handle);
}

export default function Product() {
  const product = useLoaderData<typeof loader>();
  return (
    <article>
      <h1 className="font-display text-fluid-5">{product.title}</h1>
      <Money data={product.priceRange.minVariantPrice} />
      <AddToCartForm variantId={product.variants.nodes[0].id} />
    </article>
  );
}
```

## Layer 3: Integration Context

- Cart: `useCart` with Oxygen session persistence.
- Checkout: redirect to Shopify-hosted checkout URL (no custom checkout possible without Plus).
- SEO: ensure product JSON-LD emitted via `structured-data-v2` skill.
- Analytics: Shopify Customer Events + Web Pixels.
- Complements `commerce-js` (smaller stack) and `ecommerce-ui` (patterns).

## Layer 4: Anti-Patterns

- Client-side Storefront calls exposing tokens — server loaders only.
- Fighting Shopify checkout — use it; customize via branding settings.
- Missing B2B gating when Catalog configured — leaks pricing.
