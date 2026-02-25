---
name: "structured-data"
description: "Typed JSON-LD schemas for all major page types via @graph combination, GEO-optimized content patterns (BLUF, question headings, quotable stats, FAQ-first), and schema audit protocol for content-schema consistency."
tier: "domain"
triggers: "structured data, JSON-LD, schema, rich results, FAQ schema, Article schema, Organization schema, BreadcrumbList, Product schema, LocalBusiness, Event schema, HowTo, WebSite schema, @graph, GEO, generative engine optimization, AI search, BLUF, question headings, quotable statistics, schema audit, content-schema match"
version: "1.0.0"
---

## Layer 1: Decision Guidance

Structured data makes content machine-readable. JSON-LD schemas tell search engines and AI engines what a page contains -- article, product, event, FAQ, organization -- so they can display rich results, populate knowledge panels, and cite content in AI-generated answers. Every public-facing page benefits from structured data, even when Google rich results are not guaranteed, because AI engines extract it independently.

### When to Use

- **Any page with an identifiable content type** (article, product, event, FAQ, local business, etc.) -- attach the matching JSON-LD schema per the recipe table below
- **Any page targeting AI search engine visibility (GEO)** -- add FAQ schema for AI extraction, apply GEO content patterns (BLUF, question headings, quotable stats)
- **Any page where the Emotional Arc assigns TENSION, PROOF, or CLOSE beats** -- these are schema integration points (TENSION = FAQ schema, PROOF = statistics + author markup, CLOSE = Organization schema)
- **Every page with breadcrumb navigation** -- add BreadcrumbList schema (virtually all multi-page sites)

### When NOT to Use

- **Private dashboards behind authentication** -- no search engine will crawl them; structured data adds no value
- **Tauri/Electron desktop apps** -- no web crawling occurs; structured data is meaningless
- **For meta tags, canonical URLs, sitemaps, and robots.txt** -- use the `seo-meta` skill instead. Structured data and meta tags are complementary -- most pages need BOTH skills
- **For IndexNow and proactive indexing** -- use the `search-visibility` skill (Phase 16). This skill handles what the page says about itself; search-visibility handles how the page gets discovered

### Schema Status Matrix

Not all schemas deliver the same value. Google has deprecated or restricted several rich result types while AI engines continue to extract all valid schema. This table is the source of truth for what to promise clients and stakeholders.

| Schema Type | Google Rich Result | Status | AI Engine Value |
|---|---|---|---|
| Article / BlogPosting / NewsArticle | Article rich result, Google News | **Active** | High -- headline, author, dates extracted |
| FAQPage | FAQ rich result | **Restricted** (gov/health only since Aug 2023) | Critical -- high correlation with AI Overview appearance |
| HowTo | NONE | **Deprecated** (mobile Aug 2023, desktop Sep 2023) | Medium -- AI engines extract step-by-step content |
| Organization | Knowledge panel | **Active** | High -- entity recognition |
| WebSite | NONE (sitelinks search box removed Nov 2024) | Schema valid, no rich result | Medium -- site identity, AI entity recognition |
| BreadcrumbList | Breadcrumb trail in search results | **Active** | Medium -- page hierarchy |
| Product | Product snippet, Popular Products | **Active** | High -- price, availability, reviews |
| LocalBusiness | Local business panel | **Active** | High -- location, hours, contact |
| Event | Event experience on Google | **Active** | High -- date, location, tickets |

**Honesty policy:** Never promise rich results for schemas marked Restricted or Deprecated. FAQ schema is implemented for GEO value, not Google rich results. HowTo schema is implemented for AI extraction, not visual search results.

### Per-Page-Type Recipe Table

This is the primary reference for section-planners assigning schemas during `/modulo:plan-dev`. Each page type gets a specific combination of schemas assembled into a single `@graph`.

