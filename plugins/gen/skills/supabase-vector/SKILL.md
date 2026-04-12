---
name: supabase-vector
description: pgvector patterns for RAG + similarity search. Embedding storage, nearest-neighbor queries, ivfflat + hnsw index choice, hybrid search (vector + full-text).
tier: domain
triggers: supabase-vector, pgvector, rag, embeddings, nearest-neighbor, hybrid-search
version: 0.1.0
---

# Supabase Vector (pgvector)

## Layer 1 — Setup

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE docs ADD COLUMN embedding vector(1536);  -- OpenAI text-embedding-3-small dim
-- or 768 for many open-source models, 384 for small models
```

## Layer 2 — Index choice

```sql
-- ivfflat: good for <1M vectors, fast build
CREATE INDEX ON docs USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
-- Tune `lists` ≈ sqrt(rows). 10K rows → lists=100; 100K → 316; 1M → 1000

-- hnsw: better recall for >1M, slower build, more memory
CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);

-- Distance operators:
-- <-> euclidean
-- <=> cosine
-- <#> inner product
```

Always `ANALYZE` after bulk load:
```sql
ANALYZE docs;
```

## Layer 3 — Nearest-neighbor query

```sql
-- Server-side function for API use
CREATE FUNCTION match_docs(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 10
)
RETURNS TABLE (id uuid, content text, similarity float)
LANGUAGE sql STABLE AS $$
  SELECT id, content, 1 - (embedding <=> query_embedding) AS similarity
  FROM docs
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

Client:

```ts
const { data } = await supabase.rpc('match_docs', {
  query_embedding: await embed(userQuery),
  match_threshold: 0.75,
  match_count: 10,
});
```

## Layer 4 — Hybrid search (vector + FTS)

```sql
CREATE FUNCTION hybrid_search(
  query_text text,
  query_embedding vector(1536),
  match_count int DEFAULT 10,
  full_text_weight float DEFAULT 1,
  semantic_weight float DEFAULT 1,
  rrf_k int DEFAULT 50
)
RETURNS SETOF docs
LANGUAGE sql AS $$
  WITH full_text AS (
    SELECT id, row_number() OVER (ORDER BY ts_rank_cd(fts, websearch_to_tsquery(query_text)) DESC) AS rank
    FROM docs WHERE fts @@ websearch_to_tsquery(query_text) LIMIT match_count * 2
  ),
  semantic AS (
    SELECT id, row_number() OVER (ORDER BY embedding <=> query_embedding) AS rank
    FROM docs ORDER BY embedding <=> query_embedding LIMIT match_count * 2
  )
  SELECT docs.* FROM docs
  INNER JOIN (
    SELECT id, COALESCE(1.0 / (rrf_k + full_text.rank), 0) * full_text_weight +
               COALESCE(1.0 / (rrf_k + semantic.rank), 0) * semantic_weight AS score
    FROM full_text FULL OUTER JOIN semantic USING (id)
  ) scores USING (id)
  ORDER BY score DESC LIMIT match_count;
$$;
```

Reciprocal Rank Fusion (RRF) combines FTS + semantic intelligently.

## Layer 5 — Embedding generation pipeline

```ts
// lib/embed.ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

export async function embedText(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text.slice(0, 8000),
  });
  return embedding;
}

// After insert, compute + store embedding
async function indexDoc(doc: Doc) {
  const embedding = await embedText(`${doc.title}\n\n${doc.content}`);
  await supabase.from('docs').update({ embedding }).eq('id', doc.id);
}
```

## Layer 6 — Integration

- Chains with db-schema-from-content (adds embedding column)
- RAG pattern in ai-chat-depth skill consumes match_docs function
- Background job (Supabase Edge Function or Vercel Cron) re-embeds on content change

## Layer 7 — Anti-patterns

- ❌ Embedding on main request path — 100-500ms latency
- ❌ No `ANALYZE` after bulk insert — query planner uses bad stats
- ❌ Wrong distance operator for model — OpenAI normalized embeddings use cosine (`<=>`)
- ❌ Tiny `match_threshold` (0.1) — returns everything
- ❌ hnsw on rarely-updated data — build time wasted vs ivfflat
