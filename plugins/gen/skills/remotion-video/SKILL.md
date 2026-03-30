---
name: remotion-video
description: "Programmatic video content generation with Remotion. DNA-aware compositions for hero video, product demos, social media assets. Core API patterns, brownfield installation, @remotion/player for preview."
tier: domain
triggers: "Remotion, video generation, programmatic video, hero video, product video, social media assets, OG image, video composition, animated video, motion graphics"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Hero/background animated video** -- Pre-rendered video content that would be too heavy as realtime animation (complex particle systems, multi-layer compositing, cinematic intros)
- **Product showcase video** -- Animated feature walkthrough, before/after comparison, demo recording simulation
- **Social media assets** -- OG images via `<Still>`, short video previews for social sharing, animated thumbnails
- **Micro-interaction recordings** -- Video capture of UI animations for documentation, portfolio, or marketing
- **Branded motion graphics** -- Logo reveals, title sequences, animated infographics that maintain DNA consistency

### When NOT to Use

- **Realtime interactive animation** -- Use cinematic-motion skill (Motion library, GSAP, CSS) instead. Remotion is for VIDEO content, not live interactive elements
- **Simple CSS animations** -- Hover effects, entrance animations, scroll-triggered reveals belong in cinematic-motion or performance-animation skills
- **3D scenes** -- Use 3d-webgl-effects skill (R3F/Three.js) instead. Remotion can INCLUDE 3D renders but is not itself a 3D engine
- **Static image generation only** -- If you only need a single static image without any animation context, consider direct canvas/SVG generation instead

### Composition vs Rendering

This skill focuses on **composition creation** -- React components + Remotion APIs that define video content.

| Concern | Scope | Tool |
|---------|-------|------|
| Composition (what the video looks like) | This skill | Remotion React components |
| In-browser preview | This skill | `@remotion/player` |
| Video export (MP4/WebM) | Outside Genorah scope | Remotion CLI or `@remotion/renderer` |
| Server-side rendering | Outside Genorah scope | Remotion Lambda or self-hosted |

Builders create compositions. Rendering to video files is a deployment/infrastructure concern handled separately.

### Licensing Model

Remotion is NOT fully open source for all commercial use. Document this clearly in every project that uses Remotion.

| Situation | License Required | Cost |
|-----------|-----------------|------|
| Individual developer | Free (Remotion License) | $0 |
| Company with 3 or fewer employees | Free (Remotion License) | $0 |
| Non-profit organization | Free (Remotion License) | $0 |
| Evaluation / prototyping | Free (Remotion License) | $0 |
| Company with more than 3 employees | Company License | Paid |

**Builder action:** When generating Remotion code, add a comment at the top of `Root.tsx`:
```tsx
// Remotion License: Free for individuals and companies with <=3 employees.
// Companies with >3 employees require a Company License: https://www.remotion.dev/license
```

### DNA Integration Points

| DNA Attribute | Remotion Usage |
|---------------|---------------|
| Color palette (12 tokens) | Background colors, text colors, accent elements, gradient stops -- passed as JS props, NOT CSS variables |
| Typography (display/body fonts) | Font family in composition text elements via `fontFamily` style property |
| Motion language (easing, duration) | `spring()` config and `interpolate()` easing derived from DNA motion tokens |
| Archetype personality | Overall composition style: timing, transition type, visual density |
| Signature element | Recurring visual motif animated in intro/outro sequences |

**Critical:** Remotion compositions render in a headless browser context for video export. DNA tokens must be passed as **JavaScript props** (color strings, font names), not CSS custom properties. CSS variables may not resolve in the rendering environment.

### Pipeline Connection

- **Referenced by:** Section builder (specialist: video) during execute phase
- **Consumed at:** `/gen:execute` when a section PLAN.md specifies `builder_type: video` or content requires Remotion composition
- **Input from:** Design DNA (colors, fonts, motion), section PLAN.md (content requirements)
- **Output to:** Remotion composition files in project `src/remotion/` directory, SUMMARY.md with composition registry

## Layer 2: Award-Winning Examples

### Core API Reference

Essential Remotion APIs for composition creation:

