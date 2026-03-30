# Phase 15: Structured Data & GEO - Research

**Researched:** 2026-02-25
**Domain:** JSON-LD Structured Data, Generative Engine Optimization, AI Crawler Taxonomy, Schema Audit
**Confidence:** HIGH (core schema patterns verified via Google official docs; GEO impact data MEDIUM)

## Summary

Phase 15 creates a new `structured-data` skill (Domain tier) providing typed JSON-LD schemas for all major page types, plus GEO-optimized content patterns integrated into Genorah's Emotional Arc system. The user has decided against `schema-dts` in favor of plain TypeScript interfaces maintained manually.

The research uncovered three critical findings that reshape the plan:

1. **HowTo rich results have been completely removed by Google** (Aug-Sep 2023, fully deprecated on both mobile and desktop). HowTo schema still has value for AI engines extracting step-by-step content, but it no longer triggers any visual rich results in Google Search. The skill should document this honestly.

2. **FAQ rich results are now restricted to authoritative government and health websites** (Aug 2023). However, FAQ schema remains critical for GEO -- pages with FAQ schema are reported as significantly more likely to appear in AI Overviews (correlation data from Frase.io/Search Engine Land, MEDIUM confidence). The skill must distinguish between "FAQ schema for rich results" (restricted) and "FAQ schema for AI visibility" (universal value).

3. **The sitelinks search box has been deprecated** (Nov 2024). WebSite schema's primary Google rich result is gone. WebSite schema still has value for site identity and AI entity recognition, but the skill should not promise sitelinks search box results.

**Primary recommendation:** Build the structured-data skill around two pillars: (1) JSON-LD recipes per page type with honest disclosure of which schemas still trigger Google rich results vs which serve AI engines, and (2) GEO content patterns mapped to Emotional Arc beats with archetype-aware intensity levels.

## Standard Stack

This phase produces a SKILL.md file (markdown) -- no runtime libraries or build dependencies.

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Plain TypeScript interfaces | N/A | Type safety for JSON-LD schemas | User decision: no schema-dts. Hand-written interfaces matching schema.org. |
| JSON-LD via `<script type="application/ld+json">` | N/A | Structured data injection | Google-recommended format over microdata and RDFa |
| `@graph` array pattern | N/A | Multi-schema pages | Single script tag combining all applicable schemas |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Rich Results Test | N/A | Validation tool (external) | Every page with structured data -- verify before deploy |
| Schema.org Markup Validator | N/A | Validation tool (external) | Cross-check against schema.org vocabulary |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain TS interfaces | `schema-dts` v1.1.5 | User decided AGAINST schema-dts. Plain interfaces require manual maintenance when schema.org updates, but avoid the dependency. |
| Single `@graph` script | Multiple separate `<script>` tags | Separate tags are simpler to debug but `@graph` is cleaner for pages with 3+ schemas. User decided on `@graph`. |

## Architecture Patterns

### Recommended Skill Structure

The structured-data skill follows the 4-layer SKILL.md format. Based on the scope of content (10+ schema types, GEO patterns, Emotional Arc integration, schema audit protocol), this skill will likely be 500-700 lines.

```
skills/
  structured-data/
    SKILL.md          # Domain tier, 4-layer format
```

### Pattern 1: TypeScript Interfaces for JSON-LD

**What:** Hand-written TypeScript interfaces matching schema.org vocabulary for type-safe JSON-LD generation.
**When to use:** Every page that outputs structured data.

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

interface BreadcrumbListSchema extends SchemaBase {
  "@type": "BreadcrumbList";
  itemListElement: ListItemSchema[];
}

interface ListItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string; // URL -- omit for final item
}

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

