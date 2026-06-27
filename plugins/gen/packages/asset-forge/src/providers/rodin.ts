import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface RodinOptions {
  apiKey: string;
  endpoint?: string;
  downloadDir?: string;
  model?: string;
}

const PRICE = {
  cost_usd: 0.35,
  duration_ms_estimate: 90_000,
};

export class RodinProvider implements AssetProvider {
  readonly name = "rodin";
  readonly kind = "3d" as const;

  private endpoint: string;
  private downloadDir: string;
  private model: string;

  constructor(private opts: RodinOptions) {
    this.endpoint = opts.endpoint ?? "https://hyperhuman.deemos.com/api/v2/rodin";
    this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-rodin");
    this.model = opts.model ?? "gen-2";
  }

  async estimateCost(_input: AssetInput): Promise<CostEstimate> {
    return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();

    const body: Record<string, unknown> = {
      prompt: input.prompt,
      model: this.model,
    };
    if (input.seed !== undefined) body.seed = input.seed;
    if (input.reference_paths?.length) body.reference_paths = input.reference_paths;

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.opts.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: `Rodin API error ${res.status}: ${res.statusText}`,
        recovery_hint: "retry_with_fallback",
        retry_strategy: {
          max_attempts: 3,
          backoff_ms: 2000,
          fallback_worker: "meshy",
        },
      });
    }

    const json = (await res.json()) as { url?: string; glb_url?: string };
    const downloadUrl = json.url ?? json.glb_url;

    if (!downloadUrl) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: "Rodin API returned no download URL",
        recovery_hint: "retry_with_fallback",
      });
    }

    const blobRes = await fetch(downloadUrl);
    if (!blobRes.ok) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: `Rodin blob download failed ${blobRes.status}`,
        recovery_hint: "retry_with_fallback",
      });
    }

    const buffer = Buffer.from(await blobRes.arrayBuffer());
    const sha256 = createHash("sha256").update(buffer).digest("hex");

    mkdirSync(this.downloadDir, { recursive: true });
    const outPath = join(this.downloadDir, `${sha256}.glb`);
    writeFileSync(outPath, buffer);

    return {
      provider: "rodin",
      model: this.model,
      sha256,
      path: outPath,
      bytes: buffer.length,
      cost_usd: PRICE.cost_usd,
      duration_ms: Date.now() - start,
      input,
    };
  }
}
