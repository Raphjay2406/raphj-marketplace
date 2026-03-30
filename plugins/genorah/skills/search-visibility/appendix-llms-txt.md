# Search Visibility: llms.txt Templates & Generation

> Status: Forward-looking convention (~844k adopters, NO confirmed AI platform consumption)
> Spec: llmstxt.org (proposed Sep 2024 by Jeremy Howard)

## What llms.txt Is (and Isn't)

llms.txt is a proposed convention for helping AI systems understand site content. It sits at the site root (`/llms.txt`) as a markdown file providing a structured overview of the site's key pages and their purposes. Approximately 844,000 sites have adopted it as of October 2025, including Anthropic, Cloudflare, Stripe, Mintlify, and GitBook. HOWEVER: no major AI platform (OpenAI, Google, Anthropic) has confirmed they read these files during crawling or inference. The low implementation effort makes it worth including as a forward-looking investment; do not over-invest in optimizing llms.txt content when basic SEO (meta tags, sitemaps, structured data) is incomplete.

## Format Specification

### llms.txt (Summary Variant)

**Required:**
- H1: Site/project name (ONLY mandatory element)

**Optional (in order):**
- Blockquote: Short project summary
- Paragraphs: Additional context (no headings between H1 and first H2)
- H2 sections: Categorized page lists with markdown links
- `## Optional` section: Secondary content AI systems can skip for shorter context

**Link format within sections:**
```markdown
- [Page Title](https://example.com/page): Brief description of the page content
```

**Complete template:**

```markdown
# Site Name

> Brief description of the site, its purpose, and what content it offers.

Key information about the site that helps AI systems understand context.
This could include the site's primary audience, content focus, or unique value.

## Main Pages

- [Home](https://example.com/): Landing page with company overview
- [About](https://example.com/about): Company mission, team, and history
- [Blog](https://example.com/blog): Technical articles and company updates
- [Products](https://example.com/products): Product catalog with pricing

## Documentation

- [Getting Started](https://example.com/docs/getting-started): Quick start guide for new users
- [API Reference](https://example.com/docs/api): Complete API documentation with examples
- [Tutorials](https://example.com/docs/tutorials): Step-by-step implementation guides

## Optional

- [Changelog](https://example.com/changelog): Release history and version notes
- [Legal](https://example.com/legal): Terms of service and privacy policy
- [Sitemap](https://example.com/sitemap.xml): Full page index
```

### llms-full.txt (Detailed Variant)

Same H1/H2 structure as llms.txt but includes full page content inline. Each linked page's content is reproduced under H3 headings with source URLs for attribution. The file can be significantly larger than llms.txt -- this is acceptable since AI systems handle long context well.

**Template:**

```markdown
# Site Name

> Brief description of the site.

## Main Pages

### Home
Source: https://example.com/

[Full markdown content of the home page reproduced here -- hero text,
feature descriptions, value propositions, etc.]

### About
Source: https://example.com/about

[Full markdown content of the about page -- company story, team bios,
mission statement, etc.]

## Documentation

### Getting Started
Source: https://example.com/docs/getting-started

[Full getting started guide content -- installation steps, first project,
configuration, etc.]

## Optional

### Changelog
Source: https://example.com/changelog

[Recent changelog entries -- last 5-10 releases with dates and descriptions]
```

## Generation Approaches

### Manual Template (Recommended for most sites)

Create `public/llms.txt` with manually curated content. Best when:
- Site has fewer than 50 key pages
- Content structure is stable (not changing weekly)
- You want editorial control over what AI systems see first

Copy the template from the Format Specification section above. Replace placeholder content with real page titles, URLs, and descriptions. Place the file in your `public/` directory so it's served at the site root.

**Tips:**
- Prioritize your most important pages in the first H2 section
- Keep descriptions to one sentence -- AI systems parse markdown, not prose
- Use the `## Optional` section for content that's useful but not essential
- Update llms.txt when you add or remove major pages (not on every content edit)

### Auto-Generation: Next.js Route Handler

For sites with many pages or frequent structural changes. Generates llms.txt dynamically from a page registry defined in code.

```typescript
// app/llms.txt/route.ts
import { NextResponse } from 'next/server'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? 'Site description'

// Define your page structure for llms.txt
// Update this registry when pages are added or removed
const pages: Record<string, Array<{ title: string; path: string; description: string }>> = {
  'Main Pages': [
    { title: 'Home', path: '/', description: 'Landing page with company overview' },
    { title: 'About', path: '/about', description: 'Company mission and team' },
    { title: 'Blog', path: '/blog', description: 'Technical articles and updates' },
  ],
  'Documentation': [
    { title: 'Getting Started', path: '/docs/getting-started', description: 'Quick start guide' },
    { title: 'API Reference', path: '/docs/api', description: 'Complete API documentation' },
  ],
  'Optional': [
    { title: 'Changelog', path: '/changelog', description: 'Release history' },
    { title: 'Legal', path: '/legal', description: 'Terms of service and privacy policy' },
  ],
}

export async function GET() {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
  ]

  for (const [section, entries] of Object.entries(pages)) {
    lines.push(`## ${section}`, '')
    for (const entry of entries) {
      lines.push(`- [${entry.title}](${SITE_URL}${entry.path}): ${entry.description}`)
    }
    lines.push('')
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  })
}
```

### Auto-Generation: Astro Endpoint

For Astro projects. In SSG mode this generates at build time; in SSR mode it generates per request.

```typescript
// src/pages/llms.txt.ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const siteName = import.meta.env.SITE_NAME ?? 'My Site'
  const siteUrl = import.meta.env.SITE ?? 'https://example.com'
  const siteDescription = import.meta.env.SITE_DESCRIPTION ?? 'Site description'

  const content = `# ${siteName}

> ${siteDescription}

## Main Pages

- [Home](${siteUrl}/): Landing page with company overview
- [About](${siteUrl}/about): Company mission and team
- [Blog](${siteUrl}/blog): Technical articles and updates

## Documentation

- [Getting Started](${siteUrl}/docs/getting-started): Quick start guide
- [API Reference](${siteUrl}/docs/api): Complete API documentation

## Optional

- [Changelog](${siteUrl}/changelog): Release history
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
```

### Auto-Generation: llms-full.txt

For the full variant, extend the auto-generation pattern:

1. Define a page registry (same as llms.txt approach)
2. For each page, fetch the rendered content or raw markdown source
3. Include content under H3 headings with source URLs
4. Consider implementing as a **build script** rather than a runtime route -- the file is large, rarely changes, and benefits from being pre-generated

**Build-time approach (recommended for llms-full.txt):**

```bash
# Add to package.json scripts
"generate:llms-full": "node scripts/generate-llms-full.mjs"
```

Generate the file during CI/CD and place in `public/llms-full.txt`. This avoids runtime overhead for what is essentially a static document.

## What NOT to Do

- **Do not spend hours optimizing llms.txt content** when basic SEO (meta tags, sitemaps, structured data) is incomplete -- get the fundamentals right first
- **Do not claim llms.txt improves SEO rankings** -- there is no evidence of any ranking impact; it is a content discovery convention, not a ranking signal
- **Do not include sensitive or private content** in llms.txt -- it is a publicly accessible file at the site root
- **Do not auto-generate from ALL pages** -- curate the 20-50 most important ones; AI systems benefit from a focused summary, not an exhaustive dump
- **Do not forget the `## Optional` section** for secondary content -- it signals to AI systems which content can be skipped in constrained contexts
- **Do not update llms.txt on every content edit** -- update it when pages are added, removed, or significantly restructured
