---
name: "cms-reconnect"
description: "Detect and reconnect the source-of-truth CMS behind a scraped site. Schema discovery for Sanity/Contentful/Payload/WordPress/Strapi; map CMS entries to Genorah SDUI blocks; re-author via headless CMS going forward."
tier: "domain"
triggers: "cms reconnect, cms ingest, headless cms discovery, sanity discovery, contentful discovery, payload discovery"
version: "3.22.0"
---

## Layer 1: Decision Guidance

### When to Use

- URL mode ingestion detects CMS fingerprints (meta generator, JS bundle names, GraphQL endpoint probes).
- Source of truth for content lives in CMS, not code — scraping captures render, not structure.

### When NOT to Use

- Pure static site (HTML + no CMS) — content already preserved in `CONTENT.md`.
- Headless CMS access not available — fall back to `content-extraction` from render; note as `gap:cms-credentials-missing`.

## Layer 2: Detection + Flow

**Fingerprints:**

| CMS | Signal |
|-----|--------|
| Sanity | `sanity-io` bundle name, GROQ queries in network, `@sanity/client` in source |
| Contentful | `cdn.contentful.com` requests, `spaceId` in config |
| Payload | `/api/` REST + admin panel at `/admin` |
| WordPress | `wp-content/`, `wp-json/wp/v2/`, generator meta tag |
| Strapi | `/api/` + JWT auth, Strapi admin at `/admin` |
| Builder.io | `builder.io` CDN, `<builder-component>` tags |

**Flow:**

1. Detect CMS during `url-scrape-ingestion`.
2. If credentials provided via `--cms-token=<token> --cms-project=<id>`, probe schema endpoint.
3. Otherwise record `gap:cms-credentials-missing`.
4. On schema access: export Zod/TS types per content type.
5. Map content types to `server-driven-ui` blocks.
6. Write `CMS-SCHEMA.md` with type → block proposals.

## Layer 3: Integration Context

- Pairs with `server-driven-ui` — CMS types become SDUI block discriminators.
- Pairs with `cms-content-pipeline` for ongoing pull.
- Ledger entries: `cms.detected`, `cms.schema-export`, `cms.type-map`.

## Layer 4: Anti-Patterns

- Scraping around the CMS when credentials are available — always prefer structure over render.
- Hardcoding fetched content into code — store continues to live in CMS; ingest only discovers and maps.
- Auto-migrating CMS content — never; user approves schema proposals first.
