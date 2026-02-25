---
name: "search-visibility"
description: "IndexNow instant indexing, AI-aware robots.txt presets, llms.txt generation, unified indexing strategy, and webmaster tools submission workflows for Next.js 16 and Astro 5"
tier: "domain"
triggers: "IndexNow, indexing, search visibility, llms.txt, AI crawlers, robots.txt AI bots, webmaster tools, Google Search Console, Bing Webmaster, sitemap submission, content discovery, search engine submission"
version: "1.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Public-facing site that publishes or updates content** (blog, e-commerce, CMS-driven, documentation) -- This skill sets up instant indexing for Bing/Yandex/Naver via IndexNow and sitemap-based indexing for Google
- **Need instant indexing for non-Google engines** -- IndexNow pushes new and updated URLs to Bing, Yandex, Naver, Seznam, Yep, Internet Archive, and Amazon within minutes
- **Need AI crawler control** -- Three robots.txt presets (Open/Selective/Restrictive) extend Phase 14's base robots.txt with explicit AI bot directives
- **Need AI discoverability** -- llms.txt provides a structured overview of site content for AI systems (forward-looking convention, ~844k sites adopted)
- **Need webmaster tools setup** -- Step-by-step verification and sitemap submission workflows for Google Search Console, Bing Webmaster Tools, Yandex Webmaster, and Naver Search Advisor
- **"How fast do search engines find my new pages" matters** -- Sites with frequent content updates (product launches, blog posts, news) benefit most from IndexNow's push-based model

### When NOT to Use

- **Meta tags, canonical URLs, sitemaps, hreflang** -- Use the `seo-meta` skill (Phase 14) for all per-page metadata, sitemap generation, and base robots.txt patterns
- **JSON-LD structured data** -- Use the `structured-data` skill (Phase 15) for FAQPage, Article, Product, Organization, and other schema types
- **OG image generation** -- Phase 18 scope (Dynamic OG Images & Pipeline Wiring)
- **Private dashboards behind authentication** -- No search engine should index authenticated content; skip this skill entirely
- **Tauri or Electron desktop apps** -- Desktop apps have no public URLs; this skill is exclusively for web-deployed sites
- **Note:** This skill EXTENDS Phase 14's robots.txt foundation with AI-specific presets. It does NOT replace the base robots.txt patterns in `seo-meta`. The base crawl directives (`/api/`, `/admin/`, `/_next/`) come from `seo-meta`; this skill adds AI bot rules on top

### Unified Indexing Strategy

**IndexNow does NOT work for Google.** Google tested the protocol in 2022 but never adopted it. The official IndexNow registry (`searchengines.json` at indexnow.org) lists 7 engines -- Google is not among them. For Google, the only paths are: submit your sitemap via Google Search Console and reference it in robots.txt. IndexNow works for Bing, Yandex, Naver, Seznam, Yep, Internet Archive, and Amazon -- all via a single POST to `api.indexnow.org`.

#### Engine x Method Comparison Matrix

| Engine | IndexNow | Sitemap | Webmaster Tools | Sitemap Ping | Notes |
|--------|----------|---------|-----------------|--------------|-------|
| Google | No | Yes | GSC submission | Deprecated (June 2023) | Sitemaps + GSC is the only path |
| Bing | Yes | Yes | Bing WMT | N/A (use IndexNow) | IndexNow preferred over sitemap ping |
| Yandex | Yes | Yes | Yandex Webmaster | N/A (use IndexNow) | IndexNow preferred |
| Naver | Yes | Yes | Naver Search Advisor | N/A (use IndexNow) | IndexNow preferred |
| Seznam | Yes | Yes | N/A | N/A | IndexNow auto-shared via global endpoint |
| Yep | Yes | Yes | N/A | N/A | IndexNow auto-shared via global endpoint |
| Internet Archive | Yes | N/A | N/A | N/A | Preservation, not search ranking |
| Amazon | Yes | N/A | N/A | N/A | Alexa/AI features |

