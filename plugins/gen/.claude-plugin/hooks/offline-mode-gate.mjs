#!/usr/bin/env node
import { readFileSync } from "fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const offline = process.env.GENORAH_OFFLINE === "1";
if (!offline) process.exit(0);

const tool = input.tool_name || "";

const NET_TOOLS = ["WebFetch", "WebSearch"];
if (NET_TOOLS.includes(tool)) {
  console.error(`[offline-mode] blocked network tool ${tool}`);
  process.exit(2);
}

// Block MCP calls to network-dependent servers
const NET_MCP = new Set(["rodin", "meshy", "flux-kontext", "recraft", "kling", "nano-banana"]);
if (tool.startsWith("mcp__")) {
  const server = tool.split("__")[1];
  if (NET_MCP.has(server)) {
    console.error(`[offline-mode] blocked MCP call to ${server}`);
    process.exit(2);
  }
}

process.exit(0);
