import { describe, it, expect } from "vitest";
import { z } from "zod";
import { generateShape, editShape } from "../src/schemas.js";

const gen = z.object(generateShape);
const edit = z.object(editShape);

describe("generateShape", () => {
  it("applies defaults", () => {
    const v = gen.parse({ prompt: "a cat" });
    expect(v).toMatchObject({ size: "1024x1024", quality: "high", background: "auto", output_format: "png", n: 1 });
  });
  it("rejects empty prompt and bad size", () => {
    expect(() => gen.parse({ prompt: "" })).toThrow();
    expect(() => gen.parse({ prompt: "x", size: "999x999" })).toThrow();
  });
  it("caps n at 4", () => {
    expect(() => gen.parse({ prompt: "x", n: 5 })).toThrow();
  });
});

describe("editShape", () => {
  it("accepts a single path or an array, with defaults", () => {
    expect(edit.parse({ image_path: "a.png", prompt: "edit" })).toMatchObject({ input_fidelity: "high", size: "auto", quality: "high" });
    expect(edit.parse({ image_path: ["a.png", "b.png"], prompt: "edit" }).image_path).toHaveLength(2);
  });
  it("rejects missing prompt", () => {
    expect(() => edit.parse({ image_path: "a.png" })).toThrow();
  });
});
