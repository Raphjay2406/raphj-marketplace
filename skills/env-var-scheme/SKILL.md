---
name: env-var-scheme
description: Environment variable organization — .env.example + .env.local + vercel.ts bindings + Zod runtime validation + secret rotation playbook. Categorizes public/server/edge/build-time.
tier: domain
triggers: env, environment-variables, dotenv, vercel-env, secret-rotation, config
version: 0.1.0
---

# Environment Variable Scheme

Single pattern across projects. No scattered `process.env` usage; everything validated + typed.

## Layer 1 — When to use

Every project from `/gen:start-project`. Applied to new env vars as features land.

## Layer 2 — Categorization

| Category | Prefix | Usage |
|---|---|---|
| Public | `NEXT_PUBLIC_*` / `VITE_*` / `PUBLIC_*` | Bundled into client JS; visible to users |
| Server | (no prefix) | Server-only; never bundled |
| Edge | (marked in Zod) | Available in middleware/edge functions |
| Build-time | (marked in Zod) | Only during build; not at runtime |

## Layer 3 — Files scaffolded

### `.env.example` (committed)

```
# ─ Required ─
DATABASE_URL=                     # Postgres connection string
NEXT_PUBLIC_SITE_URL=             # Public URL e.g. https://example.com

# ─ Auth ─
AUTH_SECRET=                      # 32-byte random
GOOGLE_CLIENT_ID=                 # optional
GOOGLE_CLIENT_SECRET=             # optional

# ─ AI / MCP ─
ANTHROPIC_API_KEY=                # Claude API
MESHY_API_KEY=                    # 3D gen; optional
FLUX_API_KEY=                     # Image gen; optional

# ─ Email ─
RESEND_API_KEY=                   # transactional email

# ─ Monitoring ─
SENTRY_DSN=                       # optional
VERCEL_ANALYTICS_ID=              # auto-populated on Vercel
```

### `.env.local` (gitignored; user fills)

### `lib/env.ts` (runtime validation)

```ts
import { z } from 'zod';

const server = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  MESHY_API_KEY: z.string().optional(),
  FLUX_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

const client = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  MESHY_API_KEY: process.env.MESHY_API_KEY,
  FLUX_API_KEY: process.env.FLUX_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

const isServer = typeof window === 'undefined';
const merged = isServer ? server.merge(client) : client;

const parsed = merged.safeParse(processEnv);
if (!parsed.success) {
  console.error('❌ Invalid env:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
```

### `vercel.ts` (preferred over vercel.json)

```ts
import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  buildCommand: 'npm run build',
  framework: 'nextjs',
  // env var bindings handled via `vercel env add` CLI, not config
};
```

### `docs/ENVIRONMENT.md` (committed)

Explains every var: purpose, where to obtain, rotation cadence.

## Layer 4 — Secret rotation

Per-var rotation cadence documented:

| Secret | Rotation cadence | Impact |
|---|---|---|
| AUTH_SECRET | 90 days or on breach | All sessions invalidated |
| ANTHROPIC_API_KEY | On team departure | API access revoked |
| Stripe secret | On breach only | Webhooks need re-config |
| OAuth client secrets | 365 days or on breach | Users re-consent |

Rotation playbook `docs/secret-rotation.md` with per-secret steps.

## Layer 5 — Integration

- `/gen:api` adds required env vars to `.env.example` per template
- `/gen:db-init` adds `DATABASE_URL` when schema generated
- `/gen:deploy` runs `vercel env pull` to sync
- Pre-push hook scans staged files for accidental env var leakage (PII check in `dna-compliance-check.sh` extends)

## Layer 6 — Anti-patterns

- ❌ `process.env.X` directly in app code — use `env.X` from validated `lib/env.ts`
- ❌ Secrets committed to git — gitignored `.env.local`; `.env.example` has placeholders only
- ❌ Public-prefix for server secrets — leaked to client bundle
- ❌ No rotation for OAuth secrets — silent long-tail breach surface
- ❌ Weak AUTH_SECRET (<32 bytes) — Zod rejects at boot
