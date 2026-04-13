---
name: "webgpu-compute-shaders"
description: "WGSL compute pipeline patterns for hair, foliage, fluid, and particle effects — device request, buffer layout, dispatch, mandatory WebGL2 fallback branch"
tier: "domain"
triggers: "WebGPU, WGSL, compute shader, GPUDevice, compute pipeline, hair simulation, foliage, fluid simulation, GPU compute"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- `3d_intensity == "cinematic" | "immersive"` and the effect class (hair, foliage, fluid, particles) cannot be achieved acceptably in fragment shaders alone.
- webgpu-shader-author worker is writing shaders for a scene that has confirmed WebGPU device availability.
- Performance budget allows: WebGPU compute is justified only when the CPU/JS equivalent would exceed 2ms per frame.

### When NOT to Use

- `3d_intensity == "none" | "accent"` — use CSS or lightweight GSAP instead.
- Device probe returns no WebGPU support — hand off to `webgl2-fallback-generator` immediately.
- Simple vertex displacement that can be done in a Three.js vertex shader — no compute needed.

### Decision Tree

- If effect requires read-write buffer ping-pong (hair, fluid), use compute pipeline with storage buffers.
- If effect is read-only per-frame (procedural textures), use fragment shader instead — simpler and broadly supported.
- Always pair every compute effect with a WebGL2 fallback branch (see `webgl2-fallback-generator`).

### Pipeline Connection

- **Referenced by:** webgpu-shader-author worker during Wave 2+ 3D section builds
- **Consumed at:** `/gen:build` Wave 2+ — shader files written to `src/shaders/`, imported by R3F scene components

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Device Request + Feature Detection

```ts
// lib/webgpu.ts
export async function requestWebGPUDevice(): Promise<GPUDevice | null> {
  if (!navigator.gpu) return null

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance',
  })
  if (!adapter) return null

  // Check for required features before requesting device
  const requiredFeatures: GPUFeatureName[] = []
  if (adapter.features.has('float32-filterable')) {
    requiredFeatures.push('float32-filterable')
  }

  return adapter.requestDevice({ requiredFeatures })
}
```

#### Pattern: WGSL Compute Shader — Particle Simulation

```wgsl
// shaders/particles.wgsl
struct Particle {
  position: vec3<f32>,
  velocity: vec3<f32>,
  life:     f32,
  _pad:     f32,
}

struct Uniforms {
  delta_time: f32,
  primary:    vec3<f32>,  // DNA primary color
  accent:     vec3<f32>,  // DNA accent color
  time:       f32,
}

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform>             uniforms:  Uniforms;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= arrayLength(&particles)) { return; }

  var p = particles[i];
  p.velocity.y -= 9.8 * uniforms.delta_time;
  p.position   += p.velocity * uniforms.delta_time;
  p.life       -= uniforms.delta_time;

  // Respawn dead particles at origin
  if (p.life <= 0.0) {
    p.position = vec3<f32>(0.0);
    p.velocity = vec3<f32>(
      (fract(sin(f32(i) * 127.1) * 43758.5) - 0.5) * 4.0,
      4.0 + fract(sin(f32(i) * 311.7) * 43758.5) * 2.0,
      (fract(sin(f32(i) * 74.2)  * 43758.5) - 0.5) * 4.0,
    );
    p.life = 2.0 + fract(sin(f32(i) * 19.3) * 43758.5);
  }

  particles[i] = p;
}
```

#### Pattern: Compute Pass Dispatch

```ts
// lib/computePass.ts
export function dispatchComputePass(
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  bindGroup: GPUBindGroup,
  particleCount: number,
) {
  const encoder = device.createCommandEncoder()
  const pass = encoder.beginComputePass()

  pass.setPipeline(pipeline)
  pass.setBindGroup(0, bindGroup)
  // Workgroup size is 64 — ceil divide
  pass.dispatchWorkgroups(Math.ceil(particleCount / 64))
  pass.end()

  device.queue.submit([encoder.finish()])
}
```

### Reference Sites

- **Google Chrome WebGPU Samples** (webgpu.github.io/webgpu-samples) — canonical compute pipeline examples including particle systems and image processing.
- **Three.js WebGPU examples** (threejs.org/examples/?q=webgpu) — Three.js WebGPURenderer integration patterns, storage buffer usage.
- **Orillusion** (orillusion.com) — production WebGPU scene with hair simulation; demonstrates ping-pong buffer pattern for physics.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `primary` | Injected as `vec3<f32>` uniform — particle/effect base color |
| `accent` | Secondary color uniform for gradient or dual-color effects |
| `glow` | Controls emission intensity in fragment stage of the render pipeline |
| `3d_intensity` | Gates whether compute is used at all |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Kinetic | High particle count (100k+), fast velocity, tight workgroup dispatch |
| Ethereal | Low particle count (10k), slow drift, wide FOV spread |
| Neon Noir | Particle color = `glow` token; bloom post-process amplifies effect |

### Pipeline Stage

- **Input from:** scene-director ShaderSpec (effect class, particle count, DNA tokens), SCENE-CHOREOGRAPHY.json
- **Output to:** WGSL shader files in `src/shaders/`; fallback metadata consumed by `webgl2-fallback-generator`

### Related Skills

- `webgl2-fallback-generator` — mandatory companion; every compute effect needs a GLSL equivalent
- `persistent-canvas-pattern` — GPU device lives inside the single canvas context
- `cinematic-motion` — timing integration; compute uniforms updated per Theatre.js frame callback

## Layer 4: Anti-Patterns

### Anti-Pattern: No WebGL2 Fallback Branch

**What goes wrong:** ~15% of desktop and ~30% of mobile sessions have no WebGPU support as of 2026. Shipping compute-only effects leaves those users with blank or broken sections.
**Instead:** Always emit fallback metadata alongside WGSL output. Dispatch `webgl2-fallback-author` in parallel with every compute shader. Gate at runtime: `const device = await requestWebGPUDevice(); if (!device) return <FallbackHero />`.

### Anti-Pattern: Workgroup Size Mismatch

**What goes wrong:** Dispatching `Math.ceil(count / 256)` workgroups for a shader compiled with `@workgroup_size(64)` wastes GPU threads or under-dispatches, causing missing particles/artifacts.
**Instead:** Keep workgroup size constant at 64 (universally supported) and compute dispatch count as `Math.ceil(count / 64)`. Match the WGSL `@workgroup_size` exactly.

### Anti-Pattern: Creating Pipeline Every Frame

**What goes wrong:** `device.createComputePipeline()` is expensive (~5–50ms). Calling it in an animation loop stalls rendering.
**Instead:** Create the pipeline once at scene init, cache it in a module-level ref. Only recreate if the shader source changes (development hot-reload only).

### Anti-Pattern: Blocking on Pipeline Creation

**What goes wrong:** `createComputePipeline()` (sync) can block the main thread on complex shaders. Users see a frozen frame during scene init.
**Instead:** Use `createComputePipelineAsync()` — it returns a Promise and compiles on a worker thread, keeping the main thread free for the initial render.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| workgroup_size | 1 | 256 | threads | HARD — reject if > 256 (GPU limit) |
| particle_count | 1000 | 500000 | particles | SOFT — warn if > 100k on mobile |
| uniform_buffer_size | 0 | 65536 | bytes | HARD — WebGPU uniform buffer limit |
