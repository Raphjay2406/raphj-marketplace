---
name: seo-meta
description: "SEO & metadata: sitemaps (Google/Bing compliant), robots.txt, JSON-LD structured data, Open Graph, meta tags, IndexNow, canonical URLs, GEO (Generative Engine Optimization). Works with Next.js and Astro."
---

Use this skill when the user mentions SEO, metadata, sitemap, robots.txt, structured data, JSON-LD, Open Graph, meta tags, Google Search Console, Bing Webmaster, schema markup, canonical URL, IndexNow, or GEO. Triggers on: SEO, metadata, sitemap, robots.txt, JSON-LD, Open Graph, meta, schema, canonical, search console, webmaster, IndexNow, GEO, structured data.

You are an expert at implementing SEO that passes Google Search Console and Bing Webmaster Tools validation without errors.

## Sitemap (Google & Bing Compliant)

### Next.js: Dynamic Sitemap

```tsx
// app/sitemap.ts — auto-generates /sitemap.xml
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]

  // Dynamic pages (fetch from CMS/DB)
  const posts = await fetch(`${baseUrl}/api/posts`).then(r => r.json())
  const blogPages: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
```

### Next.js: Sitemap Index (Large Sites, 50k+ URLs)

```tsx
// For 50k+ URLs, create multiple sitemap files:
// app/sitemaps/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const page = parseInt(params.id)
  const perPage = 50000
  const posts = await getPosts({ offset: page * perPage, limit: perPage })

  const xml = generateSitemapXml(posts) // Build XML string from posts
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
  })
}

// Google and Bing allow max 50,000 URLs per sitemap file
// Max 50MB uncompressed per file
// Use sitemap index to link multiple sitemaps
```

### Astro: Sitemap Integration

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/admin/'), // Exclude admin pages
      customPages: ['https://example.com/external-page'], // Add non-Astro pages
      serialize: (item) => {
        // Customize per-page
        if (item.url === 'https://example.com/') {
          item.priority = 1.0
          item.changefreq = 'daily'
        }
        return item
      },
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          ar: 'ar-SA',
        },
      },
    }),
  ],
})
```

### Sitemap Validation Rules

```
Google Search Console requirements:
- UTF-8 encoded XML
- Max 50,000 URLs per sitemap file
- Max 50MB uncompressed per file
- All URLs must be from the same domain as the sitemap
- Use <lastmod> in W3C datetime format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+00:00
- <changefreq> and <priority> are optional hints (Google may ignore them)
- Submit at: https://search.google.com/search-console > Sitemaps

Bing Webmaster Tools requirements:
- Same XML format as Google (sitemaps.org protocol)
- Max 50,000 URLs per sitemap
- Max 10MB compressed / 50MB uncompressed
- Supports sitemap index files
- Submit at: https://www.bing.com/webmasters > Sitemaps
- Also supports IndexNow for instant submission
```

## robots.txt

### Next.js

```tsx
// app/robots.ts — auto-generates /robots.txt
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://example.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/', // Allow AI crawlers for GEO
      },
      {
        userAgent: 'Google-Extended',
        allow: '/', // Allow Google AI training
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
```

### Astro

```
// public/robots.txt (static file)
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://example.com/sitemap-index.xml
Host: https://example.com
```

## Meta Tags & Open Graph

### Next.js: Metadata API

```tsx
// app/layout.tsx — global defaults
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Example — Build Amazing Products',
    template: '%s | Example',
  },
  description: 'The modern development platform for ambitious teams.',
  keywords: ['development', 'platform', 'SaaS', 'tools'],
  authors: [{ name: 'Example Inc.' }],
  creator: 'Example Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'Example',
    title: 'Example — Build Amazing Products',
    description: 'The modern development platform for ambitious teams.',
    images: [
      {
        url: '/og-image.png', // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: 'Example — Build Amazing Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Example — Build Amazing Products',
    description: 'The modern development platform for ambitious teams.',
    images: ['/og-image.png'],
    creator: '@example',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://example.com',
    languages: {
      'en-US': 'https://example.com/en',
      'de-DE': 'https://example.com/de',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    other: { 'msvalidate.01': 'bing-verification-code' },
  },
}
```

```tsx
// app/blog/[slug]/page.tsx — per-page metadata
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
    alternates: {
      canonical: `https://example.com/blog/${post.slug}`,
    },
  }
}
```

### Astro: Head Meta

```astro
---
// src/components/SEOHead.astro
interface Props {
  title: string
  description: string
  image?: string
  canonicalUrl?: string
  type?: 'website' | 'article'
  publishedTime?: string
}

