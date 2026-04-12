---
name: three-d-webgl-effects
description: "3D and WebGL effects with React Three Fiber. Composable shader building blocks, three-tier responsive (desktop/tablet/static fallback), scroll-driven 3D, post-processing, DNA-guided materials. v3.0: WebGPU/TSL decision matrix, gltf-optimization hand-off, WebGL auto-fallback pattern."
tier: domain
triggers: "3D, WebGL, three.js, react three fiber, R3F, shader, particles, 3D scene, WebGPU, TSL, holographic, liquid effect, glass, displacement, orbit controls, 3D background, 3D product viewer, post-processing, bloom, noise displacement"
version: "3.0.0"
---

## v3.0 Addendum: WebGPU / TSL Decision Matrix

Three.js r170+ exposes TSL (Three Shading Language) — write shaders in JS, compile to WGSL (WebGPU) or GLSL (WebGL). This unlocks WebGPU where it counts without losing WebGL compatibility.

### When to reach for WebGPU

| Signal | WebGPU | WebGL |
|--------|:------:|:-----:|
| GPU compute needed (fluid sim, cellular automata) | ✅ | ❌ |
| Particle count > 100k | ✅ | stretched |
| Baseline target M1+, modern iPhone | ✅ | both fine |
| IE11/older Safari target (Tier 2 compat) | ❌ | ✅ |
| Static geometry, simple materials | neutral | ✅ (smaller bundle) |

Default: **WebGL**. Upgrade to WebGPU only when the scene genuinely benefits (compute, massive particles).

### Auto-fallback pattern

```tsx
import { WebGPURenderer } from 'three/webgpu';
import { WebGLRenderer } from 'three';

function makeRenderer(canvas: HTMLCanvasElement) {
  if ('gpu' in navigator) {
    try {
      const r = new WebGPURenderer({ canvas, antialias: true });
      r.init(); // async init; returns quickly in practice
      return r;
    } catch { /* fall through */ }
  }
  return new WebGLRenderer({ canvas, antialias: true });
}
```

R3F with `<Canvas gl={makeRenderer}>` — opaque swap.

### TSL shader example

```ts
import { mix, sin, time, uv, vec3 } from 'three/tsl';

// Same code compiles to WGSL (WebGPU) and GLSL (WebGL)
const colorA = vec3(0.1, 0.2, 0.3);
const colorB = vec3(0.8, 0.3, 0.5);
const wobble = sin(time.mul(2.0).add(uv().x.mul(8.0))).mul(0.5).add(0.5);
const material = new MeshBasicNodeMaterial();
material.colorNode = mix(colorA, colorB, wobble);
```

### Hand-off to gltf-optimization

When a section declares a `.glb`/`.gltf` asset, this skill hands off the asset pipeline to the `gltf-optimization` skill (utility tier). Draco/Meshopt/KTX2/LOD/budget-enforcement lives there. This skill stays focused on scene composition, materials, and interaction.

### Constraint table (v3.0)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| fps_baseline_m1 | 55 | 60 | fps | SOFT — report |
| total_gpu_memory_mb | — | 300 | MB | HARD (via gltf-optimization) |
| webgpu_fallback_required | true | true | bool | HARD |
| tsl_preferred_for_new_shaders | true | — | bool | SOFT recommend |

---

## Layer 1: Decision Guidance

### When to Use 3D

Not every project needs WebGL. R3F adds ~150KB gzipped to the bundle. Use this decision framework before reaching for 3D.

**Decision Framework:**

| Question | Answer | Approach |
|----------|--------|----------|
| Is 3D the HERO content (product viewer, interactive scene)? | Yes | Full R3F scene with drei helpers |
| Is 3D atmospheric background (floating shapes, particles)? | Yes | R3F with Float, Points, or particle BufferGeometry |
| Is it a subtle depth effect (parallax, tilt, isometric)? | Yes | CSS 3D transforms -- NOT R3F. See Shape & Asset Generation skill |
| Is it post-processing only (bloom, noise, vignette on 2D)? | Yes | Consider CSS filters/backdrop-filter first |
| Can CSS achieve 80% of the desired effect? | Yes | Use CSS. Reserve R3F for genuine 3D |

**Rule: If CSS can achieve the effect, use CSS. R3F is for real 3D only.**

Cross-reference: For CSS pseudo-3D, isometric illustrations, and SVG-based effects, see the Shape & Asset Generation skill. For Spline-designed 3D scenes, see the Spline Integration skill.

### Three-Tier Responsive 3D

**Mandatory for ALL 3D content.** No exceptions. Mobile GPUs cannot handle R3F scenes reliably, and the bundle size alone (~150KB+ gzipped) is unjustifiable on small screens.

| Tier | Breakpoint | What Renders | How |
|------|-----------|-------------|-----|
| Full | >= 1024px (desktop) | Complete 3D scene | R3F Canvas, full shaders, post-processing |
| Reduced | >= 768px (tablet) | Simplified scene | Lower geometry detail, fewer particles, no post-processing |
| Static | < 768px (mobile) | Fallback image | Static screenshot or illustration, lazy loaded |

