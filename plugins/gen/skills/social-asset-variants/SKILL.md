---
name: social-asset-variants
description: Per-post + per-page social asset pack. OG (1200×630) + Twitter card + LinkedIn + Instagram feed/story/Reels + TikTok cover + Pinterest pin. Satori for text-heavy; image-cascade for photo-forward; Remotion for animated.
tier: domain
triggers: social-assets, og-image, twitter-card, linkedin-image, instagram-story, pinterest-pin, satori
version: 0.1.0
---

# Social Asset Variants

One base design; systematic per-platform adaptation.

## Layer 1 — When to use

- Every published blog post (OG + Twitter + LinkedIn)
- Product launches (all platforms + video)
- Page-level OG for every landing page
- Campaign asset kit (ad variants)

## Layer 2 — Format matrix

| Platform | Kind | Size | Notes |
|---|---|---|---|
| Open Graph universal | Static | 1200×630 | shared across FB/LinkedIn/generic OG |
| Twitter/X card | Static | 1200×675 | `summary_large_image` |
| LinkedIn post | Static | 1200×627 | nearly 1200×630 OG works |
| Instagram feed | Static | 1080×1080 | square |
| Instagram story/Reels | Static/Video | 1080×1920 | vertical 9:16 |
| TikTok cover | Static/Video | 1080×1920 | vertical; .mp4 for Reels also |
| Pinterest pin | Static | 1000×1500 | 2:3 vertical |
| YouTube thumbnail | Static | 1280×720 | 16:9 |

## Layer 3 — Generation path per format

### Text-heavy (OG, Twitter, LinkedIn) — Satori (`next/og`)

```tsx
// app/og/route.tsx — Next App Router
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Default title';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: 80,
        backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))',
        fontFamily: 'Inter',
      }}>
        <h1 style={{ fontSize: 72, color: '#fff', fontWeight: 700 }}>{title}</h1>
        <p style={{ fontSize: 28, color: '#fff', opacity: 0.8, marginTop: 24 }}>brand.com</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

Edge-runtime generation = fast + free.

### Photo-forward (Instagram feed, Pinterest) — image-cascade

Generate via Flux/nano-banana with brand + composition prompt. Multiple crops from one master.

### Animated (Reels, Stories, TikTok) — Remotion

Chains with `video-script-gen` skill. Vertical 9:16 composition.

## Layer 4 — Systematic adaptation

One "master design" → 9 variants. Adaptation rules:

| Transformation | Rule |
|---|---|
| Center crop | Keep subject in safe area (80% of shortest dimension) |
| Typography scale | Increase proportional to output width; maintain ratio |
| Element reflow | Horizontal layouts → vertical stack (for 9:16) |
| Safe areas | Top/bottom 240px reserved on stories (avatar + nav collision) |
| Text-per-frame | Keep text in viewport center 60% |

Implementation: generator reads spec, emits all 9 formats deterministically.

## Layer 5 — Archetype adaptations

- Brutalist: hard crops, no photo overlay on Reels (photo + text never blend)
- Ethereal: subtle gradient backdrop consistent across formats
- Editorial: text-heavy OG; photo-forward Instagram feed
- Playful: animated stickers on Stories/Reels
- Luxury: minimal, consistent across — same composition everywhere

## Layer 6 — Sharing meta + tags

Auto-generate:
```html
<meta property="og:image" content="https://brand.com/og/post-slug.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://brand.com/twitter/post-slug.png" />
```

## Layer 7 — Integration

- `/gen:assets social <slug>` generates full pack
- Manifest: each variant gets entry with `kind: raster/og`, `raster/twitter-card`, etc.
- Cache: same slug + same archetype → reuse cached variant
- SEO skill consumes meta tags

## Layer 8 — Anti-patterns

- ❌ Single OG for all platforms — Twitter `summary_large_image` aspect differs from LinkedIn
- ❌ Text overlaid on Reels at bottom 240px — covered by nav
- ❌ Brand logo illegible at 128×128 (email app preview) — test at small
- ❌ Stale OG cached by Facebook — use og:url + og:image:alt; purge via FB debugger on change
- ❌ Raster-only OG (no dynamic title) — missed personalization opportunity
