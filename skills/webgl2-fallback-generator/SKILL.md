---
name: "webgl2-fallback-generator"
description: "For every WebGPU compute effect, emit an equivalent GLSL 3.0 fragment/vertex shader via Three.js ShaderMaterial — conversion patterns and parity checklist"
tier: "domain"
triggers: "WebGL2 fallback, GLSL fallback, ShaderMaterial, WebGPU fallback, GLSL 3.0, Three.js shader, WebGL2 parity"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Always paired with `webgpu-compute-shaders` — every compute effect needs a WebGL2 counterpart.
- webgl2-fallback-author worker is generating GLSL for a scene that may run on browsers without WebGPU.
- scene-director has determined `intensity == "cinematic" | "immersive"` and dispatched webgpu-shader-author.

### When NOT to Use

- Effects that are already fragment-shader-based in WebGPU — they translate 1:1 to WebGL2 without this skill.
- `3d_intensity == "none" | "accent"` — no 3D context at all.
- Simple Three.js MeshStandardMaterial usage with no custom shader — use built-in materials directly.

### Decision Tree

- If WebGPU compute uses ping-pong storage buffers → simulate via render-to-texture ping-pong in WebGL2.
- If WebGPU compute is per-vertex (hair, cloth) → approximate with vertex shader displacement in Three.js.
- If compute is purely cosmetic particles → approximate with CPU-driven instanced mesh as final fallback.

### Pipeline Connection

- **Referenced by:** webgl2-fallback-author worker, scene-director (fallback path)
- **Consumed at:** `/gen:build` Wave 2+ — GLSL files live alongside WGSL in `src/shaders/`; runtime switches via capability probe result

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Feature-Gated ShaderMaterial

```ts
// lib/capabilityProbe.ts
export async function probeCapabilities() {
  const webgpu = !!navigator.gpu && !!(await navigator.gpu.requestAdapter())
  const webgl2 = (() => {
    try {
      const c = document.createElement('canvas')
      return !!c.getContext('webgl2')
    } catch { return false }
  })()
  return { webgpu, webgl2 }
}
```

```tsx
// components/canvas/ParticleEffect.tsx
import { useEffect, useState } from 'react'
import { probeCapabilities } from '@/lib/capabilityProbe'
import { WebGPUParticles } from './WebGPUParticles'
import { WebGL2Particles } from './WebGL2Particles'
import { FallbackHero } from './FallbackHero'

export function ParticleEffect() {
  const [cap, setCap] = useState<'webgpu' | 'webgl2' | 'none' | null>(null)

  useEffect(() => {
    probeCapabilities().then(({ webgpu, webgl2 }) => {
      setCap(webgpu ? 'webgpu' : webgl2 ? 'webgl2' : 'none')
    })
  }, [])

  if (cap === null) return null          // probing
  if (cap === 'webgpu') return <WebGPUParticles />
  if (cap === 'webgl2') return <WebGL2Particles />
  return <FallbackHero data-canvas-fallback />
}
```

#### Pattern: Three.js ShaderMaterial Equivalent

```ts
// shaders/particles.webgl2.ts — GLSL 3.0 equivalent of WGSL particle sim
import * as THREE from 'three'

const vertexShader = /* glsl */`
  precision highp float;

  attribute vec3  velocity;
  attribute float life;

  uniform float uTime;
  uniform vec3  uPrimary;   // DNA primary token

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position + velocity * uTime;
    vColor   = mix(uPrimary, vec3(1.0), life);
    vAlpha   = life;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 3.0 * (1.0 / -mvPosition.z);
  }
`

const fragmentShader = /* glsl */`
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * (1.0 - d * 2.0));
  }
`

export function createParticleMaterial(primaryColor: THREE.Color) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime:    { value: 0 },
      uPrimary: { value: primaryColor },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
```

#### Pattern: Ping-Pong Render Target (Fluid Simulation Fallback)

