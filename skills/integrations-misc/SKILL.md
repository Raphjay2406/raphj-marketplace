---
name: integrations-misc
description: Grab-bag of integration patterns — Notion, Airtable, Framer import, Webflow/WordPress migration, Iconify, Slack/Discord notifications, Salesforce/Pipedrive, Google Workspace, Zapier/Make as n8n fallback.
tier: domain
triggers: notion-api, airtable, framer-migration, webflow-migration, iconify, slack, discord, salesforce, pipedrive, google-workspace, zapier, make
version: 0.1.0
---

# Misc Integrations

Shorthand patterns for common app integrations that don't warrant full dedicated skills.

## Layer 1 — Notion as data source

```ts
import { Client } from '@notionhq/client';
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const db = await notion.databases.query({ database_id: DB_ID });
// Parse Notion blocks → MDX via @notionhq/client helpers
```

Use case: marketing team edits in Notion; site rebuilds on webhook.

## Layer 2 — Airtable as CMS

```ts
import Airtable from 'airtable';
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app...');

const records = await base('Products').select({ view: 'Published' }).all();
```

Rate limit: 5 req/s per base. Use `view` filtering server-side, not client.

## Layer 3 — Framer migration

Framer exports HTML/CSS/JS. Genorah migration:
1. Crawl exported site
2. Extract sections → Genorah section components
3. Preserve DNA from Framer theme
4. Re-scaffold in chosen framework (Next/Astro/etc.)

`/gen:migrate-from framer <path>` orchestrates.

## Layer 4 — Webflow / WordPress migration

Similar to Framer — crawl + parse + map to Genorah sections. WordPress requires REST API auth; Webflow has REST API for structured data.

## Layer 5 — Iconify

20+ icon sets via one API:

```tsx
import { Icon } from '@iconify/react';
<Icon icon="lucide:arrow-right" />
<Icon icon="mdi:home" />
<Icon icon="tabler:user" />
```

200k+ icons; replaces per-lib Lucide/Heroicons/Phosphor choice in most cases. Falls back to per-lib when icon-system skill's design language demands consistency.

## Layer 6 — Slack notifications

```ts
await fetch(process.env.SLACK_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: `New signup: ${email}`,
    blocks: [/* rich formatting */],
  }),
});
```

For bidirectional: Slack API + Bolt framework (separate app).

## Layer 7 — Discord notifications

```ts
await fetch(process.env.DISCORD_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: `New signup: ${email}` }),
});
```

## Layer 8 — Salesforce

OAuth 2.0 or Connected App with refresh token. Common ops: Lead/Contact/Opportunity create.

```ts
import jsforce from 'jsforce';
const conn = new jsforce.Connection({ instanceUrl, accessToken });
await conn.sobject('Lead').create({ FirstName, LastName, Email, Company });
```

Rate limit: 15k API calls/day on Professional, 100k on Enterprise.

## Layer 9 — Pipedrive

Simpler REST API:

```ts
await fetch(`https://api.pipedrive.com/v1/persons?api_token=${PIPEDRIVE_TOKEN}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: `${firstName} ${lastName}`, email, phone }),
});
```

## Layer 10 — Google Workspace

Docs/Sheets via Google APIs:

```ts
import { google } from 'googleapis';
const auth = new google.auth.JWT(serviceAccountEmail, null, serviceAccountKey, ['https://www.googleapis.com/auth/spreadsheets']);
const sheets = google.sheets({ version: 'v4', auth });
await sheets.spreadsheets.values.append({
  spreadsheetId,
  range: 'Sheet1',
  valueInputOption: 'USER_ENTERED',
  requestBody: { values: [[new Date(), email, name]] },
});
```

## Layer 11 — Zapier / Make as simpler n8n

For simple automations (< 10 nodes), Zapier / Make via webhook is easier:

```ts
await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
  method: 'POST',
  body: JSON.stringify({ email, event: 'signup' }),
});
```

User wires Zap / Scenario in respective platform.

## Layer 12 — Integration

- Each pattern: `/gen:integrate <service>` scaffolds auth + env vars + pattern code
- Env var additions auto-added to `.env.example`
- Webhook endpoints generated via `/gen:api webhook-generic`
- Ledger: `integration-configured`

## Layer 13 — Anti-patterns

- ❌ API keys in client code — always server-side
- ❌ No rate-limit handling — surprise 429s
- ❌ Hard-coding IDs (Notion page, Airtable base) — config via env
- ❌ Webhook endpoint without signature verification — spoof surface
- ❌ Zapier for high-volume — cost + rate limits; use n8n self-hosted
