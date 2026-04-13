import type { AssetProvider, AssetInput, AssetResult, CostEstimate } from "./base.js";
export interface NanoBananaOptions {
    /** Path to the directory where prompt .txt files or downloaded images are saved */
    downloadDir?: string;
    /**
     * MCP client factory — if provided, the provider attempts to call the
     * nano-banana MCP tool directly. When absent (or when the call fails),
     * the provider falls back to writing a .prompt.txt file.
     */
    mcpClient?: NanoBananaMcpClient;
}
export interface NanoBananaMcpClient {
    generateImage(prompt: string, seed?: number): Promise<{
        path: string;
    } | null>;
}
export declare class NanoBananaProvider implements AssetProvider {
    readonly name = "nano-banana";
    readonly kind: "image";
    private downloadDir;
    private mcpClient?;
    constructor(opts?: NanoBananaOptions);
    estimateCost(_input: AssetInput): Promise<CostEstimate>;
    generate(input: AssetInput): Promise<AssetResult>;
}
//# sourceMappingURL=nano-banana.d.ts.map