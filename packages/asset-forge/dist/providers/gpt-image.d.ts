import type { ImageEditProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface GptImageOptions {
    apiKey: string;
    model?: string;
    baseUrl?: string;
    downloadDir?: string;
}
export declare class GptImageProvider implements ImageEditProvider {
    private opts;
    readonly name = "gpt-image";
    readonly kind: "image";
    private model;
    private baseUrl;
    private downloadDir;
    constructor(opts: GptImageOptions);
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
    edit(input: AssetInput, opts: {
        imagePaths: string[];
        maskPath?: string;
    }): Promise<AssetResult>;
    private handleImageResponse;
}
//# sourceMappingURL=gpt-image.d.ts.map