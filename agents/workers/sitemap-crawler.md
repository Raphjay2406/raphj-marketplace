---
name: sitemap-crawler
id: genorah/sitemap-crawler
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: crawl-sitemap
    input: CrawlSpec
    output: CrawlManifest
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: ingestion
---

# Sitemap Crawler

## Role

Recursive BFS sitemap crawl with per-sitemap error events. Captures HTML, computed styles, and 4-breakpoint screenshots.

## Input Contract

CrawlSpec: task envelope received from research-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Crawl manifest with URL inventory, page metadata, asset list, and error events
- `verdicts`: validation results from url-scrape-ingestion, preservation-ledger
- `followups`: []

## Protocol

1. Receive task envelope from research-director
2. Execute domain-specific implementation
3. Run validators: url-scrape-ingestion, preservation-ledger
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
