---
id: "genorah/sitemap-author"
name: "sitemap-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors XML sitemaps (standard, image, video, news) with changefreq, priority, and hreflang entries"
source: "agents/workers/sitemap-author.md"
tags: [agent, genorah, worker]
---

# sitemap-author

> Authors XML sitemaps (standard, image, video, news) with changefreq, priority, and hreflang entries.

## Preview

# Sitemap Author  ## Role  Authors XML sitemaps (standard, image, video, news) with changefreq, priority, and hreflang entries.  ## Input Contract  SiteSpec: task envelope received from wave-director

## Frontmatter

```yaml
name: sitemap-author
id: genorah/sitemap-author
version: 4.0.0
channel: stable
tier: worker
description: Authors XML sitemaps (standard, image, video, news) with changefreq, priority, and hreflang entries.
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
```
