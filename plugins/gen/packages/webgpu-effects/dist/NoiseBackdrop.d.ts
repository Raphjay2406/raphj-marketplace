import React from "react";
export interface NoiseBackdropProps {
    /** Noise intensity 0–1 */
    intensity?: number;
    /** Backdrop blur radius in px (CSS fallback) */
    blurPx?: number;
    className?: string;
    children?: React.ReactNode;
}
/**
 * NoiseBackdrop — DNA-matched noise overlay with WebGPU shader path.
 * Falls back to CSS `backdrop-filter` + SVG feTurbulence when WebGPU unavailable.
 */
export declare function NoiseBackdrop({ intensity, blurPx, className, children, }: NoiseBackdropProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NoiseBackdrop.d.ts.map