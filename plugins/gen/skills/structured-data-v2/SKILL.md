---
name: "structured-data-v2"
description: "Comprehensive JSON-LD structured data for SEO and GEO. @graph pattern, schema decision tree per page type, FAQPage for AI citation, and validation workflows."
tier: "core"
triggers: "json-ld, schema.org, structured data, rich results, faq schema, breadcrumb, product schema, @graph"
version: "2.0.0"
---

## Layer 1: Decision Guidance

Structured data is the bridge between human-readable content and machine-readable meaning. JSON-LD schemas tell search engines and AI engines exactly what a page contains -- article, product, event, FAQ, organization -- enabling rich results in traditional search (30% more clicks) and dramatically improving AI citation accuracy.

### Why Structured Data Matters for Both SEO and GEO

**SEO value:**
- Rich results increase click-through rate by 30% on average
- Product rich results appear in Google Shopping and Popular Products
- FAQ rich results (where still eligible) dominate SERP real estate
- BreadcrumbList improves visual presentation in search results
- Article schema enables Google News and Discover eligibility

**GEO value:**
- Pages with schema markup are 2-4x more likely to appear in Google AI Overviews
- GPT-4 accuracy jumps from 16% to 54% when structured data is present on the source page (Clarkson University research, 2024)
- FAQPage schema has the highest AI citation rate -- 3.2x more likely to be cited in AI-generated answers
- Organization schema is critical for entity disambiguation in AI knowledge graphs
- AI engines extract schema to validate and cross-reference text content

**Combined:** Structured data is no longer optional for any public-facing page. It serves both traditional search visibility and AI search citability.

### When to Use

- **Every public-facing page** -- at minimum BreadcrumbList + Organization (homepage)
- **Content pages (blog, article, guide)** -- Article/BlogPosting + BreadcrumbList + FAQPage (if Q&A content exists)
- **E-commerce pages** -- Product + Offer + AggregateRating + BreadcrumbList
- **Service pages** -- Service + Organization + BreadcrumbList
- **Event pages** -- Event + BreadcrumbList + Organization
- **Pages with FAQ content** -- FAQPage schema is the single highest-ROI schema for GEO
- **Sites targeting AI search** -- structured data is the strongest signal for AI extraction accuracy

### When NOT to Use

- **Private dashboards behind authentication** -- no crawling occurs
- **Tauri/Electron desktop apps** -- no web indexing
- **For meta tags, canonicals, sitemaps** -- use `seo-technical` skill
- **For content optimization patterns (BLUF, question headings)** -- use `geo-optimization` skill

### Schema Decision Tree Per Page Type

| Page Type | Required Schemas | Optional Schemas |
|-----------|-----------------|-----------------|
| **Homepage** | Organization + WebSite + BreadcrumbList | FAQPage (if FAQ section exists) |
| **Blog index** | CollectionPage + BreadcrumbList | Organization |
| **Blog post** | Article/BlogPosting + BreadcrumbList | FAQPage (if Q&A content) |
| **Product page** | Product + Offer + BreadcrumbList | AggregateRating, FAQPage, Review |
| **Service page** | Service + Organization + BreadcrumbList | FAQPage, Offer |
| **Contact page** | LocalBusiness + BreadcrumbList | Organization (with ContactPoint) |
| **Event page** | Event + BreadcrumbList | Organization, Offer (tickets), Performer |
| **Person/Team page** | Person + Organization | BreadcrumbList |
| **About page** | Organization + BreadcrumbList | Person (founders/team) |
| **Landing page** | Organization + BreadcrumbList | FAQPage (only if visible FAQ exists) |
| **Tutorial/Guide** | Article + BreadcrumbList | HowTo (AI-only, deprecated for Google), FAQPage |
| **Portfolio** | Organization + BreadcrumbList | CreativeWork |

**Critical rule:** Never add schema for content that does not visibly exist on the page. Content-schema mismatch is a Google penalty risk and degrades AI trust.

### Schema Status Matrix (2026)

