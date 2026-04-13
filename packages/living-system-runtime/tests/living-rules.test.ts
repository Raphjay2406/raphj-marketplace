import { describe, it, expect } from "vitest";
import { LivingRulesSchema } from "../src/schemas/living-rules.schema.js";

describe("LivingRulesSchema", () => {
  it("accepts a minimal rule set", () => {
    const rules = {
      schema_version: "4.0.0",
      signals: ["time_of_day", "scroll_velocity"],
      rules: [
        { signal: "time_of_day", predicate: { between: ["18:00","23:59"] }, delta: { "--color-bg": "#0f0e12", "--color-primary": "#f5b85c" } },
        { signal: "scroll_velocity", predicate: { gt: 1200 }, delta: { "--density": "dense" } }
      ]
    };
    expect(() => LivingRulesSchema.parse(rules)).not.toThrow();
  });

  it("rejects a rule with unknown signal", () => {
    expect(() => LivingRulesSchema.parse({
      schema_version: "4.0.0", signals: ["time_of_day"], rules: [{ signal: "unknown", predicate: {}, delta: {} }]
    })).toThrow();
  });

  it("validates predicate shapes", () => {
    expect(() => LivingRulesSchema.parse({
      schema_version: "4.0.0", signals: ["battery"], rules: [{ signal: "battery", predicate: { lt: 0.2 }, delta: { "--motion": "reduced" } }]
    })).not.toThrow();
  });
});