Implementation: see Section A in Layer 2 for the complete three-tier component pattern.

### 3D Performance Budgets

These are 3D-specific budgets NOT covered by the Performance-Aware Animation skill. That skill handles general animation concerns (code-splitting, lazy loading, reduced-motion). This skill owns the GPU rendering budgets.

| Metric | Full (Desktop) | Reduced (Tablet) | Static (Mobile) |
|--------|---------------|-------------------|-----------------|
| Triangle count | < 500K | < 100K | 0 |
| Texture memory | < 128MB | < 64MB | 0 |
| Draw calls | < 100 | < 50 | 0 |
| Target FPS | 60fps | 30fps | N/A |
| Max Canvas instances | 2 per page | 1 per page | 0 |

Monitor with `r3f-perf` during development. Drop to static fallback if ANY budget is exceeded on target hardware.

Cross-reference: For general animation performance (code-splitting, lazy loading, reduced-motion, will-change budget), see the Performance-Aware Animation skill.

### DNA Material Guidance

3D materials follow a two-tier color authority model:

| Category | Color Source | Rule |
|----------|------------|------|
| Primary material colors | DNA tokens | USE `hsl(var(--color-primary))`, `hsl(var(--color-accent))` etc. |
| Shader computed colors | Creative freedom | DERIVE from DNA base -- holographic rainbow from DNA primary, noise gradients from DNA accent |
| Environment/lighting | Archetype mood | Match archetype personality -- bright/even for Swiss, moody/dramatic for Neon Noir |
| Hardcoded arbitrary colors | Forbidden | Never use `#8b5cf6` or any hex color unrelated to DNA |

The key distinction: primary surfaces use DNA tokens directly. Shader effects may compute derived colors (Fresnel glow, noise gradients, iridescent shifts) as long as the base color originates from DNA.

### Technology Stack (2026)

| Package | Version | Purpose |
|---------|---------|---------|
| @react-three/fiber | 9.5.x | React renderer for Three.js (stable, React 18+19) |
| @react-three/drei | 10.7.x | Float, Environment, OrbitControls, useScroll, Html, Detailed, ContactShadows |
| @react-three/postprocessing | 3.x | EffectComposer with Bloom, Noise, Vignette, DepthOfField |
| three-custom-shader-material | 6.x | Extend standard materials via csm_Position, csm_DiffuseColor |
| three | r171+ | Core 3D engine, WebGPU production-ready |

Install:
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install three-custom-shader-material
```

R3F v9 is the production standard. R3F v10 alpha exists with native WebGPU/TSL support but is NOT production-ready. See Section E for WebGPU forward-looking guidance.

### Pipeline Connection

- **Referenced by:** builder agents during `/gen:execute` for 3D-heavy sections
- **Consumed at:** orchestrator routes to 3D specialist when section PLAN.md specifies `builder_type: 3d-webgl`
- **Input:** Design DNA (color tokens, archetype, motion tokens), section PLAN.md (beat type, layout)
- **Output:** R3F components with DNA-guided materials, three-tier responsive handling, scroll integration

---

## Layer 2: Award-Winning Examples

All code uses `'use client'` and DNA-aware patterns. These are composable building blocks, NOT complete scene presets. Builders combine blocks into project-specific scenes.

### Section A: Core R3F Setup

#### Pattern: Next.js Dynamic Import (SSR Disabled)

Three.js requires browser APIs (WebGL context, window). Server rendering crashes. Always disable SSR.

```tsx
// components/scene-wrapper.tsx
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('./scene-3d'), { ssr: false })

export function Scene3DSection() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-bg">
      <Scene3D />
    </div>
  )
}
```

#### Pattern: Astro Client-Only Island

```astro
---
// src/pages/index.astro
import Scene3D from '../components/Scene3D'
---

<section class="h-screen">
  <!-- client:only skips SSR entirely -- required for Three.js -->
  <Scene3D client:only="react" />
</section>
```

#### Pattern: Three-Tier Responsive 3D Component

Complete pattern. Copy this as the foundation for every 3D implementation.

```tsx
'use client'
import dynamic from 'next/dynamic'
import { useMediaQuery } from '@/hooks/use-media-query'

const Scene3DFull = dynamic(() => import('./scene-3d-full'), { ssr: false })
const Scene3DReduced = dynamic(() => import('./scene-3d-reduced'), { ssr: false })

export function ResponsiveScene3D() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')

  if (isDesktop) return <Scene3DFull />
  if (isTablet) return <Scene3DReduced />

  // Static fallback for mobile -- no R3F loaded
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
      <img
        src="/scene-fallback.webp"
        alt="3D scene preview"
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
```

#### Pattern: Basic R3F Canvas with DNA Colors

```tsx
// scene-3d-full.tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls } from '@react-three/drei'

