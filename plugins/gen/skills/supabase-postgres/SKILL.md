---
name: supabase-postgres
description: Supabase Postgres patterns — schema gen from content model, migrations, seeders, indexes, full-text search (tsvector), database functions, triggers. Chains with db-schema-from-content.
tier: domain
triggers: supabase-postgres, supabase-db, migrations-supabase, pgvector, tsvector, db-functions
version: 0.1.0
---

# Supabase Postgres

## Layer 1 — Migrations

Managed via `supabase/migrations/<timestamp>_<name>.sql`:

```sql
-- 20260412000000_init.sql
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_published ON public.posts (published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_posts_author ON public.posts (author_id);
CREATE INDEX idx_posts_slug ON public.posts (slug);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## Layer 2 — Apply migrations

```bash
# Local dev (runs against local Supabase stack)
supabase start
supabase db push

# Production
supabase db push --linked
```

## Layer 3 — Seeders

`supabase/seed.sql` — runs after migrations on `supabase db reset`:

```sql
INSERT INTO public.authors (id, name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Jane Roaster', 'Owner'),
  ('22222222-2222-2222-2222-222222222222', 'Sam Barista', 'Contributor');

INSERT INTO public.posts (title, slug, body, author_id, published_at) VALUES
  ('Single-origin Ethiopian arrivals', 'ethiopian-arrivals', '...', '11111111-1111-1111-1111-111111111111', now());
```

## Layer 4 — Full-text search

```sql
ALTER TABLE public.posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

CREATE INDEX idx_posts_search ON public.posts USING GIN (search_vector);
```

Query:

```ts
const { data } = await supabase
  .from('posts')
  .select('*')
  .textSearch('search_vector', 'coffee & ethiopian', { config: 'english' });
```

## Layer 5 — pgvector (AI / embeddings)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.posts ADD COLUMN embedding vector(1536);

CREATE INDEX idx_posts_embedding ON public.posts
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Query nearest-neighbor:

```ts
const { data } = await supabase.rpc('match_posts', {
  query_embedding: userEmbedding,
  match_count: 5,
});
```

With Postgres function:

```sql
CREATE FUNCTION match_posts(query_embedding vector(1536), match_count int)
RETURNS TABLE (id uuid, title text, similarity float)
LANGUAGE sql AS $$
  SELECT id, title, 1 - (embedding <=> query_embedding) as similarity
  FROM public.posts
  WHERE embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

## Layer 6 — Integration

- `/gen:db-init --orm supabase` scaffolds migrations + seed
- `/gen:supabase-migrate` generates next migration file from schema changes
- Chains with `skills/supabase-rls/SKILL.md` for RLS policies
- Chains with `skills/supabase-vector/SKILL.md` for pgvector patterns

## Layer 7 — Anti-patterns

- ❌ Editing applied migrations — break prod; new migration instead
- ❌ Missing `ON DELETE` cascade specification — orphan rows accumulate
- ❌ tsvector without `STORED` — computed per query (slow)
- ❌ pgvector ivfflat without `ANALYZE` after bulk load — bad index stats
- ❌ Seed data in migrations — seed.sql is the place; migrations are schema-only