| Page Type | Schema Combination | Notes |
|---|---|---|
| **Homepage** | Organization + WebSite + BreadcrumbList | WebSite no longer triggers sitelinks search box (deprecated Nov 2024) but aids entity recognition |
| **Blog Post** | BlogPosting + BreadcrumbList + FAQPage (if FAQ exists) | FAQPage for GEO value even though rich results are restricted for most sites |
| **Article / News** | Article or NewsArticle + BreadcrumbList + FAQPage | NewsArticle for time-sensitive content only |
| **Product Page** | Product + BreadcrumbList + FAQPage | Product schema requires `name` + `offers` for rich results |
| **Service Page** | Organization + BreadcrumbList + FAQPage | No dedicated Service rich result; Organization helps entity recognition |
| **About Page** | Organization + BreadcrumbList | Full Organization details here (logo, social, contact) |
| **Contact Page** | Organization (with ContactPoint) + LocalBusiness + BreadcrumbList | LocalBusiness for physical locations only |
| **Event Page** | Event + BreadcrumbList + Organization | Event requires `name` + `startDate` + `location` |
| **Landing Page** | Organization + BreadcrumbList + FAQPage (if content warrants) | Keep schemas minimal; content-schema match is critical -- do not add FAQ schema without visible FAQ content |
| **Tutorial / Guide** | Article + BreadcrumbList + HowTo + FAQPage | HowTo for AI extraction only (no Google rich results); Article is the PRIMARY schema |
| **Portfolio** | Organization + BreadcrumbList | Minimal schemas; visual content is the focus |

### Decision Tree

Key branching decisions when assigning schemas to a page:

1. **Single schema vs multi-schema?** Use `@graph` when 2+ schemas apply. Most pages have at least 3 (Organization + BreadcrumbList + content type). See Layer 2 for the `@graph` combination pattern.

2. **FAQ content exists on the page?** Add FAQPage to the `@graph`. This is for GEO (AI search visibility), NOT for Google FAQ rich results (restricted to gov/health sites). The FAQ data array must drive BOTH the visible FAQ component AND the JSON-LD -- they must match exactly.

3. **Tutorial or guide content?** Use Article (or BlogPosting) as the PRIMARY schema. Optionally add HowTo schema for AI engines to extract step-by-step content. Do NOT expect HowTo rich results from Google (fully deprecated Aug-Sep 2023).

4. **E-commerce product?** Product schema requires `name` + `offers` to be eligible for rich results. Include `aggregateRating` and `review` if available. Missing `offers` means no Product rich result.

5. **Physical location?** Add LocalBusiness schema alongside Organization. Include `address`, `geo` (coordinates), and `openingHoursSpecification`. Use a specific subtype when applicable (Restaurant, Dentist, etc.).

6. **Blog vs news content?** BlogPosting for evergreen blog content. NewsArticle ONLY for time-sensitive news (breaking news, event reports, press releases). NewsArticle in non-news contexts confuses Google.

7. **Content-heavy page (blog, article, documentation)?** Apply GEO content patterns -- BLUF formatting, question-based headings, quotable statistics. See Layer 2 GEO patterns section and the archetype intensity guidance below.

8. **Content-light page (landing page, portfolio)?** Minimal GEO. Focus on schema accuracy and Emotional Arc. Do not force BLUF or FAQ sections where they do not belong.

### GEO Decision Guidance

GEO (Generative Engine Optimization) structures content so AI search engines (ChatGPT, Perplexity, Claude Search, Gemini) can extract, cite, and surface it in AI-generated answers. Not all pages benefit equally.

**When GEO patterns apply:**
- Content-heavy pages (blog posts, articles, documentation, guides) -- **high benefit**
- Service pages with substantial copy -- **moderate benefit**
- Landing pages, portfolios, product pages -- **low benefit** (Emotional Arc drives the story; do not over-optimize)

**GEO pattern types** (detailed in Layer 2):
- **BLUF (Bottom Line Up Front):** Lead with the answer, then supporting details
- **Question-based headings:** H2/H3 phrased as questions for direct AI extraction
- **Quotable statistics with citations:** Formatted for AI extraction with source attribution
- **FAQ-first content:** FAQ sections designed for GEO visibility with archetype-aware styling

