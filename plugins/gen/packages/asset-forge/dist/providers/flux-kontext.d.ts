import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface FluxKontextOptions {
    apiKey: string;
    endpoint?: string;
    downloadDir?: string;
}
export declare class FluxKontextProvider implements AssetProvider {
    private opts;
    readonly name = "flux-kontext";
    readonly kind: "image";
    private endpoint;
    private downloadDir;
    constructor(opts: FluxKontextOptions);
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=flux-kontext.d.ts.map