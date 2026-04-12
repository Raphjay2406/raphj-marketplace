---
name: cms-sanity
tier: domain
description: "Sanity Studio v3 integration: schema generation from emotional-arc beats, DNA-themed Studio, GROQ query patterns, Visual Editing/Presentation tool wiring for Next.js + Astro."
triggers: ["sanity", "sanity studio", "headless cms", "GROQ", "content lake", "visual editing", "presentation tool", "sanity client", "sanity schema"]
used_by: ["content-specialist", "builder", "start-project"]
version: "3.0.0"
metadata:
  pathPatterns:
    - "**/sanity/**/*.ts"
    - "**/sanity.config.ts"
---

## Layer 1: Decision Guidance

### Why Sanity

Sanity Studio is embeddable, open-source, DNA-themable, and its Presentation tool enables true visual editing against live routes. For most Modulo-style projects (marketing sites, SaaS landing, agency, real-estate), Sanity + Next.js or Astro is the default recommendation.

Payload is a valid alternative (Next-native, Postgres-backed) — see `cms-payload` skill. Contentful is discouraged for new projects in 2026 (pricing + declining developer mindshare).

### When to Use

- Client needs non-dev edit access to copy, imagery, listings, case studies.
- Project has >3 content types or expects >20 pages.
- Team has distinct content editors from developers.
- Localization (i18n) is in scope — Sanity handles multi-locale elegantly.

### When NOT to Use

- Static one-page landing (overkill, use inline content).
- Developer-only edits (MDX in repo is simpler).
- Strict data sovereignty (use Payload self-hosted).

## Layer 2: Technical Spec

### Studio scaffold

```bash
pnpm create sanity@latest --template clean --typescript --project {id} --dataset production
```

Studio embedded inside Next.js at `/studio/[[...tool]]`:

```tsx
// app/studio/[[...tool]]/page.tsx
'use client';
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';
export default () => <NextStudio config={config} />;
```

### Schema generation from emotional arc

Each beat type maps to a schema template:

| Beat | Schema fields |
|------|---------------|
| HOOK | headline (string, required), subhead (text), cta_label, cta_href, hero_image (image with hotspot), video_loop (file, optional) |
| TEASE | teaser (text), reveal_image (image) |
| REVEAL | narrative (portableText), supporting_media (array of image/video) |
| BUILD | steps (array of {title, description, icon}) |
| PEAK | showcase_title (string), showcase_items (array of rich objects) |
| BREATHE | quote (text), attribution (string) |
| TENSION | provocation (text), counterpoint (text) |
| PROOF | testimonials (array of reference→testimonial), logos (array of image) |
| PIVOT | transition_copy (text) |
| CLOSE | final_cta_label, final_cta_href, small_print (text) |

Schemas generated during `/gen:cms-init sanity` from `CONTENT.md` + `MASTER-PLAN.md`.

### GROQ query patterns

```ts
// lib/sanity/queries.ts
import { groq } from 'next-sanity';

export const homepageQuery = groq`
  *[_type == "homepage" && _id == "homepage-singleton"][0]{
    ...,
    sections[]{
      _type,
      _type == "heroSection" => {
        ...,
        "heroImage": heroImage.asset->{ url, metadata{ lqip, dimensions } }
      }
    }
  }
`;
```

### DNA-themed Studio

```ts
// sanity.config.ts
import { defineConfig } from 'sanity';
import { theme } from '@sanity/ui/theme';

export default defineConfig({
  // ...
  theme: theme({
    '--brand-primary': 'var(--color-primary)',
    '--brand-bg': 'var(--color-bg)',
    '--brand-surface': 'var(--color-surface)',
  }),
});
```

Studio picks up DNA tokens via CSS variable overrides in its root layout.

### Visual Editing wiring

```tsx
// app/layout.tsx
import { VisualEditing } from 'next-sanity';
import { draftMode } from 'next/headers';

export default function RootLayout({ children }) {
  const { isEnabled } = draftMode();
  return (
    <html>
      <body>{children}{isEnabled && <VisualEditing />}</body>
    </html>
  );
}
```

Combined with Presentation tool URL config, editors see overlays on live routes with inline edit affordances.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| schema_types_generated | 1 | ∞ | count | auto per beat in MASTER-PLAN |
| cache_ttl_content | 30 | 3600 | s | `revalidateTag` on webhook |
| webhook_secret_required | true | true | bool | HARD |
| image_cdn_transforms | AVIF, WebP, dim, q | — | params | via Sanity image URL builder |

## Layer 3: Integration Context

- **`/gen:cms-init sanity`** — scaffolds studio, generates schemas, writes env vars, wires Studio route.
- **Content-specialist agent** — if CMS configured, fetches via Sanity client instead of inline content.
- **`start-project`** — discovery asks "need CMS? sanity/payload/none"; routes to this skill if sanity.
- **Environment** — `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN` (read), `SANITY_WEBHOOK_SECRET`.
- **Revalidation** — Sanity webhook → Next API route → `revalidateTag('sanity')` → instant content updates.

## Layer 4: Anti-Patterns

- ❌ **Inlining the dataset ID** — use env var; Studio may target prod vs staging datasets.
- ❌ **Fetching without GROQ projections** — returns full documents, bloats payload. Project only what's rendered.
- ❌ **Skipping Visual Editing** — editors lose context; Presentation tool is Sanity's killer feature.
- ❌ **Using `fetch` directly instead of `next-sanity`** — loses CDN, caching, tag-based revalidation.
- ❌ **Letting editors hit production without draft preview** — always wire draftMode for safe editing.
- ❌ **Dataset naming = "production" for every env** — use `development`, `staging`, `production` to segregate.