// Supporting types
interface PersonSchema {
  "@type": "Person"; name: string; url?: string;
}
interface ImageObjectSchema {
  "@type": "ImageObject"; url: string; width?: number; height?: number;
}
interface PostalAddressSchema {
  "@type": "PostalAddress"; streetAddress?: string;
  addressLocality?: string; addressRegion?: string;
  postalCode?: string; addressCountry?: string;
}
interface ContactPointSchema {
  "@type": "ContactPoint"; telephone: string; contactType: string;
}
interface OfferSchema {
  "@type": "Offer"; price?: string; priceCurrency?: string;
  availability?: string; url?: string; validFrom?: string;
}
interface AggregateRatingSchema {
  "@type": "AggregateRating"; ratingValue: string;
  reviewCount?: string; bestRating?: string;
}
interface ReviewSchema {
  "@type": "Review"; author: PersonSchema;
  reviewRating: { "@type": "Rating"; ratingValue: string; };
  reviewBody?: string;
}
interface BrandSchema { "@type": "Brand"; name: string; }
interface PlaceSchema {
  "@type": "Place"; name: string; address: PostalAddressSchema;
}
interface VirtualLocationSchema {
  "@type": "VirtualLocation"; url: string;
}
interface GeoCoordinatesSchema {
  "@type": "GeoCoordinates"; latitude: number; longitude: number;
}
interface OpeningHoursSchema {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[]; opens: string; closes: string;
}
```

### Pattern 2: `@graph` Combination Pattern

**What:** Single `<script type="application/ld+json">` tag combining all page schemas.
**When to use:** Any page with 2+ schema types (most pages).

```typescript
// Example: Blog post page combines Article + BreadcrumbList + Organization
function buildPageSchema(page: BlogPost, site: SiteConfig): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
        sameAs: site.socialProfiles,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: page.title },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: page.title,
        description: page.excerpt,
        image: page.coverImage,
        datePublished: page.publishedAt,
        dateModified: page.updatedAt,
        author: { "@type": "Person", name: page.author.name, url: page.author.url },
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };
}
```

**Gotchas:**
- Declare `@context` only once at the root level (not inside each `@graph` entry)
- Use `@id` to cross-reference entities (e.g., publisher references organization)
- Keep hierarchy shallow -- deeply nested `@graph` structures confuse crawlers
- Google's Rich Results Test parses `@graph` correctly; no functional difference from separate scripts
- For debugging, separate `<script>` tags are easier but `@graph` is cleaner for production

### Pattern 3: Per-Page-Type Schema Recipes

**What:** Prescriptive schema recipes for common Genorah page types.
**When to use:** Section planners and builders reference these when generating JSON-LD.

| Page Type | Schema Combination | Notes |
|-----------|-------------------|-------|
| **Homepage** | Organization + WebSite + BreadcrumbList | WebSite no longer triggers sitelinks search box (deprecated Nov 2024) but aids entity recognition |
| **Blog Post** | BlogPosting + BreadcrumbList + FAQPage (if FAQ exists) | FAQPage for GEO even though rich results are restricted |
| **Article/News** | Article or NewsArticle + BreadcrumbList + FAQPage | NewsArticle for time-sensitive content |
| **Product Page** | Product + BreadcrumbList + FAQPage | Product schema requires name + offers for rich results |
| **Service Page** | Organization + BreadcrumbList + FAQPage | No dedicated Service rich result; Organization helps entity recognition |
| **About Page** | Organization + BreadcrumbList | Full Organization details here |
| **Contact Page** | Organization (with ContactPoint) + LocalBusiness + BreadcrumbList | LocalBusiness for physical locations |
| **Event Page** | Event + BreadcrumbList + Organization | Event requires name + startDate + location |
| **Landing Page** | Organization + BreadcrumbList + FAQPage (if content warrants) | Keep schemas minimal; content-schema match is critical |
| **Tutorial/Guide** | Article + BreadcrumbList + FAQPage | HowTo schema still valid for AI extraction but NO Google rich results |
| **Portfolio** | Organization + BreadcrumbList | Minimal schemas; visual content is the focus |

### Pattern 4: SEO-Emotional Arc Integration

**What:** Per-beat prescriptive mapping of which SEO/GEO elements belong at each beat position.
**When to use:** Section planners reference this when assigning beats during `/gen:plan-dev`.

| Beat | SEO/GEO Element | Schema Contribution | Rationale |
|------|-----------------|---------------------|-----------|
| **HOOK** | H1 + primary keyword in headline | `headline` field in Article schema | First heading signals topic to search engines and AI |
| **TEASE** | No required SEO elements | None | Purely emotional beat |
| **REVEAL** | No required SEO elements | None | Purely emotional beat |
| **BUILD** | No required SEO elements | None | Purely emotional beat |
| **PEAK** | No required SEO elements | None | Purely emotional beat |
| **BREATHE** | No required SEO elements | None | Purely emotional beat |
| **TENSION** | FAQ section + question-based heading | `FAQPage` schema from this section's Q&A content | Questions naturally create tension; FAQ schema captures them |
| **PROOF** | Statistics with citations + author credentials | `author` details in Article; quotable stats for AI extraction | Data-backed claims signal E-E-A-T; AI engines extract cited stats |
| **PIVOT** | No required SEO elements | None | Purely emotional beat |
| **CLOSE** | CTA + Organization schema | `Organization` schema reinforces brand entity at conversion point | Final touchpoint ties brand identity to action |

**Hard enforcement:** Quality reviewer fails builds that miss required SEO elements on mapped beats (HOOK, TENSION, PROOF, CLOSE).

**Purely emotional beats** (TEASE, REVEAL, BUILD, PEAK, BREATHE, PIVOT) do not carry required SEO elements. This is by design -- over-optimizing every section destroys the emotional arc.

### Pattern 5: GEO Content Patterns by Archetype Intensity

**What:** Archetype-aware GEO intensity that prevents over-optimization from destroying premium aesthetics.
**When to use:** Builders reference this when implementing GEO patterns within archetype constraints.

| GEO Intensity | Archetypes | FAQ Style | Statistics | BLUF | Question Headings |
|---------------|-----------|-----------|------------|------|-------------------|
| **Full** | Neo-Corporate, Data-Dense, Editorial, Dark Academia | Standard accordion, visually prominent | Inline stats with source citations | Yes, lead with answer | Direct question phrasing |
| **Moderate** | Playful/Startup, Organic, Warm Artisan, Retro-Future, Neubrutalism, AI-Native | Styled accordion matching archetype personality | Stats integrated naturally into copy | Yes, for articles/blog posts | Natural question phrasing |
| **Subtle** | Luxury/Fashion, Japanese Minimal, Ethereal, Swiss/International, Glassmorphism | Elegant Q&A section, minimal chrome | Statistics only when content warrants | No -- Emotional Arc drives the story | Implied questions via section topics |
| **Minimal** | Brutalist, Kinetic, Neon Noir, Vaporwave | Raw text Q&A or hidden in footer | Rare, only when central to content | No | Declarative statements preferred |

**Key principle:** Same SEO signals, different visual expression. A Luxury FAQ section uses elegant typography and generous spacing. A Brutalist FAQ uses raw text blocks. Both have identical JSON-LD underneath.

### Anti-Patterns to Avoid

- **Schema-content mismatch:** JSON-LD claims data that is not visible on the page. Google issues manual actions (loss of rich result eligibility) for this. The schema audit protocol catches this.
- **FAQ schema on every page regardless of content:** FAQ schema must contain real questions and answers that appear on the page. Invisible or fabricated FAQ content triggers manual actions.
- **HowTo schema expecting rich results:** HowTo rich results are fully deprecated. Keep HowTo schema for AI extraction value but do not promise visual rich results.
- **Over-optimizing emotional beats:** Adding keywords and FAQ sections to BREATHE or PEAK beats destroys the emotional arc for marginal SEO gain.
- **Blocking AI search bots:** Conflating training bots (block) with search bots (allow) makes the site invisible to ChatGPT search, Perplexity, and similar AI search engines.

## Don't Hand-Roll

Problems that look simple but have existing solutions or established patterns:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema type validation | Custom schema validator | Google Rich Results Test + Schema.org Validator | Google is the arbiter of what triggers rich results; use their tool |
| AI crawler identification | Custom bot detection | robots.txt user-agent rules | Standard protocol; all major AI crawlers publish their user-agent strings |
| Schema-content consistency | Manual spot-checking | Structured audit protocol (documented in skill) | Systematic protocol prevents drift after iterative edits |
| JSON-LD generation | String concatenation | Typed builder function returning `SchemaGraph` | Type safety catches errors at compile time |

**Key insight:** Since this project produces a SKILL.md knowledge base (not application code), "don't hand-roll" translates to "don't teach builders to hand-roll these things" -- instead provide copy-paste patterns they adapt.

## Common Pitfalls

### Pitfall 1: Assuming FAQ Schema Still Triggers Rich Results for All Sites

**What goes wrong:** Builder adds FAQ schema expecting FAQ rich results in Google search. Rich results never appear because the site is not a government or health authority.
**Why it happens:** Pre-2023 documentation and tutorials still recommend FAQ schema for rich results. The August 2023 restriction is not widely known.
**How to avoid:** The skill must clearly state: "FAQ rich results are restricted to authoritative government and health websites since August 2023. However, FAQ schema remains critical for AI search visibility (GEO). Implement FAQ schema for AI engines, not for Google rich results."
**Warning signs:** Rich Results Test shows valid FAQ markup but rich results never appear in search.

### Pitfall 2: Schema-Content Mismatch After Iteration

**What goes wrong:** During `/gen:iterate`, page content changes but JSON-LD is not updated. Schema claims prices, dates, or facts that no longer match visible content.
**Why it happens:** JSON-LD is typically in a separate component or file from the visible content. Content edits do not automatically propagate to schema.
**How to avoid:** Run schema audit on every quality-reviewer pass. The audit protocol checks: (1) every JSON-LD claim has a visible counterpart on the page, (2) dates are current, (3) prices match, (4) FAQ answers match displayed text.
**Warning signs:** Google Search Console "Structured data" errors or manual action for spammy markup.

### Pitfall 3: HowTo Schema Expecting Visual Rich Results

**What goes wrong:** Builder implements HowTo schema for tutorial content and expects step-by-step rich results in Google search. Nothing appears.
**Why it happens:** Google fully deprecated HowTo rich results (mobile in Aug 2023, desktop in Sep 2023). The schema is still valid but triggers no visual presentation.
**How to avoid:** Skill must document: "HowTo schema no longer generates Google rich results. It remains useful for AI engine extraction of step-by-step content. Use Article schema as the primary schema for tutorial pages."
**Warning signs:** Rich Results Test shows valid HowTo but no "eligible for rich results" message.

### Pitfall 4: Blocking AI Search Bots Alongside Training Bots

**What goes wrong:** robots.txt blocks all AI bots indiscriminately. Site becomes invisible in ChatGPT search, Perplexity, and other AI answer engines.
**Why it happens:** "Block AI bots" advice conflates training bots and search bots. Copy-paste robots.txt patterns block everything.
**How to avoid:** The AI crawler taxonomy clearly distinguishes training bots (GPTBot, Google-Extended, ClaudeBot, CCBot -- block to protect content) from search bots (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Applebot-Extended -- allow for visibility).
**Warning signs:** Site does not appear in any AI search engine answers despite having relevant content.

### Pitfall 5: Over-Optimizing Content Destroying Premium Aesthetics

**What goes wrong:** Every section has FAQ blocks, statistical callouts, question headings, and BLUF paragraphs. The page looks like an SEO farm, not an award-winning design.
**Why it happens:** GEO advice treats all pages as content marketing. Premium archetypes (Luxury, Ethereal, Japanese Minimal) require restraint.
**How to avoid:** Archetype-aware GEO intensity mapping (Pattern 5 above). Only high-impact beats (HOOK, TENSION, PROOF, CLOSE) carry required SEO elements. Emotional beats remain purely visual.
**Warning signs:** Anti-Slop Gate "Creative Courage" score drops; page feels generic despite having a strong archetype.

### Pitfall 6: Duplicate @context Declarations in @graph

**What goes wrong:** Each schema object inside `@graph` includes its own `"@context": "https://schema.org"`. Validators may warn or behave unexpectedly.
**Why it happens:** Copy-pasting individual schema examples into an `@graph` array without removing the per-item `@context`.
**How to avoid:** Declare `@context` exactly once at the root level of the `@graph` wrapper. Individual entries within the `@graph` array must NOT include `@context`.

## Code Examples

### Example 1: JsonLd Component (React/Next.js)

The JsonLd component uses `JSON.stringify` to serialize developer-controlled schema data into a script tag. This is safe because: (1) the data is developer-authored schema, not user input, and (2) `JSON.stringify` escapes all HTML-special characters (`<`, `>`, `&`, `"`, `'`). If user-generated content is ever included in schema data, it must be sanitized before passing to the component.

