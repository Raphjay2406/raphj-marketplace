import { test } from "node:test";
import { strict as assert } from "node:assert";
import { validateRegistry } from "./archetype-registry.mjs";

test("registry passes with no issues", async () => {
  const r = await validateRegistry();
  if (!r.pass) {
    console.error("Issues:", r.issues);
  }
  assert.equal(r.pass, true);
  assert.ok(r.count >= 42, `expected at least 42 archetypes, got ${r.count}`);
});
