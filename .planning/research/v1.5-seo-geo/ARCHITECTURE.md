# Architecture Patterns: SEO/GEO v1.5 Milestone

**Domain:** SEO, GEO, Sitemaps, IndexNow, AI Search Visibility
**Researched:** 2026-02-25

---

## Recommended Architecture

The SEO/GEO system integrates into Modulo's existing pipeline at three touchpoints:

```
/modulo:start-project          /modulo:execute              Post-Deploy
      |                              |                          |
  Discovery:                    Build-time:                 Deploy-time:
  - Brand name                  - Meta tags per section     - IndexNow POST
  - Target keywords             - JSON-LD per page type     - Sitemap submission
  - Content descriptions        - OG images (DNA tokens)    - GSC/Bing verification
  - Target languages            - robots.txt generation
                                - Sitemap generation
                                - llms.txt generation
```

### Component Boundaries

| Component | Responsibility | Lives In | Communicates With |
|-----------|---------------|----------|-------------------|
| **SEO/GEO Skill** | Pattern knowledge: meta tags, JSON-LD, GEO, sitemap rules | `skills/seo-meta/SKILL.md` (expanded) | Section builders, build orchestrator |
| **Meta tag patterns** | Framework-specific metadata implementation | Skill Layer 2 code examples | Section builders copy patterns |
| **JSON-LD schemas** | Typed structured data templates | Skill Layer 2 code examples | Section builders copy and adapt |
| **Sitemap patterns** | Framework-specific sitemap generation | Skill Layer 2 code examples | Wave 0 scaffold or Wave 1 setup |
| **IndexNow integration** | API call pattern for post-deploy | Skill Layer 2 code examples | CI/CD or deployment script |
| **robots.txt patterns** | Crawler access rules with AI bot awareness | Skill Layer 2 code examples | Wave 0 scaffold |
| **OG image patterns** | DNA-integrated ImageResponse/Satori | Skill Layer 2 code examples | Wave 0-1 setup |
| **GEO content patterns** | Content structure techniques for AI visibility | Skill Layer 1 guidance + Layer 2 examples | Copy intelligence, section builders |

### Data Flow

```
Start Project (Discovery)
    |
    |-- Brand info --> META DESCRIPTION templates
    |-- Target langs --> hreflang configuration
    |-- Site URL --> metadataBase, canonical root
    |
Plan Dev (Section Planning)
    |
    |-- Per-section: metadata props defined in PLAN.md
    |-- Per-page: schema type assigned (Article, FAQ, Product, etc.)
    |-- GEO: question-based headings planned for content sections
    |
Execute (Build)
    |
    |-- Wave 0: Scaffold
    |     |-- robots.txt (AI-aware)
    |     |-- llms.txt (if opted in)
    |     |-- Global metadata (metadataBase, title template, defaults)
    |     |-- JsonLd component (reusable, typed via schema-dts)
    |     |-- OG image template (route or component)
    |
    |-- Wave 1: Shared UI
    |     |-- Layout metadata (global OG, Twitter defaults)
    |     |-- Sitemap setup (sitemap.ts or @astrojs/sitemap config)
    |
    |-- Wave 2+: Sections
    |     |-- Per-page generateMetadata / <SEOHead> props
    |     |-- Per-page JSON-LD (Article, FAQ, etc.)
    |     |-- Per-page OG image (if dynamic)
    |
Post-Deploy
    |-- IndexNow POST (changed URLs to api.indexnow.org)
    |-- GSC/Bing sitemap submission (manual or automated)
```

---

## Patterns to Follow

### Pattern 1: Layered Metadata (Global -> Layout -> Page)

**What:** Metadata inheritance where global defaults are set in root layout, overridden per-page.

**When:** Every project. This is the standard pattern.

**Next.js implementation:**
```tsx
// app/layout.tsx -- global defaults
export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: { default: "Brand", template: "%s | Brand" },
  description: "Default brand description",
  openGraph: { siteName: "Brand", locale: "en_US" },
  robots: { index: true, follow: true },
};

// app/blog/[slug]/page.tsx -- page override
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return {
    title: post.title, // renders as "Post Title | Brand"
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.date },
  };
}
```

**Key principle:** Next.js metadata merges automatically. Page values override layout values. Nested layouts can add middle layers.

### Pattern 2: Typed JSON-LD Component

**What:** A reusable component that accepts typed schema objects and renders them safely.

**When:** Any page with structured data (most pages).

