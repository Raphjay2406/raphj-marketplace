import { describe, it, expect } from "vitest";
import { runInSandbox } from "../src/sandbox.js";

// These tests require Deno to be installed. Skipped when unavailable.
const DENO_AVAILABLE = await (async () => {
  const { execSync } = await import("child_process");
  try { execSync("deno --version", { stdio: "ignore" }); return true; } catch { return false; }
})();

describe("runInSandbox", () => {
  it.skipIf(!DENO_AVAILABLE)("executes a pure script and returns stdout", async () => {
    const src = `const input = JSON.parse(await new Response(Deno.stdin.readable).text()); console.log(JSON.stringify({doubled: input.x * 2}));`;
    const result = await runInSandbox({ entry_source: src, payload: { x: 3 }, timeout_ms: 10000 });
    expect(result.parsed.doubled).toBe(6);
  });

  it.skipIf(!DENO_AVAILABLE)("blocks filesystem writes by default", async () => {
    const src = `await Deno.writeTextFile("/tmp/bad", "x"); console.log("{}");`;
    await expect(runInSandbox({ entry_source: src, payload: {}, timeout_ms: 10000 })).rejects.toThrow();
  });
});
