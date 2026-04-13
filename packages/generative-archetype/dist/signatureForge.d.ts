import type { UniquenessLedger } from "./uniquenessLedger.js";
export interface SigProvider {
    generate(input: {
        prompt: string;
        seed: number;
    }): Promise<{
        path: string;
        sha256: string;
        bytes: number;
    }>;
}
export interface GltfEmbedder {
    embedGltf(path: string): Promise<number[]>;
}
export interface ForgeOptions {
    ledger: UniquenessLedger;
    provider: SigProvider;
    embedder: GltfEmbedder;
    maxAttempts?: number;
}
export interface ForgeInput {
    brand_essence: string;
    project_id: string;
}
export declare class SignatureForge {
    private opts;
    constructor(opts: ForgeOptions);
    forge(input: ForgeInput): Promise<{
        path: string;
        sha256: string;
        bytes: number;
    }>;
}
//# sourceMappingURL=signatureForge.d.ts.map