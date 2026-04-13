# v4 M2 — Cinematic Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the persistent single-canvas 3D pipeline (R3F v9 + Theatre.js + GSAP ScrollTrigger + Lenis), 5-tier 3D intensity system, 6th hard gate (Scroll Coherence), performance budget enforcement for cinematic/immersive tiers, and 17 new WebGPU-native archetypes.

**Architecture:** A new `@genorah/canvas-runtime` npm package that projects install. `scene-director` (M1 scaffold) grows into a full director emitting `SCENE-CHOREOGRAPHY.json` consumed by all section workers. Section workers auto-detect the project's `3d_intensity` and adapt. Performance budgets enforced by new validator skills and the `perf-polisher` worker.

**Tech Stack:** R3F v9, `@react-three/drei` 10, `@react-three/postprocessing` 3, Theatre.js 0.8, GSAP 4 + ScrollTrigger, Lenis 1.2, WebGPU types via `@webgpu/types` 0.1.50, WGSL for compute shaders.

**Scope:** 4 weeks. 38 tasks. 5 new skills, 1 new package, 8 worker bodies (3D domain), 17 new archetypes, 1 new hard gate validator, cinematic demo project.

**Milestone completion criteria:**
1. `@genorah/canvas-runtime` published to the workspace; section workers import from it
2. 17 archetype DNA presets exist under `skills/design-archetypes/archetypes/`
3. Cinematic reference project builds with LCP ≤ 2.4s, JS ≤ 280KB gz, CLS ≤ 0.05
4. Scroll Coherence hard gate blocks builds that remount `<Canvas>` between sections
5. WebGPU+WebGL2 dual-path renders proven in the demo
6. 60 new M2 tests pass (~total 195)

---

## File Structure

### New files
- `packages/canvas-runtime/package.json`
- `packages/canvas-runtime/tsconfig.json`
- `packages/canvas-runtime/src/PersistentCanvas.tsx`
- `packages/canvas-runtime/src/SceneDirector.tsx`
- `packages/canvas-runtime/src/useCameraBookmark.ts`
- `packages/canvas-runtime/src/useScrollTimeline.ts`
- `packages/canvas-runtime/src/CapabilityProbe.ts`
- `packages/canvas-runtime/src/FallbackHero.tsx`
- `packages/canvas-runtime/src/webgpu/ComputeShaderHost.tsx`
- `packages/canvas-runtime/src/webgl2/Fallback.tsx`
- `packages/canvas-runtime/src/schemas/scene-choreography.schema.ts`
- `packages/canvas-runtime/tests/*.test.ts` (8 test files)
- `skills/persistent-canvas-pattern/SKILL.md`
- `skills/theatre-choreography/SKILL.md`
- `skills/webgpu-compute-shaders/SKILL.md`
- `skills/webgl2-fallback-generator/SKILL.md`
- `skills/scroll-coherence-validator/SKILL.md`
- `scripts/validators/scroll-coherence.mjs`
- `scripts/validators/perf-budget.mjs`
- `skills/design-archetypes/archetypes/cinematic-3d/archetype.json` (and 16 more)
- `skills/design-archetypes/archetypes/cinematic-3d/reference-sites.md` (and 16 more)
- `skills/design-archetypes/archetypes/cinematic-3d/tension-zones.md` (and 16 more)
- `.planning/genorah/demo-cinematic/` (reference demo)

### Modified files
- `agents/directors/scene-director.md` — full body
- `agents/workers/3d/*.md` — all 8 get full bodies
- `agents/workers/motion/*.md` — all 6 get full bodies
- `packages/protocol/src/envelope.ts` — add `SceneGraph` type export
- `.claude-plugin/plugin.json` — 4.0.0-alpha.2
- `.claude-plugin/hooks/dna-compliance-check.sh` — add 6th hard gate hook
- `CLAUDE.md` — note M2 shipped

---

## Task 1: Add `packages/canvas-runtime` workspace

**Files:**
- Create: `packages/canvas-runtime/package.json`
- Create: `packages/canvas-runtime/tsconfig.json`

- [ ] **Step 1: Create package manifest**

`packages/canvas-runtime/package.json`:

```json
{
  "name": "@genorah/canvas-runtime",
  "version": "4.0.0-alpha.2",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "three": "^0.170.0"
  },
  "dependencies": {
    "@react-three/fiber": "^9.0.0",
    "@react-three/drei": "^10.0.0",
    "@react-three/postprocessing": "^3.0.0",
    "@theatre/core": "^0.8.2",
    "@theatre/studio": "^0.8.2",
    "gsap": "^4.0.0",
    "lenis": "^1.2.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@webgpu/types": "^0.1.50",
    "@types/three": "^0.170.0",
    "typescript": "^5.6.2",
    "vitest": "^2.1.4",
    "@testing-library/react": "^16.0.0",
    "happy-dom": "^15.0.0"
  },
  "scripts": {
    "build": "tsc -p .",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: TypeScript config (identical template to protocol, adds `"jsx": "react-jsx"`)**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "types": ["@webgpu/types"]
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Install**

Run: `cd packages/canvas-runtime && npm install`

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/package.json packages/canvas-runtime/tsconfig.json package.json package-lock.json
git commit -m "feat(v4-m2): add @genorah/canvas-runtime workspace"
```

---

## Task 2: SceneChoreography schema (test-first)

**Files:**
- Create: `packages/canvas-runtime/src/schemas/scene-choreography.schema.ts`
- Create: `packages/canvas-runtime/tests/choreography-schema.test.ts`

- [ ] **Step 1: Write test**

```typescript
import { describe, it, expect } from "vitest";
import { SceneChoreographySchema } from "../src/schemas/scene-choreography.schema.js";

describe("SceneChoreography", () => {
  it("accepts a minimal graph with 1 bookmark", () => {
    const g = {
      schema_version: "4.0.0",
      project_id: "demo",
      intensity: "cinematic",
      bookmarks: [
        { id: "hero", scroll_anchor: "#hero", camera: { pos: [0,0,5], look_at: [0,0,0] }, morphs: {} }
      ],
      meshes: [],
      lights: [{ type: "directional", intensity: 1, pos: [3,3,3] }]
    };
    expect(() => SceneChoreographySchema.parse(g)).not.toThrow();
  });

  it("rejects intensity outside 5-tier enum", () => {
    const bad = { schema_version: "4.0.0", project_id: "x", intensity: "max", bookmarks: [], meshes: [], lights: [] };
    expect(() => SceneChoreographySchema.parse(bad)).toThrow();
  });

  it("requires at least 1 bookmark when intensity is cinematic or immersive", () => {
    const g = { schema_version: "4.0.0", project_id: "x", intensity: "cinematic", bookmarks: [], meshes: [], lights: [] };
    expect(() => SceneChoreographySchema.parse(g)).toThrow(/bookmarks/);
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/canvas-runtime && npx vitest run tests/choreography-schema.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement**

```typescript
import { z } from "zod";

