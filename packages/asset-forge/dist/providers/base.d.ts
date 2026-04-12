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
export declare class DummyProvider implements AssetProvider {
    readonly name = "dummy";
    readonly kind: "image";
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=base.d.ts.map