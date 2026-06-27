import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { GenorahError } from "@genorah/protocol";
import type { ImageEditProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";

export interface GptImageOptions {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  downloadDir?: string;
}

const PRICE = {
  cost_usd: 0.04, // gpt-image-2 ~1024² high quality — estimate; tune to observed pricing
  duration_ms_estimate: 15_000,
};

export class GptImageProvider implements ImageEditProvider {
  readonly name = "gpt-image";
  readonly kind = "image" as const;

  private model: string;
  private baseUrl: string;
  private downloadDir: string;

  constructor(private opts: GptImageOptions) {
    this.model = opts.model ?? "gpt-image-2";
    this.baseUrl = opts.baseUrl ?? "https://api.openai.com/v1";
    this.downloadDir = opts.downloadDir ?? join(tmpdir(), "genorah-gpt-image");
  }

  async estimateCost(_input: AssetInput): Promise<CostEstimate> {
    return { cost_usd: PRICE.cost_usd, duration_ms_estimate: PRICE.duration_ms_estimate };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const start = Date.now();
    const body: Record<string, unknown> = {
      model: this.model,
      prompt: input.prompt,
      n: 1,
      size: (input.params?.size as string | undefined) ?? "1024x1024",
      quality: (input.params?.quality as string | undefined) ?? "high",
      output_format: "png",
    };
    const res = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return this.handleImageResponse(res, input, start);
  }

  // edit() is implemented in Task 2. This throwing stub satisfies the
  // ImageEditProvider contract so the class type-checks under strict tsc until then.
  async edit(_input: AssetInput, _opts: { imagePaths: string[]; maskPath?: string }): Promise<AssetResult> {
    throw new GenorahError({
      code: "PROVIDER_UNAVAILABLE",
      message: "GptImageProvider.edit not yet implemented (Task 2)",
      recovery_hint: "retry_with_fallback",
    });
  }

  private async handleImageResponse(res: Response, input: AssetInput, start: number): Promise<AssetResult> {
    if (!res.ok) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: `gpt-image API error ${res.status}: ${res.statusText}`,
        recovery_hint: "retry_with_fallback",
        retry_strategy: { max_attempts: 3, backoff_ms: 1000, fallback_worker: "flux-hero-gen" },
      });
    }
    const json = (await res.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) {
      throw new GenorahError({
        code: "PROVIDER_UNAVAILABLE",
        message: "gpt-image API returned no image data",
        recovery_hint: "retry_with_fallback",
      });
    }
    const buffer = Buffer.from(b64, "base64");
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    mkdirSync(this.downloadDir, { recursive: true });
    const outPath = join(this.downloadDir, `${sha256}.png`);
    writeFileSync(outPath, buffer);
    return {
      provider: "gpt-image",
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
