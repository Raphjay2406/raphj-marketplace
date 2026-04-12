/**
 * Task 5: R3F canvas component — CanvasRuntime.
 *
 * Persistent single-canvas 3D pipeline. Integrates:
 * - @react-three/fiber (R3F) Canvas
 * - Theatre.js RAF driver via getSharedRafDriver()
 * - Lenis smooth scroll via createLenis()
 * - GSAP timescale from CanvasConfig
 * - WebGPU feature detection (optional upgrade path)
 * - Perf budget tracker with useFrame sampling
 *
 * Usage:
 * ```tsx
 * <CanvasRuntime config={canvasConfig} sectionId="hero">
 *   <MyScene />
 * </CanvasRuntime>
 * ```
 */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { CanvasConfig, SceneProps } from "./schemas/canvas-config.js";
import { parseCanvasConfig } from "./schemas/canvas-config.js";
import {
  getOrCreateProject,
  getSheet,
  getSharedRafDriver,
  tickRafDriver,
  type ISheet,
} from "./theatre.js";
import { createLenis, tickLenis, destroyLenis } from "./lenis-adapter.js";
import { setGsapTimescale } from "./gsap-adapter.js";
import { detectWebGpu, type WebGpuCapabilities } from "./webgpu/feature-detect.js";
import { PerfBudgetTracker, FpsSampler } from "./perf-budget.js";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
export interface CanvasRuntimeContext {
  config: CanvasConfig;
  sceneProps: SceneProps;
  sheet: ISheet;
  webGpuCaps: WebGpuCapabilities | null;
}

const CanvasCtx = createContext<CanvasRuntimeContext | null>(null);

export function useCanvasRuntime(): CanvasRuntimeContext {
  const ctx = useContext(CanvasCtx);
  if (!ctx) throw new Error("useCanvasRuntime must be used inside <CanvasRuntime>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Inner loop component (runs inside R3F canvas)
// ---------------------------------------------------------------------------
function CanvasRuntimeLoop({ perfTracker, fpsSampler }: {
  perfTracker: PerfBudgetTracker;
  fpsSampler: FpsSampler;
}) {
  const { gl } = useThree();

  useFrame(({ clock }) => {
    // Tick Theatre.js RAF driver
    tickRafDriver(clock.getDelta() * 1000);

    // Tick Lenis
    tickLenis(performance.now());

    // Sample FPS and check perf budget
    const fps = fpsSampler.tick(performance.now());
    const info = gl.info;
    perfTracker.check({
      drawCalls: info.render?.calls ?? 0,
      triangles: info.render?.triangles ?? 0,
      textureBytes: info.memory?.textures ?? 0,
      fps,
      timestamp: performance.now(),
    });
  });

  return null;
}

// ---------------------------------------------------------------------------
// CanvasRuntime component
// ---------------------------------------------------------------------------
export interface CanvasRuntimeProps extends PropsWithChildren {
  /** Raw or parsed CanvasConfig — will be validated by Zod on mount */
  config: unknown;
  /** Section id — selects the scene override from config.scenes */
  sectionId: string;
  /** Optional className for the wrapper div */
  className?: string;
  /** Optional style for the wrapper div */
  style?: React.CSSProperties;
  /** Called when a perf budget is exceeded */
  onPerfViolation?: (metric: string, ratio: number) => void;
}

export function CanvasRuntime({
  config: rawConfig,
  sectionId,
  className,
  style,
  onPerfViolation,
  children,
}: CanvasRuntimeProps) {
  const [ctx, setCtx] = useState<CanvasRuntimeContext | null>(null);
  const trackerRef = useRef<PerfBudgetTracker | null>(null);
  const samplerRef = useRef<FpsSampler>(new FpsSampler());

  useEffect(() => {
    // Parse and validate config
    const config = parseCanvasConfig(rawConfig);

    // Merge scene-level overrides
    const sceneOverride = config.scenes[sectionId] ?? {};
    const sceneProps: SceneProps = {
      sectionId,
      theatreProjectId: config.theatreProjectId,
      theatreSheetId: sectionId,
      preferWebGpu: false,
      lenisDamping: 0.1,
      gsapTimescale: 1,
      motionPreset: config.defaultMotionPreset,
      perf: config.defaultPerfBudget,
      ...sceneOverride,
    };

    // Apply GSAP timescale
    setGsapTimescale(sceneProps.gsapTimescale);

    // Init Lenis
    createLenis({ damping: sceneProps.lenisDamping });

    // Theatre.js setup
    const project = getOrCreateProject(sceneProps.theatreProjectId);
    const sheet = getSheet(project, sceneProps.theatreSheetId);
    // Bind RAF driver to Theatre project
    getSharedRafDriver();

    // Perf tracker
    trackerRef.current = new PerfBudgetTracker(sceneProps.perf, (v) => {
      onPerfViolation?.(v.metric, v.ratio);
    });

    // WebGPU detection (non-blocking)
    detectWebGpu().then((caps) => {
      setCtx({ config, sceneProps, sheet, webGpuCaps: caps });
    });

    return () => {
      destroyLenis();
    };
  }, [sectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ctx) return null;

  return (
    <CanvasCtx.Provider value={ctx}>
      <div className={className} style={{ width: "100%", height: "100%", ...style }}>
        <Canvas
          frameloop="demand"
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <CanvasRuntimeLoop
            perfTracker={trackerRef.current!}
            fpsSampler={samplerRef.current}
          />
          {children}
        </Canvas>
      </div>
    </CanvasCtx.Provider>
  );
}