#### Dual-Path Strategy

For every project, implement both paths:

1. **Google path:** Generate sitemap (Phase 14's `app/sitemap.ts` or `@astrojs/sitemap`) + submit to Google Search Console + reference in robots.txt. Google sitemap ping was deprecated June 2023 -- skip it entirely.
2. **Everything else:** Set up IndexNow endpoint + submit API key verification file. A single POST to `https://api.indexnow.org/IndexNow` auto-distributes to all 7 participating engines within seconds.

#### Project-Type Recipes

**Static blog / marketing site:**
- Build: Generate sitemap via framework (`app/sitemap.ts` or `@astrojs/sitemap`)
- Deploy: Submit changed URLs to IndexNow via build script or `astro-indexnow` integration
- Once: Submit sitemap to GSC, Bing WMT, Yandex, Naver
- Ongoing: Sitemaps auto-update on rebuild; IndexNow handles Bing/Yandex/Naver on deploy

**E-commerce / CMS-driven site:**
- Runtime: IndexNow Route Handler triggered on product/content publish (CMS webhook or ISR revalidation callback)
- Batch: Submit bulk URLs on inventory updates (up to 10,000 per call)
- Sitemap: Dynamic sitemap with accurate `lastmod` dates
- GSC: Sitemap auto-crawled; manual resubmit only if major URL structure changes

**SaaS landing page (few pages, infrequent changes):**
- Sitemap: Static sitemap, submit to GSC once
- IndexNow: Optional -- few pages with infrequent changes don't benefit much from instant indexing
- Focus: GSC monitoring for indexing issues; Bing WMT import from GSC for zero-effort Bing coverage

### Decision Tree

- **Framework:**
  - Next.js -- Route Handler at `app/api/indexnow/route.ts`
  - Astro SSG -- `astro-indexnow` integration (build-time, automatic change detection)
  - Astro SSR/Hybrid -- API endpoint at `src/pages/api/indexnow.ts`
- **Content frequency:**
  - Frequent updates (daily/hourly) -- Runtime IndexNow endpoint with content-hash tracking
  - Infrequent updates (weekly/monthly) -- Build-time submission only
- **Site size:**
  - < 100 pages -- Single URL submission OK, hash tracking optional
  - 100-10,000 pages -- Batch submission recommended, hash tracking recommended
  - 10,000+ pages -- Batch submission with content-hash tracking mandatory (prevents spam flags)
- **AI visibility:**
  - Choose one of three robots.txt presets based on business goals:
    - **Open** -- Allow all AI crawlers (maximize AI search + training visibility)
    - **Selective** -- Allow AI search bots, block AI training bots (most common choice)
    - **Restrictive** -- Block all AI bots (full content protection)
  - See `appendix-ai-crawlers.md` for the complete crawler taxonomy and preset templates (Plan 02)
- **Google indexing:**
  - Always sitemap + GSC. No IndexNow path exists for Google. Period.

### Pipeline Connection

- **Referenced by:** build-orchestrator at Wave 0-1 (IndexNow endpoint scaffold, key verification file, robots.txt AI presets, llms.txt generation), section-builder during content publish hooks
- **Consumed at:** `/modulo:execute` Wave 0 (IndexNow endpoint scaffold, key verification file, robots.txt AI rules, llms.txt), Wave 2+ (content-hash tracking on per-section publish)
- **Input from:** `seo-meta` skill (base robots.txt directives, sitemap URL), Design DNA (site name, URL for llms.txt)
- **Output to:** IndexNow endpoint (Route Handler or Astro endpoint), AI-aware robots.txt rules, llms.txt file, webmaster tools verification files

## Layer 2: Award-Winning Examples -- Part A (IndexNow Auto-Setup)

### IndexNow Auto-Setup Patterns (IDX-01)

#### 1. IndexNow API Key Setup

IndexNow requires an API key that is 8-128 characters long, containing only hexadecimal characters (a-f, A-F, 0-9) and hyphens. The key serves as both your submission credential and domain verification token. You must host a verification file at `/{key}.txt` for IndexNow to validate domain ownership.

**Two approaches to get a key:**

- **Generate via Bing Webmaster Tools** (recommended for production) -- Dashboard > Configure My Site > IndexNow > Generate Key. This registers the key with Bing immediately.
- **Generate any valid hex string** (fine for development) -- Any 32-character hex string works. All participating engines accept any valid key as long as the verification file is accessible.

**Environment variables:**

```bash
# .env.local (Next.js) or .env (Astro)
INDEXNOW_KEY=f34f184d10c049ef99aa7637cdc4ef04
INDEXNOW_INTERNAL_SECRET=your-random-secret-for-endpoint-auth
```

**Framework config (Next.js):**

```typescript
// next.config.ts
const nextConfig = {
  env: {
    INDEXNOW_KEY: process.env.INDEXNOW_KEY,
  },
}
export default nextConfig
```

**Framework config (Astro):**

```javascript
// astro.config.mjs -- env variables accessed via import.meta.env
// No special config needed; Astro reads .env files automatically
// Use import.meta.env.INDEXNOW_KEY in endpoints (NOT process.env)
```

#### 2. IndexNow Key Verification File

IndexNow requires a static file at `/{key}.txt` on your domain to verify ownership. Without this file, submissions return 403 Forbidden.

**Static approach (both frameworks -- recommended):**

Place a text file in your `public/` directory. The filename must be your API key with a `.txt` extension. The file contents must be the key itself and nothing else.

```
public/f34f184d10c049ef99aa7637cdc4ef04.txt
```

File contents (the key string only):
```
f34f184d10c049ef99aa7637cdc4ef04
```

**Dynamic approach (Next.js only):**

If you prefer not to commit the key to your repository, serve it dynamically via a Route Handler. This reads the key from the environment at runtime.

```typescript
// app/[key]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  const indexNowKey = process.env.INDEXNOW_KEY

  if (key === `${indexNowKey}.txt`) {
    return new NextResponse(indexNowKey, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
```

#### 3. Next.js 16: IndexNow Route Handler

This is the primary IndexNow pattern for Next.js projects. It accepts a list of URLs via POST, filters out unchanged URLs using SHA-256 content hashing, and submits changed URLs to the global IndexNow endpoint in batches of 10,000. Internal authentication via Bearer token prevents unauthorized submissions.

The in-memory `Map` persists across warm serverless invocations, providing effective deduplication during active traffic. On cold start the cache resets -- this is acceptable for most sites because a fresh submission of all URLs is harmless (just slightly wasteful). For persistent tracking across cold starts, substitute a KV store (Vercel KV, Upstash Redis) for the Map.

```typescript
// app/api/indexnow/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'

// In-memory hash cache (persists across requests in serverless warm starts)
const submittedHashes = new Map<string, string>()

function contentHash(url: string, content: string): string {
  return createHash('sha256').update(`${url}:${content}`).digest('hex').slice(0, 16)
}

export async function POST(request: NextRequest) {
  // Verify internal auth -- prevent unauthorized submissions
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INDEXNOW_INTERNAL_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { urls } = await request.json() as {
    urls: Array<{ url: string; contentHash?: string }>
  }

  // Filter out unchanged URLs using content-hash tracking
  const changedUrls = urls.filter(({ url, contentHash: hash }) => {
    if (!hash) return true // No hash provided, submit anyway
    const previous = submittedHashes.get(url)
    if (previous === hash) return false // Content unchanged
    submittedHashes.set(url, hash)
    return true
  })

  if (changedUrls.length === 0) {
    return NextResponse.json({ submitted: 0, message: 'No changed URLs' })
  }

  // Batch in groups of 10,000 (IndexNow limit per POST)
  const batches: Array<{ url: string; contentHash?: string }[]> = []
  for (let i = 0; i < changedUrls.length; i += 10_000) {
    batches.push(changedUrls.slice(i, i + 10_000))
  }

  const results: Array<{ status: number; count: number }> = []
  for (const batch of batches) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: batch.map(u => u.url),
      }),
    })
    results.push({ status: response.status, count: batch.length })
  }

  return NextResponse.json({
    submitted: changedUrls.length,
    batches: results,
  })
}
```

**Calling the endpoint** (from a CMS webhook handler, ISR callback, or deploy script):

```typescript
// Example: trigger IndexNow after content publish
await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/indexnow`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INDEXNOW_INTERNAL_SECRET}`,
  },
  body: JSON.stringify({
    urls: [
      { url: 'https://example.com/blog/new-post', contentHash: 'a1b2c3d4e5f6' },
      { url: 'https://example.com/blog/updated-post', contentHash: 'f6e5d4c3b2a1' },
    ],
  }),
})
```

