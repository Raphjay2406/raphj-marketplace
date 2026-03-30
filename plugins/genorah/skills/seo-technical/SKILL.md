---
name: "seo-technical"
description: "Technical SEO infrastructure: sitemaps, robots.txt (3-tier AI strategy), canonicals, hreflang, meta tags, Open Graph, Core Web Vitals, image SEO, internal linking, and search console submission workflows."
tier: "core"
triggers: "seo, sitemap, robots.txt, meta tags, canonical, hreflang, open graph, search console, indexnow, webmaster"
version: "2.0.0"
---

## Layer 1: Decision Guidance

Technical SEO is the foundation that determines whether content can be discovered, crawled, indexed, and presented correctly by search engines and AI systems. Without correct technical SEO, even exceptional design and content remain invisible. Every public-facing page requires baseline technical SEO; the depth of implementation varies by page type and project scope.

### When to Use

- **Every public-facing website** -- baseline technical SEO (sitemap, robots.txt, meta tags, canonicals) is non-negotiable
- **Multi-language sites** -- hreflang implementation prevents duplicate content penalties and ensures correct language serving
- **Sites targeting social sharing** -- Open Graph and Twitter Card meta tags control how links appear when shared
- **Performance-sensitive projects** -- Core Web Vitals directly affect search ranking (10-15% weight)
- **Image-heavy portfolios, e-commerce, editorial** -- image SEO (alt text, formats, lazy loading, srcset) is critical
- **Sites with 50+ pages** -- internal linking architecture and sitemap strategy become essential
- **New site launches or domain migrations** -- search console submission workflows accelerate indexing

### When NOT to Use

- **Private dashboards behind authentication** -- search engines cannot crawl them; technical SEO adds no value
- **Tauri/Electron desktop apps** -- no web crawling occurs
- **For JSON-LD structured data** -- use the `structured-data-v2` skill. Technical SEO and structured data are complementary; most pages need BOTH
- **For AI search content optimization** -- use the `geo-optimization` skill. This skill handles crawlability and metadata; GEO handles content structure for AI engines

### SEO Checklist Decision Tree

Select checks based on page type. Every page gets the baseline; additional checks layer on.

**Baseline (every page):**
- [ ] Unique `<title>` tag (50-60 chars, keyword-front-loaded)
- [ ] Unique `<meta name="description">` (140-160 chars, includes CTA)
- [ ] Self-referencing canonical URL
- [ ] Open Graph tags (title, description, image, url, type)
- [ ] Proper heading hierarchy (single H1, sequential H2-H6)
- [ ] All images have descriptive alt text
- [ ] Page loads within Core Web Vitals thresholds

**Homepage additions:**
- [ ] Organization structured data
- [ ] robots.txt with 3-tier AI strategy
- [ ] XML sitemap linked in robots.txt
- [ ] Favicon and apple-touch-icon

**Blog post additions:**
- [ ] Article/BlogPosting structured data
- [ ] Author markup
- [ ] datePublished and dateModified
- [ ] Internal links to pillar content (2-5 per 1000 words)

**Product page additions:**
- [ ] Product structured data with Offer
- [ ] Unique product descriptions (no manufacturer copy)
- [ ] Image srcset with multiple resolutions
- [ ] Canonical to avoid color/size variant duplication

**Multi-language additions:**
- [ ] Bidirectional hreflang tags on every language variant
- [ ] x-default for language selector / fallback
- [ ] hreflang in XML sitemap (alternative approach)
- [ ] Canonical + hreflang agreement (no conflicts)

### Framework Decision

- **Next.js App Router** -- use Metadata API (`generateMetadata`), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`
- **Next.js Pages Router** -- use `next-seo` package or manual `<Head>` components
- **Astro** -- use `@astrojs/sitemap`, manual `<meta>` in layouts, `astro-seo` integration
- **React/Vite SPA** -- use `react-helmet-async`, pre-rendering required for SEO (Puppeteer or similar)
- **Static sites** -- generate all meta at build time; no runtime SEO logic needed

### Pipeline Connection

- **Referenced by:** creative-director during archetype selection (performance constraints), builder during implementation, reviewer during quality gate
- **Consumed at:** `/modulo:plan-dev` generates SEO block per section in PLAN.md; `/modulo:execute` implements; `/modulo:iterate` verifies

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: XML Sitemap (Next.js App Router)

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://example.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic pages from CMS/database
  const posts = await fetchAllPosts();
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages];
}
```

