import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface KlingOptions {
    apiKey: string;
    endpoint?: string;
    downloadDir?: string;
}
export declare class KlingProvider implements AssetProvider {
    private opts;
    readonly name = "kling";
    readonly kind: "video";
    private endpoint;
    private downloadDir;
    constructor(opts: KlingOptions);
    estimateCost(input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=kling.d.ts.map