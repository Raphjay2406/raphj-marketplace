---
name: "3d-scene-composer"
description: "Full R3F scene composition beyond hero marks: camera rigs, lighting setups per archetype, scene graphs with LOD, progressive enhancement. Not just sparkly props — narrative 3D sequences."
tier: "domain"
triggers: "r3f scene, three.js scene, 3d sequence, scene composer, 3d narrative, scene graph"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Section needs more than a single spinning hero — full environment, camera choreography, or interactive world.
- WebGPU-capable target audience or WebGL progressive fallback acceptable.
- Story beat warrants 3D (spatial metaphor, product exploration, immersive peak).

### When NOT to Use

- Single logo/product hero — use `3dsvg` preset.
- Mobile-first where 3D blows perf budget — use video fallback.
- Audiences with reduced-motion or low-bandwidth — always static SVG fallback.

## Layer 2: Example

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { LightingRig } from '@/3d/lighting';

export function ProductScene({ archetype }: { archetype: Archetype }) {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 1, 4], fov: 35 }}>
      <LightingRig archetype={archetype} />
      <ProductModel />
      <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2} />
      <Environment preset={archetype === 'luxury' ? 'studio' : 'city'} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
```

## Layer 3: Integration Context

- Lighting rigs keyed by archetype — `seeds/archetype-lighting-rigs.json` (v3.5.5).
- LOD via `<Detailed>` drei helper — swap meshes by camera distance.
- Perf budget: ≤ 3 instanced scenes per page, ≤ 100k triangles visible, ≤ 6 lights.
- Asset pipeline: Draco + Meshopt + KTX2 via `gltf-authoring-pipeline`.
- Progressive: WebGPU when available, WebGL2 fallback, `<img>` static fallback for `reduced-motion`.

## Layer 4: Anti-Patterns

- Shipping unoptimized glTF — bloats LCP, crashes mobile.
- No fallback for `prefers-reduced-motion` — fails a11y gate.
- Auto-rotating scenes longer than 10s — vestibular trigger.
- Forgetting `dpr={[1, 2]}` cap — high-DPR displays melt GPU.
