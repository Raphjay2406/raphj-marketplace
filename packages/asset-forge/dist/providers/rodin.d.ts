import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface RodinOptions {
    apiKey: string;
    endpoint?: string;
    downloadDir?: string;
    model?: string;
}
export declare class RodinProvider implements AssetProvider {
    private opts;
    readonly name = "rodin";
    readonly kind: "3d";
    private endpoint;
    private downloadDir;
    private model;
    constructor(opts: RodinOptions);
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=rodin.d.ts.map