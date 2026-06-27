import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import { RecipeSchema } from "../src/schemas/recipe.schema.js";

describe("canonical recipes", () => {
  const dir = "../../recipes";
  for (const f of readdirSync(dir).filter(n => n.endsWith(".yml"))) {
    it(`${f} validates against RecipeSchema`, () => {
      const body = parse(readFileSync(join(dir, f), "utf8"));
      expect(() => RecipeSchema.parse(body)).not.toThrow();
    });
  }
});
