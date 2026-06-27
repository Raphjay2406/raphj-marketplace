---
id: "genorah/supabase-integration-author"
name: "supabase-integration-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Scaffolds Supabase integration: auth, Postgres schema, RLS policies, realtime subscriptions, and storage config"
source: "agents/workers/supabase-integration-author.md"
tags: [agent, genorah, worker]
---

# supabase-integration-author

> Scaffolds Supabase integration: auth, Postgres schema, RLS policies, realtime subscriptions, and storage config.

## Preview

# Supabase Integration Author  ## Role  Scaffolds Supabase integration: auth, Postgres schema, RLS policies, realtime subscriptions, and storage config.  ## Input Contract  IntegrationSpec: task envel

## Frontmatter

```yaml
name: supabase-integration-author
id: genorah/supabase-integration-author
version: 4.0.0
channel: stable
tier: worker
description: "Scaffolds Supabase integration: auth, Postgres schema, RLS policies, realtime subscriptions, and storage config."
capabilities:
  - id: author-supabase-integration
    input: IntegrationSpec
    output: SupabaseIntegration
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: integration
```