**Archetype intensity tiers** (detailed mapping in Layer 3):
- **Full:** Neo-Corporate, Data-Dense, Editorial, Dark Academia -- all GEO patterns, visually prominent
- **Moderate:** Playful/Startup, Organic, Warm Artisan, Retro-Future, Neubrutalism, AI-Native -- GEO patterns styled to match archetype
- **Subtle:** Luxury/Fashion, Japanese Minimal, Ethereal, Swiss/International, Glassmorphism -- restrained GEO, elegant FAQ, no BLUF
- **Minimal:** Brutalist, Kinetic, Neon Noir, Vaporwave -- raw or hidden GEO, declarative statements

**Key principle:** Same SEO signals, different visual expression. A Luxury FAQ section uses elegant typography and generous spacing. A Brutalist FAQ uses raw text blocks. Both produce identical JSON-LD underneath.

### Pipeline Connection

- **Referenced by:** section-planner (assigns schemas per section in PLAN.md), section-builder (generates JSON-LD during implementation), content-specialist (applies GEO content patterns)
- **Consumed at:** `/modulo:plan-dev` (schema assignment per section using the recipe table), `/modulo:execute` Wave 2+ (JSON-LD generation per section, GEO pattern implementation)
- **Verified by:** quality-reviewer (schema audit protocol -- runs on every quality-reviewer pass, after both `/modulo:execute` and `/modulo:iterate`)
- **Related skills:**
  - `seo-meta` -- meta tags, canonical URLs, robots.txt, OG images. This skill handles structured data. Most pages need both.
  - `emotional-arc` -- beat-to-schema mapping. TENSION beats get FAQ schema, PROOF beats get statistics + author markup, CLOSE beats get Organization schema.
  - `search-visibility` (Phase 16) -- IndexNow, sitemaps, proactive indexing. This skill makes content machine-readable; search-visibility makes content discoverable.

## Layer 2: Award-Winning Examples

### Code Patterns

#### SDATA-01: TypeScript Interfaces for JSON-LD

All structured data uses plain TypeScript interfaces -- no `schema-dts` dependency. These interfaces match schema.org vocabulary and are maintained manually. Every JSON-LD builder function returns typed data that flows through the `JsonLd` component.

**Base Schema Interfaces:**

```typescript
// types/schema.ts -- Plain TypeScript interfaces (NO schema-dts)

interface SchemaBase {
  "@context": "https://schema.org";
  "@type": string;
  "@id"?: string;
}

interface SchemaGraph {
  "@context": "https://schema.org";
  "@graph": SchemaBase[];
}

// Supporting types used by multiple schemas

interface PersonSchema {
  "@type": "Person";
  name: string;
  url?: string;
}

interface ImageObjectSchema {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
}

interface PostalAddressSchema {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

interface ContactPointSchema {
  "@type": "ContactPoint";
  telephone: string;
  contactType: string;
}

interface OfferSchema {
  "@type": "Offer";
  price?: string;
  priceCurrency?: string;
  availability?: string;
  url?: string;
  validFrom?: string;
}

interface AggregateRatingSchema {
  "@type": "AggregateRating";
  ratingValue: string;
  reviewCount?: string;
  bestRating?: string;
}

interface ReviewSchema {
  "@type": "Review";
  author: PersonSchema;
  reviewRating: { "@type": "Rating"; ratingValue: string };
  reviewBody?: string;
}

interface BrandSchema {
  "@type": "Brand";
  name: string;
}

interface PlaceSchema {
  "@type": "Place";
  name: string;
  address: PostalAddressSchema;
}

interface VirtualLocationSchema {
  "@type": "VirtualLocation";
  url: string;
}

interface GeoCoordinatesSchema {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

interface OpeningHoursSchema {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}
```

**Page-Type Schema Interfaces:**