```tsx
// components/JsonLd.tsx
// Source: Google Structured Data docs + existing seo-meta skill pattern

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  // SAFETY: JSON.stringify escapes <, >, & -- safe for developer-controlled
  // schema data. If user input is ever included, sanitize it first.
  const jsonString = JSON.stringify(data);
  return (
    <script type="application/ld+json" {...{ dangerouslySetInnerHTML: { __html: jsonString } }} />
  );
}

// Astro equivalent (no React, no innerHTML concern):
// <script type="application/ld+json" set:html={JSON.stringify(data)} />
```

### Example 2: FAQ Schema with Visible Content Match

```tsx
// Correct: FAQ schema matches visible FAQ section
const faqs = [
  {
    question: "What frameworks does Genorah support?",
    answer: "Next.js 16, Astro 5/6, React 19/Vite, Tauri, and Electron."
  },
  {
    question: "How long does a typical project take?",
    answer: "Most sites are production-ready in 2-4 weeks."
  },
];

// Visible FAQ section (renders on page -- MUST match schema)
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

// JSON-LD (matches visible content exactly)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};
```

### Example 3: Full Page @graph Assembly

```typescript
// lib/schema/buildPageSchema.ts
function buildBlogPostSchema(post: BlogPost, site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organization (site-wide, referenced by @id)
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/logo.png`,
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
      // FAQPage (conditionally included if post has FAQ content)
      ...(post.faqs?.length ? [{
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }] : []),
    ],
  };
}
```

### Example 4: Schema Audit Protocol

```markdown
## Schema Audit Checklist (run on every quality-reviewer pass)

