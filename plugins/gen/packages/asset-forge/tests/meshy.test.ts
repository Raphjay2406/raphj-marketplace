import { describe, it, expect, vi, beforeEach } from "vitest";
import { MeshyProvider } from "../src/providers/meshy.js";
import { GenorahError } from "@genorah/protocol";

function mockFetchSuccess(url = "https://cdn.example.com/model.glb") {
  const blobBuffer = Buffer.from("fake-meshy-glb");
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

describe("MeshyProvider", () => {
  it("estimateCost returns $0.20 and 45s estimate", async () => {
    const p = new MeshyProvider({ apiKey: "test-key" });
    const est = await p.estimateCost({ prompt: "sci-fi chair" });
    expect(est.cost_usd).toBe(0.20);
    expect(est.duration_ms_estimate).toBe(45_000);
  });

  it("generate returns AssetResult with .glb path on success", async () => {
    globalThis.fetch = mockFetchSuccess();
    const p = new MeshyProvider({ apiKey: "test-key", downloadDir: "/tmp/meshy-test" });
    const result = await p.generate({ prompt: "sci-fi chair" });
    expect(result.provider).toBe("meshy");
    expect(result.path).toMatch(/\.glb$/);
    expect(result.cost_usd).toBe(0.20);
    expect(result.sha256).toHaveLength(64);
  });

  it("throws GenorahError with PROVIDER_UNAVAILABLE on non-200 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as unknown as Response);
    const p = new MeshyProvider({ apiKey: "test-key" });
    let caught: GenorahError | undefined;
    try {
      await p.generate({ prompt: "sci-fi chair" });
    } catch (e) {
      caught = e as GenorahError;
    }
    expect(caught).toBeInstanceOf(GenorahError);
    expect(caught?.structured.code).toBe("PROVIDER_UNAVAILABLE");
    expect(caught?.structured.retry_strategy?.fallback_worker).toBe("flux-kontext");
  });
});
