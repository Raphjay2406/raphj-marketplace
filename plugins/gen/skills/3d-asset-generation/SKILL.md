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

## Shader Library (GLSL Code Reference)

### Noise Displacement Vertex Shader

```glsl
// vertex shader — simplex noise displacement on any mesh
uniform float uTime;
uniform float uIntensity; // 0.1 (subtle) to 0.5 (dramatic)
uniform float uFrequency; // 1.0 (smooth) to 4.0 (detailed)

// Simplex noise function (paste snoise3 here or import)
// ... (use lygia/generative/snoise or custom implementation)

void main() {
  vec3 pos = position;
  float noise = snoise(pos * uFrequency + uTime * 0.3);
  pos += normal * noise * uIntensity;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

**R3F integration via three-custom-shader-material (CSM v6.x):**
```tsx
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader: `
    uniform float uTime;
    uniform float uIntensity;
    void main() {
      float noise = sin(position.x * 3.0 + uTime) * sin(position.y * 3.0 + uTime * 0.7);
      csm_Position = position + normal * noise * uIntensity;
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 0.2 },
  },
  color: new THREE.Color(dna.primary),
  roughness: 0.3,
  metalness: 0.7,
});
```

### Holographic/Iridescent Fragment Shader

```glsl
// fragment shader — Fresnel-based iridescence
uniform float uFresnelPower;   // 2.0-4.0
uniform float uStripeFreq;     // 30.0-50.0 (animated stripes)
uniform float uTime;
uniform vec3 uBaseColor;       // DNA primary

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(1.0 - dot(vNormal, vViewDir), uFresnelPower);
  // Rainbow hue shift based on view angle
  vec3 rainbow = vec3(
    sin(fresnel * 6.28 + 0.0) * 0.5 + 0.5,
    sin(fresnel * 6.28 + 2.09) * 0.5 + 0.5,
    sin(fresnel * 6.28 + 4.18) * 0.5 + 0.5
  );
  // Animated scan stripes
  float stripes = sin(vNormal.y * uStripeFreq + uTime * 2.0) * 0.5 + 0.5;
  vec3 color = mix(uBaseColor, rainbow, fresnel * 0.6) + stripes * 0.05;
  gl_FragColor = vec4(color, 0.9);
}
```

### Liquid/Fluid Vertex Shader

```glsl
uniform float uTime;
uniform float uSpeed;      // 0.5-2.0
uniform float uAmplitude;  // 0.1-0.3

void main() {
  vec3 pos = position;
  // Multi-wave displacement
  pos.x += sin(pos.y * 4.0 + uTime * uSpeed) * uAmplitude;
  pos.y += sin(pos.x * 3.0 + uTime * uSpeed * 0.7) * uAmplitude * 0.8;
  pos.z += cos(pos.x * 2.0 + pos.y * 2.0 + uTime * uSpeed * 0.5) * uAmplitude * 0.5;
  csm_Position = pos;
}
```

### Crystal Refraction (MeshPhysicalMaterial)

```tsx
// No custom shader needed — MeshPhysicalMaterial handles crystal natively
<meshPhysicalMaterial
  color={dna.primary}
  transmission={0.95}        // Transparency
  thickness={2.0}            // Refraction depth
  ior={2.33}                 // Index of refraction (diamond=2.42, glass=1.5, crystal=2.0-2.4)
  roughness={0.05}
  clearcoat={1.0}
  clearcoatRoughness={0.1}
  envMapIntensity={1.5}
  attenuationColor={dna.accent}
  attenuationDistance={0.5}
/>
```

---

## Post-Processing Effect Stack

**Correct effect order (order matters — earlier effects feed into later ones):**

```tsx
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

<EffectComposer>
  {/* 1. Bloom (luminance-based glow) */}
  <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.025} intensity={0.5} mipmapBlur />
  {/* 2. Chromatic Aberration (subtle, radial) */}
  <ChromaticAberration offset={[0.002, 0.002]} radialModulation />
  {/* 3. Film Grain */}
  <Noise opacity={0.02} />
  {/* 4. Vignette */}
  <Vignette eskil={false} offset={0.1} darkness={0.5} />
  {/* 5. Tone Mapping (ALWAYS LAST) */}
  <ToneMapping mode={ToneMappingMode.AGX} />
</EffectComposer>
```

**Per-archetype post-processing presets:**

