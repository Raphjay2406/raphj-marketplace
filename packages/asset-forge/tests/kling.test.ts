import { describe, it, expect, vi, beforeEach } from "vitest";
import { KlingProvider } from "../src/providers/kling.js";
import { GenorahError } from "@genorah/protocol";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("KlingProvider", () => {
  it("estimateCost with duration=6 returns $2.10", async () => {
    const p = new KlingProvider({ apiKey: "test-key" });
    const est = await p.estimateCost({ prompt: "cinematic pan", params: { duration_seconds: 6 } });
    expect(est.cost_usd).toBe(2.10);
    expect(est.duration_ms_estimate).toBe(48_000);
  });

  it("throws GenorahError with PROVIDER_UNAVAILABLE on non-200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    } as unknown as Response);

    const p = new KlingProvider({ apiKey: "test-key" });
    let caught: GenorahError | undefined;
    try {
      await p.generate({ prompt: "cinematic pan" });
    } catch (e) {
      caught = e as GenorahError;
    }
    expect(caught).toBeInstanceOf(GenorahError);
    expect(caught?.structured.code).toBe("PROVIDER_UNAVAILABLE");
  });
});
