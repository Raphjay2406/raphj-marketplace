import { describe, it, expect, vi } from "vitest";
import { OpenAiImageClient, OpenAiImageError } from "../src/openai.js";

const cfg = { apiKey: "sk-x", model: "gpt-image-2", baseUrl: "https://api.test/v1" };
const okJson = (b64 = "QUJD") => ({ ok: true, status: 200, json: async () => ({ data: [{ b64_json: b64 }], usage: { total_tokens: 1 } }) });

describe("generate", () => {
  it("POSTs JSON to /images/generations with model + bearer, returns b64", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson() as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    const res = await client.generate({ prompt: "cat", size: "1024x1024", quality: "high", background: "auto", output_format: "png", n: 1 });
    expect(res.images).toEqual(["QUJD"]);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.test/v1/images/generations");
    expect((init.headers as any).Authorization).toBe("Bearer sk-x");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ model: "gpt-image-2", prompt: "cat", n: 1, size: "1024x1024" });
    expect(body).not.toHaveProperty("response_format");
    expect(body).not.toHaveProperty("background"); // "auto" is omitted
  });
});

describe("edit", () => {
  it("POSTs multipart with image[] and no JSON content-type", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson("ZZZ") as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    const img = { bytes: Buffer.from("x"), mime: "image/png", name: "a.png" };
    const res = await client.edit({ images: [img], prompt: "remove tree", size: "auto", quality: "high", background: "auto", output_format: "png", input_fidelity: "high" });
    expect(res.images).toEqual(["ZZZ"]);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.test/v1/images/edits");
    expect(init.body).toBeInstanceOf(FormData);
    const form = init.body as FormData;
    expect(form.get("model")).toBe("gpt-image-2");
    expect(form.get("prompt")).toBe("remove tree");
    expect(form.getAll("image[]").length).toBe(1);
    expect((init.headers as any)["Content-Type"]).toBeUndefined();
    // gpt-image-2 REJECTS input_fidelity (HTTP 400) — it must be omitted
    expect(form.get("input_fidelity")).toBeNull();
  });

  it("sends input_fidelity only for models that support it (gpt-image-1.5)", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson("Z") as any);
    const client = new OpenAiImageClient({ ...cfg, model: "gpt-image-1.5" }, { fetchImpl: fetchImpl as any });
    const img = { bytes: Buffer.from("x"), mime: "image/png", name: "a.png" };
    await client.edit({ images: [img], prompt: "edit", size: "auto", quality: "high", background: "auto", output_format: "png", input_fidelity: "high" });
    const form = fetchImpl.mock.calls[0][1].body as FormData;
    expect(form.get("model")).toBe("gpt-image-1.5");
    expect(form.get("input_fidelity")).toBe("high");
  });
});

describe("errors + retry", () => {
  it("maps a 400 to OpenAiImageError with the API message", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => JSON.stringify({ error: { message: "bad size" } }) } as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    await expect(client.generate({ prompt: "x", size: "auto", quality: "auto", background: "auto", output_format: "png", n: 1 }))
      .rejects.toMatchObject({ status: 400, message: "bad size" });
  });
  it("flags content-policy refusals", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => JSON.stringify({ error: { message: "rejected by our safety system" } }) } as any);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any });
    await expect(client.generate({ prompt: "x", size: "auto", quality: "auto", background: "auto", output_format: "png", n: 1 }))
      .rejects.toMatchObject({ isPolicy: true });
  });
  it("retries once on 500 then succeeds", async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "boom" } as any)
      .mockResolvedValueOnce(okJson("OK2") as any);
    const sleep = vi.fn().mockResolvedValue(undefined);
    const client = new OpenAiImageClient(cfg, { fetchImpl: fetchImpl as any, sleep });
    const res = await client.generate({ prompt: "x", size: "auto", quality: "auto", background: "auto", output_format: "png", n: 1 });
    expect(res.images).toEqual(["OK2"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});
