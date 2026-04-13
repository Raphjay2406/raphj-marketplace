import { createHash } from "crypto";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import Keyv from "keyv";
import KeyvSqlite from "@keyv/sqlite";

export interface CacheKeyInput {
  provider: string;
  model?: string;
  prompt: string;
  seed?: number;
  reference_hashes: string[];
}

export function computeCacheKey(input: CacheKeyInput): string {
  const normalized = JSON.stringify({
    p: input.provider,
    m: input.model ?? "",
    r: input.prompt,
    s: input.seed ?? 0,
    refs: [...input.reference_hashes].sort()
  });
  return createHash("sha256").update(normalized).digest("hex");
}

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

export class AssetCache {
  private keyv: Keyv<CacheEntry>;
  private _closed = false;
  readonly rootDir: string;

  constructor(opts: CacheOptions) {
    this.rootDir = opts.rootDir;
    const dbPath = join(opts.rootDir, "metadata.sqlite");
    const store = new KeyvSqlite(`sqlite://${dbPath}`);
    this.keyv = new Keyv<CacheEntry>(store);
  }

  async init(): Promise<void> {
    if (!existsSync(this.rootDir)) mkdirSync(this.rootDir, { recursive: true });
  }

  async get(key: string): Promise<CacheEntry | null> {
    const v = await this.keyv.get(key);
    return v ?? null;
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    await this.keyv.set(key, entry);
  }

  async has(key: string): Promise<boolean> {
    return (await this.keyv.get(key)) !== undefined;
  }

  blobPath(key: string): string {
    return join(this.rootDir, "blobs", key.slice(0, 2), key);
  }

  async close(): Promise<void> {
    if (this._closed) return;
    this._closed = true;
    await this.keyv.disconnect();
  }
}

export function defaultCacheDir(): string {
  return join(
    process.env["HOME"] ?? process.env["USERPROFILE"] ?? ".",
    ".claude/genorah/asset-cache"
  );
}