```typescript
// FAQPage
interface FAQPageSchema extends SchemaBase {
  "@type": "FAQPage";
  mainEntity: QuestionSchema[];
}

interface QuestionSchema {
  "@type": "Question";
  name: string;
  acceptedAnswer: AnswerSchema;
}

interface AnswerSchema {
  "@type": "Answer";
  text: string;
}

// Article (covers BlogPosting and NewsArticle)
interface ArticleSchema extends SchemaBase {
  "@type": "Article" | "BlogPosting" | "NewsArticle";
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string; // ISO 8601
  dateModified?: string; // ISO 8601
  author: PersonSchema | OrganizationSchema;
  publisher?: OrganizationSchema;
}

// Organization
interface OrganizationSchema extends SchemaBase {
  "@type": "Organization";
  name: string;
  url?: string;
  logo?: string | ImageObjectSchema;
  description?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddressSchema;
  sameAs?: string[];
  contactPoint?: ContactPointSchema[];
}

// WebSite
interface WebSiteSchema extends SchemaBase {
  "@type": "WebSite";
  url: string;
  name: string;
  description?: string;
  publisher?: { "@id": string } | OrganizationSchema;
}

// BreadcrumbList
interface BreadcrumbListSchema extends SchemaBase {
  "@type": "BreadcrumbList";
  itemListElement: ListItemSchema[];
}

interface ListItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string; // URL -- omit for final breadcrumb item
}

// Product
interface ProductSchema extends SchemaBase {
  "@type": "Product";
  name: string;
  description?: string;
  image?: string | string[];
  offers?: OfferSchema | OfferSchema[];
  aggregateRating?: AggregateRatingSchema;
  review?: ReviewSchema[];
  brand?: BrandSchema;
}

// LocalBusiness
interface LocalBusinessSchema extends SchemaBase {
  "@type": "LocalBusiness" | string; // Subtypes: Restaurant, Dentist, etc.
  name: string;
  address: PostalAddressSchema;
  telephone?: string;
  url?: string;
  openingHoursSpecification?: OpeningHoursSchema[];
  geo?: GeoCoordinatesSchema;
  image?: string | string[];
  priceRange?: string;
}

// Event
interface EventSchema extends SchemaBase {
  "@type": "Event";
  name: string;
  startDate: string; // ISO 8601
  location: PlaceSchema | VirtualLocationSchema;
  endDate?: string;
  description?: string;
  image?: string | string[];
  offers?: OfferSchema;
  organizer?: PersonSchema | OrganizationSchema;
  performer?: PersonSchema | PersonSchema[];
  eventStatus?: string;
}

// HowTo
interface HowToSchema extends SchemaBase {
  "@type": "HowTo";
  name: string;
  description?: string;
  step: HowToStepSchema[];
  totalTime?: string; // ISO 8601 duration (e.g., "PT30M")
  image?: string | string[];
}

interface HowToStepSchema {
  "@type": "HowToStep";
  name: string;
  text: string;
  url?: string;
  image?: string;
}
```

#### SDATA-01: JsonLd Component

The `JsonLd` component serializes developer-controlled schema data into a `<script type="application/ld+json">` tag. `JSON.stringify` escapes all HTML-special characters (`<`, `>`, `&`, `"`), making this safe for developer-authored schema. If user-generated content is included in schema data, sanitize it before passing to the component.

**React / Next.js:**

```tsx
// components/JsonLd.tsx

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  // SAFETY: JSON.stringify escapes <, >, & -- safe for developer-controlled
  // schema data. Sanitize any user-generated content before including it.
  const jsonString = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      {...{ dangerouslySetInnerHTML: { __html: jsonString } }}
    />
  );
}

// Usage in a page component:
// <JsonLd data={buildBlogPostSchema(post, siteConfig)} />
```

**Astro:**

```astro
---
// components/JsonLd.astro
interface Props {
  data: Record<string, unknown>;
}
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

#### SDATA-01: @graph Combination Pattern

Most pages combine multiple schemas (Organization + BreadcrumbList + content type). Use a single `@graph` array inside one `<script>` tag. Declare `@context` exactly once at the root -- never inside individual `@graph` entries.

```typescript
// lib/schema/buildPageSchema.ts

