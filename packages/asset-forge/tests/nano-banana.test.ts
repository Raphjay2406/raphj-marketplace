import { describe, it, expect, beforeEach } from "vitest";
import { rmSync, mkdirSync, existsSync, readFileSync } from "fs";
import { NanoBananaProvider } from "../src/providers/nano-banana.js";

const TMP = "/tmp/genorah-nano-banana-test";

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe("NanoBananaProvider", () => {
  it("fallback mode writes .prompt.txt when no MCP client is provided", async () => {
    const p = new NanoBananaProvider({ downloadDir: TMP });
    const result = await p.generate({
      prompt: "hero background: cosmic nebula",
      seed: 42,
    });

    expect(result.provider).toBe("nano-banana");
    expect(result.path).toMatch(/\.prompt\.txt$/);
    expect(existsSync(result.path)).toBe(true);

    const content = readFileSync(result.path, "utf8");
    expect(content).toContain("prompt: hero background: cosmic nebula");
    expect(content).toContain("seed: 42");
    expect(result.cost_usd).toBe(0);
  });
});
