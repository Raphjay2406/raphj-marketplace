import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface MeshyOptions {
    apiKey: string;
    endpoint?: string;
    downloadDir?: string;
}
export declare class MeshyProvider implements AssetProvider {
    private opts;
    readonly name = "meshy";
    readonly kind: "3d";
    private endpoint;
    private downloadDir;
    constructor(opts: MeshyOptions);
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=meshy.d.ts.map