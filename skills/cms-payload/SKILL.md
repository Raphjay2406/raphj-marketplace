---
name: cms-payload
tier: domain
description: "Payload 3 integration (Next-native): collection generators from DNA + emotional arc, Lexical editor with DNA tokens, Local API for build-time fetch, access control, Postgres-backed."
triggers: ["payload", "payload cms", "payload 3", "headless cms", "lexical editor", "postgres cms", "payload collections"]
used_by: ["content-specialist", "builder", "start-project"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Payload

Payload 3 runs inside Next.js (no separate backend), stores in Postgres, and exposes a Local API for zero-network content fetch during build. For projects that need strict data sovereignty, type-safe content, or co-located stack, Payload edges out Sanity.

### When to Use

- Data must self-host (compliance, EU data residency).
- Project is strictly Next.js (Payload 3 is Next-first; Astro adapter exists but less polished).
- Team wants type-safe content (collections → auto-generated TS types).
- Complex access control (role-based field-level permissions).

### When NOT to Use

- Project uses Astro (Sanity is better supported).
- Client has a dedicated content team expecting Sanity's polished Studio UX.
- Very simple content model (<3 collections — inline MDX is faster).

## Layer 2: Technical Spec

### Install and init

```bash
pnpm dlx create-payload-app@latest --template website --db postgres --tailwind
```

Payload lives at `/admin` route, sharing the same Next.js app.

### Collection generation from emotional arc

Per beat type, Payload collection with typed fields:

```ts
// collections/Sections.ts
import { CollectionConfig } from 'payload';

export const HeroSection: CollectionConfig = {
  slug: 'hero-section',
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'subhead', type: 'textarea' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaHref', type: 'text' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'videoLoop', type: 'upload', relationTo: 'media', required: false },
  ],
};
```

Generator reads `MASTER-PLAN.md` + `CONTENT.md`, produces N collection files.

### Local API (build-time, zero network)

```tsx
// app/page.tsx
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function Page() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'hero-section',
    limit: 1,
  });
  return <Hero {...docs[0]} />;
}
```

No network roundtrip in RSC — Payload shares the Next process.

### Lexical editor with DNA tokens

```ts
// lexical config in collection field
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Custom DNA-themed blocks
      BlocksFeature({
        blocks: [
          { slug: 'accent-callout', labels: { singular: 'Accent Callout' },
            fields: [{ name: 'text', type: 'text' }],
            graphql: { singleName: 'AccentCallout' } }
        ]
      })
    ],
  }),
},
```

### Access control

```ts
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'editor',
    update: ({ req: { user }, data }) =>
      user?.role === 'admin' || (user?.role === 'editor' && data?.author === user.id),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [/* ... */],
};
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| db | postgres, sqlite | — | enum | HARD (mongo deprecated for v3) |
| collections_generated | 1 | ∞ | count | per beat |
| draft_preview_required | true | true | bool | HARD |
| secret_env_var | PAYLOAD_SECRET | — | string | HARD |

## Layer 3: Integration Context

- **`/gen:cms-init payload`** — scaffolds Payload, generates collections, writes env vars.
- **Content-specialist agent** — Local API queries during RSC render.
- **Types** — `pnpm payload generate:types` creates `payload-types.ts`; import for typed content.
- **Database** — Postgres preferred (Vercel Postgres via marketplace, Neon, Supabase all work).
- **Deployment** — deploys as normal Next.js app; Payload shares the serverless runtime.

## Layer 4: Anti-Patterns

- ❌ **MongoDB on Payload 3** — deprecated; migrate to Postgres.
- ❌ **Separate Payload server** — v3 eliminates this; embed in Next.
- ❌ **Fetching via REST from same app** — use Local API, saves latency + deserialization.
- ❌ **Skipping `generate:types`** — no type safety on content = silent breakage.
- ❌ **Letting editors access prod without draft preview** — wire `_status: 'draft'` flow.
- ❌ **Storing media in DB** — use S3/Vercel Blob via `@payloadcms/storage-*` plugins.
