import { describe, it, expect } from "vitest";
import { synthesizeArchetype } from "../src/archetypeSynthesizer.js";

describe("synthesizeArchetype", () => {
  it("produces a DNA preset from a mine report + seed templates", () => {
    const archetype = synthesizeArchetype({
      slug: "custom-editorial-x",
      mine: { references: ["a","b"], palette: ["#0f0e12","#f5b85c","#e6e1d6"], embeddings: [], combined_embedding: [0,0,0,0], motifs: [] },
      seed_templates: ["editorial", "cinematic-3d"],
      blend_weights: [0.7, 0.3]
    });
    expect(archetype.slug).toBe("custom-editorial-x");
    expect(archetype.dna_color_palette.primary).toBe("#0f0e12");
    expect(archetype.tier).toBe("generative");
    expect(archetype.seed_templates).toEqual(["editorial", "cinematic-3d"]);
  });

  it("throws when blend_weights length mismatches seed_templates", () => {
    expect(() => synthesizeArchetype({
      slug: "x",
      mine: { references: [], palette: ["#000"], embeddings: [], combined_embedding: [], motifs: [] },
      seed_templates: ["a","b"],
      blend_weights: [1]
    })).toThrow(/mismatch/i);
  });
});
