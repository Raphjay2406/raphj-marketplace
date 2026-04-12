---
name: "server-driven-ui"
description: "JSON-schema → component tree renderer. CMS-authored pages beyond MDX: ordered blocks, typed props, DNA-themed atoms, hydration strategy per block."
tier: "domain"
triggers: "server driven ui, sdui, json schema ui, cms component tree, schema driven rendering"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Marketing team needs to author new page combinations without dev deploy.
- Content graph has stable primitives (Hero, FeatureGrid, CTA, Quote, Stats).
- Headless CMS (Sanity, Payload, Contentful) drives structure, not just copy.

### When NOT to Use

- Long-form editorial — use MDX.
- One-off bespoke marketing pages — direct TSX is faster.

## Layer 2: Example

```ts
// lib/sdui/schema.ts
import { z } from 'zod';

export const Block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('hero'), title: z.string(), cta: z.string().url(), media: z.string() }),
  z.object({ type: z.literal('feature-grid'), items: z.array(z.object({ title: z.string(), body: z.string() })).min(3).max(9) }),
  z.object({ type: z.literal('cta'), label: z.string(), href: z.string().url(), variant: z.enum(['primary','secondary']) }),
]);
export const Page = z.object({ blocks: z.array(Block).min(1) });

// components/sdui/Renderer.tsx
export function Renderer({ page }: { page: z.infer<typeof Page> }) {
  return page.blocks.map((b, i) => {
    switch (b.type) {
      case 'hero': return <Hero key={i} {...b} />;
      case 'feature-grid': return <FeatureGrid key={i} {...b} />;
      case 'cta': return <CTA key={i} {...b} />;
    }
  });
}
```

## Layer 3: Integration Context

- Block registry in `lib/sdui/blocks.ts` — each block exports `{ component, schema, defaultProps }`.
- Hydration strategy: static by default; per-block `clientBoundary: true` flag opts into hydration.
- DNA enforcement: each block must read tokens — no inline hex/px.
- CMS bridge: `cms-content-pipeline` skill exports its types to match Zod union.

## Layer 4: Anti-Patterns

- Free-form `props: any` blocks — defeats type safety; always discriminated union.
- Hydrating every block — kills LCP; hydrate only interactive leaves.
- Allowing arbitrary HTML in block props — XSS vector; sanitize via DOMPurify.
