/**
 * Task 1: Zod schemas for canvas configuration and props.
 * Covers: CanvasConfig, SceneProps, MotionPreset, PerfBudget.
 */
import { z } from "zod";
// ---------------------------------------------------------------------------
// Motion presets — mirrors the 7 cubic-Bezier easing presets from
// scripts/ingest/interaction-replay.mjs
// ---------------------------------------------------------------------------
export const MotionPresetSchema = z.enum([
    "ease-in-out",
    "ease-out",
    "ease-in",
    "linear",
    "spring",
    "overshoot",
    "anticipate",
]);
// ---------------------------------------------------------------------------
// Performance budget — governs GPU/CPU limits per scene
// ---------------------------------------------------------------------------
export const PerfBudgetSchema = z.object({
    /** Max allowed draw calls per frame */
    maxDrawCalls: z.number().int().positive().default(150),
    /** Max allowed triangle count across all meshes */
    maxTriangles: z.number().int().positive().default(500_000),
    /** Max allowed texture memory in bytes */
    maxTextureBytes: z.number().int().positive().default(64 * 1024 * 1024), // 64 MB
    /** Target frames per second (60 or 120) */
    targetFps: z.union([z.literal(60), z.literal(120)]).default(60),
});
// ---------------------------------------------------------------------------
// Scene props — per-section canvas descriptor
// ---------------------------------------------------------------------------
export const ScenePropsSchema = z.object({
    /** Unique id matching the section slug in the pipeline */
    sectionId: z.string().min(1),
    /** Theatre.js project id to bind this scene */
    theatreProjectId: z.string().min(1),
    /** Theatre.js sheet id */
    theatreSheetId: z.string().min(1),
    /** Whether to use WebGPU renderer when available */
    preferWebGpu: z.boolean().default(false),
    /** Lenis smooth-scroll dampening (0–1) */
    lenisDamping: z.number().min(0).max(1).default(0.1),
    /** GSAP global timescale override */
    gsapTimescale: z.number().positive().default(1),
    /** Motion preset used for Theatre.js sequence playback */
    motionPreset: MotionPresetSchema.default("ease-out"),
    /** Per-scene performance budget */
    perf: PerfBudgetSchema.default({}),
});
// ---------------------------------------------------------------------------
// Canvas runtime config — top-level, per project
// ---------------------------------------------------------------------------
export const CanvasConfigSchema = z.object({
    /** Genorah schema version */
    schemaVersion: z.literal("4.0.0").default("4.0.0"),
    /** Global Theatre.js project id */
    theatreProjectId: z.string().min(1).default("genorah-canvas"),
    /** Default performance budget applied to all scenes unless overridden */
    defaultPerfBudget: PerfBudgetSchema.default({}),
    /** Default motion preset applied to all scenes unless overridden */
    defaultMotionPreset: MotionPresetSchema.default("ease-out"),
    /** Enable debug overlays (perf stats, Theatre.js studio) */
    debug: z.boolean().default(false),
    /** Per-section scene overrides keyed by sectionId */
    scenes: z.record(z.string(), ScenePropsSchema.partial()).default({}),
});
export function parseCanvasConfig(input) {
    return CanvasConfigSchema.parse(input);
}
