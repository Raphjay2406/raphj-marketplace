---
name: 3dsvg-extrusion
tier: domain
description: "Zero-config 3D SVG extrusion via the `3dsvg` npm component (MIT, by renatoworks). Extrudes any SVG path or text glyph into an interactive 3D object with 10 PBR material presets (plastic/metal/glass/chrome/gold/clay/holographic/etc.), animation presets (spin/float/pulse/wobble/swing), and exports PNG (up to 4K), MP4/WebM (60fps), or copy-paste JSX. Perfect for HOOK/PEAK hero glyphs, branded wordmarks, and OG renders."
triggers: ["3dsvg", "3d svg", "svg extrusion", "logo extrusion", "3d wordmark", "kinetic type 3d", "hero logo 3d", "material preset", "extrude geometry"]
used_by: ["3d-specialist", "builder", "og-images", "kinetic-typography"]
version: "3.3.0"
injection_regex: "/3dsvg|svg.*extrud|3d.*logo|extruded.*glyph|material.*preset/i"
---

## Layer 1: Decision Guidance

### Why 3dsvg

Hand-authoring 3D logo extrusions with Three.js `ExtrudeGeometry` + PBR materials + animation loops is 100+ lines of boilerplate per glyph. The `3dsvg` npm package (MIT, renatoworks) is a drop-in `<SVG3D />` component that renders any SVG path or text string as an extruded 3D object with material/animation presets. ~3 lines of code replaces ~100 of hand-written R3F.

Fits specifically: HOOK / PEAK / CLOSE beats with branded 3D moments. Not a Spline replacement (smaller scope), not a competitor to full `three-d-webgl-effects` (bigger scope).

### When to Use

- HOOK beat needs a 3D brand logo / wordmark as centerpiece.
- PEAK beat needs a kinetic 3D glyph set-piece.
- OG image renderer needs a 3D brand mark for social shares (export as 4K PNG offline).
- Section video alternative: export MP4/WebM from 3dsvg instead of Remotion for glyph-centric intros.

### When NOT to Use

- Full 3D scenes (characters, environments, particle fields) → `three-d-webgl-effects` with R3F from scratch.
- Complex interactions (orbit camera, click-select, drag) → same.
- Non-extrusion geometry (spheres, tori, subdivision surfaces) → same.
- Body-copy text (SVG3D on text breaks readability at scale) → hard no.
- Mobile-first sites with tight JS budget and no 3D on mobile → skip; use static PNG fallback.

### Decision Tree

```
Section needs 3D?
├─ Logo / glyph / wordmark extrusion with PBR material?
│   → 3dsvg-extrusion ✓
├─ Full scene / characters / environment?
│   → three-d-webgl-effects
├─ Interactive editor workflow (designer iteration)?
│   → spline-integration
└─ Procedural SVG only (2D)?
    → shape-asset-generation
```

## Layer 2: Install + Basic Usage

### Install

```bash
npm i 3dsvg
```

### Wordmark extrusion

```tsx
import { SVG3D } from '3dsvg';

export function HeroMark() {
  return (
    <SVG3D
      text="GENORAH"
      material="chrome"
      animate="float"
      className="h-64 w-full"
    />
  );
}
```

### SVG path extrusion (custom logo)

```tsx
<SVG3D
  svg={<path d="M10 10 L90 10 L50 90 Z" />}
  material="gold"
  animate="spin"
/>
```

### Offline export (PNG / MP4 / WebM) for OG + static assets

Use the web UI at https://3dsvg.design/ to export 4K PNG or 60fps MP4/WebM. Commit exported assets to `public/og/` or `public/brand/` — ship as static assets, not runtime component, for minimum bundle impact.

## Layer 2: Archetype × Material Mapping

Each archetype has preferred + forbidden materials:

