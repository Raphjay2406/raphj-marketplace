import React, { type PropsWithChildren } from "react";
import type { CanvasConfig, SceneProps } from "./schemas/canvas-config.js";
import { type ISheet } from "./theatre.js";
import { type WebGpuCapabilities } from "./webgpu/feature-detect.js";
export interface CanvasRuntimeContext {
    config: CanvasConfig;
    sceneProps: SceneProps;
    sheet: ISheet;
    webGpuCaps: WebGpuCapabilities | null;
}
export declare function useCanvasRuntime(): CanvasRuntimeContext;
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
export declare function CanvasRuntime({ config: rawConfig, sectionId, className, style, onPerfViolation, children, }: CanvasRuntimeProps): import("react/jsx-runtime").JSX.Element | null;
