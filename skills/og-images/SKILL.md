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

## Layer 2: Award-Winning Examples

Code patterns for generating branded OG images from DNA tokens. Font loading is the #1 pain point -- it comes first.

### A. Font Loading Patterns

#### Pattern: Next.js Font Loading

The DNA display font must be available as TTF or OTF (not WOFF2). Use `readFile` from `node:fs/promises` with `process.cwd()` for reliable path resolution in all deployment environments. Never fetch fonts over HTTP at render time -- it adds latency and can fail.

```tsx
// Next.js -- local file read (RECOMMENDED)
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Inside opengraph-image.tsx or route handler:
const displayFont = await readFile(
  join(process.cwd(), 'assets/fonts/DisplayFont-Bold.ttf')
)

// Pass to ImageResponse options:
new ImageResponse(jsx, {
  width: 1200,
  height: 630,
  fonts: [{
    name: 'DisplayFont',
    data: displayFont,    // Buffer from readFile -- ImageResponse accepts this directly
    style: 'normal' as const,
    weight: 700,
  }],
})
```

#### Pattern: Astro Font Loading

Use `readFileSync` for Astro endpoints. Pass `fontData.buffer` (ArrayBuffer) to Satori -- not the Buffer directly. This pattern works reliably with the Node adapter; other adapters (Vercel, Cloudflare) may need `includeFiles` configuration to bundle the font file.

```typescript
// Astro -- synchronous file read
import { readFileSync } from 'node:fs'

const fontData = readFileSync('./public/fonts/DisplayFont-Bold.ttf')

// Pass to satori options -- note .buffer for ArrayBuffer:
const svg = await satori(markup, {
  width: 1200,
  height: 630,
  fonts: [{
    name: 'DisplayFont',
    data: fontData.buffer,   // ArrayBuffer, not Buffer
    style: 'normal',
    weight: 700,
  }],
})
```

#### Pattern: Font Configuration Object

Both frameworks share the same font config structure. Multiple weights/styles can be loaded by adding entries to the array.

```typescript
// Shared font config structure
const fonts = [
  {
    name: 'DisplayFont',           // Must match fontFamily in styles
    data: displayFontData,         // Buffer (Next.js) or ArrayBuffer (Astro/Satori)
    style: 'normal' as const,
    weight: 700,
  },
  // Optional: additional weight for body text
  {
    name: 'BodyFont',
    data: bodyFontData,
    style: 'normal' as const,
    weight: 400,
  },
]
```

### B. Next.js Patterns

#### Pattern: Next.js opengraph-image.tsx File Convention (Primary)

This is the RECOMMENDED approach for all Next.js projects. Place `opengraph-image.tsx` in any route folder and Next.js auto-discovers it, generates the image, and wires the `og:image` meta tag automatically. No manual meta tag configuration needed.

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Named exports configure the image metadata
export const alt = 'Blog post preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>    // Next.js 16: params is a Promise
}) {
  const { slug } = await params          // Must await in Next.js 16+
  const post = await getPost(slug)       // Your data fetching function

  // Load DNA display font (TTF/OTF only -- WOFF2 NOT supported)
  const displayFont = await readFile(
    join(process.cwd(), 'assets/fonts/DisplayFont-Bold.ttf')
  )

  const title = post.title.length > 70
    ? post.title.slice(0, 67) + '...'
    : post.title

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        backgroundColor: '#0a0a0f',       /* DNA:bg */
        color: '#f5f5f5',                 /* DNA:text */
        fontFamily: 'DisplayFont',
      }}>
        {/* DNA signature element -- always included */}
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',  /* DNA:primary -> accent gradient */
        }} />

        {/* Title */}
        <div style={{
          fontSize: '64px',
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: '900px',
          display: 'flex',
        }}>
          {title}
        </div>

        {/* Site name */}
        <div style={{
          fontSize: '24px',
          marginTop: '24px',
          opacity: 0.7,
          display: 'flex',
        }}>
          sitename.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{
        name: 'DisplayFont',
        data: displayFont,
        style: 'normal' as const,
        weight: 700,
      }],
    }
  )
}
```

#### Pattern: Next.js Root-Level Default OG

Place at `app/opengraph-image.tsx` for a site-wide default. This renders for any page that does not have its own `opengraph-image.tsx` in the route folder. Simpler layout -- just site name, tagline, and signature element.

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Site preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const displayFont = await readFile(
    join(process.cwd(), 'assets/fonts/DisplayFont-Bold.ttf')
  )

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',       /* DNA:bg */
        color: '#f5f5f5',                 /* DNA:text */
        fontFamily: 'DisplayFont',
      }}>
        {/* DNA signature element */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '6px',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',  /* DNA:primary -> accent */
        }} />

        {/* Site name */}
        <div style={{
          fontSize: '72px',
          fontWeight: 700,
          display: 'flex',
        }}>
          Site Name
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '28px',
          marginTop: '16px',
          opacity: 0.6,
          display: 'flex',
        }}>
          Your tagline goes here
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{
        name: 'DisplayFont',
        data: displayFont,
        style: 'normal' as const,
        weight: 700,
      }],
    }
  )
}
```