| API | Purpose | Example |
|-----|---------|---------|
| `useCurrentFrame()` | Get current frame number (0-based) | `const frame = useCurrentFrame()` |
| `useVideoConfig()` | Get width, height, fps, durationInFrames | `const { fps, width } = useVideoConfig()` |
| `interpolate(value, inputRange, outputRange, options?)` | Map frame to CSS values | `interpolate(frame, [0, 30], [0, 1])` |
| `spring({ frame, fps, config? })` | Physics-based 0-to-1 transition | `spring({ frame, fps, config: { damping: 100 } })` |
| `<Composition>` | Define a video with component + metadata | `<Composition id="Hero" component={Hero} .../>` |
| `<Still>` | Define a still image (single frame composition) | `<Still id="OGImage" component={OG} .../>` |
| `<Sequence from? durationInFrames?>` | Time-shift children (nested sequences accumulate `from`) | `<Sequence from={30}>...</Sequence>` |
| `<Series>` | Display children sequentially (auto-calculated timing) | `<Series><Series.Sequence>...</Series.Sequence></Series>` |
| `Easing.*` | Easing functions for interpolate | `interpolate(frame, [0,30], [0,1], { easing: Easing.bezier(.2,0,0,1) })` |
| Extrapolation | Clamp/extend output range beyond input range | `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }` |

**Key concept:** `interpolate` with `extrapolateRight: 'clamp'` is the most common pattern -- it prevents values from overshooting after the animation completes. Always clamp unless you intentionally want continued interpolation.

### Code Patterns

#### Pattern: DNA-Aware Hero Video Composition

```tsx
// src/remotion/compositions/HeroVideo.tsx
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from 'remotion'

// DNA colors and fonts passed as JS props -- NOT CSS variables
interface HeroVideoProps {
  headline: string
  subtext: string
  colors: {
    primary: string    // e.g., "hsl(262, 83%, 58%)"
    secondary: string
    accent: string
    surface: string
    text: string
  }
  fonts: {
    display: string   // e.g., "Inter"
    body: string
  }
  // Archetype-derived timing
  springConfig: {
    damping: number   // 12 for Kinetic, 200 for Luxury
    mass: number
    stiffness: number
  }
}

export function HeroVideo({
  headline,
  subtext,
  colors,
  fonts,
  springConfig,
}: HeroVideoProps) {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  // Background gradient entrance
  const bgScale = interpolate(frame, [0, 20], [1.2, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  // Spring-based headline entrance
  const titleSpring = spring({ frame: Math.max(0, frame - 10), fps, config: springConfig })
  const titleY = interpolate(titleSpring, [0, 1], [60, 0])
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1])

  // Subtext entrance (delayed)
  const subtextSpring = spring({ frame: Math.max(0, frame - 25), fps, config: springConfig })
  const subtextOpacity = interpolate(subtextSpring, [0, 1], [0, 1])

  // Accent line draw-in
  const lineWidth = interpolate(frame, [40, 65], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${bgScale})`,
        overflow: 'hidden',
      }}
    >
      {/* Headline */}
      <Sequence from={10}>
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            fontFamily: fonts.display,
            color: colors.text,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            textAlign: 'center',
            padding: '0 80px',
            lineHeight: 1.1,
          }}
        >
          {headline}
        </h1>
      </Sequence>

      {/* Subtext */}
      <Sequence from={25}>
        <p
          style={{
            fontSize: 28,
            fontFamily: fonts.body,
            color: colors.text,
            opacity: subtextOpacity,
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          {subtext}
        </p>
      </Sequence>

      {/* Signature accent line */}
      <Sequence from={40}>
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            width: lineWidth,
            height: 4,
            background: colors.accent,
            borderRadius: 2,
          }}
        />
      </Sequence>
    </div>
  )
}
```

**Root.tsx registration:**
```tsx
// src/remotion/Root.tsx
import { Composition } from 'remotion'
import { HeroVideo } from './compositions/HeroVideo'

// Remotion License: Free for individuals and companies with <=3 employees.
// Companies with >3 employees require a Company License: https://www.remotion.dev/license

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="HeroVideo"
        component={HeroVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: 'Your Headline Here',
          subtext: 'Supporting text for context',
          colors: {
            primary: 'hsl(262, 83%, 58%)',
            secondary: 'hsl(262, 70%, 45%)',
            accent: 'hsl(45, 93%, 58%)',
            surface: 'hsl(0, 0%, 7%)',
            text: 'hsl(0, 0%, 98%)',
          },
          fonts: { display: 'Inter', body: 'Inter' },
          springConfig: { damping: 100, mass: 1, stiffness: 200 },
        }}
      />
    </>
  )
}
```

#### Pattern: Product Demo Video

```tsx
// src/remotion/compositions/ProductDemo.tsx
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Series,
  Easing,
} from 'remotion'

