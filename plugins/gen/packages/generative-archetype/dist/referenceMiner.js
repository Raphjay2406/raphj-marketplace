export class ReferenceMiner {
    opts;
    constructor(opts) {
        this.opts = opts;
    }
    async mine(paths) {
        const embeddings = await Promise.all(paths.map(p => this.opts.embeddingProvider.embed(p)));
        const palette = await this.opts.paletteProvider.extractPalette(paths);
        const dims = embeddings[0]?.length ?? 0;
        const combined = new Array(dims).fill(0);
        for (const e of embeddings)
            for (let i = 0; i < dims; i++)
                combined[i] += e[i] / embeddings.length;
        return {
            references: paths,
            palette,
            embeddings,
            combined_embedding: combined,
            motifs: [] // motif extraction stub; M5 adds pattern-miner worker integration
        };
    }
}
