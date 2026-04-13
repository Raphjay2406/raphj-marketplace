import React from "react";
export interface DitherOverlayProps {
    /** Bayer matrix size: 2, 4, or 8 */
    bayerSize?: 2 | 4 | 8;
    /** Overlay opacity 0–1 */
    opacity?: number;
    /** Dither color (CSS hex, used in fallback) */
    color?: string;
    className?: string;
    children?: React.ReactNode;
}
/**
 * DitherOverlay — Bayer-dithered colour overlay with WebGPU path.
 * Falls back to CSS mix-blend-mode + checkerboard pattern.
 */
export declare function DitherOverlay({ bayerSize, opacity, color, className, children, }: DitherOverlayProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DitherOverlay.d.ts.map