---
id: "genorah/rag-pipeline-author"
name: "rag-pipeline-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds RAG pipeline with Supabase pgvector, embedding generation, and retrieval-augmented generation routes"
source: "agents/workers/rag-pipeline-author.md"
tags: [agent, genorah, worker]
---

# rag-pipeline-author

> Scaffolds RAG pipeline with Supabase pgvector, embedding generation, and retrieval-augmented generation routes.

## Preview

# RAG Pipeline Author  ## Role  Scaffolds RAG pipeline with Supabase pgvector, embedding generation, and retrieval-augmented generation routes.  ## Input Contract  RAGSpec: task envelope received from

## Frontmatter

```yaml
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
```
