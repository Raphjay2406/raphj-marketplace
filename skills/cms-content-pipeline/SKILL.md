---
name: cms-content-pipeline
description: "CMS content integration patterns: Contentful, Sanity, Strapi, Builder.io, Payload, and git-based (MDX/Content Collections). Real content during planning and building, not placeholder text. Framework-specific data fetching and rendering strategies."
tier: domain
triggers: "CMS, content management, Contentful, Sanity, Strapi, Builder.io, Payload, headless CMS, content API, content model, MDX, content collections"
version: "2.8.1"
---

## Layer 1: Decision Guidance

### When to Use

- Project has dynamic content (blog, products, team members, case studies) managed by non-developers
- Content changes more frequently than code deploys (weekly/daily updates)
- Multiple content editors need a visual editing interface
- Content needs to be structured (typed fields, relationships, media)

### When NOT to Use

- Content is static and changes only on code deploy (use CONTENT.md directly)
- Single-page marketing sites with <20 content blocks (overkill)
- Content is code-generated (use Remotion/programmatic content)

### CMS Selection Decision Tree

```
Does the team need visual editing (WYSIWYG)?
  YES → Builder.io (visual) or Sanity (studio + preview)
  NO → Continue

Is content developer-managed (git-based)?
  YES → MDX files (Next.js) or Content Collections (Astro)
  NO → Continue

Budget available for hosted CMS?
  YES → Contentful (enterprise) or Sanity (flexible, generous free tier)
  NO → Payload CMS (self-hosted, free) or Strapi (self-hosted)

Need real-time collaboration?
  YES → Sanity (real-time multiplayer) or Contentful
  NO → Any option works
```

---

## Layer 2: Implementation Patterns

### Pattern 1: Sanity + Next.js (Recommended for Most Projects)

```tsx
// lib/sanity.ts — Client setup
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});

// GROQ query for sections
export async function getPageSections(slug: string) {
  return client.fetch(`
    *[_type == "page" && slug.current == $slug][0]{
      title,
      sections[]{
        _type,
        _key,
        heading,
        body,
        "image": image.asset->url,
        cta { text, href }
      }
    }
  `, { slug });
}
```

```tsx
// app/[slug]/page.tsx — Rendering with real content
import { getPageSections } from '@/lib/sanity';
import { HeroSection } from '@/components/sections/hero';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageSections(slug);

  return (
    <main>
      {page.sections.map((section) => {
        switch (section._type) {
          case 'hero': return <HeroSection key={section._key} {...section} />;
          // Map each CMS section type to a Genorah-built component
        }
      })}
    </main>
  );
}
```

### Pattern 2: Astro + Content Collections (Git-Based)

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### Pattern 3: Rendering Strategy Per Content Type

| Content Type | Freshness | Strategy | Framework Implementation |
|-------------|-----------|----------|-------------------------|
| Blog posts | Hourly-daily | ISR (60-300s) | Next.js: `cacheLife('hours')`, Astro: `prerender: false` with cache headers |
| Product catalog | Real-time | SSR | Next.js: no cache directive, Astro: SSR mode |
| Landing pages | On-deploy | SSG | Next.js: `generateStaticParams`, Astro: `prerender: true` |
| Team/about | Weekly | ISR (3600s) | Next.js: `cacheLife('days')`, Astro: ISR with long TTL |
| Pricing | Daily | ISR (300s) | Next.js: short cache, Astro: hybrid |
| Legal/docs | Rarely | SSG | Full static, rebuild on content change |

### Content-to-Section Mapping

During `/gen:plan`, map CMS content types to Genorah sections:

```markdown
## Content Sources (in PLAN.md)

| Section | Content Source | CMS Type | Fetch Strategy |
|---------|--------------|----------|----------------|
| hero | CMS: page.hero | sanity:page | ISR 300s |
| features | CMS: features[] | sanity:feature | ISR 3600s |
| testimonials | CMS: testimonials[] | sanity:testimonial | ISR 3600s |
| pricing | CMS: plans[] | sanity:plan | ISR 300s |
| blog-grid | CMS: posts[] | sanity:post | ISR 60s |
| team | CMS: members[] | sanity:person | ISR 3600s |
| cta | Static: CONTENT.md | -- | SSG |
```

---

## Layer 3: Integration Context

### DNA Connection

CMS content must render with DNA tokens:
- CMS provides text content and image URLs
- Genorah components apply DNA typography, colors, spacing
- CMS should NOT store styling information (no inline CSS, no color fields)
- Images from CMS processed through image-asset-pipeline (optimization, responsive)

### Pipeline Stage

- **Input from:** PROJECT.md (CMS type detected in discovery), PLAN.md (per-section content source)
- **Output to:** Builder spawn prompt (content fetching code), sections code (data rendering)
- **Timing:** CMS schema defined during `/gen:plan`, data fetching during `/gen:build` Wave 2+

---

## Layer 4: Anti-Patterns

### Anti-Pattern: CMS Stores Design Decisions
**What goes wrong:** CMS fields include "background color", "font size", "layout type". Content editors break the design system by choosing colors outside DNA.
**Instead:** CMS stores CONTENT only (text, images, relationships). ALL visual decisions come from Design DNA and component code.

### Anti-Pattern: Fetch Everything at Build Time
**What goes wrong:** SSG with 5000 products. Build takes 45 minutes. Every content change requires full rebuild.
**Instead:** Use ISR for large collections. Generate top 100 products at build, rest on-demand with cache.

### Anti-Pattern: No Preview Mode
**What goes wrong:** Content editors publish changes without seeing how they look. Broken layouts reach production.
**Instead:** Implement draft/preview mode: Sanity's `draftMode()`, Contentful preview API, or local dev preview.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| CMS fields for styling | 0 | 0 | count | HARD — no design in CMS |
| ISR revalidation for blog | 30 | 300 | seconds | SOFT — balance freshness vs build cost |
| Preview mode | 1 | 1 | boolean | HARD — must have preview for CMS content |
| Content type mapping | 1 | 1 | per section | HARD — every CMS section has explicit content source |