function buildBlogPostSchema(
  post: BlogPost,
  site: SiteConfig
): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organization (site-wide, referenced by @id)
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/logo.png`,
        },
        sameAs: site.socialProfiles,
      },
      // WebSite (site-wide identity)
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
      },
      // BreadcrumbList (page navigation)
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
      // BlogPosting (page content)
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
          url: post.author.url,
        },
        publisher: { "@id": `${site.url}/#organization` },
      },
      // FAQPage (conditionally included only if post has FAQ content)
      ...(post.faqs?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };
}
```

**@graph gotchas:**
- `@context` declared exactly once at the root -- individual entries within `@graph` must NOT include `@context`
- Use `@id` to cross-reference entities (e.g., `publisher: { "@id": ".../#organization" }` references the Organization defined earlier)
- Keep nesting shallow -- deeply nested `@graph` structures confuse crawlers
- Google Rich Results Test parses `@graph` correctly; no functional difference from separate `<script>` tags
- Section-builders adapt this pattern per page type using the recipe table from Layer 1

#### SDATA-02: FAQ Schema with Visible Content Match

> **IMPORTANT:** FAQ rich results are restricted to authoritative government and health websites since August 2023. However, FAQ schema remains critical for AI search visibility (GEO). Pages with FAQ schema appear in AI Overviews at significantly higher rates. Implement FAQ schema for AI engines, not for Google rich results.

The same `faqs` array must drive BOTH the visible FAQ component AND the JSON-LD. This ensures content-schema consistency and passes the schema audit protocol.

```tsx
// Pattern: Single data source for visible FAQ + JSON-LD

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What frameworks does Modulo support?",
    answer: "Next.js 16, Astro 5/6, React 19/Vite, Tauri, and Electron.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Most sites are production-ready in 2-4 weeks.",
  },
];

// Visible FAQ section -- renders on page, MUST match schema
function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section>
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq) => (
        <details key={faq.question}>
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}

// JSON-LD schema -- driven by the SAME faqs array
function buildFAQSchema(faqs: FAQ[]): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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

// Usage: both components receive the same array
// <FAQSection faqs={faqs} />
// <JsonLd data={buildFAQSchema(faqs)} />
```

The `<details>/<summary>` pattern shown above is the semantic baseline. Archetype styling adapts the visual (elegant accordion for Luxury, bold cards for Brutalist, minimal Q&A for Japanese Minimal) while the JSON-LD stays identical.

#### SDATA-03: HowTo Schema for AI Extraction

> **IMPORTANT:** Google fully deprecated HowTo rich results (mobile Aug 2023, desktop Sep 2023). This schema no longer triggers any visual rich results in Google Search. Keep it for AI engine extraction of step-by-step content. Use Article schema as the PRIMARY schema for tutorial pages.

HowTo schema is included alongside the primary Article schema in the same `@graph`. Article is what triggers Google rich results; HowTo is what AI engines extract for step-by-step answers.

```typescript
// Pattern: HowTo alongside Article in @graph for tutorial pages

function buildTutorialSchema(
  tutorial: Tutorial,
  site: SiteConfig
): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Article is the PRIMARY schema (triggers Google rich results)
      {
        "@type": "Article",
        headline: tutorial.title,
        description: tutorial.excerpt,
        image: tutorial.coverImage,
        datePublished: tutorial.publishedAt,
        dateModified: tutorial.updatedAt,
        author: {
          "@type": "Person",
          name: tutorial.author.name,
          url: tutorial.author.url,
        },
        publisher: { "@id": `${site.url}/#organization` },
      },
      // HowTo is SECONDARY (AI extraction only, no Google rich results)
      {
        "@type": "HowTo",
        name: tutorial.title,
        description: tutorial.excerpt,
        step: tutorial.steps.map((step, i) => ({
          "@type": "HowToStep",
          name: step.title,
          text: step.description,
          url: `${site.url}${tutorial.slug}#step-${i + 1}`,
        })),
        ...(tutorial.totalTime && { totalTime: tutorial.totalTime }),
      },
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Tutorials", item: `${site.url}/tutorials` },
          { "@type": "ListItem", position: 3, name: tutorial.title },
        ],
      },
    ],
  };
}
```

#### SDATA-04: Article / BlogPosting / NewsArticle

Article schema covers three subtypes. Choose based on content character:
- **Article** -- general articles, documentation, evergreen content
- **BlogPosting** -- blog posts, opinion pieces, personal writing
- **NewsArticle** -- time-sensitive news, breaking stories, press releases. Do NOT use for evergreen blog content.

Google has NO required properties for Article schema (all are recommended), but omitting `headline` or `image` significantly reduces rich result likelihood. Provide images in multiple aspect ratios: 16:9, 4:3, and 1:1 (minimum 50K pixels each, i.e., width x height >= 50,000).

```typescript
// Pattern: Article schema with all recommended properties

