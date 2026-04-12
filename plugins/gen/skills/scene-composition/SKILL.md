---
name: scene-composition
description: Multi-object 3D scene graphs with camera choreography, lighting rigs per archetype, and HDRi library integration. Composition templates per beat (HOOK centerpiece, PEAK tableau, BREATHE solo-object). Used by /gen:assets 3d scene.
tier: domain
triggers: scene-composition, three-js, camera, lighting-rig, hdri, 3d-scene, scene-graph
version: 0.1.0-provisional
---

# Scene Composition

Opinionated 3D scene patterns per archetype + beat. Turns a collection of models into a composed image.

## Layer 1 — When to use

`/gen:assets 3d scene` for any 3D output beyond a single glyph. Any hero or section background that uses a scene (not just a wordmark) runs through here.

## Layer 2 — Templates per beat

### HOOK — centerpiece

- 1 hero object centered, Z=0
- Camera dolly-in from 2× object bounds → 1.5× over 4s
- Key light 45° front-left, rim light back-right (3:1)
- HDRi: soft studio blur (archetype HDRi subset)

### PEAK — tableau

- 3–5 objects arranged on horizon line
- Camera static mid-shot, 35mm equivalent
- Dramatic key + volumetric light (if archetype permits)
- HDRi: archetype-specific (`studio`, `sunset`, `neon-city`, etc.)

### BREATHE — solo-object

- 1 object, off-center (rule of thirds)
- Camera static, slight handheld drift via subtle orbit animation
- Soft diffuse light, low contrast
- HDRi: overcast or atmospheric

### BUILD — progressive reveal

- Objects appear sequentially via ScrollTrigger
- Camera orbit around arrangement
- Per-object spotlight fade-in
- HDRi: neutral

### CLOSE — reflective

- Objects on reflective plane
- Low camera angle
- Warm rim + key
- HDRi: gradient (sunset or dawn)

## Layer 3 — Archetype lighting rigs

### Brutalist

```js
// Hard single key, harsh shadows
ambientIntensity: 0.05
directional: { intensity: 2.5, position: [5,10,5], castShadow: true, shadow.radius: 0 }
hdri: 'studio-hard'
```

### Ethereal

```js
// Soft omnidirectional
ambientIntensity: 0.4
hemisphere: { skyColor: '#e0f0ff', groundColor: '#d8d0e8', intensity: 0.6 }
directional: { intensity: 0.5, position: [5,10,5], shadow.radius: 16 }
hdri: 'atmospheric-soft'
```

### Cyberpunk-HUD

```js
// Neon rim + moody ambient
ambientIntensity: 0.1
point: [
  { color: '#ff00ff', intensity: 5, position: [-5,2,-3] },
  { color: '#00ffff', intensity: 5, position: [5,2,-3] }
]
hdri: 'neon-night'
```

Full table at `seeds/archetype-lighting-rigs.json` (25 archetypes).

## Layer 4 — HDRi library

`public/assets/hdri/` populated on demand from Poly Haven CC0 subset:

- `studio-hard`, `studio-soft` (Neo-Corporate, Brutalist)
- `atmospheric-soft`, `overcast` (Ethereal, Editorial)
- `sunset`, `dawn` (Luxury, Warm Artisan)
- `neon-night`, `lab` (Cyberpunk-HUD, AI-Native, Data-Dense)
- `spatial-white` (Spatial-VisionOS)
- (archetype → preferred HDRi mapping in seeds/archetype-hdri-map.json)

All .hdr files < 4MB (compressed KTX2 variants also emitted).

## Layer 5 — Integration

- **Builder spawn**: 3D specialist receives scene template + archetype lighting rig + HDRi in spawn prompt.
- **Perf budgets**: PEAK scene ≤ 5 draw calls; HOOK ≤ 3; BREATHE ≤ 2.
- **Asset manifest**: scene written as glTF with embedded lights + HDRi reference.
- **Motion health**: camera animation feeds into motion-health concurrent-animation budget.

## Layer 6 — Anti-patterns

- ❌ Using HDRi without tone-mapping — blowouts and crushed darks.
- ❌ 10-object scene on mobile — perf budget violated; always gate scene complexity by breakpoint.
- ❌ Universal "nice-looking" lighting across archetypes — defeats archetype specificity.
- ❌ Camera animation that fights scroll direction — induces motion sickness.
- ❌ Forgetting shadow-map resolution tuning — mobile ships 4K shadowmaps; crash.
