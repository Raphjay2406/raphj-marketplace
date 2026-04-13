export interface EmbeddingProvider {
    embed: (path: string) => Promise<number[]>;
}
export interface PaletteProvider {
    extractPalette: (paths: string[]) => Promise<string[]>;
}
export interface MinerOptions {
    embeddingProvider: EmbeddingProvider;
    paletteProvider: PaletteProvider;
}
export interface MineReport {
    references: string[];
    palette: string[];
    embeddings: number[][];
    combined_embedding: number[];
    motifs: string[];
}
export declare class ReferenceMiner {
    private opts;
    constructor(opts: MinerOptions);
    mine(paths: string[]): Promise<MineReport>;
}
//# sourceMappingURL=referenceMiner.d.ts.map