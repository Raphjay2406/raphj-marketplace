# Phase 18: Dynamic OG Images & Pipeline Wiring - Research

**Researched:** 2026-02-25
**Domain:** OG image generation (Satori, next/og, resvg) + Agent pipeline wiring (markdown updates)
**Confidence:** HIGH

## Summary

This phase has two distinct halves. The first is a new `skills/og-images/SKILL.md` that teaches Genorah agents how to generate branded social preview images from Design DNA tokens using `next/og` ImageResponse (Next.js) and Satori + sharp/resvg (Astro). The second is pipeline wiring -- updating existing agent `.md` files so v1.5 skills (seo-meta, structured-data, search-visibility, and the upcoming og-images) are referenced at the correct pipeline stages.

The OG image generation stack is well-established and stable. Next.js provides `ImageResponse` from `next/og` which wraps Satori + resvg internally. Astro requires manual wiring of Satori + a PNG converter (sharp or @resvg/resvg-js) in an API endpoint. The critical constraint is that Satori uses **flexbox-only layout** (Yoga WASM engine) and supports only **TTF, OTF, and WOFF fonts** (no WOFF2). All styles must be inline -- no CSS selectors, no `<style>` tags, no hooks.

The pipeline wiring half is purely internal -- updating markdown agent definitions to reference v1.5 SEO skills. Currently, no pipeline agent references `structured-data`, `search-visibility`, or any SEO skill beyond `seo-meta`'s self-declared pipeline connections. The section-planner, quality-reviewer, build-orchestrator, researcher, and content-specialist agents all need targeted additions.

**Primary recommendation:** Build the OG images skill with complete, copy-paste Satori/ImageResponse patterns including font loading (the #1 pain point), then wire all v1.5 skills into agents as additive-only changes to existing markdown files.

## Standard Stack

The established libraries/tools for dynamic OG image generation:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/og` (ImageResponse) | Built into Next.js 14+ | OG image generation in Next.js | Official Next.js API, wraps Satori + resvg internally, zero additional deps |
| `satori` | 0.12+ | HTML/CSS to SVG conversion | Vercel-maintained, used internally by `next/og`, only option for JSX-to-SVG |
| `satori-html` | 0.3+ | HTML string to Satori VNode | Required for Astro (no JSX runtime), converts template literal HTML to Satori-compatible format |

### Supporting (Astro only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sharp` | 0.33+ | SVG-to-PNG conversion | Astro projects -- mature, fast for single-image conversion, widely available |
| `@resvg/resvg-js` | 2.6+ | SVG-to-PNG conversion (Rust-based) | Alternative to sharp -- closer to what `next/og` uses internally, zero native deps via WASM |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `sharp` | `@resvg/resvg-js` | resvg-js is what Vercel uses internally in `next/og`; sharp is more commonly available and battle-tested. Both work. Recommend sharp for Astro because it has broader ecosystem support and avoids Vite bundling issues with resvg-js WASM. |
| `satori-html` | Direct JSX in Astro | Astro endpoints don't have a JSX runtime by default. `satori-html` is the standard bridge. |

**Installation (Next.js):**
```bash
# Nothing to install -- next/og is built into Next.js 14+
# Font files: place .ttf or .otf in project (e.g., assets/ or public/fonts/)
```

**Installation (Astro):**
```bash
npm install satori satori-html sharp
# Or with resvg: npm install satori satori-html @resvg/resvg-js
```

## Architecture Patterns

### Recommended Project Structure

```
# Next.js OG Image Generation
app/
  opengraph-image.tsx          # Root-level default OG image (file convention)
  blog/
    [slug]/
      opengraph-image.tsx      # Per-post dynamic OG image (file convention)
  api/
    og/
      route.tsx                # Alternative: API route approach for query params
assets/
  fonts/
    DisplayFont-Bold.ttf       # DNA display font for Satori (MUST be TTF/OTF/WOFF)

# Astro OG Image Generation
src/
  pages/
    og/
      [slug].png.ts            # Dynamic endpoint per content item
  lib/
    og-template.ts             # Shared Satori markup generator
public/
  fonts/
    DisplayFont-Bold.ttf       # DNA display font (TTF/OTF/WOFF only)
```

### Pattern 1: Next.js File Convention (Recommended)

**What:** Place `opengraph-image.tsx` in any route folder. Next.js auto-discovers it and sets the `og:image` meta tag.
**When to use:** Always prefer this for Next.js projects. It integrates with the metadata system automatically.

```tsx
// app/blog/[slug]/opengraph-image.tsx
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Blog post preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  // Load DNA display font (TTF/OTF only -- WOFF2 NOT supported by Satori)
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
        justifyContent: 'center',
        padding: '60px',
        backgroundColor: '#0a0a0f',  // DNA bg token
        color: '#f5f5f5',            // DNA text token
        fontFamily: 'DisplayFont',
      }}>
        {/* Signature element */}
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',  // DNA primary
        }} />
        {/* Title */}
        <div style={{
          fontSize: '64px',
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: '900px',
        }}>
          {post.title.length > 70 ? post.title.slice(0, 67) + '...' : post.title}
        </div>
        {/* Site name */}
        <div style={{
          fontSize: '24px',
          marginTop: '24px',
          opacity: 0.7,
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
        style: 'normal',
        weight: 700,
      }],
    }
  )
}
```

### Pattern 2: Astro Endpoint with getStaticPaths

**What:** Create `.png.ts` endpoint that generates OG images at build time (SSG).
**When to use:** Astro projects with static content (blogs, docs, marketing pages).

```typescript
// src/pages/og/[slug].png.ts
// Source: Verified from multiple community patterns + Satori docs
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import satori from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title },
  }))
}

export async function GET({ props }: APIContext) {
  const { title } = props
  const displayTitle = title.length > 70 ? title.slice(0, 67) + '...' : title

  // Load font (TTF/OTF only)
  const fontData = readFileSync('./public/fonts/DisplayFont-Bold.ttf')

  const markup = html`
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;
      justify-content: center; padding: 60px; background-color: #0a0a0f; color: #f5f5f5;
      font-family: DisplayFont;">
      <div style="font-size: 64px; font-weight: 700; line-height: 1.1; max-width: 900px;">
        ${displayTitle}
      </div>
      <div style="font-size: 24px; margin-top: 24px; opacity: 0.7;">
        sitename.com
      </div>
    </div>
  `

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [{
      name: 'DisplayFont',
      data: fontData,
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

### Pattern 3: Astro with @resvg/resvg-js (Alternative)

```typescript
// Alternative PNG conversion using resvg-js instead of sharp
import { Resvg } from '@resvg/resvg-js'

// ... (same satori call as above) ...

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
})
const pngData = resvg.render()
const pngBuffer = pngData.asPng()