**Note on safety:** The JSON-LD component uses JSON.stringify to serialize developer-controlled schema data into a script tag. This is safe because: (1) the data is developer-authored schema, not user input, and (2) JSON.stringify escapes all HTML-special characters (`<`, `>`, `&`). If user-generated content is ever included in schema data, it must be sanitized before passing to JSON.stringify.

```tsx
import type { WithContext, Thing } from "schema-dts";

function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      {...{ dangerouslySetInnerHTML: { __html: JSON.stringify(data) } }}
    />
  );
}

// Usage with type safety:
import type { FAQPage } from "schema-dts";

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

<JsonLd data={faqSchema} />
```

### Pattern 3: AI-Aware robots.txt

**What:** robots.txt that distinguishes AI training bots from AI search bots.

**When:** Every public-facing project.

**Next.js:**
```tsx
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
      // AI Search Bots -- ALLOW for visibility
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      // AI Training Bots -- BLOCK
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

### Pattern 4: IndexNow Route Handler

**What:** A Next.js Route Handler that accepts URLs and submits to IndexNow.

**When:** Sites that need instant Bing/Yandex indexing on content publish.

```tsx
// app/api/indexnow/route.ts
import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST(request: Request) {
  const { urls } = await request.json();

  const response = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  return NextResponse.json({ status: response.status });
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: SEO Library Dependency

**What:** Installing `next-seo`, `react-helmet-async`, or other SEO wrapper libraries for Next.js App Router or React 19 projects.
**Why bad:** These libraries solve problems that no longer exist. Next.js has a complete built-in metadata API. React 19 has native metadata hoisting. The libraries add bundle size, maintenance burden, and often have stale peer dependencies.
**Instead:** Use framework-native APIs. The skill should teach the mechanics directly.

### Anti-Pattern 2: Duplicate Structured Data

**What:** Multiple JSON-LD scripts on the same page with conflicting or overlapping data (e.g., two `Organization` schemas from different components).
**Why bad:** Search engines may use either schema, creating inconsistent rich results. Some validators flag this as an error.
**Instead:** Centralize JSON-LD in the page-level component, not in individual sections. One `Organization` schema per site (in root layout). One `Article`/`FAQPage` per page.

### Anti-Pattern 3: IndexNow on Every Page Load

**What:** Calling IndexNow API on every server-side render or page visit.
**Why bad:** Wastes API calls, may trigger rate limiting, and provides no benefit (IndexNow only needs to be called when content CHANGES).
**Instead:** Trigger IndexNow on content publish (CMS webhook), deployment (CI/CD hook), or user action (admin panel "publish" button). Never on page render.

### Anti-Pattern 4: Sitemap as Afterthought

**What:** Adding sitemap generation as the last task, after all pages are built.
**Why bad:** Sitemap reveals architectural issues (non-canonical URLs, missing pages, broken routes) that should be caught earlier.
**Instead:** Set up sitemap in Wave 0-1. Validate sitemap URLs match canonical URLs from the start.

---

## Scalability Considerations

| Concern | Small Site (<100 pages) | Medium Site (100-10K) | Large Site (10K-50K+) |
|---------|------------------------|----------------------|----------------------|
| **Sitemap** | Single `sitemap.xml` | Single file, `priority` differentiation | Sitemap index with `generateSitemaps()` |
| **IndexNow** | Single POST after deploy | Batch changed URLs per deploy | Chunk into 10K batches with 1s delay |
| **JSON-LD** | Manual per page type | Template components per page type | Programmatic from CMS data |
| **OG Images** | Static default image | Per-page-type templates | Dynamic per page via `ImageResponse` |
| **Meta descriptions** | Manual per page | Template with variables | CMS-driven with fallback |

---

## Skill Structure Recommendation

The existing `seo-meta` skill is 399 lines. After v1.5 expansion, it will need to cover:
- Meta tags (existing) + React 19 update
- JSON-LD with `schema-dts` (expanded from existing)
- GEO techniques (NEW)
- Sitemaps (existing + validation rules)
- IndexNow (NEW)
- robots.txt AI bots (NEW)
- OG images (NEW)
- llms.txt (NEW)
- Canonical/hreflang pitfalls (expanded)

**Recommendation:** Split into two skills if content exceeds 400 lines:

1. **`seo-meta`** -- Meta tags, OG, canonical, hreflang, robots.txt, structured data (JSON-LD + schema-dts)
2. **`search-visibility`** -- GEO techniques, IndexNow, sitemap best practices, AI crawler management, llms.txt

This keeps each skill focused and under the line budget while covering all capabilities.

---

## Sources

See STACK.md for complete source list with confidence levels.

---
*Research completed: 2026-02-25*
