import { describe, it, expect, afterEach } from "vitest";
import { startDaemon, Daemon } from "../src/daemon.js";
import { ok } from "../src/envelope.js";
import { buildAgentCard } from "../src/agent-card.js";

let daemon: Daemon | null = null;

afterEach(async () => {
  await daemon?.stop();
  daemon = null;
});

describe("E2E external A2A", () => {
  it("external curl-style call reaches the creative-director handler", async () => {
    const card = buildAgentCard({
      name: "creative-director",
      id: "genorah/creative-director",
      version: "4.0.0",
      channel: "stable",
      description: "x",
      tier: "director",
      capabilities: [{ id: "review-plan", input: "PlanInput", output: "PlanReview" }]
    });
    const agents = new Map([
      ["creative-director", { card, handler: async (p: any) => ok({ approved: true, echo: p }) }]
    ]);
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });

    const res = await fetch(`${daemon.url}/a2a/creative-director/review-plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "v4 M1 plan" })
    });
    expect(res.status).toBe(200);
    const env = await res.json();
    expect(env.status).toBe("ok");
    expect(env.artifact.approved).toBe(true);
    expect(env.correlation_id).toMatch(/[\w-]{8,}/);
  });

  it("agent-card.json lists registered agents", async () => {
    const card = buildAgentCard({
      name: "scene-director", id: "genorah/scene-director", version: "4.0.0", channel: "stable",
      description: "x", tier: "director", capabilities: [{ id: "choreograph-scene" }]
    });
    const agents = new Map([["scene-director", { card, handler: async () => ok({}) }]]);
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });
    const list = await fetch(`${daemon.url}/.well-known/agent.json`).then(r => r.json());
    expect(list.agents.map((a: any) => a.id)).toContain("genorah/scene-director");
  });
});