#### 4. Astro SSR: IndexNow API Endpoint

For Astro projects running in SSR or hybrid mode with dynamic content updates. This endpoint follows the same submission pattern as the Next.js handler but uses Astro's `APIRoute` type and `import.meta.env` for configuration. Simpler than the Next.js pattern because SSR Astro sites typically handle fewer dynamic URLs -- content-hash tracking can be added following the same `Map` approach if needed.

```typescript
// src/pages/api/indexnow.ts
import type { APIRoute } from 'astro'

const INDEXNOW_KEY = import.meta.env.INDEXNOW_KEY
const SITE_URL = import.meta.env.SITE

export const POST: APIRoute = async ({ request }) => {
  // Verify internal auth
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${import.meta.env.INDEXNOW_INTERNAL_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { urls } = await request.json() as { urls: string[] }

  const response = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  })

  return new Response(JSON.stringify({
    submitted: urls.length,
    status: response.status,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

#### 5. Astro SSG: astro-indexnow Integration

For static Astro sites deployed via CI/CD. The `astro-indexnow` integration (v2.1.0) runs at build time, hashes all HTML output, compares against the previous build's cache, and submits only changed URLs. This is the recommended approach for static sites because it handles change detection, batching, and caching automatically.

```bash
npm install astro-indexnow
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import indexnow from 'astro-indexnow'

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    indexnow({
      // API key -- generate via Bing WMT or use any valid hex string
      key: process.env.INDEXNOW_KEY,
      // Cache file stores URL-to-hash mappings between builds
      cacheDir: process.cwd(),
    }),
  ],
})
```

**Built-in features:**
- HTML output hashing (SHA-256 of rendered page content)
- Automatic batching (respects 10,000 URL limit per POST)
- Cache file (`.astro-indexnow-cache.json`) for cross-build change detection
- CI/CD compatible -- no runtime server required

**CI/CD persistence:** Commit `.astro-indexnow-cache.json` to git so the cache persists across CI/CD builds. Without this, every build submits all URLs as "new."

**Limitation:** Build-time only. NOT suitable for Astro SSR sites with runtime content updates. For SSR Astro, use the API endpoint pattern in section 4 above.

#### 6. Content-Hash Tracking Approaches

Content-hash tracking prevents resubmitting unchanged URLs to IndexNow. Without it, every deployment or publish event wastes API quota and may trigger spam protections (HTTP 429 responses).

| Approach | Best For | Pros | Cons |
|----------|----------|------|------|
| In-memory Map | Next.js serverless | Simple, no external deps, zero latency | Lost on cold start; OK for edge/serverless warm instances |
| File-based JSON cache | Astro SSG (CI/CD) | Persists between builds if committed to git | Not suitable for runtime/SSR |
| KV store (Redis, Vercel KV) | High-traffic SSR sites | Persistent, shared across instances, survives deploys | External dependency, added cost |
| Database column | CMS-driven sites | Content hash computed on save, already in the data model | Requires schema change, tightly coupled |

**`astro-indexnow` reference implementation (5-step process):**

1. Scan HTML output directory after build
2. SHA-256 hash each page's rendered HTML content
3. Compare hashes against `.astro-indexnow-cache.json` from previous build
4. Submit only new or changed URLs to `api.indexnow.org`
5. Update cache file with current hashes

**Next.js recommended approach:**

- For most sites: In-memory `Map<string, string>` in the Route Handler module scope (see pattern 3 above)
- Content hash computed at publish time (CMS webhook payload includes content hash, or compute from ISR page content)
- For persistent tracking across cold starts: Vercel KV, Upstash Redis, or a `content_hash` column in your database

#### 7. IndexNow Monitoring

Track IndexNow submission health to catch issues before they affect indexing speed.

**Logging:** Log every submission with URL count, response status, and timestamp. A successful submission returns HTTP 200 (URLs accepted) or 202 (URLs accepted, processing). Any other status indicates a problem.

**429 handling:** If IndexNow returns HTTP 429 (Too Many Requests), implement exponential backoff. Check the `Retry-After` response header for the engine's requested wait time. As a baseline, wait at least 5 minutes before resubmitting the same URLs.

**Rate limit awareness:**
- 10,000 URLs per POST request (firm limit, documented by IndexNow)
- Daily limits per engine are not published -- vary by engine
- Best practice: minimum 5 minutes between resubmissions of the same URL
- Never submit unchanged URLs (content-hash tracking handles this)

**Response status reference:**

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | URLs submitted successfully | Log success |
| 202 | URLs accepted, processing | Log success (normal for some engines) |
| 400 | Invalid request body | Check JSON format, urlList structure |
| 403 | Key verification failed | Verify `public/{key}.txt` is accessible |
| 422 | Invalid URLs in batch | Check URL format (must be fully qualified) |
| 429 | Rate limited | Backoff with Retry-After header |

### Reference Sites

- **Bing Webmaster Tools** (bing.com/webmasters) -- Reference implementation of IndexNow with dashboard monitoring, key generation, and submission history. The canonical source for IndexNow API keys.
- **IndexNow.org** (indexnow.org) -- Official protocol documentation, participating engine registry (`searchengines.json`), API specification, and test tool for validating submissions.
- **Cloudflare Pages** (pages.cloudflare.com) -- Built-in IndexNow support for deployed sites, demonstrating how hosting platforms can automate IndexNow on every deploy without custom endpoints.

### AI-Aware robots.txt Presets (IDX-02)

Three robots.txt presets control how AI crawlers interact with the site: Open (maximize AI visibility), Selective (allow AI search, block AI training), and Restrictive (block all AI bots). These presets are not a spectrum from wrong to right -- each is a valid business choice with documented trade-offs. The user's business goals determine the correct preset. See `appendix-ai-crawlers.md` for the complete bot taxonomy (25+ categorized bots), full robots.txt templates for each preset, and the Next.js `robots.ts` programmatic implementation.

#### Quick-Reference: What Each Preset Allows/Blocks

| Preset | AI Search Bots | AI Training Bots | User-Triggered | Use Case |
|--------|---------------|-----------------|----------------|----------|
| **Open** | Allow | Allow | Allow | Maximum AI visibility -- open-source docs, startups, marketing sites |
| **Selective** | Allow | Block | Allow | AI search visible, training data blocked -- most content publishers |
| **Restrictive** | Block | Block | Block | Zero AI interaction -- premium content, paywalled publications |

#### Next.js robots.ts (Abbreviated)

The framework-native approach uses an environment variable to select the preset at build time:

```typescript
// app/robots.ts -- abbreviated; see appendix-ai-crawlers.md for full implementation
import type { MetadataRoute } from 'next'