| Archetype | Bloom | Noise | Vignette | ChromAb | Tone Map |
|-----------|-------|-------|----------|---------|----------|
| Neon Noir | `intensity: 0.8, threshold: 0.6` | `0.015` | `darkness: 0.7` | `[0.003, 0.003]` | AGX |
| Ethereal | `intensity: 0.4, threshold: 0.85` | `0.01` | `darkness: 0.3` | `[0.001, 0.001]` | ACES |
| Glassmorphism | `intensity: 0.3, threshold: 0.8` | none | `darkness: 0.2` | none | ACES |
| Brutalist | none | `0.04` | `darkness: 0.6` | none | LINEAR |
| Dark Academia | `intensity: 0.2, threshold: 0.9` | `0.05` | `darkness: 0.8` | none | AGX |
| Luxury/Fashion | `intensity: 0.3, threshold: 0.85` | none | `darkness: 0.4` | none | ACES |
| Japanese Minimal | none | none | `darkness: 0.15` | none | ACES |
| AI-Native | `intensity: 0.6, threshold: 0.7` | none | none | `[0.002, 0.002]` | AGX |
| Swiss/International | none | none | none | none | LINEAR |

---

## HDRI Environment Loading

```tsx
import { Environment } from '@react-three/drei';

// Preset-based (instant, no download)
<Environment preset="studio" />  // Product viewers, neutral
<Environment preset="city" />    // Urban, Neon Noir
<Environment preset="sunset" />  // Warm, Organic, Warm Artisan
<Environment preset="dawn" />    // Ethereal, soft
<Environment preset="night" />   // Dark Academia, moody
<Environment preset="warehouse" /> // Brutalist, industrial

// Custom HDRI (higher quality, larger download)
<Environment files="/hdri/studio-soft.hdr" />

// Per-archetype environment preset mapping:
// Brutalist → warehouse | Ethereal → dawn | Kinetic → city
// Neon Noir → night | Luxury → studio | Japanese Minimal → dawn
// Dark Academia → night | Warm Artisan → sunset | AI-Native → city
```

---

## GPU Particle Systems

### Pattern 1: InstancedMesh Particles (up to 50K)

```tsx
function ParticleField({ count = 5000, dna }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      dummy.scale.setScalar(Math.random() * 0.05 + 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.position.y += Math.sin(clock.elapsedTime + i * 0.1) * 0.002;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={dna.accent} emissive={dna.glow} emissiveIntensity={0.5} />
    </instancedMesh>
  );
}
```

### Pattern 2: drei Sparkles (Quick Atmospheric)

```tsx
import { Sparkles } from '@react-three/drei';

<Sparkles count={200} scale={10} size={2} speed={0.3}
  color={dna.accent} opacity={0.5} />
```

---

## GLTF Optimization CLI Commands

```bash
# Install
npm install -g @gltf-transform/cli

# Full pipeline (recommended)
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp

# Step-by-step for fine control:
# 1. Validate
npx gltf-validator input.glb

# 2. Deduplicate + clean
gltf-transform dedup input.glb step1.glb
gltf-transform prune step1.glb step2.glb

# 3. Geometry compression
gltf-transform draco step2.glb step3.glb --method edgebreaker

# 4. Texture compression (choose based on target)
gltf-transform webp step3.glb final.glb --quality 80    # Broad compatibility
gltf-transform uastc step3.glb final.glb --level 2       # GPU-native (KTX2)

# 5. Resize oversized textures
gltf-transform resize final.glb final.glb --width 1024 --height 1024
```

**Target sizes after optimization:**

| Asset Type | Max File Size | Geometry Compression | Texture Format |
|-----------|--------------|---------------------|----------------|
| Hero model | 2-5 MB | Draco | KTX2 UASTC |
| Background prop | 500 KB - 1 MB | Meshopt | WebP |
| UI element/icon | < 500 KB | Low-poly (no compression needed) | None |
| Full scene total | < 10 MB | Mixed | Mixed |

---

## Texture Format Reference

| Format | Use Case | Compression | GPU-Native | Browser Support |
|--------|----------|-------------|-----------|-----------------|
| **PNG** | Alpha masks, UI elements | Lossless | No (CPU decode) | Universal |
| **WebP** | Photos, diffuse maps | Lossy 80-90% | No (CPU decode) | 97%+ |
| **AVIF** | Photos (better than WebP) | Lossy 50-80% | No (CPU decode) | 93%+ |
| **KTX2 ETC1S** | Diffuse, AO maps | Lossy, small | Yes (GPU direct) | Via Three.js loader |
| **KTX2 UASTC** | Normal maps, high-quality | Near-lossless | Yes (GPU direct) | Via Three.js loader |
| **EXR/HDR** | HDRI environment maps | Float precision | Special handling | Via Three.js loader |