#### Pattern: Sitemap Index for Large Sites (50K+ URLs)

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Next.js automatically splits into sitemap index when using generateSitemaps()
  return [];
}

// app/sitemap/[id]/route.ts -- for manual control
export async function generateSitemaps() {
  const totalProducts = await getProductCount();
  const sitemapsNeeded = Math.ceil(totalProducts / 50000);

  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }));
}
```

**Sitemap limits:** max 50,000 URLs per sitemap file, max 50MB uncompressed. Use sitemap index to split. Image sitemaps include `<image:image>` tags. Video sitemaps include `<video:video>` with thumbnail, title, description, duration. News sitemaps use `<news:news>` with publication name and date (only last 2 days).

#### Pattern: Astro Sitemap

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin/"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en-US", de: "de-DE", fr: "fr-FR" },
      },
    }),
  ],
});
```

#### Pattern: robots.txt with 3-Tier AI Crawler Strategy

The modern robots.txt must account for three distinct categories of bots. This is the canonical 3-tier strategy.

**Tier 1 -- Search Engine Crawlers (ALLOW):**
These bots index your site for traditional search results. Blocking them removes you from search entirely.

**Tier 2 -- AI Search/Retrieval Bots (ALLOW):**
These bots fetch content to answer user queries in AI-powered search (ChatGPT Search, Perplexity, Claude Search). Allowing them means your content appears in AI search results with attribution and links back.

**Tier 3 -- AI Training Bots (BLOCK):**
These bots scrape content to train foundation models. Blocking them protects your content from being absorbed into training data without compensation or attribution.

| Category | Bot | Provider | Action | Purpose |
|----------|-----|----------|--------|---------|
| Search | Googlebot | Google | Allow | Google Search indexing |
| Search | Bingbot | Microsoft | Allow | Bing Search indexing |
| Search | Applebot | Apple | Allow | Apple Search / Siri |
| Search | Yandexbot | Yandex | Allow | Yandex Search indexing |
| Search | DuckDuckBot | DuckDuckGo | Allow | DDG Search indexing |
| AI Search | OAI-SearchBot | OpenAI | Allow | ChatGPT Search retrieval |
| AI Search | ChatGPT-User | OpenAI | Allow | ChatGPT user-initiated browsing |
| AI Search | Claude-SearchBot | Anthropic | Allow | Claude Search retrieval |
| AI Search | Claude-User | Anthropic | Allow | Claude user-initiated browsing |
| AI Search | PerplexityBot | Perplexity | Allow | Perplexity answer retrieval |
| AI Search | Applebot | Apple | Allow | Apple Intelligence retrieval |
| AI Training | GPTBot | OpenAI | Block | GPT model training |
| AI Training | ClaudeBot | Anthropic | Block | Claude model training |
| AI Training | Google-Extended | Google | Block | Gemini model training |
| AI Training | Meta-ExternalAgent | Meta | Block | LLaMA model training |
| AI Training | CCBot | Common Crawl | Block | Open training dataset |
| AI Training | Bytespider | ByteDance | Block | TikTok/Doubao training |
| AI Training | Amazonbot | Amazon | Block | Alexa/Titan training |

