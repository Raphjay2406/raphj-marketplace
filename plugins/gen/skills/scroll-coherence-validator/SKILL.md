---
name: "scroll-coherence-validator"
description: "Hard gate #6 — enforces single PersistentCanvas for cinematic/immersive 3D intensity; prevents multi-Canvas scroll incoherence"
tier: "domain"
triggers: "cinematic intensity, immersive intensity, PersistentCanvas, scroll-driven 3D, canvas coherence, hard gate 6"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- DNA `3d_intensity` is `cinematic` or `immersive` — enforce single-canvas constraint before build and at audit
- Running `/gen:audit` on a project with scroll-driven 3D scenes — prevents conflicting render contexts
- Post-build validation in CI/CD pipeline — catches per-section Canvas instances that fragment the scroll timeline

### When NOT to Use

- `3d_intensity` is `accent` or `none` — validator skips automatically (`skipped: true`)
- Projects with no `<Canvas>` or 3D elements — gate is irrelevant

### Decision Tree

- If `intensity === "cinematic"` or `"immersive"` → run `runScrollCoherence({ files, intensity })`
- If `persistent === 0` and `canvases > 1` → fail with multiple-canvas message
- If `persistent === 0` → fail with missing-PersistentCanvas message
- If `canvases > persistent` → fail with multiple-canvas message
- Otherwise → pass

### Pipeline Connection

- **Referenced by:** Quality Reviewer agent during `/gen:audit`
- **Consumed at:** `/gen:audit` workflow step (hard gate phase), `/gen:ship-check` pre-deploy gate
- **Registered in:** `.claude-plugin/hooks/dna-compliance-check.sh` (Hard gate #6)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Correct Single PersistentCanvas in Root Layout

```tsx
// app/layout.tsx — cinematic intensity: ONE canvas wraps the entire app
import { PersistentCanvas, SceneDirector } from "@genorah/canvas-runtime";
import { choreography } from "@/lib/scene-choreography";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PersistentCanvas intensity="cinematic">
          <SceneDirector choreography={choreography} />
        </PersistentCanvas>
        {children}
      </body>
    </html>
  );
}
```

#### Pattern: Validator Invocation in Audit Script

```javascript
import { runScrollCoherence } from "./scripts/validators/scroll-coherence.mjs";
import { readFile } from "fs/promises";
import { glob } from "glob";

const paths = await glob("app/**/*.tsx");
const files = {};
for (const p of paths) files[p] = await readFile(p, "utf8");

const result = await runScrollCoherence({ files, intensity: "cinematic" });
// { pass: true } or { pass: false, reason: "..." }
if (!result.pass) throw new Error(`HARD-GATE #6: ${result.reason}`);
```

### Reference Sites

- **Bruno Simon Portfolio** (bruno-simon.com) — single persistent WebGL canvas across all sections; scroll position drives scene camera, no per-section context switches
- **Active Theory** (activetheory.net) — one render loop governs the full page scroll experience; section transitions are choreographed via scene director, not separate canvases

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `3d_intensity` | Primary gate trigger — `cinematic` or `immersive` activates enforcement |
| `motion.scroll_driver` | Informs scene choreography shape passed to `<SceneDirector>` |
| `signature_element` | Often the persistent canvas scene; validator ensures it is not fragmented |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Kinetic | PersistentCanvas handles full-viewport scroll-scrubbed animations |
| AI-Native | Canvas hosts particle field and inference visualization across sections |
| Neon Noir | Single canvas maintains WebGL glow/bloom post-processing for the whole scroll |

### Pipeline Stage

- **Input from:** DNA `3d_intensity` field + all `app/**/*.tsx` / `src/**/*.tsx` source files
- **Output to:** Gate report in `.planning/genorah/audit/hard-gates.json` — `scroll_coherence` field

### Related Skills

- `cinematic-motion` — defines the choreography API that `<SceneDirector>` consumes
- `three-d-webgl-effects` — provides the WebGL scene primitives rendered inside PersistentCanvas
- `performance-guardian` — PersistentCanvas budget: single canvas ≤ 280 KB JS gzip (cinematic)

## Layer 4: Anti-Patterns

### Anti-Pattern: Per-Section Canvas

**What goes wrong:** Each section imports `<Canvas>` from `@react-three/fiber` independently. Each creates its own WebGL context — browsers cap contexts at 8–16. Scroll coherence breaks because each canvas has its own render loop and timeline. GPU memory spikes and context-lost errors occur on lower-end devices.

**Instead:** Place one `<PersistentCanvas>` in the root layout. Each section registers its scene objects via the `SceneDirector` choreography API. The single render loop drives all scroll-position transitions.

### Anti-Pattern: Forgetting PersistentCanvas on cinematic Intensity

**What goes wrong:** Builder creates beautiful 3D sections but never wraps in `<PersistentCanvas>`, so scroll-driven scene transitions between sections are impossible. Each section's animation fires independently, destroying the cinematic narrative arc.

**Instead:** When DNA `3d_intensity: cinematic`, `<PersistentCanvas>` in the root layout is mandatory. Gate #6 blocks the commit until it is present.

### Anti-Pattern: Using Canvas for 2D Overlays Alongside PersistentCanvas

**What goes wrong:** Separate 2D `<canvas>` elements (confetti, particle overlays) are added alongside the PersistentCanvas, raising the `canvases > persistent` count and triggering the gate falsely — or creating real context contention.

**Instead:** Route all canvas-based effects through the PersistentCanvas compositor. For lightweight 2D effects, use CSS `@keyframes` or a `<div>` overlay with `mix-blend-mode` — zero WebGL context cost.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| `persistent_canvas_count` | 1 | 1 | count | HARD — reject if 0 or >1 when intensity=cinematic/immersive |
| `canvas_instances_total` | 0 | 1 | count | HARD — reject if >persistent when intensity=cinematic/immersive |