export default function Scene3DFull() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshStandardMaterial
            color="hsl(var(--color-primary))"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="studio" />
    </Canvas>
  )
}
```

### Section B: Shader Building Blocks

Composable individual techniques. Each block documents: what it does, uniforms that control it, DNA connection, and reduced-motion handling. Builders combine blocks into custom scenes.

#### Tier 1: Full Code (Common, Short)

##### Noise Displacement (THREE-CustomShaderMaterial)

Vertex displacement using simplex noise. Extends MeshPhysicalMaterial so lighting, shadows, and PBR are preserved. This is the standard approach -- never write a complete ShaderMaterial from scratch.

```tsx
'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;

  // Inline simplex noise (or import via glslify)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    float noise = snoise(position * 2.0 + uTime * 0.5);
    csm_Position = position + normal * noise * uIntensity;
  }
`

const fragmentShader = `
  uniform vec3 uColor;

  void main() {
    csm_DiffuseColor = vec4(uColor, 1.0);
  }
`

function DisplacedMesh() {
  const materialRef = useRef<any>(null)

  // Create material once with useMemo
  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uColor: { value: new THREE.Color('hsl(var(--color-primary))') },
      },
      roughness: 0.3,
      metalness: 0.6,
    })
  }, [])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh material={material}>
      <icosahedronGeometry args={[1.5, 64]} />
    </mesh>
  )
}
```

**Uniforms:** `uTime` (animation speed), `uIntensity` (displacement strength), `uColor` (DNA primary).
**DNA connection:** `uColor` reads from `--color-primary`. Adjust `uIntensity` per archetype mood.
**Reduced motion:** Set `uIntensity` to 0 (static noise shape) or skip animation by not updating `uTime`.

##### Particle Field

BufferGeometry with Float32Array positions. DNA accent color at low opacity for atmospheric depth.

```tsx
'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="hsl(var(--color-accent))"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
```

**Uniforms:** `count` (particle density), `size` (particle scale).
**DNA connection:** Color from `--color-accent` at low opacity for subtle atmospheric effect.
**Reduced motion:** Stop rotation by not updating in `useFrame`. Particles remain visible but static.
**Reduced tier:** Cut `count` to 500 for tablet.

##### Glass Material

MeshPhysicalMaterial with `transmission` for realistic glass. No custom shader needed -- Three.js physical material handles refraction natively.

```tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

function GlassSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="hsl(var(--color-primary))"
          transmission={0.95}
          thickness={1.5}
          ior={1.5}
          roughness={0.05}
          metalness={0}
          envMapIntensity={1}
        />
      </mesh>
      {/* Environment map required for glass reflections/refractions */}
      <Environment preset="studio" />
    </>
  )
}
```

**Props:** `transmission` (0-1, transparency), `thickness` (refraction depth), `ior` (index of refraction, glass ~1.5), `roughness` (frosted glass effect).
**DNA connection:** Tint via `color` property using DNA primary. Higher `roughness` for frosted/organic archetypes, lower for tech/luxury.
**Reduced motion:** Remove rotation. Glass material is visually rich even without animation.

#### Tier 2: Pattern + Setup (Need Project Adaptation)

##### Liquid/Fluid Distortion

Surface distortion via vertex displacement using sin() waves combined with noise. Creates organic, fluid-feeling surfaces.

```tsx
'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'

// Key shader logic -- vertex displacement
const liquidVertex = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmplitude;

  // Include snoise function (see Noise Displacement block above)

  void main() {
    float wave1 = sin(position.x * 3.0 + uTime * uSpeed) * uAmplitude;
    float wave2 = sin(position.y * 2.0 + uTime * uSpeed * 0.7) * uAmplitude * 0.5;
    float noise = snoise(position * 1.5 + uTime * 0.3) * uAmplitude * 0.3;

    csm_Position = position + normal * (wave1 + wave2 + noise);
  }
`

function LiquidMesh() {
  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: liquidVertex,
      fragmentShader: `void main() { csm_DiffuseColor = vec4(1.0); }`,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 1.0 },
        uAmplitude: { value: 0.15 },
      },
      color: new THREE.Color('hsl(var(--color-primary))'),
      roughness: 0.1,
      metalness: 0.3,
      transmission: 0.6,
      thickness: 1.0,
    })
  }, [])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh material={material}>
      <sphereGeometry args={[1.5, 128, 128]} />
    </mesh>
  )
}
```

**Uniforms:** `uSpeed` (wave frequency), `uAmplitude` (displacement strength).
**DNA connection:** Base color from DNA primary. Combine with `transmission` for liquid glass effect.
**Reduced motion:** Set `uSpeed` to 0 for frozen liquid shape.

##### Holographic/Iridescent Effect

View-angle color shift using dot product of normal and view direction. Fresnel edge glow with animated stripe pattern.

```tsx
'use client'
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'