```ts
// Next.js: app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://example.com";

  return {
    rules: [
      // Tier 1: Search engine crawlers -- full access
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "Yandexbot", "DuckDuckBot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      // Tier 2: AI search/retrieval bots -- full access
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
        ],
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      // Tier 3: AI training bots -- blocked
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Google-Extended",
          "Meta-ExternalAgent",
          "CCBot",
          "Bytespider",
          "Amazonbot",
        ],
        disallow: "/",
      },
      // Default: allow search, block private
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

```ts
// Astro: public/robots.txt (static file)
// Or generate dynamically via src/pages/robots.txt.ts:
export async function GET() {
  const content = `
# Search engine crawlers
User-agent: Googlebot
User-agent: Bingbot
User-agent: Applebot
User-agent: Yandexbot
User-agent: DuckDuckBot
Allow: /
Disallow: /admin/
Disallow: /api/

# AI search/retrieval bots
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /api/

# AI training bots -- blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Meta-ExternalAgent
User-agent: CCBot
User-agent: Bytespider
User-agent: Amazonbot
Disallow: /

# Default
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml
  `.trim();

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

#### Pattern: Canonical URLs

**Self-referencing canonical (every page):**
```html
<!-- On https://example.com/blog/seo-guide -->
<link rel="canonical" href="https://example.com/blog/seo-guide" />
```

**Rules:**
- Every page MUST have a self-referencing canonical unless it is a duplicate pointing to the canonical version
- Always use absolute URLs with protocol (https://)
- Use lowercase, no trailing slash (pick one convention and enforce it)
- Pagination: each page self-references; use `rel="prev"` / `rel="next"` additionally
- Cross-domain canonical: only when content is intentionally syndicated
- Canonical + hreflang: the canonical URL for each language version must be itself (not the default language). Hreflang and canonical must not contradict each other

**Next.js pattern:**
```ts
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://example.com/blog/${params.slug}`,
    },
  };
}
```

#### Pattern: Hreflang Implementation

Hreflang tells search engines which language/region version to serve. Every implementation must be bidirectional (page A references page B AND page B references page A).

**Format:** `<language>-<region>` using ISO 639-1 (language) + ISO 3166-1 Alpha-2 (region).

| Code | Meaning |
|------|---------|
| `en` | English (all regions) |
| `en-US` | English (United States) |
| `en-GB` | English (United Kingdom) |
| `de` | German (all regions) |
| `de-AT` | German (Austria) |
| `de-CH` | German (Switzerland) |
| `fr` | French (all regions) |
| `x-default` | Fallback / language selector page |

**Next.js generateMetadata pattern:**
```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  return {
    alternates: {
      canonical: `https://example.com/en/blog/${slug}`,
      languages: {
        "en": `https://example.com/en/blog/${slug}`,
        "de": `https://example.com/de/blog/${slug}`,
        "fr": `https://example.com/fr/blog/${slug}`,
        "x-default": `https://example.com/en/blog/${slug}`,
      },
    },
  };
}
```

**XML sitemap approach (alternative for large sites):**
```xml
<url>
  <loc>https://example.com/en/blog/seo-guide</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/blog/seo-guide"/>
  <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/blog/seo-guide"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/blog/seo-guide"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/seo-guide"/>
</url>
```

#### Pattern: Meta Tags

**Title tag rules:**
- 50-60 characters (Google truncates at ~60)
- Front-load the primary keyword
- Include brand name at end with separator: `Primary Keyword | Brand Name`
- Every page MUST have a unique title

**Meta description rules:**
- 140-160 characters (Google truncates at ~160)
- Include primary keyword naturally
- Include a call-to-action or value proposition
- Every page MUST have a unique description

**Meta robots directives:**

| Directive | Effect |
|-----------|--------|
| `index` | Allow indexing (default) |
| `noindex` | Prevent indexing |
| `follow` | Follow links on this page (default) |
| `nofollow` | Do not follow links |
| `noarchive` | Do not show cached version |
| `nosnippet` | Do not show text snippet |
| `max-snippet:N` | Limit text snippet to N characters |
| `max-image-preview:large` | Allow large image preview |
| `max-video-preview:N` | Limit video preview to N seconds |

**Next.js Metadata API pattern:**
```ts
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: `${post.title} | Brand Name`,
    description: post.excerpt.slice(0, 160),
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    alternates: {
      canonical: `https://example.com/blog/${params.slug}`,
    },
  };
}
```

#### Pattern: Open Graph + Twitter Cards

**Required Open Graph tags:**

| Tag | Value | Notes |
|-----|-------|-------|
| `og:title` | Page title | Can differ from `<title>` for social context |
| `og:description` | Summary | 1-2 sentences, compelling for social |
| `og:image` | Image URL | 1200x630px, absolute URL, < 8MB |
| `og:url` | Canonical URL | Must match `<link rel="canonical">` |
| `og:type` | `website` / `article` | `article` for blog posts with additional article:* tags |
| `og:site_name` | Brand name | Consistent across all pages |

**Twitter Card tags:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@BrandHandle" />
<!-- Twitter falls back to og:title, og:description, og:image if twitter:* not set -->
```

**Dynamic OG Image (Next.js):**
```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Blog post title";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.2 }}>
          {post.title}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 24 }}>
          {post.author} · {post.readTime} min read
        </div>
      </div>
    ),
    { ...size }
  );
}
```

#### Pattern: Core Web Vitals

