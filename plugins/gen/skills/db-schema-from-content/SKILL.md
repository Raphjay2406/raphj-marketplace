---
name: db-schema-from-content
description: Derive database schema from PLAN.md content model + CMS schemas. Emits Prisma, Drizzle, Payload, or Supabase SQL migrations with relationships, indexes, RLS, seed data.
tier: domain
triggers: db-schema, prisma, drizzle, payload, supabase-migration, content-model, seed-data
version: 0.1.0
---

# Database Schema from Content

Reads content model declarations in PLAN.md + any CMS-configured schemas, emits framework-specific schema files + migration scripts + seed data.

## Layer 1 — When to use

During `/gen:db-init` or `/gen:plan` if content model detected. Re-runs safely; schema is additive with migrations for changes.

## Layer 2 — Content model detection

Automatic model inference from PLAN.md section language:

| Section mentions | → Model |
|---|---|
| "blog posts" | Post { id, title, slug, body, publishedAt, authorId } |
| "case studies" | CaseStudy { id, title, client, outcome, body, publishedAt } |
| "team members" / "authors" | Author { id, name, role, bio, avatar } |
| "testimonials" | Testimonial { id, quote, author, authorRole, company, publishedAt } |
| "pricing tiers" | PricingTier { id, name, price, interval, features[], featured } |
| "products" | Product { id, title, slug, price, currency, images[], inventory } |
| "FAQ" | FAQ { id, question, answer, category, order } |
| "events" | Event { id, title, startAt, endAt, location, description } |
| "jobs" | JobListing { id, title, department, location, remote, description, postedAt } |

Relations auto-inferred: Post.authorId → Author.id, etc.

Every model gets: `id` (cuid or uuid), `createdAt`, `updatedAt`, `publishedAt` (nullable = draft).

## Layer 3 — Framework output

### Prisma (default for Node TypeScript projects)

```prisma
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql", url = env("DATABASE_URL") }

model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  body        String   @db.Text
  publishedAt DateTime?
  authorId    String
  author      Author   @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([publishedAt])
  @@index([authorId])
}
```

### Drizzle (for edge-compatibility)

```ts
// db/schema.ts
import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const posts = pgTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  body: text('body').notNull(),
  publishedAt: timestamp('published_at'),
  authorId: text('author_id').notNull().references(() => authors.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  publishedIdx: index('posts_published_idx').on(t.publishedAt),
  authorIdx: index('posts_author_idx').on(t.authorId),
}));
```

### Payload (headless CMS with DB)

```ts
// collections/Posts.ts
import { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'body', type: 'richText', required: true },
    { name: 'publishedAt', type: 'date' },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
  ],
};
```

### Supabase SQL migration

```sql
-- supabase/migrations/20260412000000_posts.sql
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  published_at timestamptz,
  author_id uuid NOT NULL REFERENCES public.authors(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_published ON public.posts (published_at);
CREATE INDEX idx_posts_author ON public.posts (author_id);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON public.posts FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Authors can manage own posts"
  ON public.posts FOR ALL USING (author_id = auth.uid());
```

## Layer 4 — Seed data generation

For dev: 3-5 example entries per model with realistic content. Uses `faker-js` for names/dates; DNA-archetype voice for copy.

```ts
// prisma/seed.ts
const posts = await Promise.all([
  prisma.post.create({ data: { title: 'Understanding Bean Origin', ... } }),
  // ...
]);
```

## Layer 5 — Integration

- `/gen:db-init` picks ORM, generates schema, runs initial migration
- `/gen:db-migrate` on content model changes (adds new fields/models)
- CMS skill (Sanity/Payload) integrates: CMS is source of truth for content, DB shadows for perf
- Manifest: schema file path + last migration timestamp recorded

## Layer 6 — Anti-patterns

- ❌ Hand-editing generated schema — next generation overwrites; use migrations
- ❌ Dropping columns in production without rollback plan — use deprecation flag first
- ❌ Missing indexes on foreign keys — perf landmine
- ❌ Enabling RLS without policies — locks everyone out
- ❌ Seeding prod DB accidentally — seed scripts gate on NODE_ENV
