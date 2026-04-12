---
name: webxr-ar
description: AR product preview + scene scanning + hit testing + occlusion via WebXR + iOS Quick Look (USDZ) + Android Scene Viewer (GLTF). Falls back to 3D orbit preview on non-AR devices.
tier: domain
triggers: webxr, ar, augmented-reality, usdz, scene-viewer, react-three-xr
version: 0.1.0
---

# WebXR + AR

## Layer 1 — When to use

- Product preview (place chair in room)
- Brand activation (AR business card, interactive poster)
- Measurement tools (measure objects via phone camera)
- Showcase (3D logo in your space)

Skip: static sites, blog posts, UI-heavy dashboards.

## Layer 2 — Platform matrix

| Platform | Tech | Fallback |
|---|---|---|
| iOS Safari | Quick Look USDZ | `<model-viewer>` 3D orbit |
| Android Chrome | Scene Viewer (intent) via GLTF | `<model-viewer>` 3D orbit |
| Desktop | WebXR if headset; else `<model-viewer>` | Same |
| AR headsets (Vision Pro, Quest) | WebXR | N/A |

## Layer 3 — Universal AR button via `<model-viewer>`

```html
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer
  src="product.glb"
  ios-src="product.usdz"
  ar
  ar-modes="scene-viewer webxr quick-look"
  camera-controls
  touch-action="pan-y"
  poster="product-poster.webp"
  alt="Product 3D view"
>
  <button slot="ar-button">View in your space</button>
</model-viewer>
```

Handles iOS + Android + desktop fallback with zero JS.

## Layer 4 — WebXR explicit (for custom sessions)

```tsx
import { XR, createXRStore } from '@react-three/xr';
import { Canvas } from '@react-three/fiber';

const store = createXRStore();

function App() {
  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
```

## Layer 5 — USDZ generation

Pipeline: glTF (from meshy-mcp or 3d-procedural) → USDZ via `usdz-convert` (Apple) or `gltf-transform` (open source):

```bash
gltf-transform meshopt product.glb product-opt.glb
usdz-convert product-opt.glb product.usdz
```

Asset manifest entry tracks both formats.

## Layer 6 — Hit testing (WebXR)

```ts
const session = await navigator.xr.requestSession('immersive-ar', {
  requiredFeatures: ['hit-test'],
});

const viewerSpace = await session.requestReferenceSpace('viewer');
const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

session.requestAnimationFrame((time, frame) => {
  const hits = frame.getHitTestResults(hitTestSource);
  if (hits.length > 0) {
    // Place object at hit point
  }
});
```

## Layer 7 — Integration

- Asset pipeline: meshy-mcp → glTF → glTF-optimized → USDZ
- `/gen:assets 3d product-ar` generates all three formats + `<model-viewer>` component
- Manifest records glb + usdz paths + cache_key
- Perf budget: glTF ≤ 2MB meshopt+Draco; USDZ ≤ 5MB (Apple review threshold)

## Layer 8 — Anti-patterns

- ❌ WebXR direct on mobile web — broken on iOS; use Quick Look
- ❌ USDZ without ios-src in model-viewer — iOS AR button does nothing
- ❌ Giant GLB (>10MB) — mobile data kills it
- ❌ No poster image — blocking white square while 3D loads
- ❌ AR as primary flow — always keep 2D fallback