type AIPreset = 'open' | 'selective' | 'restrictive'
const AI_PRESET: AIPreset = (process.env.AI_ROBOTS_PRESET as AIPreset) ?? 'selective'

// Bot arrays defined in appendix-ai-crawlers.md: AI_SEARCH_BOTS, AI_TRAINING_BOTS, AI_USER_TRIGGERED
// Logic: 'open' = no extra rules, 'selective' = allow search + block training, 'restrictive' = block all
```

See `appendix-ai-crawlers.md` for the complete `robots.ts` implementation with all bot arrays and conditional rule generation.

#### Astro robots.txt

Astro uses a static `public/robots.txt` file. Copy the appropriate preset template from `appendix-ai-crawlers.md` directly into `public/robots.txt`. For Astro SSR projects that need dynamic preset switching per environment, create an API endpoint at `src/pages/robots.txt.ts` following the same conditional logic as the Next.js pattern.

### llms.txt Generation (IDX-03)

llms.txt is a forward-looking convention for AI discoverability proposed by Jeremy Howard in September 2024. Approximately 844,000 sites have adopted it (including Anthropic, Cloudflare, Stripe), but no major AI platform has confirmed they read these files. The low implementation effort makes it worth including; do not over-invest when basic SEO is incomplete. See `appendix-llms-txt.md` for complete templates, both generation approaches (manual + auto-generated), the llms-full.txt detailed variant, and guidance on what NOT to do.

#### Quick Decision: Manual vs Auto-Generated

- **Manual template** (recommended for most sites): Create `public/llms.txt` with curated content. Best for sites with fewer than 50 key pages and stable structure.
- **Auto-generation** (Next.js Route Handler or Astro endpoint): Best for sites with many pages or frequent structural changes. Generates from a code-defined page registry with 24-hour caching.

#### Minimal llms.txt Example

```markdown
# My Site

