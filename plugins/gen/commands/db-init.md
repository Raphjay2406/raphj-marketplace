---
description: "Initialize database + schema from PLAN.md content model. Subcommands: init | migrate | seed | studio. Chooses ORM (Prisma/Drizzle/Payload/Supabase SQL)."
argument-hint: "init [--orm prisma|drizzle|payload|supabase] | migrate | seed | studio"
allowed-tools: Read, Write, Edit, Bash
recommended-model: sonnet-4-6
---

# /gen:db-init

v3.6 DB setup. See `skills/db-schema-from-content/SKILL.md`.

## `init`

1. Scan PLAN.md for content model mentions
2. Propose ORM based on project stack:
   - Next.js / Node → Prisma default
   - Edge-first → Drizzle
   - CMS-heavy → Payload
   - Supabase selected → Supabase SQL migrations
3. Generate schema file
4. Generate initial migration
5. Generate seed data (dev only)
6. Add `DATABASE_URL` to `.env.example`
7. Document at `docs/DB.md`

## `migrate`

Detects content-model changes; generates next migration file. Does NOT auto-apply (user runs `npx prisma migrate deploy` or equivalent).

## `seed`

Runs seed script (dev only; gated by `NODE_ENV !== 'production'`).

## `studio`

Opens ORM studio (Prisma Studio, Drizzle Kit, Payload Admin, Supabase Studio).

## Anti-patterns

- ❌ `migrate` in production without dry-run
- ❌ Seeding prod DB (script gates; don't remove)
- ❌ Manual schema edits after generation — use migrations
