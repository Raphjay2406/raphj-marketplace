---
name: "seo-meta"
description: "SEO and metadata patterns: Next.js generateMetadata, Astro head management, JSON-LD structured data, Open Graph, sitemaps, robots.txt, IndexNow, GEO optimization -- framework-specific with DNA-consistent branding."
tier: "utility"
triggers: "SEO, metadata, sitemap, robots.txt, JSON-LD, Open Graph, meta tags, schema, canonical, structured data, IndexNow, GEO, search, og:image"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Every public-facing page needs proper metadata (title, description, og:image)
- Site requires search engine discoverability (sitemap, robots.txt, structured data)
- Content needs rich search results (FAQ, Article, Product, BreadcrumbList schemas)
- Project targets AI-powered search visibility (Google AI Overviews, Bing Copilot)

### When NOT to Use

- Private dashboards or internal tools behind authentication -- minimal SEO needed
- For i18n-specific hreflang and locale routing -- use `i18n-rtl` instead (this skill covers the meta tag output side)

### Decision Tree

- Framework? Next.js uses `generateMetadata` / static `metadata` export; Astro uses `<head>` in layouts; React/Vite uses `react-helmet-async`
- Dynamic metadata? Use `generateMetadata` (Next.js) or frontmatter props (Astro) -- never hardcode
- Structured data? JSON-LD in `<script type="application/ld+json">` -- Google recommends over microdata
- Large site (50k+ URLs)? Use sitemap index with multiple sitemap files
- AI search optimization? Add FAQ/HowTo schemas, structured headings, quotable snippets

### Pipeline Connection

- **Referenced by:** section-builder for page-level metadata; build-orchestrator for site-wide SEO setup
- **Consumed at:** `/modulo:execute` wave 0-1 for layout metadata, wave 2+ for per-page metadata
- **Related commands:** `/modulo:start-project` captures brand info used in meta descriptions

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Next.js Global Metadata (App Router)

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Example -- Build Amazing Products",
    template: "%s | Example",
  },
  description: "The modern development platform for ambitious teams.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://example.com",
    siteName: "Example",
    title: "Example -- Build Amazing Products",
    description: "The modern development platform for ambitious teams.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Example -- Build Amazing Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Example -- Build Amazing Products",
    description: "The modern development platform for ambitious teams.",
    images: ["/og-image.png"],
    creator: "@example",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://example.com",
  },
  verification: {
    google: "google-site-verification-code",
    other: { "msvalidate.01": "bing-verification-code" },
  },
};
```

#### Pattern: Next.js Dynamic Page Metadata

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `https://example.com/blog/${slug}`,
    },
  };
}
```

#### Pattern: Astro SEO Head Component

```astro
---
// src/components/SEOHead.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

const {
  title,
  description,
  image = "/og-image.png",
  canonicalUrl,
  type = "website",
  publishedTime,
} = Astro.props;
const canonical = canonicalUrl ?? Astro.url.href;
const imageUrl = new URL(image, Astro.site).href;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageUrl} />
<meta property="og:url" content={canonical} />
<meta property="og:site_name" content="Example" />
{publishedTime && <meta property="article:published_time" content={publishedTime} />}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={imageUrl} />
```

#### Pattern: React/Vite Metadata (react-helmet-async)

```tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function SEO({ title, description, image = "/og-image.png", url, type = "website" }: SEOProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? "https://example.com";
  const canonical = url ?? siteUrl;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
```

#### Pattern: JSON-LD Structured Data

JSON-LD is injected as a `<script type="application/ld+json">` tag. In Next.js App Router, use the `metadata.other` export or a dedicated component. In Astro, use `set:html`. The data is developer-controlled schema, not user input, so JSON.stringify output is safe (it escapes all HTML-special characters).

```tsx
// JsonLd component -- safe because JSON.stringify escapes <, >, &
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line -- content is developer-controlled schema data
      {...{ dangerouslySetInnerHTML: { __html: JSON.stringify(data) } }}
    />
  );
}