const holoFragment = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform float uFresnelPower;
  uniform float uStripeFrequency;

  void main() {
    // View-angle color shift
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), uFresnelPower);

    // Rainbow shift derived from DNA base
    float hueShift = fresnel * 0.5 + uTime * 0.1;
    vec3 rainbow = vec3(
      sin(hueShift * 6.28) * 0.5 + 0.5,
      sin(hueShift * 6.28 + 2.09) * 0.5 + 0.5,
      sin(hueShift * 6.28 + 4.18) * 0.5 + 0.5
    );

    // Animated stripes
    float stripes = sin(vUv.y * uStripeFrequency + uTime * 2.0) * 0.5 + 0.5;

    // Blend: DNA base color + holographic rainbow + stripe modulation
    vec3 finalColor = mix(uBaseColor, rainbow, fresnel * 0.7) + stripes * 0.05;
    csm_DiffuseColor = vec4(finalColor, 1.0);
  }
`

function HolographicMesh() {
  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      fragmentShader: holoFragment,
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color('hsl(var(--color-primary))') },
        uFresnelPower: { value: 2.5 },
        uStripeFrequency: { value: 40.0 },
      },
      roughness: 0.15,
      metalness: 0.9,
    })
  }, [])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh material={material}>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
    </mesh>
  )
}
```

**Uniforms:** `uFresnelPower` (edge glow intensity), `uStripeFrequency` (stripe density), `uBaseColor` (DNA primary).
**DNA connection:** `uBaseColor` from DNA primary. Rainbow is DERIVED (creative freedom) -- shifts through spectrum with DNA base as anchor.
**Reduced motion:** Freeze `uTime` for static holographic appearance. The Fresnel effect still responds to camera movement.

##### Post-Processing Chain

EffectComposer from @react-three/postprocessing auto-merges compatible effects into minimal render passes.

```tsx
'use client'
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from '@react-three/postprocessing'

function ScenePostProcessing() {
  return (
    <EffectComposer>
      {/* Bloom: glow on bright areas. Matches Neon Noir, AI-Native, Glassmorphism */}
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
        intensity={0.5}
      />
      {/* Noise: subtle film grain. Matches Warm Artisan, Dark Academia, Editorial */}
      <Noise opacity={0.02} />
      {/* Vignette: darkened edges for cinematic feel */}
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  )
}

// Depth of Field variant for product viewers
function ProductDOF() {
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
      />
      <Bloom luminanceThreshold={0.95} intensity={0.3} />
    </EffectComposer>
  )
}
```

**Archetype mapping for post-processing:**

| Archetype | Bloom | Noise | Vignette | DOF |
|-----------|-------|-------|----------|-----|
| Neon Noir | High (0.8+) | Low | Strong | Optional |
| AI-Native | Medium (0.5) | Low | Medium | No |
| Dark Academia | No | Medium (0.04) | Strong | Optional |
| Warm Artisan | No | Medium (0.03) | Light | No |
| Luxury/Fashion | Low (0.3) | No | Medium | Yes |
| Glassmorphism | Medium (0.5) | No | Light | No |
| Swiss/International | No | No | No | No |
| Japanese Minimal | No | Subtle (0.01) | No | No |

**DNA connection:** Post-processing intensity maps to archetype mood. Clean archetypes (Swiss, Japanese Minimal) skip post-processing entirely.
**Reduced motion:** Post-processing is visual, not animated -- safe to keep. Reduce bloom intensity if it causes GPU strain.

#### Tier 3: Guidance + Reference (Project-Specific)

##### Volumetric Fog

**Approach:** Raymarching through a fog volume with noise-based density. Fragment shader steps through view ray, sampling 3D noise at each step to accumulate fog density.
**Libraries:** Custom ShaderMaterial (this is one case where raw ShaderMaterial may be needed since fog is a screen-space effect, not a surface material). Alternatively, use @react-three/postprocessing custom Effect.
**GPU cost:** HIGH. Desktop only. Limit ray march steps to 32-64. Consider screen-space fog approximation for reduced tier.
**DNA connection:** Fog color from `--color-surface` or `--color-bg`. Density scales with archetype mood.
**Reference:** Maxime Heckel's volumetric rendering studies, Three.js Journey advanced section.

##### Ray Marching

**Approach:** Signed Distance Functions (SDFs) in fragment shader. Define shapes mathematically, combine with boolean operations (union, intersection, subtraction). Rendered without geometry -- pure shader.
**Use cases:** Organic shapes impossible with polygon geometry, abstract art, blob morphing, metaballs.
**Libraries:** Custom ShaderMaterial with full fragment shader. SDF functions are mathematical primitives (sphere, box, torus) combined with smooth operations.
**GPU cost:** HIGH. Desktop only. Limit march steps to 64-128.
**DNA connection:** SDF shape colors from DNA tokens. Background from `--color-bg`.
**Reference:** Inigo Quilez SDF reference (iquilezles.org/articles/distfunctions), Shadertoy.

##### Custom Post-Processing Effect

