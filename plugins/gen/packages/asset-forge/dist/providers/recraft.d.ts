import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface RecraftOptions {
    apiKey: string;
    endpoint?: string;
    downloadDir?: string;
    style?: string;
}
export declare class RecraftProvider implements AssetProvider {
    private opts;
    readonly name = "recraft";
    readonly kind: "vector";
    private endpoint;
    private downloadDir;
    private style;
    constructor(opts: RecraftOptions);
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=recraft.d.ts.map