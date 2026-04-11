---
name: 3d-asset-generation
description: "Full 3D asset generation suite: procedural geometry with Three.js, AI-assisted 3D via nano-banana + Spline, GLTF/GLB asset pipeline, per-archetype 3D aesthetics, performance-budgeted scene composition, progressive enhancement with static fallbacks."
tier: domain
triggers: "3d asset, 3d generation, 3d model, GLTF, GLB, Spline scene, procedural 3d, 3d hero, 3d background, WebGL asset, three.js asset, react three fiber"
version: "2.3.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Project needs unique 3D geometry** -- procedural blobs, crystals, terrain, particle fields generated from DNA tokens rather than pre-made models
- **AI-assisted texture or heightmap creation** -- generate diffuse, normal, or roughness maps via nano-banana MCP for one-of-a-kind surfaces
- **Spline scene embedding** -- designer-authored 3D scenes imported into React/Next.js/Astro with runtime DNA color mapping
- **GLTF/GLB pipeline** -- optimizing, compressing, lazy-loading, and LOD-managing third-party or exported 3D assets
- **Archetype-specific 3D aesthetics** -- each archetype demands different materials, lighting, geometry, and motion personality
- **Scene composition** -- hero backgrounds, floating accents, product showcases, scroll-linked cameras, split layouts

### When NOT to Use

- **CSS can achieve 80% of the effect** -- use `gen:shape-asset-generation` for SVG, CSS 3D transforms, pseudo-3D
- **Simple parallax or tilt** -- CSS `perspective` + `transform` is sufficient; skip R3F entirely
- **2D illustration or icon generation** -- use `gen:image-prompt-generation` or `gen:shape-asset-generation`
- **Post-processing on 2D content only** -- CSS `backdrop-filter`, `filter`, or SVG filters are lighter than R3F postprocessing
- **Already have a complete Spline scene** -- use `gen:spline-integration` directly for embed-only workflows

### Decision Tree

```
Need 3D content?
├── Is it a designer-authored Spline scene?
│   └── YES → gen:spline-integration (embed + DNA map)
├── Is it a pre-made GLTF/GLB model?
│   └── YES → This skill, Section 4 (asset pipeline)
├── Do you need unique geometry from DNA tokens?
│   └── YES → This skill, Section 1 (procedural generation)
├── Do you need AI-generated textures or heightmaps?
│   └── YES → This skill, Section 2 (AI-assisted creation)
├── Can CSS achieve the effect?
│   └── YES → gen:shape-asset-generation or CSS transforms
└── Need full interactive 3D scene composition?
    └── YES → This skill + gen:three-d-webgl-effects
```

### Pipeline Connection

- **Referenced by:** Creative Director during archetype selection (3D aesthetic mapping)
- **Referenced by:** Builder during Wave 2+ section implementation
- **Consumed at:** `/gen:build` for procedural asset generation and scene construction
- **Consumed at:** `/gen:plan` for asset budget allocation in MASTER-PLAN.md

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: DNA-Colored Procedural Blob

Organic mesh generated from IcosahedronGeometry with simplex noise displacement. Colors, metalness, and clearcoat driven by DNA tokens.

```tsx
"use client";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

interface DNAColors {
  primary: string;
  accent: string;
  glow: string;
}

export function DNABlob({ dna, speed = 0.3 }: { dna: DNAColors; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = noise3D(x * 2, y * 2, z * 2);
      const scale = 1 + n * 0.3;
      pos.setXYZ(i, x * scale, y * scale, z * scale);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed;
      meshRef.current.rotation.x += delta * speed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color={dna.primary}
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}
```

#### Pattern: Crystal / Gem Generator

Sharp faceted geometry with vertex displacement for crystal-like shapes. DNA accent color on emissive edges, signature element glow.

