---
id: "genorah/sitemap-crawler"
name: "sitemap-crawler"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Recursive BFS sitemap crawl with per-sitemap error events. Captures HTML, computed styles, and 4-breakpoint screenshots"
source: "agents/workers/sitemap-crawler.md"
tags: [agent, genorah, worker]
---

# sitemap-crawler

> Recursive BFS sitemap crawl with per-sitemap error events. Captures HTML, computed styles, and 4-breakpoint screenshots.

## Preview

# Sitemap Crawler  ## Role  Recursive BFS sitemap crawl with per-sitemap error events. Captures HTML, computed styles, and 4-breakpoint screenshots.  ## Input Contract  CrawlSpec: task envelope receiv

## Frontmatter

```yaml
name: sitemap-crawler
id: genorah/sitemap-crawler
version: 4.0.0
channel: stable
tier: worker
description: Recursive BFS sitemap crawl with per-sitemap error events. Captures HTML, computed styles, and 4-breakpoint screenshots.
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
```
