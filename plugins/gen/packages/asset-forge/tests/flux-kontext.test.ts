import { describe, it, expect, vi, beforeEach } from "vitest";
import { FluxKontextProvider } from "../src/providers/flux-kontext.js";
import { GenorahError } from "@genorah/protocol";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("FluxKontextProvider", () => {
  it("captures reference_paths in request body", async () => {
    const blobBuffer = Buffer.from("fake-image-data");
    let capturedBody: Record<string, unknown> | undefined;

    globalThis.fetch = vi.fn()
      .mockImplementationOnce(async (_url: string, init?: RequestInit) => {
        capturedBody = JSON.parse(init?.body as string);
        return {
          ok: true,
          json: async () => ({ images: [{ url: "https://cdn.example.com/img.jpg" }] }),
        } as unknown as Response;
      })
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => blobBuffer.buffer,
      } as unknown as Response);

    const p = new FluxKontextProvider({
      apiKey: "test-key",
      downloadDir: "/tmp/flux-test",
    });
    await p.generate({
      prompt: "edit: make the sky purple",
      reference_paths: ["./source/hero.jpg"],
    });

    expect(capturedBody?.reference_paths).toEqual(["./source/hero.jpg"]);
  });

  it("throws GenorahError with PROVIDER_UNAVAILABLE on non-200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
    } as unknown as Response);

    const p = new FluxKontextProvider({ apiKey: "test-key" });
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