```tsx
"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

export function DNACrystal({
  dna,
  facets = 1,
  stretch = 2.5,
}: {
  dna: { primary: string; accent: string; glow: string };
  facets?: number;
  stretch?: number;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, facets);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Stretch vertically for crystal shape
      const yScale = 1 + Math.abs(y) * (stretch - 1);
      // Sharp displacement for faceted look
      const n = noise3D(x * 4, y * 4, z * 4);
      const displace = n > 0.2 ? 0.15 : n < -0.2 ? -0.1 : 0;
      pos.setXYZ(i, x * (1 + displace), y * yScale, z * (1 + displace));
    }
    geo.computeVertexNormals();
    return geo;
  }, [facets, stretch]);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color={dna.primary}
        roughness={0.05}
        metalness={0.1}
        transmission={0.6}
        thickness={1.5}
        ior={2.4}
        emissive={dna.glow}
        emissiveIntensity={0.3}
        clearcoat={1}
      />
    </mesh>
  );
}
```

#### Pattern: Noise Terrain from DNA

PlaneGeometry with noise-based heightmap. DNA colors mapped to elevation bands for gradient coloring.

```tsx
"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

const noise2D = createNoise2D();

export function DNATerrain({
  dna,
  size = 10,
  resolution = 128,
  amplitude = 2,
}: {
  dna: { primary: string; accent: string; surface: string };
  size?: number;
  resolution?: number;
  amplitude?: number;
}) {
  const { geometry, colorAttr } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const lowColor = new THREE.Color(dna.surface);
    const midColor = new THREE.Color(dna.primary);
    const highColor = new THREE.Color(dna.accent);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Multi-octave noise
      const n =
        noise2D(x * 0.3, z * 0.3) * 1.0 +
        noise2D(x * 0.6, z * 0.6) * 0.5 +
        noise2D(x * 1.2, z * 1.2) * 0.25;
      const height = n * amplitude;
      pos.setY(i, height);
      // Color by elevation
      const t = (n + 1.75) / 3.5; // normalize to 0-1
      const color = t < 0.5
        ? lowColor.clone().lerp(midColor, t * 2)
        : midColor.clone().lerp(highColor, (t - 0.5) * 2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return { geometry: geo, colorAttr: true };
  }, [dna.primary, dna.accent, dna.surface, size, resolution, amplitude]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.8} metalness={0.1} />
    </mesh>
  );
}
```

#### Pattern: DNA Particle Field

BufferGeometry particle system with custom position, color, and size attributes. DNA colors distributed across the field.

```tsx
"use client";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function DNAParticleField({
  dna,
  count = 2000,
  spread = 10,
}: {
  dna: { primary: string; accent: string; glow: string };
  count?: number;
  spread?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const c1 = new THREE.Color(dna.primary);
    const c2 = new THREE.Color(dna.accent);
    const c3 = new THREE.Color(dna.glow);
    const palette = [c1, c2, c3];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      const c = palette[i % 3];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = Math.random() * 0.05 + 0.01;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [count, spread, dna.primary, dna.accent, dna.glow]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}
```

#### Pattern: AI-Assisted Texture via nano-banana

Generate textures with the nano-banana MCP, then apply as maps on procedural geometry. Per-archetype prompt templates produce cohesive results.

```tsx
// Step 1: Generate texture with nano-banana MCP (agent-side)
// Prompt template per archetype:
const TEXTURE_PROMPTS: Record<string, string> = {
  brutalist: "Raw concrete surface, rough grey texture, visible aggregate, no polish, tileable, 1024x1024",
  ethereal: "Translucent pearl surface, soft iridescent shimmer, pastel opalescence, seamless tileable, 1024x1024",
  neonNoir: "Dark chrome surface with neon reflection streaks, cyan and magenta light leaks, tileable, 1024x1024",
  organic: "Natural wood grain, warm walnut tones, organic knots and rings, seamless tileable, 1024x1024",
  luxury: "Brushed gold metal surface, fine directional grain, subtle warm reflection, seamless tileable, 1024x1024",
  darkAcademia: "Aged leather texture, deep burgundy-brown, fine grain with patina, seamless tileable, 1024x1024",
  warmArtisan: "Handmade ceramic glaze, terracotta base with imperfect drip marks, warm earthy tones, tileable, 1024x1024",
  glassmorphism: "Frosted glass surface, soft diffused light, subtle rainbow refraction at edges, tileable, 1024x1024",
};

// Step 2: Apply generated texture to geometry (component-side)
import { useTexture } from "@react-three/drei";

export function AITexturedMesh({ texturePath, dna }: { texturePath: string; dna: { primary: string } }) {
  const diffuse = useTexture(texturePath);
  diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;

  return (
    <mesh>
      <icosahedronGeometry args={[1, 3]} />
      <meshPhysicalMaterial
        map={diffuse}
        color={dna.primary}
        roughness={0.4}
        metalness={0.6}
      />
    </mesh>
  );
}
```

