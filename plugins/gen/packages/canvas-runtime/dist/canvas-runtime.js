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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useState, } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { parseCanvasConfig } from "./schemas/canvas-config.js";
import { getOrCreateProject, getSheet, getSharedRafDriver, tickRafDriver, } from "./theatre.js";
import { createLenis, tickLenis, destroyLenis } from "./lenis-adapter.js";
import { setGsapTimescale } from "./gsap-adapter.js";
import { detectWebGpu } from "./webgpu/feature-detect.js";
import { PerfBudgetTracker, FpsSampler } from "./perf-budget.js";
const CanvasCtx = createContext(null);
export function useCanvasRuntime() {
    const ctx = useContext(CanvasCtx);
    if (!ctx)
        throw new Error("useCanvasRuntime must be used inside <CanvasRuntime>");
    return ctx;
}
// ---------------------------------------------------------------------------
// Inner loop component (runs inside R3F canvas)
// ---------------------------------------------------------------------------
function CanvasRuntimeLoop({ perfTracker, fpsSampler }) {
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
export function CanvasRuntime({ config: rawConfig, sectionId, className, style, onPerfViolation, children, }) {
    const [ctx, setCtx] = useState(null);
    const trackerRef = useRef(null);
    const samplerRef = useRef(new FpsSampler());
    useEffect(() => {
        // Parse and validate config
        const config = parseCanvasConfig(rawConfig);
        // Merge scene-level overrides
        const sceneOverride = config.scenes[sectionId] ?? {};
        const sceneProps = {
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
    if (!ctx)
        return null;
    return (_jsx(CanvasCtx.Provider, { value: ctx, children: _jsx("div", { className: className, style: { width: "100%", height: "100%", ...style }, children: _jsxs(Canvas, { frameloop: "demand", gl: { antialias: true }, dpr: [1, 2], children: [_jsx(CanvasRuntimeLoop, { perfTracker: trackerRef.current, fpsSampler: samplerRef.current }), children] }) }) }));
}
