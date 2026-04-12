import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecraftProvider } from "../src/providers/recraft.js";
import { GenorahError } from "@genorah/protocol";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("RecraftProvider", () => {
  it("generate returns .svg output path", async () => {
    const svgContent = Buffer.from("<svg>...</svg>");
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ url: "https://cdn.example.com/icon.svg" }] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => svgContent.buffer,
      } as unknown as Response);

    const p = new RecraftProvider({ apiKey: "test-key", downloadDir: "/tmp/recraft-test" });
    const result = await p.generate({ prompt: "minimalist logo" });

    expect(result.provider).toBe("recraft");
    expect(result.path).toMatch(/\.svg$/);
    expect(result.cost_usd).toBe(0.04);
    expect(result.sha256).toHaveLength(64);
  });

  it("throws GenorahError with PROVIDER_UNAVAILABLE on non-200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    } as unknown as Response);

    const p = new RecraftProvider({ apiKey: "bad-key" });
    let caught: GenorahError | undefined;
    try {
      await p.generate({ prompt: "logo" });
    } catch (e) {
      caught = e as GenorahError;
    }
    expect(caught).toBeInstanceOf(GenorahError);
    expect(caught?.structured.code).toBe("PROVIDER_UNAVAILABLE");
  });
});
