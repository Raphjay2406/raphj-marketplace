import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig, loadEnvFile } from "./config.js";
import { OpenAiImageClient } from "./openai.js";
import { generateShape, editShape } from "./schemas.js";
import { makeGenerateHandler } from "./tools/generate.js";
import { makeEditHandler } from "./tools/edit.js";

async function main() {
  // Load the package-local .env (dist/index.js -> ../.env = package root). Real shell env still wins.
  loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
  const cfg = loadConfig(); // throws clearly if OPENAI_API_KEY is missing
  const client = new OpenAiImageClient({ apiKey: cfg.apiKey, model: cfg.model, baseUrl: cfg.baseUrl });
  const deps = { client, outputDir: cfg.outputDir, model: cfg.model };

  const server = new McpServer({ name: "gpt-image", version: "4.0.0" });

  server.registerTool(
    "generate_image",
    {
      title: "Generate image (OpenAI gpt-image)",
      description: "Generate an image from a text prompt with OpenAI gpt-image-2. Saves to disk and returns the file path.",
      inputSchema: generateShape,
    },
    makeGenerateHandler(deps) as any
  );

  server.registerTool(
    "edit_image",
    {
      title: "Edit image (OpenAI gpt-image)",
      description: "Edit an existing image (optionally with a mask and reference images) using OpenAI gpt-image-2. Saves to disk and returns the file path.",
      inputSchema: editShape,
    },
    makeEditHandler(deps) as any
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(`[gpt-image-mcp] fatal: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