interface ProductDemoProps {
  features: Array<{
    title: string
    description: string
    screenshotUrl: string
    highlightArea?: { x: number; y: number; width: number; height: number }
  }>
  colors: {
    primary: string
    accent: string
    surface: string
    text: string
    border: string
  }
  fonts: { display: string; body: string }
  springConfig: { damping: number; mass: number; stiffness: number }
}

export function ProductDemo({ features, colors, fonts, springConfig }: ProductDemoProps) {
  return (
    <Series>
      {features.map((feature, i) => (
        <Series.Sequence key={i} durationInFrames={90}>
          <FeatureSlide
            feature={feature}
            colors={colors}
            fonts={fonts}
            springConfig={springConfig}
            index={i}
          />
        </Series.Sequence>
      ))}
    </Series>
  )
}

function FeatureSlide({
  feature,
  colors,
  fonts,
  springConfig,
  index,
}: {
  feature: ProductDemoProps['features'][0]
  colors: ProductDemoProps['colors']
  fonts: ProductDemoProps['fonts']
  springConfig: ProductDemoProps['springConfig']
  index: number
}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Mock browser frame entrance
  const browserSpring = spring({ frame, fps, config: springConfig })
  const browserScale = interpolate(browserSpring, [0, 1], [0.9, 1])
  const browserOpacity = interpolate(browserSpring, [0, 1], [0, 1])

  // Feature callout highlight
  const highlightOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Title slide-in from bottom
  const titleSpring = spring({ frame: Math.max(0, frame - 15), fps, config: springConfig })
  const titleY = interpolate(titleSpring, [0, 1], [40, 0])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        padding: 80,
      }}
    >
      {/* Mock browser frame */}
      <div
        style={{
          flex: 1,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          transform: `scale(${browserScale})`,
          opacity: browserOpacity,
        }}
      >
        {/* Browser chrome bar */}
        <div
          style={{
            height: 36,
            background: colors.border,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 6,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca42' }} />
        </div>

        {/* Screenshot with highlight overlay */}
        <div style={{ position: 'relative' }}>
          <img src={feature.screenshotUrl} style={{ width: '100%', display: 'block' }} />
          {feature.highlightArea && (
            <div
              style={{
                position: 'absolute',
                left: feature.highlightArea.x,
                top: feature.highlightArea.y,
                width: feature.highlightArea.width,
                height: feature.highlightArea.height,
                border: `3px solid ${colors.accent}`,
                borderRadius: 8,
                opacity: highlightOpacity,
                boxShadow: `0 0 20px ${colors.accent}40`,
              }}
            />
          )}
        </div>
      </div>

      {/* Feature callout text */}
      <Sequence from={15}>
        <div style={{ flex: 0.6 }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 700,
              fontFamily: fonts.display,
              color: colors.text,
              transform: `translateY(${titleY}px)`,
              opacity: interpolate(titleSpring, [0, 1], [0, 1]),
              marginBottom: 16,
            }}
          >
            {feature.title}
          </h2>
          <p
            style={{
              fontSize: 22,
              fontFamily: fonts.body,
              color: colors.text,
              opacity: interpolate(frame - 15, [10, 25], [0, 0.7], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              lineHeight: 1.5,
            }}
          >
            {feature.description}
          </p>
        </div>
      </Sequence>
    </div>
  )
}
```

#### Pattern: Social Media Asset Generation (OG Image via Still)

```tsx
// src/remotion/compositions/OGImage.tsx
import { Still } from 'remotion'

interface OGImageProps {
  title: string
  subtitle?: string
  colors: {
    primary: string
    accent: string
    surface: string
    text: string
  }
  fonts: { display: string; body: string }
  brandMark?: string  // URL to logo/brand image
}

