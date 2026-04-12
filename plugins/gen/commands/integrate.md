---
description: "Scaffold third-party integration. Adds env vars, auth pattern, webhook endpoint, client helper. Supports HubSpot, Stripe, Shopify, Supabase, Notion, Airtable, Slack, Discord, Salesforce, Pipedrive, Google Workspace, Iconify, and more."
argument-hint: "<service> [--pattern <pattern>]"
allowed-tools: Read, Write, Edit, Bash
recommended-model: sonnet-4-6
---

# /gen:integrate

v3.15. One-command third-party integration.

## Examples

```bash
/gen:integrate hubspot --pattern cms       # HubSpot CMS modules
/gen:integrate hubspot --pattern crm       # CRM objects + associations
/gen:integrate notion --pattern data-source
/gen:integrate airtable --pattern cms
/gen:integrate slack --pattern webhook
/gen:integrate salesforce
/gen:integrate iconify
/gen:integrate framer --pattern migrate
```

## Flow

1. Read service + pattern
2. Add required env vars to `.env.example`
3. Scaffold auth helper (OAuth, API key, etc.)
4. Scaffold webhook endpoint via `/gen:api webhook-<service>` if applicable
5. Generate example usage file in `lib/<service>/`
6. Add docs/INTEGRATIONS.md entry
7. Ledger: `integration-configured`

## See also

- `skills/hubspot-cms/SKILL.md`, `skills/hubspot-crm-objects/SKILL.md`, `skills/hubspot-integration/SKILL.md`
- `skills/supabase-*/SKILL.md` (prefer `/gen:supabase` for Supabase)
- `skills/n8n-workflows/SKILL.md` (prefer `/gen:workflow n8n` for n8n)
- `skills/integrations-misc/SKILL.md` — Notion, Airtable, Slack, Discord, Salesforce, Pipedrive, etc.