function buildArticleSchema(
  article: Article,
  site: SiteConfig
): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": article.isNews ? "NewsArticle" : article.isBlog ? "BlogPosting" : "Article",
    headline: article.title, // Keep concise -- long titles may truncate
    description: article.excerpt,
    image: [
      article.image16x9, // 1200x675 (16:9)
      article.image4x3,  // 1200x900 (4:3)
      article.image1x1,  // 1200x1200 (1:1)
    ].filter(Boolean),
    datePublished: article.publishedAt, // ISO 8601: "2026-02-25T10:00:00Z"
    dateModified: article.updatedAt,    // Must reflect actual last edit
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url,
    },
    publisher: { "@id": `${site.url}/#organization` },
  };
}
```

#### SDATA-05: Organization with Logo, Contact, Social

Organization schema is a site-wide entity defined once and referenced via `@id` across all pages. Include all optional fields for maximum knowledge panel coverage. The logo should be an `ImageObject` (not just a URL string) for proper display.

```typescript
// Pattern: Full Organization schema (defined once, referenced via @id)

function buildOrganizationSchema(site: SiteConfig): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo.png`,
      width: 512,
      height: 512,
    },
    description: site.description,
    email: site.email,
    telephone: site.telephone,
    address: site.address
      ? {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        }
      : undefined,
    sameAs: [
      site.social?.twitter,
      site.social?.linkedin,
      site.social?.github,
      site.social?.instagram,
      site.social?.youtube,
    ].filter(Boolean) as string[],
    contactPoint: site.contactPoints?.map((cp) => ({
      "@type": "ContactPoint" as const,
      telephone: cp.telephone,
      contactType: cp.type, // "customer service", "technical support", "sales"
    })),
  };
}

// Referenced elsewhere in @graph via:
// publisher: { "@id": "https://example.com/#organization" }
```

#### SDATA-06: Schema Audit Protocol

This audit runs on every quality-reviewer pass -- after `/modulo:execute` AND `/modulo:iterate`. Schema-content mismatch after iteration is the #1 cause of Google manual actions for structured data. When content changes during `/modulo:iterate`, JSON-LD must be updated to match.

**Content-Schema Consistency Checklist:**

For each JSON-LD claim on the page, verify against visible content:

- [ ] `headline` matches the visible H1 text
- [ ] `description` matches visible meta description or first paragraph
- [ ] `datePublished` is accurate (not a placeholder or build timestamp)
- [ ] `dateModified` reflects actual last edit (not automated build time)
- [ ] `author.name` matches visible author byline on the page
- [ ] `image` URL resolves to an actual image (not 404)
- [ ] FAQ `Question.name` matches visible question text exactly
- [ ] FAQ `Answer.text` matches visible answer text exactly
- [ ] Product `offers.price` matches visible price displayed on the page
- [ ] Product `offers.availability` matches visible stock status

**Structural Validation:**

- [ ] `@context` declared exactly once (at root level of `@graph` wrapper)
- [ ] No orphaned `@context` inside `@graph` entries
- [ ] All `@id` references point to defined entities within the same `@graph`
- [ ] No duplicate schema types (e.g., two Organization schemas on the same page)

**External Validation Guidance:**

