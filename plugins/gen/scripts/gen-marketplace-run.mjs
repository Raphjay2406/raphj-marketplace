#!/usr/bin/env node
/**
 * /gen:marketplace-run runner
 * Loads an installed marketplace agent and runs it in the Deno sandbox.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const [idVersion, capability, payloadStr] = process.argv.slice(2);
if (!idVersion) {
  console.error("usage: gen-marketplace-run.mjs <id@version> [capability] [json-payload]");
  process.exit(1);
}

const installBase = join(homedir(), ".claude/genorah/marketplace");
const [id] = idVersion.split("@");
const pkgName = id.replace("/", "__") + ".tar.gz";
const pkgPath = join(installBase, pkgName);

if (!existsSync(pkgPath)) {
  console.error(`Agent not installed. Run /gen:agents-install ${idVersion} first.`);
  process.exit(1);
}

// Load sandbox runner
let runInSandbox;
try {
  const mod = await import(
    new URL("../packages/marketplace/dist/index.js", import.meta.url).href
  );
  runInSandbox = mod.runInSandbox;
} catch {
  console.error("marketplace package not built. Run: cd packages/marketplace && npm run build");
  process.exit(1);
}

// Minimal agent entry script that reads stdin and returns a Result envelope
const entrySource = `
const raw = await new Response(Deno.stdin.readable).text();
const input = JSON.parse(raw);
// Agent placeholder: echo capability result
console.log(JSON.stringify({
  ok: true,
  capability: input.capability ?? "unknown",
  result: { message: "sandbox executed", payload: input.payload }
}));
`;

const payload = { capability: capability || "default", payload: payloadStr ? JSON.parse(payloadStr) : {} };

console.log(`Running ${idVersion} in Deno sandbox...`);
try {
  const result = await runInSandbox({ entry_source: entrySource, payload, timeout_ms: 15000 });
  console.log("Result envelope:", JSON.stringify(result.parsed, null, 2));
  console.log(`Duration: ${result.duration_ms}ms`);
} catch (err) {
  console.error("Sandbox error:", err.message);
  process.exit(1);
}
