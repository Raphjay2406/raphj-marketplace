import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { GenorahError } from "@genorah/protocol";
import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface RecraftOptions {
  apiKey: string;
  endpoint?: string;
  downloadDir?: string;
  style?: string;
}

const PRICE = {
  cost_usd: 0.04,
  duration_ms_estimate: 5_000,
};

export class RecraftProvider implements AssetProvider {
  readonly name = "recraft";
  readonly kind = "vector" as const;

  private endpoint: string;
  private downloadDir: string;
  private style: string;

  constructor(private opts: RecraftOptions) {
    this.endpoint = opts.endpoint ?? "https://external.api.recraft.ai/v1/images/generations";
    this.downloadDir = opts.downloadDir ?? "/tmp/genorah-recraft";
    this.style = opts.style ?? "vector_illustration";
  }

  async estimateCost(_input: AssetInput): Promise<CostEstimate> {
    return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();

    const body: Record<string, unknown> = {
      prompt: input.prompt,
      style: this.style,
      response_format: "url",
    };
    if (input.seed !== undefined) body.seed = input.seed;

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
        message: `Recraft API error ${res.status}: ${res.statusText}`,
        recovery_hint: "retry_with_fallback",
        retry_strategy: {
          max_attempts: 3,
          backoff_ms: 1000,
          fallback_worker: "flux-kontext",
        },
      });
    }

    const json = (await res.json()) as { data?: Array<{ url: string }> };
    const downloadUrl = json.data?.[0]?.url;

    if (!downloadUrl) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: "Recraft API returned no image URL",
        recovery_hint: "retry_with_fallback",
      });
    }

    const blobRes = await fetch(downloadUrl);
    if (!blobRes.ok) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: `Recraft blob download failed ${blobRes.status}`,
        recovery_hint: "retry_with_fallback",
      });
    }

    const buffer = Buffer.from(await blobRes.arrayBuffer());
    const sha256 = createHash("sha256").update(buffer).digest("hex");

    mkdirSync(this.downloadDir, { recursive: true });
    const outPath = join(this.downloadDir, `${sha256}.svg`);
    writeFileSync(outPath, buffer);

    return {
      provider: "recraft",
      sha256,
      path: outPath,
      bytes: buffer.length,
      cost_usd: PRICE.cost_usd,
      duration_ms: Date.now() - start,
      input,
    };
  }
}
