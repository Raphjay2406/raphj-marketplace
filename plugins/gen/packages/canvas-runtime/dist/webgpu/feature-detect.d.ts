/**
 * Task 6: WebGPU feature detection.
 *
 * Provides async detection of WebGPU availability and adapter capabilities.
 * Results are cached after the first call. Falls back gracefully to WebGL2.
 */
export type RendererTier = "webgpu" | "webgl2" | "webgl1" | "none";
export interface WebGpuCapabilities {
    /** Whether the browser exposes navigator.gpu */
    gpuApiPresent: boolean;
    /** Whether requestAdapter() succeeded */
    adapterAvailable: boolean;
    /** Whether requestDevice() succeeded */
    deviceAvailable: boolean;
    /** Resolved renderer tier */
    tier: RendererTier;
    /** Optional human-readable adapter info */
    adapterInfo?: GPUAdapterInfo;
    /** Max texture dimension (indicator of GPU capability) */
    maxTextureDimension2D?: number;
}
/**
 * Detect WebGPU support and return a capabilities object.
 * Result is memoized — safe to call on every frame init.
 */
export declare function detectWebGpu(): Promise<WebGpuCapabilities>;
/**
 * Synchronous check — returns cached result (undefined if not yet detected).
 */
export declare function getCachedWebGpuCapabilities(): WebGpuCapabilities | null;
/**
 * Reset the detection cache. Useful in tests.
 */
export declare function resetWebGpuCache(): void;
