import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { OpenAiImageClient } from "../src/openai.js";
import { makeGenerateHandler } from "../src/tools/generate.js";

const live = process.env.GPT_IMAGE_LIVE === "1" && !!process.env.OPENAI_API_KEY;
const d = live ? describe : describe.skip;

d("live OpenAI gpt-image", () => {
  it("generates a real image and writes it to disk", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gi-live-"));
    const model = process.env.GPT_IMAGE_MODEL || "gpt-image-2";
    const client = new OpenAiImageClient({ apiKey: process.env.OPENAI_API_KEY!, model, baseUrl: "https://api.openai.com/v1" });
    const handler = makeGenerateHandler({ client, outputDir: dir, model });
    const res = await handler({ prompt: "a single red apple on a white background, studio photo", size: "1024x1024", quality: "low", background: "auto", output_format: "png", n: 1 });
    const saved = JSON.parse((res.content[0] as any).text).saved[0];
    const stat = await fs.stat(saved);
    expect(stat.size).toBeGreaterThan(1000);
  }, 120_000);
});
