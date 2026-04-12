---
name: api-key-rotation
description: API key rotation playbook per integration. Cadence, rotation steps, fallback-during-rotation, staged-dual-key pattern.
tier: domain
triggers: api-key-rotation, secret-rotation, key-lifecycle
version: 0.1.0
---

# API Key Rotation

## Layer 1 — Cadence

| Secret type | Cadence | Urgency trigger |
|---|---|---|
| AUTH_SECRET (JWT signing) | 90 days | Breach suspected; team departure |
| Stripe | On breach only | Unusual charges detected |
| OAuth client secrets | 365 days | Team departure |
| Service-specific API keys | 180 days | Team departure |
| Database passwords | 180 days | Employee separation |
| CI/deploy tokens | 90 days | Repository access changes |

## Layer 2 — Staged dual-key pattern

Avoid downtime during rotation:

```
1. Generate new key (key v2)
2. Update env vars to accept BOTH key v1 + key v2
3. Deploy
4. Update clients to send key v2
5. Wait until 0 key v1 usage (dashboard/logs)
6. Remove key v1 from env
7. Deploy
```

For JWT signing:

```ts
// Accept both during rotation window
const SECRETS = [CURRENT, PREVIOUS].filter(Boolean);
for (const secret of SECRETS) {
  try {
    return jwt.verify(token, secret);
  } catch { /* try next */ }
}
throw new Error('Invalid token');
```

## Layer 3 — Per-integration steps

### Stripe
1. Stripe Dashboard → Developers → API keys → Roll
2. Update env `STRIPE_SECRET_KEY` in all deploy targets
3. Update webhook endpoints (regenerate STRIPE_WEBHOOK_SECRET separately)
4. Monitor dashboard for failed charges

### HubSpot
Private App tokens: regenerate in app settings → update env → test.

### Supabase
Service role + anon keys: regenerate in project settings → restart services.

### OpenAI / Anthropic
Revoke in dashboard → issue new → update env → test.

## Layer 4 — Incident response (compromised key)

```
1. Revoke immediately in provider dashboard
2. Generate new key
3. Force-update in all environments
4. Audit logs for unauthorized usage
5. Rotate dependent secrets if chained
6. Incident write-up
```

## Layer 5 — Automation

```bash
# Scheduled rotation via CI
gh secret set ANTHROPIC_API_KEY --body="new-key" --env production
```

Or use Doppler / Infisical for centralized secret management.

## Layer 6 — Integration

- `/gen:security rotate <service>` runs guided rotation
- Ledger: `secret-rotated`
- Calendar reminders for quarterly rotations
- Post-rotation test via smoke test

## Layer 7 — Anti-patterns

- ❌ Rotating without staged dual-key — breaks in-flight requests
- ❌ No log audit after breach — don't know blast radius
- ❌ Rotating one key when pair is chained — incomplete
- ❌ No rotation schedule — secrets age silently
