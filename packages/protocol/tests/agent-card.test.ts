import { describe, it, expect } from "vitest";
import { buildAgentCard, AgentCardSchema } from "../src/agent-card.js";

const frontmatter = {
  name: "creative-director",
  id: "genorah/creative-director",
  version: "4.0.0",
  channel: "stable" as const,
  description: "Owns taste, archetype personality, creative direction",
  tier: "director" as const,
  capabilities: [
    { id: "review-plan", input: "PlanInput", output: "PlanReview" },
    { id: "approve-wave", input: "WaveSummary", output: "Approval" }
  ],
  tools: ["Read", "Write", "Edit"]
};

describe("buildAgentCard", () => {
  it("produces an A2A v0.3 compliant card", () => {
    const card = buildAgentCard(frontmatter);
    expect(card.schema_version).toBe("a2a-v0.3");
    expect(card.id).toBe("genorah/creative-director");
    expect(card.version).toBe("4.0.0");
    expect(card.channel).toBe("stable");
    expect(card.capabilities).toHaveLength(2);
  });

  it("fills default auth (none local, oauth remote)", () => {
    const card = buildAgentCard(frontmatter);
    expect(card.auth.local.type).toBe("none");
    expect(card.auth.remote.type).toBe("oauth2");
    expect(card.auth.remote.flow).toBe("authorization_code_pkce");
  });

  it("declares streaming + mcp sampling support", () => {
    const card = buildAgentCard(frontmatter);
    expect(card.streaming.supports_sse).toBe(true);
    expect(card.streaming.ag_ui_events).toBe(true);
    expect(card.mcp.sampling_v2_compatible).toBe(true);
  });

  it("validates against AgentCardSchema", () => {
    const card = buildAgentCard(frontmatter);
    expect(() => AgentCardSchema.parse(card)).not.toThrow();
  });

  it("rejects card with invalid channel", () => {
    const bad = { ...frontmatter, channel: "flaky" as any };
    expect(() => buildAgentCard(bad)).toThrow();
  });
});