#### Pattern: GLTF/GLB Asset Pipeline

Optimized loading with Suspense, Draco compression, and LOD switching via drei `Detailed`.

```tsx
"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Detailed, Environment } from "@react-three/drei";

// Pre-optimize GLTF assets with gltf-transform CLI:
// npx gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp

function ProductModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function ProductWithLOD() {
  return (
    <Detailed distances={[0, 15, 30]}>
      <ProductModel url="/models/product-high.glb" />   {/* < 15 units */}
      <ProductModel url="/models/product-medium.glb" /> {/* 15-30 units */}
      <ProductModel url="/models/product-low.glb" />    {/* > 30 units */}
    </Detailed>
  );
}

export function ProductViewer() {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
      <Suspense fallback={null}>
        <ProductWithLOD />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}

// Preload for instant display
useGLTF.preload("/models/product-high.glb");
```

#### Pattern: Scroll-Linked Camera Movement

Camera position driven by scroll progress using drei `useScroll`. Content-side layout with 3D on one half.

```tsx
"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Float } from "@react-three/drei";
import * as THREE from "three";

function ScrollCamera() {
  const scroll = useScroll();
  const cameraPath = useRef([
    new THREE.Vector3(0, 2, 5),
    new THREE.Vector3(3, 1, 3),
    new THREE.Vector3(0, 0.5, 2),
  ]);

  useFrame(({ camera }) => {
    const t = scroll.offset;
    const points = cameraPath.current;
    const segment = t * (points.length - 1);
    const i = Math.floor(segment);
    const frac = segment - i;
    const from = points[Math.min(i, points.length - 1)];
    const to = points[Math.min(i + 1, points.length - 1)];
    camera.position.lerpVectors(from, to, frac);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function ScrollLinkedScene({ children }: { children: React.ReactNode }) {
  return (
    <Canvas>
      <ScrollControls pages={3} damping={0.25}>
        <ScrollCamera />
        <Float speed={1.5} rotationIntensity={0.4}>
          {children}
        </Float>
      </ScrollControls>
    </Canvas>
  );
}
```

#### Pattern: Three-Tier Progressive Enhancement

Desktop gets full 3D, tablet gets simplified, mobile gets a static fallback image.

```tsx
"use client";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const Full3DScene = lazy(() => import("./Full3DScene"));
const Reduced3DScene = lazy(() => import("./Reduced3DScene"));

export function Hero3D({ fallbackSrc }: { fallbackSrc: string }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  // Mobile: static image fallback, zero JS bundle cost for 3D
  if (!isTablet) {
    return (
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={fallbackSrc}
          alt="3D scene preview"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-screen bg-bg animate-pulse" />}>
      {isDesktop ? <Full3DScene /> : <Reduced3DScene />}
    </Suspense>
  );
}
```

### Reference Sites

