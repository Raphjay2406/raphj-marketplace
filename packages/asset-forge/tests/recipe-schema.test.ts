import { describe, it, expect } from "vitest";
import { RecipeSchema } from "../src/schemas/recipe.schema.js";

const minimal = {
  name: "hero-scene",
  version: "1.0.0",
  steps: [
    { worker: "rodin-3d-gen", input: { prompt: "bust" } },
    { worker: "character-poser", input: { model: "${previous.artifact}", pose: "contrapposto" } }
  ],
  validators_per_step: ["dna-compliance", "license"]
};

describe("RecipeSchema", () => {
  it("accepts a minimal 2-step recipe", () => {
    expect(() => RecipeSchema.parse(minimal)).not.toThrow();
  });

  it("rejects empty steps", () => {
    expect(() => RecipeSchema.parse({ ...minimal, steps: [] })).toThrow();
  });

  it("rejects bad semver", () => {
    expect(() => RecipeSchema.parse({ ...minimal, version: "draft" })).toThrow();
  });
});
