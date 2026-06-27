import { describe, it, expect, vi, beforeEach } from "vitest";
import { rmSync, mkdirSync, existsSync, readFileSync, writeFileSync as writeFileSyncTest } from "fs";
import { join as joinTest } from "path";
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

  it("estimateCost returns the seed cost and duration", async () => {
    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    const est = await p.estimateCost({ prompt: "x" });
    expect(est.cost_usd).toBe(0.04);
    expect(est.duration_ms_estimate).toBe(15_000);
  });
});

describe("GptImageProvider.edit", () => {
  it("sends multipart image[] with no Content-Type and omits input_fidelity/background for gpt-image-2", async () => {
    const inputImg = joinTest(TMP, "src.png");
    writeFileSyncTest(inputImg, Buffer.from("input-image"));
    const fakeOut = Buffer.from("edited-png");
    let capturedInit: RequestInit | undefined;
    globalThis.fetch = vi.fn().mockImplementationOnce(async (_url: string, init?: RequestInit) => {
      capturedInit = init;
      return {
        ok: true,
        json: async () => ({ data: [{ b64_json: fakeOut.toString("base64") }] }),
      } as unknown as Response;
    });

    const p = new GptImageProvider({ apiKey: "test-key", downloadDir: TMP });
    const result = await p.edit({ prompt: "make it warmer" }, { imagePaths: [inputImg] });

    const body = capturedInit?.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("prompt")).toBe("make it warmer");
    expect(body.get("model")).toBe("gpt-image-2");
    expect(body.getAll("image[]").length).toBe(1);
    expect(body.get("input_fidelity")).toBeNull();
    expect(body.get("background")).toBeNull();
    expect((capturedInit?.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
    expect(result.provider).toBe("gpt-image");
    expect(existsSync(result.path)).toBe(true);
  });
});