- **Lusion** (lusion.co) -- Procedural 3D with custom shaders, organic mesh deformation, and per-brand color systems. Benchmark for DNA-driven material work.
- **Awwwards Conference** (conference.awwwards.com) -- Scroll-linked 3D camera paths, GLTF product reveals, progressive fallback to static on mobile.
- **Linear** (linear.app) -- Subtle 3D particle backgrounds behind content with perfect performance budgets. Demonstrates restraint.
- **Basement Studio** (basement.studio) -- Heavy procedural geometry with noise displacement, R3F post-processing, and crystal-clear LOD management.
- **Atmos** (atmos.style) -- AI-generated textures applied to 3D surfaces in real time, demonstrating the AI-assisted asset pipeline.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `primary` | Main mesh color for all procedural geometry |
| `accent` | Emissive edges, crystal glow, secondary mesh highlights |
| `glow` | Point lights, bloom sources, emissive intensity |
| `surface` | Terrain low-elevation color, background planes |
| `bg` | Canvas background, fog color |
| `signature` | Geometry type selection (e.g., signature "crystal" triggers crystal generator) |
| `motion-*` | Animation speed, easing, and rotation personality per DNA motion tokens |
| `border` | Wireframe overlay color when used as debug or design element |

### Per-Archetype 3D Aesthetics

Each archetype locks a specific material system, lighting mood, geometry preference, animation personality, and DNA color application.

| Archetype | Material | Lighting | Geometry | Motion | Color Application |
|-----------|----------|----------|----------|--------|-------------------|
| Brutalist | Raw matte, no reflections, `roughness: 1.0` | Harsh single directional, hard shadows | Sharp angular low-poly, extruded planes | Hard rotation snaps, no easing | Primary on flat faces, no accent |
| Ethereal | Translucent glass, iridescent `transmission: 0.9` | Soft omnidirectional, no shadows | Organic blobs, smooth subdivided | Slow floating drift, sine easing | Primary tinted transmission, glow on Fresnel |
| Neon Noir | Chrome `metalness: 1.0` + emissive neon strips | Dark ambient with colored spot lights | Geometric wireframes with glow edges | Pulsing emissive, subtle flicker | Accent on emissive, glow on bloom post-process |
| Kinetic | Glossy plastic, `clearcoat: 1` | Bright even studio, HDRI | Dynamic shapes, spring-connected | Spring bounce, overshoot easing | Primary/accent alternating on grouped meshes |
| Editorial | Matte paper-like, `roughness: 0.9` | Warm top-down soft | Minimal planes, typography extrusions | Slow parallax drift, scroll-driven | Primary only, monochrome geometry |
| Luxury / Fashion | Brushed gold `metalness: 0.9`, thin-film interference | Rim-lit dramatic, shallow DOF | Smooth high-poly organic, torus knots | Ultra-slow orbit, ease-in-out | Primary on hero mesh, accent on rim light |
| Glassmorphism | Frosted glass `transmission: 0.7, roughness: 0.3` | Bright backlit, colored caustics | Rounded smooth, soft-body physics | Gentle wobble, spring damping | Primary behind glass, accent refractions |
| Japanese Minimal | Unlit or flat shaded, `toneMapped: false` | Single soft directional, minimal | Single geometric primitive, zen simplicity | Near-static, breathing scale pulse | Primary as fill, massive whitespace |
| Dark Academia | Aged patina, custom PBR with roughness maps | Warm candle-point lights, volumetric | Book spines, arches, classical columns | Slow reveal, fade-in-out | Primary as aged tone, accent on gilt edges |
| Retro-Future | Holographic custom shader, scan lines | Neon tube lighting with fog | Wireframe + solid hybrid, CRT screens | Glitch displacement, random offsets | Primary base, glow scan-line overlay |
| Organic | Subsurface scattering `thickness: 2.0` | Warm golden hour, area lights | Smooth blobs, leaf/petal morphs | Breathing pulse, wind simulation | Primary on organic mass, accent veins |
| AI-Native | Holographic gradient, data-stream particles | Cold clinical + accent pops | Data meshes, graph nodes, matrix grids | Data-tick motion, stochastic timing | All DNA colors in gradient cycling |

### Pipeline Stage

