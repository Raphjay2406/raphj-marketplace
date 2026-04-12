import { createHash } from "crypto";

export interface AssetInput {
  prompt: string;
  reference_paths?: string[];
  seed?: number;
  params?: Record<string, unknown>;
}

export interface AssetResult {
  provider: string;
  model?: string;
  sha256: string;
  path: string;
  bytes: number;
  cost_usd: number;
  duration_ms: number;
  input: AssetInput;
}

export interface CostEstimate {
  cost_usd: number;
  duration_ms_estimate: number;
}

export interface AssetProvider {
  readonly name: string;
  readonly kind: "image" | "3d" | "vector" | "video";
  estimateCost(input: AssetInput): Promise<CostEstimate>;
  generate(input: AssetInput): Promise<AssetResult>;
}

export class DummyProvider implements AssetProvider {
  readonly name = "dummy";
  readonly kind = "image" as const;

  async estimateCost(_input: AssetInput): Promise<CostEstimate> {
    return { cost_usd: 0, duration_ms_estimate: 100 };
  }

  async generate(input: AssetInput): Promise<AssetResult> {
    const sha = createHash("sha256").update(JSON.stringify(input)).digest("hex");
    return {
      provider: "dummy",
      sha256: sha,
      path: `/tmp/dummy-${sha}.bin`,
      bytes: 0,
      cost_usd: 0,
      duration_ms: 100,
      input
    };
  }
}
