---
description: "Scaffold API route from template. Templates: auth-* | crud-* | webhook-* | upload-signed-url | rate-limited | ai-stream. Emits route + Zod schema + test + OpenAPI entry + env var additions."
argument-hint: "<template> [--path <route-path>] [--docs]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: sonnet-4-6
---

# /gen:api

v3.6 API route scaffolder. See `skills/api-routes/SKILL.md` for full template list.

## Usage

```bash
/gen:api auth-email-password --path /api/auth
/gen:api webhook-stripe --path /api/webhooks/stripe
/gen:api crud-list --path /api/posts
/gen:api ai-stream --path /api/chat
```

## Outputs per invocation

1. Route file at `app/<path>/route.ts` (or equivalent per framework)
2. Zod schema at `lib/schemas/<resource>.ts`
3. Test at `tests/api/<path>.test.ts`
4. OpenAPI entry in `docs/api/openapi.json`
5. Env vars added to `.env.example` if template requires (e.g. STRIPE_WEBHOOK_SECRET)
6. Rate-limit config added if template defaults to rate-limited

## Subcommand

`/gen:api docs` — rebuild OpenAPI spec from all scaffolded routes.

## Anti-patterns

- ❌ Scaffolding then removing Zod validation — you lose typing + error consistency
- ❌ Public write endpoints without rate-limit — use `rate-limited` wrapper
- ❌ Webhook without signature verification — always present in template; don't remove
