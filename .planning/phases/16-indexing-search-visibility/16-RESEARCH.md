# Phase 16: Indexing & Search Visibility - Research

**Researched:** 2026-02-25
**Domain:** IndexNow protocol, llms.txt standard, AI crawler taxonomy, webmaster tools workflows, search engine submission
**Confidence:** HIGH (core protocol specs verified via official sources; llms.txt adoption status MEDIUM)

## Summary

Phase 16 creates the `search-visibility` skill (Domain tier) covering IndexNow auto-setup, unified indexing strategy, AI-aware robots.txt extensions, llms.txt generation, and webmaster tools submission workflows across four search platforms (Google, Bing, Yandex, Naver).

The research confirms all critical decisions from CONTEXT.md are well-supported by current standards. IndexNow is mature with 7 participating engines (Bing, Yandex, Naver, Seznam, Yep, Internet Archive, Amazon) and a global endpoint at api.indexnow.org that distributes to all engines in one call. Google still does NOT support IndexNow as of February 2026 -- this was the primary research question and the answer is definitive. The `astro-indexnow` package exists at v2.1.0 with built-in content-hash tracking via HTML output hashing. The llms.txt standard is widely adopted (~844k sites) but no major AI platform has confirmed they read these files -- it remains a forward-looking convention worth implementing but not worth overselling.

**Primary recommendation:** Build the skill around the dual-path indexing model (IndexNow for Bing/Yandex/Naver + sitemap/GSC for Google), with complete copy-paste Route Handler and Astro endpoint patterns. Use api.indexnow.org as the single submission endpoint rather than per-engine endpoints. Present llms.txt honestly as an emerging convention. Build the updated AI crawler taxonomy from Phase 14's foundation with the three-tier preset system (Open/Selective/Restrictive) as decided in CONTEXT.md.

## Standard Stack

### Core (No External Dependencies for Next.js)

| Technology | Version/Spec | Purpose | Why Standard |
|-----------|-------------|---------|--------------|
| IndexNow Protocol | v1 (stable) | Instant URL submission to Bing/Yandex/Naver/etc | Official open protocol, 7 search engines |
| Next.js Route Handlers | Next.js 16+ | IndexNow submission endpoint | Framework-native API routes |
| `app/robots.ts` | Next.js 16+ | AI-aware robots.txt generation | Framework-native, type-safe |
| Web Fetch API | Native | HTTP POST to IndexNow endpoint | No library needed |

### Supporting (Astro Only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `astro-indexnow` | ^2.1.0 | Build-time IndexNow submission with change detection | Astro SSG projects (build-time only) |

### Standards / Specifications

| Standard | Status | Purpose | Adoption |
|---------|--------|---------|----------|
| llms.txt | Proposed (Sep 2024) | AI crawler content guidance | ~844k sites; no AI platform confirmed reading it |
| IndexNow | Production (Oct 2021) | Push-based URL indexing | 7 search engines; NOT Google |
| robots.txt | RFC 9309 (Sep 2022) | Crawler access control | Universal |

### Explicitly NOT Needed

| Package | Why Avoid | Use Instead |
|---------|-----------|-------------|
| `next-sitemap` | Unmaintained, legacy Pages Router | Next.js `app/sitemap.ts` (Phase 14) |
| Any IndexNow npm library for Next.js | Simple HTTP POST, no library needed | Native `fetch()` in Route Handler |
| `xml2js` | Only needed if parsing sitemaps server-side | Direct URL list generation from CMS/routes |

**Installation (Astro projects only):**
```bash
npm install astro-indexnow
```

## Architecture Patterns

### Recommended Skill Structure

```
skills/search-visibility/
  SKILL.md                    # Main skill -- Domain tier, 4-layer format
  appendix-ai-crawlers.md     # Updated AI crawler taxonomy (extends Phase 14)
  appendix-llms-txt.md        # llms.txt and llms-full.txt templates and generation
  appendix-submission.md      # GSC, Bing, Yandex, Naver step-by-step workflows
```

### Pattern 1: IndexNow Route Handler (Next.js)

**What:** A POST endpoint that accepts URLs and submits them to IndexNow with content-hash deduplication.
**When to use:** Any Next.js project that wants instant indexing for Bing/Yandex/Naver.