return new Response(pngBuffer, {
  headers: { 'Content-Type': 'image/png' },
})
```

**Vite config required for resvg-js:**
```javascript
// astro.config.mjs -- needed to prevent Vite from bundling the WASM module
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

### Anti-Patterns to Avoid

- **Using WOFF2 fonts:** Satori does NOT support WOFF2. The underlying opentype.js library cannot parse WOFF2. Always convert to TTF or OTF before loading.
- **Using CSS Grid:** Satori only supports flexbox (via Yoga engine). `display: grid` silently fails.
- **Using CSS selectors or `<style>` tags:** All styles must be inline via the `style` prop. No class names, no stylesheets.
- **Using React hooks:** `useState`, `useEffect`, etc. are not supported. The JSX is rendered once to produce a static image.
- **Runtime font fetching in Next.js:** Use `readFile` from `node:fs/promises` with `process.cwd()` for reliable font loading. HTTP fetching adds latency and can fail.
- **Forgetting `display: flex`:** Every container div needs explicit `display: 'flex'` -- Satori defaults to `display: block` but layout breaks without flex.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image generation in Next.js | Custom Satori + resvg setup | `next/og` ImageResponse | Already bundled, handles resvg internally, integrates with metadata system |
| HTML-to-Satori conversion in Astro | Custom VNode builder | `satori-html` package | Converts HTML template literals to Satori VNode format correctly |
| Font format conversion | Manual binary parsing | Online converters (fontconverter.io, transfonter.org) | Convert WOFF2 to TTF before including in project |
| OG meta tag wiring in Next.js | Manual `<meta>` tags | `opengraph-image.tsx` file convention | Next.js auto-generates the `og:image` meta tag from the file |
| Text truncation logic | Complex character counting | Simple `string.slice(0, N) + '...'` | OG images use fixed-size text -- truncate at character limit, no need for word-boundary logic |

