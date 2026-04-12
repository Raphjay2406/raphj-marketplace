---
name: "og-images"
description: "Dynamic OG image generation from Design DNA tokens: branded 1200x630 social previews using next/og ImageResponse (Next.js) and Satori + sharp (Astro), 3 archetype-influenced template types, convention-based auto-detection."
tier: "domain"
triggers: "OG image, social preview, Open Graph image, opengraph-image, social card, Twitter card image, og:image, social sharing, branded preview, Satori, ImageResponse"
version: "1.0.0"
metadata:
  pathPatterns:
    - "**/opengraph-image.tsx"
    - "**/og/**/*"
---

## Layer 1: Decision Guidance

You are an OG image specialist who generates branded social preview images from Design DNA tokens. Every Genorah project gets unique social cards that reinforce the project's visual identity -- not generic placeholder images. When a page is shared on Twitter/X, Facebook, LinkedIn, Slack, Discord, or WhatsApp, the preview image is a 1200x630 PNG rendered from DNA colors, the display font, and the project's signature element.

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

- **Referenced by:** `orchestrator` at Wave 0 (OG route scaffold), `planner` (OG template type assignment in PLAN.md)
- **Consumed at:** `/gen:execute` Wave 0 (scaffold OG route files and root-level default), Wave 2+ (per-section page-specific OG images when needed)
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

## Layer 3: Integration Context

How the OG image skill connects to the broader Genorah system -- DNA tokens, design archetypes, pipeline stages, and related skills.

### DNA Connection

OG images are a direct expression of Design DNA. Every token maps to a specific element on the 1200x630 canvas:

| DNA Token | OG Image Element | Usage |
|-----------|-----------------|-------|
| `--color-bg` | Canvas background | Main background color of the 1200x630 image |
| `--color-primary` | Signature element, accent gradients | Brand mark color, gradient start point |
| `--color-text` | Title text, site name | All text rendered on the OG image |
| `--color-accent` | Gradient end, glow effects | Secondary gradient color (Ethereal, Neon Noir) |
| `--color-glow` | Glow effects | Neon Noir neon glow, AI-Native luminance (sparingly) |
| `--color-surface` | Secondary background areas | Optional card or overlay backgrounds within the image |
| Display font | Title text (64px) | Loaded as TTF/OTF into Satori -- the project's actual DNA display font |
| Body font | Site name, metadata text (24px) | Small secondary text elements |
| Signature element | Brand mark | Always present on every OG image -- orb, slash, bar, corner, or dots |

The OG image is a miniature expression of the project's visual identity. If the DNA says "diagonal slash in primary color," the OG image gets a diagonal slash in primary color. No exceptions.

### Archetype-to-OG Composition Mapping

The 19 design archetypes group into 5 OG composition families. These are starting points -- Claude decides the specific per-archetype layout composition based on the project's DNA and context.

| Composition Family | Archetypes | OG Characteristics |
|-------------------|------------|-------------------|
| **Bold/Maximalist** | Brutalist, Neubrutalism, Kinetic | Raw centered type, high contrast, minimal decoration, large title dominating the canvas, thick accent bars, monochromatic or near-monochromatic palette |
| **Elegant/Minimal** | Ethereal, Japanese Minimal, Swiss/International, Luxury/Fashion | Generous whitespace (40%+ padding), subtle signature element at low opacity, refined typography with careful letter-spacing, soft gradients or solid backgrounds |
| **Expressive/Dynamic** | Neon Noir, Vaporwave, AI-Native, Glassmorphism | Gradient backgrounds (multi-stop), glow effects via box-shadow, bold color usage with accent/glow tokens, signature element as luminous focal point |
| **Editorial/Structured** | Editorial, Dark Academia, Neo-Corporate, Data-Dense | Asymmetric layout (left-aligned title), strong typographic hierarchy with weight contrast, structured grid feel via flexbox, rule lines or accent borders as framing devices |
| **Warm/Organic** | Warm Artisan, Organic, Playful/Startup, Retro-Future | Warm color palette from DNA tokens, rounded signature elements (orbs, soft corners), approachable typography sizing, textured feel achieved through layered color blocks |

**Important:** These families guide the composition APPROACH, not exact layouts. A Brutalist article template and a Brutalist landing template will differ in layout but share the Bold/Maximalist characteristics (raw type, high contrast, minimal decoration). Claude adapts the specific element placement, sizing, and signature element treatment per project.

### Pipeline Position

OG image generation activates at two stages in the Genorah build pipeline:

**Wave 0 (Scaffold):**
- Build-orchestrator creates OG route files alongside design tokens and globals.css
- Next.js: `app/opengraph-image.tsx` (root-level default using landing template)
- Astro: `src/pages/og/index.png.ts` (root-level default)
- Font file copied/converted to TTF if needed during scaffold
- Template loads DNA token values from the project's design system