| Schema Type | Google Rich Result | Status | AI Engine Value |
|---|---|---|---|
| Article / BlogPosting | Article rich result, Google News | **Active** | High |
| FAQPage | FAQ accordion | **Restricted** (gov/health only since Aug 2023) | Critical -- 3.2x AI citation rate |
| HowTo | NONE | **Deprecated** (Aug-Sep 2023) | Medium -- AI extraction only |
| Organization | Knowledge panel | **Active** | High -- entity recognition |
| WebSite | NONE (sitelinks search box removed Nov 2024) | Valid, no rich result | Medium -- AI entity recognition |
| BreadcrumbList | Breadcrumb trail | **Active** | Medium -- page hierarchy |
| Product | Product snippet, Shopping | **Active** | High |
| LocalBusiness | Local business panel | **Active** | High |
| Event | Event listing | **Active** | High |
| VideoObject | Video carousel | **Active** | High |
| Person | Knowledge panel (notable) | **Active** | High -- author authority |

### Pipeline Connection

- **Referenced by:** planner during schema assignment, builder during implementation, reviewer during quality gate
- **Consumed at:** `/modulo:plan-dev` assigns schemas per page in PLAN.md; `/modulo:execute` implements; `/modulo:iterate` validates

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: @graph Combination (Core Pattern)

The `@graph` pattern combines multiple schemas on a single page into one JSON-LD block, using `@id` for entity linking between them. This is the canonical approach for all multi-schema pages.

```tsx
// components/structured-data.tsx
interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      // Note: JSON.stringify output is safe for script tags as it escapes
      // all HTML-special characters. No XSS risk with serialized JSON.
      {...{ dangerouslySetInnerHTML: { __html: JSON.stringify(data) } }}
    />
  );
}

// Usage in a page:
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      name: "Example Company",
      url: "https://example.com",
      logo: {
        "@type": "ImageObject",
        url: "https://example.com/logo.png",
        width: 600,
        height: 60,
      },
      sameAs: [
        "https://www.linkedin.com/company/example",
        "https://twitter.com/example",
        "https://github.com/example",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-555-123-4567",
        contactType: "customer service",
        availableLanguage: ["English", "German"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      url: "https://example.com",
      name: "Example Company",
      publisher: { "@id": "https://example.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/#webpage",
      url: "https://example.com",
      name: "Example Company - Project Management for Teams",
      isPartOf: { "@id": "https://example.com/#website" },
      about: { "@id": "https://example.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://example.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://example.com",
        },
      ],
    },
  ],
};
```

**@id linking rules:**
- Every entity gets a unique `@id` using the URL + fragment pattern: `https://example.com/#organization`
- Reference other entities by `@id` instead of repeating data: `publisher: { "@id": "https://example.com/#organization" }`
- Use consistent fragment names: `#organization`, `#website`, `#webpage`, `#breadcrumb`, `#article`
- The `@id` does not need to be a real URL -- it is an identifier within the JSON-LD graph

#### Pattern: FAQPage Schema (Highest GEO Value)

FAQPage has the highest correlation with AI citation (3.2x). Even though Google restricted FAQ rich results to government and health sites in August 2023, the schema remains critical for AI engine extraction.

```tsx
// lib/structured-data/faq.ts
interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[], pageUrl: string) {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// CRITICAL: The FAQ data must drive BOTH the visible component AND the schema.
// Never have schema FAQ that does not appear on the page.

// components/faq-section.tsx
interface FAQSectionProps {
  faqs: FAQItem[];
  pageUrl: string;
}

export function FAQSection({ faqs, pageUrl }: FAQSectionProps) {
  const faqSchema = generateFAQSchema(faqs, pageUrl);

  return (
    <>
      <StructuredData data={faqSchema} />
      <section className="space-y-4">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border-b border-border pb-4">
            <summary className="cursor-pointer font-medium text-text">
              {faq.question}
            </summary>
            <p className="mt-2 text-muted">{faq.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
```

