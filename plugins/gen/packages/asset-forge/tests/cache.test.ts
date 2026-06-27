import { describe, it, expect } from "vitest";
import { mkdirSync, rmSync } from "fs";
import { join } from "path";
import { AssetCache, computeCacheKey } from "../src/cache.js";

const BASE_TMP = "/tmp/genorah-cache-test";
let _counter = 0;
function freshTmp(): string {
  const dir = join(BASE_TMP, String(++_counter));
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("AssetCache", () => {
  it("computeCacheKey is stable for same input", () => {
    const a = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "hero", seed: 1, reference_hashes: [] });
    const b = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "hero", seed: 1, reference_hashes: [] });
    expect(a).toEqual(b);
  });

  it("computeCacheKey differs when seed changes", () => {
    const a = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "x", seed: 1, reference_hashes: [] });
    const b = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "x", seed: 2, reference_hashes: [] });
    expect(a).not.toEqual(b);
  });

  it("set/get roundtrips metadata", async () => {
    const cache = new AssetCache({ rootDir: freshTmp() });
    await cache.init();
    const key = "abc123";
    await cache.set(key, { path: "/tmp/x.bin", sha256: "abc", bytes: 10, provider: "rodin", cost_usd: 0.35, cached_at: Date.now() });
    const hit = await cache.get(key);
    expect(hit?.sha256).toBe("abc");
  });

  it("miss returns null", async () => {
    const cache = new AssetCache({ rootDir: freshTmp() });
    await cache.init();
    expect(await cache.get("nope")).toBeNull();
  });

  it("close() is idempotent", async () => {
    const cache = new AssetCache({ rootDir: freshTmp() });
    await cache.init();
    await expect(cache.close()).resolves.not.toThrow();
    await expect(cache.close()).resolves.not.toThrow();
  });
});