| Archetype | Preferred material | Animation | Forbidden |
|---|---|---|---|
| Brutalist | `plastic`, `clay` | `wobble`, static | `chrome`, `holographic` (too polished) |
| Ethereal | `glass`, `holographic` | `float`, `pulse` | `clay` (too chunky) |
| Luxury / Fashion | `gold`, `chrome`, `metal` | `spin` (slow), `float` | `clay` (too playful) |
| AI-Native | `holographic`, `glass` | `spin`, `pulse` | `gold` (reads retail) |
| Neon Noir | `chrome` (emissive), `glass` | `pulse`, `flicker` | `clay`, `plastic` |
| Swiss / International | `plastic` (matte), static | — | `gold`, `holographic` |
| Editorial | `metal` (brushed), static | `swing` subtle | `chrome` (too aggressive) |
| Y2K | `chrome`, `holographic` | `spin`, `swing` | `plastic` (too flat) |
| Cyberpunk-HUD | `emissive-glow`, `chrome` | `pulse` | `clay`, `plastic` |
| Claymorphism | `clay` | `wobble` | `chrome`, `metal` |
| Neumorphism | `plastic` (soft-matte) | static | `gold`, `chrome` |
| Spatial / VisionOS | `glass` (frosted) | `float` | `clay`, `plastic` |
| Pixel-Art | SKIP (pixel fonts don't extrude) | — | all |

Builder agent should consult this table when `/gen:build` encounters a HOOK/PEAK section with 3D brand moment declared in PLAN.md.

## Layer 2: Performance budget

| Use mode | Bundle cost | Runtime cost | Recommendation |
|---|---|---|---|
| Live `<SVG3D>` in hero | +three.js (~150KB gz) + R3F (~30KB gz) + 3dsvg | GPU-active while visible | HOOK/PEAK only, max 1 per page |
| Offline export (PNG) | 0 bundle | 0 runtime | OG images, static brand page |
| Offline export (MP4/WebM) | 0 bundle + ~500KB-1.5MB video | video decode cost | /gen:video alternative |

Default behavior: Genorah builders prefer offline export for brand assets (zero bundle cost). Live `<SVG3D>` only when interactivity justifies (e.g., cursor-tracking rotation, hover-triggered material swap).

## Layer 3: Integration Context

- **3d-specialist agent** — branches to 3dsvg when section declares brand-glyph 3D moment.
- **kinetic-typography skill** — cross-link for text-as-3D path.
- **og-images skill** — use 3dsvg export for 4K OG renders with brand consistency.
- **brandkit-suite skill** — brand guidelines PDF embeds 3dsvg-rendered logo variants.
- **three-d-webgl-effects skill** — escalation path when 3dsvg's scope is insufficient.
- **motion-health sub-gate** — animated `<SVG3D>` counts against per-beat concurrent-animation limits. Max 1 animated 3dsvg per HOOK/PEAK.
- **perf-budgets skill** — live `<SVG3D>` adds ~180KB gz to section-JS budget; cap at 1 live instance per page.

## Layer 3: Output Pipeline (Recommended)

1. Designer opens https://3dsvg.design/, configures glyph + material + animation.
2. Export 4K PNG + 60fps MP4 + optional JSX snippet.
3. Commit PNG to `public/og/`, video to `public/brand/`.
4. Reference in component via `<img src="/og/hero-mark.png" />` or `<video>` tag.
5. If interactivity needed later, install `3dsvg` package and swap to live component on the one section that needs it.

This "design offline, deploy static" pattern fits 80% of use cases and keeps bundle clean.

## Layer 4: Anti-Patterns

- ❌ **`<SVG3D>` live on every section** — novelty fatigue + compounded bundle cost. Reserve for 1 hero moment per page.
- ❌ **`animate="spin"` on body-copy text** — violates motion-health (constant animation + readability killer).
- ❌ **Live component on mobile without fallback** — 200KB+ bundle on mobile for a flourish. Offline export or SSR-conditional swap.
- ❌ **Ignoring archetype × material table** — Cyberpunk-HUD with `clay` material reads generic. Respect the preference matrix.
- ❌ **Forgetting `prefers-reduced-motion` gate** — every animated instance must have RM fallback (static render).
- ❌ **Vendoring without pinning version** — `renatoworks/3dsvg` is solo-maintained MIT; pin to exact version in `package.json`, document fallback to native R3F `<Text3D>` in case of breakage.
- ❌ **Using for non-branded SVGs (stock icons, generic shapes)** — nothing special about 3dsvg for that use case; `three-d-webgl-effects` primitives are cheaper.

## Layer 5: Fallback Pattern (if 3dsvg package unavailable)

Native R3F equivalent for text extrusion:

```tsx
import { Canvas } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import inter from './inter.json';  // font JSON from facetype.js

export function FallbackMark() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Center>
        <Text3D font={inter} size={2} height={0.5} bevelEnabled>
          GENORAH
          <meshStandardMaterial color="#c9a961" metalness={0.8} roughness={0.2} />
        </Text3D>
      </Center>
    </Canvas>
  );
}
```

~15 lines vs 3dsvg's 5 lines; more control, no external dep. Use when pinning to a specific R3F version matters or 3dsvg breaks.

## Attribution

`3dsvg` by renatoworks, MIT-licensed. Source: https://github.com/renatoworks/3dsvg. Tool at https://3dsvg.design/. Genorah integration is wrapper guidance only — no vendored code.