**FAQPage rules:**
- Every Question/Answer in the schema MUST appear visibly on the page (content-schema match)
- Answers should be 1-3 sentences, self-contained, factual
- Include numbers, dates, or named entities in answers for AI citability
- 3-8 FAQ items per page is optimal; more than 10 dilutes signal
- FAQ content should match BLUF style (answer first, context second)

#### Pattern: Article/BlogPosting

```tsx
// lib/structured-data/article.ts
interface ArticleData {
  title: string;
  description: string;
  slug: string;
  datePublished: string;  // ISO 8601
  dateModified: string;   // ISO 8601
  authorName: string;
  authorUrl: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  wordCount: number;
  siteUrl: string;
  siteName: string;
}

export function generateArticleSchema(data: ArticleData) {
  const articleUrl = `${data.siteUrl}/blog/${data.slug}`;

  return {
    "@type": "Article",
    "@id": `${articleUrl}/#article`,
    headline: data.title,
    description: data.description,
    url: articleUrl,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    wordCount: data.wordCount,
    inLanguage: "en-US",
    isPartOf: { "@id": `${data.siteUrl}/#website` },
    author: {
      "@type": "Person",
      name: data.authorName,
      url: data.authorUrl,
    },
    publisher: { "@id": `${data.siteUrl}/#organization` },
    image: {
      "@type": "ImageObject",
      url: data.imageUrl,
      width: data.imageWidth,
      height: data.imageHeight,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${articleUrl}/#webpage`,
    },
  };
}
```

**Required fields for Article:**
- `headline` (max 110 chars for Google)
- `author` (Person with name, ideally with url)
- `datePublished` (ISO 8601 format)
- `dateModified` (ISO 8601 format, update when content changes)
- `image` (at least one, 1200px wide minimum for rich results)
- `publisher` (Organization with logo)

**BlogPosting vs Article vs NewsArticle:**
- `BlogPosting`: blog content, evergreen or opinion-based
- `Article`: general articles, guides, tutorials
- `NewsArticle`: time-sensitive news only (breaking news, press releases). Using NewsArticle for non-news content confuses Google.

#### Pattern: Product Schema

```tsx
// lib/structured-data/product.ts
interface ProductData {
  name: string;
  description: string;
  imageUrl: string;
  sku: string;
  brand: string;
  price: number;
  priceCurrency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder";
  ratingValue?: number;
  reviewCount?: number;
  url: string;
}

export function generateProductSchema(data: ProductData) {
  const schema: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${data.url}/#product`,
    name: data.name,
    description: data.description,
    image: data.imageUrl,
    sku: data.sku,
    brand: {
      "@type": "Brand",
      name: data.brand,
    },
    offers: {
      "@type": "Offer",
      url: data.url,
      price: data.price,
      priceCurrency: data.priceCurrency,
      availability: `https://schema.org/${data.availability}`,
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString().split("T")[0],
    },
  };

  if (data.ratingValue && data.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: data.ratingValue,
      reviewCount: data.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}