**KTX2 loader setup in R3F:**
```tsx
import { useLoader } from '@react-three/fiber';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader';

// KTX2 textures require basis_transcoder WASM
// drei's useTexture handles this automatically for .ktx2 files
```

---

## AI-to-3D Asset Workflow

**Text → 3D Model → Optimized GLB → R3F Scene:**

```
1. Generate 3D model via Meshy AI or Tripo 3D (text/image → GLB)
   - Prompt: "[archetype_style] [object description] for web, low-poly optimized, PBR materials"
   - Export as GLB

2. Optimize with gltf-transform:
   gltf-transform optimize model.glb model-opt.glb --compress draco --texture-compress webp

3. Validate size budget:
   gltf-transform inspect model-opt.glb
   # Verify: triangles < 50K, textures < 2048px, file < 5MB

4. Load in R3F:
   const { scene } = useGLTF('/models/model-opt.glb')
   <primitive object={scene} />

5. Apply DNA colors at runtime:
   scene.traverse(child => {
     if (child.isMesh) {
       child.material.color.set(dna.primary);
       child.material.emissive.set(dna.glow);
     }
   });
```

**AI Texture Generation via Nano-Banana:**
```
1. mcp__nano-banana__generate_image({
     prompt: "Seamless PBR diffuse texture, [archetype_texture_modifier], tileable,
              dominant color [DNA primary hex], subtle variation. No seams, no objects."
   })
2. Use generated PNG as diffuse map on MeshStandardMaterial
3. For normal maps: mcp__nano-banana__edit_image({
     imagePath: "diffuse.png",
     prompt: "Convert to a normal map (blue-purple height map). Preserve surface detail."
   })
```

---

## WebGPU Forward Path

**Current status (April 2026):** WebGPU has ~95% browser support. Three.js r171+ includes production-ready WebGPU renderer.

**Two-line migration:**
```tsx
// Old (WebGL)
import * as THREE from 'three';
const renderer = new THREE.WebGLRenderer();

// New (WebGPU with automatic WebGL fallback)
import { WebGPURenderer } from 'three/webgpu';
const renderer = new WebGPURenderer(); // Falls back to WebGL automatically
```

**TSL (Three.js Shading Language) — replaces GLSL for cross-backend:**
```tsx
import { color, positionLocal, normalLocal, sin, timerLocal, float } from 'three/tsl';

// Node-based material (compiles to both GLSL and WGSL)
const material = new THREE.MeshPhysicalNodeMaterial();
material.colorNode = color(dna.primary);
material.positionNode = positionLocal.add(
  normalLocal.mul(sin(timerLocal().mul(2.0)).mul(float(0.1)))
);
```

**Recommendation:** New projects targeting Modern compat tier should use WebGPU renderer with auto-fallback. Existing GLSL shaders continue to work via the WebGL fallback path. TSL is optional but future-proof.

---

## drei Essential Helper Reference

| Helper | Purpose | When to Use |
|--------|---------|------------|
| `useGLTF` | Load GLTF/GLB with Draco support | Every model load |
| `Environment` | HDRI lighting (preset or custom) | Every scene |
| `Float` | Floating animation wrapper | Ambient motion |
| `ContactShadows` | Ground shadows without shadow maps | Product viewers |
| `Html` | HTML overlay in 3D space | Labels, tooltips |
| `Detailed` | LOD management | Models with multiple detail levels |
| `AdaptiveDpr` | Auto-adjust pixel ratio for performance | Performance-sensitive scenes |
| `useProgress` | Track loading state | Loading screens |
| `PresentationControls` | Drag-to-rotate with spring physics | Product viewers |
| `ScrollControls` | Scroll-driven camera/object animation | Scroll storytelling |
| `MeshTransmissionMaterial` | Glass/crystal with refraction | Glassmorphism, crystals |
| `MeshReflectorMaterial` | Reflective surfaces | Showrooms, luxury |
| `MeshDistortMaterial` | Noise-based mesh distortion | Organic blobs |
| `Sparkles` | Floating sparkle particles | Atmospheric effects |
| `Stars` | Star field background | Space scenes, Neon Noir |
| `Text3D` | Extruded 3D text | Hero typography, brand marks |
| `Center` | Auto-center geometry | Model alignment |
| `Bounds` | Auto-fit camera to scene | Product viewers |
| `CameraControls` | Advanced camera controls | Interactive scenes |

---

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
