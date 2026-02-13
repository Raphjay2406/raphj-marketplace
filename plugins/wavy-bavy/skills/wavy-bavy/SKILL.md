---
name: wavy-bavy
description: "Integrate the wavy-bavy React library for seamless wave transitions between page sections. Use for decorative section dividers and wave boundaries."
---

Use this skill when the user mentions "wave", "wavy", "section divider", "wave transition", "wavy-bavy", or wants decorative boundaries between page sections.

You are an expert at integrating the `wavy-bavy` React library for seamless, automatic wave transitions between page sections.

## Installation

```bash
npm install wavy-bavy
```

## Core Concepts

### Basic Setup (Required)

Always wrap the page with `WaveProvider` and use `WaveSection` for each section:

```tsx
import { WaveProvider, WaveSection } from 'wavy-bavy';

export default function Page() {
  return (
    <WaveProvider>
      <WaveSection background="#1a1a2e">
        <h1>Hero Section</h1>
      </WaveSection>
      <WaveSection background="#16213e">
        <p>Content automatically gets wave transitions</p>
      </WaveSection>
      <WaveSection background="#0f3460">
        <footer>Footer</footer>
      </WaveSection>
    </WaveProvider>
  );
}
```

## Available Patterns

- `smooth` (default) - Gentle sine wave
- `organic` - Natural, irregular curves
- `sharp` - Angular zigzag
- `mountain` - Peak-like silhouette
- `flowing` - S-curves
- `ribbon` - Varying thickness
- `layered-organic` - Dense organic layers

## Available Presets

Quick configurations: `hero`, `footer`, `dark-light`, `dramatic`, `subtle`, `angular`, `peaks`, `hero-dramatic`, `section-subtle`, `section-bold`, `cta-sweep`, `clean-divide`

```tsx
<WaveSection background="#fff" preset="hero-dramatic">
```

## Animations

**Transform-based:** `pulse`, `bounce`

**Path-morphing:** `flow`, `morph`, `ripple`, `drift`, `breathe`, `undulate`, `ripple-out`

```tsx
<WaveSection
  background="#1a1a2e"
  animate="flow"
  animationDuration={4}
>
```

## Effects

### Stroke/Outline

```tsx
<WaveSection stroke={{ color: '#fff', width: 2, dashArray: '5,5' }} />
```

### Blur/Frosted Glass

```tsx
<WaveSection blur={{ amount: 8, opacity: 0.7 }} />
```

### Texture

```tsx
<WaveSection texture={{ type: 'noise', intensity: 0.3 }} />
```

### Inner Shadow

```tsx
<WaveSection innerShadow={{ color: '#000', blur: 10, offsetY: 5 }} />
```

### Gradients

```tsx
<WaveSection
  fillGradient={{
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#ff6b6b', position: 0 },
      { color: '#4ecdc4', position: 100 }
    ]
  }}
/>
```

### Auto-gradient (from adjacent sections)

```tsx
<WaveSection background="#1a1a2e" autoGradient />
```

## Wave Shape Configuration

```tsx
<WaveSection
  pattern="organic"
  amplitude={0.6}      // Wave height (0-1)
  frequency={2}        // Wave count
  phase={0}            // Horizontal offset
  seed={42}            // Deterministic randomness
/>
```

## Dual-Wave Interlocking

```tsx
<WaveSection
  separation={{
    mode: 'interlock',  // 'interlock' | 'overlap' | 'apart' | 'flush'
    intensity: 0.5,
    gap: 20
  }}
/>
```

## Multi-Layer Depth

```tsx
<WaveSection
  layers={[
    { pattern: 'organic', amplitude: 0.4, opacity: 0.3 },
    { pattern: 'smooth', amplitude: 0.6, opacity: 0.5 },
    { pattern: 'organic', amplitude: 0.8, opacity: 1 }
  ]}
/>
```

## Scroll & Interaction

### Scroll-linked animation

```tsx
<WaveSection scrollAnimate />
```

### Parallax

```tsx
<WaveSection parallax={{ speed: 0.5 }} />
```

### Hover effects

```tsx
<WaveSection hover={{ scale: 1.05, lift: 10, glowBoost: 0.2 }} />
```

### Intersection callbacks

```tsx
<WaveSection
  onEnter={() => console.log('Entered')}
  onExit={() => console.log('Exited')}
  onProgress={(p) => console.log(`${p * 100}% visible`)}
/>
```

## Responsive Heights

```tsx
<WaveSection height={{ sm: 60, md: 100, lg: 150 }} />
```

## CSS-Only Mode (No SVG)

```tsx
import { WaveSectionCSS } from 'wavy-bavy';

<WaveSectionCSS background="#1a1a2e" pattern="smooth">
  <p>Uses CSS clip-path instead of SVG</p>
</WaveSectionCSS>
```

## Web Component (Vanilla JS / Astro)

```html
<script type="module">
  import 'wavy-bavy/web-component';
</script>

<wavy-section
  background="#1a1a2e"
  pattern="organic"
  animate="flow"
  amplitude="0.6"
>
  <h1>Works without React!</h1>
</wavy-section>
```

## DevTools (Development Only)

```tsx
import { WaveDebugPanel, WavePatternGallery } from 'wavy-bavy/devtools';
import { exportWaveAsSVG, exportWaveAsRaster } from 'wavy-bavy/devtools';

// Debug overlay (Ctrl+Shift+D to toggle)
<WaveProvider debug>

// Pattern picker
<WavePatternGallery onSelect={(pattern) => setPattern(pattern)} />

// Export
const svg = exportWaveAsSVG({ pattern: 'organic', amplitude: 0.6 });
await exportWaveAsRaster({ pattern: 'organic' }, 'png', 2); // 2x scale
```

## Tailwind CSS Plugin

```js
// tailwind.config.js
import wavyBavyPlugin from 'wavy-bavy/tailwind';

export default {
  plugins: [wavyBavyPlugin],
}
```

Then use utility classes: `wave-smooth`, `wave-organic`, `wave-amplitude-60`, etc.

## Best Practices

1. Always use `WaveProvider` at the page/layout level
2. Set explicit background colors - waves derive colors from adjacent sections
3. Use presets first, then customize individual props
4. Enable `debug` prop during development to visualize boundaries
5. Use `animate` sparingly - subtle animations work best
6. Test reduced motion - animations auto-disable with `prefers-reduced-motion`
7. Use lazy rendering (default) - waves render only when visible
8. For static sites, consider `WaveSectionCSS` for smaller bundle

## Common Patterns

### Hero to content

```tsx
<WaveSection background="#1a1a2e" preset="hero-dramatic" animate="breathe">
  <Hero />
</WaveSection>
<WaveSection background="#fff">
  <Content />
</WaveSection>
```

### Alternating sections

```tsx
{sections.map((section, i) => (
  <WaveSection
    key={i}
    background={i % 2 === 0 ? '#fff' : '#f5f5f5'}
    pattern={i % 2 === 0 ? 'smooth' : 'organic'}
  >
    {section.content}
  </WaveSection>
))}
```

### CTA with glow

```tsx
<WaveSection
  background="linear-gradient(135deg, #667eea, #764ba2)"
  preset="cta-sweep"
  hover={{ glowBoost: 0.3 }}
>
  <CallToAction />
</WaveSection>
```
