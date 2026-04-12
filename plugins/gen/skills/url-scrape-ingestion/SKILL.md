---
name: "url-scrape-ingestion"
description: "Ingest existing live site via Playwright crawl. Captures HTML + CSS + JS bundles, computed styles per selector, 4-breakpoint screenshots, assets with sha256. Honors robots.txt and requires explicit --consent."
tier: "domain"
triggers: "ingest url, scrape site, capture existing site, import from url, legacy url, crawl site"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Only live URL available; no repo access.
- Source not shippable but live output is the truth.
- User has authority to scrape (their own site, client engagement, licensed import).

### When NOT to Use

- Codebase is available — use `codebase-ingestion` (higher confidence).
- Site is behind auth without credentials provided.
- robots.txt disallows crawl — respect it; refuse.

### Legal Gate

`/gen:ingest url` requires `--consent` flag. Without it, the command refuses. Consent means: user confirms they have authority to scrape this URL per ToS and applicable law.

## Layer 2: Flow

```bash
node scripts/ingest/crawl.mjs https://acme.com --slug=acme-site --consent --max-routes=50
# →
#   captured/              # HTML + CSS + JS per route
#   screenshots/           # 375/768/1280/1440 px × N routes
#   computed-styles/       # per-selector getComputedStyle() JSON
#   assets/                # sha256-named, origin preserved
#   manifests/routes.json
```

- Sitemap.xml consumed if present; otherwise BFS crawl from root within same-origin.
- llms.txt and robots.txt captured verbatim.
- Each route: 4-breakpoint full-page screenshot + DOM snapshot + console messages + computed styles for unique selectors.

## Layer 3: Integration Context

- Runs on Playwright MCP (same as visual-qa-protocol). Falls back to local Playwright if MCP unavailable.
- Feeds `dna-reverse-engineer` with screenshots (color k-means) + computed-styles (font/spacing stats).
- Feeds `content-extraction` with DOM text nodes.
- Every captured file gets a `capture.*` ledger entry (preservation invariant).

## Layer 4: Anti-Patterns

- Scraping without `--consent` — refused by command; do not override.
- Ignoring robots.txt — disallowed routes logged as `gap:robots-disallow`, not captured.
- Capturing auth-gated routes using user credentials without ledger note — must record that captures were authenticated.
- Aggressive parallelism — throttle default 2 req/s; bump only with explicit flag.