### Content-Schema Consistency
For each JSON-LD claim on the page:
- [ ] headline matches visible H1 text
- [ ] description matches visible meta description or first paragraph
- [ ] datePublished is accurate (not a placeholder)
- [ ] dateModified reflects actual last edit (not build time)
- [ ] author.name matches visible author byline
- [ ] image URL resolves to an actual image (not 404)
- [ ] FAQ Question.name matches visible question text exactly
- [ ] FAQ Answer.text matches visible answer text exactly
- [ ] Product offers.price matches visible price on page
- [ ] Product offers.availability matches visible stock status

### Structural Validation
- [ ] @context declared exactly once (at root level)
- [ ] No orphaned @context inside @graph entries
- [ ] All @id references point to defined entities
- [ ] No duplicate schema types (e.g., two Organization schemas)

### External Validation Guidance
- [ ] Paste page URL into Google Rich Results Test
- [ ] Verify "eligible for rich results" where expected
- [ ] Check Google Search Console > Enhancements for errors
- [ ] No manual actions in Search Console > Security and Manual Actions

### Auto-Fix Protocol
When schema audit finds mismatches:
1. Update JSON-LD to match current visible content
2. Log what changed (old value -> new value)
3. Notify user: "Schema audit: updated [field] from [old] to [new]
   to match visible content"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FAQ rich results for all sites | FAQ rich results restricted to gov/health sites | Aug 2023 | FAQ schema still critical for GEO but no longer guarantees rich results |