- **Input from:** Design DNA (color tokens, signature element, motion tokens), archetype selection, emotional arc beat map
- **Output to:** Built 3D components in `src/components/3d/`, optimized GLTF assets in `public/models/`, fallback images in `public/fallbacks/`

### Asset Directory Structure

```
public/
├── models/
│   ├── hero/
│   │   ├── scene-high.glb      # < 500KB, < 50K tris
│   │   ├── scene-medium.glb    # < 200KB, < 20K tris
│   │   └── scene-low.glb       # < 50KB, < 5K tris
│   └── accents/
│       └── crystal-01.glb      # < 100KB, < 10K tris
├── textures/
│   ├── ai-generated/           # nano-banana outputs
│   │   ├── diffuse.webp
│   │   ├── normal.webp
│   │   └── roughness.webp
│   └── env/
│       └── studio.hdr          # < 2MB
└── fallbacks/
    ├── hero-3d-fallback.webp   # Pre-rendered screenshot
    └── accent-fallback.webp
```

### GLTF Asset Size Budgets

| Asset Type | Max File Size | Max Triangles | Max Textures | Compression |
|-----------|--------------|---------------|-------------|-------------|
| Hero 3D element | 500KB | 50K | 2 x 1024px | Draco + WebP |
| Background scene | 1MB | 100K | 4 x 1024px | Draco + WebP |
| Product viewer | 2MB | 200K | 4 x 2048px | Draco + WebP |
| Decorative accent | 100KB | 10K | 1 x 512px | Draco + WebP |
| Icon/logo 3D | 50KB | 5K | 0 (vertex color) | Draco |

### GLTF Optimization Pipeline

```bash
# 1. Optimize geometry and textures
npx gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024

# 2. Generate LOD variants
npx gltf-transform simplify input.glb medium.glb --ratio 0.5
npx gltf-transform simplify input.glb low.glb --ratio 0.1

# 3. Validate size budget
ls -la output.glb  # Must be under budget per asset type table
```

### Scene Composition Patterns

| Pattern | Layout | Camera | Use Case |
|---------|--------|--------|----------|
| Hero Background | Fullscreen Canvas behind content via `position: fixed; z-index: -1` | Static or slow auto-orbit | Landing page hero with text overlay |
| Floating Accents | Small Canvas elements positioned with CSS Grid / absolute | Fixed, each accent is its own mini-canvas | Decorative 3D elements around content |
| Product Showcase | Centered Canvas with `OrbitControls` | User-controlled orbit, constrained polar angle | E-commerce product page |
| Scroll Camera | Fullscreen Canvas with `ScrollControls` | Camera position lerped along path per scroll | Storytelling / case study page |
| Split Scene | 50/50 grid, Canvas on one side, content on other | Static angled or slow orbit | Feature showcase / about page |

### Related Skills

- `gen:three-d-webgl-effects` -- Shader effects, post-processing, WebGPU; this skill generates the assets those effects are applied to
- `gen:spline-integration` -- Dedicated Spline embed workflow; this skill covers the broader pipeline including Spline
- `gen:shape-asset-generation` -- 2D/SVG/CSS shape generation; use when 3D is overkill
- `gen:performance-animation` -- General animation performance budgets; this skill owns GPU-specific budgets
- `gen:image-prompt-generation` -- AI image prompts; this skill extends that to 3D texture generation
- `gen:design-dna` -- Source of all color, motion, and signature tokens consumed here

## Layer 4: Anti-Patterns

### Anti-Pattern: Unbudgeted Triangle Count

**What goes wrong:** Procedural geometry with high subdivision (detail > 5 on IcosahedronGeometry) or unoptimized GLTF models tank frame rate. A single hero blob at detail 6 produces 81,920 triangles -- over budget for desktop and catastrophic on tablet.
**Instead:** Cap procedural geometry at detail 4 (5,120 tris). Run `gltf-transform simplify` on all imported models. Monitor with `r3f-perf` and enforce the budget table.

### Anti-Pattern: 3D on Mobile Without Fallback

