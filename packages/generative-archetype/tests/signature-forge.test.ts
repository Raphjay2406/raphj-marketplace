import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { rmSync } from "fs";
import { SignatureForge } from "../src/signatureForge.js";
import { UniquenessLedger } from "../src/uniquenessLedger.js";

const TMP = "/tmp/sig-forge.db";
let ledger: UniquenessLedger | undefined;

beforeEach(() => { try { rmSync(TMP); } catch {} });
afterEach(() => { try { ledger?.close(); } catch {} });

describe("SignatureForge", () => {
  it("forges + registers in ledger when sufficiently unique", async () => {
    ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.1 });
    await ledger.init();
    const provider = { generate: vi.fn(async () => ({ path: "/tmp/x.glb", sha256: "abc", bytes: 1000 })) };
    const embedder = { embedGltf: vi.fn(async () => [0.5, 0.5, 0, 0]) };
    const forge = new SignatureForge({ ledger, provider: provider as any, embedder });
    const r = await forge.forge({ brand_essence: "apothecary minimalism", project_id: "proj-1" });
    expect(r.path).toBe("/tmp/x.glb");
    expect(provider.generate).toHaveBeenCalledOnce();
  });

  it("retries with mutated prompt on collision", async () => {
    ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.4 });
    await ledger.init();
    await ledger.record("taken", [1, 0, 0, 0], {});
    const provider = { generate: vi.fn(async () => ({ path: "/tmp/new.glb", sha256: "d", bytes: 1000 })) };
    let call = 0;
    const embedder = { embedGltf: vi.fn(async () => call++ === 0 ? [1, 0.01, 0, 0] : [0.1, 0.9, 0, 0]) };
    const forge = new SignatureForge({ ledger, provider: provider as any, embedder, maxAttempts: 3 });
    const r = await forge.forge({ brand_essence: "e", project_id: "p" });
    expect(provider.generate).toHaveBeenCalledTimes(2);
    expect(r.path).toBe("/tmp/new.glb");
  });
});
