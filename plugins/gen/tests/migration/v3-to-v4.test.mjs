import { test } from "node:test";
import { strict as assert } from "node:assert";
import { cpSync, rmSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const SRC = resolve("fixtures/v3.25-project");
const DST = "/tmp/v3-migrated";
const SCRIPT = resolve("scripts/migrate-v3-to-v4.mjs");

test("migrates v3.25 fixture to v4 without data loss", () => {
  rmSync(DST, { recursive: true, force: true });
  cpSync(SRC, DST, { recursive: true });

  execSync(`cd ${DST} && node ${SCRIPT}`, { stdio: "inherit" });

  const dna = readFileSync(`${DST}/.planning/genorah/DESIGN-DNA.md`, "utf8");
  assert.match(dna, /3d_intensity:\s*accent/);
  assert.match(dna, /asset_budget_usd:\s*20/);
  assert.match(dna, /archetype:\s*brutalist/);

  const ctx = readFileSync(`${DST}/.planning/genorah/CONTEXT.md`, "utf8");
  assert.match(ctx, /protocol_version:\s*4\.0\.0/);
});

test("idempotent: second run produces no changes", () => {
  const before = readFileSync(`${DST}/.planning/genorah/DESIGN-DNA.md`, "utf8");
  execSync(`cd ${DST} && node ${SCRIPT}`, { stdio: "inherit" });
  const after = readFileSync(`${DST}/.planning/genorah/DESIGN-DNA.md`, "utf8");
  assert.equal(before, after);
});