#### Pattern: Next.js API Route Alternative

Use `app/api/og/route.tsx` when OG images need to be generated from URL query params or external data. Prefer the file convention approach above -- use this only when the file convention does not fit the use case.

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Default Title'
  const template = searchParams.get('template') ?? 'landing'

  const displayFont = await readFile(
    join(process.cwd(), 'assets/fonts/DisplayFont-Bold.ttf')
  )

  const displayTitle = title.length > 70
    ? title.slice(0, 67) + '...'
    : title

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        backgroundColor: '#0a0a0f',       /* DNA:bg */
        color: '#f5f5f5',                 /* DNA:text */
        fontFamily: 'DisplayFont',
      }}>
        <div style={{
          fontSize: '64px',
          fontWeight: 700,
          lineHeight: 1.1,
          display: 'flex',
        }}>
          {displayTitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{
        name: 'DisplayFont',
        data: displayFont,
        style: 'normal' as const,
        weight: 700,
      }],
    }
  )
}
```

### C. Astro Patterns

#### Pattern: Astro SSG Endpoint with getStaticPaths

For Astro projects with static content (blogs, docs, marketing). Uses `getStaticPaths` to enumerate all content slugs at build time. The `satori-html` package converts HTML template literals to Satori VNode format since Astro endpoints have no JSX runtime.

```typescript
// src/pages/og/[slug].png.ts
import type { APIContext, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import satori from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog')
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, category: post.data.category },
  }))
}

export async function GET({ props }: APIContext) {
  const { title, category } = props
  const displayTitle = title.length > 70 ? title.slice(0, 67) + '...' : title

  // Load DNA display font (TTF/OTF only)
  const fontData = readFileSync('./public/fonts/DisplayFont-Bold.ttf')

  const markup = html`
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;
      justify-content: center; padding: 60px; background-color: #0a0a0f; color: #f5f5f5;
      font-family: DisplayFont;">

      <!-- DNA signature element -->
      <div style="position: absolute; top: 40px; right: 40px; width: 80px; height: 80px;
        border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6);"></div>

      <!-- Category label -->
      <div style="font-size: 18px; text-transform: uppercase; letter-spacing: 2px;
        opacity: 0.6; display: flex; margin-bottom: 16px;">
        ${category}
      </div>

      <!-- Title -->
      <div style="font-size: 64px; font-weight: 700; line-height: 1.1; max-width: 900px;
        display: flex;">
        ${displayTitle}
      </div>

      <!-- Site name -->
      <div style="font-size: 24px; margin-top: 24px; opacity: 0.7; display: flex;">
        sitename.com
      </div>
    </div>
  `

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [{
      name: 'DisplayFont',
      data: fontData.buffer,    // ArrayBuffer for Satori
      style: 'normal',
      weight: 700,
    }],
  })

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
```

#### Pattern: Astro SSR On-Demand Endpoint

For Astro in SSR or hybrid mode. Same Satori + sharp pipeline but generated per-request. No `getStaticPaths` needed. Add Cache-Control for CDN caching.

```typescript
// src/pages/og/[slug].png.ts (SSR mode -- no getStaticPaths)
import type { APIContext } from 'astro'
import satori from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