```

**Product rich result requirements:**
- `name` + `offers` are minimum for eligibility
- `offers` must include `price`, `priceCurrency`, and `availability`
- `priceValidUntil` recommended to signal freshness
- `aggregateRating` significantly increases rich result visibility
- `review` (individual reviews) further enhances but are not required
- `sku` or `gtin` help Google identify the exact product

#### Pattern: LocalBusiness Schema

```tsx
// lib/structured-data/local-business.ts
export function generateLocalBusinessSchema(data: {
  name: string;
  type?: string; // "Restaurant", "Dentist", "LegalService", etc.
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  telephone: string;
  email?: string;
  priceRange?: string;
  url: string;
  imageUrl: string;
  openingHours: Array<{
    days: string[];
    opens: string;
    closes: string;
  }>;
}) {
  return {
    "@type": data.type || "LocalBusiness",
    "@id": `${data.url}/#localbusiness`,
    name: data.name,
    url: data.url,
    image: data.imageUrl,
    telephone: data.telephone,
    email: data.email,
    priceRange: data.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.streetAddress,
      addressLocality: data.city,
      addressRegion: data.state,
      postalCode: data.postalCode,
      addressCountry: data.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    },
    openingHoursSpecification: data.openingHours.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: oh.days,
      opens: oh.opens,
      closes: oh.closes,
    })),
  };
}
```

**LocalBusiness rules:**
- Use the most specific subtype: `Restaurant`, `Dentist`, `LegalService`, `RealEstateAgent`, etc.
- `address` with full `PostalAddress` is required
- `geo` coordinates are strongly recommended for Google Maps integration
- `openingHoursSpecification` is required for local pack eligibility
- `telephone` should include country code
- Only use for businesses with a physical location customers visit

#### Pattern: BreadcrumbList Schema

Required on every page except the homepage.

```tsx
// lib/structured-data/breadcrumb.ts
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  pageUrl: string
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Usage:
const breadcrumbs = generateBreadcrumbSchema(
  [
    { name: "Home", url: "https://example.com" },
    { name: "Blog", url: "https://example.com/blog" },
    { name: "SEO Guide", url: "https://example.com/blog/seo-guide" },
  ],
  "https://example.com/blog/seo-guide"
);
```

**BreadcrumbList rules:**
- Position starts at 1 (not 0)
- Last item is the current page
- Every non-homepage page must have BreadcrumbList
- Breadcrumb schema must match the visible breadcrumb navigation on the page
- Include `item` (URL) for every item except optionally the last (current page)

#### Pattern: Event Schema

```tsx
// lib/structured-data/event.ts
export function generateEventSchema(data: {
  name: string;
  description: string;
  startDate: string;  // ISO 8601
  endDate: string;    // ISO 8601
  locationName: string;
  streetAddress: string;
  city: string;
  country: string;
  ticketUrl?: string;
  ticketPrice?: number;
  ticketCurrency?: string;
  performerName?: string;
  imageUrl: string;
  url: string;
  isOnline?: boolean;
}) {
  const schema: Record<string, unknown> = {
    "@type": "Event",
    "@id": `${data.url}/#event`,
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    image: data.imageUrl,
    url: data.url,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: data.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: data.isOnline
      ? {
          "@type": "VirtualLocation",
          url: data.url,
        }
      : {
          "@type": "Place",
          name: data.locationName,
          address: {
            "@type": "PostalAddress",
            streetAddress: data.streetAddress,
            addressLocality: data.city,
            addressCountry: data.country,
          },
        },
    organizer: { "@id": `${new URL(data.url).origin}/#organization` },
  };

  if (data.ticketUrl && data.ticketPrice !== undefined) {
    schema.offers = {
      "@type": "Offer",
      url: data.ticketUrl,
      price: data.ticketPrice,
      priceCurrency: data.ticketCurrency || "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    };
  }

  if (data.performerName) {
    schema.performer = {
      "@type": "Person",
      name: data.performerName,
    };
  }

  return schema;
}
```

**Event requirements:**
- `name`, `startDate`, `location` are required
- `endDate` strongly recommended
- `eventStatus` and `eventAttendanceMode` required since COVID-era updates
- Use `VirtualLocation` for online events with the event URL
- Include `offers` for ticketed events

#### Pattern: VideoObject Schema

```tsx
// lib/structured-data/video.ts
export function generateVideoSchema(data: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;  // ISO 8601
  duration: string;    // ISO 8601 duration (e.g., "PT5M30S")
  contentUrl?: string;
  embedUrl?: string;
  url: string;
}) {
  return {
    "@type": "VideoObject",
    "@id": `${data.url}/#video`,
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    duration: data.duration,
    contentUrl: data.contentUrl,
    embedUrl: data.embedUrl,
    publisher: { "@id": `${new URL(data.url).origin}/#organization` },
  };
}
```

**VideoObject rules:**
- `thumbnailUrl` is required for video rich results
- `duration` uses ISO 8601 format: `PT1H30M` = 1 hour 30 minutes, `PT5M30S` = 5 minutes 30 seconds
- Either `contentUrl` or `embedUrl` is required
- `uploadDate` must be the actual upload date, not the page publish date

#### Pattern: SpeakableSpecification

Mark content optimized for voice assistant extraction:

```tsx
// Add to any WebPage or Article schema
{
  "@type": "WebPage",
  "@id": "https://example.com/blog/seo-guide/#webpage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [
      ".article-summary",
      ".bluf-paragraph",
      ".key-takeaway",
      ".faq-answer"
    ]
  }
}
```

**Speakable rules:**
- Mark only content that sounds natural when read aloud
- BLUF paragraphs, FAQ answers, and key takeaways are ideal candidates
- Avoid marking navigation, code blocks, or tabular data
- Use `cssSelector` (not `xpath`) for maintainability

#### Pattern: Full Page Assembly (Next.js)

Putting it all together for a blog post page:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { generateArticleSchema } from "@/lib/structured-data/article";
import { generateBreadcrumbSchema } from "@/lib/structured-data/breadcrumb";
import { generateFAQSchema } from "@/lib/structured-data/faq";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: `${post.title} | Brand Name`,
    description: post.excerpt,
    // ... other metadata
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  const siteUrl = "https://example.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization (referenced by Article publisher)
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Brand Name",
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
      },
      // WebSite
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Brand Name",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      // Article
      generateArticleSchema({
        title: post.title,
        description: post.excerpt,
        slug: post.slug,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        authorName: post.author.name,
        authorUrl: `${siteUrl}/team/${post.author.slug}`,
        imageUrl: post.coverImage,
        imageWidth: 1200,
        imageHeight: 630,
        wordCount: post.wordCount,
        siteUrl,
        siteName: "Brand Name",
      }),
      // Breadcrumbs
      generateBreadcrumbSchema(
        [
          { name: "Home", url: siteUrl },
          { name: "Blog", url: `${siteUrl}/blog` },
          { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
        ],
        `${siteUrl}/blog/${post.slug}`
      ),
      // FAQ (only if post has FAQ content)
      ...(post.faqs?.length
        ? [generateFAQSchema(post.faqs, `${siteUrl}/blog/${post.slug}`)]
        : []),
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <article>{/* ... page content ... */}</article>
    </>
  );
}
```

