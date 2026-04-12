import { describe, it, expect, afterEach, vi } from "vitest";
import { detectWebGpu, getCachedWebGpuCapabilities, resetWebGpuCache } from "../src/webgpu/feature-detect.js";

afterEach(() => {
  resetWebGpuCache();
  vi.unstubAllGlobals();
});

describe("detectWebGpu — SSR / Node environment", () => {
  it("returns tier=none when window is undefined", async () => {
    // In the vitest Node environment, window is not a browser window
    // Stub navigator to have no gpu property
    vi.stubGlobal("navigator", {});
    const caps = await detectWebGpu();
    expect(caps.gpuApiPresent).toBe(false);
    expect(caps.tier).toBe("none");
  });

  it("caches result after first call", async () => {
    vi.stubGlobal("navigator", {});
    await detectWebGpu();
    const cached = getCachedWebGpuCapabilities();
    expect(cached).not.toBeNull();
    // Second call returns same object
    const second = await detectWebGpu();
    expect(second).toBe(cached);
  });
});

describe("detectWebGpu — with mocked navigator.gpu", () => {
  it("returns adapterAvailable=false when requestAdapter returns null", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      gpu: {
        requestAdapter: async () => null,
      },
    });
    const caps = await detectWebGpu();
    expect(caps.gpuApiPresent).toBe(true);
    expect(caps.adapterAvailable).toBe(false);
  });

  it("returns tier=webgpu when adapter and device are available", async () => {
    const mockDevice = {
      limits: { maxTextureDimension2D: 8192 },
    };
    const mockAdapter = {
      requestDevice: async () => mockDevice,
      requestAdapterInfo: async () => ({ vendor: "NVIDIA" } as unknown as GPUAdapterInfo),
    };
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      gpu: {
        requestAdapter: async () => mockAdapter,
      },
    });

    const caps = await detectWebGpu();
    expect(caps.gpuApiPresent).toBe(true);
    expect(caps.adapterAvailable).toBe(true);
    expect(caps.deviceAvailable).toBe(true);
    expect(caps.tier).toBe("webgpu");
    expect(caps.maxTextureDimension2D).toBe(8192);
  });

  it("returns tier=webgl2 when adapter available but device fails", async () => {
    const mockAdapter = {
      requestDevice: async () => { throw new Error("device lost"); },
    };
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {
      gpu: {
        requestAdapter: async () => mockAdapter,
      },
    });
    // Also stub document for WebGL2 fallback check
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: (type: string) => type === "webgl2" ? {} : null,
      }),
    });

    const caps = await detectWebGpu();
    expect(caps.adapterAvailable).toBe(true);
    expect(caps.deviceAvailable).toBe(false);
    expect(caps.tier).toBe("webgl2");
  });
});

describe("resetWebGpuCache", () => {
  it("clears cached result", async () => {
    vi.stubGlobal("navigator", {});
    await detectWebGpu();
    expect(getCachedWebGpuCapabilities()).not.toBeNull();
    resetWebGpuCache();
    expect(getCachedWebGpuCapabilities()).toBeNull();
  });
});