| HowTo rich results | HowTo rich results fully deprecated | Aug-Sep 2023 | Use Article schema for tutorials; keep HowTo for AI extraction only |
| Sitelinks search box via WebSite schema | Sitelinks search box removed | Nov 2024 | WebSite schema still useful for entity recognition but no visual rich result |
| `schema-dts` for type safety | Plain TypeScript interfaces | User decision | Manual maintenance required but no dependency |
| Block all AI bots | Distinguish training vs search bots | 2024-2025 | Allow search bots (OAI-SearchBot, PerplexityBot) for AI visibility |
| SEO and content are separate concerns | GEO requires structured content patterns | 2024-2025 | BLUF formatting, question headings, quotable stats now affect AI citations |
| 7 additional schema types (Book Actions, Course Info, etc.) | Deprecated by Google | Jun 2025 | Does not affect schemas in our scope |

**Deprecated/outdated:**
- `HowTo` rich results: Fully gone. Schema is valid but no visual rich result. Use for AI extraction only.
- `Sitelinks search box`: Removed Nov 2024. No need to implement `potentialAction` SearchAction.
- `schema-dts`: User decided against. Use plain TypeScript interfaces.
- FAQ rich results for general sites: Restricted to gov/health since Aug 2023. FAQ schema still has GEO value.

