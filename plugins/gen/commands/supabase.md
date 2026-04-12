---
description: "Supabase full-stack scaffolding. Subcommands: init | auth | rls | storage | realtime | function | vector."
argument-hint: "init | auth <pattern> | rls <table> | storage <bucket> | realtime <table> | function new <name> | vector <table>"
allowed-tools: Read, Write, Edit, Bash
recommended-model: sonnet-4-6
---

# /gen:supabase

v3.15. One-command scaffolding for Supabase subsystems.

## Subcommands

### `init`
Full-stack init: `supabase init` + anon/service env var wiring + middleware + server/client utils.

### `auth <pattern>`
Scaffold auth flow (email-password | oauth | magic-link | passkey).

### `rls <table>`
Generate RLS policy for table per chosen pattern (owner-only | public-read | multi-tenant).

### `storage <bucket>`
Bucket + RLS + upload pattern.

### `realtime <table>`
Enable realtime on table + generate subscription hook.

### `function new <name>`
Edge function scaffold.

### `vector <table>`
Add embedding column + nearest-neighbor function + index.

## See also

- `skills/supabase-auth/SKILL.md`
- `skills/supabase-postgres/SKILL.md`
- `skills/supabase-rls/SKILL.md`
- `skills/supabase-storage/SKILL.md`
- `skills/supabase-realtime/SKILL.md`
- `skills/supabase-edge-functions/SKILL.md`
- `skills/supabase-vector/SKILL.md`
