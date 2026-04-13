import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { rmSync } from "fs";
import { UniquenessLedger } from "../src/uniquenessLedger.js";

const TMP = "/tmp/genorah-uniq.db";
let ledger: UniquenessLedger | undefined;

beforeEach(() => { try { rmSync(TMP); } catch {} });
afterEach(() => { try { ledger?.close(); } catch {} });

describe("UniquenessLedger", () => {
  it("records an embedding + returns it as nearest", async () => {
    ledger = new UniquenessLedger({ path: TMP, dims: 4 });
    await ledger.init();
    await ledger.record("sig-1", [1, 0, 0, 0], { project: "A" });
    const near = await ledger.nearest([1, 0.01, 0, 0], 1);
    expect(near[0].id).toBe("sig-1");
  });

  it("blocks registration when distance < threshold", async () => {
    ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.2 });
    await ledger.init();
    await ledger.record("sig-a", [1, 0, 0, 0], { project: "A" });
    await expect(ledger.record("sig-b", [1, 0.01, 0, 0], { project: "B" })).rejects.toThrow(/too similar/i);
  });

  it("allows registration when distance >= threshold", async () => {
    ledger = new UniquenessLedger({ path: TMP, dims: 4, minDistance: 0.2 });
    await ledger.init();
    await ledger.record("sig-a", [1, 0, 0, 0], { project: "A" });
    await ledger.record("sig-b", [0, 1, 0, 0], { project: "B" });
    const near = await ledger.nearest([1, 0, 0, 0], 2);
    expect(near).toHaveLength(2);
  });

  it("rejects embedding with wrong dimension", async () => {
    ledger = new UniquenessLedger({ path: TMP, dims: 4 });
    await ledger.init();
    await expect(ledger.record("bad", [1, 0, 0], { project: "X" })).rejects.toThrow(/dim/i);
  });
});