> Brief description of what the site offers.

## Main Pages

- [Home](https://example.com/): Landing page
- [Blog](https://example.com/blog): Articles and updates
- [Docs](https://example.com/docs): Documentation

## Optional

- [Changelog](https://example.com/changelog): Release notes
```

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| Brand name | llms.txt H1 header, webmaster tools site name, IndexNow host identification |
| Brand description | llms.txt blockquote summary, site description in auto-generated llms.txt |
| Site URL (`NEXT_PUBLIC_SITE_URL` / `import.meta.env.SITE`) | IndexNow host parameter, key verification URL (`/{key}.txt`), llms.txt absolute links, sitemap references in robots.txt |
| `bg-primary` color | Not directly used by this skill (Phase 18 OG images will use for branded social previews) |
| `--font-display` | Not directly used by this skill (Phase 18 OG images will use for branded text rendering) |

### Archetype Variants

Search visibility is functionally identical across all 19 archetypes. Search engines and indexing protocols do not care about visual style -- they process structured data, sitemaps, and robots.txt directives the same way regardless of whether the site uses Brutalist or Ethereal design.

The only archetype-sensitive element is **llms.txt description tone**, which should match the archetype voice (same principle as meta description tone from the `seo-meta` skill):

| Archetype | llms.txt Tone Adaptation |
|-----------|-------------------------|
| Brutalist / Neubrutalism | Direct, blunt, no-frills description |
| Ethereal / Japanese Minimal | Understated, poetic brevity |
| Neo-Corporate / Swiss International | Professional, precise, authoritative |
| Playful / Vaporwave | Casual, energetic, personality-forward |
| Luxury / Dark Academia | Refined, exclusive, sophisticated |
| Editorial / Data-Dense | Clear, informative, content-focused |

**Note:** Robots.txt preset selection (Open/Selective/Restrictive) is a business decision, not an archetype decision. IndexNow patterns are identical regardless of archetype.

### Pipeline Stage

- **Input from:** `seo-meta` skill (base robots.txt directives, sitemap URL), Design DNA (brand name, site URL, brand description), `/modulo:start-project` (site URL, brand description)
- **Output to:** IndexNow endpoint files (Route Handler or Astro endpoint), robots.txt AI rules (appended to seo-meta base), llms.txt file, webmaster verification files (meta tags or uploaded files)
- **Pipeline position:**
  - **Wave 0 scaffold:** IndexNow endpoint, key verification file (`public/{key}.txt`), robots.txt AI presets, llms.txt generation
  - **Wave 1:** Webmaster tools verification files (if framework-native meta tag method chosen, these go in the root layout alongside other metadata)
  - **Post-deploy (human action):** Webmaster tools verification and sitemap submission (see `appendix-submission.md`) -- this happens after first deploy because verification files must be publicly accessible

### Related Skills

- **`seo-meta`** (Phase 14) -- Provides base robots.txt, sitemap generation, meta tags. This skill extends robots.txt with AI presets and provides IndexNow for proactive indexing beyond what sitemaps offer. The two skills share the same `robots.txt` / `robots.ts` file: `seo-meta` defines base crawl rules, `search-visibility` appends AI bot directives.
- **`structured-data`** (Phase 15) -- JSON-LD schemas for rich results. Complementary: structured data improves HOW pages appear in results (rich snippets, knowledge panels), search-visibility improves WHETHER pages appear (indexing speed, crawler access). Both contribute to overall search performance.
- **`performance-guardian`** -- Page speed affects crawl budget and indexing priority. Slow pages may be crawled less frequently by search engines, reducing the effectiveness of IndexNow submissions. Ensure Core Web Vitals pass before investing in indexing optimization.
- **`blog-patterns`** -- Blog content benefits most from IndexNow (frequent new posts). Content-hash tracking is most valuable here because blogs have the highest publish frequency.
- **`ecommerce-ui`** -- Product pages benefit from batch IndexNow on inventory updates. The project-type recipe for e-commerce in Layer 1 references this pattern.
- **`multi-page-architecture`** -- Site structure affects crawl efficiency. Good architecture combined with IndexNow ensures fast discovery of new pages across the site hierarchy.

## Layer 4: Anti-Patterns

### Anti-Pattern: Assuming Google Supports IndexNow

**What goes wrong:** Developers implement IndexNow thinking it covers Google, then wonder why Google indexing is slow. New pages appear in Bing within minutes but take days or weeks in Google. The team concludes IndexNow is "broken" when it is working exactly as designed -- just not for Google.

**Instead:** Always implement the dual-path strategy: IndexNow for Bing/Yandex/Naver + sitemap/GSC submission for Google. The engine comparison matrix in Layer 1 makes this explicit. Google was announced as "testing" IndexNow in 2022 but never adopted it. The official `searchengines.json` registry at indexnow.org lists 7 engines -- Google is not among them.

### Anti-Pattern: Resubmitting Unchanged URLs

**What goes wrong:** Every deployment submits ALL URLs to IndexNow, not just changed ones. Search engines rate-limit the submissions (HTTP 429 responses) or flag the domain as spam. API quota is wasted on URLs whose content has not changed.

**Instead:** Implement content-hash tracking. For Next.js: in-memory `Map` or KV store (see Layer 2A, pattern 6). For Astro SSG: use `astro-indexnow` with its built-in cache file. Only submit URLs where the content hash has actually changed since the last submission.

### Anti-Pattern: Blocking AI Search Bots When Blocking Training Bots

**What goes wrong:** Using blanket AI bot blocks (e.g., blocking `GPTBot` to stop training) also kills visibility in ChatGPT search, Perplexity, and DuckAssist. Site disappears from AI-powered search results. Blocking `Google-Extended` for training does not affect Google Search, but blocking all AI-prefixed bots indiscriminately removes the site from emerging AI search experiences.

**Instead:** Use the Selective preset: explicitly allow search bots (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`, `DuckAssistBot`, `Gemini-Deep-Research`) before blocking training bots (`GPTBot`, `Google-Extended`, `ClaudeBot`, `CCBot`, etc.). See `appendix-ai-crawlers.md` for the complete three-tier taxonomy and preset templates.

### Anti-Pattern: Missing IndexNow Key Verification File

**What goes wrong:** IndexNow submissions return 403 Forbidden. Key validation shows as pending (202 that never resolves to 200). The endpoint appears to work locally but fails in production because the key verification file is not deployed.

**Instead:** Place `public/{YOUR_KEY}.txt` containing only the key string. The filename must match the key exactly (e.g., `public/f34f184d10c049ef99aa7637cdc4ef04.txt`). Verify it is accessible at `https://yoursite.com/{key}.txt` after deploy. Both Next.js and Astro serve files from `public/` at the site root.

### Anti-Pattern: Using Google Sitemap Ping (Deprecated)

**What goes wrong:** Code pings `google.com/ping?sitemap=...` which has returned 404 since June 2023. No harm is done, but no benefit either -- and developers falsely believe Google is being notified of sitemap updates. Old tutorials, WordPress plugins, and LLM training data still reference this endpoint.

**Instead:** For Google: submit sitemap via Google Search Console + reference in `robots.txt` with the `Sitemap:` directive. That is the only path. Remove any sitemap ping code from build scripts and deploy hooks.

### Anti-Pattern: Overselling llms.txt Impact

**What goes wrong:** Over-investing in llms.txt optimization (spending hours on content curation, A/B testing descriptions, monitoring "AI SEO rankings") while basic SEO (meta tags, sitemaps, structured data) is incomplete. No measurable ranking impact because no AI platform has confirmed reading these files.

**Instead:** Implement llms.txt as a low-effort, forward-looking convention. Spend 15-30 minutes max. The format is simple (H1 + blockquote + page links). Prioritize the `seo-meta` and `structured-data` skills first -- those have confirmed, measurable search impact. See `appendix-llms-txt.md` for templates.

### Anti-Pattern: Submitting Sitemaps Before Verification

**What goes wrong:** Sitemap submission fails silently or is ignored because site ownership is not verified. Developer navigates to the sitemap section, enters the URL, and sees no error -- but the sitemap is not being processed. Days later, no pages are indexed.

**Instead:** Follow the `appendix-submission.md` workflow: verify ownership FIRST, then submit sitemap. All four platforms (GSC, Bing, Yandex, Naver) require verified ownership before accepting and processing sitemap submissions. Verification methods are documented for each platform with step-by-step instructions.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| IndexNow batch size | 1 | 10000 | URLs per POST | HARD -- reject if exceeded |
| IndexNow key length | 8 | 128 | chars | HARD -- reject if outside range |
| IndexNow key characters | - | - | a-z, A-Z, 0-9, - only | HARD -- reject invalid chars |
| IndexNow key verification file | - | - | present at `/{key}.txt` | HARD -- reject if missing |
| IndexNow submission endpoint | - | - | `api.indexnow.org` | HARD -- reject per-engine endpoints |
| robots.txt AI preset selection | - | - | one of: open, selective, restrictive | HARD -- must choose a preset |
| robots.txt sitemap reference | - | - | present | HARD -- reject if missing |
| llms.txt H1 header | - | - | present (site name) | SOFT -- warn if missing |
| llms.txt file location | - | - | `/llms.txt` at site root | SOFT -- warn if wrong path |
| Webmaster tools verification | - | - | at least GSC + Bing verified | SOFT -- warn if unverified |
| Content-hash tracking | - | - | implemented for sites with 100+ URLs | SOFT -- warn if missing for large sites |
| Google sitemap ping | - | - | must NOT be present | HARD -- reject (deprecated June 2023) |
