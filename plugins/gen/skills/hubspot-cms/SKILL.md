---
name: hubspot-cms
description: HubSpot CMS module + template + HUBL export patterns. Convert Genorah React components into HubSpot CMS modules for client self-edit.
tier: domain
triggers: hubspot-cms, hubl, hubspot-module, hubspot-template
version: 0.1.0
---

# HubSpot CMS Integration

Some clients require HubSpot CMS (sales/marketing team self-edit). Genorah pages can be compiled to HubSpot modules + templates via HUBL.

## Layer 1 — When to use

- Client is marketing-led, HubSpot-based
- Self-edit required post-delivery (marketing team updates content without dev cycle)
- Landing pages + blog posts on HubSpot host

## Layer 2 — Module structure

HubSpot module = React component-like unit with editable fields:

```
modules/
  hero/
    fields.json         # editable field schema
    module.html         # HUBL template
    module.css
    module.js
    meta.json           # metadata (label, icon, content_types)
```

`fields.json`:

```json
[
  {
    "name": "headline",
    "label": "Headline",
    "type": "text",
    "default": "Your headline here"
  },
  {
    "name": "bg_image",
    "label": "Background image",
    "type": "image"
  },
  {
    "name": "cta_text",
    "label": "CTA text",
    "type": "text",
    "default": "Get started"
  },
  {
    "name": "cta_url",
    "label": "CTA URL",
    "type": "url"
  }
]
```

`module.html`:

```hubl
<section class="hero" style="background-image: url('{{ module.bg_image.src }}');">
  <h1>{{ module.headline }}</h1>
  <a href="{{ module.cta_url.href }}" class="button">{{ module.cta_text }}</a>
</section>
```

## Layer 3 — Generation from Genorah PLAN.md

1. Read MASTER-PLAN.md section list
2. For each section, extract editable fields (identified by `data-editable="fieldname"` in React component)
3. Emit HubSpot module structure (`fields.json` + `module.html` + CSS)
4. Generate parent template that composes modules

## Layer 4 — Theme

HubSpot theme maps to DNA:

```
theme/
  theme.json            # theme metadata + settings
  templates/
    page.html           # base template
    blog-post.html
  modules/
    ...
  css/
    main.css
```

`theme.json`:

```json
{
  "name": "{project} theme",
  "settings": {
    "colors": {
      "primary": "{dna.primary}",
      "secondary": "{dna.secondary}",
      "accent": "{dna.accent}"
    },
    "fonts": {
      "display": "{dna.display_font}",
      "body": "{dna.body_font}"
    }
  }
}
```

## Layer 5 — Deploy

```bash
hs project upload
```

## Layer 6 — Limitations

- No server components (HubSpot is server-rendered HUBL)
- No client-side React for interactive content — use plain JS or wrap widgets in iframe
- Motion limited to CSS animations + Intersection Observer patterns
- No generated routes — HubSpot controls routing

## Layer 7 — Integration

- `/gen:hubspot-cms export` converts current project to HubSpot theme
- Env: `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_PORTAL_ID`
- Ledger: `hubspot-cms-exported`

## Layer 8 — Anti-patterns

- ❌ Expecting React hydration — HubSpot is server-rendered
- ❌ Heavy client JS in modules — slow + HubSpot perf penalty
- ❌ Ignoring HUBL variable escaping — XSS risk
- ❌ Hardcoding colors in modules — use theme variables so field-editable theme works