#### Pattern: Astro Integration

```astro
---
// src/layouts/BaseLayout.astro
const { structuredData } = Astro.props;
---
<html>
  <head>
    {structuredData && (
      <script
        type="application/ld+json"
        set:html={JSON.stringify(structuredData)}
      />
    )}
  </head>
  <body>
    <slot />
  </body>
</html>
```

```ts
// Astro: using astro-seo-schema (community package)
// npm install astro-seo-schema
import { Schema } from "astro-seo-schema";
```

#### Pattern: Validation Workflows

**Automated validation:**
1. **Google Rich Results Test:** `https://search.google.com/test/rich-results?url=YOUR_URL`
2. **Schema.org Validator:** `https://validator.schema.org/`
3. **Google Structured Data Testing Tool:** validates syntax but not eligibility

**Build-time validation:**
```ts
// scripts/validate-schema.ts
// Run in CI/CD to catch schema errors before deploy
import Ajv from "ajv";

async function validatePageSchemas() {
  const pages = await getAllPageUrls();
  const errors: string[] = [];

  for (const url of pages) {
    const html = await fetch(url).then((r) => r.text());
    const schemas = extractJsonLd(html);

    if (schemas.length === 0) {
      errors.push(`${url}: No structured data found`);
      continue;
    }

    for (const schema of schemas) {
      // Check required fields per type
      if (schema["@type"] === "Article") {
        if (!schema.headline) errors.push(`${url}: Article missing headline`);
        if (!schema.author) errors.push(`${url}: Article missing author`);
        if (!schema.datePublished) errors.push(`${url}: Article missing datePublished`);
      }
      if (schema["@type"] === "Product") {
        if (!schema.name) errors.push(`${url}: Product missing name`);
        if (!schema.offers) errors.push(`${url}: Product missing offers`);
      }
      // ... additional type checks
    }
  }

  if (errors.length > 0) {
    console.error("Schema validation errors:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
}
```