**Key insight:** Next.js has made OG image generation a first-class feature. The file convention approach (`opengraph-image.tsx`) eliminates the need to manually wire meta tags -- Next.js discovers the file and generates the `<meta property="og:image">` tag automatically.

## Common Pitfalls

### Pitfall 1: WOFF2 Font Loading Failure
**What goes wrong:** Developer loads a `.woff2` font file into Satori. Satori silently falls back to a system font or throws a parsing error. The OG image renders with Times New Roman or a blank space where text should be.
**Why it happens:** Satori uses opentype.js for font parsing, which does not support WOFF2 compression. Only TTF, OTF, and WOFF are supported.
**How to avoid:** Always convert project fonts to TTF format before loading into Satori. Include explicit instructions in the skill to download TTF versions or convert WOFF2.
**Warning signs:** Text rendering looks different from expected, or font loading throws "Failed to decode font" errors.

### Pitfall 2: Missing `display: 'flex'` on Containers
**What goes wrong:** Layout appears broken -- elements stack incorrectly or overlap. The OG image looks nothing like the intended design.
**Why it happens:** Satori's Yoga engine requires explicit `display: 'flex'` on every container. Unlike browsers which default to block layout, Satori needs explicit flex declarations for predictable layout.
**How to avoid:** Add `display: 'flex'` to every wrapper `<div>` in Satori templates. Make this a code pattern in the skill.
**Warning signs:** Elements don't respect `flexDirection`, `justifyContent`, or `alignItems`.

### Pitfall 3: Next.js Metadata Shallow Merge Losing OG Images
**What goes wrong:** A page defines `openGraph` in `generateMetadata` but only sets `title` and `description`. The `images` field from the parent layout disappears because Next.js does shallow replacement, not deep merge.
**Why it happens:** Next.js metadata merging replaces entire nested objects. Setting `openGraph: { title: '...' }` in a child page replaces the ENTIRE `openGraph` object from the parent, including `images`.
**How to avoid:** The seo-meta skill already covers this with a `sharedOGImage` pattern. When dynamic OG images are used (via `opengraph-image.tsx`), this problem goes away because the image is generated per-route, not inherited.
**Warning signs:** Social preview shows site default image instead of page-specific image, or shows no image at all.

### Pitfall 4: Astro resvg-js Vite Bundling Crash
**What goes wrong:** Build fails with cryptic WASM-related errors when using `@resvg/resvg-js` in Astro.
**Why it happens:** Vite tries to bundle the resvg-js WASM module, which is incompatible with Vite's module system.
**How to avoid:** Mark `@resvg/resvg-js` as external in both `vite.optimizeDeps.exclude` and `vite.ssr.external` in `astro.config.mjs`. Or use `sharp` instead, which doesn't have this issue.
**Warning signs:** Build errors mentioning WASM, "Cannot find module", or "Failed to resolve import".

### Pitfall 5: OG Image File Size Exceeding Platform Limits
**What goes wrong:** Generated PNG is too large (>5MB) and social platforms either reject it or load slowly.
**Why it happens:** Complex gradients, embedded images, or uncompressed PNG output.
**How to avoid:** Keep OG images simple (text + solid/gradient background + small signature element). Sharp's `png()` method compresses well by default. Target <500KB.
**Warning signs:** Slow social card loading, platforms showing fallback image instead.

## Code Examples

### Font Loading Pattern (The #1 Pain Point)

```tsx
// Next.js -- readFile approach (RECOMMENDED)
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// In your opengraph-image.tsx or route handler:
const fontData = await readFile(
  join(process.cwd(), 'assets/fonts/DisplayFont-Bold.ttf')
)

// Pass to ImageResponse options:
{
  fonts: [{
    name: 'DisplayFont',
    data: fontData,       // Buffer from readFile
    style: 'normal',
    weight: 700,
  }]
}
```

```typescript
// Astro -- readFileSync approach
// Source: Satori README + community patterns
import { readFileSync } from 'node:fs'

const fontData = readFileSync('./public/fonts/DisplayFont-Bold.ttf')

// Pass to satori options:
{
  fonts: [{
    name: 'DisplayFont',
    data: fontData.buffer, // ArrayBuffer from Buffer
    style: 'normal',
    weight: 700,
  }]
}
```

