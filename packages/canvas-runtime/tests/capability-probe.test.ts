import { describe, it, expect, vi, beforeEach } from "vitest";
import { probeCapabilities, shouldLoadCinematicBundle } from "../src/CapabilityProbe.js";
import { resetWebGpuCache } from "../src/webgpu/feature-detect.js";

beforeEach(() => {
  // Reset globals and the detectWebGpu memoization cache before each test
  (globalThis as any).navigator = {} as any;
  resetWebGpuCache();
});

describe("probeCapabilities", () => {
  it("returns webgpu=false when navigator.gpu is missing", async () => {
    const caps = await probeCapabilities();
    expect(caps.webgpu).toBe(false);
  });

  it("returns webgpu=true when adapter resolves", async () => {
    (globalThis as any).navigator.gpu = { requestAdapter: vi.fn(async () => ({ features: new Set() })) };
    const caps = await probeCapabilities();
    expect(caps.webgpu).toBe(true);
  });

  it("shouldLoadCinematicBundle requires all 4 conditions", () => {
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.5, connection_kbps: 8000, device_memory_gb: 6 })).toBe(true);
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.1, connection_kbps: 8000, device_memory_gb: 6 })).toBe(false);
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.5, connection_kbps: 1000, device_memory_gb: 6 })).toBe(false);
    expect(shouldLoadCinematicBundle({ webgl2: true, webgpu: false, battery: 0.5, connection_kbps: 8000, device_memory_gb: 2 })).toBe(false);
    expect(shouldLoadCinematicBundle({ webgl2: false, webgpu: false, battery: 0.9, connection_kbps: 10000, device_memory_gb: 16 })).toBe(false);
  });
});
