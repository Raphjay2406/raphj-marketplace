export interface EmbeddingProvider { embed: (path: string) => Promise<number[]>; }
export interface PaletteProvider { extractPalette: (paths: string[]) => Promise<string[]>; }

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

export class ReferenceMiner {
  constructor(private opts: MinerOptions) {}

  async mine(paths: string[]): Promise<MineReport> {
    const embeddings = await Promise.all(paths.map(p => this.opts.embeddingProvider.embed(p)));
    const palette = await this.opts.paletteProvider.extractPalette(paths);
    const dims = embeddings[0]?.length ?? 0;
    const combined = new Array(dims).fill(0);
    for (const e of embeddings) for (let i = 0; i < dims; i++) combined[i] += e[i] / embeddings.length;
    return {
      references: paths,
      palette,
      embeddings,
      combined_embedding: combined,
      motifs: [] // motif extraction stub; M5 adds pattern-miner worker integration
    };
  }
}