### Signature Element Patterns for OG Images

```tsx
// Gradient orb (absolute positioned)
<div style={{
  position: 'absolute',
  top: '40px',
  right: '40px',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #primary, #accent)',
}} />

// Diagonal slash (absolute positioned)
<div style={{
  position: 'absolute',
  bottom: '0',
  right: '80px',
  width: '4px',
  height: '200px',
  backgroundColor: '#primary',
  transform: 'rotate(-15deg)',
}} />

// Accent bar (bottom border)
<div style={{
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  height: '6px',
  background: 'linear-gradient(90deg, #primary, #accent)',
}} />
```

### Template Auto-Detection Pattern

```typescript
// Convention-based template selection
function getOGTemplate(pathname: string): 'article' | 'product' | 'landing' {
  if (pathname.startsWith('/blog/') || pathname.startsWith('/posts/')) return 'article'
  if (pathname.startsWith('/products/') || pathname.startsWith('/shop/')) return 'product'
  return 'landing'
}

// Override via metadata/frontmatter:
// In Next.js generateMetadata or Astro frontmatter:
// ogTemplate: 'article' | 'product' | 'landing'
```

## Satori CSS Support Reference

### Fully Supported (HIGH confidence)

| Category | Properties |
|----------|-----------|
| Layout | `display` (flex, none), `position` (relative, absolute), `flexDirection`, `flexWrap`, `flexGrow`, `flexShrink`, `flexBasis`, `alignItems`, `alignContent`, `alignSelf`, `justifyContent`, `gap` |
| Sizing | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `padding` (all sides), `margin` (all sides) |
| Text | `color`, `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `textAlign`, `textTransform`, `textOverflow`, `textDecoration`, `textShadow`, `lineHeight`, `letterSpacing`, `whiteSpace`, `wordBreak`, `lineClamp` |
| Background | `backgroundColor`, `backgroundImage` (gradients + url), `backgroundClip` (including `text`) |
| Border | `border`, `borderWidth`, `borderStyle`, `borderColor`, `borderRadius` (all corners) |
| Visual | `opacity`, `boxShadow`, `transform` (2D only: translate, rotate, scale, skew), `transformOrigin`, `overflow` (visible, hidden), `clipPath`, `filter` |

### NOT Supported (HIGH confidence)

| Feature | Workaround |
|---------|-----------|
| `display: grid` | Use flexbox exclusively |
| WOFF2 fonts | Convert to TTF or OTF |
| CSS selectors / class names | Inline all styles via `style` prop |
| `z-index` | SVG uses paint order (document order = z-order) |
| 3D transforms | Not possible in SVG output |
| `calc()` | Pre-calculate values |
| CSS variables / custom properties | Hard-code values |
| `<style>` / `<link>` / `<script>` tags | Not supported |
| React hooks | Static render only |
| `currentColor` (limited) | Specify explicit colors |
| OpenType features (kerning, ligatures) | Not supported |
| RTL languages | Not supported |

## OG Image Platform Requirements

| Platform | Recommended Size | Aspect Ratio | Max File Size | Format |
|----------|-----------------|-------------|---------------|--------|
| Facebook | 1200 x 630 | 1.91:1 | 8 MB | PNG, JPEG |
| Twitter/X | 1200 x 630 (summary_large_image) | 1.91:1 | 5 MB | PNG, JPEG |
| LinkedIn | 1200 x 627 | 1.91:1 | 5 MB | PNG, JPEG |
| WhatsApp | 1200 x 630 | 1.91:1 | - | PNG, JPEG |
| Slack | 1200 x 630 | 1.91:1 | - | PNG, JPEG |
| Discord | 1200 x 630 | 1.91:1 | - | PNG, JPEG |

**Universal standard:** 1200 x 630 pixels, PNG format, under 500KB for fast loading. This is what the skill should enforce.

## Pipeline Wiring Analysis

### Current State of Agent Files

Analysis of which agents currently reference v1.5 SEO skills:

| Agent | Currently References SEO Skills? | Needed Additions |
|-------|----------------------------------|-----------------|
| `section-planner.md` | No -- zero references to structured-data, search-visibility, or seo-meta | Add structured-data schema assignment in PLAN.md generation |
| `quality-reviewer.md` | No -- no SEO checklist | Add SEO verification checklist (advisory with severity levels) |
| `build-orchestrator.md` | No -- Wave 0 scaffold doesn't mention SEO files | Add SEO scaffold items to Wave 0 instructions |
| `researcher.md` | No -- no Context7 MCP tools, no API doc lookup | Add Context7 MCP tool usage guidance |
| `content-specialist.md` | No -- no GEO content pattern references | Add GEO pattern references for content-heavy sections |

### Agent File Locations and Sizes

| File | Path | Needs Changes |
|------|------|---------------|
| `agents/pipeline/section-planner.md` | Section planner | Yes -- schema assignment in PLAN.md |
| `agents/pipeline/quality-reviewer.md` | Quality reviewer | Yes -- SEO checklist section |
| `agents/pipeline/build-orchestrator.md` | Build orchestrator | Yes -- Wave 0 SEO scaffold items |
| `agents/pipeline/researcher.md` | Researcher | Yes -- Context7 MCP tool integration |
| `agents/specialists/content-specialist.md` | Content specialist | Yes -- GEO content patterns |
| `skills/design-system-scaffold/SKILL.md` | Wave 0 scaffold skill | Yes -- SEO scaffold file list |
| `skills/SKILL-DIRECTORY.md` | Skill directory | Yes -- add v1.5 skills (seo-meta updated, structured-data, search-visibility, og-images) |

### Wiring Specifications per Agent

**section-planner.md additions:**
- Add skill reference to `structured-data` for schema assignment
- Add `schema_assignment` field to PLAN.md frontmatter format
- Add instruction to consult the structured-data skill's Per-Page-Type Recipe Table when generating PLAN.md files
- Add OG template type to PLAN.md (convention-based auto-detection or explicit override)

**quality-reviewer.md additions:**
- Add SEO verification section with severity classification
- CRITICAL items: missing `<title>`, missing canonical URL, missing `og:image`, broken JSON-LD syntax
- WARNING items: description length outside 120-160 range, missing alt text on OG image, FAQ schema on non-FAQ page
- Reference seo-meta constraint table for validation values

**build-orchestrator.md additions:**
- Add SEO scaffold items to Wave 0 instructions: `sitemap.ts` / `@astrojs/sitemap`, `robots.ts` / `robots.txt`, metadata base config, OG image route scaffold
- Reference `seo-meta` and `og-images` skills for Wave 0

**researcher.md additions:**
- Add Context7 MCP tool (`mcp__context7__resolve-library-id`, `mcp__context7__query-docs`) to tools list
- Add instruction to use Context7 for library documentation lookup before WebSearch
- Add fallback chain: Context7 --> official docs (WebFetch) --> WebSearch

**content-specialist.md additions:**
- Add GEO content pattern awareness from `structured-data` skill
- Reference BLUF (Bottom Line Up Front), question headings, quotable statistics patterns
- Trigger: content-heavy sections targeting search visibility

**design-system-scaffold/SKILL.md additions:**
- Add SEO scaffold files to Wave 0 file manifest: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (Next.js) or equivalent Astro files

**SKILL-DIRECTORY.md additions:**
- Update `seo-meta` entry (version updated from 2.0.0 to 3.0.0, lines updated, description updated)
- Add `structured-data` as Domain skill
- Add `search-visibility` as Domain skill
- Add `og-images` as Domain skill (new in Phase 18)
- Update skill count summary

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/og` separate package | `next/og` built into Next.js | Next.js 14.0.0 | No extra install needed for Next.js projects |
| Manual `<meta og:image>` tags | `opengraph-image.tsx` file convention | Next.js 13.3+ | Auto-discovery, auto meta tag generation |
| `ImageResponse` from `next/server` | `ImageResponse` from `next/og` | Next.js 14.0.0 | Updated import path |
| Synchronous `params` access | `await params` (Promise) | Next.js 16 | Must await params in generateMetadata and opengraph-image |
| `viewport`, `themeColor` in metadata | Moved to `generateViewport` | Next.js 14 | Deprecated fields in metadata export |

