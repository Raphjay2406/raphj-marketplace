---
name: "r3f-physics-rapier"
description: "Physics in R3F via Rapier (WASM). Rigid bodies, colliders, constraints, soft-bodies. Deterministic, sub-1ms step cost per ~100 bodies."
tier: "domain"
triggers: "rapier, r3f physics, three.js physics, rigidbody, physics simulation, 3d physics"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Interactive 3D where gravity, collision, or constraints express brand personality (playful, cyberpunk, gaming archetypes).
- Tactile product demos — stacking, tossing, balancing.

### When NOT to Use

- Static product showcase — pure R3F suffices.
- Mobile-first with tight perf budget — Rapier WASM adds ~300KB.

## Layer 2: Example

```tsx
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export function BouncingLogos() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      {items.map((item, i) => (
        <RigidBody key={i} colliders="cuboid" restitution={0.4}>
          <mesh position={[i * 1.5 - 3, 5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="var(--color-primary)" />
          </mesh>
        </RigidBody>
      ))}
      <CuboidCollider args={[10, 0.5, 10]} position={[0, -1, 0]} />
    </Physics>
  );
}
```

## Layer 3: Integration Context

- Pair with `3d-scene-composer` for environment.
- Perf budget: ≤ 50 active bodies per scene on mobile; ≤ 200 on desktop.
- Determinism: fixed-timestep simulation (`timeStep={1/60}`) for replay-able scenes.
- Accessibility: physics scenes need static screenshot fallback for reduced-motion.

## Layer 4: Anti-Patterns

- Running physics off-screen — wasteful; pause when `IntersectionObserver` says inactive.
- Using as decoration without interactivity — confuses user expectations.
- Unbounded world — add floor/walls or bodies escape and framerate suffers.
