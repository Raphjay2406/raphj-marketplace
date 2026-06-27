import { describe, it, expect } from "vitest";
import { promises as fsp } from "node:fs";
import * as osm from "node:os";
import * as pathm from "node:path";
import { loadConfig, modelSupportsTransparent, loadEnvFile } from "../src/config.js";

describe("loadConfig", () => {
  it("throws a clear error when OPENAI_API_KEY is missing", () => {
    expect(() => loadConfig({})).toThrow(/OPENAI_API_KEY/);
  });

  it("returns defaults when only the key is set", () => {
    const cfg = loadConfig({ OPENAI_API_KEY: "sk-test" });
    expect(cfg.apiKey).toBe("sk-test");
    expect(cfg.model).toBe("gpt-image-2");
    expect(cfg.baseUrl).toBe("https://api.openai.com/v1");
    expect(typeof cfg.outputDir).toBe("string");
  });

  it("honors overrides", () => {
    const cfg = loadConfig({ OPENAI_API_KEY: "k", GPT_IMAGE_MODEL: "gpt-image-1.5", GPT_IMAGE_OUTPUT_DIR: "/tmp/x" });
    expect(cfg.model).toBe("gpt-image-1.5");
    expect(cfg.outputDir).toBe("/tmp/x");
  });
});

describe("modelSupportsTransparent", () => {
  it("is false for gpt-image-2 family", () => {
    expect(modelSupportsTransparent("gpt-image-2")).toBe(false);
    expect(modelSupportsTransparent("gpt-image-2-2026-04-21")).toBe(false);
  });
  it("is true for gpt-image-1 / 1.5", () => {
    expect(modelSupportsTransparent("gpt-image-1")).toBe(true);
    expect(modelSupportsTransparent("gpt-image-1.5")).toBe(true);
  });
});

describe("loadEnvFile", () => {
  it("merges file vars without overriding existing env", async () => {
    const dir = await fsp.mkdtemp(pathm.join(osm.tmpdir(), "envf-"));
    const f = pathm.join(dir, ".env");
    await fsp.writeFile(f, "# comment\nOPENAI_API_KEY=sk-file\nGPT_IMAGE_MODEL=\"gpt-image-1.5\"\n");
    const env: NodeJS.ProcessEnv = { GPT_IMAGE_MODEL: "gpt-image-2" }; // already set -> wins
    loadEnvFile(f, env);
    expect(env.OPENAI_API_KEY).toBe("sk-file");
    expect(env.GPT_IMAGE_MODEL).toBe("gpt-image-2");
  });
  it("is a no-op for a missing file", () => {
    const env: NodeJS.ProcessEnv = {};
    expect(() => loadEnvFile("/no/such/.env", env)).not.toThrow();
    expect(env.OPENAI_API_KEY).toBeUndefined();
  });
});
