import { describe, it, expect } from "vitest";
import { ResultEnvelope, parseResultEnvelope } from "../src/envelope.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../src/schemas/result-envelope.schema.json" with { type: "json" };

describe("ResultEnvelope", () => {
  it("accepts a minimal ok envelope", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "ok",
      artifact: { path: "sections/hero/page.tsx" },
      verdicts: [],
      followups: []
    };
    const parsed = parseResultEnvelope(envelope);
    expect(parsed.status).toBe("ok");
  });

  it("requires artifact", () => {
    expect(() =>
      parseResultEnvelope({ schema_version: "4.0.0", status: "ok", verdicts: [], followups: [] } as any)
    ).toThrow(/artifact/i);
  });

  it("accepts verdicts with optional score", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "ok",
      artifact: {},
      verdicts: [
        { validator: "dna-compliance", pass: true, score: 0.92, notes: "ok" },
        { validator: "license", pass: true }
      ],
      followups: []
    };
    expect(parseResultEnvelope(envelope).verdicts).toHaveLength(2);
  });

  it("rejects status outside enum", () => {
    expect(() =>
      parseResultEnvelope({ schema_version: "4.0.0", status: "mostly", artifact: {}, verdicts: [], followups: [] } as any)
    ).toThrow();
  });

  it("accepts trace when present", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "ok",
      artifact: {},
      verdicts: [],
      followups: [],
      trace: {
        decisions: [{ step: "pick-preset", chose: "cinematic", reason: "archetype matches" }],
        skills_used: ["persistent-canvas-pattern"],
        cost: { tokens_in: 2100, tokens_out: 840, api_spend_usd: 0.35 }
      }
    };
    const parsed = parseResultEnvelope(envelope);
    expect(parsed.trace?.cost.api_spend_usd).toBe(0.35);
  });

  it("accepts followups with context_override", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "partial",
      artifact: {},
      verdicts: [{ validator: "dna-compliance", pass: false, score: 0.72, notes: "coverage low" }],
      followups: [
        { suggested_worker: "inpainter", reason: "raise coverage", context_override: { strength: 0.85 } }
      ]
    };
    expect(parseResultEnvelope(envelope).followups[0].suggested_worker).toBe("inpainter");
  });
});

describe("result-envelope JSON Schema", () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  it("accepts a minimal ok envelope", () => {
    const ok = validate({
      schema_version: "4.0.0",
      status: "ok",
      artifact: {},
      verdicts: [],
      followups: []
    });
    expect(ok).toBe(true);
  });
});