## AI Crawler Taxonomy (2026)

Verified taxonomy for AI crawler guidance. This is a Claude's Discretion area -- extending beyond Phase 14's robots.txt with schema-level guidance.

### Training Bots (BLOCK by default)

| Bot | Operator | User-Agent String | Purpose | Respects robots.txt |
|-----|----------|-------------------|---------|---------------------|
| GPTBot | OpenAI | `GPTBot` | LLM training data collection | Yes |
| Google-Extended | Google | `Google-Extended` | Gemini model training | Yes |
| ClaudeBot | Anthropic | `ClaudeBot` | Claude model training data | Yes |
| CCBot | Common Crawl | `CCBot` | Open training dataset | Yes |
| anthropic-ai | Anthropic | `anthropic-ai` | Bulk model training | Yes |
| cohere-ai | Cohere | `cohere-ai` | Language model training | Yes |
| Bytespider | ByteDance | `Bytespider` | TikTok/model training | Inconsistent |

### Search Bots (ALLOW for AI visibility)

| Bot | Operator | User-Agent String | Purpose | Respects robots.txt |
|-----|----------|-------------------|---------|---------------------|
| OAI-SearchBot | OpenAI | `OAI-SearchBot` | ChatGPT search/citation | Yes |
| ChatGPT-User | OpenAI | `ChatGPT-User` | User-initiated browsing | May not apply (user-triggered) |
| PerplexityBot | Perplexity | `PerplexityBot` | Perplexity AI search | Inconsistent (criticized) |
| Claude-SearchBot | Anthropic | `Claude-SearchBot` | Claude search quality | Yes |
| Claude-User | Anthropic | `Claude-User` | User-initiated web access | May not apply (user-triggered) |
| Applebot-Extended | Apple | `Applebot-Extended` | Apple Intelligence | Yes |
| DuckAssistBot | DuckDuckGo | `DuckAssistBot` | DuckAssist AI answers | Yes |

### Traditional Search (ALLOW -- not new)

| Bot | Operator | Purpose |
|-----|----------|---------|
| Googlebot | Google | Google Search indexing |
| Bingbot | Microsoft | Bing Search + Copilot |
| Applebot | Apple | Siri + Spotlight |

### Emerging Agentic Browsers (CANNOT BLOCK via robots.txt)

| Bot | Operator | Notes |
|-----|----------|-------|
| ChatGPT Atlas | OpenAI | Uses standard Chrome user agent -- indistinguishable |
| GoogleAgent-Mariner | Google | Project Mariner for AI Ultra subscribers |
| OpenAI Operator | OpenAI | Acts like Chrome; no known distinct user agent |

**Confidence:** HIGH for established bots (OpenAI, Google, Anthropic official docs). MEDIUM for PerplexityBot compliance. LOW for agentic browsers (rapidly evolving).