Core Web Vitals carry 10-15% ranking weight and are measured on mobile-first indexing.

| Metric | Good | Needs Improvement | Poor | What It Measures |
|--------|------|-------------------|------|-----------------|
| **LCP** | <= 2.5s | <= 4.0s | > 4.0s | Largest Contentful Paint -- loading performance |
| **INP** | <= 200ms | <= 500ms | > 500ms | Interaction to Next Paint -- responsiveness (replaced FID March 2024) |
| **CLS** | <= 0.1 | <= 0.25 | > 0.25 | Cumulative Layout Shift -- visual stability |

**INP is the hardest metric** -- 43% of sites fail INP thresholds. Key fixes:
- Break long tasks with `requestIdleCallback` or `scheduler.yield()`
- Minimize main-thread JavaScript
- Use `will-change` for elements that animate
- Avoid synchronous layout reads followed by writes (forced reflow)

**LCP optimization:**
- Preload LCP image: `<link rel="preload" as="image" href="..." fetchpriority="high" />`
- Use `loading="eager"` and `fetchpriority="high"` on LCP element
- Inline critical CSS, defer non-critical
- Server-side render the above-fold content

**CLS prevention:**
- Always set `width` and `height` on images and videos
- Reserve space for dynamic content (ads, embeds)
- Use CSS `aspect-ratio` for responsive media
- Avoid inserting content above existing content after load

#### Pattern: Image SEO

**Alt text rules:**
- Describe the image content, not the page context
- Include relevant keywords naturally (no stuffing)
- 80-125 characters recommended
- Decorative images: `alt=""` (empty string, not omitted)
- Never start with "Image of..." or "Photo of..."

**Format priority:** AVIF > WebP > JPEG (for photos), AVIF > WebP > PNG (for graphics with transparency)

**Loading strategy:**
```tsx
// LCP image (above the fold) -- eager load with high priority
<Image
  src="/hero.avif"
  alt="Descriptive alt text for hero image"
  width={1200}
  height={800}
  loading="eager"
  fetchPriority="high"
  sizes="100vw"
  priority  // Next.js: adds preload link
/>

// Below-fold images -- lazy load
<Image
  src="/feature.avif"
  alt="Descriptive alt text for feature"
  width={600}
  height={400}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Filename convention:** Use descriptive, hyphenated filenames. `blue-running-shoes-nike.avif` not `IMG_4532.jpg`.

#### Pattern: Internal Linking Architecture

**Rules:**
- Every page reachable within 3 clicks from homepage (crawl depth)
- Pillar-cluster model: pillar page links to all cluster pages; cluster pages link back to pillar
- 2-5 internal links per 1000 words of content
- Use descriptive anchor text (not "click here" or "read more")
- Top 30% of a page's content carries the most link weight -- place important links early
- Breadcrumbs count as internal links and reinforce hierarchy
- Navigation links distribute PageRank across the site

**URL structure rules:**
- Lowercase only
- Hyphens as word separators (not underscores)
- Flat hierarchy preferred: `/blog/post-slug` not `/blog/2024/01/category/post-slug`
- No file extensions in URLs
- No query parameters for content pages (use path segments)
- Trailing slash: pick one convention and enforce sitewide

#### Pattern: Search Console Submission Workflows

**Google Search Console (GSC):**
1. Verify ownership via DNS TXT record (most reliable), HTML file, or meta tag
2. Submit sitemap: GSC > Sitemaps > Enter `sitemap.xml` URL
3. URL Inspection API: request indexing for individual URLs (limit: 2000 requests/day)
4. Monitor: Coverage report for indexing issues, Core Web Vitals report, Mobile Usability

**Bing Webmaster Tools:**
1. Import from GSC (fastest setup) or verify via DNS/meta tag
2. Submit sitemap in Bing Webmaster > Sitemaps
3. IndexNow is built into Bing -- submitting via IndexNow automatically covers Bing

**IndexNow Protocol:**
IndexNow instantly notifies participating search engines (Bing, Yandex, Naver, Seznam) when content changes. Google does NOT participate but monitors the protocol.

```ts
// 1. Generate API key and place at site root
// https://example.com/{api-key}.txt (contains the key itself)

