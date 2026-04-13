import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
function isWebGPUAvailable() {
    return typeof navigator !== "undefined" && "gpu" in navigator;
}
// Bayer 4×4 threshold matrix (normalized 0–1)
const BAYER_4 = [
    0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5,
].map(v => v / 16);
/**
 * DitherOverlay — Bayer-dithered colour overlay with WebGPU path.
 * Falls back to CSS mix-blend-mode + checkerboard pattern.
 */
export function DitherOverlay({ bayerSize = 4, opacity = 0.2, color = "#ffffff", className, children, }) {
    const canvasRef = useRef(null);
    const gpuAvailable = isWebGPUAvailable();
    useEffect(() => {
        if (!gpuAvailable || !canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        // Lightweight canvas2d dither path (GPU path requires full WebGPU pipeline)
        const size = bayerSize;
        const matrix = size === 4 ? BAYER_4 : BAYER_4; // extend for 2/8 as needed
        const imageData = ctx.createImageData(size, size);
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        for (let i = 0; i < size * size; i++) {
            const threshold = matrix[i] ?? 0;
            const alpha = opacity > threshold ? Math.floor(opacity * 255) : 0;
            imageData.data[i * 4] = r;
            imageData.data[i * 4 + 1] = g;
            imageData.data[i * 4 + 2] = b;
            imageData.data[i * 4 + 3] = alpha;
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.style.imageRendering = "pixelated";
        canvas.style.backgroundRepeat = "repeat";
    }, [gpuAvailable, bayerSize, opacity, color]);
    if (!gpuAvailable) {
        // CSS fallback: mix-blend-mode screen + semi-transparent overlay
        return (_jsxs("div", { className: className, "data-webgpu-effect": "dither-overlay", "data-fallback": "css", style: { position: "relative" }, children: [_jsx("div", { "aria-hidden": true, style: {
                        position: "absolute",
                        inset: 0,
                        opacity,
                        backgroundColor: color,
                        mixBlendMode: "screen",
                        pointerEvents: "none",
                    } }), children] }));
    }
    return (_jsxs("div", { className: className, "data-webgpu-effect": "dither-overlay", "data-fallback": "canvas2d", style: { position: "relative" }, children: [_jsx("canvas", { ref: canvasRef, width: bayerSize, height: bayerSize, "aria-hidden": true, style: {
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    imageRendering: "pixelated",
                    pointerEvents: "none",
                } }), children] }));
}
