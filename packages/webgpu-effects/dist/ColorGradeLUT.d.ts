import React from "react";
export interface ColorGradeLUTProps {
    /**
     * LUT data as a flat Float32Array of RGBA values for a 16×16×16 3D LUT.
     * If omitted, identity LUT is used.
     */
    lut?: Float32Array;
    /** Overall grade strength 0–1 (blends between identity and lut) */
    strength?: number;
    /** CSS filter fallback string (e.g. "saturate(1.2) contrast(1.1)") */
    cssFallback?: string;
    className?: string;
    children?: React.ReactNode;
}
/**
 * ColorGradeLUT — applies a 3D LUT colour grade via WebGPU compute + texture sampling.
 * Falls back to CSS `filter` when WebGPU is unavailable.
 */
export declare function ColorGradeLUT({ lut, strength, cssFallback, className, children, }: ColorGradeLUTProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ColorGradeLUT.d.ts.map