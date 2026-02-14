---
name: image-asset-pipeline
description: "Image and asset pipeline: OG image generation, favicon sets, SVG optimization, responsive art direction, blur placeholders, CDN patterns, sprite generation. Works with Next.js and Astro."
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