export async function GET({ params }: APIContext) {
  const { slug } = params
  const post = await getPostBySlug(slug!)     // Your data fetching function

  const displayTitle = post.title.length > 70
    ? post.title.slice(0, 67) + '...'
    : post.title

  const fontData = readFileSync('./public/fonts/DisplayFont-Bold.ttf')

  const markup = html`
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;
      justify-content: center; padding: 60px; background-color: #0a0a0f; color: #f5f5f5;
      font-family: DisplayFont;">
      <div style="position: absolute; top: 40px; right: 40px; width: 80px; height: 80px;
        border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6);"></div>
      <div style="font-size: 64px; font-weight: 700; line-height: 1.1; max-width: 900px;
        display: flex;">
        ${displayTitle}
      </div>
      <div style="font-size: 24px; margin-top: 24px; opacity: 0.7; display: flex;">
        sitename.com
      </div>
    </div>
  `

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [{
      name: 'DisplayFont',
      data: fontData.buffer,
      style: 'normal',
      weight: 700,
    }],
  })

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',     // 1 hour CDN cache for SSR
    },
  })
}
```

#### Pattern: Astro with @resvg/resvg-js (Alternative)

Alternative to sharp using Rust-based resvg. Closer to what `next/og` uses internally. Requires Vite configuration to prevent WASM bundling issues. Sharp is RECOMMENDED due to broader ecosystem support and no Vite config needed.

```typescript
// Alternative PNG conversion -- replace the sharp lines with:
import { Resvg } from '@resvg/resvg-js'

// ... same satori call produces svg string ...

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
})
const pngData = resvg.render()
const pngBuffer = pngData.asPng()

return new Response(pngBuffer, {
  headers: { 'Content-Type': 'image/png' },
})
```

**Required Vite config for resvg-js:**

```javascript
// astro.config.mjs -- prevent Vite from bundling the WASM module
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
    ssr: {
      external: ['@resvg/resvg-js'],
    },
  },
})
```

### D. Template Type Patterns

#### Pattern: Template Auto-Detection Utility

Convention-based template selection from route pathname. Explicit override via metadata field takes priority.

```typescript
// lib/og-template.ts -- shared utility for both frameworks
type OGTemplate = 'article' | 'product' | 'landing'

