import { describe, it, expect } from "vitest";
import { StructuredError, parseStructuredError, ErrorCodes } from "../src/errors.js";

describe("StructuredError", () => {
  it("accepts a known code + recovery hint", () => {
    const err: StructuredError = {
      code: "VALIDATOR_REJECTED",
      message: "dna-compliance verdict false",
      recovery_hint: "rerun_upstream"
    };
    expect(parseStructuredError(err).code).toBe("VALIDATOR_REJECTED");
  });

  it("rejects an unknown code", () => {
    expect(() =>
      parseStructuredError({ code: "NOPE", message: "x", recovery_hint: "retry_with_fallback" } as any)
    ).toThrow();
  });

  it("requires recovery_hint", () => {
    expect(() =>
      parseStructuredError({ code: "WORKER_TIMEOUT", message: "x" } as any)
    ).toThrow(/recovery_hint/);
  });

  it("optional retry_strategy validates max_attempts", () => {
    expect(() =>
      parseStructuredError({
        code: "WORKER_TIMEOUT",
        message: "x",
        recovery_hint: "retry_with_fallback",
        retry_strategy: { max_attempts: -1, backoff_ms: 1000 }
      } as any)
    ).toThrow();
  });

  it("ErrorCodes enumerates all supported codes", () => {
    expect(ErrorCodes).toContain("DNA_DRIFT");
    expect(ErrorCodes).toContain("COST_CAP_HIT");
    expect(ErrorCodes).toContain("PROVIDER_UNAVAILABLE");
  });
});