// Astro equivalent (no React needed):
// <script type="application/ld+json" set:html={JSON.stringify(data)} />
```

**Common schemas:**

```tsx
// Article schema
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { "@type": "Person", name: post.author.name, url: post.author.url },
  publisher: {
    "@type": "Organization",
    name: "Example Inc.",
    logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
  },
};

// FAQ schema -- enables rich search results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// BreadcrumbList schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.label,
    item: crumb.href,
  })),
};

// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Pro Plan",
  description: "Full-featured plan for teams",
  offers: {
    "@type": "Offer",
    price: "29.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://example.com/pricing",
  },
};
```

#### Pattern: Next.js Sitemap and Robots

```tsx
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://example.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const posts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://example.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/_next/"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### Reference Sites

- **Vercel** (vercel.com) -- Excellent metadata implementation: dynamic OG images, comprehensive structured data, clean sitemap generation
- **Stripe** (stripe.com) -- Best-in-class JSON-LD: Article, FAQ, Product schemas with rich search results
- **Next.js Docs** (nextjs.org/docs) -- Reference implementation of the metadata API with proper canonical URLs and hreflang

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in SEO/Meta |
|-----------|-------------------|
| Brand name | `og:site_name`, `publisher.name` in JSON-LD, `<title>` template |
| Brand description | Default `og:description`, `meta description` |
| `bg-primary` color | OG image brand accent (when generating dynamic OG images) |
| `--font-display` | OG image headline font (for dynamic image generation) |

### Archetype Variants

SEO metadata is functionally identical across archetypes -- search engines parse structure, not visual style. However, OG image generation and brand voice in descriptions should match:

| Archetype | Meta Description Tone |
|-----------|----------------------|
| Neo-Corporate | Professional, clear, benefit-focused |
| Brutalist | Direct, minimal, no marketing fluff |
| Luxury/Fashion | Refined, aspirational, curated language |
| Playful/Startup | Energetic, friendly, conversational |

### Related Skills

- `blog-patterns` -- Article page metadata, reading progress, RSS feed generation
- `ecommerce-ui` -- Product schema, pricing structured data
- `i18n-rtl` -- hreflang alternate links, locale-specific canonical URLs
- `multi-page-architecture` -- Per-page metadata templates, shared layout metadata

## Layer 4: Anti-Patterns

### Anti-Pattern: Legacy Head Component

**What goes wrong:** Using `import Head from 'next/head'` in Next.js App Router projects. The `Head` component is Pages Router only. In App Router, it does not work and metadata is silently missing.
**Instead:** Use the `metadata` export (static) or `generateMetadata` function (dynamic) from the page or layout file. These are the Next.js 16 standard for metadata in App Router.

### Anti-Pattern: Hardcoded Canonical URLs

**What goes wrong:** Canonical URLs are hardcoded strings that become stale when routes change. Duplicate content issues arise when the canonical points to a non-existent page.
**Instead:** Generate canonical URLs dynamically from the current route. In Next.js, use `alternates.canonical` relative to `metadataBase`. In Astro, use `Astro.url.href`.

### Anti-Pattern: Missing og:image

**What goes wrong:** Pages share on social media with a blank preview or a random scraped image. Click-through rates drop significantly without a compelling preview image.
**Instead:** Every page type has a default og:image (1200x630px). Article pages use the cover image. Landing pages use a branded template. Set `og:image:width` and `og:image:height` for instant rendering.

### Anti-Pattern: Duplicate Meta Tags

**What goes wrong:** Layout and page both define the same meta tags (e.g., `description`), producing duplicates in the rendered HTML. Search engines may pick the wrong one.
**Instead:** Next.js `metadata` merges automatically (page overrides layout). In Astro, pass metadata as props from the page to the layout's `<SEOHead>` component. In React/Vite, `react-helmet-async` deduplicates by default.