// 2. Single URL submission
const submitUrl = async (url: string) => {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "example.com",
      key: process.env.INDEXNOW_API_KEY,
      keyLocation: `https://example.com/${process.env.INDEXNOW_API_KEY}.txt`,
      urlList: [url],
    }),
  });
  return response.status; // 200=OK, 202=Accepted, 400=Bad request, 403=Forbidden, 429=Rate limited
};

// 3. Batch submission (up to 10,000 URLs per request)
const submitBatch = async (urls: string[]) => {
  const batches = chunk(urls, 10000);
  for (const batch of batches) {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "example.com",
        key: process.env.INDEXNOW_API_KEY,
        keyLocation: `https://example.com/${process.env.INDEXNOW_API_KEY}.txt`,
        urlList: batch,
      }),
    });
  }
};

// 4. CI/CD hook: submit changed URLs on deploy
// In your deployment pipeline (e.g., Vercel deploy hook, GitHub Action):
// - Compare current sitemap with previous
// - Submit only changed/new URLs via IndexNow
```

**Response codes:**
| Code | Meaning | Action |
|------|---------|--------|
| 200 | URL submitted successfully | None |
| 202 | URL accepted, will be processed | None |
| 400 | Invalid request | Check URL format and key |
| 403 | Key not valid for this URL | Verify key file at root |
| 422 | Invalid URL | URL does not belong to host |
| 429 | Rate limited | Back off and retry |

**Baidu URL Push API (China market):**
```bash
curl -X POST "http://data.zz.baidu.com/urls?site=https://example.com&token=YOUR_TOKEN" \
  -H "Content-Type: text/plain" \
  --data-raw "https://example.com/page1
https://example.com/page2"
```

#### Pattern: Pipeline SEO Block

During `/modulo:plan-dev`, the planner generates an SEO block for each section in PLAN.md:

```yaml
# SEO Configuration
seo:
  page_title: "Primary Keyword - Secondary Keyword | Brand Name"
  meta_description: "Compelling 140-160 char description with keyword and CTA."
  canonical: "https://example.com/page-slug"
  og_image: "auto-generate" # or specific image path
  heading_hierarchy:
    h1: "Main Page Heading with Primary Keyword"
    h2s:
      - "Supporting Topic A"
      - "Supporting Topic B"
      - "FAQ Section"
  structured_data: ["Organization", "BreadcrumbList", "FAQPage"]
  images:
    - alt: "Descriptive alt text"
      loading: "eager"  # LCP image
      priority: true
    - alt: "Another descriptive alt"
      loading: "lazy"