**Approach:** Extend the `Effect` class from @react-three/postprocessing. Write a custom fragment shader that receives the scene render as a texture.
**Use cases:** Archetype-specific screen effects (pixelation for Brutalist, scan lines for Retro-Future, chromatic aberration for Kinetic).
**Libraries:** @react-three/postprocessing `Effect` base class.
**GPU cost:** MEDIUM. One additional full-screen pass per custom effect. Merge with EffectComposer when possible.
**DNA connection:** Effect parameters map to archetype personality.
**Reference:** @react-three/postprocessing GitHub examples for custom effect authoring.

### Section C: drei Helpers as Building Blocks

Drei provides ready-to-use R3F components. Use these before writing custom code.

#### Float -- Ambient Floating Animation

```tsx
import { Float } from '@react-three/drei'

{/* Wraps any mesh in gentle floating animation */}
<Float
  speed={2}               {/* Animation speed */}
  rotationIntensity={1}   {/* Rotation range */}
  floatIntensity={2}      {/* Float range */}
>
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="hsl(var(--color-primary))" />
  </mesh>
</Float>
```

Reduced motion: Set `speed={0}` or skip Float wrapper entirely.

#### Environment -- HDRI Lighting

```tsx
import { Environment } from '@react-three/drei'

{/* Archetype-appropriate environment maps */}
<Environment preset="studio" />     {/* Neo-Corporate, Swiss */}
<Environment preset="sunset" />     {/* Warm Artisan, Organic */}
<Environment preset="night" />      {/* Neon Noir, Dark Academia */}
<Environment preset="city" />       {/* Kinetic, AI-Native */}
<Environment preset="apartment" />  {/* Luxury/Fashion */}
```

#### OrbitControls -- Interactive Camera

```tsx
import { OrbitControls } from '@react-three/drei'

{/* Product viewer: constrained orbit */}
<OrbitControls
  enableZoom={true}
  enablePan={false}
  autoRotate
  autoRotateSpeed={0.5}
  minPolarAngle={Math.PI / 4}    {/* Prevent looking from below */}
  maxPolarAngle={Math.PI / 1.8}  {/* Prevent looking from directly above */}
  minDistance={2}
  maxDistance={8}
/>
```

Reduced motion: Set `autoRotate={false}`. User-initiated orbit still works.

#### Html -- Embed HTML in 3D Space

```tsx
import { Html } from '@react-three/drei'

{/* DNA-styled HTML overlay positioned in 3D space */}
<Html position={[2, 1, 0]} transform occlude>
  <div className="rounded-lg border border-border bg-surface/80 p-4 backdrop-blur-sm">
    <h3 className="text-sm font-medium text-text">Feature Label</h3>
    <p className="text-xs text-muted">Annotation in 3D space</p>
  </div>
</Html>
```

#### Detailed (LOD) -- Level of Detail

```tsx
import { Detailed } from '@react-three/drei'

{/* Automatically switches geometry based on camera distance */}
<Detailed distances={[0, 10, 25]}>
  <mesh><icosahedronGeometry args={[1, 64]} /><meshStandardMaterial /></mesh>  {/* Close: high detail */}
  <mesh><icosahedronGeometry args={[1, 16]} /><meshStandardMaterial /></mesh>  {/* Medium */}
  <mesh><icosahedronGeometry args={[1, 4]} /><meshStandardMaterial /></mesh>   {/* Far: low detail */}
</Detailed>
```

#### ContactShadows -- Soft Ground Shadows

```tsx
import { ContactShadows } from '@react-three/drei'

{/* Soft shadows without shadow maps. Great for product viewers */}
<ContactShadows
  position={[0, -1, 0]}
  opacity={0.4}
  blur={2.5}
  far={4}
/>
```

### Section D: Scroll-Driven 3D

Both camera movement AND scene changes tied to scroll position. Uses @react-three/drei ScrollControls.

#### Camera Orbit on Scroll

Camera orbits around the object as the user scrolls. Creates a "rotating showcase" effect.

```tsx
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import * as THREE from 'three'

function OrbitOnScroll() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  useFrame((state) => {
    const offset = scroll.offset // 0 to 1

    // Orbit camera around object
    state.camera.position.x = Math.sin(offset * Math.PI * 2) * 5
    state.camera.position.z = Math.cos(offset * Math.PI * 2) * 5
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial
        color="hsl(var(--color-primary))"
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

export function ScrollOrbit3D() {
  return (
    <div className="h-[300vh]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ScrollControls pages={3} damping={0.25}>
          <OrbitOnScroll />
        </ScrollControls>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
      </Canvas>
    </div>
  )
}
```

#### Camera Zoom on Scroll

Dolly in to reveal detail as user scrolls. Ideal for product pages -- start wide, end close.

```tsx
'use client'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

function ZoomOnScroll() {
  const scroll = useScroll()

  useFrame((state) => {
    const offset = scroll.offset
    // Dolly from z=8 (wide) to z=2 (close)
    const z = THREE.MathUtils.lerp(8, 2, offset)
    state.camera.position.z = z
  })

  return (
    <mesh>
      <icosahedronGeometry args={[1.5, 64]} />
      <meshPhysicalMaterial
        color="hsl(var(--color-primary))"
        roughness={0.1}
        metalness={0.9}
        clearcoat={1}
      />
    </mesh>
  )
}
```

