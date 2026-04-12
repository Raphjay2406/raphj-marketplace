---
description: "Generate n8n workflow from natural-language description. Subcommands: n8n <description> | list | export."
argument-hint: "n8n \"<description>\" | list | export <flow-name>"
allowed-tools: Read, Write, Edit, Bash
recommended-model: sonnet-4-6
---

# /gen:workflow

v3.15. Convert automation intent into importable n8n workflow JSON.

## Usage

```bash
/gen:workflow n8n "When Stripe charge succeeds, create HubSpot contact + send welcome email + notify Slack"
```

Generates `n8n/workflows/stripe-hubspot-slack.json` + README with import instructions.

## Subcommands

### `n8n <description>`
Generate new workflow. Description in plain English.

### `list`
Show all workflow JSON files in `n8n/workflows/`.

### `export <flow-name>`
Package single workflow + credentials template for team sharing.

## See also

- `skills/n8n-workflows/SKILL.md` — patterns library
- `skills/integrations-misc/SKILL.md` — Zapier/Make fallback for simpler flows
