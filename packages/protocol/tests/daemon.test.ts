import { describe, it, expect, afterEach } from "vitest";
import { startDaemon, Daemon } from "../src/daemon.js";
import { ok } from "../src/envelope.js";

let daemon: Daemon | null = null;

afterEach(async () => {
  await daemon?.stop();
  daemon = null;
});

describe("protocol daemon", () => {
  it("starts on 127.0.0.1 and reports its port", async () => {
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents: new Map() });
    expect(daemon.host).toBe("127.0.0.1");
    expect(daemon.port).toBeGreaterThan(0);
  });

  it("serves /.well-known/agent.json for a registered agent", async () => {
    const agents = new Map();
    agents.set("creative-director", {
      card: {
        schema_version: "a2a-v0.3",
        id: "genorah/creative-director",
        version: "4.0.0",
        channel: "stable",
        name: "Creative Director",
        description: "x",
        tier: "director",
        capabilities: [{ id: "review-plan" }],
        tools: [],
        auth: { local: { type: "none" }, remote: { type: "oauth2", flow: "authorization_code_pkce" } },
        streaming: { supports_sse: true, ag_ui_events: true },
        mcp: { sampling_v2_compatible: true }
      },
      handler: async () => ok({ ok: true })
    });
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });
    const res = await fetch(`${daemon.url}/.well-known/agent.json`);
    const list = await res.json();
    expect(res.status).toBe(200);
    expect(list.agents).toContainEqual(expect.objectContaining({ id: "genorah/creative-director" }));
  });

  it("POST /a2a/:agent/:capability dispatches and returns a Result envelope", async () => {
    const agents = new Map();
    agents.set("creative-director", {
      card: {
        schema_version: "a2a-v0.3",
        id: "genorah/creative-director",
        version: "4.0.0",
        channel: "stable",
        name: "Creative Director",
        description: "x",
        tier: "director",
        capabilities: [{ id: "review-plan" }],
        tools: [],
        auth: { local: { type: "none" }, remote: { type: "oauth2", flow: "authorization_code_pkce" } },
        streaming: { supports_sse: true, ag_ui_events: true },
        mcp: { sampling_v2_compatible: true }
      },
      handler: async (p: any) => ok({ echo: p })
    });
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });
    const res = await fetch(`${daemon.url}/a2a/creative-director/review-plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "hi" })
    });
    const env = await res.json();
    expect(env.status).toBe("ok");
    expect(env.artifact.echo.plan).toBe("hi");
  });

  it("returns 404 for unknown agent", async () => {
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents: new Map() });
    const res = await fetch(`${daemon.url}/a2a/nope/x`, { method: "POST" });
    expect(res.status).toBe(404);
  });
});