#### Scene Material Changes on Scroll

Scroll-driven transitions in color, roughness, and metalness. Creates a material "journey."

```tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

function MaterialTransition() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  // Define DNA-derived color stops
  const colorStart = new THREE.Color('hsl(var(--color-primary))')
  const colorEnd = new THREE.Color('hsl(var(--color-accent))')

  useFrame(() => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial
    const offset = scroll.offset

    // Interpolate material properties with scroll
    mat.color.lerpColors(colorStart, colorEnd, offset)
    mat.roughness = THREE.MathUtils.lerp(0.8, 0.05, offset)   // Matte to glossy
    mat.metalness = THREE.MathUtils.lerp(0.0, 1.0, offset)    // Plastic to metal
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhysicalMaterial />
    </mesh>
  )
}
```

#### Geometry Morphing on Scroll

Smooth transitions between geometries using morph targets. Object transforms as user scrolls.

```tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

function MorphOnScroll() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!meshRef.current) return
    const offset = scroll.offset

    // Scale morph: sphere -> elongated -> compressed
    meshRef.current.scale.set(
      1 + Math.sin(offset * Math.PI) * 0.5,
      1 + Math.cos(offset * Math.PI) * 0.3,
      1 + Math.sin(offset * Math.PI * 0.5) * 0.4
    )

    // Rotation reveals different angles
    meshRef.current.rotation.y = offset * Math.PI * 2
    meshRef.current.rotation.x = offset * Math.PI * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[1.5, 4]} />
      <meshStandardMaterial
        color="hsl(var(--color-primary))"
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}
```

#### Element Reveals on Scroll Thresholds

Objects appear and transform at specific scroll positions. Step-based reveals for storytelling.

```tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Float } from '@react-three/drei'
import * as THREE from 'three'

function RevealElements() {
  const group1 = useRef<THREE.Group>(null)
  const group2 = useRef<THREE.Group>(null)
  const group3 = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame(() => {
    const offset = scroll.offset

    // Element 1: appears at 0-33% scroll
    if (group1.current) {
      const t1 = THREE.MathUtils.clamp(offset * 3, 0, 1)
      group1.current.scale.setScalar(t1)
      group1.current.position.y = THREE.MathUtils.lerp(-2, 0, t1)
    }

    // Element 2: appears at 33-66% scroll
    if (group2.current) {
      const t2 = THREE.MathUtils.clamp((offset - 0.33) * 3, 0, 1)
      group2.current.scale.setScalar(t2)
      group2.current.position.x = THREE.MathUtils.lerp(3, 1.5, t2)
    }

    // Element 3: appears at 66-100% scroll
    if (group3.current) {
      const t3 = THREE.MathUtils.clamp((offset - 0.66) * 3, 0, 1)
      group3.current.scale.setScalar(t3)
      group3.current.position.x = THREE.MathUtils.lerp(-3, -1.5, t3)
    }
  })

  return (
    <>
      <group ref={group1} position={[0, 0, 0]}>
        <Float speed={1.5}><mesh><boxGeometry /><meshStandardMaterial color="hsl(var(--color-primary))" /></mesh></Float>
      </group>
      <group ref={group2} position={[1.5, 0, 0]}>
        <Float speed={1.2}><mesh><sphereGeometry /><meshStandardMaterial color="hsl(var(--color-secondary))" /></mesh></Float>
      </group>
      <group ref={group3} position={[-1.5, 0, 0]}>
        <Float speed={1.8}><mesh><coneGeometry /><meshStandardMaterial color="hsl(var(--color-accent))" /></mesh></Float>
      </group>
    </>
  )
}
```

**Scroll-driven patterns summary:**

| Pattern | What Changes | Use Case |
|---------|-------------|----------|
| Camera Orbit | Camera position circles object | Rotating showcase, 360-degree view |
| Camera Zoom | Camera distance to object | Product reveal, detail exploration |
| Material Changes | Color, roughness, metalness | Material journey, mood transitions |
| Geometry Morphing | Scale, rotation, morph targets | Shape transformation storytelling |
| Element Reveals | Visibility, position, scale | Sequential feature introduction |

All patterns use `@react-three/drei` ScrollControls + useScroll. DNA color integration for all material changes.

### Section E: Forward-Looking -- WebGPU

WebGPU is production-ready as of 2026 but R3F v9 (the stable target) uses WebGL. This section documents the migration path.

#### WebGPU Browser Support (2026)

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 113+ | Full support (since 2023) |
| Edge | 113+ | Full support (since 2023) |
| Firefox | 147+ | Full support (Jan 2026, unflagged) |
| Safari | 26+ | Full support (iOS 26, macOS Tahoe 26) |
| **Global coverage** | | **~95%** |

#### Three.js WebGPU Import Path

