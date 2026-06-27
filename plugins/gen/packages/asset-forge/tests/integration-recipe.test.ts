import { describe, it, expect, afterEach } from "vitest";
import { mkdirSync } from "fs";
import { join } from "path";
import { readFileSync } from "fs";
import { AssetCache, CostLedger, ProvenanceWriter, executeRecipe, DummyProvider } from "../src/index.js";
import { parse } from "yaml";

const BASE_TMP = "/tmp/genorah-recipe-e2e";
let _counter = 0;
function freshTmp(): string {
  const dir = join(BASE_TMP, String(++_counter));
  mkdirSync(dir, { recursive: true });
  return dir;
}

let _cacheToClose: AssetCache | null = null;
afterEach(async () => {
  if (_cacheToClose) { await _cacheToClose.close(); _cacheToClose = null; }
});

describe("recipe E2E", () => {
  it("brand-marks runs 3 steps with cache + ledger + provenance", async () => {
    const tmp = freshTmp();
    const cache = new AssetCache({ rootDir: `${tmp}/cache` });
    _cacheToClose = cache;
    await cache.init();
    const ledger = new CostLedger({ budget_usd: 5 });
    const prov = new ProvenanceWriter({ path: `${tmp}/MANIFEST.json` });
    const dummy = new DummyProvider();
    const recipe = parse(readFileSync("../../recipes/brand-marks.yml", "utf8"));

    const dispatch = async (_worker: string, input: Record<string, unknown>) => {
      const r = await dummy.generate({ prompt: (input["prompt"] as string) ?? "" });
      ledger.record({ provider: r.provider, cost_usd: r.cost_usd });
      await prov.append({
        path: r.path, sha256: r.sha256, bytes: r.bytes,
        provider: r.provider, prompt: r.input.prompt,
        reference_hashes: [], cost_usd: r.cost_usd, duration_ms: r.duration_ms,
        cache_hit: false, dna_compliance_pass: true
      });
      return { schema_version: "4.0.0" as const, status: "ok" as const, artifact: r, verdicts: [], followups: [] };
    };

    const result = await executeRecipe({ recipe, dispatch });
    expect(result.status).toBe("ok");
    expect(result.envelopes).toHaveLength(3);
    expect(ledger.spend_usd).toBe(0);
  });
});