**Quality gate integration:** During `/modulo:iterate`, the reviewer checks:
1. Every page has at least one JSON-LD block
2. Schema types match the page type decision tree
3. No validation errors in Google Rich Results Test
4. FAQ schema matches visible FAQ content exactly
5. BreadcrumbList exists on every non-homepage

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `primary`, `bg`, `surface` | N/A -- structured data is invisible to users |
| `display-font`, `body-font` | N/A -- schema is machine-readable |

Structured data is entirely invisible to users. DNA tokens do not apply. However, structured data MUST accurately reflect the visible content that IS styled with DNA tokens. The connection is truthfulness: schema describes what the user sees.

### Archetype Variants

Structured data implementation is archetype-agnostic -- the same JSON-LD patterns apply regardless of visual style. The only variation is in FAQ section visibility:

| Archetype | FAQ Presentation |
|-----------|-----------------|
| Neo-Corporate, Data-Dense | Prominent FAQ section with full answers visible |
| Editorial, Dark Academia | Scholarly FAQ with detailed answers |
| Playful/Startup | Conversational FAQ with accordion interaction |
| Brutalist, Kinetic | Bold FAQ with minimal styling |
| Ethereal, Glassmorphism | Subtle FAQ accordion with soft transitions |
| Japanese Minimal | Clean FAQ with generous whitespace |
| Luxury/Fashion | Curated FAQ, minimal questions, premium feel |

### Pipeline Stage

- **Input from:** Page type assignment (determines which schemas to use), content planning (FAQ content, product data, event data)
- **Output to:** JSON-LD in page `<head>`, validation results in reviewer quality gate

### Quality Gate Mapping

Structured data violations in the anti-slop gate:

| Violation | Penalty | Category |
|-----------|---------|----------|
| Page without any structured data | -3 | UX Intelligence |
| Missing BreadcrumbList on non-homepage | -2 | UX Intelligence |
| FAQ content without FAQPage schema | -3 | UX Intelligence |
| Product page without Product schema | -3 | UX Intelligence |
| Article without author/datePublished | -2 | UX Intelligence |
| Hardcoded JSON-LD (not generated from data) | -2 | UX Intelligence |
| Schema validation errors | -3 | UX Intelligence |
| Missing Organization schema on homepage | -2 | UX Intelligence |

### Related Skills

- `seo-technical` -- meta tags, sitemaps, canonicals; this skill handles schema markup. Most pages need both.
- `geo-optimization` -- BLUF content, question headings, fact density; structured data amplifies GEO signals. FAQPage schema + BLUF FAQ content is the highest-ROI combination.
- `emotional-arc` -- TENSION beats are natural FAQ insertion points; PROOF beats align with Article/author schema; CLOSE beats align with Organization schema.
- `accessibility` -- semantic HTML that structured data references must be accessible.

## Layer 4: Anti-Patterns

### Anti-Pattern: Page Without Any Structured Data

**What goes wrong:** Public page has zero JSON-LD. Search engines cannot determine content type. AI engines have lower extraction accuracy (16% vs 54% with schema). No rich result eligibility. The page is invisible to knowledge graphs.
**Instead:** Every public page gets at minimum BreadcrumbList. Most pages get 3+ schemas per the decision tree. Use the @graph pattern to combine them efficiently.

**Penalty:** -3

### Anti-Pattern: Missing BreadcrumbList on Non-Homepage

**What goes wrong:** Blog posts, product pages, and service pages lack BreadcrumbList schema. Google cannot display the breadcrumb trail in search results. Page hierarchy is unclear to AI engines. This is the easiest schema to implement and one of the most commonly missed.
**Instead:** Add BreadcrumbList to every page except the homepage. Auto-generate from the URL path. Ensure schema matches the visible breadcrumb navigation component.