```ts
// WebGPU with automatic WebGL 2 fallback
import * as THREE from 'three/webgpu'

// CRITICAL: Never mix import paths
// BAD: import { Scene } from 'three'; import { WebGPURenderer } from 'three/webgpu'
// GOOD: Pick ONE import path for the entire project
```

#### Async Init Requirement

WebGPU renderer initialization is asynchronous (unlike WebGL which was synchronous). Forgetting this produces a blank canvas.

```ts
// WebGPU requires async init BEFORE first render
const renderer = new THREE.WebGPURenderer()
await renderer.init()  // <-- REQUIRED. Blank screen without this.
renderer.setSize(window.innerWidth, window.innerHeight)
```

#### R3F v10 Alpha

R3F v10 alpha adds native WebGPU and TSL (Three Shader Language) support. TSL abstracts over GLSL (WebGL) and WGSL (WebGPU) -- write once, run on either backend.

**Production recommendation:** Target R3F v9 for all production work. R3F v10 is alpha -- suitable for experimentation and forward-looking prototypes only. When v10 reaches stable release, migrate to gain native WebGPU benefits.

**Warning:** Do NOT mix `three` and `three/webgpu` imports in the same codebase. Three.js documentation explicitly warns against this.

### Reference Sites

- **Maxime Heckel's Blog** (blog.maximeheckel.com) -- Definitive R3F shader tutorials: noise displacement, holographic materials, Fresnel effects, post-processing chains. Code examples with explanations.
- **Three.js Journey** (threejs-journey.com) -- Comprehensive Three.js/R3F course. Advanced shader section covers raymarching, volumetric fog, custom materials. Performance optimization patterns.
- **Codrops 3D Demos** (tympanus.net/codrops) -- Award-winning WebGL experiments with source code. Wavy carousels, particle transitions, shader-driven UI. Shows what SOTD-level 3D looks like.
- **pmndrs ecosystem** (github.com/pmndrs) -- Official R3F, drei, postprocessing repositories. Source of truth for API usage and patterns.

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in 3D |
|-----------|------------|
| `--color-primary` | Primary material color, base for shader derivations |
| `--color-secondary` | Secondary object materials |
| `--color-accent` | Particle colors, glow effects, edge highlights |
| `--color-bg` | Canvas background, fog color |
| `--color-surface` | Html overlay backgrounds in 3D space |
| `--color-glow` | Bloom threshold tint, emissive material color |
| `--color-signature` | Signature element materials in 3D |
| `--motion-duration` | Base animation speed for useFrame loops |
| `--motion-easing` | Reference for spring configs in 3D animations |

Shader-computed colors (holographic rainbow, noise gradients, Fresnel shifts) are CREATIVE FREEDOM -- they derive from DNA base colors but are not constrained to exact token values.

### Archetype Variants

| Archetype | 3D Approach | Environment | Post-Processing | Signature |
|-----------|------------|-------------|-----------------|-----------|
| Neon Noir | Emissive materials, dark scenes | Night/city | Heavy bloom, vignette | Glow-edge geometry |
| AI-Native | Data-viz geometry, particle fields | Neutral/tech | Medium bloom | Wireframe + particles |
| Kinetic | Fast rotations, dynamic camera | City/warehouse | Motion blur (custom) | Speed trails |
| Ethereal | Glass materials, soft forms | Sunset/park | Soft bloom, DOF | Floating glass |
| Luxury/Fashion | Product viewers, reflective | Studio/apartment | Subtle bloom, DOF | Pristine materials |
| Japanese Minimal | Single object, negative space | Dawn/neutral | None or minimal noise | Sparse placement |
| Brutalist | Raw geometry, wireframes | None (flat lighting) | Noise, grain | Harsh edges |
| Organic | Noise displacement, natural forms | Forest/park | Warm noise | Flowing shapes |
| Swiss/International | Clean geometry, no effects | Studio | None | Precise placement |
| Glassmorphism | Glass materials, layered transparency | Gradient/abstract | Medium bloom | Layered glass |
| Warm Artisan | Textured materials, crafted feel | Sunset/warm | Film grain noise | Handmade textures |
| Dark Academia | Moody lighting, rich textures | Library/dim | Vignette, grain | Aged materials |

### Pipeline Stage

- **Input from:** Design DNA (color tokens, archetype, motion tokens), section PLAN.md (beat type, layout, content requirements)
- **Output to:** R3F components with three-tier responsive handling, DNA-guided materials, scroll integration, post-processing
- **Quality review:** Anti-slop gate checks for hardcoded colors, missing responsive tiers, excessive GPU budgets

### Related Skills