export function OGImage({ title, subtitle, colors, fonts, brandMark }: OGImageProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${colors.surface}, ${colors.primary}30)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        position: 'relative',
      }}
    >
      {/* Accent stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontSize: 56,
          fontWeight: 800,
          fontFamily: fonts.display,
          color: colors.text,
          lineHeight: 1.15,
          maxWidth: '80%',
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontSize: 24,
            fontFamily: fonts.body,
            color: colors.text,
            opacity: 0.7,
            marginTop: 16,
            maxWidth: '70%',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Brand mark */}
      {brandMark && (
        <img
          src={brandMark}
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            height: 40,
          }}
        />
      )}
    </div>
  )
}

// Register in Root.tsx as a Still:
// <Still id="OGImage" component={OGImage} width={1200} height={630}
//   defaultProps={{ title: "...", colors: {...}, fonts: {...} }} />
```

**Size presets for social media assets:**

| Asset Type | Width | Height | Component |
|------------|-------|--------|-----------|
| OG Image (standard) | 1200 | 630 | `<Still>` |
| Twitter Card | 1200 | 675 | `<Still>` |
| Square (Instagram) | 1080 | 1080 | `<Still>` |
| Story (vertical) | 1080 | 1920 | `<Still>` |
| Video Preview (5s) | 1920 | 1080 | `<Composition>` at 150 frames / 30fps |
| Short Video (10s) | 1920 | 1080 | `<Composition>` at 300 frames / 30fps |

### Brownfield Installation

Add Remotion to an existing Next.js, Astro, or React project:

```bash
# Install core packages
npm install remotion @remotion/cli @remotion/player
```

**Project structure (alongside existing app):**
```
src/
  app/                      # Existing Next.js app
  components/               # Existing components
  remotion/                 # Remotion compositions (new)
    Root.tsx                # Composition registry
    compositions/
      HeroVideo.tsx         # Individual compositions
      ProductDemo.tsx
      OGImage.tsx
    lib/
      dna-tokens.ts         # DNA values as JS constants
remotion.config.ts          # Remotion config (separate from Next.js/Astro)
```

**DNA token export for Remotion:**
```tsx
// src/remotion/lib/dna-tokens.ts
// Export DNA values as plain JS -- Remotion compositions cannot read CSS variables

export const dnaColors = {
  primary: 'hsl(262, 83%, 58%)',
  secondary: 'hsl(262, 70%, 45%)',
  accent: 'hsl(45, 93%, 58%)',
  surface: 'hsl(0, 0%, 7%)',
  text: 'hsl(0, 0%, 98%)',
  border: 'hsl(0, 0%, 15%)',
  muted: 'hsl(0, 0%, 45%)',
  // Expressive tokens
  glow: 'hsl(262, 90%, 65%)',
  highlight: 'hsl(45, 100%, 70%)',
  signature: 'hsl(262, 83%, 58%)',
} as const

export const dnaFonts = {
  display: 'Inter',
  body: 'Inter',
  mono: 'JetBrains Mono',
} as const
```

Remotion shares the React runtime with your web project. Compositions are React components -- they can import shared utilities, types, and assets. The key difference is that DNA tokens must be **plain JavaScript values**, not CSS custom properties, because Remotion renders in a separate browser context for video export.

### @remotion/player: In-Browser Preview

Embed Remotion compositions as interactive video players in your web app:

```tsx
'use client'
import { Player } from '@remotion/player'
import { HeroVideo } from '@/remotion/compositions/HeroVideo'
import { dnaColors, dnaFonts } from '@/remotion/lib/dna-tokens'

