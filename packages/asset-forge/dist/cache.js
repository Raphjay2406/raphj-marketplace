import { createHash } from "crypto";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import Keyv from "keyv";
import KeyvSqlite from "@keyv/sqlite";
export function computeCacheKey(input) {
    const normalized = JSON.stringify({
        p: input.provider,
        m: input.model ?? "",
        r: input.prompt,
        s: input.seed ?? 0,
        refs: [...input.reference_hashes].sort()
    });
    return createHash("sha256").update(normalized).digest("hex");
}
export class AssetCache {
    keyv;
    rootDir;
    constructor(opts) {
        this.rootDir = opts.rootDir;
        const dbPath = join(opts.rootDir, "metadata.sqlite");
        const store = new KeyvSqlite(`sqlite://${dbPath}`);
        this.keyv = new Keyv(store);
    }
    async init() {
        if (!existsSync(this.rootDir))
            mkdirSync(this.rootDir, { recursive: true });
    }
    async get(key) {
        const v = await this.keyv.get(key);
        return v ?? null;
    }
    async set(key, entry) {
        await this.keyv.set(key, entry);
    }
    async has(key) {
        return (await this.keyv.get(key)) !== undefined;
    }
    blobPath(key) {
        return join(this.rootDir, "blobs", key.slice(0, 2), key);
    }
    async close() {
        await this.keyv.disconnect();
    }
}
export function defaultCacheDir() {
    return join(process.env["HOME"] ?? process.env["USERPROFILE"] ?? ".", ".claude/genorah/asset-cache");
}