**Deprecated/outdated:**
- `@vercel/og` package: Still works but `next/og` is the correct import for Next.js 14+ projects
- `next/server` ImageResponse import: Moved to `next/og` in v14
- Synchronous params: Next.js 16 requires `await params` -- this is a runtime error if forgotten

## Open Questions

Things that couldn't be fully resolved:

1. **Satori version bundled in current next/og**
   - What we know: `next/og` wraps `@vercel/og` which uses Satori + resvg internally
   - What's unclear: The exact Satori version bundled in Next.js 16.1.6 (latest docs checked)
   - Recommendation: Not critical -- the CSS support list is stable across recent Satori versions. Document the universal limitations.

2. **Phase 17 api-patterns skill status**
   - What we know: Phase 17 PLAN-01 exists defining the api-patterns skill with Context7 MCP integration
   - What's unclear: Whether the skill has been created yet (directory not found)
   - Recommendation: The researcher agent's Context7 tool wiring can proceed independently. If api-patterns provides Context7 guidance for skills, the researcher wiring provides it for the agent pipeline. Both are needed.

3. **Astro adapter-specific font path resolution**
   - What we know: Different Astro adapters (Node, Vercel, Cloudflare) may resolve file paths differently
   - What's unclear: Whether `readFileSync('./public/fonts/...')` works uniformly across all adapters
   - Recommendation: Document the Node adapter pattern (most common) and note that other adapters may need `includeFiles` config. LOW confidence on adapter-specific paths.

