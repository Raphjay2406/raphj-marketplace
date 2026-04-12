import { describe, it, expect } from "vitest";
import { DummyProvider } from "../src/providers/base.js";

describe("AssetProvider base", () => {
  it("DummyProvider returns a deterministic artifact", async () => {
    const p = new DummyProvider();
    const r = await p.generate({ prompt: "hi" });
    expect(r.provider).toBe("dummy");
    expect(r.cost_usd).toBe(0);
    expect(typeof r.sha256).toBe("string");
  });

  it("exposes cost estimation", async () => {
    const p = new DummyProvider();
    const est = await p.estimateCost({ prompt: "hi" });
    expect(est.cost_usd).toBe(0);
    expect(est.duration_ms_estimate).toBeGreaterThan(0);
  });
});
