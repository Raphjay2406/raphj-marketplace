#!/usr/bin/env node
/**
 * /gen:agents-discover — search the Genorah marketplace for third-party agents.
 */
const query = process.argv[2] || "";
const url = process.env.GENORAH_MARKETPLACE_URL || "https://registry.genorah.dev/v1";

let MarketplaceClient;
try {
  const mod = await import(
    new URL("../packages/marketplace/dist/index.js", import.meta.url).href
  );
  MarketplaceClient = mod.MarketplaceClient;
} catch {
  console.error("marketplace package not built. Run: cd packages/marketplace && npm run build");
  process.exit(1);
}

const client = new MarketplaceClient({ registry: url });
try {
  const agents = await client.discover(query || "");
  if (agents.length === 0) {
    console.log("No agents found.");
  } else {
    console.log(`Found ${agents.length} agent(s):\n`);
    for (const a of agents) {
      console.log(`  ${a.id}@${a.version} [${a.tier}] — ${a.description}`);
    }
  }
} catch (err) {
  console.error("Discover error (registry may not be live yet):", err.message);
  console.log("Note: Marketplace registry is not yet hosted. Self-host via GENORAH_MARKETPLACE_URL.");
  process.exit(1);
}