4. **seo-meta skill tier in SKILL-DIRECTORY.md**
   - What we know: SKILL-DIRECTORY.md lists seo-meta as "Utility" tier, but the skill's own frontmatter declares `tier: "core"`
   - What's unclear: Which is correct -- the skill file says core, directory says utility
   - Recommendation: The skill frontmatter (`tier: "core"`) is authoritative. The directory entry should be corrected when updating SKILL-DIRECTORY.md.

## Sources

### Primary (HIGH confidence)
- [Next.js ImageResponse API docs](https://nextjs.org/docs/app/api-reference/functions/image-response) -- Constructor signature, options, supported features, font loading, examples (v16.1.6, fetched 2026-02-25)
- [Next.js Metadata and OG Images guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- File convention approach, generateMetadata, streaming metadata behavior (v16.1.6, fetched 2026-02-25)
- [Satori GitHub README](https://github.com/vercel/satori) -- CSS support list, font format support (TTF/OTF/WOFF only, no WOFF2), Yoga layout engine, known limitations
- [Satori CSS Support (DeepWiki)](https://deepwiki.com/vercel/satori/4-advanced-usage) -- Complete CSS property reference, gradient support, image embedding, architectural notes
- Existing skill files in repository: `seo-meta/SKILL.md`, `structured-data/SKILL.md`, `search-visibility/SKILL.md`, `design-system-scaffold/SKILL.md`
- Existing agent files in repository: all 7 pipeline agents + 3 specialists

### Secondary (MEDIUM confidence)
- [Astro OG with Satori patterns](https://rumaan.dev/blog/open-graph-images-using-satori) -- Endpoint structure, sharp conversion, font loading approach
- [Astro Dynamic OG](https://bepyan.me/en/post/astro-dynamic-og/) -- getStaticPaths pattern, sharp compression options
- [Astro OG with resvg-js](https://blog.otterlord.dev/posts/dynamic-opengraph/) -- Resvg conversion, Vite config workarounds
- [OG Image Size Guide](https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2025-guide) -- Platform-specific size requirements

### Tertiary (LOW confidence)
- [@resvg/resvg-js vs sharp benchmark](https://github.com/privatenumber/sharp-vs-resvgjs) -- Performance comparison (context-dependent, not authoritative for our use case)
- [Satori WOFF2 discussion](https://github.com/vercel/satori/discussions/157) -- Confirmed WOFF2 not supported, workaround is format conversion

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Next.js official docs verified, Satori GitHub verified, Astro patterns verified from multiple sources
- Architecture (OG skill): HIGH -- API surface is well-documented and stable, CSS limitations are well-known
- Architecture (pipeline wiring): HIGH -- Based on direct reading of all agent files in the repository, identifying exact gaps
- Pitfalls: HIGH -- Font format limitation verified from Satori source, metadata merging verified from Next.js docs, Vite bundling issue verified from multiple Astro community reports
- Satori CSS support: MEDIUM -- Verified from GitHub and DeepWiki but some edge cases may exist with partial property support

**Research date:** 2026-02-25
**Valid until:** 2026-04-25 (stable APIs, Satori CSS subset unlikely to change significantly)
