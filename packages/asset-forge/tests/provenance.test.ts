import { describe, it, expect, beforeEach } from "vitest";
import { rmSync, mkdirSync, readFileSync, existsSync } from "fs";
import { ProvenanceWriter } from "../src/provenance.js";

const TMP = "/tmp/genorah-prov-test";

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
});

describe("ProvenanceWriter", () => {
  it("creates a fresh manifest when none exists", async () => {
    const w = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    await w.append({
      path: "public/assets/hero.glb",
      sha256: "abc",
      bytes: 1234,
      provider: "rodin",
      model: "gen-2",
      seed: 42,
      prompt: "stone bust",
      reference_hashes: [],
      cost_usd: 0.35,
      duration_ms: 90_000,
      cache_hit: false,
      dna_compliance_pass: true
    });
    expect(existsSync(`${TMP}/MANIFEST.json`)).toBe(true);
    const m = JSON.parse(readFileSync(`${TMP}/MANIFEST.json`, "utf8"));
    expect(m.entries).toHaveLength(1);
    expect(m.entries[0].provider).toBe("rodin");
  });

  it("dedupes by sha256 when re-appended", async () => {
    const w = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    const entry = { path: "public/assets/x.jpg", sha256: "s1", bytes: 10, provider: "flux-kontext", seed: 1, prompt: "x", reference_hashes: [], cost_usd: 0.05, duration_ms: 5000, cache_hit: false, dna_compliance_pass: true };
    await w.append(entry); await w.append(entry);
    const m = JSON.parse(readFileSync(`${TMP}/MANIFEST.json`, "utf8"));
    expect(m.entries).toHaveLength(1);
  });

  it("preserves parent_sha256 for derivative assets", async () => {
    const w = new ProvenanceWriter({ path: `${TMP}/MANIFEST.json` });
    await w.append({ path: "a.jpg", sha256: "parent", bytes: 10, provider: "flux-kontext", prompt: "parent", reference_hashes: [], cost_usd: 0.05, duration_ms: 1000, cache_hit: false, dna_compliance_pass: true });
    await w.append({ path: "a-up.jpg", sha256: "child", bytes: 40, provider: "upscaler", prompt: "2x", reference_hashes: [], cost_usd: 0, duration_ms: 2000, cache_hit: false, dna_compliance_pass: true, parent_sha256: "parent" });
    const m = JSON.parse(readFileSync(`${TMP}/MANIFEST.json`, "utf8"));
    expect(m.entries.find((e: { sha256: string }) => e.sha256 === "child").parent_sha256).toBe("parent");
  });
});
