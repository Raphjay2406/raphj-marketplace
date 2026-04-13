import { createHash } from "crypto";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface NanoBananaOptions {
  /** Path to the directory where prompt .txt files or downloaded images are saved */
  downloadDir?: string;
  /**
   * MCP client factory — if provided, the provider attempts to call the
   * nano-banana MCP tool directly. When absent (or when the call fails),
   * the provider falls back to writing a .prompt.txt file.
   */
  mcpClient?: NanoBananaMcpClient;
}

export interface NanoBananaMcpClient {
  generateImage(prompt: string, seed?: number): Promise<{ path: string } | null>;
}

const PRICE = {
  cost_usd: 0.0, // nano-banana is the in-house MCP server — cost is handled upstream
  duration_ms_estimate: 12_000,
};

export class NanoBananaProvider implements AssetProvider {
  readonly name = "nano-banana";
  readonly kind = "image" as const;

  private downloadDir: string;
  private mcpClient?: NanoBananaMcpClient;

  constructor(opts: NanoBananaOptions = {}) {
    this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-nano-banana");
    this.mcpClient = opts.mcpClient;
  }

  async estimateCost(_input: AssetInput): Promise<CostEstimate> {
    return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();

    mkdirSync(this.downloadDir, { recursive: true });

    // Attempt MCP path if client is provided
    if (this.mcpClient) {
      try {
        const mcpResult = await this.mcpClient.generateImage(input.prompt, input.seed);
        if (mcpResult?.path && existsSync(mcpResult.path)) {
          const buffer = readFileSync(mcpResult.path);
          const sha256 = createHash("sha256").update(buffer).digest("hex");
          const outPath = join(this.downloadDir, `${sha256}.png`);
          writeFileSync(outPath, buffer);
          return {
            provider: "nano-banana",
            sha256,
            path: outPath,
            bytes: buffer.length,
            cost_usd: PRICE.cost_usd,
            duration_ms: Date.now() - start,
            input,
          };
        }
      } catch {
        // MCP unavailable — fall through to prompt file fallback
      }
    }

    // Fallback: write prompt to .prompt.txt for manual/deferred generation
    const promptHash = createHash("sha256").update(input.prompt + String(input.seed ?? "")).digest("hex").slice(0, 16);
    const promptFile = join(this.downloadDir, `${promptHash}.prompt.txt`);
    const promptContent = [
      `prompt: ${input.prompt}`,
      input.seed !== undefined ? `seed: ${input.seed}` : null,
      ...(input.reference_paths?.map((p) => `reference: ${p}`) ?? []),
    ]
      .filter(Boolean)
      .join("\n");

    writeFileSync(promptFile, promptContent, "utf8");

    const sha256 = createHash("sha256").update(promptContent).digest("hex");

    return {
      provider: "nano-banana",
      sha256,
      path: promptFile,
      bytes: Buffer.byteLength(promptContent),
      cost_usd: PRICE.cost_usd,
      duration_ms: Date.now() - start,
      input,
    };
  }
}