function getOGTemplate(pathname: string, override?: OGTemplate): OGTemplate {
  // Explicit override takes priority
  if (override) return override

  // Convention-based detection from route structure
  if (/^\/(blog|posts|articles)\//.test(pathname)) return 'article'
  if (/^\/(products|shop|store)\//.test(pathname)) return 'product'
  return 'landing'
}

// Next.js usage in generateMetadata:
//   ogTemplate: 'article' as metadata field
// Astro usage in frontmatter:
//   ogTemplate: 'article'
```

#### Pattern: Article Template

Optimized for blog posts and articles where the title is the hero. Large title with up to 2 lines, category/tag label at top, site name at bottom, signature element as brand mark.

```tsx
// Article OG template -- Next.js JSX format
// Agents adapt to satori-html template literals for Astro
<div style={{
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '60px',
  backgroundColor: '#0a0a0f',       /* DNA:bg */
  color: '#f5f5f5',                 /* DNA:text */
  fontFamily: 'DisplayFont',
}}>
  {/* DNA signature element */}
  <div style={{
    position: 'absolute',
    top: '40px',
    right: '40px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',  /* DNA:primary */
  }} />

  {/* Top: category label */}
  <div style={{
    fontSize: '18px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    opacity: 0.6,
    display: 'flex',
  }}>
    {category}
  </div>

  {/* Center: title (hero) */}
  <div style={{
    fontSize: '64px',
    fontWeight: 700,
    lineHeight: 1.1,
    maxWidth: '900px',
    display: 'flex',
  }}>
    {displayTitle}
  </div>

  {/* Bottom: site name */}
  <div style={{
    fontSize: '24px',
    opacity: 0.7,
    display: 'flex',
  }}>
    sitename.com
  </div>
</div>
```

**Archetype composition guidance for Article:**
- **Brutalist:** Raw centered type, high contrast (white on black), no gradient, thick accent bar instead of orb
- **Ethereal:** Soft gradient background (DNA bg to a lighter tint), generous padding, delicate signature element with low opacity
- **Editorial:** Asymmetric title placement (left-aligned, large), category label with a rule line above, strong typographic hierarchy

#### Pattern: Landing Page Template

Designed for home pages, feature pages, and marketing pages. Site name/logo is prominent, with a tagline or page title. Full-width signature element treatment for maximum brand impact.

```tsx
// Landing Page OG template -- Next.js JSX format
<div style={{
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0a0a0f',       /* DNA:bg */
  color: '#f5f5f5',                 /* DNA:text */
  fontFamily: 'DisplayFont',
}}>
  {/* Full-width DNA signature element -- bottom accent bar */}
  <div style={{
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '6px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',  /* DNA:primary */
  }} />

  {/* Site name (hero) */}
  <div style={{
    fontSize: '80px',
    fontWeight: 700,
    display: 'flex',
  }}>
    Site Name
  </div>

  {/* Tagline or page title */}
  <div style={{
    fontSize: '32px',
    marginTop: '20px',
    opacity: 0.6,
    maxWidth: '800px',
    textAlign: 'center',
    display: 'flex',
  }}>
    {tagline}
  </div>
</div>
```

**Archetype composition guidance for Landing:**
- **Brutalist:** Oversized site name (100px+), no tagline, single bold accent bar
- **Ethereal:** Centered with generous whitespace, soft gradient orb behind site name, tagline in light weight
- **Editorial:** Left-aligned site name with dramatic scale, tagline as a smaller secondary element, asymmetric accent line

#### Pattern: Product Template

Designed for e-commerce product pages and SaaS pricing pages. Product name as title, price or CTA text, brand mark with signature element. Emphasizes the product over the brand.

```tsx
// Product OG template -- Next.js JSX format
<div style={{
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '60px 80px',
  backgroundColor: '#0a0a0f',       /* DNA:bg */
  color: '#f5f5f5',                 /* DNA:text */
  fontFamily: 'DisplayFont',
}}>
  {/* DNA signature element + brand mark */}
  <div style={{
    position: 'absolute',
    top: '40px',
    left: '60px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',  /* DNA:primary */
    }} />
    <div style={{
      fontSize: '20px',
      opacity: 0.7,
      display: 'flex',
    }}>
      sitename.com
    </div>
  </div>

  {/* Product name */}
  <div style={{
    fontSize: '56px',
    fontWeight: 700,
    lineHeight: 1.15,
    maxWidth: '850px',
    marginTop: '40px',
    display: 'flex',
  }}>
    {productName}
  </div>

  {/* Price or CTA */}
  <div style={{
    fontSize: '28px',
    marginTop: '20px',
    color: '#6366f1',               /* DNA:primary */
    display: 'flex',
  }}>
    {priceOrCTA}
  </div>
</div>
```

**Archetype composition guidance for Product:**
- **Brutalist:** Stark product name in maximum size, price in raw monospace style, no decoration beyond accent bar
- **Ethereal:** Product name with generous letter-spacing, subtle gradient behind, price as whisper-weight text
- **Editorial:** Product name with dramatic typographic contrast (weight mixing), price aligned right, editorial grid feel

### E. Signature Element Patterns for OG Images

Signature elements must work within Satori's flexbox constraints. These patterns use only supported CSS properties (absolute positioning, border-radius, linear-gradient, transform).

#### Gradient Orb

Absolute positioned circle with gradient. Works as a floating brand mark in any corner.

```tsx
<div style={{
  position: 'absolute',
  top: '40px',
  right: '40px',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',  /* DNA:primary -> accent */
}} />
```

#### Diagonal Slash

A rotated thin bar. Creates a dynamic angular element.

```tsx
<div style={{
  position: 'absolute',
  bottom: '0',
  right: '80px',
  width: '4px',
  height: '200px',
  backgroundColor: '#6366f1',         /* DNA:primary */
  transform: 'rotate(-15deg)',
}} />
```

#### Accent Bar

Full-width gradient bar at the bottom edge. Maximum brand presence with minimal visual weight.

```tsx
<div style={{
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  height: '6px',
  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',  /* DNA:primary -> accent */
}} />
```

#### Corner Accent

A triangle or box anchored to a corner. Creates an architectural frame element.

```tsx
<div style={{
  position: 'absolute',
  top: '0',
  right: '0',
  width: '120px',
  height: '120px',
  backgroundColor: '#6366f1',         /* DNA:primary */
  opacity: 0.15,
  borderRadius: '0 0 0 120px',       // Quarter circle in top-right
}} />
```

#### Dotted Pattern

Repeated small circles in a grid arrangement. Creates texture without heavy visual weight. Uses a single row of dots for Satori compatibility (no CSS Grid).

```tsx
<div style={{
  position: 'absolute',
  bottom: '40px',
  right: '40px',
  display: 'flex',
  flexWrap: 'wrap',
  width: '100px',
  gap: '12px',
}}>
  {Array.from({ length: 9 }).map((_, i) => (
    <div key={i} style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#6366f1',     /* DNA:primary */
      opacity: 0.3,
    }} />
  ))}