```typescript
// app/api/indexnow/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'

// In-memory hash cache (persists across requests in serverless warm starts)
// For persistent tracking, use a KV store or file-based cache
const submittedHashes = new Map<string, string>()

function contentHash(url: string, content: string): string {
  return createHash('sha256').update(`${url}:${content}`).digest('hex').slice(0, 16)
}

export async function POST(request: NextRequest) {
  // Verify internal auth (e.g., shared secret, webhook signature)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INDEXNOW_INTERNAL_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { urls } = await request.json() as { urls: Array<{ url: string; contentHash?: string }> }

  // Filter out unchanged URLs
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

  // Batch in groups of 10,000 (IndexNow limit)
  const batches = []
  for (let i = 0; i < changedUrls.length; i += 10000) {
    batches.push(changedUrls.slice(i, i + 10000))
  }

  const results = []
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
    results.push({
      status: response.status,
      count: batch.length,
    })
  }

  return NextResponse.json({ submitted: changedUrls.length, batches: results })
}
```

### Pattern 2: IndexNow Astro Endpoint (SSR)

**What:** An Astro API endpoint for SSR sites that need runtime IndexNow submission.
**When to use:** Astro SSR projects with dynamic content updates (CMS-driven). For static Astro sites, use `astro-indexnow` integration instead.

```typescript
// src/pages/api/indexnow.ts
import type { APIRoute } from 'astro'

const INDEXNOW_KEY = import.meta.env.INDEXNOW_KEY
const SITE_URL = import.meta.env.SITE

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${import.meta.env.INDEXNOW_INTERNAL_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { urls } = await request.json()

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
  }), { status: 200 })
}
```

### Pattern 3: astro-indexnow Integration (SSG Build-Time)

**What:** Build-time IndexNow submission with automatic content-hash change detection.
**When to use:** Astro static sites deployed via CI/CD.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import indexnow from 'astro-indexnow'

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    indexnow({
      key: process.env.INDEXNOW_KEY,
      // Cache file stores URL-to-hash mappings between builds
      // Commit .astro-indexnow-cache.json to git for CI/CD persistence
      cacheDir: process.cwd(),
    }),
  ],
})
```

### Pattern 4: IndexNow Key Verification File

**What:** Static file required by IndexNow to verify domain ownership.
**Both frameworks:** Place in `public/` directory.

```
// public/{YOUR_API_KEY}.txt
// File contents: just the key itself
f34f184d10c049ef99aa7637cdc4ef04
```

### Pattern 5: llms.txt Template

**What:** Markdown file at site root for AI discoverability.
**Format:** Follows the llmstxt.org specification.

```markdown
# Site Name

> Brief description of the site, its purpose, and what content it offers.

Key information about the site that helps AI systems understand context.

## Main Pages