**Penalty:** -2

### Anti-Pattern: FAQ Content Without FAQPage Schema

**What goes wrong:** Page has a visible FAQ section with question-answer pairs, but no FAQPage JSON-LD. The FAQ content exists for humans but is not machine-extractable. This wastes the highest-ROI GEO signal available (3.2x AI citation rate).
**Instead:** When a page has FAQ content, always add FAQPage schema. Generate schema from the same data source as the visible FAQ component. Never have one without the other.

**Penalty:** -3

### Anti-Pattern: Product Page Without Product Schema

**What goes wrong:** E-commerce product page displays name, price, images, and reviews but lacks Product JSON-LD. No product rich result in Google. No Shopping tab eligibility. AI engines cannot extract structured product information for comparison queries.
**Instead:** Every product page gets Product schema with name, offers (price + currency + availability), image, and brand at minimum. Add aggregateRating and review when available.

**Penalty:** -3

### Anti-Pattern: Article Without Author or datePublished

**What goes wrong:** Blog post has Article/BlogPosting schema but omits `author` and `datePublished`. Google cannot verify authorship for E-E-A-T signals. AI engines cannot assess content freshness or authority. The article is effectively anonymous and undated in the knowledge graph.
**Instead:** Always include `author` (Person with name and url), `datePublished` (ISO 8601), and `dateModified` (update when content changes). Link author to their Person page with full credentials.

**Penalty:** -2

### Anti-Pattern: Hardcoded JSON-LD

**What goes wrong:** JSON-LD is manually written as a static string in the page template rather than generated from the actual page data. The schema says the title is "Example Post" while the visible heading says "Updated: New Example Post". Content-schema mismatch triggers Google manual actions and degrades AI trust.
**Instead:** Generate JSON-LD dynamically from the same data source that renders the page content. Use helper functions (see Layer 2) that accept data objects and return schema objects. This guarantees content-schema match.

**Penalty:** -2

### Anti-Pattern: Schema Validation Errors

**What goes wrong:** JSON-LD has syntax errors (missing commas, unclosed brackets), invalid types (using "BlogArticle" instead of "BlogPosting"), or missing required fields. Invalid schema is ignored entirely by search engines -- worse than having no schema because it wastes development effort with zero benefit.
**Instead:** Validate with Google Rich Results Test and Schema.org Validator before deploy. Add build-time validation to CI/CD pipeline. Use TypeScript interfaces for schema helper functions to catch type errors at compile time.

**Penalty:** -3

### Anti-Pattern: Missing Organization Schema on Homepage

**What goes wrong:** Homepage has no Organization schema. Search engines and AI engines cannot establish the site's entity identity. Knowledge panel is not triggered. Entity disambiguation fails -- the site is an anonymous presence in the knowledge graph.
**Instead:** Homepage always gets Organization schema with name, url, logo, sameAs (3+ authoritative profiles), and contactPoint. This is the foundation of your site's entity identity for both SEO and GEO.

**Penalty:** -2

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| schemas_per_page | 1 | 10 | schemas | HARD -- at least 1 JSON-LD block per public page |
| breadcrumb_on_non_homepage | 1 | 1 | boolean | HARD -- must exist on every non-homepage |
| faq_content_schema_match | 1 | 1 | boolean | HARD -- visible FAQ must have FAQPage schema |
| article_headline_length | 1 | 110 | chars | HARD -- Google truncates at 110 |
| product_requires_offers | 1 | 1 | boolean | HARD -- Product schema must include offers |
| organization_on_homepage | 1 | 1 | boolean | HARD -- homepage must have Organization schema |
| schema_validation_errors | 0 | 0 | errors | HARD -- zero validation errors allowed |
| sameAs_links | 3 | 10 | links | SOFT -- at least 3 sameAs per Organization |
| faq_items_per_page | 3 | 8 | items | SOFT -- optimal range for GEO signal |
