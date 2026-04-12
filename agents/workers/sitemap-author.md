---
name: sitemap-author
id: genorah/sitemap-author
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: author-sitemap
    input: SiteSpec
    output: SitemapXML
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: misc
---

# Sitemap Author

## Role

Authors XML sitemaps (standard, image, video, news) with changefreq, priority, and hreflang entries.

## Input Contract

SiteSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: sitemap.xml files with full entry set and robots.txt integration
- `verdicts`: validation results from seo-technical
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: seo-technical
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