```ts
// lib/pingPong.ts — replaces WebGPU storage buffer ping-pong
import * as THREE from 'three'

export function createPingPong(size: number) {
  const opts: THREE.RenderTargetOptions = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  }
  return [
    new THREE.WebGLRenderTarget(size, size, opts),
    new THREE.WebGLRenderTarget(size, size, opts),
  ] as const
}

// In animation loop: swap read/write each frame
let readIdx = 0
export function swapTargets(targets: ReturnType<typeof createPingPong>) {
  readIdx = 1 - readIdx
  return { read: targets[readIdx], write: targets[1 - readIdx] }
}
```

### Reference Sites

- **Three.js ShaderMaterial docs** (threejs.org/docs/#api/en/materials/ShaderMaterial) — canonical uniform binding, attribute setup, GLSL 3.0 syntax requirements.
- **Shadertoy GLSL references** (shadertoy.com) — GLSL fragment shader patterns ported to Three.js; extensive ping-pong texture examples.
- **Bruno Simon portfolio** (bruno-simon.com) — Three.js custom shaders with graceful capability fallback; static image shown on low-end devices.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `primary` | `uPrimary` uniform in vertex/fragment shaders — base effect color |
| `accent` | `uAccent` uniform — secondary color for gradient effects |
| `glow` | Controls `AdditiveBlending` intensity or emission uniform |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Kinetic | High instance count (50k), fast uniform updates each frame |
| Ethereal | Low instance count (5k), soft additive blending, slow drift |
| Neon Noir | `AdditiveBlending` + bloom post-process applied to WebGL2 particles |

### Pipeline Stage

- **Input from:** webgpu-shader-author fallback metadata (effect class, uniform names, buffer layout), DESIGN-DNA.md
- **Output to:** GLSL shader files in `src/shaders/*.webgl2.ts`; consumed by R3F scene components via capability probe result

### Related Skills

- `webgpu-compute-shaders` — the WebGPU counterpart; this skill must maintain parity with it
- `persistent-canvas-pattern` — WebGL2 renderer still runs inside the single canvas context
- `cinematic-motion` — timing integration; uniforms updated on the same frame callback as WebGPU path

## Layer 4: Anti-Patterns

### Anti-Pattern: Different Visual Result Between WebGPU and WebGL2 Paths

**What goes wrong:** WebGPU path looks polished; WebGL2 fallback looks obviously inferior. Users on Safari/Firefox see a broken experience. Quality gate penalizes inconsistent polish across browsers.
**Instead:** Design the WebGPU effect with a plausible WebGL2 approximation in mind from the start. Accept visual simplification (fewer particles, no ping-pong) but maintain the same color palette, motion character, and density impression.

### Anti-Pattern: Skipping Feature Detection

**What goes wrong:** Unconditionally importing WebGPU shader code crashes on Safari/Firefox with a parse error, not a graceful fallback.
**Instead:** Always gate behind `probeCapabilities()` before importing or instantiating any WebGPU code. Use dynamic `import()` inside the `if (cap === 'webgpu')` branch to keep the WebGPU bundle tree-shaken from fallback builds.

### Anti-Pattern: Using FloatType Textures Without Extension Check

**What goes wrong:** `THREE.FloatType` render targets for ping-pong fluid simulation fail silently on some WebGL2 implementations that don't support `OES_texture_float_linear`.
**Instead:** Check `renderer.extensions.get('OES_texture_float_linear')` before creating float render targets. Fall back to `HalfFloatType` if unavailable, or skip the ping-pong effect entirely and use a static displacement map.

### Anti-Pattern: Updating Uniforms Outside the Render Loop

**What goes wrong:** Setting `material.uniforms.uTime.value` inside a React effect or event handler instead of the R3F `useFrame` callback causes stale values and missed frames.
**Instead:** Always update uniforms inside `useFrame((state) => { material.uniforms.uTime.value = state.clock.elapsedTime })` — this runs synchronously before each render.
