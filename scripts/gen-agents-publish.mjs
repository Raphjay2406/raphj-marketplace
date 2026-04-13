#!/usr/bin/env node
const id = process.argv[2];
if (!id) {
  console.error("usage: gen-agents-publish.mjs <agent-id>");
  process.exit(1);
}
const url = process.env.GENORAH_MARKETPLACE_URL || "https://registry.genorah.dev/v1";
console.log(`Would publish ${id} to ${url}`);
console.log("Marketplace registry not yet hosted — card ready for publishing when registry is live.");