## Speakable Schema Assessment

**Status:** Still in beta (as of Dec 2025 Google docs update). Limited to US, English, Google Home devices.
**Recommendation:** Do NOT include in the structured-data skill. Speakable is too limited geographically, too niche (Google Home only), and has been in beta for years with minimal expansion. If Google graduates Speakable from beta, it can be added in a future update.
**Confidence:** HIGH (verified from official Google Speakable docs page).

## GEO Impact Data Verification

### FAQ Schema Correlation Claim

**Source:** Frase.io blog (Nov 2025), attributing the statistic to "Search Engine Land analysis."
**Methodology:** Not disclosed. No sample size, no study URL, no methodology details.
**What it actually says:** "Pages appearing in Google AI Overviews are more likely to have FAQ schema implemented compared to pages that don't appear in AI-generated answers."
**Assessment:** This is a correlation statistic, not causation. Pages that implement FAQ schema are likely already well-optimized. The specific magnitude is from a single unverifiable source.
**Recommendation:** Use "pages with FAQ schema appear in AI Overviews at significantly higher rates" without citing a specific multiplier in the skill. The directional finding (FAQ schema helps AI visibility) is supported by multiple sources including the Princeton GEO research.
**Confidence:** MEDIUM for directional finding (FAQ schema helps GEO). LOW for specific magnitude claims.

### Princeton GEO Research (KDD 2024)

**Verified findings:**
- GEO methods can boost visibility by up to 40% in generative engine responses
- "Cite Sources" method led to 115.1% increase in visibility for sites ranked 5th in SERP
- Statistics Addition and Quotation Addition show strong performance improvements
- Lower-ranked sites benefit MORE from GEO than higher-ranked sites
- Benchmark: GEO-BENCH with 10,000 diverse queries
**Confidence:** HIGH (peer-reviewed, published at KDD 2024)

### Google Article Schema Properties

**Verified from official docs (developers.google.com):**
- NO required properties (all recommended)
- Key recommended: `headline`, `image`, `datePublished`, `dateModified`, `author`, `author.name`, `author.url`
- Image requirements: minimum 50K pixels (width x height), provide 16:9, 4:3, and 1:1 aspect ratios
- Headline: keep concise, long titles may truncate
- Dates: ISO 8601 format
- Supported types: Article, NewsArticle, BlogPosting
**Confidence:** HIGH (official Google documentation)

## Google Structured Data Requirements Summary

Verified per-type requirements for all schemas in scope:

| Schema Type | Required Properties | Google Rich Result | Current Status |
|-------------|--------------------|--------------------|----------------|
| **Article/BlogPosting/NewsArticle** | None (all recommended) | Article rich result, Google News | Active |
| **FAQPage** | `mainEntity` (Question array) | FAQ rich result (gov/health only) | Active but restricted |
| **HowTo** | `name`, `step` array | NONE -- fully deprecated | Schema valid, no rich result |
| **Organization** | None (all recommended) | Knowledge panel, brand profile | Active |
| **WebSite** | None (all recommended) | NONE -- sitelinks search box removed | Schema valid, no rich result |
| **BreadcrumbList** | `itemListElement` (ListItem array) | Breadcrumb trail in search results | Active |
| **Product** | `name` | Product snippet, Popular Products | Active |
| **LocalBusiness** | `name`, `address` | Local business panel | Active |
| **Event** | `name`, `startDate`, `location` | Event experience on Google | Active |

## Open Questions

Things that could not be fully resolved:

1. **FAQ schema GEO impact precision**
   - What we know: FAQ schema correlates with higher AI Overview appearance. Princeton research confirms structured content helps GEO.
   - What is unclear: The exact magnitude of the effect. Specific multiplier claims are from single unverifiable sources.
   - Recommendation: Present FAQ schema as "high-impact for GEO" without citing a specific multiplier.

