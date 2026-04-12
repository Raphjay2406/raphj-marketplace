import { describe, it, expect } from "vitest";
import { CostLedger } from "../src/cost-ledger.js";

describe("CostLedger", () => {
  it("starts at zero spend", () => {
    const l = new CostLedger({ budget_usd: 30 });
    expect(l.spend_usd).toBe(0);
    expect(l.status()).toBe("ok");
  });

  it("transitions to warn at >= 80% of budget", () => {
    const l = new CostLedger({ budget_usd: 10 });
    l.record({ provider: "rodin", cost_usd: 8 });
    expect(l.status()).toBe("warn");
  });

  it("transitions to exceeded over budget", () => {
    const l = new CostLedger({ budget_usd: 10 });
    l.record({ provider: "rodin", cost_usd: 12 });
    expect(l.status()).toBe("exceeded");
  });

  it("pickDowngrade returns the cheaper provider when over budget", () => {
    const l = new CostLedger({ budget_usd: 10, downgrade_chain: { rodin: "meshy", kling: "flux-kontext" } });
    l.record({ provider: "rodin", cost_usd: 12 });
    expect(l.pickDowngrade("rodin")).toBe("meshy");
  });

  it("preview does not mutate ledger", () => {
    const l = new CostLedger({ budget_usd: 10 });
    l.preview({ provider: "rodin", cost_usd: 5 });
    expect(l.spend_usd).toBe(0);
  });
});
