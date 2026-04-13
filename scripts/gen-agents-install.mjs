#!/usr/bin/env node
/**
 * /gen:agents-install — install + sandbox-smoke a marketplace agent.
 */
import { join } from "path";
import { homedir } from "os";

const idVersion = process.argv[2];
if (!idVersion) {
  console.error("usage: gen-agents-install.mjs <agent-id@version>");
  process.exit(1);
}

const registryUrl = process.env.GENORAH_MARKETPLACE_URL || "https://registry.genorah.dev/v1";
const installDir = join(homedir(), ".claude/genorah/marketplace");

let installAgent, runInSandbox;
try {
  const mod = await import(
    new URL("../packages/marketplace/dist/index.js", import.meta.url).href
  );
  installAgent = mod.installAgent;
  runInSandbox = mod.runInSandbox;
} catch {
  console.error("marketplace package not built. Run: cd packages/marketplace && npm run build");
  process.exit(1);
}

console.log(`Installing ${idVersion} from ${registryUrl}...`);
try {
  const { path } = await installAgent({ registry: registryUrl, idWithVersion: idVersion, installDir });
  console.log(`Installed to ${path}`);

  // Sandbox smoke test: echo back a simple payload
  const smokeEntry = `const raw = await new Response(Deno.stdin.readable).text(); console.log(JSON.stringify({smoke: true, echo: JSON.parse(raw)}));`;
  console.log("Running sandbox smoke test...");
  const result = await runInSandbox({ entry_source: smokeEntry, payload: { test: 1 }, timeout_ms: 10000 });
  console.log("Smoke result:", JSON.stringify(result.parsed));
  console.log("Install complete.");
} catch (err) {
  console.error("Install error:", err.message);
  process.exit(1);
}
