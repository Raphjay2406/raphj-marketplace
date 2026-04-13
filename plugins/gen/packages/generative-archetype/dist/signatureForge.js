export class SignatureForge {
    opts;
    constructor(opts) {
        this.opts = opts;
    }
    async forge(input) {
        const max = this.opts.maxAttempts ?? 3;
        for (let i = 0; i < max; i++) {
            const seed = Date.now() + i;
            const prompt = i === 0
                ? `${input.brand_essence} — signature mark`
                : `${input.brand_essence} — variant ${i}`;
            const asset = await this.opts.provider.generate({ prompt, seed });
            const embedding = await this.opts.embedder.embedGltf(asset.path);
            try {
                await this.opts.ledger.record(input.project_id, embedding, { brand: input.brand_essence, path: asset.path });
                return asset;
            }
            catch (e) {
                if (i === max - 1)
                    throw e;
            }
        }
        throw new Error("signature forge exhausted retries");
    }
}