</div>
```

### F. Satori CSS Support Reference

#### Fully Supported Properties

| Category | Properties |
|----------|-----------|
| **Layout** | `display` (flex, none), `position` (relative, absolute), `flexDirection`, `flexWrap`, `flexGrow`, `flexShrink`, `flexBasis`, `alignItems`, `alignContent`, `alignSelf`, `justifyContent`, `gap` |
| **Sizing** | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `padding` (all sides), `margin` (all sides) |
| **Text** | `color`, `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `textAlign`, `textTransform`, `textOverflow`, `textDecoration`, `textShadow`, `lineHeight`, `letterSpacing`, `whiteSpace`, `wordBreak`, `lineClamp` |
| **Background** | `backgroundColor`, `backgroundImage` (gradients + url), `backgroundClip` (including `text`) |
| **Border** | `border`, `borderWidth`, `borderStyle`, `borderColor`, `borderRadius` (all corners) |
| **Visual** | `opacity`, `boxShadow`, `transform` (2D only: translate, rotate, scale, skew), `transformOrigin`, `overflow` (visible, hidden), `clipPath`, `filter` |

#### NOT Supported Properties

| Feature | Workaround |
|---------|-----------|
| `display: grid` | Use flexbox exclusively |
| WOFF2 fonts | Convert to TTF or OTF before loading |
| CSS selectors / class names | Inline all styles via `style` prop |
| `z-index` | SVG uses paint order -- earlier elements render behind later ones |
| 3D transforms | Not possible in SVG output |
| `calc()` | Pre-calculate values in JavaScript |
| CSS variables / custom properties | Hard-code values directly |
| `<style>` / `<link>` / `<script>` tags | Not supported in Satori markup |
| React hooks (`useState`, `useEffect`) | Static render only -- no interactivity |
| `currentColor` | Specify explicit color values |
| OpenType features (kerning, ligatures) | Not supported by opentype.js parser |
| RTL languages | Not supported by Satori layout engine |

### G. Platform Requirements

#### Social Platform OG Image Specifications

All major platforms converge on the same standard. Generate one image at 1200x630 and it works everywhere.

| Platform | Recommended Size | Aspect Ratio | Max File Size | Format |
|----------|-----------------|-------------|---------------|--------|
| Facebook | 1200 x 630 | 1.91:1 | 8 MB | PNG, JPEG |
| Twitter/X | 1200 x 630 (summary_large_image) | 1.91:1 | 5 MB | PNG, JPEG |
| LinkedIn | 1200 x 627 | 1.91:1 | 5 MB | PNG, JPEG |
| WhatsApp | 1200 x 630 | 1.91:1 | -- | PNG, JPEG |
| Slack | 1200 x 630 | 1.91:1 | -- | PNG, JPEG |
| Discord | 1200 x 630 | 1.91:1 | -- | PNG, JPEG |

**Universal standard:** 1200 x 630 pixels, PNG format, under 500KB for fast loading across all platforms. This is what every OG template generates.

<!-- Layers 3-4 and Machine-Readable Constraints added by Plan 02 -->