const { title, description, image = '/og-image.png', canonicalUrl, type = 'website', publishedTime } = Astro.props
const canonical = canonicalUrl ?? Astro.url.href
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site).href} />
<meta property="og:url" content={canonical} />
<meta property="og:site_name" content="Example" />
{publishedTime && <meta property="article:published_time" content={publishedTime} />}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(image, Astro.site).href} />

<!-- Search engine verification -->
<meta name="google-site-verification" content="your-google-code" />
<meta name="msvalidate.01" content="your-bing-code" />

<!-- Alternate languages -->
<link rel="alternate" hreflang="en" href={`https://example.com/en${Astro.url.pathname}`} />
<link rel="alternate" hreflang="de" href={`https://example.com/de${Astro.url.pathname}`} />
<link rel="alternate" hreflang="x-default" href={canonical} />
```

## JSON-LD Structured Data

Use a dedicated component to inject JSON-LD safely:

### JsonLd Component

```tsx
// components/JsonLd.tsx — safe JSON-LD injection
function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Next.js: use the built-in <script> support in metadata
  // This component is for client-rendered JSON-LD
  return (
    <script
      type="application/ld+json"
      // Content is developer-controlled schema data, not user input
      // eslint-disable-next-line react/no-danger
      {...{ dangerouslySetInnerHTML: { __html: JSON.stringify(data) } }}
    />
  )
}
```

### Astro: JSON-LD (No React needed)

```astro
---
// components/JsonLd.astro
interface Props { data: Record<string, unknown> }
const { data } = Astro.props
---

<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

### Organization Schema

```tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Example Inc.',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://twitter.com/example',
    'https://github.com/example',
    'https://linkedin.com/company/example',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555',
    contactType: 'customer service',
  },
}
```

### Article Schema (Blog Post)

```tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
    url: post.author.url,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Example Inc.',
    logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://example.com/blog/${post.slug}`,
  },
}
```

### Product Schema

```tsx
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Pro Plan',
  description: 'Full-featured plan for teams',
  offers: {
    '@type': 'Offer',
    price: '29.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://example.com/pricing',
  },
}
```

### FAQ Schema

```tsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}
```

### BreadcrumbList Schema

```tsx
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://example.com/blog' },
    { '@type': 'ListItem', position: 3, name: post.title, item: `https://example.com/blog/${post.slug}` },
  ],
}
```

## IndexNow (Instant Bing Indexing)

```tsx
// app/api/indexnow/route.ts
export async function POST(req: Request) {
  const { urls } = await req.json()

  const response = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'example.com',
      key: process.env.INDEXNOW_KEY,
      keyLocation: `https://example.com/${process.env.INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  })

  return Response.json({ status: response.status })
}

// Place key file at: public/{INDEXNOW_KEY}.txt (contains the key itself)
// Supported by: Bing, Yandex, Seznam, Naver
```

### Astro: IndexNow on Build

```ts
// src/integrations/indexnow.ts
import type { AstroIntegration } from 'astro'

export function indexNow(): AstroIntegration {
  return {
    name: 'indexnow',
    hooks: {
      'astro:build:done': async ({ pages }) => {
        const urls = pages.map(p => `https://example.com/${p.pathname}`)
        await fetch('https://api.indexnow.org/IndexNow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: 'example.com',
            key: process.env.INDEXNOW_KEY,
            urlList: urls,
          }),
        })
      },
    },
  }
}
```

## GEO (Generative Engine Optimization)

Optimize for AI-powered search (Google AI Overviews, Bing Copilot, Perplexity, ChatGPT Search).

### Key Principles

1. **STRUCTURED CONTENT**: Use clear headings (H2, H3), bullet points, numbered lists, tables, and definition lists. AI models parse structured content better.

2. **DIRECT ANSWERS**: Start sections with a concise answer, then elaborate. "What is X? X is [definition]. It works by [explanation]..."

3. **CITED CLAIMS**: Include specific numbers, dates, sources. "According to [source], metric increased 47% in 2025."

4. **ENTITY COVERAGE**: Cover the topic comprehensively. AI pulls from pages that address the full scope of a query, not just keywords.

5. **SCHEMA MARKUP**: JSON-LD structured data helps AI understand entity relationships. Use Article, FAQ, HowTo, Product schemas.

6. **FRESHNESS**: AI search engines prioritize recent content. Include "Last updated: [date]" and dateModified in schema.

7. **QUOTABLE SNIPPETS**: Write sentences that could be directly quoted as an AI-generated answer. Clear, factual, self-contained.

### GEO Content Patterns

```tsx
// FAQ section — directly answerable by AI
function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section>
      <h2>Frequently Asked Questions</h2>
      {faqs.map(faq => (
        <details key={faq.id}>
          <summary className="font-medium cursor-pointer py-2">{faq.question}</summary>
          <p className="text-muted-foreground pb-4">{faq.answer}</p>
        </details>
      ))}
      <JsonLd data={faqSchema} />
    </section>
  )
}

// How-to section with steps — AI loves numbered steps
function HowToSection({ steps }: { steps: Step[] }) {
  return (
    <section>
      <h2>How to Get Started</h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Get Started',
        step: steps.map((s, i) => ({
          '@type': 'HowToStep', position: i + 1, name: s.title, text: s.description,
        })),
      }} />
    </section>
  )
}
```

### AI Crawler Access

```
# robots.txt — allow AI crawlers for GEO visibility
User-agent: GPTBot           # ChatGPT
Allow: /

User-agent: Google-Extended  # Google Gemini / AI Overviews
Allow: /

User-agent: Bingbot          # Bing Copilot uses Bingbot
Allow: /

User-agent: PerplexityBot    # Perplexity AI
Allow: /

User-agent: Anthropic-ai    # Claude
Allow: /
```

## Validation Checklist

### Google Search Console
1. Verify ownership (DNS TXT, HTML file, or meta tag)
2. Submit sitemap: Sitemaps > Add new sitemap > /sitemap.xml
3. Check Coverage: ensure no errors (redirect, 404, soft 404, server error)
4. Validate structured data: https://search.google.com/test/rich-results
5. Check Core Web Vitals: Experience > Core Web Vitals

### Bing Webmaster Tools
1. Verify ownership (DNS CNAME, XML file, or meta tag)
2. Submit sitemap: Sitemaps > Submit sitemap > /sitemap.xml
3. Use IndexNow for instant indexing of new/updated pages
4. Check URL inspection for crawl issues
5. Validate markup: https://www.bing.com/webmasters/markup-validator

## Best Practices

1. **One canonical URL per page**: Always set `<link rel="canonical">` to prevent duplicate content
2. **OG image at 1200x630px**: Universal standard for social sharing
3. **JSON-LD over microdata**: Google recommends JSON-LD for structured data
4. **Test before submitting**: Use Google Rich Results Test and Bing Markup Validator
5. **IndexNow on publish**: Ping Bing immediately when content is created or updated
6. **hreflang for i18n**: Every localized page needs `<link rel="alternate" hreflang="xx">` tags
7. **dateModified in schema**: AI search engines heavily weight content freshness
8. **Comprehensive coverage**: GEO rewards thoroughness — cover the full topic, not just keywords
