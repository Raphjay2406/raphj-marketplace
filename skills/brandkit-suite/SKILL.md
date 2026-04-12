---
name: brandkit-suite
tier: domain
description: "Brand asset generation pipeline: logo variants (light/dark/mono), favicon sets, OG templates, brand colors (JSON/CSS/SCSS/W3C-DTCG), font specimen pages, printable PDF guidelines (Remotion-rendered). Outputs public/brand/ + brand.zip + /brand route. Reuses design-system-export token pipeline."
triggers: ["brand kit", "brandkit", "design system export", "brand guidelines", "logo variants", "favicon", "og templates", "brand pdf", "style guide export"]
used_by: ["brandkit", "export", "builder"]
version: "3.1.0"
mcp_optional: ["nano-banana"]
---

## Layer 1: Decision Guidance

### Why Brandkit Separate from design-system-export

`design-system-export` produces component-level deliverables (Storybook, DTCG tokens, TS types). `brandkit-suite` produces **brand-identity** deliverables (logo, favicon, guidelines PDF, `/brand` public route). Different audiences: design-system-export serves developers; brandkit serves marketing/client-handoff.

Both share the DNA token pipeline underneath — no duplicate token definitions.

### When to Use

- User opted into brandkit at `/gen:start-project` discovery.
- Post-`/gen:audit` with passing score → optional brandkit export before `/gen:export`.
- Client handoff / white-label scenarios where a full brand-guidelines PDF is the deliverable.

### When NOT to Use

- Project lacks a locked logo asset AND nano-banana MCP absent (would require typographic wordmark-only, flag this to user first).
- `design-system-export` already ran and user only needs component tokens (no identity assets).
- Non-final builds (score <170 on 234-pt gate) — wait until quality is shippable.

### Decision Tree

```
/gen:brandkit invoked?
├─ no prereq check → enforce: DESIGN-DNA.md exists + at least Wave 0 complete
├─ logo asset present in public/? 
│   ├─ yes → skip logo-gen; generate variants from it
│   └─ no → nano-banana MCP?
│       ├─ yes → generate logo via nano-banana
│       └─ no → fallback to typographic wordmark from DNA display font
└─ generate all 6 output categories → zip → /brand route
```

## Layer 2: Outputs

### 1. Logo variants

```
public/brand/
├── logo-full.svg          # Display, full color, DNA primary on transparent
├── logo-full-dark.svg     # Inverted for dark backgrounds
├── logo-mono.svg          # Single-color (black or white) for print / constrained contexts
├── logo-mark.svg          # Icon-only (no wordmark) for favicon / avatar
└── README.md              # Usage guidelines (sizing, clearspace, don'ts)
```

### 2. Favicon set (all sizes)

```
public/favicons/
├── favicon.ico            # 16x16, 32x32, 48x48 multi-res
├── favicon-192.png        # Android Chrome
├── favicon-512.png        # PWA / splash
├── apple-touch-icon.png   # 180x180 iOS
├── maskable-icon.png      # 512x512 with safe zone for PWA maskable
└── site.webmanifest       # PWA manifest wiring favicons
```

### 3. Color token exports

```
public/brand/
├── colors.json            # { primary: { light, dark }, ... }
├── colors.css             # :root { --color-primary: ...; }
├── colors.scss            # $color-primary: ...;
└── colors-dtcg.json       # W3C Design Tokens CG format
```

### 4. OG image templates (Remotion)

```
public/brand/og/
├── og-default.png         # 1200×630 generic share card
├── og-article.png         # Blog post template (title + author + date)
├── og-product.png         # Product showcase template
└── og-template.tsx        # Remotion source for dynamic per-page OG
```

### 5. Font specimens

```
public/brand/
├── typography-display.html  # DNA display font at all scale sizes
├── typography-body.html     # Body font specimen
└── typography-mono.html     # Mono font specimen
```

### 6. Brand guidelines PDF (Remotion-rendered)

```
public/brand/
└── brand-guidelines.pdf     # ~10-20 page printable guide
```

Contents:
- Logo usage (minimum size, clearspace, forbidden uses)
- Color palette with hex/RGB/CMYK conversions (for print)
- Typography scale + reasoning
- Imagery style guidance
- Icon system
- Tone of voice (from brand-voice-extraction if run)
- Motion language summary

### 7. /brand public route

Auto-generated page at `/brand` on the deployed site with:
- Interactive color swatches (click to copy hex)
- Live font specimens
- Logo gallery with download links
- OG template previews
- Download-all button → `brand.zip`

## Layer 2: Commands

### `/gen:brandkit export`

Runs the full generation pipeline. Idempotent — re-running regenerates only files that changed (hash-based cache).

### `/gen:brandkit preview`

Opens `/brand` route in browser (launches dev server if not running).

### `/gen:brandkit sync`

Re-syncs color/font tokens from `DESIGN-DNA.md` without regenerating logos (useful after DNA tweaks).

## Layer 3: Integration Context

- **design-system-export** — complementary, runs independently. brandkit consumes same DNA token source.
- **og-images skill** — brandkit's OG templates build on patterns from that skill.
- **remotion-video / remotion-section-video** — brandkit's PDF + OG template rendering pipeline is Remotion-based.
- **brand-voice-extraction** (v3.1) — if VOICE-PROFILE.md exists, brandkit PDF includes tone-of-voice section.
- **nano-banana MCP** — optional. If available, generates logo from DNA colors + brand prompt. Graceful fallback to typographic wordmark.

## Layer 4: Anti-Patterns

- ❌ **Missing OFL.txt when vendoring fonts** — if brandkit PDF embeds font files (instead of referencing URLs), each font's OFL.txt must ship in the output zip.
- ❌ **CMYK conversion via naive RGB→CMYK** — use a color library (chroma-js with proper profile) to avoid print surprises.
- ❌ **Single-color logo from complex SVG** — mono logo may lose critical detail from multi-color original. Require user review or fallback to icon-only mark.
- ❌ **Favicon under 512×512 as source** — downscaling from small source produces artifacts. If logo-mark.svg is the favicon source, render at 1024+ then downscale.
- ❌ **Brandkit without passing audit** — brand kit represents a polished project. Exporting from a low-quality build communicates that quality publicly.
- ❌ **Forgetting /brand route behind auth** — public route is deliberate (investors, partners can find assets quickly). Do not require login.


---

## v3.4 Addendum: 3dsvg Brand Variant Export (v3.4.1 preparation)

When `hero_mark.enabled` in DESIGN-DNA, brandkit gains an automatic 3dsvg variant export matrix (shipping fully in v3.4.1 via `/gen:hero-mark export`):

- 5 materials from archetype's preferred_materials list (e.g., Luxury: gold/chrome/metal → 3 variants)
- 3 camera angles per material (front 0°, 3/4 right, 3/4 left)
- 2 breakpoints (2K print-safe, 4K display)
- Per-variant output: PNG + MP4 (60fps, 4s loop)

Asset layout (once v3.4.1 ships):

```
public/brand/3d/
├── {brand}-{material}-{angle}-{bp}.png
├── {brand}-{material}-{angle}-{bp}.mp4
└── index.html (preview gallery)
```

Brand guidelines PDF embeds the preview gallery with archetype rationale per material choice.

v3.4.0 ships the preset library + schema + accessibility wrapper; the brandkit fan-out automation ships in v3.4.1 alongside `/gen:hero-mark` command.
