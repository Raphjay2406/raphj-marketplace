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

let cached: WebGpuCapabilities | null = null;

/**
 * Detect WebGPU support and return a capabilities object.
 * Result is memoized — safe to call on every frame init.
 */
export async function detectWebGpu(): Promise<WebGpuCapabilities> {
  if (cached) return cached;

  // SSR guard
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    cached = {
      gpuApiPresent: false,
      adapterAvailable: false,
      deviceAvailable: false,
      tier: "none",
    };
    return cached;
  }

  const gpuApiPresent = "gpu" in navigator;
  if (!gpuApiPresent) {
    cached = resolveWebGlFallback(false, false);
    return cached;
  }

  let adapter: GPUAdapter | null = null;
  try {
    adapter = await (navigator as Navigator & { gpu: GPU }).gpu.requestAdapter();
  } catch {
    // requestAdapter rejected (e.g. in a sandboxed iframe)
  }

  if (!adapter) {
    cached = resolveWebGlFallback(true, false);
    return cached;
  }

  let device: GPUDevice | null = null;
  try {
    device = await adapter.requestDevice();
  } catch {
    // requestDevice can fail on some drivers
  }

  const adapterInfo: GPUAdapterInfo | undefined = await (adapter as GPUAdapter & { requestAdapterInfo?: () => Promise<GPUAdapterInfo> })
    .requestAdapterInfo?.().catch(() => undefined);

  const maxTextureDimension2D: number | undefined = device
    ? (device.limits as GPUSupportedLimits & { maxTextureDimension2D: number }).maxTextureDimension2D
    : undefined;

  cached = {
    gpuApiPresent: true,
    adapterAvailable: true,
    deviceAvailable: !!device,
    tier: device ? "webgpu" : "webgl2",
    adapterInfo: adapterInfo ?? undefined,
    maxTextureDimension2D,
  };

  return cached;
}

function resolveWebGlFallback(gpuApiPresent: boolean, adapterAvailable: boolean): WebGpuCapabilities {
  // Check WebGL2
  let tier: RendererTier = "none";
  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      if (canvas.getContext("webgl2")) tier = "webgl2";
      else if (canvas.getContext("webgl")) tier = "webgl1";
    } catch {
      // headless environment
    }
  }
  return { gpuApiPresent, adapterAvailable, deviceAvailable: false, tier };
}

/**
 * Synchronous check — returns cached result (undefined if not yet detected).
 */
export function getCachedWebGpuCapabilities(): WebGpuCapabilities | null {
  return cached;
}

/**
 * Reset the detection cache. Useful in tests.
 */
export function resetWebGpuCache(): void {
  cached = null;
}