**What goes wrong:** Rendering R3F on mobile causes jank, drains battery, and the ~150KB gzipped R3F bundle is loaded for nothing on underpowered GPUs. Users experience blank screens when WebGL context is lost.
**Instead:** Always implement the three-tier progressive enhancement pattern. Mobile gets a pre-rendered static image. Use `lazy()` imports so 3D libraries are never bundled for mobile.

### Anti-Pattern: Hardcoded Colors in Materials

**What goes wrong:** Using hex literals (`#8b5cf6`) in `meshPhysicalMaterial` breaks DNA consistency. The 3D scene looks disconnected from the rest of the page, and theme switching (dark/light mode) does not propagate.
**Instead:** Always source colors from DNA tokens. Pass DNA colors as props. For computed shader colors, derive from DNA base (e.g., Fresnel glow = `dna.glow`, noise gradient between `dna.primary` and `dna.accent`).

### Anti-Pattern: Uncompressed Textures

**What goes wrong:** AI-generated textures output as PNG at 4096x4096 (16MB+). Three textures on one mesh consume 48MB of GPU memory, exceeding the entire texture budget.
**Instead:** Resize to 1024x1024 (2048 max for product viewers). Convert to WebP. Use KTX2/Basis for GPU-compressed textures via `gltf-transform`. Target under 500KB per texture file.

### Anti-Pattern: Multiple Canvas Instances

**What goes wrong:** Each `<Canvas>` creates a separate WebGL context. Browsers limit contexts to ~8-16; exceeding this silently kills earlier canvases. Multiple contexts also prevent shared texture memory.
**Instead:** Use a single Canvas per page with grouped scenes. For isolated floating accents, use `createPortal` from R3F to render into separate DOM containers from a single Canvas context. Maximum 2 Canvas instances on desktop, 1 on tablet.

### Anti-Pattern: No LOD for GLTF Assets

**What goes wrong:** A single high-poly GLTF model is loaded regardless of camera distance. A product viewer with 200K triangles renders at full fidelity even when the object is 30 units away and occupies 50 pixels on screen.
**Instead:** Generate 3 LOD variants (high/medium/low) using `gltf-transform simplify`. Use drei `Detailed` component to switch between LODs based on camera distance. Budget: high < 50K tris, medium < 20K, low < 5K.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Triangle count (desktop) | 0 | 500000 | triangles | HARD -- reject if exceeded |
| Triangle count (tablet) | 0 | 100000 | triangles | HARD -- reject if exceeded |
| Triangle count (mobile) | 0 | 0 | triangles | HARD -- no 3D on mobile |
| Draw calls (desktop) | 0 | 50 | calls | SOFT -- warn if exceeded |
| Draw calls (tablet) | 0 | 20 | calls | SOFT -- warn if exceeded |
| Texture memory (desktop) | 0 | 64 | MB | HARD -- reject if exceeded |
| Texture memory (tablet) | 0 | 32 | MB | HARD -- reject if exceeded |
| Single texture file size | 0 | 500 | KB | SOFT -- warn if exceeded |
| GLTF hero asset size | 0 | 500 | KB | HARD -- reject if exceeded |
| GLTF background asset size | 0 | 1024 | KB | HARD -- reject if exceeded |
| GLTF product asset size | 0 | 2048 | KB | HARD -- reject if exceeded |
| GLTF decorative asset size | 0 | 100 | KB | SOFT -- warn if exceeded |
| JS bundle (3D libs) gzipped | 0 | 200 | KB | HARD -- reject if exceeded |
| Canvas instances per page | 1 | 2 | count | HARD -- reject if exceeded |
| Target FPS (desktop) | 60 | 60 | fps | SOFT -- warn if below |
| Target FPS (tablet) | 30 | 30 | fps | SOFT -- warn if below |
| Procedural geometry detail level | 1 | 4 | subdivision | HARD -- reject if exceeded |
| LOD variants per GLTF | 2 | 3 | variants | SOFT -- warn if fewer than min |