- [Home](https://example.com/): Landing page with company overview
- [About](https://example.com/about): Company mission, team, and history
- [Blog](https://example.com/blog): Technical articles and company updates
- [Products](https://example.com/products): Product catalog with pricing

## Documentation

- [Getting Started](https://example.com/docs/getting-started): Quick start guide
- [API Reference](https://example.com/docs/api): Complete API documentation

## Optional

- [Changelog](https://example.com/changelog): Release history
- [Legal](https://example.com/legal): Terms of service and privacy policy
```

### Anti-Patterns to Avoid

- **Submitting to individual IndexNow engines separately:** Use `api.indexnow.org` -- it distributes to all participating engines automatically.
- **Submitting unchanged URLs:** Wastes quota and may trigger spam protections. Always track content hashes.
- **Using Google sitemap ping:** Deprecated since June 2023, returns 404. Use GSC submission instead.
- **Blocking AI search bots when trying to block AI training bots:** Separate rules for `GPTBot` (training) vs `OAI-SearchBot` (search) etc.
- **Overselling llms.txt:** No major AI platform has confirmed reading these files. Present as forward-looking, not critical.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Astro build-time IndexNow | Custom build hook with hash tracking | `astro-indexnow` v2.1.0 | Handles HTML hashing, caching, batching, CI/CD |
| IndexNow key generation | Custom UUID/hex generator | Bing Webmaster Tools key generator or any hex string 8-128 chars | Must meet exact spec (a-z, A-Z, 0-9, hyphens only) |
| Per-engine IndexNow submission | Multiple fetch calls to each engine | Single POST to `api.indexnow.org` | Global endpoint auto-distributes to all 7 engines |
| AI crawler robots.txt | Manual bot-by-bot rules from scratch | Three-tier preset templates (Open/Selective/Restrictive) | Comprehensive, verified list with quarterly review cadence |
| llms.txt content scraping | Custom web scraper to extract page content | Route/sitemap iteration with existing content | Pages already have content; just format as markdown |

## Common Pitfalls

### Pitfall 1: Assuming Google Supports IndexNow
**What goes wrong:** Developers implement IndexNow thinking it covers Google, then wonder why Google indexing is slow.
**Why it happens:** IndexNow marketing doesn't always prominently state Google's absence. Google "tested" it in 2022 but never adopted it.
**How to avoid:** Skill must state upfront: "IndexNow does NOT work for Google. Google uses sitemaps + GSC submission."
**Warning signs:** New pages appear in Bing within minutes but take days/weeks in Google.

### Pitfall 2: Resubmitting Unchanged URLs to IndexNow
**What goes wrong:** Every deployment submits ALL URLs, not just changed ones. Search engines may rate-limit or flag as spam.
**Why it happens:** Simple implementation that iterates all routes without change detection.
**How to avoid:** Content-hash tracking. For Next.js: in-memory Map or KV store. For Astro SSG: use `astro-indexnow` with cache file.
**Warning signs:** HTTP 429 responses from IndexNow endpoint.

### Pitfall 3: Blocking AI Search Bots When Blocking Training Bots
**What goes wrong:** Using `User-agent: GPTBot` to block training also blocks `OAI-SearchBot` if rules are written carelessly. Or worse, blocking all unknown AI bots.
**Why it happens:** Conflation of training bots and search bots. Phase 14 research confirmed this as a major risk.
**How to avoid:** Three-tier taxonomy with explicit allow rules for search bots BEFORE blanket training bot blocks.
**Warning signs:** Site invisible in ChatGPT search, Perplexity, etc.

### Pitfall 4: Missing IndexNow Key Verification File
**What goes wrong:** IndexNow submissions return 403 Forbidden.
**Why it happens:** Key file not placed in `public/` directory, or filename doesn't match key exactly.
**How to avoid:** Skill must include explicit step: "Create `public/{YOUR_KEY}.txt` containing only the key string."
**Warning signs:** 403 responses from IndexNow endpoint, key validation pending (202 that never resolves).

### Pitfall 5: Google Sitemap Ping in 2026
**What goes wrong:** Code pings `google.com/ping?sitemap=...` which returns 404 since late 2023.
**Why it happens:** Old tutorials, WordPress plugins, and LLM training data still reference it.
**How to avoid:** Skill explicitly states: "Google sitemap ping was deprecated June 2023. Use GSC submission + robots.txt sitemap reference only."
**Warning signs:** 404 responses from Google ping endpoint.

### Pitfall 6: llms.txt Claiming AI Platforms Read It
**What goes wrong:** Over-investing in llms.txt optimization expecting measurable SEO impact.
**Why it happens:** Marketing hype around the standard. ~844k sites adopted it but no AI platform confirmed reading it.
**How to avoid:** Present llms.txt as "forward-looking convention" not "critical SEO requirement." Low effort to implement, uncertain payoff.
**Warning signs:** Time spent optimizing llms.txt when basic SEO (meta tags, sitemaps, structured data) is incomplete.

### Pitfall 7: Forgetting to Verify Webmaster Tools Before Submitting Sitemaps
**What goes wrong:** Sitemap submission fails or is ignored because site ownership isn't verified.
**Why it happens:** Developers skip verification step, go straight to sitemap submission.
**How to avoid:** Skill workflows must put verification BEFORE sitemap submission with all methods documented.
**Warning signs:** "Not an owner" errors in webmaster tools.

## Critical Research Findings

### 1. Google IndexNow Status (CONFIRMED: NOT SUPPORTED)

**Confidence: HIGH** (verified via multiple sources including IndexNow official registry, Feb 2026)

Google does NOT support IndexNow as of February 2026. Google was announced as "testing" IndexNow in 2022 but never adopted it. The official `searchengines.json` registry at indexnow.org lists 7 engines -- Google is not among them.

**Current IndexNow participants (official registry):**

| Engine | Endpoint | Status |
|--------|----------|--------|
| Bing | `https://www.bing.com/indexnow` | Active |
| Yandex | `https://www.yandex.com/indexnow` | Active |
| Naver | `https://searchadvisor.naver.com/indexnow` | Active |
| Seznam | `https://search.seznam.cz/indexnow` | Active |
| Yep | `https://indexnow.yep.com/indexnow` | Active |
| Internet Archive | `https://web-static.archive.org/indexnow` | Active |
| Amazon | `https://indexnow.amazonbot.amazon/indexnow` | Active |
| **Global endpoint** | `https://api.indexnow.org/IndexNow` | **Distributes to all** |

**Recommendation:** Use `api.indexnow.org` as the single submission endpoint. It auto-distributes to all participating engines within 10 seconds.

### 2. IndexNow Rate Limits (PARTIALLY DOCUMENTED)

**Confidence: MEDIUM** (official docs confirm limits exist but don't publish exact thresholds)

- **Batch limit:** 10,000 URLs per POST request (documented)
- **Daily limit:** Not officially published; each engine sets its own thresholds
- **Rate limit response:** HTTP 429 with `Retry-After` header
- **Spam protection:** Excessive submission of unchanged URLs may trigger spam flags
- **Best practice:** Wait at least 5 minutes between resubmissions of the same URL; submit only when content actually changes

### 3. `astro-indexnow` Package (VERIFIED)

**Confidence: HIGH** (verified via GitHub and npm)

- **Package:** `astro-indexnow` by velohost
- **Version:** 2.1.0 (current as of Feb 2026)
- **Key features:**
  - Build-time only execution (no runtime code)
  - Content-hash change detection via HTML output hashing
  - Automatic batching (handles 10k URL limit)
  - Cache file (`.astro-indexnow-cache.json`) for cross-build persistence
  - CI/CD and Docker compatible
- **Configuration:**
  - `key` (required): IndexNow API key
  - `enabled` (default: true): Toggle on/off
  - `cacheDir` (default: `process.cwd()`): Cache file location
- **Limitation:** Build-time only. Not suitable for SSR sites with runtime content updates. For Astro SSR, use a custom API endpoint instead.

### 4. llms.txt Specification (FORWARD-LOOKING, NOT CRITICAL)

**Confidence: MEDIUM** (spec exists and is adopted but no AI platform confirmed reading it)

**Spec origin:** Proposed by Jeremy Howard (September 2024) at llmstxt.org

**Format (mandatory):**
- H1 header: Site/project name (ONLY mandatory element)

**Format (optional, in order):**
- Blockquote: Short project summary
- Paragraphs: Additional context (no headings)
- H2 sections: File lists with markdown links
- `## Optional` section: Secondary content that can be skipped for shorter context

**Link format within sections:**
```markdown
- [Page Title](https://example.com/page): Brief description of the page content
```

**llms-full.txt variant:**
- Contains full page content (not just links)
- Same H1/H2 structure
- Each linked page's full markdown content included inline under H3 headings
- Source URLs included for attribution

**Adoption status (Feb 2026):**
- ~844,000 websites have implemented it (BuiltWith tracking, Oct 2025)
- Major adopters: Anthropic, Cloudflare, Stripe, Mintlify, GitBook
- **No major AI platform (OpenAI, Google, Anthropic) has confirmed they read llms.txt files**
- Yoast SEO plugin auto-generates llms.txt for WordPress sites

**Recommendation for skill:** Include llms.txt as a forward-looking section. Document both manual template and auto-generation approaches. Be honest about adoption uncertainty. Low implementation effort makes it worth including even without confirmed AI platform support.

### 5. Updated AI Crawler Taxonomy (Feb 2026)

**Confidence: HIGH** (verified via official documentation and multiple authoritative sources)

Phase 14 already documented a comprehensive AI crawler list. Phase 16 extends this with the three-tier preset system. Key updates since Phase 14 research:

**New/Updated bots to add:**

| User-Agent | Operator | Category | Notes |
|-----------|----------|----------|-------|
| `Gemini-Deep-Research` | Google | AI Search Bot | Fetches content for Gemini Deep Research feature (Dec 2025) |
| `Claude-User/1.0` | Anthropic | User-Triggered | User-initiated web access in Claude |
| `Perplexity-User/1.0` | Perplexity | User-Triggered | Known to sometimes ignore robots.txt |

**Deprecated bots (confirmed July 2024):**
- `anthropic-ai` -- replaced by `ClaudeBot`
- `claude-web` -- replaced by `ClaudeBot`
(Note: ClaudeBot still honors rules set for the deprecated names for backwards compatibility)

**Updated three-tier preset system (per CONTEXT.md):**

**Open preset (maximize AI visibility):**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml
```

**Selective preset (allow search, block training-only):**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI Search Bots -- ALLOW
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Gemini-Deep-Research
Allow: /

# AI Training Bots -- BLOCK
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

**Restrictive preset (block all AI bots):**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# Block ALL AI bots (both search and training)
User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Gemini-Deep-Research
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-SearchBot
Disallow: /

User-agent: Claude-User
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Perplexity-User
Disallow: /

User-agent: DuckAssistBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

### 6. Webmaster Tools Verification Methods (All Four Platforms)

**Confidence: HIGH** (verified via official documentation for each platform)

#### Google Search Console

| Method | How It Works | Best For |
|--------|-------------|----------|
| HTML file upload | Download `google*.html`, place in site root | Full server access |
| HTML meta tag | Add `<meta name="google-site-verification" content="...">` to `<head>` | CMS or framework projects |
| DNS TXT record | Add TXT record to DNS | Domain-level verification |
| Google Analytics | Auto-detect existing GA tracking code | Sites with GA installed |
| Google Tag Manager | Auto-detect existing GTM container | Sites with GTM installed |

**Post-verification:** Navigate to Sitemaps report, enter sitemap URL, click Submit.

**Next.js verification shortcut:**
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  verification: {
    google: 'your-google-verification-code',
    other: { 'msvalidate.01': 'your-bing-verification-code' },
  },
}
```

#### Bing Webmaster Tools

| Method | How It Works | Best For |
|--------|-------------|----------|
| XML file upload | Download BingSiteAuth.xml, place in site root | Full server access |
| HTML meta tag | Add `<meta name="msvalidate.01" content="...">` to `<head>` | CMS or framework projects |
| CNAME DNS record | Add CNAME record to DNS | Domain-level verification |
| Google Search Console import | Auto-import from verified GSC account | Sites already verified in GSC |

**Post-verification:** Navigate to Sitemaps, enter sitemap URL, submit. Bing crawls sitemap at least once per day.

#### Yandex Webmaster

| Method | How It Works | Best For |
|--------|-------------|----------|
| HTML file upload | Upload yandex_*.html to site root | Full server access |
| HTML meta tag | Add `<meta name="yandex-verification" content="...">` to `<head>` | CMS or framework projects |
| DNS TXT record | Add TXT record to DNS | Domain-level verification |
| WHOIS verification | Auto-verify via domain WHOIS record | .ru domains only |

**Post-verification:** Navigate to Indexing > Sitemap files, enter sitemap URL, click Add. Processing takes up to 2 weeks.

**Next.js verification shortcut:**
```tsx
export const metadata: Metadata = {
  verification: {
    yandex: 'your-yandex-verification-code',
  },
}
```

#### Naver Search Advisor

| Method | How It Works | Best For |
|--------|-------------|----------|
| HTML file upload | Upload naver-site-verification file to site root | Full server access |
| HTML meta tag | Add `<meta name="naver-site-verification" content="...">` to `<head>` | CMS or framework projects |

**Post-verification:** Navigate to Request > Submit Sitemap, enter sitemap URL, click Add. Max 50,000 URLs per sitemap, max 10MB file size. Indexing takes up to 14 days.

### 7. Unified Indexing Strategy

**Confidence: HIGH** (protocols and behaviors well-documented)

#### Engine x Method Matrix

| Engine | IndexNow | Sitemap | Webmaster Tools | Sitemap Ping | Notes |
|--------|----------|---------|-----------------|-------------|-------|
| Google | No | Yes | GSC submission | Deprecated (2023) | sitemaps + GSC only path |
| Bing | Yes | Yes | Bing WMT | N/A (use IndexNow) | IndexNow preferred |
| Yandex | Yes | Yes | Yandex Webmaster | N/A (use IndexNow) | IndexNow preferred |
| Naver | Yes | Yes | Naver Search Advisor | N/A (use IndexNow) | IndexNow preferred |
| Seznam | Yes | Yes | N/A | N/A | IndexNow auto-shared |
| Yep | Yes | Yes | N/A | N/A | IndexNow auto-shared |
| Internet Archive | Yes | N/A | N/A | N/A | Preservation, not search |
| Amazon | Yes | N/A | N/A | N/A | Alexa/AI features |

#### Project-Type Recipes

**Static blog / marketing site:**
- Build: Generate sitemap via framework
- Deploy: Submit changed URLs to IndexNow via build script or `astro-indexnow`
- Once: Submit sitemap to GSC, Bing WMT, Yandex, Naver
- Ongoing: Sitemaps auto-update on rebuild; IndexNow handles Bing/Yandex/Naver

**E-commerce / CMS-driven site:**
- Runtime: IndexNow Route Handler triggered on product/content publish
- Batch: Submit bulk URLs on inventory updates (up to 10,000 per call)
- Sitemap: Dynamic sitemap with accurate `lastmod` dates
- GSC: Sitemap auto-crawled; manual resubmit only if major URL structure changes

**SaaS landing page (few pages, infrequent changes):**
- Sitemap: Static sitemap, submit to GSC once
- IndexNow: Optional -- few pages don't benefit much from instant indexing
- Focus: GSC monitoring for indexing issues

### 8. Content-Hash Tracking Approaches

**Confidence: HIGH** (patterns well-understood; `astro-indexnow` demonstrates production approach)

| Approach | Best For | Pros | Cons |
|----------|---------|------|------|
| In-memory Map | Next.js serverless | Simple, no external deps | Lost on cold start; OK for edge/serverless warm instances |
| File-based JSON cache | Astro SSG (CI/CD) | Persists between builds if committed | Not suitable for runtime/SSR |
| KV store (Redis, Vercel KV) | High-traffic SSR sites | Persistent, shared across instances | External dependency |
| Database column | CMS-driven sites | Content hash computed on save | Requires schema change |

**`astro-indexnow` approach (reference implementation):**
1. Scan HTML output directory after build
2. SHA-256 hash each page's HTML content
3. Compare against `.astro-indexnow-cache.json` from previous build
4. Submit only new or changed URLs
5. Update cache file

**Next.js recommended approach:**
- For most sites: In-memory `Map<string, string>` in the Route Handler module scope
- Content hash computed at publish time (CMS webhook payload or ISR revalidation)
- For persistent tracking: Vercel KV, Upstash Redis, or database column

## Code Examples

### IndexNow Key Verification File Endpoint (Next.js)

```typescript
// app/[key]/route.ts -- serves the IndexNow key verification file
// Alternative: just put a static file in public/{key}.txt
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

### llms.txt Auto-Generation from Sitemap (Next.js)

```typescript
// app/llms.txt/route.ts
import { NextResponse } from 'next/server'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? 'Site description'

// Define your page structure for llms.txt
const pages = {
  'Main Pages': [
    { title: 'Home', path: '/', description: 'Landing page' },
    { title: 'About', path: '/about', description: 'Company information' },
    { title: 'Blog', path: '/blog', description: 'Articles and updates' },
  ],
  'Documentation': [
    { title: 'Getting Started', path: '/docs/getting-started', description: 'Quick start guide' },
    { title: 'API Reference', path: '/docs/api', description: 'API documentation' },
  ],
  'Optional': [
    { title: 'Changelog', path: '/changelog', description: 'Release history' },
    { title: 'Legal', path: '/legal', description: 'Terms and privacy' },
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

### AI-Aware robots.ts with Preset Selection (Next.js)

```typescript
// app/robots.ts -- generates robots.txt with AI crawler presets
import type { MetadataRoute } from 'next'

type AIPreset = 'open' | 'selective' | 'restrictive'

// Configure via environment variable or hardcode
const AI_PRESET: AIPreset = (process.env.AI_ROBOTS_PRESET as AIPreset) ?? 'selective'

const AI_SEARCH_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot',
  'DuckAssistBot', 'Claude-SearchBot', 'Applebot',
  'Gemini-Deep-Research',
]

const AI_TRAINING_BOTS = [
  'GPTBot', 'Google-Extended', 'ClaudeBot', 'CCBot',
  'Meta-ExternalAgent', 'Bytespider', 'cohere-ai',
  'Amazonbot', 'Applebot-Extended',
]

const AI_USER_TRIGGERED = [
  'Claude-User', 'Perplexity-User',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
  ]

  if (AI_PRESET === 'selective') {
    // Allow search bots explicitly
    for (const bot of AI_SEARCH_BOTS) {
      rules.push({ userAgent: bot, allow: '/' })
    }
    // Block training bots
    for (const bot of AI_TRAINING_BOTS) {
      rules.push({ userAgent: bot, disallow: '/' })
    }
  } else if (AI_PRESET === 'restrictive') {
    // Block ALL AI bots
    for (const bot of [...AI_SEARCH_BOTS, ...AI_TRAINING_BOTS, ...AI_USER_TRIGGERED]) {
      rules.push({ userAgent: bot, disallow: '/' })
    }
  }
  // 'open' preset: no additional rules needed, wildcard allows all

  return { rules, sitemap: `${baseUrl}/sitemap.xml` }
}
```

### Astro llms.txt (Static File)

```markdown
---
// src/pages/llms.txt.ts -- Astro static endpoint
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const content = `# ${import.meta.env.SITE_NAME}

> ${import.meta.env.SITE_DESCRIPTION}

## Main Pages

- [Home](${import.meta.env.SITE}/): Landing page
- [About](${import.meta.env.SITE}/about): Company information
- [Blog](${import.meta.env.SITE}/blog): Articles and updates

## Optional

- [Changelog](${import.meta.env.SITE}/changelog): Release history
`

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google sitemap ping | GSC submission + robots.txt Sitemap directive | June 2023 (deprecated) | Old ping returns 404; no harm but no benefit |
| Block all AI bots | Three-tier taxonomy (search/training/user-triggered) | 2024-2025 AI search explosion | Blanket blocks kill AI search visibility |
| No AI content guidance | llms.txt at site root | Sep 2024 (proposed) | ~844k sites adopted; uncertain AI platform consumption |
| Submit to each IndexNow engine separately | Global `api.indexnow.org` endpoint | 2023+ (global endpoint available) | Single call distributes to all 7 engines |
| No content-hash tracking | Hash-based change detection before IndexNow submission | Best practice since 2023 | Prevents spam flags, conserves API quota |
| `anthropic-ai` / `claude-web` user agents | `ClaudeBot` / `Claude-User` / `Claude-SearchBot` | July 2024 | Old names deprecated but still honored for backwards compat |
| Google-Extended for Gemini training only | Google-Extended (training) + Gemini-Deep-Research (search) | Dec 2025 | New bot for real-time Gemini search browsing |

## Open Questions

1. **IndexNow exact daily rate limits per engine**
   - What we know: Each engine sets its own limits; 10,000 URLs per POST; HTTP 429 on rate limit
   - What's unclear: Exact daily quotas per engine are not published
   - Recommendation: Implement content-hash tracking to minimize submissions; handle 429 with exponential backoff and Retry-After header

2. **llms.txt actual consumption by AI platforms**
   - What we know: ~844k sites have llms.txt; no AI platform has confirmed reading it
   - What's unclear: Whether OpenAI, Google, or Anthropic crawlers actually parse llms.txt
   - Recommendation: Include in skill as forward-looking, low-effort convention. Don't present as critical SEO requirement

3. **Perplexity-User robots.txt compliance**
   - What we know: Multiple sources report Perplexity-User sometimes ignores robots.txt
   - What's unclear: Whether this has been fixed or is intentional
   - Recommendation: Flag in skill as known issue; include in robots.txt anyway (some compliance is better than none)

4. **Internet Archive and Amazon IndexNow usage**
   - What we know: Both appear in official `searchengines.json` registry
   - What's unclear: How Internet Archive and Amazon use submitted URLs (archival? search? AI training?)
   - Recommendation: Mention their participation for completeness; no action needed from site owners

5. **Naver Search Advisor international site limitations**
   - What we know: Naver Search Advisor works for any domain; verification via HTML file or meta tag
   - What's unclear: Whether non-Korean language sites get meaningful indexing in Naver
   - Recommendation: Include Naver workflows for completeness (per CONTEXT.md decision for international projects); note it's primarily relevant for Korean market visibility

## Sources

### Primary (HIGH confidence)
- [IndexNow Official Documentation](https://www.indexnow.org/documentation) -- API spec, request format, response codes
- [IndexNow FAQ](https://www.indexnow.org/faq) -- Rate limits, participating engines, key management
- [IndexNow searchengines.json](https://www.indexnow.org/searchengines.json) -- Official registry of 7 participating engines
- [Anthropic Crawler Documentation](https://support.claude.com/en/articles/8896518) -- Official ClaudeBot, Claude-User, Claude-SearchBot specs
- [Google Sitemap Ping Deprecation](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping) -- June 2023 deprecation announcement
- [Bing Webmaster Tools Verification](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b) -- Four verification methods
- [Google Search Console Verification](https://support.google.com/webmasters/answer/9008080) -- Five verification methods
- [llmstxt.org Specification](https://llmstxt.org/) -- Official llms.txt format specification
- [astro-indexnow GitHub](https://github.com/velohost/astro-indexnow) -- v2.1.0 documentation, change detection mechanism
- Phase 14 Research (14-RESEARCH.md) -- AI crawler taxonomy, Next.js 16 Route Handler patterns, robots.ts API

### Secondary (MEDIUM confidence)
- [Search Engine Journal AI Crawler List (Dec 2025)](https://www.searchenginejournal.com/ai-crawler-user-agents-list/558130/) -- Comprehensive user-agent strings with version numbers
- [Mintlify llms.txt Examples](https://www.mintlify.com/blog/real-llms-txt-examples) -- Real-world llms.txt implementations from Anthropic, Cloudflare, Stripe
- [InterAd Naver Search Advisor Guide (2025)](https://www.interad.com/en/insights/naver-search-advisor-a-full-guide) -- Naver verification and sitemap submission
- [Yoast SEO llms.txt Spec](https://developer.yoast.com/features/llms-txt/functional-specification/) -- Auto-generation implementation reference
- [llms-txt.io llms-full.txt Guide](https://llms-txt.io/blog/how-to-create-llms-full-txt) -- llms-full.txt creation process

### Tertiary (LOW confidence)
- llms.txt actual AI platform consumption -- No AI platform has confirmed reading llms.txt
- Perplexity-User robots.txt compliance -- Reported as non-compliant by multiple sources; may change
- IndexNow exact daily rate limits -- Per-engine thresholds not published
- Naver international site indexing effectiveness -- Limited documentation for non-Korean sites

## Metadata

**Confidence breakdown:**
- IndexNow protocol: HIGH -- Official spec, registry, and response codes verified
- Google non-support: HIGH -- Confirmed via official registry and multiple sources
- astro-indexnow: HIGH -- GitHub repo and npm package verified at v2.1.0
- llms.txt spec: HIGH for format, MEDIUM for adoption impact
- AI crawler taxonomy: HIGH -- Updated with Dec 2025 additions (Gemini-Deep-Research)
- Webmaster tools workflows: HIGH -- All four platforms verified via official docs
- Content-hash tracking: HIGH -- Pattern well-established, reference implementation in astro-indexnow
- Rate limits: MEDIUM -- Existence confirmed, exact thresholds unpublished

**Research date:** 2026-02-25
**Valid until:** 60 days for protocols and APIs (stable), 30 days for AI crawler list (fast-moving), 14 days for llms.txt adoption status (rapidly evolving)
