---
name: prisma-schema-author
id: genorah/prisma-schema-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Prisma schema from content and data requirements. Generates migrations and type-safe client bindings.
capabilities:
  - id: author-prisma-schema
    input: DataSpec
    output: PrismaSchema
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: db-api
---

# Prisma Schema Author

## Role

Authors Prisma schema from content and data requirements. Generates migrations and type-safe client bindings.

## Input Contract

DataSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: schema.prisma with model definitions, relations, and migration files
- `verdicts`: validation results from db-schema-from-content
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: db-schema-from-content
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