- [ ] Paste page URL into [Google Rich Results Test](https://search.google.com/test/rich-results) -- verify "eligible for rich results" where expected
- [ ] Check Google Search Console > Enhancements for structured data errors after deployment
- [ ] Review Google Search Console > Security and Manual Actions for any markup-related flags
- [ ] Cross-check with [Schema.org Markup Validator](https://validator.schema.org/) for vocabulary compliance

**Auto-Fix Protocol:**

When the schema audit finds mismatches during a quality-reviewer pass:

1. Update JSON-LD to match current visible content (content is the source of truth)
2. Log what changed: old value -> new value
3. Notify the user: "Schema audit: updated [field] from [old] to [new] to match visible content"
4. Re-run the schema audit to confirm the fix resolved the mismatch

Never update visible content to match stale JSON-LD. Content is always the source of truth; schema follows content.

### GEO Content Patterns

GEO (Generative Engine Optimization) structures content for AI search engine extraction. These patterns increase the likelihood of AI engines citing the page in generated answers. Apply at the intensity dictated by the archetype tier (Full/Moderate/Subtle/Minimal -- see Layer 1 GEO Decision Guidance).

#### GEO-01: BLUF (Bottom Line Up Front) Formatting

BLUF leads with the answer or conclusion, then provides supporting details. AI engines extract the first substantive statement as a potential citation. This pattern is for content-heavy pages only (blog posts, articles, documentation). NOT for landing pages, portfolios, or product pages where the Emotional Arc drives the story.

```tsx
// Pattern: BLUF-formatted article section

function BLUFSection({
  answer,
  details,
  heading,
}: {
  answer: string;
  details: string[];
  heading: string;
}) {
  return (
    <section>
      <h2>{heading}</h2>
      {/* BLUF: Lead with the answer */}
      <p className="text-lg font-medium text-text">
        {answer}
      </p>
      {/* Supporting details follow */}
      {details.map((detail, i) => (
        <p key={i} className="text-text/80">
          {detail}
        </p>
      ))}
    </section>
  );
}

// Example usage:
// <BLUFSection
//   heading="How long does a Modulo project take?"
//   answer="Most Modulo sites are production-ready in 2-4 weeks,
//     including design discovery, build, and quality review."
//   details={[
//     "Week 1 covers discovery, research, and design DNA generation.",
//     "Weeks 2-3 focus on implementation with parallel section builds.",
//     "Week 4 handles review, iteration, and deployment.",
//   ]}
// />
```

**Archetype intensity:**
- **Full/Moderate:** Use BLUF on every content-heavy section with question-based headings
- **Subtle/Minimal:** Do NOT use BLUF -- Emotional Arc drives the narrative instead

#### GEO-02: Question-Based Headings

Headings phrased as questions that AI engines directly extract as Q&A pairs. Each question heading pairs naturally with a BLUF answer paragraph. Convert statement headings to question headings where natural.

**Statement to question conversion examples:**

| Statement Heading | Question Heading |
|---|---|
| Our Design Process | How does the design process work? |
| Pricing Plans | How much does it cost? |
| Technology Stack | What technologies are used? |
| Performance Results | How fast is the site? |
| Client Testimonials | What do clients say? |

**Archetype intensity:**
- **Full:** Direct question phrasing ("How does X work?", "What is Y?", "Why choose Z?")
- **Moderate:** Natural question phrasing ("Want to know how X works?", "Wondering about Y?")
- **Subtle:** Implied questions via section topics -- do not literally phrase headings as questions. Use evocative topic labels that suggest the question without asking it.
- **Minimal:** Declarative statements preferred ("The Process", "The Stack", "The Results")

#### GEO-03: Quotable Statistics with Citations

Statistics formatted for AI extraction with source attribution. AI engines actively look for cited data points to include in generated answers. The Princeton GEO research (KDD 2024) found that Statistics Addition shows strong performance improvements in AI engine visibility.

Only use when content naturally warrants statistics -- no forced stat insertion. Every statistic must have a verifiable source.

```tsx
// Pattern: Quotable statistic callout with citation

interface StatisticProps {
  value: string;       // "40%"
  label: string;       // "visibility increase in AI search results"
  source: string;      // "Princeton GEO Research"
  sourceUrl?: string;  // Link to the study
  year: string;        // "2024"
}

function QuotableStatistic({
  value,
  label,
  source,
  sourceUrl,
  year,
}: StatisticProps) {
  return (
    <figure className="border-l-4 border-primary pl-6 py-4">
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-lg text-text mt-1">{label}</p>
      <figcaption className="text-sm text-text/60 mt-2">
        Source:{" "}
        {sourceUrl ? (
          <a href={sourceUrl} rel="noopener noreferrer">
            {source}
          </a>
        ) : (
          source
        )}{" "}
        ({year})
      </figcaption>
    </figure>
  );
}

// Example usage:
// <QuotableStatistic
//   value="40%"
//   label="visibility increase in AI search results with GEO optimization"
//   source="Princeton GEO Research, KDD 2024"
//   sourceUrl="https://arxiv.org/abs/2311.09735"
//   year="2024"
// />
```

**Archetype intensity:**
- **Full:** Inline stats with source citations, visually prominent callout design
- **Moderate:** Stats integrated naturally into copy with subtle citation formatting
- **Subtle:** Statistics only when content naturally warrants them, elegant typography
- **Minimal:** Rare, only when the statistic is central to the content's purpose

#### GEO-04: FAQ-First Content Pattern

FAQ sections designed for GEO visibility. The FAQ data array drives BOTH the visible component AND the FAQPage schema (see SDATA-02). This pattern is about the content strategy -- placing FAQ content prominently for AI extraction -- not just the technical schema.

> **Reminder:** FAQ rich results are restricted to gov/health sites since Aug 2023. This pattern targets AI search engines (ChatGPT, Perplexity, Claude Search), not Google FAQ rich results.

```tsx
// Pattern: Archetype-aware FAQ section with shared data source

interface FAQ {
  question: string;
  answer: string;
}

// The FAQ array is the single source of truth for both
// the visible component and the JSON-LD schema
const faqs: FAQ[] = [
  {
    question: "What makes this different from template builders?",
    answer:
      "Every project gets a unique Design DNA with custom color tokens, typography, and motion patterns. No two sites share the same visual identity.",
  },
  {
    question: "Do you support e-commerce?",
    answer:
      "Yes. Product pages, cart flows, and checkout are built with the ecommerce-ui skill using the same Design DNA system.",
  },
];

// Archetype-aware rendering -- visual differs, JSON-LD is identical
function FAQContent({ faqs, archetype }: { faqs: FAQ[]; archetype: string }) {
  // Visual styling adapts per archetype:
  //   Luxury/Fashion   -> elegant accordion, generous spacing, serif typography
  //   Japanese Minimal  -> minimal Q&A, thin dividers, monospace labels
  //   Brutalist         -> raw text blocks, no decoration, bold contrast
  //   Neo-Corporate     -> standard accordion, clean borders, system fonts
  //   Playful/Startup   -> colorful cards, rounded corners, playful icons
  //
  // The JSON-LD is ALWAYS the same regardless of visual treatment:
  //   buildFAQSchema(faqs) -> identical FAQPage schema

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      {faqs.map((faq) => (
        <details key={faq.question}>
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}

// Both components use the same faqs array:
// <FAQContent faqs={faqs} archetype={designDna.archetype} />
// <JsonLd data={buildFAQSchema(faqs)} />
```

### AI Crawler Content Guidance (GEO-04 Extension)

AI search bots consume structured data differently from Google. Understanding this distinction helps builders create content that is both search-engine-friendly and AI-extractable.

**AI search bots** (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Applebot-Extended) extract structured data to generate citations in AI answers. Content with FAQ schema, clear headings, and cited statistics is more extractable -- these bots look for structured, citable data points.

**Training bots** (GPTBot, ClaudeBot, Google-Extended, CCBot) consume content for model training. Blocking training bots protects content; blocking search bots makes the site invisible in AI search engines. These are fundamentally different operations.

**Content extractability principles:**
- FAQ schema makes Q&A pairs directly citable by AI search engines
- Question-based headings create natural extraction points for AI answers
- Statistics with source citations provide verifiable data points AI engines prefer to cite
- Article schema with author and date metadata signals trustworthiness (E-E-A-T)

**Scope boundary:** The full bot taxonomy with `robots.txt` rules and user-agent strings lives in the `seo-meta` skill's `appendix-ai-bots.md`. This skill focuses on making content EXTRACTABLE (schema + GEO patterns). The `seo-meta` skill handles making content CRAWLABLE (robots.txt, meta robots). Both skills work together -- a page needs to be both crawlable and extractable for AI search visibility.

<!-- END Layer 2 -- Plan 02 will append Layer 3 (Integration Context) and Layer 4 (Anti-Patterns) below this line -->
