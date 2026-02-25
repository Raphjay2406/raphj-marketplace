---
name: "og-images"
description: "Dynamic OG image generation from Design DNA tokens: branded 1200x630 social previews using next/og ImageResponse (Next.js) and Satori + sharp (Astro), 3 archetype-influenced template types, convention-based auto-detection."
tier: "domain"
triggers: "OG image, social preview, Open Graph image, opengraph-image, social card, Twitter card image, og:image, social sharing, branded preview, Satori, ImageResponse"
version: "1.0.0"
---

## Layer 1: Decision Guidance

You are an OG image specialist who generates branded social preview images from Design DNA tokens. Every Modulo project gets unique social cards that reinforce the project's visual identity -- not generic placeholder images. When a page is shared on Twitter/X, Facebook, LinkedIn, Slack, Discord, or WhatsApp, the preview image is a 1200x630 PNG rendered from DNA colors, the display font, and the project's signature element.

### When to Use

- **Public-facing site with social sharing** -- Any site where pages will be shared on social media (Twitter/X, Facebook, LinkedIn, Slack, Discord, WhatsApp). Branded previews increase click-through rates
- **Conversion-critical pages** -- Landing pages, blog posts, product pages, portfolio pieces where the social preview is a first impression
- **Design DNA already generated** -- This skill requires `DESIGN-DNA.md` as input. The DNA provides colors, display font, and signature element that drive every OG template
- **Wave 0 scaffold AND per-section builds** -- Triggered during Wave 0 (OG route setup with root-level default) AND during Wave 2+ section builds (page-specific dynamic OG images)

### When NOT to Use

- **Meta tag configuration** (og:title, og:description, twitter:card) -- Use `seo-meta` skill instead. That skill handles meta tag wiring. For Next.js projects using the `opengraph-image.tsx` file convention, Next.js auto-generates the `og:image` meta tag, so no manual meta wiring is needed for the image itself
- **Desktop applications** -- Tauri/Electron apps have no social sharing context. Skip entirely
- **Private dashboards behind auth** -- Internal tools and admin panels are not shared socially
- **Static sites with fewer than 5 pages** -- A single hand-designed OG image is simpler and often better for tiny sites
- **React/Vite SPAs** -- No server-side image generation capability. Use a static OG image or an external service (Cloudinary, Vercel OG proxy)

### DNA Token Mapping

OG images consume a focused subset of Design DNA tokens:

| DNA Token | OG Image Usage |
|-----------|---------------|
| `bg` | Canvas background color (the 1200x630 base) |
| `primary` | Signature element color, accent gradients |
| `text` | Title text color |
| `accent` / `glow` | Sparingly for gradient effects on specific archetype layouts (Ethereal glow, Neon Noir neon) |
| Display font | Title rendered in the project's DNA display font at fixed size (64px). Must be TTF/OTF/WOFF -- WOFF2 is NOT supported by Satori |
| Body/system font | Site name and small metadata text (24px) |
| Signature element | Always included on every OG image. The DNA signature element (gradient orb, diagonal slash, accent bar, corner accent, etc.) appears as a visual brand mark |

**Title rendering rules:**
- Fixed size (64px for primary title) -- no auto-scaling
- Truncate after a character limit per template type (Claude determines the limit based on layout)
- Display font loaded from local file system -- never fetched over HTTP at render time

### Template Types and Auto-Detection

Three template types cover all common page categories. Selection is convention-based with explicit override support.

**Template types:**

| Template | Route Convention | Layout Focus |
|----------|-----------------|-------------|
| `article` | `/blog/*`, `/posts/*`, `/articles/*` | Large title (up to 2 lines), category label at top, site name at bottom, signature element |
| `product` | `/products/*`, `/shop/*`, `/store/*` | Product name as title, price or CTA text, brand mark + signature element |
| `landing` | Everything else (default) | Site name/logo prominent, tagline or page title, full-width signature element treatment |

**Auto-detection logic:**

```
pathname starts with /blog/, /posts/, /articles/  ->  article
pathname starts with /products/, /shop/, /store/   ->  product
everything else                                    ->  landing (default)
```

**Explicit override:** Set `ogTemplate: 'article' | 'product' | 'landing'` in `generateMetadata` (Next.js) or frontmatter (Astro) to bypass convention detection.

**Archetype influence:** Template type controls LAYOUT COMPOSITION, not just color swap. A Brutalist article OG should look fundamentally different from an Ethereal article OG. The archetype drives typography treatment, element placement, whitespace, and signature element style. Claude decides the specific per-archetype layout compositions.

### Framework Decision Tree

| Framework | Approach | Dependencies | Notes |
|-----------|----------|-------------|-------|
| **Next.js** | `opengraph-image.tsx` file convention (ALWAYS prefer) | None -- `next/og` is built-in | Auto-wires `og:image` meta tag. Uses `ImageResponse` from `next/og`. Zero extra deps |
| **Astro SSG** | `.png.ts` endpoint with `getStaticPaths` | `satori` + `satori-html` + `sharp` | Generated at build time. Use `getStaticPaths` to enumerate all content slugs |
| **Astro SSR** | `.png.ts` endpoint without `getStaticPaths` | `satori` + `satori-html` + `sharp` | Generated on-demand. Add `Cache-Control: public, max-age=3600` for CDN caching |
| **React/Vite SPA** | Not applicable | -- | No server-side image generation. Use a static OG image or external service |

**Installation:**
- **Next.js:** Nothing to install. `next/og` is built into Next.js 14+
- **Astro:** `npm install satori satori-html sharp`
- **Astro (resvg alternative):** `npm install satori satori-html @resvg/resvg-js` (requires Vite config -- see Layer 2)

### Satori Constraints Summary

Quick reference for agents generating OG image markup:

| Constraint | Detail |
|-----------|--------|
| **Layout** | Flexbox ONLY. No CSS Grid. Every container needs explicit `display: 'flex'` |
| **Fonts** | TTF, OTF, WOFF only. NO WOFF2. Convert project fonts to TTF before loading |
| **Styles** | ALL inline via `style` prop. No CSS selectors, no `<style>` tags, no class names |
| **No React hooks** | `useState`, `useEffect` etc. not supported. Static render only |
| **No z-index** | Use document order (SVG paint order) to control layering |
| **No calc()** | Pre-calculate all values |
| **No CSS variables** | Hard-code all values |
| **Image size** | 1200 x 630px, PNG format, target < 500KB |
| **Full CSS reference** | See Layer 2 for complete supported/unsupported property tables |

### Pipeline Connection

- **Referenced by:** `build-orchestrator` at Wave 0 (OG route scaffold), `section-planner` (OG template type assignment in PLAN.md)
- **Consumed at:** `/modulo:execute` Wave 0 (scaffold OG route files and root-level default), Wave 2+ (per-section page-specific OG images when needed)
- **Input from:** `DESIGN-DNA.md` (colors, display font, signature element), `seo-meta` skill (meta tag wiring for non-file-convention approaches)
- **Output to:** `opengraph-image.tsx` files (Next.js) or `og/[slug].png.ts` endpoints (Astro)