**Wave 2+ (Per-Section):**
- Section-planner determines whether a section creates new routes that need OG images
- Blog/article sections get `opengraph-image.tsx` (Next.js) or `og/[slug].png.ts` (Astro) with the article template
- E-commerce sections get product template OG generation
- Single-page sections (hero, features, testimonials) rely on the root-level default -- no per-section OG needed

**Quality Review:**
- Quality-reviewer checks `og:image` meta tag presence via the seo-meta checklist
- Verifies OG image route exists and returns a valid PNG response
- Checks that DNA signature element is visible in the generated image
- Advisory only -- does not block the anti-slop gate

### Related Skills

| Skill | Relationship |
|-------|-------------|
| `seo-meta` | Handles meta tag wiring (`og:title`, `og:description`, `twitter:card`). For Next.js file convention, Next.js auto-generates the `og:image` tag, but seo-meta handles everything else. For Astro, seo-meta provides the `<meta property="og:image">` tag pointing to the `/og/[slug].png` endpoint |
| `design-dna` | Provides all token values consumed by OG templates -- colors, display font, signature element type. The OG image is a direct visual derivative of the DNA |
| `design-archetypes` | Provides the archetype personality that influences OG composition family selection. The active archetype determines whether the OG style is Bold/Maximalist, Elegant/Minimal, etc. |
| `design-system-scaffold` | Wave 0 scaffold includes OG route setup (updated by Plan 03 of this phase). The scaffold creates the initial OG route files with DNA token integration |
| `structured-data` | If the page has JSON-LD schema with an `image` property (Article, Product, etc.), the `og:image` URL should be consistent with the schema image. Both point to the same generated PNG |

## Layer 4: Anti-Patterns

Named mistakes that agents must avoid when generating OG images. Each includes the wrong approach, the correct approach, and how to detect the problem.

### 1. "The WOFF2 Surprise"

**Problem:** Loading a WOFF2 font file into Satori. Satori's opentype.js parser cannot decode WOFF2 (it requires uncompressed TTF/OTF or WOFF). The result: silent fallback to a system font or a `Failed to decode font` error. The OG image renders with Times New Roman instead of the project's DNA display font.

**Wrong:**
```typescript
// WOFF2 will silently fail or crash Satori
const font = await readFile(
  join(process.cwd(), 'assets/fonts/DisplayFont-Bold.woff2')
)
```

**Right:**
```typescript
// Convert to TTF before using in OG templates
// During project setup: npx woff2-to-ttf DisplayFont-Bold.woff2
const font = await readFile(
  join(process.cwd(), 'assets/fonts/DisplayFont-Bold.ttf')
)
```

**Detection:** Title text renders in a serif system font (Times New Roman) instead of the project's display font. Console may show `Failed to decode font` or `Invalid font data` errors.

### 2. "The Invisible Flexbox"

**Problem:** Forgetting `display: 'flex'` on container divs. Satori's Yoga layout engine requires explicit flex declarations on every container -- it does not default to block layout like CSS in browsers. Elements appear overlapping, collapsed, or stacked in unexpected ways.

**Wrong:**
```tsx
<div style={{ padding: '60px', backgroundColor: '#0a0a0f' }}>
  {/* Children will overlap or collapse -- no layout mode declared */}
  <div style={{ fontSize: '64px' }}>{title}</div>
  <div style={{ fontSize: '24px' }}>sitename.com</div>
</div>
```

**Right:**
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  padding: '60px',
  backgroundColor: '#0a0a0f',
}}>
  <div style={{ fontSize: '64px', display: 'flex' }}>{title}</div>
  <div style={{ fontSize: '24px', display: 'flex' }}>sitename.com</div>
</div>
```

**Detection:** Elements don't respect alignment or direction properties. Title and site name render on top of each other. Layout appears broken despite correct-looking styles.

### 3. "The Grid Trap"

**Problem:** Using CSS Grid in Satori templates. Satori only supports flexbox via its Yoga layout engine. `display: 'grid'` silently fails with no error -- the layout simply collapses. Multi-column layouts break without any warning.

**Wrong:**
```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
}}>
  <div>{leftContent}</div>
  <div>{rightContent}</div>
</div>
```

**Right:**
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
}}>
  <div style={{ flex: 1, display: 'flex' }}>{leftContent}</div>
  <div style={{ flex: 1, display: 'flex' }}>{rightContent}</div>
</div>
```

**Detection:** Multi-column layouts collapse to a single column. Elements stack vertically when they should be side-by-side. No error in console -- the failure is silent.

### 4. "The Metadata Merge Trap"

