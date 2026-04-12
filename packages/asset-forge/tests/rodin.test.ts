import { describe, it, expect, vi, beforeEach } from "vitest";
import { RodinProvider } from "../src/providers/rodin.js";
import { GenorahError } from "@genorah/protocol";

function mockFetchSuccess(url = "https://cdn.example.com/model.glb") {
  const blobBuffer = Buffer.from("fake-glb-data");
  return vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url }),
    } as unknown as Response)
    .mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => blobBuffer.buffer,
    } as unknown as Response);
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("RodinProvider", () => {
  it("estimateCost returns $0.35 fixed price", async () => {
    const p = new RodinProvider({ apiKey: "test-key" });
    const est = await p.estimateCost({ prompt: "stone bust" });
    expect(est.cost_usd).toBe(0.35);
    expect(est.duration_ms_estimate).toBe(90_000);
  });

  it("generate returns AssetResult with .glb path on success", async () => {
    globalThis.fetch = mockFetchSuccess();
    const p = new RodinProvider({ apiKey: "test-key", downloadDir: "/tmp/rodin-test" });
    const result = await p.generate({ prompt: "stone bust" });
    expect(result.provider).toBe("rodin");
    expect(result.path).toMatch(/\.glb$/);
    expect(result.cost_usd).toBe(0.35);
    expect(typeof result.sha256).toBe("string");
    expect(result.sha256).toHaveLength(64);
  });

  it("throws GenorahError with PROVIDER_UNAVAILABLE on non-200 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    } as unknown as Response);
    const p = new RodinProvider({ apiKey: "test-key" });
    let caught: GenorahError | undefined;
    try {
      await p.generate({ prompt: "stone bust" });
    } catch (e) {
      caught = e as GenorahError;
    }
    expect(caught).toBeInstanceOf(GenorahError);
    expect(caught?.structured.code).toBe("PROVIDER_UNAVAILABLE");
    expect(caught?.structured.retry_strategy?.fallback_worker).toBe("meshy");
  });
});
