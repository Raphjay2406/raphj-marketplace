---
name: hubspot-crm-objects
description: HubSpot CRM object integration beyond contacts — Deals, Companies, Tickets, Products, Line Items, Quotes, Custom Objects. Associations (contact↔company↔deal) + lifecycle automation hooks.
tier: domain
triggers: hubspot-crm, hubspot-deals, hubspot-companies, hubspot-objects, hubspot-associations
version: 0.1.0
---

# HubSpot CRM Objects

Full-fidelity HubSpot CRM integration beyond basic contact forms.

## Layer 1 — Objects covered

- **Contacts** (existing hubspot-integration skill)
- **Companies** — B2B account tracking
- **Deals** — sales pipeline stages
- **Tickets** — support + service flows
- **Products** — product catalog
- **Line Items** — products in deals/quotes
- **Quotes** — sales document generation
- **Custom Objects** (Enterprise) — domain-specific entities

## Layer 2 — Auth

OAuth 2.0 Private App or OAuth App. Private Apps (recommended) have simpler auth:

```ts
const hubspot = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
```

## Layer 3 — Patterns per object

### Deal creation on form submit

```ts
// app/api/demo-request/route.ts
export async function POST(req: Request) {
  const { email, company, budget } = await req.json();

  // Create contact
  const contact = await hubspot.crm.contacts.basicApi.create({
    properties: { email, company_name: company },
  });

  // Create company (or find existing by domain)
  const companyObj = await hubspot.crm.companies.basicApi.create({
    properties: { name: company, domain: email.split('@')[1] },
  });

  // Associate contact ↔ company
  await hubspot.crm.associations.v4.basicApi.create(
    'contacts', contact.id, 'companies', companyObj.id, [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 1 }]
  );

  // Create deal in "Demo Requested" stage
  const deal = await hubspot.crm.deals.basicApi.create({
    properties: {
      dealname: `${company} — Demo`,
      dealstage: 'demo_requested',
      amount: budget,
      pipeline: 'default',
    },
  });

  // Associate deal → contact + company
  await Promise.all([
    hubspot.crm.associations.v4.basicApi.create('deals', deal.id, 'contacts', contact.id, [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]),
    hubspot.crm.associations.v4.basicApi.create('deals', deal.id, 'companies', companyObj.id, [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 5 }]),
  ]);

  return Response.json({ success: true });
}
```

### Ticket from support form

Similar pattern with `hubspot.crm.tickets`.

### Product catalog sync from DB

```ts
const products = await db.product.findMany();
for (const p of products) {
  await hubspot.crm.products.basicApi.upsert({
    properties: { name: p.title, price: p.price, description: p.description },
    idProperty: 'sku',
    id: p.sku,
  });
}
```

Schedule via Vercel Cron or n8n workflow.

## Layer 4 — Association types

HubSpot has predefined + custom association types. Common:

| From → To | Type ID |
|---|---|
| contact → company | 1 |
| company → contact | 2 |
| deal → contact | 3 |
| contact → deal | 4 |
| deal → company | 5 |
| company → deal | 6 |

Use `/gen:hubspot assocs list` to view all.

## Layer 5 — Rate limits

- 100 req / 10s per private app
- 250k / day (Enterprise) / 40k (Marketing Pro) / 10k (Starter)

Implement client-side token-bucket rate limiter; batch where possible via batch APIs.

## Layer 6 — Integration

- `/gen:api webhook-hubspot` scaffolds incoming webhook (OAuth sig v3)
- `/gen:hubspot sync` scheduled DB ↔ HubSpot sync job
- Env: `HUBSPOT_ACCESS_TOKEN`
- Ledger: `hubspot-object-created` / `hubspot-sync-ran`

## Layer 7 — Anti-patterns

- ❌ Creating duplicates — use `idProperty` for upsert
- ❌ Rate-limit ignorance — batch + throttle
- ❌ No association — orphan objects confuse CRM users
- ❌ Syncing PII to HubSpot without consent — GDPR exposure
- ❌ Storing HUBSPOT_ACCESS_TOKEN in client code — server-side only
