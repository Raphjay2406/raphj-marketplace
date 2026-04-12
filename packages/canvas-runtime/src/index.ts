/**
 * Task 8: Barrel index — public API of @genorah/canvas-runtime.
 *
 * Three-layer export grouping:
 *   1. Schemas + pure types (no side-effects, safe in SSR/Node)
 *   2. Runtime adapters (Theatre.js, GSAP, Lenis, WebGPU, PerfBudget)
 *   3. React components (canvas-runtime.tsx — marks "use client" internally)
 */

// ---------------------------------------------------------------------------
// 1. Schemas & types
// ---------------------------------------------------------------------------
export {
  MotionPresetSchema,
  PerfBudgetSchema,
  ScenePropsSchema,
  CanvasConfigSchema,
  parseCanvasConfig,
  type MotionPreset,
  type PerfBudget,
  type SceneProps,
  type CanvasConfig,
} from "./schemas/canvas-config.js";

// ---------------------------------------------------------------------------
// 2. Runtime adapters
// ---------------------------------------------------------------------------

// Theatre.js wrapper
export {
  types as theatreTypes,
  onChange as theatreOnChange,
  val as theatreVal,
  getOrCreateProject,
  getSheet,
  playSequence,
  scrubSequence,
  getSharedRafDriver,
  tickRafDriver,
  getSheetObject,
  resetTheatreRuntime,
  type TheatreProjectOptions,
  type PlayOptions,
  type IProject,
  type ISheet,
  type ISequence,
  type ISheetObject,
} from "./theatre.js";

// GSAP adapter
export {
  gsap,
  presetToGsapEase,
  dnaTween,
  setGsapTimescale,
  scrollProgressTween,
  type DnaTweenOptions,
  type ScrollProgressTween,
} from "./gsap-adapter.js";

// Lenis adapter
export {
  createLenis,
  getLenis,
  onScroll,
  tickLenis,
  scrollTo,
  destroyLenis,
  type LenisOptions,
  type Lenis,
} from "./lenis-adapter.js";

// WebGPU feature detection
export {
  detectWebGpu,
  getCachedWebGpuCapabilities,
  resetWebGpuCache,
  type RendererTier,
  type WebGpuCapabilities,
} from "./webgpu/feature-detect.js";

// Performance budget
export {
  PerfBudgetTracker,
  FpsSampler,
  type PerfSnapshot,
  type PerfViolation,
} from "./perf-budget.js";

// ---------------------------------------------------------------------------
// 3. React components
// ---------------------------------------------------------------------------
export {
  CanvasRuntime,
  useCanvasRuntime,
  type CanvasRuntimeProps,
  type CanvasRuntimeContext,
} from "./canvas-runtime.js";

// ---------------------------------------------------------------------------
// 4. M2 cinematic canvas additions
// ---------------------------------------------------------------------------
export * from "./PersistentCanvas.js";
export * from "./SceneDirector.js";
export * from "./FallbackHero.js";
export * from "./CapabilityProbe.js";
export * from "./useCameraBookmark.js";
export * from "./webgpu/ComputeShaderHost.js";
export * from "./schemas/scene-choreography.schema.js";
