---
name: rag-pipeline-author
id: genorah/rag-pipeline-author
version: 4.0.0
channel: stable
tier: worker
description: Scaffolds RAG pipeline with Supabase pgvector, embedding generation, and retrieval-augmented generation routes.
capabilities:
  - id: author-rag-pipeline
    input: RAGSpec
    output: RAGPipeline
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: ai-feature
---

# RAG Pipeline Author

## Role

Scaffolds RAG pipeline with Supabase pgvector, embedding generation, and retrieval-augmented generation routes.

## Input Contract

RAGSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: RAG pipeline files with vector store config, embedding routes, and retrieval logic
- `verdicts`: validation results from supabase-vector, ai-pipeline-features
- `followups`: []

## Protocol

1. Receive `RAGSpec` from wave-director — includes `dnaAnchor`, `supabaseProject`, `embeddingModel`, `chunkSize`, `topK`
2. Scaffold Supabase pgvector table via SQL migration:

```sql
create extension if not exists vector;
create table documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(1536)
);
create index on documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);
```

3. Scaffold embedding ingestion route `app/api/ingest/route.ts`:

```typescript
import { embed } from "ai";
import { createVercelAIGateway } from "@ai-sdk/vercel";
import { createClient } from "@supabase/supabase-js";

const gateway = createVercelAIGateway();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  const { content, metadata } = await req.json();
  const { embedding } = await embed({ model: gateway("openai/text-embedding-3-small"), value: content });
  await supabase.from("documents").insert({ content, metadata, embedding });
  return Response.json({ ok: true });
}
```

4. Scaffold retrieval + generation route `app/api/rag/route.ts`:

```typescript
import { embed, streamText } from "ai";
import { createVercelAIGateway } from "@ai-sdk/vercel";

const gateway = createVercelAIGateway();

export async function POST(req: Request) {
  const { query, messages } = await req.json();
  const { embedding } = await embed({ model: gateway("openai/text-embedding-3-small"), value: query });
  const { data: chunks } = await supabase.rpc("match_documents", { query_embedding: embedding, match_count: topK });
  const context = chunks?.map((c: { content: string }) => c.content).join("\n\n") ?? "";
  const result = streamText({
    model: gateway(embeddingModel),
    system: `Answer using only this context:\n${context}`,
    messages,
  });
  return result.toUIMessageStreamResponse();
}
```

5. Validate with `supabase-vector` (RLS policy check, index type, embedding dimension match)
6. Return `Result<RAGPipeline>` envelope

## Skills Invoked

- `supabase-vector` — pgvector schema, ivfflat index, match_documents RPC pattern
- `ai-pipeline-features` — embedding model selection, chunk sizing, retrieval topK tuning
- `streaming-pipeline-events` — AG-UI event emission during scaffold

## Followups

Emits `pipeline-ready` event to wave-director with artifact paths and SQL migration file.
