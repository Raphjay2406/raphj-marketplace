export interface CacheKeyInput {
    provider: string;
    model?: string;
    prompt: string;
    seed?: number;
    reference_hashes: string[];
}
export declare function computeCacheKey(input: CacheKeyInput): string;
export interface CacheEntry {
    path: string;
    sha256: string;
    bytes: number;
    provider: string;
    cost_usd: number;
    cached_at: number;
}
export interface CacheOptions {
    rootDir: string;
}
export declare class AssetCache {
    private keyv;
    readonly rootDir: string;
    constructor(opts: CacheOptions);
    init(): Promise<void>;
    get(key: string): Promise<CacheEntry | null>;
    set(key: string, entry: CacheEntry): Promise<void>;
    has(key: string): Promise<boolean>;
    blobPath(key: string): string;
}
export declare function defaultCacheDir(): string;
//# sourceMappingURL=cache.d.ts.map