```

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `bg`, `surface` | Background colors affect CLS (no layout shift from theme loading) |
| `text` | Contrast ratio impacts accessibility and indirectly SEO |
| `primary` | OG image generation uses primary brand color |
| `display-font` | OG image uses display font for titles |
| `motion-*` | Excessive animation harms INP scores |

### Archetype Variants

Technical SEO implementation is largely archetype-agnostic -- the same sitemap, robots.txt, and meta tag patterns apply regardless of visual style. Key variations:

| Archetype | SEO Consideration |
|-----------|------------------|
| Kinetic, Glassmorphism | Heavy animation risks INP failure; test interaction responsiveness |
| Data-Dense | Many images and charts; aggressive lazy loading required |
| 3D/WebGL-heavy | LCP risk from large asset loading; use progressive loading |
| Japanese Minimal | Minimal content per page; ensure meta descriptions are substantive |
| Editorial, Dark Academia | Long-form content; internal linking architecture is critical |
| E-commerce archetypes | Product schema, faceted navigation canonical strategy |

### Pipeline Stage

- **Input from:** Project discovery (target keywords, audience, markets), Design DNA (brand colors for OG images), archetype selection (performance constraints)
- **Output to:** Section PLAN.md (SEO block per page), builder implementation, reviewer quality gate verification

### Related Skills

- `structured-data-v2` -- JSON-LD implementation; this skill handles meta tags and infrastructure, structured-data handles schema markup
- `geo-optimization` -- AI search visibility; this skill handles crawlability, GEO handles content optimization for AI engines
- `accessibility` -- Heading hierarchy and alt text overlap; both skills enforce similar standards
- `performance` -- Core Web Vitals are shared territory; this skill defines the SEO targets, performance skill provides optimization techniques
- `responsive-design` -- Mobile-first indexing means responsive design is an SEO requirement

## Layer 4: Anti-Patterns

### Anti-Pattern: Missing or Misconfigured Sitemap

**What goes wrong:** Site has no `sitemap.xml`, or sitemap contains URLs that return 404/301, or sitemap is not linked in robots.txt. Search engines cannot efficiently discover all pages. Large sites without sitemap index exceed the 50K URL / 50MB limit.
**Instead:** Generate sitemap from actual routes at build time. Validate all URLs return 200. Link sitemap in robots.txt. Use sitemap index for sites with 50K+ URLs. Submit to GSC and Bing.

### Anti-Pattern: Blocking CSS/JS in robots.txt

**What goes wrong:** robots.txt blocks `/css/`, `/js/`, or `/_next/static/` thinking it saves crawl budget. Google needs these resources to render pages for mobile-first indexing. Blocked rendering resources cause "page not indexed" errors.
**Instead:** Only block truly private paths (`/admin/`, `/api/`). Allow all static assets. Check GSC URL Inspection to verify Google can fully render pages.

### Anti-Pattern: Skipped Heading Levels

**What goes wrong:** Page jumps from H1 to H3, or uses multiple H1 tags, or uses heading tags for styling rather than structure. Search engines use heading hierarchy to understand content structure. Skipped levels signal broken document structure.
**Instead:** Single H1 per page (the main topic). Sequential H2-H6 without skipping. Use CSS classes for visual sizing, not heading levels.

### Anti-Pattern: Missing or Duplicate Canonicals

**What goes wrong:** Pages lack canonical tags entirely (every URL variant becomes a separate indexed page), or all pages point canonical to the homepage (destroys indexing of all other pages), or paginated pages all point to page 1 (pages 2+ never get indexed).
**Instead:** Every page gets a self-referencing canonical. Pagination pages self-reference. Only point canonical elsewhere when content is genuinely duplicated. Canonical URL must match the URL users see.

### Anti-Pattern: HTTP Without HTTPS Redirect

**What goes wrong:** Site serves on both HTTP and HTTPS, or HTTP does not redirect to HTTPS. Google penalizes non-HTTPS sites. Duplicate content issues arise from both versions being indexed.
**Instead:** Force HTTPS everywhere. 301 redirect all HTTP to HTTPS. Set canonical URLs with `https://` protocol. HSTS header for additional security.

### Anti-Pattern: Missing Open Graph Image

**What goes wrong:** Page has no `og:image` tag. Social shares show no image or a random scraped image. Click-through rates from social media drop significantly (posts with images get 2.3x more engagement).
**Instead:** Every page gets an OG image (1200x630px). Generate dynamic OG images for content pages using `next/og` or similar. Fall back to a branded default image for pages without specific visuals.

### Anti-Pattern: Ignoring Core Web Vitals

**What goes wrong:** Site scores poorly on LCP (large unoptimized hero images), INP (heavy JavaScript blocking interactions), or CLS (images without dimensions, late-loading content). 10-15% of ranking signal comes from page experience, and 43% of sites currently fail INP.
**Instead:** Measure with PageSpeed Insights and Chrome UX Report. Optimize LCP image (preload, eager, fetchpriority). Break long tasks for INP. Set explicit dimensions on all media for CLS. Test on real mobile devices, not just desktop.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| title_length | 30 | 60 | chars | HARD -- reject if outside range |
| meta_description_length | 80 | 160 | chars | HARD -- reject if outside range |
| og_image_width | 1200 | 1200 | px | HARD -- must be exactly 1200 |
| og_image_height | 630 | 630 | px | HARD -- must be exactly 630 |
| lcp_threshold | 0 | 2500 | ms | HARD -- must be at or below 2.5s |
| inp_threshold | 0 | 200 | ms | HARD -- must be at or below 200ms |
| cls_threshold | 0 | 0.1 | score | HARD -- must be at or below 0.1 |
| heading_hierarchy_skip | 0 | 0 | levels | HARD -- no skipping allowed |
| h1_count | 1 | 1 | per page | HARD -- exactly one H1 per page |
| max_crawl_depth | 1 | 3 | clicks | SOFT -- warn if pages deeper than 3 clicks |
| internal_links_per_1000_words | 2 | 5 | links | SOFT -- warn if outside range |
| sitemap_max_urls | 1 | 50000 | urls | HARD -- split into index if exceeded |
| sitemap_max_size | 1 | 50 | MB | HARD -- split if exceeded |
| alt_text_length | 1 | 125 | chars | SOFT -- warn if empty or too long |
