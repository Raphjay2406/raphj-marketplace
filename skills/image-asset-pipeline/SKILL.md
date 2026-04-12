---
name: image-asset-pipeline
description: "Image and asset pipeline: OG image generation, favicon sets, SVG optimization, responsive art direction, blur placeholders, CDN patterns, sprite generation. Works with Next.js and Astro."
tier: domain
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/public/**/*.{png,jpg,webp,avif}"
    - "**/*.tsx"
---

Use this skill when the user mentions OG image generation, favicon, SVG optimization, image pipeline, blur placeholder, art direction, responsive images, CDN, or asset optimization. Triggers on: og image, favicon, SVG, image pipeline, blur, placeholder, art direction, asset, CDN.

You are an expert at image and asset optimization for web performance.

## Next.js Dynamic OG Image Generation

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Blog post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '80px', fontFamily: 'Inter',
      }}>
        <div style={{ fontSize: '20px', color: '#64748b', marginBottom: '16px' }}>
          example.com/blog
        </div>
        <div style={{
          fontSize: '52px', fontWeight: 700, color: '#f8fafc',
          lineHeight: 1.2, maxWidth: '900px',
        }}>
          {post.title}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', marginTop: '40px', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#3b82f6', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 700,
          }}>
            {post.author[0]}
          </div>
          <div style={{ fontSize: '18px', color: '#94a3b8' }}>
            {post.author} · {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

## Favicon Set Generation

```
public/
├── favicon.ico          # 48x48 (legacy browsers)
├── favicon.svg          # Modern browsers (scalable, supports dark mode)
├── apple-touch-icon.png # 180x180 (iOS home screen)
├── icon-192.png         # 192x192 (Android)
├── icon-512.png         # 512x512 (Android splash)
└── site.webmanifest
```

```html
<!-- In <head> -->
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

```svg
<!-- favicon.svg with dark mode support -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    circle { fill: #3b82f6; }
    @media (prefers-color-scheme: dark) { circle { fill: #60a5fa; } }
  </style>
  <circle cx="16" cy="16" r="14" />
  <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="system-ui">M</text>
</svg>
```

```json
// site.webmanifest
{
  "name": "Site Name",
  "short_name": "Site",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "display": "standalone"
}
```

## Responsive Art Direction

```tsx
// Next.js: different images per breakpoint
import Image from 'next/image'

function HeroImage() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet="/hero-desktop.webp" />
      <source media="(min-width: 768px)" srcSet="/hero-tablet.webp" />
      <Image
        src="/hero-mobile.webp"
        alt="Hero"
        width={1440}
        height={600}
        priority
        className="w-full h-auto object-cover"
        sizes="100vw"
      />
    </picture>
  )
}

// Astro: responsive with widths
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---
<Image
  src={hero}
  alt="Hero"
  widths={[400, 800, 1200, 1600]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  format="webp"
  quality={80}
  loading="eager"
/>
```

## Blur Placeholder (LQIP)

```tsx
// Next.js: built-in blur placeholder
import Image from 'next/image'

// Static import — blur auto-generated at build
import heroImg from '@/public/hero.jpg'

<Image
  src={heroImg}
  alt="Hero"
  placeholder="blur"
  priority
/>

// Remote images — provide blurDataURL
<Image
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // 10x10 base64 thumbnail
/>
```

```tsx
// Generate blur hash at build time
import { getPlaiceholder } from 'plaiceholder'

async function getBlurData(src: string) {
  const buffer = await fetch(src).then(r => r.arrayBuffer())
  const { base64 } = await getPlaiceholder(Buffer.from(buffer), { size: 10 })
  return base64
}
```

## SVG Optimization

```tsx
// Inline SVG component (optimized, tree-shakeable)
// Use SVGR to convert SVGs to React components:
// npm install @svgr/webpack

// next.config.js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

// Usage
import Logo from '@/assets/logo.svg'
<Logo className="h-8 w-auto text-foreground" />
```

```astro
---
// Astro: inline SVG from file
const logoSvg = await Astro.glob('../assets/logo.svg');
---
<!-- Or use astro-icon package -->
<Fragment set:html={logoSvg} />
```

## CDN Image Loader

```tsx
// next.config.js — custom image loader for CDN
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
}

// lib/image-loader.ts
export default function cloudinaryLoader({ src, width, quality }: {
  src: string; width: number; quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`
}
```

## AI-Generated Image Integration (Nano-Banana MCP)

When the `nano-banana` MCP server is available, AI-generated images integrate directly into the asset pipeline:

### Generation → Optimization → Delivery

```
1. Builder generates image via mcp__nano-banana__generate_image
   → Saves to public/images/generated/{section}-{purpose}.png (PNG, ~2-4MB)

2. Optimize for web delivery:
   - Convert PNG → WebP using sharp or Next.js Image optimization
   - Generate responsive srcset variants: 400w, 800w, 1200w, 1600w
   - Generate blur placeholder (LQIP) from the generated image
   - For hero images: generate art-directed mobile crop (1:1 or 9:16)

3. Reference in code:
   <Image
     src="/images/generated/hero-bg.webp"
     alt="[descriptive alt from PLAN.md]"
     width={1600} height={900}
     placeholder="blur"
     blurDataURL={heroBlur}
     sizes="100vw"
     priority
   />
```

### Per-Beat Image Art Direction

Different emotional arc beats demand different image treatments:

| Beat | Image Style | Composition | Aspect Ratio | Treatment |
|------|------------|-------------|--------------|-----------|
| HOOK | Dramatic, cinematic, attention-grabbing | Wide with text overlay space | 21:9 or 16:9 | Full-bleed, hero-scale |
| TEASE | Suggestive, partially revealed | Cropped, mysterious | 16:9 or 4:3 | Subtle blur or mask |
| REVEAL | Full showcase, maximum detail | Centered, clear subject | 4:3 or 1:1 | Sharp, high-quality |
| BUILD | Supportive, explanatory | Thumbnail or inline | 1:1 or 4:3 | Small, utility-focused |
| PEAK | Maximum creative expression | Art-directed, unique | Variable | Full creative freedom |
| BREATHE | Minimal, atmospheric | Abstract, edge-to-edge | 21:9 | Very subtle, low opacity |
| PROOF | Authentic, credible | Portrait or documentary | 1:1 or 3:4 | Real photography preferred |
| CLOSE | Compelling, action-driving | Focused, minimal distraction | 16:9 or 4:3 | Supports CTA prominence |

### Responsive Image Strategy

For AI-generated images, generate breakpoint-specific variants:

```tsx
// Art-directed AI image with per-breakpoint crops
<picture>
  {/* Mobile: portrait crop, focus on center subject */}
  <source media="(max-width: 767px)" srcSet="/images/generated/hero-mobile.webp" />
  {/* Tablet: wider crop, more context */}
  <source media="(max-width: 1023px)" srcSet="/images/generated/hero-tablet.webp" />
  {/* Desktop: full composition */}
  <Image
    src="/images/generated/hero-desktop.webp"
    alt="Hero background"
    width={1600} height={900}
    sizes="100vw"
    priority
  />
</picture>
```

For mobile crops, use `mcp__nano-banana__edit_image` to generate mobile-specific compositions:
```
mcp__nano-banana__edit_image({
  imagePath: "public/images/generated/hero-desktop.png",
  prompt: "Crop and recompose this image for a portrait (9:16) mobile layout.
           Keep the central subject in focus. Ensure the top 40% has enough
           negative space for headline text overlay."
})
```

### DNA Color Alignment for Generated Images

AI-generated images may drift from DNA palette. Post-generation alignment:

```css
/* CSS overlay to tint generated image toward DNA palette */
.hero-bg {
  position: relative;
}
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    hsl(var(--color-bg) / 0.3),
    hsl(var(--color-surface) / 0.6)
  );
  mix-blend-mode: multiply;
}
```

Or use `mcp__nano-banana__continue_editing` for AI-based color correction:
```
"Shift the color palette to match: primary [hex], accent [hex], background [hex].
 Maintain the composition and lighting. Adjust saturation to match the muted/vibrant
 quality of the target palette."
```

## Image Format Decision Guide

Choose the right format for every image type:

| Image Type | Primary Format | Fallback | Compression | Max Size |
|-----------|---------------|----------|-------------|----------|
| **Hero background** | AVIF (best compression) | WebP → JPEG | lossy 70-80% | 200KB |
| **Product photography** | WebP | JPEG | lossy 80-85% | 150KB |
| **Illustration** | WebP (flat) or SVG (vector) | PNG | lossy 80% | 100KB |
| **Icon** | SVG (inline via SVGR) | -- | N/A | 5KB |
| **Logo** | SVG | PNG | lossless | 10KB |
| **OG/Social** | PNG (Satori) | -- | lossless | 200KB |
| **Favicon** | SVG + ICO | PNG | mixed | 5KB each |
| **Texture (3D)** | KTX2 (GPU) | WebP | GPU-native | per 3D budget |
| **AI-generated** | WebP (from PNG source) | JPEG | lossy 80% | 200KB |

### AVIF Support

AVIF offers 30-50% better compression than WebP with near-identical visual quality. Use it as primary format with WebP fallback:

```tsx
// Next.js: automatic AVIF negotiation
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first, WebP fallback
  },
};

// Astro: explicit AVIF
import { Image } from 'astro:assets';
<Image src={hero} format="avif" quality={70} alt="Hero" />

// Manual <picture> for maximum control
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero" width={1600} height={900} loading="eager" />
</picture>
```

### Build-Time Image Optimization

```bash
# Sharp CLI for batch optimization
npx sharp-cli --input "public/images/*.png" --output "public/images/optimized/" \
  --format webp --quality 80

# AVIF conversion
npx sharp-cli --input "public/images/*.png" --output "public/images/optimized/" \
  --format avif --quality 65

# Squoosh CLI (alternative)
npx @squoosh/cli --avif '{quality: 65}' --webp '{quality: 80}' public/images/*.png
```

### Content-Aware Mobile Cropping

For AI-generated images, generate mobile-specific compositions via nano-banana:

```
mcp__nano-banana__edit_image({
  imagePath: "public/images/hero-desktop.png",
  prompt: "Recompose this image for portrait (9:16) mobile layout.
           Keep the central subject in focus and visually prominent.
           Top 40% must have sufficient negative space for text overlay.
           Maintain the same mood, colors, and lighting."
})
```

For standard images, use CSS `object-position` for smart crops:
```css
/* Desktop: full composition */
.hero-img { object-fit: cover; object-position: center; }

/* Mobile: focus on subject (typically center-top) */
@media (max-width: 767px) {
  .hero-img { object-position: center 30%; aspect-ratio: 3/4; }
}
```

## Best Practices

1. OG images: 1200x630px, PNG, edge runtime for fast generation
2. Favicons: minimum set = `.ico` + `.svg` + `apple-touch-icon.png` + webmanifest
3. SVG favicons support dark mode via `prefers-color-scheme` media query
4. Use `<picture>` + `<source>` for art direction (different crops per breakpoint)
5. Always use `priority` / `loading="eager"` for above-fold hero images
6. Blur placeholders: use `plaiceholder` or Next.js static import blur
7. Convert SVGs to components with SVGR for tree-shaking and styling
8. Use WebP/AVIF format with JPEG fallback
9. Set explicit `width` and `height` to prevent CLS
10. CDN: configure custom image loader for Cloudinary/Imgix/Bunny
11. For Astro: use `astro:assets` Image component with `widths` and `format="webp"`
12. AI-generated images: always optimize post-generation (PNG → WebP, generate srcset, LQIP)
13. Per-beat image art direction: match image composition to emotional arc beat purpose
14. Mobile crops: generate separate portrait-oriented compositions, not just scaled-down landscape
15. DNA color alignment: use CSS overlay tinting or AI-based color correction for palette consistency

## v3.2 Addendum: Multi-Model Image Generation + LQIP + Art-Direction Cropping

### Model cascade for image generation (beyond nano-banana)

Genorah routes image generation by beat + content type:

| Beat / Content | Primary model | Fallback | Why |
|---|---|---|---|
| HOOK — hero atmosphere | nano-banana (Gemini 3.1 Flash Image) | Flux 1.1 Pro | Speed + DNA color adherence; Flux for photoreal fallback |
| HOOK — typography-in-image (poster, branded hero with text) | **Ideogram 3** | nano-banana | Best typographic clarity (multi-line, curved, integrated). $0.03-0.05/img |
| PEAK — showcase / painterly | **Flux 1.1 Pro** | nano-banana | Photoreal/painterly. $0.04/img (BFL API) |
| PROOF — testimonials / portraits | nano-banana | Flux 1.1 Pro | Cost-optimized |
| Texture / decorative | nano-banana | — | Fastest |
| Iterative edits | **nano-banana** (continue_editing) | — | Only model with strong iterative-edit API in 2026 |

All three models are optional MCP integrations. `.claude-plugin/.mcp.json` declares availability; graceful fallback to text-prompts-only when unavailable.

### LQIP (Low Quality Image Placeholder) auto-generation

Every hero image gets a 20×20 pixelated LQIP generated from a 32×32 downsample, base64-embedded in the srcset as the `src` attribute. Benefits:

- Paints immediately (no network for placeholder)
- Hints final image aspect ratio + color tone (prevents CLS)
- ~1KB per image in HTML; no extra request

Implementation: nano-banana or local `sharp` pipeline produces the LQIP at build time; built into next-image / astro-image config.

### Responsive srcset — art direction per breakpoint

Instead of one image scaled to 4 sizes, generate 3 breakpoint variants with **different crops**:

- Mobile (375px): tight crop on hero subject (portrait orientation)
- Tablet (768px): balanced crop
- Desktop (1280px+): wide crop with environmental context

Vision LLM (Gemini/Claude) identifies subject bounding box, proposes 3 crops. Builder emits:

```html
<picture>
  <source media="(max-width: 767px)"  srcset="/hero-mobile.avif" type="image/avif">
  <source media="(max-width: 1279px)" srcset="/hero-tablet.avif" type="image/avif">
  <img src="/hero-desktop.avif" alt="...">
</picture>
```

Genuinely different compositions per breakpoint, not just downscales.

