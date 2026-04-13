import { describe, it, expect, vi } from "vitest";
import { ReferenceMiner } from "../src/referenceMiner.js";

describe("ReferenceMiner", () => {
  it("mines palette + motifs + typography hints from references", async () => {
    const miner = new ReferenceMiner({
      embeddingProvider: {
        embed: vi.fn(async () => [0.1, 0.2, 0.3, 0.4])
      },
      paletteProvider: {
        extractPalette: vi.fn(async () => ["#0f0e12", "#f5b85c", "#e6e1d6"])
      }
    });
    const report = await miner.mine(["/tmp/ref1.jpg", "/tmp/ref2.jpg"]);
    expect(report.palette).toEqual(["#0f0e12", "#f5b85c", "#e6e1d6"]);
    expect(report.embeddings).toHaveLength(2);
    expect(report.combined_embedding).toHaveLength(4);
  });

  it("averages embeddings correctly", async () => {
    const miner = new ReferenceMiner({
      embeddingProvider: {
        embed: vi.fn()
          .mockResolvedValueOnce([1, 0])
          .mockResolvedValueOnce([0, 1])
      },
      paletteProvider: { extractPalette: vi.fn(async () => ["#fff"]) }
    });
    const report = await miner.mine(["/a.jpg", "/b.jpg"]);
    expect(report.combined_embedding).toEqual([0.5, 0.5]);
  });
});
