import { describe, it, expect, vi } from "vitest";
import { registerAgentAsMcpPrimitive, buildSamplingRequest } from "../src/mcp-sampling.js";
import { ok } from "../src/envelope.js";

describe("MCP sampling v2 adapter", () => {
  it("builds a sampling/createMessage request with sanitized params", () => {
    const req = buildSamplingRequest({
      agent_id: "genorah/creative-director",
      capability: "review-plan",
      payload: { plan: "x" }
    });
    expect(req.method).toBe("sampling/createMessage");
    expect(req.params.metadata.agent_id).toBe("genorah/creative-director");
    expect(req.params.metadata.capability).toBe("review-plan");
  });

  it("registerAgentAsMcpPrimitive wires the handler", async () => {
    const handler = vi.fn(async () => ok({ approved: true }));
    const registry: Record<string, Function> = {};
    registerAgentAsMcpPrimitive(registry, {
      agent_id: "genorah/creative-director",
      capability: "review-plan",
      handler
    });
    const key = "genorah/creative-director/review-plan";
    expect(registry[key]).toBeDefined();
    const result = await registry[key]({ plan: "x" });
    expect(handler).toHaveBeenCalledOnce();
    expect(result.artifact.approved).toBe(true);
  });
});
