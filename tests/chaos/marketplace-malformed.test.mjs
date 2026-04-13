/**
 * Chaos: sandbox rejects non-JSON output from agent
 * Marked as skip when Deno is not available in the test environment.
 */
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { execSync } from "child_process";

function denoAvailable() {
  try {
    execSync("deno --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

const SKIP = !denoAvailable();

test("marketplace-malformed: sandbox rejects non-JSON output", { skip: SKIP ? "Deno not available" : false }, async () => {
  // Import sandbox only if deno is available
  const { runInSandbox } = await import("../../packages/marketplace/src/sandbox.js");

  let threw = false;
  try {
    await runInSandbox({
      entry_source: `
        // Deliberately produce non-JSON stdout
        const payload = JSON.parse(Deno.stdin.readSync ? await new Response(Deno.stdin).text() : "{}");
        console.log("THIS IS NOT JSON!!!");
      `,
      payload: { test: true },
      timeout_ms: 5000
    });
  } catch (e) {
    threw = true;
    assert.ok(
      e.message.includes("not JSON") || e.message.includes("sandbox output"),
      `Expected JSON parse error, got: ${e.message}`
    );
  }
  assert.ok(threw, "sandbox must throw when output is not valid JSON");
});

test("marketplace-malformed: sandbox handles empty output gracefully", { skip: SKIP ? "Deno not available" : false }, async () => {
  const { runInSandbox } = await import("../../packages/marketplace/src/sandbox.js");

  let threw = false;
  try {
    await runInSandbox({
      entry_source: `
        // Produce no output at all
        const _ = await new Response(Deno.stdin).text();
      `,
      payload: {},
      timeout_ms: 5000
    });
  } catch (e) {
    threw = true;
    // Either JSON parse error or sandbox exited error is acceptable
    assert.ok(e.message.length > 0, "error message must be non-empty");
  }
  assert.ok(threw, "sandbox must throw on empty/non-JSON output");
});
