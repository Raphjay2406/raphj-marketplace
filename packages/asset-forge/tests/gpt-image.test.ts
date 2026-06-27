import { describe, it, expect, vi, beforeEach } from "vitest";
import { rmSync, mkdirSync, existsSync, readFileSync } from "fs";
import { GptImageProvider } from "../src/providers/gpt-image.js";
import { GenorahError } from "@genorah/protocol";

const TMP = "/tmp/genorah-gpt-image-test";

beforeEach(() => {
  vi.restoreAllMocks();
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe("GptImageProvider.generate", () => {
  it("always sends model, never response_format, and decodes b64_json to a PNG", async () => {
    const fakePng = Buffer.from("fake-png-bytes");
    let capturedBody: Record<string, unknown> | undefined;
    globalThis.fetch = vi.fn().mockImplementationOnce(async (_url: string, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return {
        ok: true,
        json: async () => ({ data: [{ b64_json: fakePng.toString("base64") }] }),
      } as unknown as Response;
    });

    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    const result = await p.generate({ prompt: "hero: cosmic nebula" });

    expect(capturedBody?.model).toBe("gpt-image-2");
    expect(capturedBody?.prompt).toBe("hero: cosmic nebula");
    expect(capturedBody).not.toHaveProperty("response_format");
    expect(result.provider).toBe("gpt-image");
    expect(result.model).toBe("gpt-image-2");
    expect(result.path).toMatch(/\.png$/);
    expect(existsSync(result.path)).toBe(true);
    expect(readFileSync(result.path).equals(fakePng)).toBe(true);
  });

  it("throws GenorahError PROVIDER_UNAVAILABLE on non-200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 429, statusText: "Too Many Requests",
    } as unknown as Response);

    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    let caught: GenorahError | undefined;
    try {
      await p.generate({ prompt: "test" });
    } catch (e) {
      caught = e as GenorahError;
    }
    expect(caught).toBeInstanceOf(GenorahError);
    expect(caught?.structured.code).toBe("PROVIDER_UNAVAILABLE");
  });
});
