import { describe, it, expect, vi } from "vitest";
import { installAgent } from "../src/installer.js";

describe("installAgent", () => {
  it("rejects when integrity does not match", async () => {
    const fetches = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: "x/y", version: "1.0.0", tier: "worker",
        source_url: "https://cdn/test.tar.gz",
        integrity: "sha256-wrong",
        capabilities: [{ id: "c" }]
      })))
      .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3])));
    globalThis.fetch = fetches as any;
    await expect(
      installAgent({ registry: "https://r/v1", idWithVersion: "x/y@1.0.0", installDir: "/tmp/install-test" })
    ).rejects.toThrow(/integrity/i);
  });
});