- **Performance-Aware Animation** -- General animation performance (code-splitting, lazy loading, reduced-motion). This skill handles 3D-specific GPU budgets (triangles, textures, draw calls).
- **Cinematic Motion** -- Archetype motion profiles (base easing, duration, intensity). 3D animations should use the archetype's motion language for consistency.
- **Wow Moments** -- 3D Product Viewer and WebGL Shader Background are Tier 3 wow moments. Reference the wow moment auto-suggestion matrix for beat placement.
- **Shape & Asset Generation** -- CSS pseudo-3D and isometric effects. If the effect can be done with CSS 3D transforms, it belongs in the Shape skill, not here.
- **Spline Integration** -- Visual-first 3D scene design. Use Spline for designer-first workflows, R3F (this skill) for developer-first workflows.
- **Emotional Arc** -- Beat type determines 3D intensity. HOOK/PEAK beats get full 3D scenes; BREATHE beats get subtle atmospheric 3D; BUILD beats get functional 3D (viewers, demos).

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Loading R3F on Mobile

**What goes wrong:** Importing R3F Canvas without device detection. R3F + Three.js adds ~150KB+ gzipped. Mobile GPUs struggle with WebGL shaders. Battery drain, janky scroll, poor Core Web Vitals.
**Instead:** Three-tier responsive pattern (Section A). Desktop gets full scene, tablet gets reduced, mobile gets static image fallback. Dynamic imports with `ssr: false` ensure R3F only loads when needed.

### Anti-Pattern: Raw Three.js in React

**What goes wrong:** Using `useEffect(() => { const scene = new THREE.Scene(); ... })` for manual lifecycle management. Produces verbose, imperative code that fights React's declarative model. No automatic cleanup, no React integration, no Suspense support.
**Instead:** R3F Canvas is the standard React integration. Declarative `<mesh>`, `<ambientLight>`, automatic disposal. If you're writing `new THREE.Scene()` in React, you're using the wrong tool.

### Anti-Pattern: Full ShaderMaterial From Scratch

**What goes wrong:** Writing complete vertex and fragment shaders that replace all standard material features. Loses PBR lighting, shadows, environment maps, transmission -- everything MeshPhysicalMaterial provides for free. Requires reimplementing every material feature manually.
**Instead:** THREE-CustomShaderMaterial extends standard materials. Use `csm_Position` for vertex displacement, `csm_DiffuseColor` for color modification. Standard material features (lighting, shadows, reflections) are preserved automatically.

### Anti-Pattern: No SSR Disabling

**What goes wrong:** Rendering R3F Canvas in a server component (Next.js App Router defaults to server). Three.js requires browser APIs (WebGL context, `window`, `document`). Server render crashes with `ReferenceError: window is not defined`.
**Instead:** Always use `dynamic(() => import('./scene'), { ssr: false })` in Next.js. In Astro, use `client:only="react"`. Every 3D component must be client-only.

### Anti-Pattern: Mixing Three.js Import Paths

**What goes wrong:** Using both `import from 'three'` and `import from 'three/webgpu'` in the same project. Three.js documentation explicitly warns against this -- it produces duplicate module instances with conflicting internal state.
**Instead:** Pick ONE import path for the entire project. For R3F v9 production: use `import from 'three'` (WebGL). For WebGPU experimentation: use `import from 'three/webgpu'` exclusively across all files.

### Anti-Pattern: Hardcoded Colors in Materials

**What goes wrong:** `new THREE.Color('#8b5cf6')` with no DNA reference. Decouples 3D elements from the project's visual identity. Colors drift from the design system. Inconsistent with 2D elements that use DNA tokens.
**Instead:** Use DNA token values for primary material colors: `new THREE.Color('hsl(var(--color-primary))')`. Shader-computed colors (holographic, noise) may derive from DNA base colors with creative freedom, but must be documented.

### Anti-Pattern: No Post-Processing Merging

**What goes wrong:** Multiple separate render passes for each effect (bloom in one pass, noise in another, vignette in a third). Each pass renders the entire scene to a full-screen framebuffer. 3 effects = 3x rendering cost.
**Instead:** @react-three/postprocessing EffectComposer auto-merges compatible effects into minimal passes. Use a single `<EffectComposer>` wrapping all effects. The library optimizes pass count automatically.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| desktop-triangle-count | 0 | 500000 | triangles | HARD -- exceeding causes frame drops |
| desktop-texture-memory | 0 | 128 | MB | HARD -- exceeding causes GPU memory issues |
| desktop-draw-calls | 0 | 100 | calls | SOFT -- warn above 100, hard fail at 200 |
| tablet-triangle-count | 0 | 100000 | triangles | HARD -- tablet GPU limit |
| tablet-texture-memory | 0 | 64 | MB | HARD -- tablet memory limit |
| mobile-canvas-instances | 0 | 0 | count | HARD -- no R3F on mobile, static fallback only |
| desktop-target-fps | 60 | 60 | fps | SOFT -- investigate if sustained below 60 |
| tablet-target-fps | 30 | 60 | fps | SOFT -- investigate if sustained below 30 |
| max-canvas-per-page-desktop | 1 | 2 | count | SOFT -- more than 2 canvases compete for GPU |
| max-canvas-per-page-tablet | 1 | 1 | count | HARD -- single canvas only on tablet |