**Problem (Next.js specific):** Defining `openGraph` in a page's `generateMetadata` causes shallow replacement of the parent's entire openGraph object, losing the `images` field set by the parent layout. This is especially dangerous when mixing `opengraph-image.tsx` file convention with manual `generateMetadata`. The file convention sets the image at the layout level, but a child page's `generateMetadata` with `openGraph: { title: '...' }` replaces the entire object.

**Wrong:**
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    openGraph: {
      title: post.title,  // Shallow replaces entire parent openGraph
      // Parent's openGraph.images is LOST
    },
  }
}
```

**Right:**
```tsx
// Option A (PREFERRED): Use opengraph-image.tsx file convention per-route
// Each route generates its own image -- no inheritance needed
// app/blog/[slug]/opengraph-image.tsx handles the image

// Option B: If using generateMetadata, spread parent openGraph
export async function generateMetadata({ params }, parent): Promise<Metadata> {
  const parentMetadata = await parent
  return {
    openGraph: {
      ...parentMetadata.openGraph,  // Preserve parent's images
      title: post.title,
    },
  }
}
```

**Detection:** Social preview shows the site default image (or no image) on specific pages. Debug by checking the rendered HTML for `og:image` meta tag -- it will be missing on affected pages.

### 5. "The Bloated Canvas"

**Problem:** OG images with complex gradients, embedded photographs (base64), or uncompressed output exceeding 5MB. Social platforms reject, timeout, or show fallback images for oversized files. Even images that technically load may cause slow social card rendering.

**Wrong:**
```tsx
// Embedding a full photograph as base64 in the template
<div style={{ display: 'flex', width: '100%', height: '100%' }}>
  <img
    src={`data:image/jpeg;base64,${hugeBase64String}`}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
  <div style={{ position: 'absolute', display: 'flex' }}>{title}</div>
</div>
```

**Right:**
```tsx
// Keep OG images simple: text + solid/gradient background + small signature element
// Sharp's png() compresses well by default -- target < 500KB
<div style={{
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: '#0a0a0f',    /* DNA:bg -- solid or gradient, no photos */
  padding: '60px',
}}>
  <div style={{ fontSize: '64px', fontWeight: 700, display: 'flex' }}>
    {title}
  </div>
</div>
```

**Detection:** Slow social card loading. Platforms showing fallback image instead of the generated OG. PNG file size exceeds 500KB (check with `sharp(svg).png().toBuffer()` then `buffer.length`).

### 6. "The Generic Preview"

**Problem:** Using the same layout and colors for every project regardless of archetype. OG images should reinforce the project's unique visual identity -- not look like output from a generic social card generator. Every Genorah project has a distinct DNA and archetype; the OG image must reflect both.

**Wrong:**
```tsx
// One fixed template for all projects -- always centered, always blue gradient
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',  // Hardcoded colors
  width: '100%',
  height: '100%',
}}>
  <div style={{ fontSize: '48px', color: 'white', display: 'flex' }}>
    {title}
  </div>
</div>
```

**Right:**
```tsx
// Archetype-influenced composition with DNA tokens
// Brutalist example: raw type, high contrast, thick accent bar
<div style={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '60px',
  backgroundColor: dna.bg,       // Project-specific DNA token
  color: dna.text,               // Project-specific DNA token
  fontFamily: 'DisplayFont',     // Project's actual display font
  width: '100%',
  height: '100%',
}}>
  {/* DNA signature element -- type matches project DNA */}
  <div style={{
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '8px',
    backgroundColor: dna.primary,  // Project-specific accent
  }} />
  <div style={{ fontSize: '64px', fontWeight: 700, display: 'flex' }}>
    {title}
  </div>
</div>
```

**Detection:** Social cards from different Genorah projects look identical. Compare OG images across 2-3 projects -- they should have distinct color palettes, signature elements, and composition approaches matching their archetypes.

---

## Machine-Readable Constraints

Enforceable parameters for OG image generation. HARD constraints cause incorrect output if violated (broken image, wrong size, crash). SOFT constraints degrade quality but the image still generates.

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Image width | 1200 | 1200 | px | HARD |
| Image height | 630 | 630 | px | HARD |
| Image file size | -- | 500 | KB | SOFT |
| Image format | PNG | PNG | -- | HARD |
| Font format | TTF | OTF | -- | HARD (no WOFF2) |
| Title font size | 48 | 72 | px | SOFT |
| Title character limit | -- | 80 | chars | SOFT |
| Signature element | required | required | -- | HARD |
| Display flex on containers | required | required | -- | HARD |
| CSS Grid usage | forbidden | forbidden | -- | HARD |

**Enforcement definitions:**
- **HARD** -- Violation causes incorrect output. Image may not render, render at wrong dimensions, crash Satori, or produce a broken PNG. Must be enforced without exception.
- **SOFT** -- Violation degrades quality but image still generates. Oversized files load slowly, truncated titles lose meaning, suboptimal font sizes reduce readability. Should be enforced but may be relaxed with documented rationale.
