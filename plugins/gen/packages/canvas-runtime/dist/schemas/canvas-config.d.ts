/**
 * Task 1: Zod schemas for canvas configuration and props.
 * Covers: CanvasConfig, SceneProps, MotionPreset, PerfBudget.
 */
import { z } from "zod";
export declare const MotionPresetSchema: z.ZodEnum<["ease-in-out", "ease-out", "ease-in", "linear", "spring", "overshoot", "anticipate"]>;
export type MotionPreset = z.infer<typeof MotionPresetSchema>;
export declare const PerfBudgetSchema: z.ZodObject<{
    /** Max allowed draw calls per frame */
    maxDrawCalls: z.ZodDefault<z.ZodNumber>;
    /** Max allowed triangle count across all meshes */
    maxTriangles: z.ZodDefault<z.ZodNumber>;
    /** Max allowed texture memory in bytes */
    maxTextureBytes: z.ZodDefault<z.ZodNumber>;
    /** Target frames per second (60 or 120) */
    targetFps: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<60>, z.ZodLiteral<120>]>>;
}, "strip", z.ZodTypeAny, {
    maxDrawCalls: number;
    maxTriangles: number;
    maxTextureBytes: number;
    targetFps: 120 | 60;
}, {
    maxDrawCalls?: number | undefined;
    maxTriangles?: number | undefined;
    maxTextureBytes?: number | undefined;
    targetFps?: 120 | 60 | undefined;
}>;
export type PerfBudget = z.infer<typeof PerfBudgetSchema>;
export declare const ScenePropsSchema: z.ZodObject<{
    /** Unique id matching the section slug in the pipeline */
    sectionId: z.ZodString;
    /** Theatre.js project id to bind this scene */
    theatreProjectId: z.ZodString;
    /** Theatre.js sheet id */
    theatreSheetId: z.ZodString;
    /** Whether to use WebGPU renderer when available */
    preferWebGpu: z.ZodDefault<z.ZodBoolean>;
    /** Lenis smooth-scroll dampening (0–1) */
    lenisDamping: z.ZodDefault<z.ZodNumber>;
    /** GSAP global timescale override */
    gsapTimescale: z.ZodDefault<z.ZodNumber>;
    /** Motion preset used for Theatre.js sequence playback */
    motionPreset: z.ZodDefault<z.ZodEnum<["ease-in-out", "ease-out", "ease-in", "linear", "spring", "overshoot", "anticipate"]>>;
    /** Per-scene performance budget */
    perf: z.ZodDefault<z.ZodObject<{
        /** Max allowed draw calls per frame */
        maxDrawCalls: z.ZodDefault<z.ZodNumber>;
        /** Max allowed triangle count across all meshes */
        maxTriangles: z.ZodDefault<z.ZodNumber>;
        /** Max allowed texture memory in bytes */
        maxTextureBytes: z.ZodDefault<z.ZodNumber>;
        /** Target frames per second (60 or 120) */
        targetFps: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<60>, z.ZodLiteral<120>]>>;
    }, "strip", z.ZodTypeAny, {
        maxDrawCalls: number;
        maxTriangles: number;
        maxTextureBytes: number;
        targetFps: 120 | 60;
    }, {
        maxDrawCalls?: number | undefined;
        maxTriangles?: number | undefined;
        maxTextureBytes?: number | undefined;
        targetFps?: 120 | 60 | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    sectionId: string;
    theatreProjectId: string;
    theatreSheetId: string;
    preferWebGpu: boolean;
    lenisDamping: number;
    gsapTimescale: number;
    motionPreset: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate";
    perf: {
        maxDrawCalls: number;
        maxTriangles: number;
        maxTextureBytes: number;
        targetFps: 120 | 60;
    };
}, {
    sectionId: string;
    theatreProjectId: string;
    theatreSheetId: string;
    preferWebGpu?: boolean | undefined;
    lenisDamping?: number | undefined;
    gsapTimescale?: number | undefined;
    motionPreset?: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate" | undefined;
    perf?: {
        maxDrawCalls?: number | undefined;
        maxTriangles?: number | undefined;
        maxTextureBytes?: number | undefined;
        targetFps?: 120 | 60 | undefined;
    } | undefined;
}>;
export type SceneProps = z.infer<typeof ScenePropsSchema>;
export declare const CanvasConfigSchema: z.ZodObject<{
    /** Genorah schema version */
    schemaVersion: z.ZodDefault<z.ZodLiteral<"4.0.0">>;
    /** Global Theatre.js project id */
    theatreProjectId: z.ZodDefault<z.ZodString>;
    /** Default performance budget applied to all scenes unless overridden */
    defaultPerfBudget: z.ZodDefault<z.ZodObject<{
        /** Max allowed draw calls per frame */
        maxDrawCalls: z.ZodDefault<z.ZodNumber>;
        /** Max allowed triangle count across all meshes */
        maxTriangles: z.ZodDefault<z.ZodNumber>;
        /** Max allowed texture memory in bytes */
        maxTextureBytes: z.ZodDefault<z.ZodNumber>;
        /** Target frames per second (60 or 120) */
        targetFps: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<60>, z.ZodLiteral<120>]>>;
    }, "strip", z.ZodTypeAny, {
        maxDrawCalls: number;
        maxTriangles: number;
        maxTextureBytes: number;
        targetFps: 120 | 60;
    }, {
        maxDrawCalls?: number | undefined;
        maxTriangles?: number | undefined;
        maxTextureBytes?: number | undefined;
        targetFps?: 120 | 60 | undefined;
    }>>;
    /** Default motion preset applied to all scenes unless overridden */
    defaultMotionPreset: z.ZodDefault<z.ZodEnum<["ease-in-out", "ease-out", "ease-in", "linear", "spring", "overshoot", "anticipate"]>>;
    /** Enable debug overlays (perf stats, Theatre.js studio) */
    debug: z.ZodDefault<z.ZodBoolean>;
    /** Per-section scene overrides keyed by sectionId */
    scenes: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        sectionId: z.ZodOptional<z.ZodString>;
        theatreProjectId: z.ZodOptional<z.ZodString>;
        theatreSheetId: z.ZodOptional<z.ZodString>;
        preferWebGpu: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        lenisDamping: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        gsapTimescale: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        motionPreset: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ease-in-out", "ease-out", "ease-in", "linear", "spring", "overshoot", "anticipate"]>>>;
        perf: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            /** Max allowed draw calls per frame */
            maxDrawCalls: z.ZodDefault<z.ZodNumber>;
            /** Max allowed triangle count across all meshes */
            maxTriangles: z.ZodDefault<z.ZodNumber>;
            /** Max allowed texture memory in bytes */
            maxTextureBytes: z.ZodDefault<z.ZodNumber>;
            /** Target frames per second (60 or 120) */
            targetFps: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<60>, z.ZodLiteral<120>]>>;
        }, "strip", z.ZodTypeAny, {
            maxDrawCalls: number;
            maxTriangles: number;
            maxTextureBytes: number;
            targetFps: 120 | 60;
        }, {
            maxDrawCalls?: number | undefined;
            maxTriangles?: number | undefined;
            maxTextureBytes?: number | undefined;
            targetFps?: 120 | 60 | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        sectionId?: string | undefined;
        theatreProjectId?: string | undefined;
        theatreSheetId?: string | undefined;
        preferWebGpu?: boolean | undefined;
        lenisDamping?: number | undefined;
        gsapTimescale?: number | undefined;
        motionPreset?: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate" | undefined;
        perf?: {
            maxDrawCalls: number;
            maxTriangles: number;
            maxTextureBytes: number;
            targetFps: 120 | 60;
        } | undefined;
    }, {
        sectionId?: string | undefined;
        theatreProjectId?: string | undefined;
        theatreSheetId?: string | undefined;
        preferWebGpu?: boolean | undefined;
        lenisDamping?: number | undefined;
        gsapTimescale?: number | undefined;
        motionPreset?: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate" | undefined;
        perf?: {
            maxDrawCalls?: number | undefined;
            maxTriangles?: number | undefined;
            maxTextureBytes?: number | undefined;
            targetFps?: 120 | 60 | undefined;
        } | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    debug: boolean;
    theatreProjectId: string;
    schemaVersion: "4.0.0";
    defaultPerfBudget: {
        maxDrawCalls: number;
        maxTriangles: number;
        maxTextureBytes: number;
        targetFps: 120 | 60;
    };
    defaultMotionPreset: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate";
    scenes: Record<string, {
        sectionId?: string | undefined;
        theatreProjectId?: string | undefined;
        theatreSheetId?: string | undefined;
        preferWebGpu?: boolean | undefined;
        lenisDamping?: number | undefined;
        gsapTimescale?: number | undefined;
        motionPreset?: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate" | undefined;
        perf?: {
            maxDrawCalls: number;
            maxTriangles: number;
            maxTextureBytes: number;
            targetFps: 120 | 60;
        } | undefined;
    }>;
}, {
    debug?: boolean | undefined;
    theatreProjectId?: string | undefined;
    schemaVersion?: "4.0.0" | undefined;
    defaultPerfBudget?: {
        maxDrawCalls?: number | undefined;
        maxTriangles?: number | undefined;
        maxTextureBytes?: number | undefined;
        targetFps?: 120 | 60 | undefined;
    } | undefined;
    defaultMotionPreset?: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate" | undefined;
    scenes?: Record<string, {
        sectionId?: string | undefined;
        theatreProjectId?: string | undefined;
        theatreSheetId?: string | undefined;
        preferWebGpu?: boolean | undefined;
        lenisDamping?: number | undefined;
        gsapTimescale?: number | undefined;
        motionPreset?: "linear" | "ease-in-out" | "ease-out" | "ease-in" | "spring" | "overshoot" | "anticipate" | undefined;
        perf?: {
            maxDrawCalls?: number | undefined;
            maxTriangles?: number | undefined;
            maxTextureBytes?: number | undefined;
            targetFps?: 120 | 60 | undefined;
        } | undefined;
    }> | undefined;
}>;
export type CanvasConfig = z.infer<typeof CanvasConfigSchema>;
export declare function parseCanvasConfig(input: unknown): CanvasConfig;
