import { describe, it, expect, vi } from "vitest";
import { MarketplaceClient } from "../src/client.js";

describe("MarketplaceClient", () => {
  it("discover returns agent summaries", async () => {
    globalThis.fetch = vi.fn(async () => new Response(
      JSON.stringify({ agents: [{ id: "x/y", version: "1.0.0", tier: "worker", description: "z" }] }),
      { status: 200 }
    )) as any;
    const c = new MarketplaceClient({ registry: "https://registry.test/v1" });
    const list = await c.discover("typography");
    expect(list[0].id).toBe("x/y");
  });

  it("fetchManifest returns the full agent package", async () => {
    globalThis.fetch = vi.fn(async () => new Response(
      JSON.stringify({
        id: "x/y", version: "1.0.0", tier: "worker",
        source_url: "https://registry.test/pkg/xy.tar.gz",
        integrity: "sha256-abc", capabilities: [{ id: "cap1" }]
      }),
      { status: 200 }
    )) as any;
    const c = new MarketplaceClient({ registry: "https://registry.test/v1" });
    const m = await c.fetchManifest("x/y@1.0.0");
    expect(m.source_url).toBe("https://registry.test/pkg/xy.tar.gz");
  });
});