2. **PerplexityBot robots.txt compliance**
   - What we know: PerplexityBot publishes a user-agent string. Perplexity has an opt-out mechanism.
   - What is unclear: Multiple sources report PerplexityBot does not reliably respect robots.txt.
   - Recommendation: Document the user-agent string for robots.txt but note compliance is inconsistent. Mention Perplexity's opt-out header as an alternative.

3. **Agentic browser blocking**
   - What we know: ChatGPT Atlas, GoogleAgent-Mariner, and OpenAI Operator use standard Chrome user agents.
   - What is unclear: No established method to block these via robots.txt.
   - Recommendation: Document this as a known limitation. Content visible to human browsers will be visible to agentic browsers. This is not something the skill can solve.

4. **Archetype-to-GEO intensity mapping granularity**
   - What we know: The 4-tier system (Full/Moderate/Subtle/Minimal) maps cleanly to archetype personalities.
   - What is unclear: Whether specific archetypes need individual overrides beyond the tier grouping.
   - Recommendation: Start with the 4-tier mapping. Refine per-archetype during implementation if the planner identifies edge cases. This is a Claude's Discretion area.

## Sources

### Primary (HIGH confidence)
- [Google FAQ Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/faqpage) -- FAQ eligibility restrictions, required properties
- [Google Article Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/article) -- Article/BlogPosting/NewsArticle properties
- [Google Organization Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/organization) -- Organization properties, knowledge panel
- [Google BreadcrumbList Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) -- Required ListItem properties
- [Google Product Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/product) -- Product rich result types
- [Google Event Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/event) -- Event required properties
- [Google Structured Data Policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) -- Content-schema match requirements, manual action policies
- [Google Speakable Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/speakable) -- Beta status, US/English only
- [Google: Sitelinks Search Box Deprecation](https://developers.google.com/search/blog/2024/10/sitelinks-search-box) -- Removed Nov 2024
- [Google: HowTo/FAQ Changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes) -- Aug 2023 restrictions
- [Google: Simplifying Search Results](https://developers.google.com/search/blog/2025/06/simplifying-search-results) -- 7 schema types deprecated Jun 2025
- [Anthropic Crawler Documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) -- ClaudeBot, Claude-User, Claude-SearchBot
- [OpenAI Bots Documentation](https://platform.openai.com/docs/bots) -- GPTBot, OAI-SearchBot, ChatGPT-User
- [GEO: Generative Engine Optimization (KDD 2024)](https://arxiv.org/abs/2311.09735) -- Princeton/Georgia Tech peer-reviewed research

### Secondary (MEDIUM confidence)
- [Search Engine Land: FAQ Schema Rise and Fall](https://searchengineland.com/faq-schema-rise-fall-seo-today-463993) -- FAQ schema current status analysis
- [Frase.io: FAQ Schema AI Search](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) -- FAQ schema AI Overview correlation claim
- [Momentic: AI Search Crawlers List](https://momenticmarketing.com/blog/ai-search-crawlers-bots) -- Comprehensive AI bot taxonomy with user agents
- [Search Engine Journal: Google Retires 7 Structured Data Features](https://www.searchenginejournal.com/google-retires-7-structured-data-features-to-streamline-search-results/548952/) -- Jun 2025 deprecations

### Tertiary (LOW confidence)
- Various GEO optimization guides from SEO agencies (directional guidance, not authoritative)
- Agentic browser information (rapidly evolving, may be outdated quickly)
- Specific GEO impact percentages beyond the Princeton study

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Google official docs verified for all schema types
- Architecture: HIGH -- @graph pattern, per-page recipes, and Arc integration are well-established
- GEO patterns: MEDIUM -- Princeton research is solid but GEO is less than 3 years old and evolving
- AI crawler taxonomy: HIGH for established bots, MEDIUM for compliance behavior, LOW for agentic browsers
- Pitfalls: HIGH -- Google policies on content-schema match are explicit and verified

**Research date:** 2026-02-25
**Valid until:** 90 days for schema types and Google policies (stable domain). 30 days for AI crawler taxonomy (fast-moving). GEO impact data should be re-verified when writing the skill.
