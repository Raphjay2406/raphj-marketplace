---
name: n8n-workflows
description: Generate n8n workflow JSON from natural-language intent. Common patterns (Stripe→HubSpot→Slack, form→Airtable→email, Shopify→reorder). Importable via n8n UI or CLI.
tier: domain
triggers: n8n, workflow-automation, n8n-nodes, stripe-hubspot, form-automation
version: 0.1.0
---

# n8n Workflow Generator

n8n runs separately (self-hosted or n8n Cloud). Genorah generates workflow JSON files the user imports.

## Layer 1 — When to use

User describes cross-app automation. Examples:
- "When Stripe charge succeeds, create HubSpot contact + send welcome email + notify Slack"
- "When form submits, add to Airtable + AI-summarize + post to Notion"
- "New blog post → social posts via Buffer + newsletter draft + team Slack"
- "Low inventory → reorder PO to supplier + ops Slack channel"

## Layer 2 — Architecture

```
Genorah generates:
  n8n/workflows/<flow-name>.json

User imports:
  n8n → Workflows → Import → select JSON file
  OR
  n8n-cli import:workflow --separate --input=./n8n/workflows/
```

Credentials configured in n8n UI (OAuth, API keys, etc.); workflow JSON references by credential name, not by secret.

## Layer 3 — Generator input

```yaml
name: "Stripe payment success → HubSpot + Slack"
trigger:
  type: webhook
  source: stripe
  event: charge.succeeded
steps:
  - app: hubspot
    action: create-contact
    from: $payload.customer.email
  - app: resend
    action: send-email
    template: welcome
    to: $payload.customer.email
  - app: slack
    action: post-message
    channel: '#sales'
    text: "New customer: {{ $payload.customer.email }}"
on_error:
  - app: slack
    channel: '#alerts'
    text: "Workflow failed: {{ $error.message }}"
```

Genorah emits corresponding n8n workflow JSON with proper node structure.

## Layer 4 — Output JSON structure

```json
{
  "name": "Stripe payment success → HubSpot + Slack",
  "nodes": [
    {
      "parameters": { "path": "stripe-webhook", "httpMethod": "POST" },
      "id": "webhook-node-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "email": "={{ $json.customer.email }}"
      },
      "id": "hubspot-node-2",
      "name": "HubSpot",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 2,
      "position": [460, 300],
      "credentials": {
        "hubspotApi": { "id": "{{ user-configured }}", "name": "HubSpot account" }
      }
    }
    // ... more nodes
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "HubSpot", "type": "main", "index": 0 }]] }
    // ... more
  },
  "settings": { "executionOrder": "v1" },
  "meta": { "templateCredsSetupCompleted": false }
}
```

## Layer 5 — Core node library

| Node | Purpose |
|---|---|
| Webhook | Incoming trigger |
| HTTP Request | Generic API call |
| IF / Switch | Branching |
| Set | Data transformation |
| Merge | Parallel flows |
| Wait | Scheduled delays |
| Error Trigger | Error handling |
| Schedule | Cron-like triggers |
| Code | JavaScript for complex logic |

App nodes: Stripe, HubSpot, Slack, Shopify, Airtable, Notion, Google Workspace, etc. Community nodes (1000+) for less common apps.

## Layer 6 — Patterns

### Pattern 1: Stripe payment success

Trigger: Stripe webhook (charge.succeeded)
Steps: HubSpot contact create → Resend welcome email → Slack notify sales
Error handler: Slack #alerts

### Pattern 2: Form → CMS → Social

Trigger: Form webhook (Typeform / custom)
Steps: Airtable row create → OpenAI summarize → Notion page → Slack team

### Pattern 3: E-commerce reorder

Trigger: Shopify webhook (inventory low)
Steps: Email supplier PO template → Slack ops → Airtable PO log

### Pattern 4: Blog publish distribution

Trigger: Webhook (CMS publish event)
Steps: Generate social copy (OpenAI) → Buffer schedule → Newsletter queue → Team Slack

## Layer 7 — Version pinning

n8n workflow JSON format evolves. Genorah pins to n8n 1.x format (stable as of 2025-2026). v2.x may require regeneration.

Include `meta.genorah_generated_for: "n8n@1.62"` in output for traceability.

## Layer 8 — Integration

- `/gen:workflow n8n <description>` — generates JSON from description
- `/gen:workflow n8n list` — shows current project workflows
- Ledger: `n8n-workflow-generated`
- Integration with `/gen:api webhook-*` — Genorah scaffolds webhook endpoint, n8n consumes it

## Layer 9 — Anti-patterns

- ❌ Embedding secrets in workflow JSON — use credential references
- ❌ No error handler — silent failures
- ❌ Single giant workflow — split by concern for maintainability
- ❌ Hardcoded URLs — use env vars in n8n node configs
- ❌ Community nodes without maintenance check — some are abandoned