function VideoPreview() {
  return (
    <Player
      component={HeroVideo}
      inputProps={{
        headline: 'Award-Winning Design',
        subtext: 'Crafted with precision',
        colors: dnaColors,
        fonts: dnaFonts,
        springConfig: { damping: 100, mass: 1, stiffness: 200 },
      }}
      durationInFrames={150}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      controls
      style={{ width: '100%', maxWidth: 800 }}
      autoPlay={false}
      loop
    />
  )
}
```

**Player capabilities:**
- Interactive playback controls (play/pause/scrub/volume)
- Embeddable in admin pages, preview dashboards, portfolio sections
- Does NOT require Remotion CLI -- runs entirely in-browser
- Same composition component used for preview and video rendering
- Accepts `inputProps` for dynamic content (different headlines, colors, etc.)

### Archetype-Aware Composition Styles

Archetype personality determines composition timing, visual style, and transition approach:

| Archetype Category | Spring Config | Frame Transitions | Visual Style | Transition Type |
|--------------------|--------------|-------------------|--------------|-----------------|
| HIGH energy (Kinetic, Neon Noir, Playful) | `{ damping: 12, stiffness: 300 }` | 15-20 frames | Bold colors, high contrast, fast movement | Hard cuts, glitch, flash |
| MEDIUM energy (Editorial, Neo-Corporate, AI-Native) | `{ damping: 80, stiffness: 180 }` | 25-30 frames | Clean layouts, professional, structured | Smooth fades, slide, wipe |
| LOW energy (Japanese Minimal, Swiss, Ethereal) | `{ damping: 200, stiffness: 100 }` | 40-50 frames | Minimal elements, whitespace, subtlety | Gentle fades, slow dissolve |
| BOLD (Brutalist, Neubrutalism) | `{ damping: 300, stiffness: 400 }` | 5-10 frames | Raw, high contrast, no smoothing | Jump cuts, no easing |
| LUXURY (Luxury/Fashion, Dark Academia) | `{ damping: 150, stiffness: 120 }` | 35-45 frames | Rich, elegant, deliberate | Cinematic fade, slow reveal |

**Applying archetype timing:**
```tsx
// Map archetype to spring config
const archetypeSpringConfigs = {
  kinetic:          { damping: 12,  mass: 0.8, stiffness: 300 },
  'neon-noir':      { damping: 15,  mass: 0.9, stiffness: 280 },
  editorial:        { damping: 80,  mass: 1,   stiffness: 180 },
  'neo-corporate':  { damping: 80,  mass: 1,   stiffness: 180 },
  'japanese-minimal': { damping: 200, mass: 1.2, stiffness: 100 },
  swiss:            { damping: 200, mass: 1.2, stiffness: 100 },
  luxury:           { damping: 150, mass: 1.1, stiffness: 120 },
  brutalist:        { damping: 300, mass: 0.7, stiffness: 400 },
  ethereal:         { damping: 180, mass: 1.3, stiffness: 90  },
} as const
```

The spring config directly controls the "feel" of all animated elements in the composition. A Kinetic composition feels snappy and energetic; a Luxury composition feels slow and deliberate. This config should be passed as a prop to all compositions and used consistently across all `spring()` calls within that composition.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Remotion Compositions |
|-----------|-------------------------------|
| Color palette (8 semantic + 4 expressive) | Background, text, accent, gradient stops. Exported as JS module (`dna-tokens.ts`), passed as `inputProps` |
| Display font | `fontFamily` for headlines and titles in compositions |
| Body font | `fontFamily` for descriptive text and captions |
| Motion easing (--ease-*) | Mapped to `Easing.bezier()` calls in `interpolate()` |
| Motion duration tokens | Inform frame count calculations (`duration_seconds * fps = frames`) |
| Signature element | Animated motif in composition intro/outro (shape, line, pattern) |

**Token flow:** Design DNA document --> `dna-tokens.ts` (JS constants) --> Composition `inputProps` --> Rendered in video frames. CSS variables are never used inside compositions.

### Archetype Variants

| Archetype | Composition Adaptation |
|-----------|----------------------|
| Kinetic | Fast cuts (15-20 frame transitions), motion blur, high element count, energetic spring (low damping) |
| Luxury/Fashion | Slow reveals (35-45 frames), cinematic gradients, minimal element count, deliberate spring (high damping) |
| Brutalist | Jump cuts (5-10 frames), raw text, no easing (linear interpolation), high contrast |
| Japanese Minimal | Slow fades (40-50 frames), single element focus, generous whitespace, gentle spring |
| Ethereal | Dissolve transitions, soft gradients, floating elements, dreamy spring (high mass) |
| Editorial | Clean type-first layouts, structured reveals, moderate timing, professional |
| Neon Noir | Glow effects, dark backgrounds, color flashes, fast-paced spring |
| Neubrutalism | Abrupt appearance (minimal spring), thick borders, bold shapes, playful timing |

### Pipeline Stage

- **Input from:** Design DNA (colors, fonts, motion tokens), section PLAN.md (video requirements, content copy)
- **Output to:** Remotion composition files (`src/remotion/compositions/`), Root.tsx registration, SUMMARY.md documenting composition IDs and props

### Related Skills

- **cinematic-motion** -- Shares motion philosophy (archetype timing, easing) but implements via CSS/Motion/GSAP for realtime. Remotion uses interpolate/spring for frame-based video.
- **design-system-scaffold** -- Can export DNA tokens as a JS module that Remotion compositions import directly from the scaffold's token output.
- **image-prompt-generation** -- AI-generated images can be composed into Remotion videos as background layers, product shots, or visual elements.
- **performance-animation** -- Not directly applicable (Remotion renders offline), but shared understanding of motion budget helps keep compositions focused.

## Layer 4: Anti-Patterns

### Anti-Pattern: CSS Variables in Compositions

**What goes wrong:** Using `hsl(var(--color-primary))` or `var(--font-display)` inside Remotion composition components. Remotion renders in a headless browser context for video export where project CSS custom properties may not be loaded. Colors render as transparent or fallback values, fonts render as system defaults.
**Instead:** Export DNA values as a JavaScript module (`dna-tokens.ts`) and pass them as `inputProps` to compositions. All styling uses inline `style` props with plain string values.

### Anti-Pattern: Licensing Ambiguity

**What goes wrong:** Presenting Remotion as "free," "open source," or "MIT licensed" without qualification. A project team with more than 3 employees deploys Remotion without a Company License, creating legal risk.
**Instead:** Always document the tiered licensing model. Add a license comment to Root.tsx. During start-project discovery, note team size to flag licensing requirements early.

### Anti-Pattern: Realtime Playback as Production UX

**What goes wrong:** Using `@remotion/player` as a primary interactive element in production (e.g., replacing a hero animation with a Remotion Player). The Player is heavier than CSS/Motion animation, adds ~50KB+ to bundle, and lacks the responsiveness of realtime animation.
**Instead:** Use Remotion Player for preview/admin contexts. For production UX, export the video as MP4/WebM and embed with a `<video>` tag, or recreate the animation using cinematic-motion techniques (CSS, Motion library, GSAP).

### Anti-Pattern: One Massive Composition

**What goes wrong:** A single 300+ frame composition with all elements, transitions, and scenes in one component. Becomes unmaintainable, hard to debug (which frame is which?), impossible to reuse sections.
**Instead:** Break compositions into `<Sequence>` blocks for time-shifted sections and `<Series>` for sequential content. Extract reusable sub-compositions (title reveal, accent animation, feature slide). Register multiple `<Composition>` entries in Root.tsx for different video types.

### Anti-Pattern: Ignoring Archetype Timing

**What goes wrong:** Using identical `spring({ config: { damping: 100 } })` for every project regardless of archetype. A Kinetic project gets the same sluggish timing as a Japanese Minimal project. Videos feel generic rather than personality-matched.
**Instead:** Derive spring config and frame transition durations from the archetype's motion profile. Use the `archetypeSpringConfigs` mapping to select appropriate physics for each project. Pass the config as a prop so every `spring()` call within a composition uses the same personality.

### Anti-Pattern: Hardcoded Colors

**What goes wrong:** Using literal hex values like `'#8b5cf6'` or `'rgb(59, 130, 246)'` instead of DNA-derived color props. The composition looks fine in isolation but does not match the project's visual identity. Changing the DNA palette requires hunting through every composition file.
**Instead:** Always receive colors via `inputProps` from the DNA token module. Reference `colors.primary`, `colors.accent`, etc. throughout. When the DNA palette changes, only `dna-tokens.ts` needs updating.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| composition-fps | 24 | 60 | fps | HARD -- below 24 looks choppy, above 60 wasteful |
| hero-video-duration | 3 | 10 | seconds | SOFT -- shorter feels abrupt, longer loses attention |
| social-video-duration | 3 | 15 | seconds | SOFT -- platform-dependent but keep concise |
| og-image-width | 1200 | 1200 | px | HARD -- OG standard |
| og-image-height | 630 | 630 | px | HARD -- OG standard |
| spring-damping-min | 5 | - | unitless | SOFT -- below 5 oscillates excessively |
| marketplace-percentage | 0 | 30 | % | HARD -- max 30% marketplace-sourced visual elements |
| composition-max-duration | - | 60 | seconds | SOFT -- longer compositions should be split into series |