export const IntensitySchema = z.enum(["none", "accent", "section", "cinematic", "immersive"]);
export type Intensity = z.infer<typeof IntensitySchema>;

const Vec3 = z.tuple([z.number(), z.number(), z.number()]);

export const CameraSchema = z.object({
  pos: Vec3, look_at: Vec3, fov: z.number().min(10).max(120).default(50)
});

export const BookmarkSchema = z.object({
  id: z.string().min(1),
  scroll_anchor: z.string().regex(/^#.+/),
  camera: CameraSchema,
  morphs: z.record(z.number().min(0).max(1))
});

export const MeshRefSchema = z.object({
  id: z.string().min(1), gltf_path: z.string(), lods: z.array(z.number()).optional()
});

export const LightSchema = z.object({
  type: z.enum(["directional","ambient","point","spot","hemi"]),
  intensity: z.number().nonnegative(),
  pos: Vec3.optional(),
  color: z.string().optional()
});

export const SceneChoreographySchema = z.object({
  schema_version: z.literal("4.0.0"),
  project_id: z.string(),
  intensity: IntensitySchema,
  bookmarks: z.array(BookmarkSchema),
  meshes: z.array(MeshRefSchema),
  lights: z.array(LightSchema)
}).refine(g => {
  if (g.intensity === "cinematic" || g.intensity === "immersive") {
    return g.bookmarks.length >= 1;
  }
  return true;
}, { message: "cinematic/immersive requires at least 1 bookmark" });

export type SceneChoreography = z.infer<typeof SceneChoreographySchema>;
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/canvas-runtime && npx vitest run tests/choreography-schema.test.ts`
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/canvas-runtime/src/schemas packages/canvas-runtime/tests/choreography-schema.test.ts
git commit -m "feat(v4-m2): SceneChoreography Zod schema"
```

---

## Task 3: CapabilityProbe (test-first)

**Files:**
- Create: `packages/canvas-runtime/src/CapabilityProbe.ts`
- Create: `packages/canvas-runtime/tests/capability-probe.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { probeCapabilities, shouldLoadCinematicBundle } from "../src/CapabilityProbe.js";

beforeEach(() => {
  // Reset globals before each test
  (globalThis as any).navigator = {} as any;
});

describe("probeCapabilities", () => {
  it("returns webgpu=false when navigator.gpu is missing", async () => {
    const caps = await probeCapabilities();
    expect(caps.webgpu).toBe(false);
  });

  it("returns webgpu=true when adapter resolves", async () => {
    (globalThis as any).navigator.gpu = { requestAdapter: vi.fn(async () => ({ features: new Set() })) };
    const caps = await probeCapabilities();
    expect(caps.webgpu).toBe(true);
  });

  it("shouldLoadCinematicBundle requires all 4 conditions", () => {
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.5, connection_kbps: 8000, device_memory_gb: 6 })).toBe(true);
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.1, connection_kbps: 8000, device_memory_gb: 6 })).toBe(false);
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.5, connection_kbps: 1000, device_memory_gb: 6 })).toBe(false);
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.5, connection_kbps: 8000, device_memory_gb: 2 })).toBe(false);
    expect(shouldLoadCinematicBundle({ webgl2: false, webgpu: false, battery: 0.9, connection_kbps: 10000, device_memory_gb: 16 })).toBe(false);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
export interface Capabilities {
  webgl2: boolean;
  webgpu: boolean;
  battery: number; // 0..1 or 1 if unknown
  connection_kbps: number; // effective downlink
  device_memory_gb: number;
}

export async function probeCapabilities(): Promise<Capabilities> {
  const webgl2 = typeof document !== "undefined"
    ? !!document.createElement("canvas").getContext("webgl2")
    : false;
  let webgpu = false;
  const gpu = (navigator as any)?.gpu;
  if (gpu?.requestAdapter) {
    try { const adapter = await gpu.requestAdapter(); webgpu = !!adapter; } catch { webgpu = false; }
  }
  let battery = 1;
  try {
    const bat = await (navigator as any)?.getBattery?.();
    if (bat) battery = bat.level ?? 1;
  } catch { /* unsupported */ }
  const conn: any = (navigator as any)?.connection;
  const connection_kbps = conn?.downlink ? conn.downlink * 1000 : 10000;
  const device_memory_gb = (navigator as any)?.deviceMemory ?? 8;
  return { webgl2, webgpu, battery, connection_kbps, device_memory_gb };
}

export function shouldLoadCinematicBundle(c: Capabilities): boolean {
  return c.webgl2 && c.battery > 0.2 && c.connection_kbps >= 4000 && c.device_memory_gb >= 4;
}
```

- [ ] **Step 3: Run**

Run: `cd packages/canvas-runtime && npx vitest run tests/capability-probe.test.ts`
Expected: 3 passing.

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/src/CapabilityProbe.ts packages/canvas-runtime/tests/capability-probe.test.ts
git commit -m "feat(v4-m2): CapabilityProbe + shouldLoadCinematicBundle"
```

---

## Task 4: PersistentCanvas component (test-first)

**Files:**
- Create: `packages/canvas-runtime/src/PersistentCanvas.tsx`
- Create: `packages/canvas-runtime/tests/persistent-canvas.test.tsx`

- [ ] **Step 1: Test (DOM-only; mocks R3F)**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PersistentCanvas } from "../src/PersistentCanvas.js";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => <div data-testid="r3f-canvas" {...props}>{children}</div>
}));

describe("PersistentCanvas", () => {
  it("renders as position:fixed behind content", () => {
    const { getByTestId } = render(<PersistentCanvas intensity="cinematic">x</PersistentCanvas>);
    const canvas = getByTestId("r3f-canvas");
    const wrapper = canvas.parentElement!;
    expect(wrapper.style.position).toBe("fixed");
    expect(wrapper.style.zIndex).toBe("-1");
  });

  it("renders nothing for intensity=none", () => {
    const { container } = render(<PersistentCanvas intensity="none">x</PersistentCanvas>);
    expect(container.innerHTML).toBe("");
  });

  it("sets data-intensity attribute", () => {
    const { getByTestId } = render(<PersistentCanvas intensity="immersive">x</PersistentCanvas>);
    expect(getByTestId("r3f-canvas").parentElement!.getAttribute("data-intensity")).toBe("immersive");
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import React from "react";
import { Canvas } from "@react-three/fiber";
import type { Intensity } from "./schemas/scene-choreography.schema.js";

export interface PersistentCanvasProps {
  intensity: Intensity;
  children?: React.ReactNode;
}

export function PersistentCanvas({ intensity, children }: PersistentCanvasProps) {
  if (intensity === "none") return null;
  return (
    <div
      data-intensity={intensity}
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <Canvas dpr={[1, 2]} gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}>
        {children}
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Run**

Run: `cd packages/canvas-runtime && npx vitest run tests/persistent-canvas.test.tsx`
Expected: 3 passing.

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/src/PersistentCanvas.tsx packages/canvas-runtime/tests/persistent-canvas.test.tsx
git commit -m "feat(v4-m2): PersistentCanvas component"
```

---

## Task 5: useCameraBookmark hook (test-first)

**Files:**
- Create: `packages/canvas-runtime/src/useCameraBookmark.ts`
- Create: `packages/canvas-runtime/tests/use-camera-bookmark.test.ts`

- [ ] **Step 1: Test**

```typescript
import { describe, it, expect } from "vitest";
import { interpolateBookmarks } from "../src/useCameraBookmark.js";

describe("interpolateBookmarks", () => {
  const a = { id: "a", scroll_anchor: "#a", camera: { pos: [0,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} };
  const b = { id: "b", scroll_anchor: "#b", camera: { pos: [2,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} };

  it("returns A when progress=0", () => {
    expect(interpolateBookmarks(a, b, 0).pos).toEqual([0,0,5]);
  });

  it("returns B when progress=1", () => {
    expect(interpolateBookmarks(a, b, 1).pos).toEqual([2,0,5]);
  });

  it("lerps at progress=0.5", () => {
    expect(interpolateBookmarks(a, b, 0.5).pos).toEqual([1,0,5]);
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import { useEffect, useState } from "react";
import type { BookmarkSchema } from "./schemas/scene-choreography.schema.js";
import { z } from "zod";

type Bookmark = z.infer<typeof BookmarkSchema>;

function lerp3(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t, a[2] + (b[2]-a[2])*t];
}

export function interpolateBookmarks(a: Bookmark, b: Bookmark, t: number) {
  return {
    pos: lerp3(a.camera.pos, b.camera.pos, t),
    look_at: lerp3(a.camera.look_at, b.camera.look_at, t),
    fov: a.camera.fov + (b.camera.fov - a.camera.fov) * t
  };
}

export function useCameraBookmark(bookmarks: Bookmark[]) {
  const [state, setState] = useState(() => interpolateBookmarks(bookmarks[0], bookmarks[0], 0));

  useEffect(() => {
    const onScroll = () => {
      const elements = bookmarks.map(b => document.querySelector(b.scroll_anchor));
      const viewportH = window.innerHeight;
      const scrollY = window.scrollY;
      for (let i = 0; i < bookmarks.length - 1; i++) {
        const el = elements[i] as HTMLElement | null;
        const next = elements[i+1] as HTMLElement | null;
        if (!el || !next) continue;
        const start = el.offsetTop;
        const end = next.offsetTop;
        if (scrollY + viewportH/2 >= start && scrollY + viewportH/2 < end) {
          const t = (scrollY + viewportH/2 - start) / (end - start);
          setState(interpolateBookmarks(bookmarks[i], bookmarks[i+1], t));
          return;
        }
      }
      // past last bookmark
      const last = bookmarks[bookmarks.length - 1];
      setState(interpolateBookmarks(last, last, 0));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [bookmarks]);

  return state;
}
```

- [ ] **Step 3: Run**

Run: `cd packages/canvas-runtime && npx vitest run tests/use-camera-bookmark.test.ts`
Expected: 3 passing.

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/src/useCameraBookmark.ts packages/canvas-runtime/tests/use-camera-bookmark.test.ts
git commit -m "feat(v4-m2): useCameraBookmark + interpolateBookmarks"
```

---

## Task 6: SceneDirector component (applies choreography to canvas)

**Files:**
- Create: `packages/canvas-runtime/src/SceneDirector.tsx`
- Create: `packages/canvas-runtime/tests/scene-director.test.tsx`

- [ ] **Step 1: Test (checks choreography is loaded, bookmarks mapped)**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { SceneDirector } from "../src/SceneDirector.js";

vi.mock("@react-three/fiber", () => ({ useFrame: vi.fn(), useThree: () => ({ camera: { position: { set: vi.fn() } } }) }));

describe("SceneDirector", () => {
  it("renders null when no bookmarks", () => {
    const { container } = render(<SceneDirector choreography={{ schema_version: "4.0.0", project_id: "x", intensity: "section", bookmarks: [], meshes: [], lights: [] }} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders lights from choreography", () => {
    const c = {
      schema_version: "4.0.0" as const, project_id: "x", intensity: "cinematic" as const,
      bookmarks: [{ id: "h", scroll_anchor: "#h", camera: { pos: [0,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} }],
      meshes: [],
      lights: [{ type: "directional" as const, intensity: 1 }]
    };
    const { container } = render(<SceneDirector choreography={c} />);
    expect(container.querySelector("directionalLight, [data-light='directional']")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { SceneChoreography } from "./schemas/scene-choreography.schema.js";
import { useCameraBookmark } from "./useCameraBookmark.js";

export interface SceneDirectorProps { choreography: SceneChoreography }

export function SceneDirector({ choreography }: SceneDirectorProps) {
  if (choreography.bookmarks.length === 0) return null;

  return (
    <>
      <CameraDriver bookmarks={choreography.bookmarks} />
      {choreography.lights.map((l, i) => {
        if (l.type === "directional")
          return <directionalLight key={i} intensity={l.intensity} position={l.pos ?? [5,5,5]} color={l.color ?? "#ffffff"} />;
        if (l.type === "ambient")
          return <ambientLight key={i} intensity={l.intensity} color={l.color ?? "#ffffff"} />;
        if (l.type === "point")
          return <pointLight key={i} intensity={l.intensity} position={l.pos ?? [0,5,0]} color={l.color ?? "#ffffff"} />;
        if (l.type === "spot")
          return <spotLight key={i} intensity={l.intensity} position={l.pos ?? [0,5,5]} color={l.color ?? "#ffffff"} />;
        return <hemisphereLight key={i} intensity={l.intensity} color={l.color ?? "#ffffff"} />;
      })}
    </>
  );
}

function CameraDriver({ bookmarks }: { bookmarks: SceneChoreography["bookmarks"] }) {
  const target = useCameraBookmark(bookmarks);
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(target.pos[0], target.pos[1], target.pos[2]);
    camera.lookAt(target.look_at[0], target.look_at[1], target.look_at[2]);
  });
  return null;
}
```

- [ ] **Step 3: Run**

Run: `cd packages/canvas-runtime && npx vitest run tests/scene-director.test.tsx`
Expected: 2 passing.

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/src/SceneDirector.tsx packages/canvas-runtime/tests/scene-director.test.tsx
git commit -m "feat(v4-m2): SceneDirector component applies choreography"
```

---

## Task 7: FallbackHero for failed capability probes

**Files:**
- Create: `packages/canvas-runtime/src/FallbackHero.tsx`
- Create: `packages/canvas-runtime/tests/fallback-hero.test.tsx`

- [ ] **Step 1: Test (renders img + alt)**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { FallbackHero } from "../src/FallbackHero.js";

describe("FallbackHero", () => {
  it("renders img element with src + alt", () => {
    const { getByAltText } = render(<FallbackHero src="/hero.jpg" alt="Hero scene" />);
    expect(getByAltText("Hero scene").getAttribute("src")).toBe("/hero.jpg");
  });

  it("wraps with same fixed position as canvas", () => {
    const { container } = render(<FallbackHero src="/x.jpg" alt="x" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.position).toBe("fixed");
    expect(div.style.zIndex).toBe("-1");
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import React from "react";
export function FallbackHero({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}
```

- [ ] **Step 3: Run**

Run: `cd packages/canvas-runtime && npx vitest run tests/fallback-hero.test.tsx`
Expected: 2 passing.

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/src/FallbackHero.tsx packages/canvas-runtime/tests/fallback-hero.test.tsx
git commit -m "feat(v4-m2): FallbackHero for low-capability devices"
```

---

## Task 8: WebGPU compute shader host (minimal wrapper)

**Files:**
- Create: `packages/canvas-runtime/src/webgpu/ComputeShaderHost.tsx`
- Create: `packages/canvas-runtime/tests/compute-shader-host.test.tsx`

- [ ] **Step 1: Test (falls back when webgpu unavailable)**

```typescript
// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { ComputeShaderHost } from "../src/webgpu/ComputeShaderHost.js";

describe("ComputeShaderHost", () => {
  it("renders fallback slot when WebGPU unavailable", () => {
    const { getByTestId } = render(
      <ComputeShaderHost wgsl="/* compute */" fallback={<div data-testid="fb">webgl2</div>}>
        {null}
      </ComputeShaderHost>
    );
    expect(getByTestId("fb")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Implement**

```typescript
import React, { useEffect, useState } from "react";
import { probeCapabilities } from "../CapabilityProbe.js";

export interface ComputeShaderHostProps {
  wgsl: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export function ComputeShaderHost({ wgsl, fallback, children }: ComputeShaderHostProps) {
  const [mode, setMode] = useState<"probing" | "webgpu" | "fallback">("probing");
  useEffect(() => { probeCapabilities().then(c => setMode(c.webgpu ? "webgpu" : "fallback")); }, []);
  if (mode === "probing") return null;
  if (mode === "fallback") return <>{fallback}</>;
  // WebGPU path — compile wgsl module, dispatch as compute pass
  return <WebGpuActive wgsl={wgsl}>{children}</WebGpuActive>;
}

function WebGpuActive({ wgsl, children }: { wgsl: string; children: React.ReactNode }) {
  // Minimal placeholder — real impl dispatches compute pipeline.
  // Production bodies in skills/webgpu-compute-shaders.
  useEffect(() => {
    async function run() {
      const gpu = (navigator as any).gpu;
      if (!gpu) return;
      const adapter = await gpu.requestAdapter();
      if (!adapter) return;
      const device = await adapter.requestDevice();
      device.createShaderModule({ code: wgsl });
    }
    run().catch(() => { /* log via AG-UI in production */ });
  }, [wgsl]);
  return <>{children}</>;
}
```

- [ ] **Step 3: Run**

Run: `cd packages/canvas-runtime && npx vitest run tests/compute-shader-host.test.tsx`
Expected: 1 passing.

- [ ] **Step 4: Commit**

```bash
git add packages/canvas-runtime/src/webgpu packages/canvas-runtime/tests/compute-shader-host.test.tsx
git commit -m "feat(v4-m2): ComputeShaderHost + WebGL2 fallback branching"
```

---

## Task 9: Barrel + build

**Files:**
- Create: `packages/canvas-runtime/src/index.ts`

- [ ] **Step 1: Write barrel**

```typescript
export * from "./PersistentCanvas.js";
export * from "./SceneDirector.js";
export * from "./FallbackHero.js";
export * from "./CapabilityProbe.js";
export * from "./useCameraBookmark.js";
export * from "./webgpu/ComputeShaderHost.js";
export * from "./schemas/scene-choreography.schema.js";
```

- [ ] **Step 2: Build**

Run: `cd packages/canvas-runtime && npm run build`
Expected: `dist/` populated.

- [ ] **Step 3: Commit**

```bash
git add packages/canvas-runtime/src/index.ts packages/canvas-runtime/dist
git commit -m "feat(v4-m2): canvas-runtime barrel + build"
```

---

## Task 10: Scroll Coherence validator (hard gate #6)

**Files:**
- Create: `scripts/validators/scroll-coherence.mjs`
- Create: `skills/scroll-coherence-validator/SKILL.md`
- Create: `scripts/validators/scroll-coherence.test.mjs`

- [ ] **Step 1: Write failing test**

`scripts/validators/scroll-coherence.test.mjs`:

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { runScrollCoherence } from "./scroll-coherence.mjs";

test("passes when single persistent <Canvas> in layout", async () => {
  const layout = `
import { PersistentCanvas, SceneDirector } from "@genorah/canvas-runtime";
export default function Layout({ children }) {
  return <><PersistentCanvas intensity="cinematic"><SceneDirector choreography={c}/></PersistentCanvas>{children}</>;
}`;
  const result = await runScrollCoherence({ files: { "app/layout.tsx": layout }, intensity: "cinematic" });
  assert.equal(result.pass, true);
});

test("fails when multiple Canvas instances for cinematic intensity", async () => {
  const hero = `import { Canvas } from "@react-three/fiber"; export default () => <Canvas/>;`;
  const about = `import { Canvas } from "@react-three/fiber"; export default () => <Canvas/>;`;
  const result = await runScrollCoherence({ files: { "app/hero/page.tsx": hero, "app/about/page.tsx": about }, intensity: "cinematic" });
  assert.equal(result.pass, false);
  assert.match(result.reason, /multiple.*Canvas/i);
});

test("is skipped for intensity=accent", async () => {
  const result = await runScrollCoherence({ files: {}, intensity: "accent" });
  assert.equal(result.pass, true);
  assert.equal(result.skipped, true);
});
```

- [ ] **Step 2: Implement**

```javascript
const CANVAS_RE = /<\s*Canvas[\s/>]/g;
const PERSISTENT_RE = /<\s*PersistentCanvas[\s/>]/g;

export async function runScrollCoherence({ files, intensity }) {
  if (intensity !== "cinematic" && intensity !== "immersive") {
    return { pass: true, skipped: true };
  }
  let canvases = 0;
  let persistent = 0;
  for (const [path, src] of Object.entries(files)) {
    canvases += (src.match(CANVAS_RE) || []).length;
    persistent += (src.match(PERSISTENT_RE) || []).length;
  }
  if (persistent === 0) {
    return { pass: false, reason: "cinematic intensity requires exactly one <PersistentCanvas>" };
  }
  // Raw <Canvas> uses outside canvas-runtime are disallowed in cinematic
  if (canvases > persistent) {
    return { pass: false, reason: "multiple <Canvas> instances detected; cinematic requires single persistent canvas" };
  }
  return { pass: true };
}
```

- [ ] **Step 3: Run**

Run: `node --test scripts/validators/scroll-coherence.test.mjs`
Expected: 3/3 passing.

- [ ] **Step 4: Write skill doc**

`skills/scroll-coherence-validator/SKILL.md` — describes when the validator runs (cinematic/immersive only), inputs (all section TSX files + intensity), outputs (pass/fail + reason), and how to fix (consolidate to one PersistentCanvas in app/layout.tsx).

- [ ] **Step 5: Commit**

```bash
git add scripts/validators/scroll-coherence.mjs scripts/validators/scroll-coherence.test.mjs skills/scroll-coherence-validator/SKILL.md
git commit -m "feat(v4-m2): Scroll Coherence hard gate #6"
```

---

## Task 11: Register 6th hard gate in DNA compliance check

**Files:**
- Modify: `.claude-plugin/hooks/dna-compliance-check.sh`

- [ ] **Step 1: Add scroll-coherence invocation**

Edit the shell script: after the existing 5 hard gates, append:

```bash
# Hard gate #6: Scroll Coherence (v4)
INTENSITY=$(grep -oE '3d_intensity:\s*\w+' .planning/genorah/DESIGN-DNA.md | awk '{print $2}')
if [[ "$INTENSITY" == "cinematic" || "$INTENSITY" == "immersive" ]]; then
  RESULT=$(node -e "
    import('./scripts/validators/scroll-coherence.mjs').then(async m => {
      const fs = await import('fs/promises');
      const files = {};
      const globby = await import('globby');
      const paths = await globby.globby(['app/**/*.tsx','src/**/*.tsx']);
      for (const p of paths) files[p] = await fs.readFile(p, 'utf8');
      const r = await m.runScrollCoherence({ files, intensity: '$INTENSITY' });
      if (!r.pass) { console.error('HARD-GATE FAIL: Scroll Coherence — ' + r.reason); process.exit(1); }
    })
  ")
fi
```

- [ ] **Step 2: Install globby dep**

Run: `npm i globby@14.0.2`

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/hooks/dna-compliance-check.sh package.json package-lock.json
git commit -m "feat(v4-m2): register Scroll Coherence in dna-compliance-check"
```

---

## Task 12: Performance budget validator

**Files:**
- Create: `scripts/validators/perf-budget.mjs`
- Create: `scripts/validators/perf-budget.test.mjs`

- [ ] **Step 1: Test (rejects over-budget bundle)**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { checkPerfBudget } from "./perf-budget.mjs";

test("passes when under budget", () => {
  const r = checkPerfBudget({ js_gz: 220_000, total_transfer: 4_500_000, lcp_ms: 2100, cls: 0.03, inp_ms: 140 }, "cinematic");
  assert.equal(r.pass, true);
});

test("fails on JS over 280KB gz", () => {
  const r = checkPerfBudget({ js_gz: 300_000, total_transfer: 4_500_000, lcp_ms: 2100, cls: 0.03, inp_ms: 140 }, "cinematic");
  assert.equal(r.pass, false);
  assert.match(r.reason, /JS/);
});

test("fails on LCP > 2.4s", () => {
  const r = checkPerfBudget({ js_gz: 220_000, total_transfer: 4_500_000, lcp_ms: 2700, cls: 0.03, inp_ms: 140 }, "cinematic");
  assert.equal(r.pass, false);
});

test("only enforces budgets for cinematic/immersive", () => {
  const r = checkPerfBudget({ js_gz: 600_000, total_transfer: 9_000_000, lcp_ms: 3000, cls: 0.2, inp_ms: 400 }, "accent");
  assert.equal(r.pass, true);
});
```

- [ ] **Step 2: Implement**

```javascript
const BUDGETS = {
  cinematic: { js_gz: 280_000, total_transfer: 5_500_000, lcp_ms: 2400, cls: 0.05, inp_ms: 180 },
  immersive: { js_gz: 400_000, total_transfer: 8_000_000, lcp_ms: 2800, cls: 0.08, inp_ms: 200 }
};

export function checkPerfBudget(metrics, intensity) {
  const budget = BUDGETS[intensity];
  if (!budget) return { pass: true, skipped: true };
  if (metrics.js_gz > budget.js_gz) return { pass: false, reason: `JS ${metrics.js_gz} > budget ${budget.js_gz}` };
  if (metrics.total_transfer > budget.total_transfer) return { pass: false, reason: `transfer ${metrics.total_transfer} > budget ${budget.total_transfer}` };
  if (metrics.lcp_ms > budget.lcp_ms) return { pass: false, reason: `LCP ${metrics.lcp_ms}ms > budget ${budget.lcp_ms}ms` };
  if (metrics.cls > budget.cls) return { pass: false, reason: `CLS ${metrics.cls} > budget ${budget.cls}` };
  if (metrics.inp_ms > budget.inp_ms) return { pass: false, reason: `INP ${metrics.inp_ms}ms > budget ${budget.inp_ms}ms` };
  return { pass: true };
}

export const BUDGET_TABLE = BUDGETS;
```

- [ ] **Step 3: Run**

Run: `node --test scripts/validators/perf-budget.test.mjs`
Expected: 4 passing.

- [ ] **Step 4: Commit**

```bash
git add scripts/validators/perf-budget.mjs scripts/validators/perf-budget.test.mjs
git commit -m "feat(v4-m2): performance budget validator (cinematic/immersive)"
```

---

## Task 13: Flesh out `agents/directors/scene-director.md`

**Files:**
- Modify: `agents/directors/scene-director.md`

- [ ] **Step 1: Append full protocol body**

After the generated frontmatter + stub, append:

```markdown
## State Ownership

Writes `.planning/genorah/SCENE-CHOREOGRAPHY.json` conforming to `SceneChoreographySchema` (packages/canvas-runtime).
Reads once per project init, updates per wave if section list changes.

## Protocol

1. On project init (via master-orchestrator): read DESIGN-DNA.md `3d_intensity`.
2. If `intensity == "none" | "accent"`: return empty envelope, no choreography.
3. Else: derive bookmarks (one per cinematic section), emit initial camera + light rig from archetype preset.
4. Dispatch to workers in parallel: `hero-camera-choreographer`, `morph-target-author`, `gltf-lod-generator`, `ktx2-encoder`.
5. Collect Result<T> envelopes, merge followups (e.g. if morph-target-author suggests adding a bookmark).
6. Write SCENE-CHOREOGRAPHY.json.
7. Emit AG-UI `STATE_DELTA` with bookmark count.

## Failure Recovery

- WebGPU probe fails → fall back to WebGL2 path; emit warning.
- Bookmark interpolation jitters → rerun morph-target-author with smoothing hint.
- LCP budget breach → emit COST_BUDGET_UPDATE-style event on perf budget, dispatch perf-polisher.
```

- [ ] **Step 2: Commit**

```bash
git add agents/directors/scene-director.md
git commit -m "feat(v4-m2): scene-director full body"
```

---

## Task 14: Flesh out 8 3D worker bodies

**Files:**
- Modify: `agents/workers/3d/*.md` (all 8)

- [ ] **Step 1: Add role-specific bodies**

Each worker gets an expanded Protocol section with:
- Exact inputs read (e.g. `hero-camera-choreographer` reads `choreography.bookmarks` + DNA.archetype)
- Exact output shape (e.g. returns `{ keyframes: Theatre.js JSON, duration_ms: number }`)
- Skills to invoke (e.g. `theatre-choreography`, `webgl2-fallback-generator`)
- Self-check validators (`scroll-coherence`, `js-budget`, `fallback-present`)

Example body for `hero-camera-choreographer.md` (append after frontmatter):

```markdown
## Protocol

1. Read SCENE-CHOREOGRAPHY.json + DESIGN-DNA.md (archetype preset).
2. For each bookmark, load Theatre.js keyframe template from archetype.
3. Apply DNA-derived easing (from `motion_tokens.easing`).
4. Emit keyframes JSON to `.planning/genorah/sections/<slug>/camera-keyframes.json`.
5. Self-check: `scroll-coherence` validator.
6. Return Result<{ keyframes_path: string, duration_ms: number }>.

## Skills Invoked

- `theatre-choreography` — keyframe authoring
- `cinematic-motion` — easing curve selection

## Followups

If `scroll-coherence` verdict returns `pass: false`, emit followup `{ suggested_worker: "morph-target-author", reason: "smooth bookmark transitions" }`.
```

Repeat pattern for the other 7 workers (morph-target-author, webgpu-shader-author, webgl2-fallback-author, r3f-scene-builder, gltf-lod-generator, ktx2-encoder, spline-embed-author). Each body ~30 lines following the exact same structure — Protocol, Skills, Followups.

- [ ] **Step 2: Commit**

```bash
git add agents/workers/3d/
git commit -m "feat(v4-m2): full bodies for 8 3D workers"
```

---

## Task 15: Flesh out 6 motion worker bodies

**Files:**
- Modify: `agents/workers/motion/*.md` (all 6)

- [ ] **Step 1: Follow same pattern as Task 14 for motion workers**

Each of `gsap-choreographer`, `scroll-driven-css-author`, `theatre-sequencer`, `lottie-author`, `rive-author`, `reduced-motion-variant-author` gets:

- Role-specific Protocol section
- Skills it invokes (cinematic-motion, animation-orchestration, reduced-motion)
- Validators (motion-presence, reduced-motion, easing-fit, animation-continuity)
- Followups (e.g. `gsap-choreographer` followup `{ suggested_worker: "reduced-motion-variant-author", reason: "ensure a11y" }` on every non-accent intensity)

- [ ] **Step 2: Commit**

```bash
git add agents/workers/motion/
git commit -m "feat(v4-m2): full bodies for 6 motion workers"
```

---

## Task 16: Skill doc — persistent-canvas-pattern

**Files:**
- Create: `skills/persistent-canvas-pattern/SKILL.md`

- [ ] **Step 1: Write 4-layer doc**

Contains:
- **Layer 1 — Decision Guidance:** use when `intensity == cinematic | immersive`; skip when `accent` or `none`.
- **Layer 2 — Award-Winning Examples:** Lusion Persistent Scene, Igloo Inc. 2024, Ilja van Eck 2025. Copy-paste TSX using `@genorah/canvas-runtime`.
- **Layer 3 — Integration Context:** DNA tokens consumed (archetype, motion_tokens.easing, primary/secondary color); pipeline stage (Wave 1 scaffold + Wave 2+ per section).
- **Layer 4 — Anti-Patterns:** multiple `<Canvas>` per page (breaks hard gate #6), mounting Canvas per section, forgetting FallbackHero.

Include code block:

```tsx
// app/layout.tsx
import { PersistentCanvas, SceneDirector, FallbackHero, probeCapabilities, shouldLoadCinematicBundle } from "@genorah/canvas-runtime";
import choreo from "../.planning/genorah/SCENE-CHOREOGRAPHY.json";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const caps = await probeCapabilities();
  if (!shouldLoadCinematicBundle(caps)) {
    return <html><body><FallbackHero src="/assets/hero-fallback.avif" alt="scene"/>{children}</body></html>;
  }
  return (
    <html><body>
      <PersistentCanvas intensity={choreo.intensity}>
        <SceneDirector choreography={choreo}/>
      </PersistentCanvas>
      {children}
    </body></html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add skills/persistent-canvas-pattern
git commit -m "feat(v4-m2): persistent-canvas-pattern skill"
```

---

## Task 17: Skill doc — theatre-choreography

**Files:**
- Create: `skills/theatre-choreography/SKILL.md`

- [ ] **Step 1: Write 4-layer doc**

Covers Theatre.js project setup, keyframe authoring via Studio, JSON export, runtime playback via `@theatre/core`, scroll-to-timeline binding via `val.set`, and DNA-easing binding.

Full working snippet included showing `theatre.getSheet` + `val.onChange` + scroll-progress input.

- [ ] **Step 2: Commit**

```bash
git add skills/theatre-choreography
git commit -m "feat(v4-m2): theatre-choreography skill"
```

---

## Task 18: Skill doc — webgpu-compute-shaders

**Files:**
- Create: `skills/webgpu-compute-shaders/SKILL.md`

- [ ] **Step 1: Write 4-layer doc**

Covers WGSL compute pipeline pattern (hair, foliage, fluid), device request + feature detection, buffer layout, compute pass dispatch, and the mandatory WebGL2 fallback branch. Include a full hair-sim WGSL excerpt (~40 lines) with bind-group layout.

- [ ] **Step 2: Commit**

```bash
git add skills/webgpu-compute-shaders
git commit -m "feat(v4-m2): webgpu-compute-shaders skill"
```

---

## Task 19: Skill doc — webgl2-fallback-generator

**Files:**
- Create: `skills/webgl2-fallback-generator/SKILL.md`

- [ ] **Step 1: Write 4-layer doc**

Covers the pattern: for every WebGPU compute effect, emit an equivalent GLSL fragment/vertex shader using Three.js `ShaderMaterial`. Include conversion examples (particle compute → transform-feedback; fluid compute → framebuffer ping-pong).

- [ ] **Step 2: Commit**

```bash
git add skills/webgl2-fallback-generator
git commit -m "feat(v4-m2): webgl2-fallback-generator skill"
```

---

## Task 20: Archetype preset scaffolder

**Files:**
- Create: `scripts/scaffold-archetype.mjs`

- [ ] **Step 1: Write generator**

```javascript
#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const archetypes = [
  { slug: "cinematic-3d", name: "Cinematic 3D", mandatory: ["PersistentCanvas", "Theatre.js", "Lenis"], forbidden: ["multiple-canvas","scroll-hijack-for-marketing"], tension: ["scale-violence-hero","material-collision-pivot","temporal-disruption-close"] },
  { slug: "volumetric", name: "Volumetric", mandatory: ["WebGPU fog shader","density grid"], forbidden: ["flat-2d-hero"], tension: ["atmospheric-depth","edge-bleed","fog-reveal"] },
  { slug: "biomorphic-compute", name: "Biomorphic Compute", mandatory: ["WebGPU compute","organic-curves","noise-displacement"], forbidden: ["hard-edges","grid-layout"], tension: ["pulse-breath","tendril-growth","mycelial-join"] },
  { slug: "temporal-glass", name: "Temporal Glass", mandatory: ["backdrop-filter","refraction-shader","time-delay"], forbidden: ["opaque-surfaces"], tension: ["time-delay","lag-reveal","freeze-frame"] },
  { slug: "neo-physical", name: "Neo-Physical", mandatory: ["PBR-materials","HDRI","contact-shadows"], forbidden: ["flat-shaded"], tension: ["physicality-break","gravity-defy","material-flex"] },
  { slug: "signal-noise", name: "Signal Noise", mandatory: ["glitch-shader","scanlines","chromatic-aberration"], forbidden: ["clean-aesthetics"], tension: ["data-storm","signal-drop","reboot-flash"] },
  { slug: "kinetic-industrial", name: "Kinetic Industrial", mandatory: ["mechanical-motion","gears","exposed-structure"], forbidden: ["soft-organic"], tension: ["servo-whip","belt-catch","pneumatic-burst"] },
  { slug: "narrative-cinema", name: "Narrative Cinema", mandatory: ["letterbox","title-cards","score-cues"], forbidden: ["flat-ui-chrome"], tension: ["cut-to-black","slow-push","match-cut"] },
  { slug: "ambient-computing", name: "Ambient Computing", mandatory: ["subtle-idle-motion","breathing-ui","peripheral-glow"], forbidden: ["aggressive-cta"], tension: ["breath-pause","attention-drift","recenter"] },
  { slug: "post-flat", name: "Post-Flat", mandatory: ["layered-depth","parallax","material-stacks"], forbidden: ["pure-flat-design"], tension: ["layer-collapse","z-overlap","depth-reveal"] },
  { slug: "living-data", name: "Living Data", mandatory: ["realtime-charts","pulsing-indicators","animated-sparklines"], forbidden: ["static-numbers"], tension: ["spike-pulse","trend-whip","zero-line-stare"] },
  { slug: "organic-machinery", name: "Organic Machinery", mandatory: ["cellular-structures","mechanical-blend","biology-meets-engineering"], forbidden: ["pure-organic","pure-mechanical"], tension: ["graft-reveal","mitosis-split","synthesis-glow"] },
  { slug: "hyperreal-minimal", name: "Hyperreal Minimal", mandatory: ["photo-real-hero","maximum-whitespace","single-subject"], forbidden: ["clutter","multi-subject"], tension: ["silence","single-beat","whisper-close"] },
  { slug: "liminal-brutalism", name: "Liminal Brutalism", mandatory: ["raw-concrete-textures","stark-type","liminal-space-imagery"], forbidden: ["decorative-flourish"], tension: ["hollow-echo","scale-crush","absence-weight"] },
  { slug: "sonic-visual", name: "Sonic Visual", mandatory: ["audio-reactive","sonic-logo","haptic-hooks"], forbidden: ["silent-experience"], tension: ["beat-sync","bass-drop","silence-beat"] },
  { slug: "quantum-editorial", name: "Quantum Editorial", mandatory: ["editorial-grid","narrative-typography","photographic-imagery"], forbidden: ["pure-grid-break"], tension: ["margin-break","hanging-folio","kerning-drama"] },
  { slug: "archive-futurist", name: "Archive Futurist", mandatory: ["terminal-type","monochrome-accent","retro-future-chrome"], forbidden: ["contemporary-flat"], tension: ["scanline-artifact","phosphor-burn","archive-dust"] }
];

for (const a of archetypes) {
  const dir = join(root, `skills/design-archetypes/archetypes/${a.slug}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "archetype.json"), JSON.stringify({
    slug: a.slug,
    name: a.name,
    tier: "webgpu-native",
    mandatory_techniques: a.mandatory,
    forbidden_patterns: a.forbidden,
    tension_zones: a.tension,
    default_intensity: "cinematic",
    dna_color_palette: { primary: "#0F1117", secondary: "#C7A86B", accent: "#F6F2EC", signature: "#1A73E8" },
    dna_fonts: { display: "Söhne Breit", body: "Söhne", mono: "Berkeley Mono" },
    dna_motion_tokens: { easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", duration_hero_ms: 1600, duration_micro_ms: 160 }
  }, null, 2));
  writeFileSync(join(dir, "reference-sites.md"), `# ${a.name} — Reference Sites\n\n(Curated Awwwards SOTD + indie studios. Updated quarterly.)\n`);
  writeFileSync(join(dir, "tension-zones.md"), `# ${a.name} — Tension Zones\n\n` + a.tension.map(t => `## ${t}\n\nDescribe controlled rule-break pattern here.\n`).join("\n"));
}
console.log(`wrote ${archetypes.length} archetype scaffolds`);
```

- [ ] **Step 2: Run**

Run: `node scripts/scaffold-archetype.mjs`
Expected: `wrote 17 archetype scaffolds`.

- [ ] **Step 3: Verify**

Run: `ls skills/design-archetypes/archetypes/ | wc -l`
Expected: at least 17 new archetype dirs (plus existing 33).

- [ ] **Step 4: Commit**

```bash
git add scripts/scaffold-archetype.mjs skills/design-archetypes/archetypes/
git commit -m "feat(v4-m2): 17 new WebGPU-native archetype presets"
```

---

## Task 21: Archetype registry validator

**Files:**
- Create: `scripts/validators/archetype-registry.mjs`
- Create: `scripts/validators/archetype-registry.test.mjs`

- [ ] **Step 1: Test**

```javascript
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { validateRegistry } from "./archetype-registry.mjs";

test("registry lists all 50 archetypes", async () => {
  const r = await validateRegistry();
  assert.equal(r.count, 50);
  assert.ok(r.pass);
});
```

- [ ] **Step 2: Implement**

```javascript
import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

export async function validateRegistry() {
  const dir = "skills/design-archetypes/archetypes";
  if (!existsSync(dir)) return { pass: false, count: 0 };
  const entries = readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory());
  const issues = [];
  for (const e of entries) {
    const p = join(dir, e.name, "archetype.json");
    if (!existsSync(p)) { issues.push(`missing archetype.json in ${e.name}`); continue; }
    const j = JSON.parse(readFileSync(p, "utf8"));
    if (!j.slug || !j.name || !j.mandatory_techniques) issues.push(`incomplete manifest in ${e.name}`);
  }
  return { pass: issues.length === 0 && entries.length === 50, count: entries.length, issues };
}
```

- [ ] **Step 3: Run**

Run: `node --test scripts/validators/archetype-registry.test.mjs`
Expected: 1 passing (assuming 33 existing + 17 new = 50).

- [ ] **Step 4: Commit**

```bash
git add scripts/validators/archetype-registry.mjs scripts/validators/archetype-registry.test.mjs
git commit -m "feat(v4-m2): archetype registry validator (50 total)"
```

---

## Task 22: Cinematic demo project

**Files:**
- Create: `examples/demo-cinematic/*` (Next.js 16 app with 3 sections using @genorah/canvas-runtime)

- [ ] **Step 1: Scaffold demo**

Run:
```bash
cd examples && npx create-next-app@latest demo-cinematic --typescript --tailwind --eslint --app --no-src-dir --no-turbopack --use-npm
cd demo-cinematic && npm i @genorah/canvas-runtime@4.0.0-alpha.2 three @react-three/fiber @react-three/drei @theatre/core gsap lenis
```

- [ ] **Step 2: Add SCENE-CHOREOGRAPHY.json**

Create `examples/demo-cinematic/choreography.json` with 3 bookmarks (hero, tease, peak) matching SceneChoreographySchema.

- [ ] **Step 3: Implement app/layout.tsx using Task 16's code snippet**

Use the exact code from `skills/persistent-canvas-pattern/SKILL.md`.

- [ ] **Step 4: Implement 3 sections at `app/page.tsx`**

Each section renders HTML with an anchor id matching a bookmark.

- [ ] **Step 5: Build + measure**

Run: `cd examples/demo-cinematic && npm run build && npx next-bundle-analyzer --json > .next/stats.json`
Expected: build succeeds.

Then run a Lighthouse CI on the built output:
```bash
npx lighthouse http://localhost:3000 --output=json --output-path=lh.json --only-categories=performance --chrome-flags="--headless"
```
Expected: LCP ≤ 2400ms, CLS ≤ 0.05, JS main-bundle ≤ 280KB gz.

- [ ] **Step 6: Commit**

```bash
git add examples/demo-cinematic
git commit -m "feat(v4-m2): cinematic reference demo meets perf budgets"
```

---

## Task 23: Integrate perf validator into /gen:audit

**Files:**
- Modify: `commands/gen-audit.md`
- Modify: `scripts/audit.mjs` (assumed existing entry)

- [ ] **Step 1: Run perf-budget on built artifact**

After existing audit steps, run the perf validator in `scripts/audit.mjs` and emit AG-UI `VERDICT_ISSUED` event with `pass: result.pass`.

- [ ] **Step 2: Commit**

```bash
git add commands/gen-audit.md scripts/audit.mjs
git commit -m "feat(v4-m2): /gen:audit enforces cinematic perf budgets"
```

---

## Task 24: Update plugin.json + CLAUDE.md

**Files:**
- Modify: `.claude-plugin/plugin.json` → 4.0.0-alpha.2
- Modify: `CLAUDE.md` → note archetype count 50, 6 hard gates, canvas-runtime package

- [ ] **Step 1: Edit + commit**

```bash
git add .claude-plugin/plugin.json CLAUDE.md
git commit -m "chore(v4-m2): v4.0.0-alpha.2 + CLAUDE.md update"
```

---

## Task 25: Regenerate agent cards after body expansion

- [ ] **Step 1: Run card generator**

Run: `node scripts/generate-agent-cards.mjs`
Expected: 104 cards rewritten (bodies don't change card content but version bumps).

- [ ] **Step 2: Run integration-cards test**

Run: `cd packages/protocol && npx vitest run tests/integration-cards.test.ts`
Expected: 1 passing.

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/generated/agent-cards.json
git commit -m "chore(v4-m2): regenerate agent cards"
```

---

## Task 26: M2 regression + tag

- [ ] **Step 1: Run all tests**

```bash
cd packages/protocol && npm test
cd ../canvas-runtime && npm test
cd ../.. && npm test
node --test scripts/validators/*.test.mjs
```
Expected: all pass. Total ~195 tests (109 legacy + 30 M1 protocol + 21 M2 canvas-runtime + ~30 validators + ~5 integration).

- [ ] **Step 2: Run full /gen:audit on demo**

Run: in `examples/demo-cinematic`, invoke `/gen:audit` via Claude Code; expect all 6 hard gates pass.

- [ ] **Step 3: Tag**

```bash
git tag v4.0.0-alpha.2 -m "v4 M2 shipping: cinematic canvas + 17 archetypes"
```

- [ ] **Step 4: Completion summary**

Create `docs/superpowers/plans/v4-m2-completion.md` — 1 page: archetype count, demo metrics, tests, open issues carrying into M3.

---

## M2 Exit Criteria

- [ ] `@genorah/canvas-runtime` builds cleanly + all tests pass
- [ ] 50 archetypes total (33 existing + 17 new); registry validator passes
- [ ] Scroll Coherence hard gate registered + enforces in `dna-compliance-check.sh`
- [ ] Perf budget validator enforces LCP/JS/CLS/INP/transfer caps for cinematic/immersive
- [ ] Demo project at `examples/demo-cinematic/` builds and meets all budgets
- [ ] All 8 3D workers + 6 motion workers have full bodies
- [ ] `v4.0.0-alpha.2` tag exists
