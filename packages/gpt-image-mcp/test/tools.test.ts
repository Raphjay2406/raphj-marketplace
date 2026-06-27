import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { makeGenerateHandler } from "../src/tools/generate.js";
import { makeEditHandler } from "../src/tools/edit.js";

const PNG_1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const fakeClient = (b64 = PNG_1x1) => ({ generate: async () => ({ images: [b64] }), edit: async () => ({ images: [b64] }) }) as any;

describe("generate handler", () => {
  it("writes the image and returns the saved path + preview", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gi-"));
    const handler = makeGenerateHandler({ client: fakeClient(), outputDir: dir, model: "gpt-image-2", now: () => 7 });
    const res = await handler({ prompt: "cat", size: "1024x1024", quality: "high", background: "auto", output_format: "png", n: 1 });
    const saved = path.join(dir, "gpt-image-7.png");
    expect(JSON.parse((res.content[0] as any).text).saved).toEqual([saved]);
    expect(res.content.some((c: any) => c.type === "image")).toBe(true);
    expect((await fs.stat(saved)).size).toBeGreaterThan(0);
  });

  it("rejects transparent background on gpt-image-2 before calling the API", async () => {
    let called = false;
    const client = { generate: async () => { called = true; return { images: [] }; } } as any;
    const handler = makeGenerateHandler({ client, outputDir: ".", model: "gpt-image-2" });
    const res = await handler({ prompt: "x", size: "auto", quality: "auto", background: "transparent", output_format: "png", n: 1 });
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toMatch(/transparent/i);
    expect(called).toBe(false);
  });
});

describe("edit handler", () => {
  it("reads the input, writes the edited image, returns the path", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gi-"));
    const input = path.join(dir, "in.png");
    await fs.writeFile(input, Buffer.from(PNG_1x1, "base64"));
    const handler = makeEditHandler({ client: fakeClient(), outputDir: dir, model: "gpt-image-2", now: () => 9 });
    const res = await handler({ image_path: input, prompt: "remove tree", input_fidelity: "high", size: "auto", quality: "high", background: "auto", output_format: "png" });
    const saved = path.join(dir, "gpt-image-9.png");
    expect(JSON.parse((res.content[0] as any).text).saved).toEqual([saved]);
    expect((await fs.stat(saved)).size).toBeGreaterThan(0);
  });

  it("returns an error if the input file is missing", async () => {
    const handler = makeEditHandler({ client: fakeClient(), outputDir: ".", model: "gpt-image-2" });
    const res = await handler({ image_path: "/no/such.png", prompt: "x", input_fidelity: "high", size: "auto", quality: "high", background: "auto", output_format: "png" });
    expect(res.isError).toBe(true);
  });
});
